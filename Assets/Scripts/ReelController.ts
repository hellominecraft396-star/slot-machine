import { SymbolDefinition } from './types';
import { RNGService } from './RNGService';
import { easeDeceleration } from '../Animations/EasingCurves';

export const ITEM_HEIGHT = 80;

export interface ReelRenderState {
  items: SymbolDefinition[];
  offsetY: number;
  isSpinning: boolean;
}

export class ReelController {
  public index: number;
  private rng: RNGService;
  public items: SymbolDefinition[] = [];
  public currentOffsetY: number = 0;
  public isSpinning: boolean = false;
  private targetSymbol: SymbolDefinition | null = null;
  private animationFrameId: number | null = null;

  constructor(index: number, rng: RNGService) {
    this.index = index;
    this.rng = rng;
    this.initStrip();
  }

  public initStrip(): void {
    this.items = [];
    for (let i = 0; i < 20; i++) {
      this.items.push(this.rng.getRandomSymbol());
    }
    // Default resting position centered on items[1]
    this.currentOffsetY = -ITEM_HEIGHT * 2;
  }

  public spin(
    duration: number,
    targetSymbol: SymbolDefinition,
    onTick: () => void,
    onStop: () => void,
    onFrame: (offsetY: number) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      this.isSpinning = true;
      this.targetSymbol = targetSymbol;

      // Populate random symbols for high-speed scroll sequence
      const extraCount = 35 + this.index * 12; // Staggered stop for reel 0, 1, 2
      const extraSymbols: SymbolDefinition[] = [];
      for (let i = 0; i < extraCount; i++) {
        extraSymbols.push(this.rng.getRandomSymbol());
      }

      // Append target symbol with neighbor buffers so it lands dead-center on payline
      extraSymbols.push(this.rng.getRandomSymbol()); // Top neighbor
      extraSymbols.push(targetSymbol); // Exact center symbol!
      extraSymbols.push(this.rng.getRandomSymbol()); // Bottom neighbor
      extraSymbols.push(this.rng.getRandomSymbol()); // Buffer

      this.items = [...this.items.slice(-4), ...extraSymbols];

      const startY = 0;
      const targetIndex = this.items.length - 3; // Center symbol index
      const endY = -(targetIndex * ITEM_HEIGHT) + 40;
      const startTime = performance.now();
      let lastTickY = 0;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeDeceleration(progress);
        const currentY = startY + (endY - startY) * ease;

        this.currentOffsetY = currentY;
        onFrame(currentY);

        if (Math.abs(currentY - lastTickY) > ITEM_HEIGHT) {
          onTick();
          lastTickY = currentY;
        }

        if (progress < 1) {
          this.animationFrameId = requestAnimationFrame(animate);
        } else {
          onStop();
          // Subtle mechanical spring bounce
          this.currentOffsetY = endY + 6;
          onFrame(this.currentOffsetY);

          setTimeout(() => {
            this.currentOffsetY = endY;
            onFrame(this.currentOffsetY);
            this.isSpinning = false;
            resolve();
          }, 140);
        }
      };

      this.animationFrameId = requestAnimationFrame(animate);
    });
  }

  public cancel(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.isSpinning = false;
  }
}
