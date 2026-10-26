import { SLOT_SYMBOLS } from '../Prefabs/ReelStripPrefab';
import { SymbolDefinition, SpinResult } from './types';

/**
 * Pseudo-Random Number Generation (PRNG) and Payout Valuation Engine
 */
export class RNGService {
  private weightedPool: SymbolDefinition[] = [];

  constructor() {
    this.buildWeightedPool();
  }

  private buildWeightedPool(): void {
    this.weightedPool = [];
    SLOT_SYMBOLS.forEach((sym) => {
      for (let i = 0; i < sym.weight; i++) {
        this.weightedPool.push(sym);
      }
    });
  }

  public getRandomSymbol(): SymbolDefinition {
    const idx = Math.floor(Math.random() * this.weightedPool.length);
    return this.weightedPool[idx];
  }

  public generateSpinOutcome(isFreeSpins: boolean): [SymbolDefinition, SymbolDefinition, SymbolDefinition] {
    const roll = Math.random();

    // 10% excitement boost outside bonus to trigger 3x Scatters
    if (!isFreeSpins && roll < 0.1) {
      const bell = SLOT_SYMBOLS.find((s) => s.id === 'bell')!;
      return [bell, bell, bell];
    }

    // 8% chance to trigger matching triple
    if (roll < 0.18) {
      const match = this.getRandomSymbol();
      return [match, match, match];
    }

    // 25% chance of 2 matching symbols
    if (roll < 0.43) {
      const primary = this.getRandomSymbol();
      const secondary = this.getRandomSymbol();
      return [primary, primary, secondary];
    }

    // Standard organic distribution
    return [
      this.getRandomSymbol(),
      this.getRandomSymbol(),
      this.getRandomSymbol()
    ];
  }

  public evaluateSpin(
    symbols: [SymbolDefinition, SymbolDefinition, SymbolDefinition],
    bet: number,
    isFreeSpins: boolean,
    freeSpinsMultiplier: number = 3,
    jackpotPool: number = 5000
  ): SpinResult {
    const [s0, s1, s2] = symbols;
    const mult = isFreeSpins ? freeSpinsMultiplier : 1;

    // 1. Triple Bells (3x Scatter Trigger / Retrigger)
    if (s0.id === 'bell' && s1.id === 'bell' && s2.id === 'bell') {
      const basePayout = bet * s0.payout;
      const payout = basePayout * mult;
      return {
        symbols,
        isWin: true,
        winType: 'bells_scatter',
        payout,
        multiplier: mult,
        isFreeSpinsTrigger: !isFreeSpins,
        isFreeSpinsRetrigger: isFreeSpins,
        message: isFreeSpins
          ? `🔥 RETRIGGER! +5 FREE SPINS & +${payout.toLocaleString()}G!`
          : `⭐ 3x SCATTERS! 10 FREE SPINS AWARDED! +${payout.toLocaleString()}G!`
      };
    }

    // 2. Triple Sevens (Jackpot!)
    if (s0.id === 'seven' && s1.id === 'seven' && s2.id === 'seven') {
      const payout = jackpotPool * mult;
      return {
        symbols,
        isWin: true,
        winType: 'seven_jackpot',
        payout,
        multiplier: mult,
        isFreeSpinsTrigger: false,
        isFreeSpinsRetrigger: false,
        message: `🔥 MEGA JACKPOT! 7-7-7! +${payout.toLocaleString()}G!`
      };
    }

    // 3. Triple BAR (Big Win!)
    if (s0.id === 'bar' && s1.id === 'bar' && s2.id === 'bar') {
      const basePayout = bet * s0.payout;
      const payout = basePayout * mult;
      return {
        symbols,
        isWin: true,
        winType: 'bar_bigwin',
        payout,
        multiplier: mult,
        isFreeSpinsTrigger: false,
        isFreeSpinsRetrigger: false,
        message: `★ BIG WIN! 3x TRIPLE BARS! +${payout.toLocaleString()}G${mult > 1 ? ` (${mult}X MULTIPLIER!)` : ''} ★`
      };
    }

    // 4. Triple Cherries
    if (s0.id === 'cherry' && s1.id === 'cherry' && s2.id === 'cherry') {
      const basePayout = bet * s0.payout;
      const payout = basePayout * mult;
      return {
        symbols,
        isWin: true,
        winType: 'cherry_consolation',
        payout,
        multiplier: mult,
        isFreeSpinsTrigger: false,
        isFreeSpinsRetrigger: false,
        message: `🍒 3x CHERRIES BONUS! +${payout.toLocaleString()}G${mult > 1 ? ` (${mult}X MULTIPLIER!)` : ''} 🍒`
      };
    }

    // 5. Two Cherries Consolation Prize
    if (
      (s0.id === 'cherry' && s1.id === 'cherry') ||
      (s1.id === 'cherry' && s2.id === 'cherry') ||
      (s0.id === 'cherry' && s2.id === 'cherry')
    ) {
      const basePayout = bet * 3;
      const payout = basePayout * mult;
      return {
        symbols,
        isWin: true,
        winType: 'cherry_consolation',
        payout,
        multiplier: mult,
        isFreeSpinsTrigger: false,
        isFreeSpinsRetrigger: false,
        message: `🍒 CHERRY BONUS! +${payout.toLocaleString()}G${mult > 1 ? ` (${mult}X MULTIPLIER!)` : ''} 🍒`
      };
    }

    // No win
    return {
      symbols,
      isWin: false,
      winType: 'none',
      payout: 0,
      multiplier: 1,
      isFreeSpinsTrigger: false,
      isFreeSpinsRetrigger: false,
      message: isFreeSpins ? 'NO WIN ON THIS FREE SPIN...' : 'TRY AGAIN! SPIN TO WIN!'
    };
  }
}
