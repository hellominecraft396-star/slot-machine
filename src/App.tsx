/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { SlotMachineManager } from '../Assets/Scripts/SlotMachineManager';
import { MarqueeHeader } from '../Assets/UI/MarqueeHeader';
import { MetersDisplay } from '../Assets/UI/MetersDisplay';
import { FreeSpinsHUD } from '../Assets/UI/FreeSpinsHUD';
import { ReelsStage } from '../Assets/UI/ReelsStage';
import { ControlPanel } from '../Assets/UI/ControlPanel';
import { PaytableDrawer } from '../Assets/UI/PaytableDrawer';
import { AchievementsDrawer } from '../Assets/UI/AchievementsDrawer';
import { BonusIntroModal } from '../Assets/UI/BonusIntroModal';
import { BonusOutroModal } from '../Assets/UI/BonusOutroModal';
import { RulesModal } from '../Assets/UI/RulesModal';
import { BetAmount } from '../Assets/Scripts/types';

export default function App() {
  const managerRef = useRef<SlotMachineManager | null>(null);

  // Trigger state updates from SlotMachineManager
  const [, setTick] = useState<number>(0);
  const [isLeverPulled, setIsLeverPulled] = useState<boolean>(false);
  const [isBonusIntroOpen, setIsBonusIntroOpen] = useState<boolean>(false);
  const [isBonusOutroOpen, setIsBonusOutroOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);

  useEffect(() => {
    const manager = new SlotMachineManager();
    managerRef.current = manager;

    manager.setCallbacks(
      () => setTick((t) => t + 1),
      () => setIsBonusIntroOpen(true),
      () => setIsBonusOutroOpen(true)
    );

    setIsMuted(manager.audio.getIsMuted());
    setIsBgmPlaying(manager.audio.getIsBgmPlaying());

    return () => {
      manager.audio.stopBgm();
      manager.reels.forEach((r) => r.cancel());
    };
  }, []);

  const manager = managerRef.current;
  if (!manager) return null;

  const handleToggleMute = () => {
    const muted = manager.audio.toggleMute();
    setIsMuted(muted);
    setTick((t) => t + 1);
  };

  const handleToggleBgm = () => {
    const playing = manager.audio.toggleBgm();
    setIsBgmPlaying(playing);
    setTick((t) => t + 1);
  };

  const handleSetBet = (bet: BetAmount) => {
    manager.setBet(bet);
  };

  const handleSpin = () => {
    manager.startSpin();
  };

  const handlePullLever = () => {
    if (manager.isGameRunning) return;
    manager.audio.playLever();
    setIsLeverPulled(true);
    setTimeout(() => {
      setIsLeverPulled(false);
    }, 600);
    manager.startSpin();
  };

  const handleToggleAutoSpin = () => {
    manager.toggleAutoSpin();
  };

  const handleStartBonusRound = () => {
    setIsBonusIntroOpen(false);
    manager.activateFreeSpinsSession();
  };

  const handleCollectBonus = () => {
    setIsBonusOutroOpen(false);
    manager.collectBonusWinnings();
  };

  const handleResetCredits = () => {
    manager.resetCredits();
  };

  const isBonusMode = manager.freeSpinsState.isActive;
  const reelsItems = manager.reels.map((r) => r.items);
  const reelsOffsets = manager.reels.map((r) => r.currentOffsetY);
  const stats = manager.achievements.getStats();
  const achievements = manager.achievements.getAchievements();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-2 sm:p-4 scanlines relative select-none">
      {/* Main Arcade Cabinet Container */}
      <div className="w-full max-w-sm flex flex-col items-center relative z-20">
        {/* Top Marquee Header */}
        <MarqueeHeader
          isBonusMode={isBonusMode}
          isMuted={isMuted}
          isBgmPlaying={isBgmPlaying}
          onToggleMute={handleToggleMute}
          onToggleBgm={handleToggleBgm}
          isJackpotActive={manager.isJackpotActive}
        />

        {/* Slot Machine Main Body */}
        <div
          className={`w-full relative bg-[#13092c] border-x-4 border-b-4 rounded-b-2xl p-3 shadow-2xl overflow-hidden transition-all ${
            isBonusMode
              ? 'border-amber-400 bonus-mode-cabinet'
              : 'border-[#3a2578]'
          }`}
        >
          {/* Upper Digital LED Meters */}
          <MetersDisplay
            credits={manager.credits}
            winner={manager.lastWinner}
            jackpot={manager.jackpotPool}
          />

          {/* Free Spins HUD Banner (Bonus Mode Only) */}
          <FreeSpinsHUD freeSpinsState={manager.freeSpinsState} />

          {/* Reels Stage */}
          <ReelsStage
            isBonusMode={isBonusMode}
            reelsItems={reelsItems}
            reelsOffsets={reelsOffsets}
            statusMessage={manager.statusMessage}
            isStatusWin={manager.isStatusWin}
          />

          {/* Controls Panel */}
          <ControlPanel
            currentBet={manager.currentBet}
            betLevelSelection={manager.betLevelSelection}
            onSetBet={handleSetBet}
            isGameRunning={manager.isGameRunning}
            isAutoSpin={manager.isAutoSpin}
            onToggleAutoSpin={handleToggleAutoSpin}
            onSpin={handleSpin}
            onPullLever={handlePullLever}
            isLeverPulled={isLeverPulled}
            isBonusMode={isBonusMode}
          />

          {/* Collapsible Paytable Multipliers */}
          <PaytableDrawer />

          {/* Collapsible Achievements & Streaks Drawer */}
          <AchievementsDrawer stats={stats} achievements={achievements} />

          {/* Bottom Utility Row */}
          <div className="mt-3 flex items-center justify-between px-1 text-[8px] text-purple-400 font-press">
            <button
              type="button"
              disabled={manager.isGameRunning || isBonusMode}
              onClick={handleResetCredits}
              className="hover:text-amber-300 underline underline-offset-2 transition-colors disabled:opacity-50"
            >
              RESET COINS
            </button>

            <span className="font-mono text-[9px] text-purple-300">
              SPINS: {stats.totalSpins}
            </span>

            <button
              type="button"
              onClick={() => setIsRulesOpen(true)}
              className="hover:text-amber-300 underline underline-offset-2 transition-colors"
            >
              RULES
            </button>
          </div>
        </div>

        {/* Retro Cabinet Engine Footer */}
        <footer className="mt-3 text-center text-[7px] text-purple-400 leading-relaxed font-sans max-w-xs">
          Unity OOP Architecture Simulated in WebGL Engine.
          <br />
          PRNG Mersenne Twister • Smooth Deceleration Curves.
        </footer>
      </div>

      {/* Bonus Intro Modal */}
      <BonusIntroModal isOpen={isBonusIntroOpen} onStart={handleStartBonusRound} />

      {/* Bonus Outro Modal */}
      <BonusOutroModal
        isOpen={isBonusOutroOpen}
        totalWon={manager.freeSpinsState.accumulatedWinnings}
        totalSpinsPlayed={manager.freeSpinsState.totalSpins}
        onCollect={handleCollectBonus}
      />

      {/* Rules Modal */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}
