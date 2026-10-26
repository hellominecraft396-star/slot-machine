import { RNGService } from './RNGService';
import { AudioEngine } from './AudioEngine';
import { ReelController } from './ReelController';
import { AchievementService } from './AchievementService';
import { BetAmount, FreeSpinsState, SpinResult, SymbolDefinition } from './types';

export class SlotMachineManager {
  public rng: RNGService;
  public audio: AudioEngine;
  public achievements: AchievementService;
  public reels: [ReelController, ReelController, ReelController];

  public credits: number = 1000;
  public currentBet: number = 10;
  public betLevelSelection: BetAmount = 10;
  public jackpotPool: number = 5000;
  public lastWinner: number = 0;
  public isGameRunning: boolean = false;
  public isAutoSpin: boolean = false;
  public statusMessage: string = 'SELECT BET & PRESS SPIN OR PULL LEVER!';
  public isStatusWin: boolean = false;
  public isJackpotActive: boolean = false;

  public freeSpinsState: FreeSpinsState = {
    isActive: false,
    totalSpins: 10,
    spinsRemaining: 0,
    multiplier: 3,
    accumulatedWinnings: 0,
    triggerBet: 10
  };

  private onStateChangeCallback: (() => void) | null = null;
  private onBonusIntroCallback: (() => void) | null = null;
  private onBonusOutroCallback: (() => void) | null = null;

  constructor() {
    this.rng = new RNGService();
    this.audio = AudioEngine.getInstance();
    this.achievements = AchievementService.getInstance();
    this.reels = [
      new ReelController(0, this.rng),
      new ReelController(1, this.rng),
      new ReelController(2, this.rng)
    ];

    this.loadState();
  }

  private loadState(): void {
    try {
      const savedCredits = localStorage.getItem('pixel_slots_credits');
      if (savedCredits) {
        this.credits = Math.max(10, parseInt(savedCredits, 10));
      }
      const savedJackpot = localStorage.getItem('pixel_slots_jackpot');
      if (savedJackpot) {
        this.jackpotPool = Math.max(5000, parseInt(savedJackpot, 10));
      }
    } catch {
      // Default initial values
    }
  }

  public saveState(): void {
    try {
      localStorage.setItem('pixel_slots_credits', this.credits.toString());
      localStorage.setItem('pixel_slots_jackpot', this.jackpotPool.toString());
    } catch {
      // Ignore
    }
  }

  public setCallbacks(
    onStateChange: () => void,
    onBonusIntro: () => void,
    onBonusOutro: () => void
  ): void {
    this.onStateChangeCallback = onStateChange;
    this.onBonusIntroCallback = onBonusIntro;
    this.onBonusOutroCallback = onBonusOutro;
  }

  private notify(): void {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback();
    }
  }

  public setBet(val: BetAmount): void {
    if (this.isGameRunning || this.freeSpinsState.isActive) return;
    this.audio.init();
    this.audio.playTick();

    this.betLevelSelection = val;
    if (val === 'max') {
      this.currentBet = 100;
    } else {
      this.currentBet = val;
    }

    this.statusMessage = `BET SET TO ${this.currentBet}G`;
    this.isStatusWin = false;
    this.notify();
  }

  public toggleAutoSpin(): void {
    if (this.freeSpinsState.isActive) return;
    this.audio.init();
    this.isAutoSpin = !this.isAutoSpin;
    if (this.isAutoSpin && !this.isGameRunning) {
      this.startSpin();
    }
    this.notify();
  }

  public async startSpin(): Promise<void> {
    if (this.isGameRunning) return;
    this.audio.init();

    const inBonus = this.freeSpinsState.isActive;
    const activeBet = inBonus ? this.freeSpinsState.triggerBet : this.currentBet;

    if (!inBonus) {
      if (this.credits < this.currentBet) {
        this.statusMessage = 'NOT ENOUGH CREDITS! RESET COINS BELOW!';
        this.isStatusWin = false;
        if (this.isAutoSpin) this.isAutoSpin = false;
        this.notify();
        return;
      }
      this.credits -= this.currentBet;
      this.jackpotPool += Math.floor(this.currentBet * 0.1);
    } else {
      this.freeSpinsState.spinsRemaining--;
    }

    this.isGameRunning = true;
    this.isJackpotActive = false;
    this.lastWinner = 0;
    this.statusMessage = inBonus
      ? `⭐ BONUS SPIN (${this.freeSpinsState.totalSpins - this.freeSpinsState.spinsRemaining}/${this.freeSpinsState.totalSpins}) - 3X MULTIPLIER! ⭐`
      : 'SPINNING REELS... GOOD LUCK!';
    this.isStatusWin = false;
    this.notify();

    // Generate outcome
    const targetSymbols = this.rng.generateSpinOutcome(inBonus);

    // Run staggered spin animations
    const spinPromises = this.reels.map((reel, idx) => {
      const duration = 1200 + idx * 400;
      return reel.spin(
        duration,
        targetSymbols[idx],
        () => this.audio.playTick(),
        () => this.audio.playStop(),
        () => this.notify()
      );
    });

    await Promise.all(spinPromises);
    this.handleSpinCompleted(targetSymbols, activeBet, inBonus);
  }

  private handleSpinCompleted(
    targetSymbols: [SymbolDefinition, SymbolDefinition, SymbolDefinition],
    activeBet: number,
    inBonus: boolean
  ): void {
    this.isGameRunning = false;

    const evaluation: SpinResult = this.rng.evaluateSpin(
      targetSymbols,
      activeBet,
      inBonus,
      this.freeSpinsState.multiplier,
      this.jackpotPool
    );

    this.lastWinner = evaluation.payout;
    this.statusMessage = evaluation.message;
    this.isStatusWin = evaluation.isWin;

    // Track achievements and stats
    this.achievements.recordSpin(
      activeBet,
      evaluation.isWin,
      evaluation.payout,
      evaluation.winType,
      inBonus
    );

    if (evaluation.isWin) {
      if (evaluation.winType === 'seven_jackpot') {
        this.isJackpotActive = true;
        this.jackpotPool = 5000;
        this.audio.playWin('jackpot');
        this.spawnCoinShower(true);
      } else if (evaluation.winType === 'bells_scatter') {
        this.audio.playWin('bonus');
        this.spawnCoinShower(true);
      } else if (evaluation.winType === 'bar_bigwin') {
        this.audio.playWin('big');
        this.spawnCoinShower(false);
      } else {
        this.audio.playWin('mid');
      }

      if (inBonus) {
        this.freeSpinsState.accumulatedWinnings += evaluation.payout;
        if (evaluation.isFreeSpinsRetrigger) {
          this.freeSpinsState.spinsRemaining += 5;
          this.freeSpinsState.totalSpins += 5;
        }
      } else {
        this.credits += evaluation.payout;
      }
    }

    this.saveState();
    this.notify();

    // Check if new Free Spins Bonus round was triggered
    if (evaluation.isFreeSpinsTrigger) {
      setTimeout(() => {
        if (this.onBonusIntroCallback) {
          this.onBonusIntroCallback();
        }
      }, 1000);
      return;
    }

    // If currently inside Free Spins
    if (inBonus) {
      if (this.freeSpinsState.spinsRemaining > 0) {
        setTimeout(() => {
          if (this.freeSpinsState.isActive && !this.isGameRunning) {
            this.startSpin();
          }
        }, 1200);
      } else {
        // Conclude Free Spins round
        setTimeout(() => {
          if (this.onBonusOutroCallback) {
            this.onBonusOutroCallback();
          }
        }, 900);
      }
      return;
    }

    // Auto Spin continuation
    if (this.isAutoSpin) {
      if (this.credits >= this.currentBet) {
        setTimeout(() => {
          if (this.isAutoSpin && !this.isGameRunning) {
            this.startSpin();
          }
        }, 1200);
      } else {
        this.isAutoSpin = false;
        this.statusMessage = 'AUTO SPINS STOPPED: INSUFFICIENT CREDITS';
        this.notify();
      }
    }
  }

  public activateFreeSpinsSession(): void {
    this.freeSpinsState = {
      isActive: true,
      totalSpins: 10,
      spinsRemaining: 10,
      multiplier: 3,
      accumulatedWinnings: 0,
      triggerBet: this.currentBet
    };
    this.audio.playFanfare();
    this.statusMessage = 'BONUS ROUND ACTIVATED! COMMENCING 10 FREE SPINS!';
    this.notify();

    setTimeout(() => {
      this.startSpin();
    }, 700);
  }

  public collectBonusWinnings(): void {
    this.audio.playWin('jackpot');
    this.credits += this.freeSpinsState.accumulatedWinnings;
    const collected = this.freeSpinsState.accumulatedWinnings;

    this.freeSpinsState.isActive = false;
    this.statusMessage = `BONUS COLLECTED! +${collected.toLocaleString()}G ADDED TO CREDITS!`;
    this.isStatusWin = true;
    this.saveState();
    this.notify();
  }

  public resetCredits(): void {
    if (this.freeSpinsState.isActive || this.isGameRunning) return;
    this.audio.init();
    this.audio.playWin('mid');
    this.credits = 1000;
    this.statusMessage = 'BANKROLL RESTORED TO 1,000G!';
    this.isStatusWin = true;
    this.saveState();
    this.notify();
  }

  public spawnCoinShower(isJackpot: boolean): void {
    const count = isJackpot ? 32 : 16;
    for (let i = 0; i < count; i++) {
      const coin = document.createElement('div');
      coin.className = 'coin-particle';
      coin.textContent = isJackpot ? '⭐' : '🪙';
      coin.style.left = `${20 + Math.random() * 60}%`;
      coin.style.top = '35%';
      coin.style.setProperty('--dx', `${(Math.random() - 0.5) * 260}px`);
      coin.style.setProperty('--dx2', `${(Math.random() - 0.5) * 380}px`);
      document.body.appendChild(coin);
      setTimeout(() => coin.remove(), 1200);
    }
  }
}
