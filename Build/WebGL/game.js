/**
 * Standalone WebGL / Canvas Arcade Slot Engine
 */

const SYMBOLS = [
  { id: 'seven', name: 'Lucky 7', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgKw5qeBaTuvXWKRRz8jzzCoiTbA0At1ZByFaEvSZS9sb5qxkoUTjxM-jEnq8EZn9L_ySOErhaOT5zFzfTpRVgi9BaDuD26Xg4HfgQDJcn3pks33Aw9RkrVr8owkqh5BLZ3YiFVvgxyDil8_GOoPCkq98UeuNm7GHK45DpOZJ4H8hf3UOh-ZQ7bXMvdWMXkanmxsPA_-VNbrSyW98hUGcKHtLA6Ng7IvWImEqd-kOGoOJ6yI1ORHQrXQzKVdqwEffyVDU', payout: 100, weight: 10, isScatter: false },
  { id: 'bar', name: 'Triple BAR', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSTwI4Vc2dO0V7mMpLx99b5B9smAb8M2ZzD3iyQU0fDS5qK6BEEj1_mY8Ivs6UlfECWmVZ1IT-JnswkAaC2HvRSxyS8ny2Hb7kjAJzzN6AVZ_ZTWVGVd6wK5lGltpam2hWtj0tbaMCibrx5HPjCFsyqD45sWKaP-mR_HJ9uTzlDuJ3CasYioF8Ji49imUYdqb420fJ9ULOTzpl1TCa08kjnWEVDUwlEPFEA0oNHHBE8YklYz8T9_wyfQFJqiIFRFE-meQ', payout: 40, weight: 20, isScatter: false },
  { id: 'bell', name: 'Golden Bell', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPTIPurtFnUOx1gnv9Xw19Chj_XS66zW7_YC5HQ3299pk01DU2URGxXQQ7XmG82YzuLZeKqSMAMKcdIt01M5WPRDglm3CkcG3xC79H_IsBgvG_6mDcFCQusJn6mb3wA6o91XfBnMNzBG2MrfxAnRosSVq35WKdXKNKxV5MDsIs256WwPa0Hqc6_VEtxVK2Zvb15mWoS7T16Vz1WNYdK7D5U-A8IKZ236M7G2la9OcH6zXRt0M5PsnQDzYt8-Su17OZYQQ', payout: 25, weight: 26, isScatter: true },
  { id: 'cherry', name: 'Juicy Cherry', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyfHjnbqysOIAwPYo0Yq3WOuC6Hx6WENqgr_C49vhHd1lBpkNqqeKm2dpe98VF5FGAQjTfyFt0wem7rF672fHZPHoCQaego0KWlStpWg8V3MmKB9X_EjH0o-yyGF3DwWlgmHQKL3O7LJMrIZCAgoy41VQCAaEpEB8am9SPnVpgpKBafTNy7hFD5Akrv9_3RQuSXElk0W1YQRfpRq_69AuhIVhc1PKpf5Ro9o9PwAe4wtuyN8RR9zjUS1e-7KuZFxjALA0', payout: 10, weight: 36, isScatter: false }
];

const RNG_POOL = [];
SYMBOLS.forEach(sym => {
  for (let i = 0; i < sym.weight; i++) RNG_POOL.push(sym);
});

const ITEM_HEIGHT = 80;

// Web Audio Engine
const AudioSynth = {
  ctx: null,
  isMuted: false,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },
  playTick() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320 + Math.random() * 80, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  },
  playStop() {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  },
  playWin() {
    if (!this.ctx || this.isMuted) return;
    [330, 392, 523, 659].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.07);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.07 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.07);
      osc.stop(this.ctx.currentTime + i * 0.07 + 0.25);
    });
  }
};

class ReelStrip {
  constructor(index, tapeEl) {
    this.index = index;
    this.tapeEl = tapeEl;
    this.items = [];
    this.init();
  }

  init() {
    this.items = [];
    for (let i = 0; i < 20; i++) {
      this.items.push(RNG_POOL[Math.floor(Math.random() * RNG_POOL.length)]);
    }
    this.render();
    this.tapeEl.style.transform = `translateY(${-ITEM_HEIGHT * 2}px)`;
  }

  render() {
    this.tapeEl.innerHTML = '';
    this.items.forEach(sym => {
      const div = document.createElement('div');
      div.className = 'symbol-item';
      div.innerHTML = `<img src="${sym.img}" alt="${sym.name}" />`;
      this.tapeEl.appendChild(div);
    });
  }

  spin(duration, target, onComplete) {
    const extra = [];
    const count = 35 + this.index * 12;
    for (let i = 0; i < count; i++) {
      extra.push(RNG_POOL[Math.floor(Math.random() * RNG_POOL.length)]);
    }
    extra.push(RNG_POOL[Math.floor(Math.random() * RNG_POOL.length)]);
    extra.push(target);
    extra.push(RNG_POOL[Math.floor(Math.random() * RNG_POOL.length)]);
    extra.push(RNG_POOL[Math.floor(Math.random() * RNG_POOL.length)]);

    this.items = [...this.items.slice(-4), ...extra];
    this.render();

    const startY = 0;
    const targetIdx = this.items.length - 3;
    const endY = -(targetIdx * ITEM_HEIGHT) + 40;
    const startTime = performance.now();
    let lastTick = 0;

    const loop = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = t < 0.7 ? Math.pow(t / 0.7, 1.25) * 0.7 : 0.7 + (1 - Math.pow(1 - (t - 0.7) / 0.3, 3)) * 0.3;
      const currentY = startY + (endY - startY) * ease;
      this.tapeEl.style.transform = `translateY(${currentY}px)`;

      if (Math.abs(currentY - lastTick) > ITEM_HEIGHT) {
        AudioSynth.playTick();
        lastTick = currentY;
      }

      if (t < 1) {
        requestAnimationFrame(loop);
      } else {
        AudioSynth.playStop();
        this.tapeEl.style.transform = `translateY(${endY + 6}px)`;
        setTimeout(() => {
          this.tapeEl.style.transform = `translateY(${endY}px)`;
          if (onComplete) onComplete();
        }, 120);
      }
    };
    requestAnimationFrame(loop);
  }
}

// Game State
let credits = 1000;
let currentBet = 10;
let jackpot = 5000;
let spinsCount = 0;
let isRunning = false;
let isAuto = false;
let inBonus = false;
let bonusLeft = 10;
let bonusTotal = 0;
let reels = [];

window.addEventListener('DOMContentLoaded', () => {
  reels = [
    new ReelStrip(0, document.getElementById('tape0')),
    new ReelStrip(1, document.getElementById('tape1')),
    new ReelStrip(2, document.getElementById('tape2'))
  ];

  setupUI();
  updateHUD();
});

function setupUI() {
  document.querySelectorAll('.bet-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (isRunning || inBonus) return;
      AudioSynth.init();
      const val = btn.dataset.bet;
      currentBet = val === 'max' ? 100 : Number(val);
      document.querySelectorAll('.bet-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('statusBanner').textContent = `BET SET TO ${currentBet}G`;
    });
  });

  document.getElementById('spinBtn').addEventListener('click', executeSpin);
  document.getElementById('leverBtn').addEventListener('click', () => {
    if (isRunning) return;
    AudioSynth.init();
    executeSpin();
  });

  document.getElementById('autoBtn').addEventListener('click', () => {
    if (inBonus) return;
    AudioSynth.init();
    isAuto = !isAuto;
    const btn = document.getElementById('autoBtn');
    btn.querySelector('span').textContent = isAuto ? 'ON' : 'OFF';
    btn.querySelector('span').style.color = isAuto ? '#34d399' : '#d8b4fe';
    if (isAuto && !isRunning) executeSpin();
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    if (isRunning || inBonus) return;
    AudioSynth.init();
    credits = 1000;
    updateHUD();
    document.getElementById('statusBanner').textContent = 'BANKROLL RESTORED TO 1,000G!';
  });

  document.getElementById('soundToggleBtn').addEventListener('click', () => {
    AudioSynth.init();
    AudioSynth.isMuted = !AudioSynth.isMuted;
    document.getElementById('soundToggleBtn').textContent = `AUDIO: ${AudioSynth.isMuted ? 'MUTED' : 'ON'}`;
  });

  document.getElementById('startBonusBtn').addEventListener('click', () => {
    document.getElementById('bonusIntroModal').classList.add('hidden');
    inBonus = true;
    bonusLeft = 10;
    bonusTotal = 0;
    document.getElementById('bonusHud').classList.remove('hidden');
    document.getElementById('hudSpinsLeft').textContent = '10/10';
    document.getElementById('hudBonusTotal').textContent = '0';
    setTimeout(executeSpin, 600);
  });

  document.getElementById('collectBonusBtn').addEventListener('click', () => {
    document.getElementById('bonusOutroModal').classList.add('hidden');
    credits += bonusTotal;
    inBonus = false;
    document.getElementById('bonusHud').classList.add('hidden');
    updateHUD();
    document.getElementById('statusBanner').textContent = `BONUS COLLECTED! +${bonusTotal}G ADDED!`;
  });
}

function updateHUD() {
  document.getElementById('creditDisplay').textContent = credits.toLocaleString();
  document.getElementById('jackpotDisplay').textContent = jackpot.toLocaleString();
  document.getElementById('spinCounter').textContent = `SPINS: ${spinsCount}`;
}

function executeSpin() {
  if (isRunning) return;
  AudioSynth.init();

  if (!inBonus) {
    if (credits < currentBet) {
      document.getElementById('statusBanner').textContent = 'INSUFFICIENT CREDITS!';
      isAuto = false;
      return;
    }
    credits -= currentBet;
    jackpot += Math.floor(currentBet * 0.1);
    spinsCount++;
  } else {
    bonusLeft--;
    document.getElementById('hudSpinsLeft').textContent = `${bonusLeft}/10`;
  }

  isRunning = true;
  updateHUD();
  document.getElementById('statusBanner').textContent = inBonus ? `BONUS SPIN (${10 - bonusLeft}/10)!` : 'SPINNING...';

  // PRNG Result
  const roll = Math.random();
  let s0 = RNG_POOL[Math.floor(Math.random() * RNG_POOL.length)];
  let s1, s2;
  if (!inBonus && roll < 0.12) {
    const bell = SYMBOLS.find(s => s.id === 'bell');
    s0 = s1 = s2 = bell;
  } else if (roll < 0.22) {
    s1 = s2 = s0;
  } else {
    s1 = RNG_POOL[Math.floor(Math.random() * RNG_POOL.length)];
    s2 = RNG_POOL[Math.floor(Math.random() * RNG_POOL.length)];
  }

  const targets = [s0, s1, s2];
  let done = 0;

  reels.forEach((reel, i) => {
    reel.spin(1200 + i * 400, targets[i], () => {
      done++;
      if (done === 3) onSpinFinished(targets);
    });
  });
}

function onSpinFinished(targets) {
  isRunning = false;
  const [s0, s1, s2] = targets;
  let win = 0;
  let msg = 'TRY AGAIN!';
  const mult = inBonus ? 3 : 1;

  if (s0.id === 'bell' && s1.id === 'bell' && s2.id === 'bell') {
    win = currentBet * s0.payout * mult;
    AudioSynth.playWin();
    if (!inBonus) {
      credits += win;
      updateHUD();
      document.getElementById('statusBanner').textContent = `⭐ 3x SCATTERS! 10 FREE SPINS AWARDED! +${win}G ⭐`;
      setTimeout(() => {
        document.getElementById('bonusIntroModal').classList.remove('hidden');
      }, 1000);
      return;
    } else {
      bonusLeft += 5;
      bonusTotal += win;
      msg = `RETRIGGER! +5 SPINS & +${win}G!`;
    }
  } else if (s0.id === s1.id && s1.id === s2.id) {
    if (s0.id === 'seven') {
      win = jackpot * mult;
      jackpot = 5000;
      msg = `🔥 MEGA JACKPOT! 7-7-7! +${win}G!`;
    } else {
      win = currentBet * s0.payout * mult;
      msg = `★ WINNER! 3x ${s0.name}! +${win}G! ★`;
    }
    AudioSynth.playWin();
  } else if ((s0.id === 'cherry' && s1.id === 'cherry') || (s1.id === 'cherry' && s2.id === 'cherry') || (s0.id === 'cherry' && s2.id === 'cherry')) {
    win = currentBet * 3 * mult;
    msg = `🍒 CHERRY BONUS! +${win}G!`;
    AudioSynth.playWin();
  }

  if (inBonus) {
    bonusTotal += win;
    document.getElementById('hudBonusTotal').textContent = bonusTotal.toLocaleString();
    document.getElementById('winDisplay').textContent = win.toLocaleString();
  } else {
    credits += win;
    document.getElementById('winDisplay').textContent = win.toLocaleString();
  }

  document.getElementById('statusBanner').textContent = msg;
  updateHUD();

  if (inBonus) {
    if (bonusLeft > 0) {
      setTimeout(executeSpin, 1200);
    } else {
      setTimeout(() => {
        document.getElementById('outroTotalWon').textContent = `+${bonusTotal.toLocaleString()} G`;
        document.getElementById('bonusOutroModal').classList.remove('hidden');
      }, 1000);
    }
    return;
  }

  if (isAuto && credits >= currentBet) {
    setTimeout(executeSpin, 1200);
  } else if (isAuto) {
    isAuto = false;
  }
}
