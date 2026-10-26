/**
 * Easing functions simulating physical mechanical slot reels:
 * Rapid acceleration, steady high-speed blur, followed by smooth cubic deceleration
 * and realistic spring overshoot / bounce.
 */

export function easeOutBounce(x: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}

export function easeDeceleration(t: number): number {
  // 70% spin phase, 30% smooth cubic ease out with mechanical settling
  if (t < 0.7) {
    return Math.pow(t / 0.7, 1.25) * 0.7;
  } else {
    const p = (t - 0.7) / 0.3;
    return 0.7 + (1 - Math.pow(1 - p, 3)) * 0.3;
  }
}
