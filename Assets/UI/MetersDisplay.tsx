import React from 'react';

interface MetersDisplayProps {
  credits: number;
  winner: number;
  jackpot: number;
}

export const MetersDisplay: React.FC<MetersDisplayProps> = ({ credits, winner, jackpot }) => {
  return (
    <div className="grid grid-cols-3 gap-2 mb-2 bg-[#0a0518] p-2.5 rounded-lg border-2 border-[#4b338f] text-center font-vt transition-all">
      {/* Credits */}
      <div className="flex flex-col items-center bg-[#150a30] p-1 rounded border border-[#2d1b61]">
        <span className="text-[12px] text-purple-300 tracking-wider">CREDITS</span>
        <span className="text-2xl text-yellow-400 font-bold leading-tight font-vt tabular-nums">
          {credits.toLocaleString()}
        </span>
      </div>

      {/* Winner */}
      <div className="flex flex-col items-center bg-[#150a30] p-1 rounded border border-[#2d1b61]">
        <span className="text-[12px] text-cyan-300 tracking-wider">WINNER</span>
        <span className="text-2xl text-emerald-400 font-bold leading-tight font-vt tabular-nums">
          {winner.toLocaleString()}
        </span>
      </div>

      {/* Jackpot */}
      <div className="flex flex-col items-center bg-[#150a30] p-1 rounded border border-[#2d1b61]">
        <span className="text-[12px] text-amber-300 tracking-wider">JACKPOT</span>
        <span className="text-2xl text-amber-400 font-bold leading-tight font-vt tabular-nums">
          {jackpot.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
