import React from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface MarqueeHeaderProps {
  isBonusMode: boolean;
  isMuted: boolean;
  isBgmPlaying: boolean;
  onToggleMute: () => void;
  onToggleBgm: () => void;
  isJackpotActive: boolean;
}

export const MarqueeHeader: React.FC<MarqueeHeaderProps> = ({
  isBonusMode,
  isMuted,
  isBgmPlaying,
  onToggleMute,
  onToggleBgm,
  isJackpotActive
}) => {
  return (
    <header
      className={`w-full bg-[#181135] border-4 rounded-t-2xl p-3 shadow-2xl relative overflow-hidden text-center mb-1 transition-all ${
        isBonusMode ? 'bonus-header' : 'border-[#ffb703]'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a1b5c] to-[#120a2a] opacity-80 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Top Info Bar with Status & Audio Controls */}
        <div className="flex items-center justify-between w-full px-2 mb-1">
          <span className="text-[9px] text-amber-400 tracking-wider font-press">
            {isBonusMode ? '★ FREE SPINS MODE ★' : 'RETRO ARCADE'}
          </span>

          <div className="flex items-center gap-2">
            {/* Audio Controls */}
            <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-purple-500/40">
              <button
                type="button"
                onClick={onToggleBgm}
                title={isBgmPlaying ? 'Arcade Music: ON (Click to Pause)' : 'Arcade Music: OFF (Click to Play)'}
                className={`p-1 rounded text-[8px] transition-colors ${
                  isBgmPlaying ? 'text-emerald-400 bg-emerald-950/60' : 'text-purple-300 hover:text-white'
                }`}
                aria-label="Toggle Background Music"
              >
                <Music size={11} className={isBgmPlaying ? 'animate-bounce' : ''} />
              </button>
              <button
                type="button"
                onClick={onToggleMute}
                title={isMuted ? 'Sound Effects: MUTED (Click to Unmute)' : 'Sound Effects: ACTIVE (Click to Mute)'}
                className={`p-1 rounded text-[8px] transition-colors ${
                  isMuted ? 'text-rose-400 bg-rose-950/60' : 'text-yellow-300 hover:text-white'
                }`}
                aria-label="Toggle Sound Effects"
              >
                {isMuted ? <VolumeX size={11} /> : <Volume2 size={11} />}
              </button>
            </div>

            {/* Fair RNG indicator */}
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              <span className="text-[8px] text-emerald-400 font-press">FAIR RNG VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Dynamic Title */}
        <h1
          className={`text-xl sm:text-2xl font-black py-1 tracking-widest ${
            isBonusMode
              ? 'text-yellow-300 glow-bonus'
              : 'text-[#ffb703] glow-gold font-press'
          } ${isJackpotActive ? 'jackpot-active' : ''}`}
        >
          {isBonusMode ? '⭐ BONUS ROUND ⭐' : '★ JACKPOT ★'}
        </h1>

        <p className="text-[8px] text-purple-300 font-sans tracking-wide uppercase">
          {isBonusMode
            ? '10 FREE SPINS • 3X WIN MULTIPLIER ACTIVE!'
            : 'Match 3 across center payline to win!'}
        </p>
      </div>
    </header>
  );
};
