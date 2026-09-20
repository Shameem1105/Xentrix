// Web Audio API sound utility for web app micro-interactions

class SoundController {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  // Play a short cheerful pop for button clicks
  public playPop() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Ignore audio context errors
    }
  }

  // Play a celebratory chime for adding event to cart / bunk pass generation
  public playSuccess() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + idx * 0.06;
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.15);
      });
    } catch {
      // Ignore audio context errors
    }
  }
  // Iconic Netflix "TA-DUM" sound synthesis using Web Audio API
  public playNetflixTaDum() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // First beat "TA" (Low subtle pulse at 100Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, now); // A2
      osc1.frequency.exponentialRampToValueAtTime(73.42, now + 0.15); // D2
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.2);

      // Second beat "DUM" (Heavy resonant bass hit at now + 0.18s)
      const dumTime = now + 0.18;

      // Sub-bass hit
      const oscSub = ctx.createOscillator();
      const gainSub = ctx.createGain();
      oscSub.type = 'triangle';
      oscSub.frequency.setValueAtTime(146.83, dumTime); // D3
      oscSub.frequency.exponentialRampToValueAtTime(36.71, dumTime + 0.8); // D1
      gainSub.gain.setValueAtTime(0.5, dumTime);
      gainSub.gain.exponentialRampToValueAtTime(0.001, dumTime + 1.2);

      oscSub.connect(gainSub);
      gainSub.connect(ctx.destination);
      oscSub.start(dumTime);
      oscSub.stop(dumTime + 1.2);

      // Resonant Orchestral Timbre (Sawtooth/Triangle chord)
      [146.83, 220.00, 293.66, 440.00].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, dumTime);
        gain.gain.setValueAtTime(0.12, dumTime);
        gain.gain.exponentialRampToValueAtTime(0.001, dumTime + 1.0);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(dumTime);
        osc.stop(dumTime + 1.0);
      });

    } catch {
      // Ignore audio context errors
    }
  }
}

export const soundFx = new SoundController();
