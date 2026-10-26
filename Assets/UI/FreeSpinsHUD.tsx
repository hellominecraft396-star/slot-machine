import React from 'react';
import { FreeSpinsState } from '../Scripts/types';

interface FreeSpinsHUDProps {
  freeSpinsState: FreeSpinsState;
}

export const FreeSpinsHUD: React.FC<FreeSpinsHUDProps> = ({ freeSpinsState }) => {
  if (!freeSpinsState.isActive) return null;

  return (
    <div className="mb-2.5 bg-gradient-to-r from-red-950 via-purple-900 to-amber-950 p-2 rounded-lg border-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-fade-in">
      <div className="flex items-center justify-between text-[8px] text-yellow-300 font-mono font-bold mb-1 border-b border-amber-500/40 pb-1">
        <span className="flex items-center gap-1 font-press">
          <span className="animate-spin inline-block text-xs">⭐</span> FREE SPINS BONUS ROUND
        </span>
        <span className="bg-red-600 px-1.5 py-0.5 rounded text-white animate-pulse font-press text-[7px]">
          FREE PLAY
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1 font-vt text-center">
        <div className="bg-black/50 p-1 rounded border border-amber-500/40">
          <span className="text-[10px] text-purple-300 block">SPINS LEFT</span>
          <span className="text-xl text-yellow-300 font-bold font-vt tabular-nums">
            {freeSpinsState.spinsRemaining}/{freeSpinsState.totalSpins}
          </span>
        </div>

        <div className="bg-black/50 p-1 rounded border border-amber-500/40">
          <span className="text-[10px] text-cyan-300 block">MULTIPLIER</span>
          <span className="text-xl text-pink-400 font-bold font-vt">
            {freeSpinsState.multiplier}X
          </span>
        </div>

        <div className="bg-black/50 p-1 rounded border border-amber-500/40">
          <span className="text-[10px] text-emerald-300 block">BONUS WON</span>
          <span className="text-xl text-emerald-400 font-bold font-vt tabular-nums">
            {freeSpinsState.accumulatedWinnings.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
