import React from 'react';
import { BetAmount } from '../Scripts/types';

interface ControlPanelProps {
  currentBet: number;
  betLevelSelection: BetAmount;
  onSetBet: (bet: BetAmount) => void;
  isGameRunning: boolean;
  isAutoSpin: boolean;
  onToggleAutoSpin: () => void;
  onSpin: () => void;
  onPullLever: () => void;
  isLeverPulled: boolean;
  isBonusMode: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  currentBet,
  betLevelSelection,
  onSetBet,
  isGameRunning,
  isAutoSpin,
  onToggleAutoSpin,
  onSpin,
  onPullLever,
  isLeverPulled,
  isBonusMode
}) => {
  return (
    <div className="mt-3 bg-[#1d123d] p-3 rounded-xl border-2 border-[#3b2476]">
      {/* Bet Selector Row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] text-purple-200 font-press">BET LEVEL:</span>
        <div className="flex items-center gap-1.5">
          {([10, 50, 100] as const).map((bet) => {
            const isSelected = betLevelSelection === bet;
            return (
              <button
                key={bet}
                type="button"
                disabled={isGameRunning || isBonusMode}
                onClick={() => onSetBet(bet)}
                className={`px-2.5 py-1 text-[9px] font-bold rounded border-2 shadow transition-all font-press active:translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500 text-black shadow-md'
                    : 'border-purple-500 bg-[#28174f] text-purple-200 hover:border-purple-300'
                }`}
              >
                {bet}G
              </button>
            );
          })}

          <button
            type="button"
            disabled={isGameRunning || isBonusMode}
            onClick={() => onSetBet('max')}
            className={`px-2 py-1 text-[9px] font-bold rounded border-2 shadow transition-all font-press active:translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed ${
              betLevelSelection === 'max'
                ? 'border-amber-400 bg-amber-500 text-black'
                : 'border-red-500 bg-[#3d1325] text-red-300 hover:border-red-400'
            }`}
          >
            MAX
          </button>
        </div>
      </div>

      {/* Main Action Buttons & Mechanical Lever */}
      <div className="flex items-center gap-2">
        {/* Quick Auto Spin Toggle Button */}
        <button
          type="button"
          disabled={isBonusMode}
          onClick={onToggleAutoSpin}
          className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-bold font-press border-2 transition-all text-center active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
            isAutoSpin
              ? 'bg-gradient-to-b from-emerald-800 to-emerald-950 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
              : 'bg-gradient-to-b from-[#3a2072] to-[#201045] border-[#6942b8] hover:border-purple-300 text-purple-200'
          }`}
        >
          AUTO <br />
          <span
            className={`text-[8px] font-mono ${
              isAutoSpin ? 'text-emerald-300 animate-pulse font-bold' : 'text-purple-400'
            }`}
          >
            {isAutoSpin ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Main Spin Button */}
        <button
          type="button"
          disabled={isGameRunning}
          onClick={onSpin}
          className="flex-[2] py-3.5 px-4 bg-gradient-to-b from-[#f59e0b] via-[#d97706] to-[#b45309] border-2 border-yellow-200 rounded-xl text-stone-900 text-sm font-black tracking-widest font-press shadow-[0_4px_0_#78350f] active:translate-y-1 active:shadow-none hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-65 disabled:cursor-not-allowed"
        >
          <span>{isBonusMode ? 'BONUS!' : 'SPIN!'}</span>
          <span className="text-sm">{isBonusMode ? '⭐' : '🎰'}</span>
        </button>

        {/* Interactive Mechanical Lever */}
        <button
          type="button"
          disabled={isGameRunning}
          onClick={onPullLever}
          title="Pull Mechanical Arcade Lever"
          className="w-14 h-14 bg-[#140b2a] border-2 border-[#5a369e] rounded-xl flex flex-col items-center justify-center active:scale-95 transition hover:border-amber-400 disabled:opacity-65 group disabled:cursor-not-allowed cursor-pointer"
        >
          <div
            className={`w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-red-700 shadow-md border border-red-300 transition-transform ${
              isLeverPulled ? 'lever-pulled' : ''
            }`}
          />
          <div className="w-2 h-4 bg-slate-300 rounded-b mt-0.5" />
          <span className="text-[6px] text-purple-300 mt-0.5 font-press">PULL</span>
        </button>
      </div>
    </div>
  );
};
