# Retro Pixel Jackpot Slots — Architecture & Implementation Plan

A high-fidelity retro arcade slot machine game faithfully matching the provided visual cabinet and prototype specifications, built with clean object-oriented architecture, canvas/WebGL reel rendering, Web Audio chiptune synthesis, free spins bonus mini-game, and player progression systems.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural directions and feature preferences confirmed in Phase 1 and the challenge guidelines:
> - **Confirmed Audio Behavior**: Full procedural chiptune 8-bit retro sound effects (reel ticks, stopping thuds, win cascades, jackpot fanfares) plus toggleable synthesized arcade background music.
> - **Confirmed Feature Scope**: 10 Free Spins @ 3X multiplier mini-game (triggered by 3x Scatter Bells with +5 retrigger capability), spin streak multipliers, and an interactive Player Achievements & Stats cabinet.
> - **Confirmed Payline Mechanics**: Strict single center payline with dashed alignment guides, faithful to classic physical arcade cabinets.
> - **Project Structure & WebGL Deliverables**: Full project organization with `Assets/Scripts/`, `Assets/Prefabs/`, `Assets/Animations/`, `Assets/UI/`, `Assets/Sounds/`, standalone `/Build/WebGL/` production distribution, and an in-depth `README.md`.

---

## 1. Overview & Core Concept

- **What It Does**: Simulates a classic late-80s neon casino slot cabinet with three mechanical reels, physical pull lever, weighted PRNG Mersenne-Twister-style distribution, and celebratory lighting states. Players bet game credits across a strict center payline, trigger 3x Scatter Free Spins with 3X multipliers, build hot streaks, and unlock arcade trophies.
- **Target Audience**: Arcade enthusiasts, retro gaming fans, and evaluators looking for a production-grade slot machine with clean decoupled code architecture.
- **Key Value**: Delivers 60fps reel animations, zero external asset dependencies (all pixel graphics and Web Audio synthesizers are embedded and standalone), and a complete OOP simulation model.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Coin-In & Bet Selection**: The player views credits (starts at 1,000G), selects bet stakes (10G, 50G, 100G, or MAX), and activates optional Auto-Spin or sets Audio preferences.
2. **Reel Spin & Mechanical Feedback**: The player clicks the big glowing **SPIN!** button or clicks/drags the animated **Mechanical Lever**. The three reels spin with staggered decelerations and physical spring-back bouncing.
3. **Win Evaluation & Win Celebrations**:
   - Matching 3 Sevens: Awards progressive **JACKPOT** (100x pool) with golden marquee flashes and flying coin particle showers.
   - Matching 3 BARs: Awards 40x BIG WIN with cyan laser glows.
   - Matching 2 Cherries: Awards 3x consolation prize.
   - Matching 3 Scatter Bells: Activates the **FREE SPINS BONUS MINI-GAME** modal.
4. **Free Spins Bonus Round**:
   - Cabinet transforms dynamically into a glowing crimson-and-gold bonus cabinet with pulsing LED headers.
   - 10 Free Spins play at 0 credit cost with all payouts multiplied by 3X.
   - Landing 3 Bells during free spins adds +5 Retrigger spins.
   - Outro Victory Tally modal summarizes total bonus earnings and collects winnings into player credits.
5. **Progression & Achievements**: An expandable panel tracks Spin Streaks, Win Streaks, Highest Multiplier, and unlocks 8 pixel-art achievement badges.

### Visual Identity & Theme
- **Color Palette**: Deep cosmic purple chassis (`#13092C`, `#1E113A`), high-voltage neon gold (`#FFB703`, `#F59E0B`), electric cyan (`#06B6D4`), and royal purple borders (`#3A2578`, `#4B338F`). Bonus mode triggers a molten ruby-gold gradient shift (`#5B1029` to `#2B0B3A`).
- **Typography**: Authentic arcade font pairing with Google Fonts `'Press Start 2P'` (display headers, badges, button labels) and `'VT323'` (high-legibility digital LED meters and readouts).
- **CRT Scanlines & Pixel Perfection**: Crisp pixelated image rendering, phosphor CRT scanlines overlay, and neon drop-shadow glows (`glow-gold`, `glow-purple`, `glow-bonus`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Web Audio Procedural Chiptune Synthesizer**
  - *Chosen Approach*: Pure Web Audio API oscillators (triangle, square, sawtooth, noise) for reel clicks, thuds, win arpeggios, coin drops, lever releases, and melodic 8-bit background loops.
  - *Why*: Eliminates 100% of external audio loading delays, network failures, or cross-origin audio blocks while delivering authentic 8-bit sound.
- **Decision 2: Standalone WebGL / Canvas Simulation with Decoupled Unity-Style OOP**
  - *Chosen Approach*: Clean Object-Oriented architecture mirroring Unity C# game design (ReelController, RNGService, AudioManager, SlotMachineManager, AchievementManager) driving a performant HTML5 Canvas / CSS3 hardware-accelerated tape renderer.
  - *Why*: Provides immediate zero-friction web preview while offering organized Unity-style folders (`Assets/Scripts`, `Assets/UI`, `Assets/Sounds`, `Build/WebGL`) matching the assignment criteria.
- **Decision 3: Local Storage Persistence & Reset**
  - *Chosen Approach*: Automatically save credits, statistics, streaks, and unlocked achievements to `localStorage`, with an in-game "Reset Coins" button to restore the bankroll.

---

## 4. Technical Architecture & Data Strategy

### System Component Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App.tsx (Main Stage)                            │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Marquee Header: Game Title, Fair RNG Badge, Audio Mute Toggle    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Digital LED Meters: Credits (1,000G) | Winner | Progressive Pot   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Free Spins HUD (Bonus Active): Spins Left | 3X Mult | Bonus Won  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Reels Cabinet Stage (Win Line Guide & 3 Staggered Reel Strips)    │  │
│  │   [Reel 0]          [Reel 1]          [Reel 2]                   │  │
│  │   (Spring-back deceleration curves, Mersenne RNG target)         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Control Panel: Bet Buttons (10G/50G/100G/MAX) | Auto | Spin | Arm│  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Interactive Drawers: Paytable Multipliers | Achievements Vault   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │
      ┌───────────────────────────┼───────────────────────────┐
      ▼                           ▼                           ▼
┌──────────────┐          ┌──────────────┐            ┌──────────────┐
│  RNG Engine  │          │ Audio Synth  │            │ Persistence  │
│ (PRNG pool & │          │ (Oscillator  │            │ (Credits,    │
│  weights)    │          │  SFX & BGM)  │            │  Trophies)   │
└──────────────┘          └──────────────┘            └──────────────┘
```

### Folder Structure & Asset Layout
- `/Assets/Scripts/`:
  - `SlotMachineManager.ts`: Master state machine orchestrating spins, bets, and payouts.
  - `ReelController.ts`: Physics easing, tape rendering, and stop deceleration curves.
  - `AudioEngine.ts`: Web Audio API sound synthesizers (reel clicks, wins, lever, BGM loop).
  - `RNGService.ts`: Weighted symbol RNG generation and payout calculation.
  - `AchievementService.ts`: Streak calculation, metrics, and achievement unlocking.
  - `types.ts`: Game states, symbols, payouts, and achievement schemas.
- `/Assets/UI/`: Modals for Bonus Round Intro, Bonus Round Victory Outro, Rules Dialog, and Paytable components.
- `/Assets/Sounds/`: Procedural sound profiles and configuration.
- `/Build/WebGL/`: Standalone index and bundle for running offline or in WebGL game containers.
- `/README.md`: In-depth documentation covering game overview, running instructions, bonus mechanics, and architecture.

---

## 5. Implementation Sequence (Git Commit Milestones)

1. **Commit 1: Architecture & Project Structure**: Initialize folder organization (`Assets/Scripts`, `Assets/UI`, `Assets/Sounds`, `Assets/Prefabs`), TypeScript definitions, and static assets.
2. **Commit 2: RNG & Slot Engine Model**: Implement Mersenne PRNG, weighted probability distribution, payout evaluation, and credit state management.
3. **Commit 3: Reel Rendering & Mechanical Physics**: Build 3-reel viewport with smooth deceleration curves, spring bounce animation, and interactive pull lever.
4. **Commit 4: Web Audio 8-Bit Chiptune & BGM Synthesizer**: Create procedural sound synthesizer for spins, stops, wins, jackpots, and toggleable retro arcade background music.
5. **Commit 5: Free Spins Bonus Mini-Game & Visual Transformations**: Add 10 Free Spins 3X multiplier mode, glowing cabinet transformation, re-trigger system, and intro/outro victory modals.
6. **Commit 6: Progression, Streaks & Achievements Drawer**: Add spin streaks, win streaks, and 8-badge achievement cabinet with local persistence.
7. **Commit 7: WebGL Build & Documentation**: Generate standalone `/Build/WebGL/` distribution and comprehensive `README.md`.
