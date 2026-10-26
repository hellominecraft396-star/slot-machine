import { DailyMission, DailyMissionState, SymbolDefinition } from './types';

const EASY_MISSION_POOL: Omit<DailyMission, 'progress' | 'completed' | 'claimed'>[] = [
  {
    id: 'easy_cherry',
    tier: 'easy',
    title: 'Cherry Picker',
    description: 'Hit Cherry winning combos 2 times.',
    icon: '🍒',
    targetType: 'cherry_hits',
    target: 2,
    reward: 150
  },
  {
    id: 'easy_spins',
    tier: 'easy',
    title: 'Warm-Up Roll',
    description: 'Complete 10 total spins on the cabinet.',
    icon: '🪙',
    targetType: 'spin_count',
    target: 10,
    reward: 120
  },
  {
    id: 'easy_max',
    tier: 'easy',
    title: 'Max Bet Plunge',
    description: 'Place 2 spins at MAX bet (100G).',
    icon: '⚡',
    targetType: 'max_bets',
    target: 2,
    reward: 150
  }
];

const MEDIUM_MISSION_POOL: Omit<DailyMission, 'progress' | 'completed' | 'claimed'>[] = [
  {
    id: 'med_bar',
    tier: 'medium',
    title: 'Bar Crusher',
    description: 'Land a 3x Triple BAR winning payline.',
    icon: '🎰',
    targetType: 'bar_hits',
    target: 1,
    reward: 300
  },
  {
    id: 'med_streak',
    tier: 'medium',
    title: 'Hot Streak',
    description: 'Hit a 2-spin winning streak in a row.',
    icon: '🔥',
    targetType: 'win_streak',
    target: 2,
    reward: 250
  },
  {
    id: 'med_spins',
    tier: 'medium',
    title: 'Arcade Grinder',
    description: 'Complete 25 total spins on the cabinet.',
    icon: '🕹️',
    targetType: 'spin_count',
    target: 25,
    reward: 300
  }
];

const HARD_MISSION_POOL: Omit<DailyMission, 'progress' | 'completed' | 'claimed'>[] = [
  {
    id: 'hard_bonus',
    tier: 'hard',
    title: 'Free Spins Seeker',
    description: 'Trigger the 10 Free Spins Bonus Round!',
    icon: '⭐',
    targetType: 'free_spins',
    target: 1,
    reward: 600
  },
  {
    id: 'hard_streak',
    tier: 'hard',
    title: 'Unstoppable Roller',
    description: 'Achieve a 4-spin winning streak.',
    icon: '👑',
    targetType: 'win_streak',
    target: 4,
    reward: 500
  },
  {
    id: 'hard_max',
    tier: 'hard',
    title: 'High Roller Challenge',
    description: 'Place 8 spins at MAX bet (100G).',
    icon: '💎',
    targetType: 'max_bets',
    target: 8,
    reward: 450
  }
];

export class DailyMissionService {
  private static instance: DailyMissionService | null = null;
  private state: DailyMissionState = {
    date: '',
    missions: [],
    allClearClaimed: false,
    allClearReward: 500
  };

  private constructor() {
    this.load();
  }

  public static getInstance(): DailyMissionService {
    if (!DailyMissionService.instance) {
      DailyMissionService.instance = new DailyMissionService();
    }
    return DailyMissionService.instance;
  }

  private getTodayString(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  public generateMissions(forceDate?: string): void {
    const dateStr = forceDate || this.getTodayString();

    // Pick 1 from Easy, 1 from Medium, 1 from Hard
    const pickEasy = EASY_MISSION_POOL[Math.floor(Math.random() * EASY_MISSION_POOL.length)];
    const pickMed = MEDIUM_MISSION_POOL[Math.floor(Math.random() * MEDIUM_MISSION_POOL.length)];
    const pickHard = HARD_MISSION_POOL[Math.floor(Math.random() * HARD_MISSION_POOL.length)];

    this.state = {
      date: dateStr,
      missions: [
        { ...pickEasy, progress: 0, completed: false, claimed: false },
        { ...pickMed, progress: 0, completed: false, claimed: false },
        { ...pickHard, progress: 0, completed: false, claimed: false }
      ],
      allClearClaimed: false,
      allClearReward: 500
    };

    this.save();
  }

  private load(): void {
    try {
      const saved = localStorage.getItem('pixel_slots_daily_missions');
      const today = this.getTodayString();

      if (saved) {
        const parsed: DailyMissionState = JSON.parse(saved);
        if (parsed.date === today && parsed.missions && parsed.missions.length === 3) {
          this.state = parsed;
          return;
        }
      }
      this.generateMissions(today);
    } catch {
      this.generateMissions();
    }
  }

  public save(): void {
    try {
      localStorage.setItem('pixel_slots_daily_missions', JSON.stringify(this.state));
    } catch {
      // Ignore
    }
  }

  public getState(): DailyMissionState {
    return {
      ...this.state,
      missions: this.state.missions.map((m) => ({ ...m }))
    };
  }

  public recordSpin(
    bet: number,
    symbols: [SymbolDefinition, SymbolDefinition, SymbolDefinition],
    isWin: boolean,
    winType: string,
    isFreeSpin: boolean,
    currentStreak: number
  ): { newlyCompleted: DailyMission[] } {
    const newlyCompleted: DailyMission[] = [];

    this.state.missions.forEach((mission) => {
      if (mission.completed) return;

      switch (mission.targetType) {
        case 'spin_count':
          if (!isFreeSpin) {
            mission.progress++;
          }
          break;

        case 'max_bets':
          if (!isFreeSpin && bet >= 100) {
            mission.progress++;
          }
          break;

        case 'cherry_hits':
          if (winType === 'cherry_consolation') {
            mission.progress++;
          }
          break;

        case 'bar_hits':
          if (winType === 'bar_bigwin') {
            mission.progress++;
          }
          break;

        case 'free_spins':
          if (winType === 'bells_scatter') {
            mission.progress++;
          }
          break;

        case 'win_streak':
          mission.progress = Math.max(mission.progress, currentStreak);
          break;
      }

      if (mission.progress >= mission.target && !mission.completed) {
        mission.completed = true;
        newlyCompleted.push(mission);
      }
    });

    this.save();
    return { newlyCompleted };
  }

  public claimMission(id: string): number {
    const mission = this.state.missions.find((m) => m.id === id);
    if (!mission || !mission.completed || mission.claimed) {
      return 0;
    }

    mission.claimed = true;
    this.save();
    return mission.reward;
  }

  public canClaimAllClear(): boolean {
    const allClaimed = this.state.missions.every((m) => m.claimed);
    return allClaimed && !this.state.allClearClaimed;
  }

  public claimAllClear(): number {
    if (!this.canClaimAllClear()) return 0;
    this.state.allClearClaimed = true;
    this.save();
    return this.state.allClearReward;
  }

  public getUnclaimedCount(): number {
    const missionCount = this.state.missions.filter((m) => m.completed && !m.claimed).length;
    const allClearBonus = this.canClaimAllClear() ? 1 : 0;
    return missionCount + allClearBonus;
  }
}
