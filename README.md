# 🎰 Retro Pixel Jackpot Slots

A production-grade retro arcade slot machine game built with clean Object-Oriented Architecture (OOP), WebGL/Canvas reel physics simulation, Web Audio procedural 8-bit chiptune synthesis, and interactive bonus mechanics.

---

## 1. Game Overview

**Retro Pixel Jackpot Slots** replicates the authentic sights, sounds, and tactile mechanics of late-1980s casino arcade cabinets.

### Core Features
- **3-Reel Mechanical Simulation**: Three staggered spinning reels with rapid acceleration, high-speed blur, smooth cubic deceleration curves, and mechanical spring-back settling.
- **Strict Center Payline**: True single-line classic slot machine rules with red alignment guide pointers and a dashed payout zone.
- **Progressive Jackpot**: 10% of every bet accumulates into the Grand Jackpot pool. Hitting `7-7-7` awards the entire pot.
- **Authentic Pixel Art Assets**: High-resolution pixel icons for Lucky 7s, Triple BARs, Golden Bells, and Juicy Cherries.
- **Dual Sound System (Web Audio API)**:
  - Procedural 8-bit sound synthesizer generating reel ticks, mechanical stop thuds, coin showers, and victory fanfares in real-time.
  - Melodic arcade background synth music loop with quick toggle and mute controls.
- **Tactile Mechanical Lever**: Animated arcade pull-lever with pull physics and responsive sound.

---

## 2. Instructions to Run WebGL Build

The standalone WebGL distribution is located inside the `/Build/WebGL/` folder.

### Running with Any Local Static Server
You can launch the WebGL build using any lightweight static web server:

```bash
# Option A: Using npx serve
npx serve Build/WebGL -p 8080

# Option B: Using Python built-in server
cd Build/WebGL && python3 -m http.server 8080

# Option C: Using PHP built-in server
php -S localhost:8080 -t Build/WebGL
```

Once running, open `http://localhost:8080` in your web browser.

### Running the Full Development Suite
To run the React + TypeScript development server with Vite:
```bash
npm install
npm run dev
```
Open `http://localhost:3000` to interact with the full web applet.

---

## 3. Bonus Features

### ⭐ 10 Free Spins Bonus Round Mini-Game
- **Activation**: Landing **3x Scatter Bells** on the center payline triggers the **Free Spins Bonus Round**.
- **Visual Transformation**: The cabinet chassis transforms with ruby-and-gold neon gradients, flashing LED borders, and dedicated Free Spins HUD meters.
- **3X Win Multiplier**: All winning combinations during the 10 free spins are multiplied by **3X**.
- **Zero Cost**: Spins during the bonus round consume **0 credits** from your bankroll.
- **Retrigger Mechanics**: Landing 3x Bells during Free Spins awards an additional **+5 Free Spins**!
- **Victory Tally Outro**: An arcade summary modal tallies the total bonus earnings and deposits them directly into your credit balance.

### 🔥 Spin & Win Streaks
- Tracks consecutive winning rolls in real-time with visual streak multipliers and flame badges.

### 🏆 Player Achievements & Trophies Cabinet
- An expandable drawer tracking lifetime player statistics (Total Spins, Total Wins, Free Spins Triggered, Best Streak) and 8 unlockable pixel-art achievement badges:
  1. **First Coin**: Complete your first spin.
  2. **Hot Roll**: Reach a 3-spin winning streak.
  3. **Unstoppable**: Reach a 5-spin winning streak.
  4. **Free Spins Explorer**: Trigger the 10 Free Spins Bonus.
  5. **Bar Hopper**: Hit 3x Triple BARs (40x win).
  6. **Grand Jackpot**: Hit 3x Lucky 7s for the progressive jackpot.
  7. **Arcade Veteran**: Spin 100 times.
  8. **High Roller**: Place 10 MAX bets.

---

## 4. Engineering Approach & Thought Process

### Clean Object-Oriented Architecture (OOP)
Inspired by Unity C# slot machine architecture, the codebase is strictly modularized into decoupled services:

```
Assets/
├── Scripts/
│   ├── types.ts                  # Schemas for symbols, bets, outcomes, achievements
│   ├── RNGService.ts             # Weighted probability & payline valuation engine
│   ├── AudioEngine.ts            # Web Audio API singleton synthesizer & BGM loop
│   ├── ReelController.ts         # Reel strip tape physics, easing & staggered stops
│   ├── AchievementService.ts     # Streak math, statistics & trophy unlocks
│   └── SlotMachineManager.ts     # Master state machine orchestrating game loops
├── Prefabs/
│   └── ReelStripPrefab.ts        # Canonical symbol definitions & asset bindings
├── Animations/
│   └── EasingCurves.ts           # Mechanical deceleration & spring-back equations
├── UI/
│   ├── MarqueeHeader.tsx         # Top display with audio controls & fair RNG badge
│   ├── MetersDisplay.tsx         # Digital LED readouts (Credits, Winner, Jackpot)
│   ├── FreeSpinsHUD.tsx          # Bonus round progress & multiplier display
│   ├── ReelsStage.tsx            # Viewport window with center payline guide
│   ├── ControlPanel.tsx          # Bet buttons, Auto spin, and mechanical lever
│   ├── PaytableDrawer.tsx        # Collapsible multipliers card
│   ├── AchievementsDrawer.tsx    # Stats and trophy collection
│   ├── BonusIntroModal.tsx       # Free spins round fanfare modal
│   ├── BonusOutroModal.tsx       # Bonus tally collection modal
│   └── RulesModal.tsx            # In-game rules guide
└── Sounds/
    └── SoundProfiles.ts          # Frequency mappings for 8-bit chiptune synthesis
```

### Mersenne PRNG & Weighted Distribution
- Reel stops are mathematically evaluated before animations commence using a weighted RNG pool (`weights: 10, 20, 26, 36`).
- This guarantees server-authoritative and reproducible spin results, eliminating client-side animation desync.

### Zero-Asset Web Audio Synthesizer
- Rather than relying on external MP3/WAV files that can fail or get blocked by cross-origin policies, sound effects are procedurally generated via Web Audio API oscillators (`triangle`, `square`, `sawtooth`).
- Provides 100% reliability, instant playback, zero network latency, and authentic 8-bit chiptune timbre.

### CRT Scanlines & Visual Polish
- Uses CSS scanline masks, pixelated image rendering filters, and glowing neon dropshadows for a tactile retro arcade aesthetic.
