import React, { useState } from 'react';
import { Trophy, ChevronDown, ChevronUp, Flame, Check, Sparkles, RefreshCw, Target } from 'lucide-react';
import { Achievement, DailyMissionState, PlayerStats } from '../Scripts/types';

interface AchievementsDrawerProps {
  stats: PlayerStats;
  achievements: Achievement[];
  missionState: DailyMissionState;
  onClaimMission: (id: string) => void;
  onClaimAllClear: () => void;
  onRefreshMissions: () => void;
}

export const AchievementsDrawer: React.FC<AchievementsDrawerProps> = ({
  stats,
  achievements,
  missionState,
  onClaimMission,
  onClaimAllClear,
  onRefreshMissions
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'missions' | 'trophies'>('missions');

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const unclaimedMissions = missionState.missions.filter((m) => m.completed && !m.claimed).length;
  const allMissionsClaimed = missionState.missions.every((m) => m.claimed);
  const canClaimAllClear = allMissionsClaimed && !missionState.allClearClaimed;
  const totalPendingClaims = unclaimedMissions + (canClaimAllClear ? 1 : 0);

  return (
    <div className="mt-2.5 bg-[#0d071c] p-2.5 rounded-lg border border-[#2b1954]">
      {/* Header Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between cursor-pointer text-left"
      >
        <div className="flex items-center gap-1.5 font-press text-[8px] text-yellow-300">
          <Target size={11} className="text-amber-400" />
          <span>MISSIONS &amp; TROPHIES</span>
          {totalPendingClaims > 0 && (
            <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[7px] font-mono animate-bounce font-bold shadow-[0_0_6px_#ef4444]">
              {totalPendingClaims} CLAIM READY!
            </span>
          )}
        </div>

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
          {/* Sub-Tabs: DAILY MISSIONS vs ARCADE TROPHIES */}
          <div className="flex items-center gap-1 p-1 bg-[#150a30] rounded-lg border border-[#301b60]">
            <button
              type="button"
              onClick={() => setActiveTab('missions')}
              className={`flex-1 py-1 px-2 text-[7.5px] font-bold rounded transition-all font-press flex items-center justify-center gap-1 ${
                activeTab === 'missions'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Target size={10} />
              <span>DAILY MISSIONS</span>
              {unclaimedMissions > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-ping" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('trophies')}
              className={`flex-1 py-1 px-2 text-[7.5px] font-bold rounded transition-all font-press flex items-center justify-center gap-1 ${
                activeTab === 'trophies'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Trophy size={10} />
              <span>TROPHIES ({unlockedCount}/8)</span>
            </button>
          </div>

          {/* TAB 1: DAILY MISSIONS */}
          {activeTab === 'missions' && (
            <div className="flex flex-col gap-2">
              {/* Mission Items */}
              {missionState.missions.map((mission) => {
                const isClaimReady = mission.completed && !mission.claimed;
                const isClaimed = mission.claimed;

                return (
                  <div
                    key={mission.id}
                    className={`p-2 rounded-lg border transition-all flex flex-col gap-1.5 ${
                      isClaimReady
                        ? 'bg-gradient-to-r from-[#2a134a] via-[#1f0e3a] to-[#2a134a] border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                        : isClaimed
                        ? 'bg-[#100824] border-emerald-900/60 opacity-80'
                        : 'bg-[#140b2c] border-[#2c1955]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base select-none">{mission.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[6.5px] px-1 py-0.2 rounded font-press uppercase ${
                                mission.tier === 'easy'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                                  : mission.tier === 'medium'
                                  ? 'bg-purple-950 text-cyan-300 border border-purple-500/50'
                                  : 'bg-red-950 text-amber-300 border border-amber-500/50'
                              }`}
                            >
                              {mission.tier}
                            </span>
                            <span className="text-[7.5px] font-bold text-yellow-200 font-press">
                              {mission.title}
                            </span>
                          </div>
                          <p className="text-[7px] text-purple-300 font-sans mt-0.5">
                            {mission.description}
                          </p>
                        </div>
                      </div>

                      {/* Reward Badge */}
                      <span className="text-[8px] text-amber-300 font-mono font-bold bg-black/60 px-1.5 py-0.5 rounded border border-amber-400/40 tabular-nums">
                        +{mission.reward}G
                      </span>
                    </div>

                    {/* Progress Bar & Claim Button */}
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 bg-black/60 rounded h-2 overflow-hidden border border-[#2b1954] relative">
                        <div
                          className={`h-full transition-all duration-300 rounded ${
                            mission.completed ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                          style={{
                            width: `${Math.min(100, (mission.progress / mission.target) * 100)}%`
                          }}
                        />
                      </div>
                      <span className="text-[7.5px] font-mono text-stone-300 tabular-nums shrink-0">
                        {Math.min(mission.progress, mission.target)}/{mission.target}
                      </span>

                      {/* Action Button */}
                      {isClaimReady ? (
                        <button
                          type="button"
                          onClick={() => onClaimMission(mission.id)}
                          className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-green-400 text-black text-[7px] font-black rounded border border-emerald-300 font-press shadow-[0_0_8px_rgba(52,211,153,0.5)] active:scale-95 animate-pulse transition hover:brightness-110"
                        >
                          CLAIM 🪙
                        </button>
                      ) : isClaimed ? (
                        <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-400 text-[6.5px] font-press rounded border border-emerald-800 flex items-center gap-0.5">
                          <Check size={8} /> CLAIMED
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-purple-950/60 text-purple-400 text-[6.5px] font-press rounded border border-purple-800/40">
                          PENDING
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* ALL-CLEAR GRAND BONUS VAULT */}
              <div
                className={`p-2 rounded-lg border-2 transition-all mt-1 ${
                  canClaimAllClear
                    ? 'bg-gradient-to-r from-amber-950 via-purple-950 to-amber-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse'
                    : missionState.allClearClaimed
                    ? 'bg-[#100824] border-emerald-800/60 opacity-85'
                    : 'bg-[#140b2a] border-[#3b2476]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-400" />
                    <div>
                      <p className="text-[8px] font-bold text-amber-300 font-press">
                        ★ ALL-CLEAR GRAND VAULT ★
                      </p>
                      <p className="text-[7px] text-purple-300 font-sans">
                        Complete &amp; claim all 3 missions for a grand payout!
                      </p>
                    </div>
                  </div>

                  {canClaimAllClear ? (
                    <button
                      type="button"
                      onClick={onClaimAllClear}
                      className="px-2.5 py-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-stone-900 text-[7px] font-black rounded border border-yellow-200 font-press shadow-[0_0_10px_#f59e0b] hover:brightness-110 active:scale-95 transition"
                    >
                      CLAIM +500G! 🏆
                    </button>
                  ) : missionState.allClearClaimed ? (
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[7px] font-press rounded border border-emerald-600 flex items-center gap-1">
                      <Check size={9} /> VAULT CLAIMED
                    </span>
                  ) : (
                    <span className="text-[7.5px] font-mono text-amber-400/80 bg-black/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                      +{missionState.allClearReward}G
                    </span>
                  )}
                </div>
              </div>

              {/* Daily Reset Info & Manual Refresh */}
              <div className="flex items-center justify-between text-[7px] text-purple-400 pt-1 font-mono">
                <span>DATE: {missionState.date}</span>
                <button
                  type="button"
                  onClick={onRefreshMissions}
                  className="flex items-center gap-1 text-purple-300 hover:text-amber-300 transition-colors"
                  title="Generate new daily missions"
                >
                  <RefreshCw size={9} />
                  <span>REFRESH MISSIONS</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ARCADE TROPHIES */}
          {activeTab === 'trophies' && (
            <div className="flex flex-col gap-2">
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
      )}
    </div>
  );
};
