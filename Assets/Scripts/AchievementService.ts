import { Achievement, PlayerStats } from './types';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_spin',
    title: 'First Coin',
    description: 'Pull the lever or spin the reels for the first time.',
    icon: '🪙',
    unlocked: false,
    progress: 0,
    target: 1
  },
  {
    id: 'streak_3',
    title: 'Hot Roll',
    description: 'Achieve a winning streak of 3 spins in a row.',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    target: 3
  },
  {
    id: 'streak_5',
    title: 'Unstoppable',
    description: 'Achieve a winning streak of 5 spins in a row.',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    target: 5
  },
  {
    id: 'bonus_hunter',
    title: 'Free Spins Explorer',
    description: 'Trigger the 10 Free Spins Bonus round with 3x Scatters.',
    icon: '⭐',
    unlocked: false,
    progress: 0,
    target: 1
  },
  {
    id: 'bar_master',
    title: 'Bar Hopper',
    description: 'Hit 3x Triple BAR symbols for a 40x payout.',
    icon: '🎰',
    unlocked: false,
    progress: 0,
    target: 1
  },
  {
    id: 'jackpot_legend',
    title: 'Grand Jackpot',
    description: 'Land 3x Lucky 7s on the center payline!',
    icon: '👑',
    unlocked: false,
    progress: 0,
    target: 1
  },
  {
    id: 'centurion',
    title: 'Arcade Veteran',
    description: 'Complete 100 total spins on this machine.',
    icon: '🎖️',
    unlocked: false,
    progress: 0,
    target: 100
  },
  {
    id: 'high_roller',
    title: 'High Roller',
    description: 'Spin with a MAX bet (100G) 10 times.',
    icon: '💎',
    unlocked: false,
    progress: 0,
    target: 10
  }
];

export class AchievementService {
  private static instance: AchievementService | null = null;
  private achievements: Achievement[] = [];
  private stats: PlayerStats = {
    totalSpins: 0,
    totalWins: 0,
    totalBetCredits: 0,
    totalWonCredits: 0,
    currentStreak: 0,
    bestStreak: 0,
    freeSpinsTriggered: 0,
    jackpotsHit: 0
  };

  private constructor() {
    this.load();
  }

  public static getInstance(): AchievementService {
    if (!AchievementService.instance) {
      AchievementService.instance = new AchievementService();
    }
    return AchievementService.instance;
  }

  private load(): void {
    try {
      const savedStats = localStorage.getItem('pixel_slots_stats');
      if (savedStats) {
        this.stats = { ...this.stats, ...JSON.parse(savedStats) };
      }

      const savedAchievements = localStorage.getItem('pixel_slots_achievements');
      if (savedAchievements) {
        const parsed: Achievement[] = JSON.parse(savedAchievements);
        this.achievements = INITIAL_ACHIEVEMENTS.map((item) => {
          const found = parsed.find((p) => p.id === item.id);
          return found ? { ...item, ...found } : item;
        });
      } else {
        this.achievements = [...INITIAL_ACHIEVEMENTS];
      }
    } catch {
      this.achievements = [...INITIAL_ACHIEVEMENTS];
    }
  }

  public save(): void {
    try {
      localStorage.setItem('pixel_slots_stats', JSON.stringify(this.stats));
      localStorage.setItem('pixel_slots_achievements', JSON.stringify(this.achievements));
    } catch {
      // Ignore
    }
  }

  public getStats(): PlayerStats {
    return { ...this.stats };
  }

  public getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  public recordSpin(
    bet: number,
    isWin: boolean,
    payout: number,
    winType: string,
    isFreeSpin: boolean
  ): { newlyUnlocked: Achievement[] } {
    const newlyUnlocked: Achievement[] = [];

    if (!isFreeSpin) {
      this.stats.totalSpins++;
      this.stats.totalBetCredits += bet;
    }

    if (isWin) {
      this.stats.totalWins++;
      this.stats.totalWonCredits += payout;
      this.stats.currentStreak++;
      if (this.stats.currentStreak > this.stats.bestStreak) {
        this.stats.bestStreak = this.stats.currentStreak;
      }
    } else {
      this.stats.currentStreak = 0;
    }

    if (winType === 'bells_scatter') {
      this.stats.freeSpinsTriggered++;
    }
    if (winType === 'seven_jackpot') {
      this.stats.jackpotsHit++;
    }

    // Check Achievements
    this.achievements.forEach((ach) => {
      if (ach.unlocked) return;

      let targetHit = false;
      switch (ach.id) {
        case 'first_spin':
          ach.progress = this.stats.totalSpins;
          targetHit = this.stats.totalSpins >= 1;
          break;
        case 'streak_3':
          ach.progress = this.stats.currentStreak;
          targetHit = this.stats.currentStreak >= 3;
          break;
        case 'streak_5':
          ach.progress = this.stats.currentStreak;
          targetHit = this.stats.currentStreak >= 5;
          break;
        case 'bonus_hunter':
          ach.progress = this.stats.freeSpinsTriggered;
          targetHit = this.stats.freeSpinsTriggered >= 1;
          break;
        case 'bar_master':
          if (winType === 'bar_bigwin') {
            ach.progress = 1;
            targetHit = true;
          }
          break;
        case 'jackpot_legend':
          if (winType === 'seven_jackpot') {
            ach.progress = 1;
            targetHit = true;
          }
          break;
        case 'centurion':
          ach.progress = this.stats.totalSpins;
          targetHit = this.stats.totalSpins >= 100;
          break;
        case 'high_roller':
          if (bet >= 100 && !isFreeSpin) {
            ach.progress = (ach.progress || 0) + 1;
            targetHit = ach.progress >= ach.target;
          }
          break;
      }

      if (targetHit && !ach.unlocked) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toLocaleTimeString();
        newlyUnlocked.push(ach);
      }
    });

    this.save();
    return { newlyUnlocked };
  }

  public resetAll(): void {
    this.stats = {
      totalSpins: 0,
      totalWins: 0,
      totalBetCredits: 0,
      totalWonCredits: 0,
      currentStreak: 0,
      bestStreak: 0,
      freeSpinsTriggered: 0,
      jackpotsHit: 0
    };
    this.achievements = INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, progress: 0, unlocked: false }));
    this.save();
  }
}
