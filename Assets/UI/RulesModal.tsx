import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { MODAL_FRAME_IMG } from '../Prefabs/ReelStripPrefab';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden p-5 border-4 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5)] text-stone-200"
        style={{
          backgroundImage: `url('${MODAL_FRAME_IMG}')`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="relative z-10 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-amber-500/40">
            <h3 className="text-sm font-bold text-amber-300 font-press flex items-center gap-1.5">
              <span>📖</span> ARCADE RULES
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded transition"
              aria-label="Close Rules"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-3 space-y-2.5 text-[8px] font-sans leading-relaxed text-stone-200 bg-black/75 p-3 rounded-xl border border-amber-400/40 max-h-72 overflow-y-auto">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={12} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-press text-[7.5px] block mb-0.5">
                  1. BET SELECTION
                </strong>
                Choose your stake: 10G, 50G, 100G, or MAX (100G). Bets deduct from your player credits.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 size={12} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-press text-[7.5px] block mb-0.5">
                  2. STRICT CENTER PAYLINE
                </strong>
                Match 3 symbols across the dashed center payline to trigger payouts.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 size={12} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-press text-[7.5px] block mb-0.5">
                  3. 10 FREE SPINS BONUS ROUND
                </strong>
                Landing 3x Scatter Bells initiates 10 Free Spins at 0 credit cost with an automatic 3X multiplier on all wins!
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 size={12} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-press text-[7.5px] block mb-0.5">
                  4. BONUS RETRIGGER
                </strong>
                Landing 3x Bells during Free Spins adds +5 additional spins to your counter.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 size={12} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-press text-[7.5px] block mb-0.5">
                  5. PROGRESSIVE JACKPOT (7-7-7)
                </strong>
                Landing 3x Lucky 7s awards the cumulative Progressive Jackpot pool! 10% of each bet feeds the pot.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-900 font-bold rounded-lg text-xs font-press shadow hover:brightness-110 active:translate-y-0.5 transition"
          >
            GOT IT! 🕹️
          </button>
        </div>
      </div>
    </div>
  );
};
