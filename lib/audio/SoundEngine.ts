/**
 * Web Audio API Procedural Sound Engine
 * Creative Direction: Cinematic Minimalism + Warm Ambient Design + Subtle Digital Interactions
 *
 * 100% Procedural synthesis:
 * - 0 KB download, zero external asset dependencies
 * - 100% Royalty-Free / CC0 by definition (procedural synthesis)
 * - Zero latency, native browser DSP
 * - Safe audio unlocking on user gesture
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isEnabled: boolean = false;
  private volume: number = 0.5;
  private lastTriggerTime: Record<string, number> = {};

  constructor() {
    // Lazy initialization on client gesture
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;

      try {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      } catch (err) {
        console.warn('Web Audio API initialization failed:', err);
        return null;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (enabled) {
      this.getContext();
    }
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  private shouldRateLimit(key: string, cooldownMs: number): boolean {
    const now = Date.now();
    const last = this.lastTriggerTime[key] || 0;
    if (now - last < cooldownMs) return true;
    this.lastTriggerTime[key] = now;
    return false;
  }

  /**
   * Subtle Mechanical Tactile Tap
   * Dual-frequency damped burst resembling walnut wood or refined mechanical keyboard switch.
   * Used for project card selection, language switch, modal tabs.
   */
  public playMechanicalClick(variant: 'light' | 'deep' = 'light') {
    if (!this.isEnabled) return;
    if (this.shouldRateLimit('click', 80)) return;

    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    const baseFreq = variant === 'deep' ? 360 : 720;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.035);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.035);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  /**
   * Warm Pentatonic Harmonic Chime
   * Soft resonant bell for section transitions and milestone steps.
   */
  public playChime(freq = 523.25) {
    // 523.25 = C5
    if (!this.isEnabled) return;
    if (this.shouldRateLimit('chime', 400)) return;

    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.5, now); // perfect fifth overtone

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.7);
    osc2.stop(now + 0.7);
  }

  /**
   * Mediterranean Breeze / Act Transition Whoosh
   * Soft bandpass-filtered noise swell across stone threshold.
   */
  public playTransitionWhoosh() {
    if (!this.isEnabled) return;
    if (this.shouldRateLimit('whoosh', 900)) return;

    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    const bufferSize = ctx.sampleRate * 0.45; // 450ms
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.8;

    const now = ctx.currentTime;
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.exponentialRampToValueAtTime(950, now + 0.2);
    filter.frequency.exponentialRampToValueAtTime(250, now + 0.45);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.46);
  }

  /**
   * Instant Positive Feedback Micro-Chime
   * Two rising notes for copy email or successful download.
   */
  public playFeedbackChime() {
    if (!this.isEnabled) return;
    if (this.shouldRateLimit('feedback', 250)) return;

    const ctx = this.getContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const notes = [659.25, 880.0]; // E5 -> A5

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  /**
   * Cleanup resources on teardown
   */
  public cleanup() {
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch {}
      this.ctx = null;
      this.masterGain = null;
    }
  }
}

export const soundEngine = new SoundEngine();

