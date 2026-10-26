import React, { useState } from 'react';
import { Trophy, ChevronDown, ChevronUp, Flame } from 'lucide-react';
import { Achievement, PlayerStats } from '../Scripts/types';

interface AchievementsDrawerProps {
  stats: PlayerStats;
  achievements: Achievement[];
}

export const AchievementsDrawer: React.FC<AchievementsDrawerProps> = ({ stats, achievements }) => {
  const [isOpen, setIsOpen] = useState(false);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="mt-2.5 bg-[#0d071c] p-2.5 rounded-lg border border-[#2b1954]">
      {/* Header Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between cursor-pointer text-left"
      >
        <span className="text-[8px] text-yellow-300 font-bold flex items-center gap-1.5 font-press">
          <Trophy size={11} className="text-yellow-400" />
          <span>TROPHIES &amp; STREAKS</span>
          <span className="ml-1 bg-purple-900/80 text-purple-200 px-1.5 py-0.2 rounded text-[7px] border border-purple-600/50">
            {unlockedCount}/{achievements.length}
          </span>
        </span>
        <div className="flex items-center gap-2">
          {stats.currentStreak > 0 && (
            <span className="flex items-center gap-0.5 text-[7px] text-amber-300 bg-amber-950/70 px-1 py-0.5 rounded border border-amber-500/50 font-press animate-pulse">
              <Flame size={9} className="text-orange-400" />
              {stats.currentStreak}x STREAK
            </span>
          )}
          <span className="text-[10px] text-purple-300 font-press">
            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </span>
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="mt-2.5 pt-2 border-t border-[#231245] flex flex-col gap-2.5">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-1.5 text-center font-vt">
            <div className="bg-[#140b2a] p-1 rounded border border-[#2c1955]">
              <span className="text-[9px] text-purple-300 block">WIN STREAK</span>
              <span className="text-base text-yellow-300 font-bold tabular-nums">
                {stats.currentStreak}
              </span>
            </div>
            <div className="bg-[#140b2a] p-1 rounded border border-[#2c1955]">
              <span className="text-[9px] text-purple-300 block">BEST STREAK</span>
              <span className="text-base text-amber-400 font-bold tabular-nums">
                {stats.bestStreak}
              </span>
            </div>
            <div className="bg-[#140b2a] p-1 rounded border border-[#2c1955]">
              <span className="text-[9px] text-purple-300 block">TOTAL WINS</span>
              <span className="text-base text-emerald-400 font-bold tabular-nums">
                {stats.totalWins}
              </span>
            </div>
            <div className="bg-[#140b2a] p-1 rounded border border-[#2c1955]">
              <span className="text-[9px] text-purple-300 block">FREE SPINS</span>
              <span className="text-base text-pink-400 font-bold tabular-nums">
                {stats.freeSpinsTriggered}
              </span>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-1.5 rounded border transition-all flex items-start gap-1.5 ${
                  ach.unlocked
                    ? 'bg-[#1a0e38] border-amber-400/80 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                    : 'bg-[#100824] border-[#221342] opacity-65'
                }`}
              >
                <span className="text-base shrink-0 select-none">{ach.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-[7.5px] font-bold font-press truncate ${
                        ach.unlocked ? 'text-yellow-300' : 'text-stone-400'
                      }`}
                    >
                      {ach.title}
                    </p>
                    {ach.unlocked && (
                      <span className="text-[6px] text-emerald-400 font-mono">UNLOCKED</span>
                    )}
                  </div>
                  <p className="text-[7px] text-purple-300 font-sans leading-tight mt-0.5">
                    {ach.description}
                  </p>
                  {!ach.unlocked && ach.target > 1 && (
                    <div className="mt-1 w-full bg-black/60 rounded h-1 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded transition-all"
                        style={{
                          width: `${Math.min(100, (ach.progress / ach.target) * 100)}%`
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
