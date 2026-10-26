import React from 'react';
import { SymbolDefinition } from '../Scripts/types';

interface ReelsStageProps {
  isBonusMode: boolean;
  reelsItems: SymbolDefinition[][];
  reelsOffsets: number[];
  statusMessage: string;
  isStatusWin: boolean;
}

export const ReelsStage: React.FC<ReelsStageProps> = ({
  isBonusMode,
  reelsItems,
  reelsOffsets,
  statusMessage,
  isStatusWin
}) => {
  return (
    <div
      className={`relative p-3 rounded-xl border-4 shadow-inner transition-colors ${
        isBonusMode
          ? 'bg-[#3b1236] border-amber-400'
          : 'bg-[#25154d] border-[#442c82]'
      }`}
    >
      {/* Red Win Payline indicator tabs on left & right */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 flex items-center pointer-events-none">
        <div className="w-3 h-5 bg-red-600 rounded-r-md border border-yellow-300 shadow" />
      </div>
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 flex items-center pointer-events-none">
        <div className="w-3 h-5 bg-red-600 rounded-l-md border border-yellow-300 shadow" />
      </div>

      {/* 3 Reels Display Grid */}
      <div className="grid grid-cols-3 gap-2 relative bg-[#150f29] p-2 rounded-lg border-2 border-[#120826] overflow-hidden">
        {/* Strict Single Center Payline Guide */}
        <div
          className={`absolute top-1/2 left-0 right-0 h-[80px] -translate-y-1/2 pointer-events-none z-10 transition-all ${
            isBonusMode
              ? 'border-y-2 border-dashed border-amber-400 bg-amber-400/20 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
              : 'border-y-2 border-dashed border-red-500/80 bg-yellow-200/10'
          }`}
        />

        {/* The 3 Physical Reel Strips */}
        {[0, 1, 2].map((reelIdx) => {
          const items = reelsItems[reelIdx] || [];
          const offsetY = reelsOffsets[reelIdx] || 0;

          return (
            <div
              key={reelIdx}
              className={`h-[160px] overflow-hidden relative rounded shadow-inner ${
                isBonusMode
                  ? 'bg-gradient-to-b from-pink-100 via-amber-50 to-pink-100 shadow-[inset_0_12px_16px_rgba(112,26,117,0.7),inset_0_-12px_16px_rgba(112,26,117,0.7)]'
                  : 'bg-gradient-to-b from-[#b8d4e4] via-[#e2f1f8] to-[#b8d4e4] shadow-[inset_0_12px_16px_rgba(10,15,35,0.6),inset_0_-12px_16px_rgba(10,15,35,0.6)]'
              }`}
            >
              <div
                className="flex flex-col items-center will-change-transform"
                style={{
                  transform: `translateY(${offsetY}px)`
                }}
              >
                {items.map((sym, sIdx) => (
                  <div
                    key={`${reelIdx}-${sIdx}-${sym.id}`}
                    className="w-[76px] h-[80px] flex items-center justify-center shrink-0 relative"
                  >
                    <img
                      src={sym.img}
                      alt={sym.name}
                      referrerPolicy="no-referrer"
                      className="w-[68px] h-[68px] object-contain pixelated pointer-events-none select-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                    />
                    {sym.isScatter && (
                      <span className="absolute bottom-1 bg-red-600 text-white text-[7px] font-black px-1 py-0.5 rounded border border-yellow-200 shadow-[0_0_6px_#ef4444] font-press tracking-wider">
                        SCATTER
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Notification Banner */}
      <div
        className={`mt-2 text-center py-2 px-3 bg-[#090414] rounded border border-[#ffb703] font-vt text-lg tracking-wider min-h-[38px] flex items-center justify-center transition-colors ${
          isStatusWin ? 'text-emerald-400 font-bold' : 'text-yellow-300'
        }`}
      >
        {statusMessage}
      </div>
    </div>
  );
};
