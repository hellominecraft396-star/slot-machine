/**
 * Frequency maps and rhythm constants for 8-bit procedural sound synthesis
 */

export const ARCADE_BGM_MELODY = [
  // Retro 8-bit catchy arcade baseline arpeggio (frequencies in Hz)
  { note: 261.63, duration: 0.18 }, // C4
  { note: 329.63, duration: 0.18 }, // E4
  { note: 392.00, duration: 0.18 }, // G4
  { note: 523.25, duration: 0.18 }, // C5
  { note: 440.00, duration: 0.18 }, // A4
  { note: 349.23, duration: 0.18 }, // F4
  { note: 392.00, duration: 0.18 }, // G4
  { note: 493.88, duration: 0.18 }, // B4
  { note: 523.25, duration: 0.24 }, // C5
  { note: 392.00, duration: 0.18 }, // G4
  { note: 329.63, duration: 0.18 }, // E4
  { note: 293.66, duration: 0.24 }  // D4
];

export const WIN_FANFARE_CHORDS = [
  [523.25, 659.25, 783.99],   // C Major
  [587.33, 739.99, 880.00],   // D Major
  [659.25, 830.61, 987.77],   // E Major
  [1046.50, 1318.51, 1567.98] // High C Major Octave
];

export const JACKPOT_SCALE = [261, 329, 392, 523, 659, 783, 1046, 1318, 1568];
export const BONUS_SCALE = [440, 554, 659, 880, 1108, 1318, 1760];
