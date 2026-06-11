# 🔨 Multi-Coin Web Miner - Quick Start Guide

## ⚡ Run Locally in 3 Steps

### Step 1: Clone the Repository
```bash
git clone https://github.com/4kay2424/mineme.git
cd mineme
```

### Step 2: Start a Local Server

Choose ONE option based on what you have installed:

**Option A: Python 3 (Easiest)**
```bash
python -m http.server 8000
```

**Option B: Python 2**
```bash
python -m SimpleHTTPServer 8000
```

**Option C: Node.js**
```bash
npm install -g http-server
http-server
```

**Option D: VSCode (No Terminal)**
1. Install "Live Server" extension in VSCode
2. Right-click `index.html` → "Open with Live Server"

### Step 3: Open in Browser
```
http://localhost:8000
```

---

## 🎮 How to Use

1. **Select a Coin** from the dropdown
   - DuinoCoin, CoinIMP, WebMinePool, CryptoNight, MintMe, or SHA-256

2. **Enter Your Wallet/Username**
   - This is where mining rewards go

3. **Configure (Optional)**
   - For CryptoNight/MintMe: Set pool URL and algorithm
   - Use the CPU Throttle slider (0 = max speed, 100 = idle)

4. **Check Consent Box**
   - Required to enable the Start button

5. **Click "▶️ Start Mining"**
   - Watch real-time statistics update

6. **Click "⏹️ Stop Mining"**
   - To stop the mining session

---

## 📊 What You'll See

| Stat | Description |
|------|-------------|
| **Hashrate** | Mining speed (H/s, KH/s, MH/s) |
| **Accepted Shares** | Valid work submissions |
| **Rejected Shares** | Invalid submissions |
| **Mining Time** | Session duration |
| **Current Coin** | Active mining target |
| **Worker Threads** | Active background workers |

---

## 🛠️ Troubleshooting

**Mining won't start?**
- ✅ Consent checkbox must be checked
- ✅ Wallet field must not be empty
- ✅ Browser must support Web Workers (all modern browsers do)

**"Cannot load worker" error?**
- Make sure you're using a local server (not `file://`)
- Don't open HTML directly; use `http://localhost:8000`

**Low or no hashrate?**
- Reduce throttle slider (lower = faster mining)
- Check CPU usage in Task Manager / Activity Monitor
- Try a different coin

**Port 8000 already in use?**
```bash
# Use a different port:
python -m http.server 8080
# Then visit: http://localhost:8080
```

---

## 📁 Files Included

- **index.html** - Main interface
- **style.css** - Dark theme styling
- **script.js** - Mining logic & Web Workers
- **README.md** - Full documentation

---

## ⚠️ Important Notes

- ✅ This runs **entirely in your browser** - no data sent anywhere
- ✅ **100% legal** - educational mining simulation
- ✅ **Hashrates are simulated** - for demonstration purposes
- ✅ **No actual coins mined** - real mining requires pool integration

---

## 🚀 Quick Commands

**macOS/Linux:**
```bash
git clone https://github.com/4kay2424/mineme.git && cd mineme && python -m http.server 8000
```

**Windows (PowerShell):**
```powershell
git clone https://github.com/4kay2424/mineme.git; cd mineme; python -m http.server 8000
```

Then open: `http://localhost:8000`

---

**Enjoy! ⛏️💰**
