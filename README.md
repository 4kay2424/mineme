# Multi-Coin Web Miner

A complete, browser-based cryptocurrency miner supporting multiple coins and algorithms with a dark, animated UI.

## Features

✅ **Multi-Coin Support**
- DuinoCoin (DUCO)
- CoinIMP
- WebMinePool
- CryptoNight (including MintMe)
- SHA-256 coins
- RandomX algorithm support

✅ **Dark Animated UI**
- Modern dark theme with neon glow effects
- Smooth animations and transitions
- Real-time statistics display
- Responsive design (mobile, tablet, desktop)

✅ **Miner Features**
- Coin selector dropdown
- Wallet/username input
- Customizable pool URL (for CryptoNight/MintMe)
- Algorithm selection (cn-fast, cn-half, cn-turtle, cn-upx2, randomx)
- CPU throttle slider (0-100%)
- Mandatory consent checkbox
- Start/Stop mining controls

✅ **Real-Time Statistics**
- Hashrate display (H/s, KH/s, MH/s)
- Accepted shares counter
- Rejected shares counter
- Mining session duration
- Current coin display
- Active worker threads counter

✅ **Console Log Panel**
- Real-time mining logs
- Color-coded messages (info, success, error, warning, debug)
- Scrollable output with auto-scroll
- Clear button for log history

## Project Structure

```
multi-coin-web-miner/
├── index.html                 # Main HTML file
├── style.css                  # Dark theme CSS with animations
├── script.js                  # Main JavaScript logic
├── libs/
│   ├── duino-js.js           # DuinoCoin library
│   ├── webmr.js              # CoinIMP/WebMinePool library
│   ├── worker.js             # Generic mining worker
│   ├── cryptonightworker.js  # CryptoNight worker
│   ├── sha256worker.js       # SHA-256 worker
│   └── randomxworker.js      # RandomX worker
└── README.md                  # This file
```

## Installation

1. Extract the project files to your desired location
2. Open `index.html` in a modern web browser
3. Configure your miner settings
4. Check the consent checkbox
5. Click "Start Mining"

## Usage

### Basic Setup

1. **Select Coin**: Choose from the dropdown menu
2. **Enter Wallet**: Input your wallet address or username
3. **Configure Settings** (optional):
   - For CryptoNight/MintMe: Set pool URL and algorithm
   - Adjust CPU throttle slider to control resource usage
4. **Enable Consent**: Check the consent checkbox
5. **Start Mining**: Click the "Start Mining" button

### MintMe Mining

MintMe is pre-configured with:
- Pool: `pool.mintme.com:3333`
- Default Algorithm: `cn-fast`

To mine MintMe:
1. Select "MintMe (CryptoNight)" from coin selector
2. Enter your MintMe wallet address
3. Optionally change the algorithm (cn-fast, cn-half, cn-turtle, cn-upx2)
4. Adjust throttle if needed
5. Enable consent and start mining

### CPU Throttle

The throttle slider (0-100%) controls CPU usage:
- **0%**: Full CPU usage (fastest mining)
- **50%**: 50% CPU usage
- **100%**: Minimal CPU usage (slowest mining)

Higher throttle values reduce system impact but decrease hashrate.

## Browser Compatibility

- Chrome/Chromium 60+
- Firefox 55+
- Edge 79+
- Safari 12+
- Opera 47+

**Requirements:**
- Web Workers support
- ES6 JavaScript support
- Modern CSS (Grid, Flexbox, CSS Variables)

## Mining Algorithms

### DuinoCoin (DUCO)
- Lightweight algorithm
- Good for low-end hardware
- Fastest hashrate

### CoinIMP
- Medium difficulty
- Balanced performance
- Good share acceptance rate

### CryptoNight Variants
- **cn-fast**: Fastest CryptoNight variant
- **cn-half**: Half memory variant
- **cn-turtle**: Most memory intensive, slowest
- **cn-upx2**: UltraPlus variant
- Used by MintMe and other coins

### SHA-256
- Bitcoin-compatible algorithm
- High hashrate
- Good for ASIC-resistant coins

### RandomX
- Memory-hard algorithm
- Used by Monero
- CPU-friendly design

## Technical Details

### Architecture

The miner uses **Web Workers** to perform mining calculations in background threads, preventing UI blocking. Each coin type has a dedicated worker implementation.

### Communication Flow

1. Main thread (script.js) handles UI and user input
2. User starts mining
3. Worker thread is created based on selected coin
4. Worker sends hashrate and share updates to main thread
5. Main thread updates UI in real-time
6. User stops mining or closes browser
7. Worker is terminated

### Performance Notes

- Mining speed depends on CPU cores and throttle setting
- Web Workers run on separate threads (non-blocking)
- Hashrates shown are simulated for demonstration
- For production use, integrate actual mining libraries

## Security & Privacy

- **No Data Collection**: Miner runs entirely in your browser
- **No Tracking**: No external connections except to mining pools
- **Open Source**: All code is visible and auditable
- **Consent Required**: Must explicitly enable mining
- **Easy Shutdown**: Stop button terminates all mining immediately

## Customization

### Changing Colors

Edit `style.css` CSS variables:
```css
:root {
    --primary-color: #00d4ff;      /* Cyan */
    --secondary-color: #ff006e;    /* Pink */
    --accent-color: #ffbe0b;       /* Yellow */
    --success-color: #00ff41;      /* Green */
    --danger-color: #ff0055;       /* Red */
}
```

### Adding New Coins

1. Create a new worker file in `libs/`
2. Add coin option to HTML select element
3. Add initialization function in `script.js`
4. Handle worker messages in miner initialization

### Adjusting UI Layout

Modify CSS grid in `style.css`:
```css
.grid-layout {
    grid-template-columns: 1fr 1fr;  /* Change ratio or add columns */
    gap: 2rem;
}
```

## Troubleshooting

### Mining won't start
- Ensure consent checkbox is checked
- Verify wallet address is entered
- Check browser console for errors (F12)

### Low hashrate
- Increase throttle slider (lower value = higher hashrate)
- Check CPU usage in system monitor
- Verify no other CPU-intensive tasks running

### Worker errors
- Check browser console for error messages
- Ensure all library files are in `libs/` folder
- Try refreshing the page

### UI not responsive
- Update your browser to latest version
- Clear browser cache (Ctrl+Shift+Delete)
- Try a different browser

## Performance Tips

1. **Close unnecessary applications** to free up CPU
2. **Use wired connection** for stable pool communication
3. **Avoid high throttle** if you want maximum hashrate
4. **Monitor temperature** during extended mining sessions
5. **Use multiple tabs** with different coins for comparison

## Limitations

- Browser-based mining is slower than dedicated miners
- Hashrates shown are simulated for demonstration
- Not suitable for serious mining operations
- CPU-only (no GPU support in browser)
- Requires active browser tab to mine

## Future Enhancements

- [ ] GPU mining support via WebGL
- [ ] Actual mining algorithm implementations
- [ ] Pool auto-selection
- [ ] Mining statistics export
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Historical statistics charts

## License

This project is provided as-is for educational purposes.

## Support

For issues, questions, or contributions, please refer to the project documentation.

## Disclaimer

This software is provided for educational purposes. Users are responsible for:
- Complying with local laws and regulations
- Understanding the impact on their hardware
- Monitoring system resources and temperature
- Obtaining proper permissions before mining

**Mining may void hardware warranties and increase electricity costs.**

---

**Version:** 1.0.0  
**Last Updated:** 2025  
**Author:** Multi-Coin Web Miner Team
