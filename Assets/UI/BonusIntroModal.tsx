import React from 'react';
import { MODAL_FRAME_IMG, SLOT_SYMBOLS } from '../Prefabs/ReelStripPrefab';

interface BonusIntroModalProps {
  isOpen: boolean;
  onStart: () => void;
}

export const BonusIntroModal: React.FC<BonusIntroModalProps> = ({ isOpen, onStart }) => {
  if (!isOpen) return null;

  const bell = SLOT_SYMBOLS.find((s) => s.id === 'bell')!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden p-6 border-4 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.6)] text-center"
        style={{
          backgroundImage: `url('${MODAL_FRAME_IMG}')`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="flex flex-col items-center justify-center relative z-10 py-2">
          {/* Header Tag */}
          <div className="flex items-center gap-2 mb-2 animate-pulse">
            <span className="text-2xl">⭐</span>
            <span className="text-xs text-amber-300 font-bold tracking-widest border border-amber-400 px-2 py-0.5 rounded bg-black/60 font-press text-[8px]">
              BONUS ACTIVATED!
            </span>
            <span className="text-2xl">⭐</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-yellow-300 glow-gold leading-tight mb-2 tracking-wide font-press">
            FREE SPINS!
          </h2>

          {/* Triple Bouncing Bells */}
          <div className="my-3 flex items-center justify-center gap-3">
            <img
              src={bell.img}
              alt="Bonus Bell"
              referrerPolicy="no-referrer"
              className="w-12 h-12 object-contain pixelated animate-bounce"
            />
            <img
              src={bell.img}
              alt="Bonus Bell"
              referrerPolicy="no-referrer"
              className="w-14 h-14 object-contain pixelated animate-bounce delay-100"
            />
            <img
              src={bell.img}
              alt="Bonus Bell"
              referrerPolicy="no-referrer"
              className="w-12 h-12 object-contain pixelated animate-bounce delay-200"
            />
          </div>

          {/* Details Card */}
          <div className="bg-black/70 p-3 rounded-xl border border-amber-500/50 my-2 w-full">
            <p className="text-sm font-bold text-emerald-300 font-vt text-2xl tracking-wider">
              10 FREE SPINS AWARDED
            </p>
            <p className="text-[9px] text-pink-300 mt-1 font-mono font-bold">
              ALL WINS MULTIPLIED BY{' '}
              <span className="text-amber-300 text-xs font-black font-press">3X!</span>
            </p>
            <p className="text-[8px] text-purple-300 mt-0.5 font-press">COSTS 0 CREDITS PER SPIN</p>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="mt-3 w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-900 font-black rounded-xl text-xs uppercase tracking-wider shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none hover:brightness-110 transition font-press"
          >
            START BONUS ROUND! 🎰
          </button>
        </div>
      </div>
    </div>
  );
};
