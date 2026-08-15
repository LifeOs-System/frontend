// lib/sound.ts

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioCtx) {
        const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
                .webkitAudioContext;
        audioCtx = new AudioCtx();
    }
    // Reanudar si está suspendido (requisito de algunos browsers)
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    return audioCtx;
}

/**
 * Genera una alarma con Web Audio API (sin archivos externos).
 * Secuencia de 3 beeps que se repite 5 rondas (~9s).
 */
export function playAlarm() {
    const ctx = getAudioContext();

    const beep = (time: number, freq: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.exponentialRampToValueAtTime(0.4, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.4);
        osc.start(time);
        osc.stop(time + 0.45);
    };

    const now = ctx.currentTime;
    const ROUNDS = 5;
    const roundGap = 1.8;

    for (let i = 0; i < ROUNDS; i++) {
        const base = now + i * roundGap;
        beep(base, 880);
        beep(base + 0.5, 880);
        beep(base + 1.0, 1175);
    }
}