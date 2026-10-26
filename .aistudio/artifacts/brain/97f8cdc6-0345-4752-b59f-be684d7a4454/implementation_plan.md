# Daily Mission System — Architecture & Implementation Plan

An interactive daily quest system that challenges players to hit specific symbol combinations, achieve win streaks, and complete bet goals to earn bonus credits, integrated directly into the arcade cabinet's AchievementsDrawer.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural directions and feature preferences confirmed in Phase 1:
> - **Confirmed Reward Collection**: Manual "CLAIM" button with tactile pixel feedback, Web Audio fanfare chime, and a celebratory flying coin particle shower.
> - **Confirmed Mission Allocation**: 3 balanced daily missions (Easy, Medium, Hard) plus an "ALL-CLEAR" grand bonus vault (+500G) when all 3 are completed and claimed.
> - **Confirmed Objective Variety**: Combination of symbol hits (e.g. 2x/3x Cherries, 3x BARs, 3x Bells/Scatters), spin milestones, and bet level requirements.
> - **Daily Reset & Persistence**: Automatically tracks current day timestamp in `localStorage`, generates fresh daily assignments, and offers a manual "NEW MISSIONS" refresh affordance for instant testing.

---

## 1. Overview & Core Concept

- **What It Does**: Introduces a rotating trio of daily bounty missions giving players recurring goals beyond standard spins. Players track real-time progress on every reel stop, claim tiered credit rewards upon completion, and unlock an All-Clear bounty.
- **Where It Lives**: Seamlessly integrated into `AchievementsDrawer.tsx` with a dual-tab toggle (`[MISSIONS] (3)` | `[TROPHIES] (8)`) and quick notifications in the drawer header when rewards are ready to claim.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Mission Discovery**: Player opens the "TROPHIES & MISSIONS" drawer. A glowing notification badge alerts them if missions are in progress or ready to claim.
2. **Real-Time Progress Tracking**:
   - As reels stop, progress bars and counters update in real time (e.g. `Cherries Hit: 2/3`, `Spins: 12/15`).
3. **Reward Claiming**:
   - When a mission target is reached, the status changes to a glowing animated button: `"CLAIM +250G"`.
   - Clicking triggers the Web Audio fanfare, spawns celebratory gold coins across the viewport, adds credits to the player's balance, and updates the digital LED meters.
4. **All-Clear Bonus**:
   - Once all three missions are claimed, the golden "ALL-CLEAR BONUS VAULT" unlocks, granting an extra +500G bounty.

### Visual Styling
- Matching the retro cabinet theme with `#1A0E38` card backgrounds, gold border accents, animated progress bars, and pixel icons.
- Single-line controls, tabular VT323 numbers, and WCAG AA contrast.

---

## 3. Technical Architecture & Data Strategy

### System Component Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SlotMachineManager                              │
│                                                                        │
│   ┌───────────────────────┐             ┌──────────────────────────┐   │
│   │   AchievementService  │             │   DailyMissionService    │   │
│   │   - 8 Lifetime Trophies             │   - 3 Daily Missions     │   │
│   │   - Streaks & Stats   │             │   - Daily Date & Refresh │   │
│   └───────────┬───────────┘             └────────────┬─────────────┘   │
└───────────────┼──────────────────────────────────────┼─────────────────┘
                │                                      │
                ▼                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   AchievementsDrawer.tsx                               │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Sub-Tabs: [ DAILY MISSIONS (3) ]   |   [ ARCADE TROPHIES (8) ] │   │
│   └────────────────────────────────────────────────────────────────┘   │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Mission 1 (Easy): Hit Cherries (2/3)      [ CLAIM +150G ]      │   │
│   │ Mission 2 (Medium): 3x BAR or 15 Spins    [ CLAIM +300G ]      │   │
│   │ Mission 3 (Hard): Trigger Free Spins      [ CLAIM +600G ]      │   │
│   │ All-Clear Bonus Vault (+500G)                                  │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema (`Assets/Scripts/types.ts`)
```typescript
export interface DailyMission {
  id: string;
  title: string;
  description: string;
  targetType: 'symbol_cherry' | 'symbol_bar' | 'free_spins' | 'spin_count' | 'max_bet';
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
  claimed: boolean;
  icon: string;
}

export interface DailyMissionState {
  date: string;
  missions: DailyMission[];
  allClearClaimed: boolean;
  allClearReward: number;
}
```

---

## 4. Implementation Steps

1. **Step 1: Types & DailyMissionService**:
   - Define `DailyMission` interface and create `DailyMissionService.ts` managing daily seeds, mission pools, progress tracking, and reward claims.
2. **Step 2: Slot Machine Manager Hookup**:
   - Wire spin outcomes into `DailyMissionService.recordSpin()` so symbol hits, bet levels, and free spin activations advance mission counters.
   - Expose `claimMission(id)` and `claimAllClear()` methods that trigger coin showers and audio fanfares.
3. **Step 3: Update AchievementsDrawer**:
   - Add segmented tab control (`DAILY MISSIONS` vs `ARCADE TROPHIES`) with claim indicators, real-time progress bars, claim buttons, and all-clear vault banner.
4. **Step 4: WebGL Build Sync & Documentation**:
   - Update `README.md` and commit changes with descriptive git milestones.
5. **Step 5: Verification**:
   - Run `compile_applet` and `lint_applet` to verify clean build and type safety.
