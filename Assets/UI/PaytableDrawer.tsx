import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SLOT_SYMBOLS } from '../Prefabs/ReelStripPrefab';

export const PaytableDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const bell = SLOT_SYMBOLS.find((s) => s.id === 'bell')!;
  const seven = SLOT_SYMBOLS.find((s) => s.id === 'seven')!;
  const bar = SLOT_SYMBOLS.find((s) => s.id === 'bar')!;
  const cherry = SLOT_SYMBOLS.find((s) => s.id === 'cherry')!;

  return (
    <div className="mt-3 bg-[#0d071c] p-2.5 rounded-lg border border-[#2b1954]">
      {/* Header Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between cursor-pointer text-left"
      >
        <span className="text-[8px] text-amber-300 font-bold flex items-center gap-1.5 font-press">
          <span>📜</span> PAYTABLE &amp; SYMBOL MULTIPLIERS
        </span>
        <span className="text-[10px] text-purple-300 font-press">
          {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </span>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="mt-2.5 pt-2 border-t border-[#231245] flex flex-col gap-2 text-[8px] text-stone-300">
          {/* Highlighted Free Spins Scatter Card */}
          <div className="bg-gradient-to-r from-red-950 via-[#35104a] to-amber-950 p-2 rounded border border-amber-400/80 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  src={bell.img}
                  alt="Scatter Bell"
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 object-contain pixelated"
                />
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-black text-[6px] font-bold px-1 rounded font-press">
                  BONUS
                </span>
              </div>
              <div>
                <p className="font-bold text-amber-300 font-press text-[8px]">
                  ⭐ 3x SCATTER / BONUS
                </p>
                <p className="text-[7.5px] text-pink-300 font-sans mt-0.5">
                  10 FREE SPINS @ 3X MULTIPLIER MINI-GAME!
                </p>
              </div>
            </div>
            <span className="text-[7px] text-amber-200 border border-amber-400/50 bg-black/40 px-1.5 py-1 rounded font-mono font-bold">
              +5 RETRIGGER
            </span>
          </div>

          {/* 2x2 Grid of Standard Symbols */}
          <div className="grid grid-cols-2 gap-2">
            {/* 3x Sevens */}
            <div className="flex items-center gap-2 bg-[#170c30] p-1.5 rounded border border-[#301b60]">
              <img
                src={seven.img}
                alt="Lucky 7"
                referrerPolicy="no-referrer"
                className="w-6 h-6 object-contain pixelated"
              />
              <div>
                <p className="font-bold text-red-400 font-press text-[7px]">3x SEVENS</p>
                <p className="text-amber-300 font-mono text-[8px]">JACKPOT (100x)</p>
              </div>
            </div>

            {/* 3x BARs */}
            <div className="flex items-center gap-2 bg-[#170c30] p-1.5 rounded border border-[#301b60]">
              <img
                src={bar.img}
                alt="BAR"
                referrerPolicy="no-referrer"
                className="w-6 h-6 object-contain pixelated"
              />
              <div>
                <p className="font-bold text-cyan-400 font-press text-[7px]">3x BARS</p>
                <p className="text-amber-300 font-mono text-[8px]">BIG WIN (40x)</p>
              </div>
            </div>

            {/* 3x Bells */}
            <div className="flex items-center gap-2 bg-[#170c30] p-1.5 rounded border border-[#301b60]">
              <img
                src={bell.img}
                alt="Bell"
                referrerPolicy="no-referrer"
                className="w-6 h-6 object-contain pixelated"
              />
              <div>
                <p className="font-bold text-yellow-400 font-press text-[7px]">3x BELLS</p>
                <p className="text-amber-300 font-mono text-[8px]">BONUS (25x)</p>
              </div>
            </div>

            {/* 3x Cherries */}
            <div className="flex items-center gap-2 bg-[#170c30] p-1.5 rounded border border-[#301b60]">
              <img
                src={cherry.img}
                alt="Cherry"
                referrerPolicy="no-referrer"
                className="w-6 h-6 object-contain pixelated"
              />
              <div>
                <p className="font-bold text-rose-400 font-press text-[7px]">3x CHERRIES</p>
                <p className="text-amber-300 font-mono text-[8px]">WIN (10x)</p>
              </div>
            </div>
          </div>

          <div className="text-center text-[7px] text-purple-400 pt-0.5 font-sans">
            * 2x Matching Cherries pays 3x consolation prize! Retrigger Free Spins with 3x Scatters anytime.
          </div>
        </div>
      )}
    </div>
  );
};
