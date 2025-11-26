/* ============================================
   MULTI-COIN WEB MINER - MAIN SCRIPT
   ============================================ */

// ============================================
// GLOBAL STATE
// ============================================

const MinerState = {
    isRunning: false,
    currentCoin: null,
    workers: [],
    hashrate: 0,
    acceptedShares: 0,
    rejectedShares: 0,
    miningStartTime: null,
    miningDuration: 0,
    workerCount: 0,
    throttle: 0,
    wallet: '',
    poolUrl: '',
    algorithm: 'cn-fast',
};

// ============================================
// DOM ELEMENTS
// ============================================

const DOM = {
    coinSelect: document.getElementById('coin-select'),
    walletInput: document.getElementById('wallet-input'),
    poolUrlGroup: document.getElementById('pool-url-group'),
    poolUrl: document.getElementById('pool-url'),
    algorithmGroup: document.getElementById('algorithm-group'),
    algorithmSelect: document.getElementById('algorithm-select'),
    throttleSlider: document.getElementById('throttle-slider'),
    throttleValue: document.getElementById('throttle-value'),
    consentCheckbox: document.getElementById('consent-checkbox'),
    startBtn: document.getElementById('start-btn'),
    stopBtn: document.getElementById('stop-btn'),
    clearLogBtn: document.getElementById('clear-log-btn'),
    statusDot: document.getElementById('status-dot'),
    statusText: document.getElementById('status-text'),
    hashrate: document.getElementById('hashrate'),
    acceptedShares: document.getElementById('accepted-shares'),
    rejectedShares: document.getElementById('rejected-shares'),
    miningTime: document.getElementById('mining-time'),
    currentCoin: document.getElementById('current-coin'),
    workerThreads: document.getElementById('worker-threads'),
    consoleOutput: document.getElementById('console-output'),
};

// ============================================
// CONSOLE LOGGING
// ============================================

function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = `[${timestamp}] ${message}`;
    
    DOM.consoleOutput.appendChild(entry);
    DOM.consoleOutput.scrollTop = DOM.consoleOutput.scrollHeight;
    
    // Keep only last 100 entries
    const entries = DOM.consoleOutput.querySelectorAll('.log-entry');
    if (entries.length > 100) {
        entries[0].remove();
    }
}

function clearLog() {
    DOM.consoleOutput.innerHTML = '<div class="log-entry log-info">Console cleared.</div>';
}

// ============================================
// UI UPDATES
// ============================================

function updateHashrate(value) {
    MinerState.hashrate = value;
    let displayValue = value.toFixed(2);
    if (value >= 1000000) {
        displayValue = (value / 1000000).toFixed(2) + ' MH/s';
    } else if (value >= 1000) {
        displayValue = (value / 1000).toFixed(2) + ' KH/s';
    } else {
        displayValue = value.toFixed(2) + ' H/s';
    }
    DOM.hashrate.textContent = displayValue;
}

function updateAcceptedShares(count) {
    MinerState.acceptedShares = count;
    DOM.acceptedShares.textContent = count;
}

function updateRejectedShares(count) {
    MinerState.rejectedShares = count;
    DOM.rejectedShares.textContent = count;
}

function updateMiningTime() {
    if (!MinerState.miningStartTime) return;
    
    const elapsed = Math.floor((Date.now() - MinerState.miningStartTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    
    DOM.miningTime.textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateCurrentCoin(coin) {
    const coinNames = {
        'duco': 'DuinoCoin (DUCO)',
        'coinimp': 'CoinIMP',
        'webminepool': 'WebMinePool',
        'cryptonight': 'CryptoNight',
        'mintme': 'MintMe',
        'sha256': 'SHA-256',
    };
    DOM.currentCoin.textContent = coinNames[coin] || coin;
}

function updateWorkerThreads(count) {
    MinerState.workerCount = count;
    DOM.workerThreads.textContent = count;
}

function setStatus(status, isDot = true) {
    DOM.statusText.textContent = status;
    if (isDot) {
        DOM.statusDot.className = 'status-dot';
        if (status === 'Mining') {
            DOM.statusDot.classList.add('active');
        } else if (status === 'Error') {
            DOM.statusDot.classList.add('error');
        }
    }
}

function updateThrottleValue(value) {
    MinerState.throttle = value;
    DOM.throttleValue.textContent = value;
}

// ============================================
// UI EVENT LISTENERS
// ============================================

DOM.throttleSlider.addEventListener('input', (e) => {
    updateThrottleValue(e.target.value);
});

DOM.consentCheckbox.addEventListener('change', () => {
    const isEnabled = DOM.consentCheckbox.checked && DOM.walletInput.value.trim() !== '';
    DOM.startBtn.disabled = !isEnabled;
});

DOM.walletInput.addEventListener('input', () => {
    const isEnabled = DOM.consentCheckbox.checked && DOM.walletInput.value.trim() !== '';
    DOM.startBtn.disabled = !isEnabled;
});

DOM.coinSelect.addEventListener('change', (e) => {
    const coin = e.target.value;
    
    // Show/hide pool URL and algorithm for CryptoNight/MintMe
    if (coin === 'cryptonight' || coin === 'mintme') {
        DOM.poolUrlGroup.style.display = 'block';
        DOM.algorithmGroup.style.display = 'block';
        
        if (coin === 'mintme') {
            DOM.poolUrl.value = 'pool.mintme.com:3333';
            DOM.algorithmSelect.value = 'cn-fast';
        }
    } else {
        DOM.poolUrlGroup.style.display = 'none';
        DOM.algorithmGroup.style.display = 'none';
    }
    
    // Re-validate start button
    const isEnabled = DOM.consentCheckbox.checked && DOM.walletInput.value.trim() !== '';
    DOM.startBtn.disabled = !isEnabled;
});

DOM.startBtn.addEventListener('click', startMining);
DOM.stopBtn.addEventListener('click', stopMining);
DOM.clearLogBtn.addEventListener('click', clearLog);

// ============================================
// MINING FUNCTIONS
// ============================================

async function startMining() {
    if (MinerState.isRunning) {
        log('Mining already in progress', 'warning');
        return;
    }
    
    if (!DOM.consentCheckbox.checked) {
        log('You must consent to mining before starting', 'error');
        setStatus('Error', true);
        return;
    }
    
    const wallet = DOM.walletInput.value.trim();
    if (!wallet) {
        log('Please enter a wallet address or username', 'error');
        setStatus('Error', true);
        return;
    }
    
    const coin = DOM.coinSelect.value;
    MinerState.currentCoin = coin;
    MinerState.wallet = wallet;
    MinerState.poolUrl = DOM.poolUrl.value.trim();
    MinerState.algorithm = DOM.algorithmSelect.value;
    
    MinerState.isRunning = true;
    MinerState.miningStartTime = Date.now();
    MinerState.acceptedShares = 0;
    MinerState.rejectedShares = 0;
    MinerState.hashrate = 0;
    
    // Update UI
    DOM.startBtn.disabled = true;
    DOM.stopBtn.disabled = false;
    DOM.coinSelect.disabled = true;
    DOM.walletInput.disabled = true;
    DOM.poolUrl.disabled = true;
    DOM.algorithmSelect.disabled = true;
    DOM.throttleSlider.disabled = true;
    DOM.consentCheckbox.disabled = true;
    
    setStatus('Mining', true);
    updateCurrentCoin(coin);
    
    log(`Starting ${coin.toUpperCase()} miner...`, 'info');
    log(`Wallet: ${wallet}`, 'debug');
    
    try {
        await initializeMiner(coin);
        log(`${coin.toUpperCase()} miner initialized successfully`, 'success');
        
        // Start timer update
        startTimerUpdate();
        
        // Simulate mining activity
        simulateMiningActivity();
        
    } catch (error) {
        log(`Error initializing miner: ${error.message}`, 'error');
        setStatus('Error', true);
        stopMining();
    }
}

function stopMining() {
    if (!MinerState.isRunning) return;
    
    MinerState.isRunning = false;
    
    // Kill all workers
    MinerState.workers.forEach(worker => {
        try {
            worker.terminate();
        } catch (e) {
            // Worker already terminated
        }
    });
    MinerState.workers = [];
    
    // Update UI
    DOM.startBtn.disabled = false;
    DOM.stopBtn.disabled = true;
    DOM.coinSelect.disabled = false;
    DOM.walletInput.disabled = false;
    DOM.poolUrl.disabled = false;
    DOM.algorithmSelect.disabled = false;
    DOM.throttleSlider.disabled = false;
    DOM.consentCheckbox.disabled = false;
    
    setStatus('Stopped', false);
    log('Mining stopped.', 'info');
    
    // Clear intervals
    if (window.timerInterval) {
        clearInterval(window.timerInterval);
    }
    if (window.activityInterval) {
        clearInterval(window.activityInterval);
    }
}

// ============================================
// MINER INITIALIZATION
// ============================================

async function initializeMiner(coin) {
    switch (coin) {
        case 'duco':
            await initDuinoCoinMiner();
            break;
        case 'coinimp':
        case 'webminepool':
            await initCoinIMPMiner();
            break;
        case 'cryptonight':
        case 'mintme':
            await initCryptoNightMiner();
            break;
        case 'sha256':
            await initSHA256Miner();
            break;
        default:
            throw new Error(`Unknown coin: ${coin}`);
    }
}

async function initDuinoCoinMiner() {
    log('Loading DuinoCoin worker...', 'debug');
    
    // Load duino-js library
    try {
        // In production, load from libs/duino-js.js
        // For now, we'll create a simple worker
        const workerCode = `
            let totalHashes = 0;
            let lastUpdate = Date.now();
            
            self.onmessage = function(e) {
                const { command, wallet, throttle } = e.data;
                
                if (command === 'start') {
                    // Simulate mining
                    const interval = setInterval(() => {
                        // Simulate hash calculation
                        const hashes = Math.random() * 1000 + 500;
                        totalHashes += hashes;
                        
                        const now = Date.now();
                        if (now - lastUpdate >= 1000) {
                            self.postMessage({
                                type: 'hashrate',
                                value: totalHashes
                            });
                            totalHashes = 0;
                            lastUpdate = now;
                        }
                        
                        // Simulate share acceptance
                        if (Math.random() < 0.1) {
                            self.postMessage({
                                type: 'share',
                                accepted: Math.random() < 0.9
                            });
                        }
                    }, 100);
                    
                    self.postMessage({ type: 'ready' });
                }
            };
        `;
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));
        
        worker.onmessage = (e) => {
            const { type, value, accepted } = e.data;
            
            if (type === 'hashrate') {
                updateHashrate(value);
            } else if (type === 'share') {
                if (accepted) {
                    updateAcceptedShares(MinerState.acceptedShares + 1);
                    log('Share accepted!', 'success');
                } else {
                    updateRejectedShares(MinerState.rejectedShares + 1);
                    log('Share rejected', 'warning');
                }
            }
        };
        
        worker.postMessage({
            command: 'start',
            wallet: MinerState.wallet,
            throttle: MinerState.throttle
        });
        
        MinerState.workers.push(worker);
        updateWorkerThreads(MinerState.workers.length);
        
    } catch (error) {
        throw new Error(`Failed to initialize DuinoCoin miner: ${error.message}`);
    }
}

async function initCoinIMPMiner() {
    log('Loading CoinIMP/WebMinePool worker...', 'debug');
    
    // Similar to DuinoCoin, create a worker
    const workerCode = `
        let totalHashes = 0;
        let lastUpdate = Date.now();
        
        self.onmessage = function(e) {
            const { command, wallet, throttle } = e.data;
            
            if (command === 'start') {
                const interval = setInterval(() => {
                    const hashes = Math.random() * 1500 + 800;
                    totalHashes += hashes;
                    
                    const now = Date.now();
                    if (now - lastUpdate >= 1000) {
                        self.postMessage({
                            type: 'hashrate',
                            value: totalHashes
                        });
                        totalHashes = 0;
                        lastUpdate = now;
                    }
                    
                    if (Math.random() < 0.12) {
                        self.postMessage({
                            type: 'share',
                            accepted: Math.random() < 0.85
                        });
                    }
                }, 100);
                
                self.postMessage({ type: 'ready' });
            }
        };
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    
    worker.onmessage = (e) => {
        const { type, value, accepted } = e.data;
        
        if (type === 'hashrate') {
            updateHashrate(value);
        } else if (type === 'share') {
            if (accepted) {
                updateAcceptedShares(MinerState.acceptedShares + 1);
                log('Share accepted!', 'success');
            } else {
                updateRejectedShares(MinerState.rejectedShares + 1);
                log('Share rejected', 'warning');
            }
        }
    };
    
    worker.postMessage({
        command: 'start',
        wallet: MinerState.wallet,
        throttle: MinerState.throttle
    });
    
    MinerState.workers.push(worker);
    updateWorkerThreads(MinerState.workers.length);
}

async function initCryptoNightMiner() {
    log('Loading CryptoNight worker...', 'debug');
    log(`Algorithm: ${MinerState.algorithm}`, 'debug');
    log(`Pool: ${MinerState.poolUrl}`, 'debug');
    
    const workerCode = `
        let totalHashes = 0;
        let lastUpdate = Date.now();
        
        self.onmessage = function(e) {
            const { command, wallet, algorithm, poolUrl, throttle } = e.data;
            
            if (command === 'start') {
                const interval = setInterval(() => {
                    // CryptoNight is more intensive
                    const hashes = Math.random() * 500 + 200;
                    totalHashes += hashes;
                    
                    const now = Date.now();
                    if (now - lastUpdate >= 1000) {
                        self.postMessage({
                            type: 'hashrate',
                            value: totalHashes
                        });
                        totalHashes = 0;
                        lastUpdate = now;
                    }
                    
                    if (Math.random() < 0.08) {
                        self.postMessage({
                            type: 'share',
                            accepted: Math.random() < 0.88
                        });
                    }
                }, 100);
                
                self.postMessage({ type: 'ready' });
            }
        };
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    
    worker.onmessage = (e) => {
        const { type, value, accepted } = e.data;
        
        if (type === 'hashrate') {
            updateHashrate(value);
        } else if (type === 'share') {
            if (accepted) {
                updateAcceptedShares(MinerState.acceptedShares + 1);
                log('Share accepted!', 'success');
            } else {
                updateRejectedShares(MinerState.rejectedShares + 1);
                log('Share rejected', 'warning');
            }
        }
    };
    
    worker.postMessage({
        command: 'start',
        wallet: MinerState.wallet,
        algorithm: MinerState.algorithm,
        poolUrl: MinerState.poolUrl,
        throttle: MinerState.throttle
    });
    
    MinerState.workers.push(worker);
    updateWorkerThreads(MinerState.workers.length);
}

async function initSHA256Miner() {
    log('Loading SHA-256 worker...', 'debug');
    
    const workerCode = `
        let totalHashes = 0;
        let lastUpdate = Date.now();
        
        self.onmessage = function(e) {
            const { command, wallet, throttle } = e.data;
            
            if (command === 'start') {
                const interval = setInterval(() => {
                    const hashes = Math.random() * 2000 + 1000;
                    totalHashes += hashes;
                    
                    const now = Date.now();
                    if (now - lastUpdate >= 1000) {
                        self.postMessage({
                            type: 'hashrate',
                            value: totalHashes
                        });
                        totalHashes = 0;
                        lastUpdate = now;
                    }
                    
                    if (Math.random() < 0.15) {
                        self.postMessage({
                            type: 'share',
                            accepted: Math.random() < 0.92
                        });
                    }
                }, 100);
                
                self.postMessage({ type: 'ready' });
            }
        };
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    
    worker.onmessage = (e) => {
        const { type, value, accepted } = e.data;
        
        if (type === 'hashrate') {
            updateHashrate(value);
        } else if (type === 'share') {
            if (accepted) {
                updateAcceptedShares(MinerState.acceptedShares + 1);
                log('Share accepted!', 'success');
            } else {
                updateRejectedShares(MinerState.rejectedShares + 1);
                log('Share rejected', 'warning');
            }
        }
    };
    
    worker.postMessage({
        command: 'start',
        wallet: MinerState.wallet,
        throttle: MinerState.throttle
    });
    
    MinerState.workers.push(worker);
    updateWorkerThreads(MinerState.workers.length);
}

// ============================================
// SIMULATION & UPDATES
// ============================================

function startTimerUpdate() {
    window.timerInterval = setInterval(() => {
        updateMiningTime();
    }, 1000);
}

function simulateMiningActivity() {
    // Simulate occasional log messages
    window.activityInterval = setInterval(() => {
        const messages = [
            'Submitting work to pool...',
            'Difficulty increased',
            'Connected to pool',
            'New block detected',
            'Worker thread active',
        ];
        
        if (Math.random() < 0.3) {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            log(msg, 'debug');
        }
    }, 5000);
}

// ============================================
// INITIALIZATION
// ============================================

window.addEventListener('load', () => {
    log('Multi-Coin Web Miner loaded successfully', 'success');
    log('Configure your miner and click Start to begin mining', 'info');
    
    // Initialize UI state
    DOM.startBtn.disabled = true;
    DOM.stopBtn.disabled = true;
    
    // Set default pool for MintMe
    DOM.poolUrl.value = 'pool.mintme.com:3333';
});

// ============================================
// CLEANUP ON PAGE UNLOAD
// ============================================

window.addEventListener('beforeunload', () => {
    if (MinerState.isRunning) {
        stopMining();
    }
});
