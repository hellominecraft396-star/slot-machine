/**
 * Core type definitions for the Retro Pixel Jackpot Slots game engine
 */

export interface SymbolDefinition {
  id: string;
  name: string;
  img: string;
  payout: number;
  weight: number;
  isScatter: boolean;
  accentColor: string;
}

export type BetAmount = 10 | 50 | 100 | 'max';

export interface SpinResult {
  symbols: [SymbolDefinition, SymbolDefinition, SymbolDefinition];
  isWin: boolean;
  winType: 'none' | 'cherry_consolation' | 'bells_scatter' | 'bar_bigwin' | 'seven_jackpot';
  payout: number;
  multiplier: number;
  isFreeSpinsTrigger: boolean;
  isFreeSpinsRetrigger: boolean;
  message: string;
}

export interface FreeSpinsState {
  isActive: boolean;
  totalSpins: number;
  spinsRemaining: number;
  multiplier: number;
  accumulatedWinnings: number;
  triggerBet: number;
}

export interface PlayerStats {
  totalSpins: number;
  totalWins: number;
  totalBetCredits: number;
  totalWonCredits: number;
  currentStreak: number;
  bestStreak: number;
  freeSpinsTriggered: number;
  jackpotsHit: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export type MissionTargetType =
  | 'cherry_hits'
  | 'bar_hits'
  | 'free_spins'
  | 'spin_count'
  | 'max_bets'
  | 'win_streak';

export interface DailyMission {
  id: string;
  tier: 'easy' | 'medium' | 'hard';
  title: string;
  description: string;
  icon: string;
  targetType: MissionTargetType;
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
  claimed: boolean;
}

export interface DailyMissionState {
  date: string;
  missions: DailyMission[];
  allClearClaimed: boolean;
  allClearReward: number;
}
