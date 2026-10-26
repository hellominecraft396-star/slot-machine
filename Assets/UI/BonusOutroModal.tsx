import React from 'react';
import { MODAL_FRAME_IMG } from '../Prefabs/ReelStripPrefab';

interface BonusOutroModalProps {
  isOpen: boolean;
  totalWon: number;
  totalSpinsPlayed: number;
  onCollect: () => void;
}

export const BonusOutroModal: React.FC<BonusOutroModalProps> = ({
  isOpen,
  totalWon,
  totalSpinsPlayed,
  onCollect
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden p-6 border-4 border-yellow-300 shadow-[0_0_50px_rgba(250,204,21,0.7)] text-center"
        style={{
          backgroundImage: `url('${MODAL_FRAME_IMG}')`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="flex flex-col items-center justify-center relative z-10 py-1">
          <span className="text-3xl mb-1 select-none">🏆</span>

          <h2 className="text-lg sm:text-xl font-black text-amber-300 glow-gold leading-tight uppercase font-press">
            BONUS COMPLETED!
          </h2>

          <p className="text-[9px] text-purple-200 mt-1 uppercase font-press text-[8px]">
            Total Free Spins Played: {totalSpinsPlayed}
          </p>

          <div className="my-3 bg-black/80 p-3.5 rounded-xl border-2 border-amber-400 w-full shadow-inner">
            <span className="text-[10px] text-stone-300 tracking-widest block font-vt text-lg">
              TOTAL BONUS WON
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 glow-gold font-vt mt-1 tabular-nums">
              +{totalWon.toLocaleString()} G
            </div>
            <span className="text-[8px] text-amber-300 mt-1 block font-mono">
              MULTIPLIER APPLIED: 3X
            </span>
          </div>

          <button
            type="button"
            onClick={onCollect}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 text-black font-black rounded-xl text-xs uppercase tracking-widest shadow-[0_4px_0_#065f46] active:translate-y-1 active:shadow-none hover:brightness-110 transition flex items-center justify-center gap-2 font-press"
          >
            <span>COLLECT WINNINGS</span>
            <span>🪙</span>
          </button>
        </div>
      </div>
    </div>
  );
};
