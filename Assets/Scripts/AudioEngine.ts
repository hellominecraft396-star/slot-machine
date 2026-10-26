import { ARCADE_BGM_MELODY, WIN_FANFARE_CHORDS, JACKPOT_SCALE, BONUS_SCALE } from '../Sounds/SoundProfiles';

/**
 * 8-Bit Chiptune Web Audio Synthesizer
 * Zero external audio files required — fully generated in real-time via Web Audio API oscillators.
 */
export class AudioEngine {
  private static instance: AudioEngine | null = null;
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private bgmNoteIndex: number = 0;

  private constructor() {}

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  public init(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master FX gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);

      // BGM gain
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.sfxGain && this.bgmGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime);
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public toggleBgm(): boolean {
    this.init();
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public startBgm(): void {
    if (this.isBgmPlaying) return;
    this.init();
    this.isBgmPlaying = true;
    this.bgmNoteIndex = 0;
    this.playNextBgmNote();
  }

  public stopBgm(): void {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  private playNextBgmNote(): void {
    if (!this.isBgmPlaying || !this.ctx || !this.bgmGain || this.isMuted) {
      if (this.isBgmPlaying) {
        this.bgmTimer = window.setTimeout(() => this.playNextBgmNote(), 200);
      }
      return;
    }

    const item = ARCADE_BGM_MELODY[this.bgmNoteIndex];
    this.bgmNoteIndex = (this.bgmNoteIndex + 1) % ARCADE_BGM_MELODY.length;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.note, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + item.duration * 0.9);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start();
      osc.stop(this.ctx.currentTime + item.duration);
    } catch {
      // AudioContext safe catch
    }

    this.bgmTimer = window.setTimeout(() => {
      this.playNextBgmNote();
    }, item.duration * 1000);
  }

  public playTick(): void {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320 + Math.random() * 80, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Ignore
    }
  }

  public playStop(): void {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Ignore
    }
  }

  public playLever(): void {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Ignore
    }
  }

  public playWin(tier: 'mid' | 'big' | 'bonus' | 'jackpot' = 'mid'): void {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    try {
      let notes: number[];
      if (tier === 'jackpot') {
        notes = JACKPOT_SCALE;
      } else if (tier === 'bonus') {
        notes = BONUS_SCALE;
      } else if (tier === 'big') {
        notes = [392, 523, 659, 783, 1046];
      } else {
        notes = [330, 392, 523, 659];
      }

      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = tier === 'bonus' ? 'sawtooth' : 'square';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(tier === 'bonus' ? 0.14 : 0.1, this.ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.28);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(this.ctx.currentTime + idx * 0.07);
        osc.stop(this.ctx.currentTime + idx * 0.07 + 0.28);
      });
    } catch {
      // Ignore
    }
  }

  public playFanfare(): void {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    try {
      WIN_FANFARE_CHORDS.forEach((chord, i) => {
        chord.forEach((freq) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.14);
          gain.gain.setValueAtTime(0.09, this.ctx.currentTime + i * 0.14);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.14 + 0.35);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(this.ctx.currentTime + i * 0.14);
          osc.stop(this.ctx.currentTime + i * 0.14 + 0.35);
        });
      });
    } catch {
      // Ignore
    }
  }
}
