// Web Audio API Synthesizer for BheeshmaPay payment success chimes
export const playPaymentSuccessChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Harmonic pleasant chord (BheeshmaPay signature chime: E5, G#5, B5, E6)
    const notes = [659.25, 830.61, 987.77, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.65);
    });
  } catch (e) {
    console.warn("Audio chime not supported or permitted yet", e);
  }
};
