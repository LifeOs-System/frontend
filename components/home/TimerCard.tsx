"use client";

import { Play, Pause, RotateCcw, Volume2, Minus, Plus } from "lucide-react";
import { useTimerStore } from "@/stores/useTimerStore";
import { useTimerTick } from "@/hooks/useTimerTick";

const PRESETS = [
    { label: "5 min", seconds: 5 * 60 },
    { label: "20 min", seconds: 20 * 60 },
    { label: "30 min", seconds: 30 * 60 },
    { label: "60 min", seconds: 60 * 60 },
];

/**
 * Genera una alarma con Web Audio API (sin archivos externos).
 */
function playAlarm() {
    const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
    const ctx = new AudioCtx();

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

export function TimerCard() {
    const {
        hours,
        minutes,
        seconds,
        isRunning: storeRunning,
        hasStarted,  // ⭐ Ahora viene del store
        hasFinished,
        setTime,
        start,
        pause,
        reset,
        clearFinished,
        applyPreset,
    } = useTimerStore();

    const { secondsLeft } = useTimerTick();

    const totalConfigured = hours * 3600 + minutes * 60 + seconds;

    // Display
    const dH = Math.floor(secondsLeft / 3600);
    const dM = Math.floor((secondsLeft % 3600) / 60);
    const dS = secondsLeft % 60;

    const progress =
        totalConfigured > 0 ? (secondsLeft / totalConfigured) * 100 : 0;
    const circumference = 2 * Math.PI * 45;

    const clamp = (v: number, max: number) => Math.max(0, Math.min(max, v));

    const adjust = (
        setter: (h: number, m: number, s: number) => void,
        field: "h" | "m" | "s",
        delta: number,
        max: number
    ) => {
        if (hasStarted) return;
        const cur = { h: hours, m: minutes, s: seconds };
        cur[field] = clamp(cur[field] + delta, max);
        setter(cur.h, cur.m, cur.s);
    };

    // ⭐ Toggle simplificado
    const handleToggle = () => {
        if (hasFinished) {
            clearFinished();
            return;
        }
        if (totalConfigured === 0) return;
        if (storeRunning) {
            pause();
        } else {
            start();
        }
    };

    const handleReset = () => {
        reset();
    };

    const handlePreset = (secs: number) => {
        if (hasStarted) return;
        applyPreset(secs);
    };

    return (
        <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/[0.05] bg-white/[0.01] p-10 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <span className="relative flex h-2 w-2">
                    {storeRunning && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-75" />
                    )}
                    <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${
                            hasFinished
                                ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                                : storeRunning
                                    ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                    : "bg-white/50"
                        }`}
                    />
                </span>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
                    Temporizador
                </p>
            </div>

            {/* Anillo de progreso + display */}
            <div className="relative mb-6 h-56 w-56">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="2"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray={`${(progress / 100) * circumference}, ${circumference}`}
                        strokeLinecap="round"
                        className={`transition-all duration-1000 ease-linear ${
                            storeRunning || hasFinished
                                ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                : ""
                        }`}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {hasFinished ? (
                        <span className="text-3xl font-bold text-white animate-pulse drop-shadow-[0_0_16px_rgba(255,255,255,0.6)]">
                            ¡Tiempo!
                        </span>
                    ) : (
                        <div className="flex items-baseline gap-1">
                            {dH > 0 && (
                                <>
                                    <span className="text-4xl font-bold tabular-nums text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                                        {dH.toString().padStart(2, "0")}
                                    </span>
                                    <span className="text-white/30 text-2xl font-light">:</span>
                                </>
                            )}
                            <span className="text-4xl font-bold tabular-nums text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                                {dM.toString().padStart(2, "0")}
                            </span>
                            <span className="text-white/30 text-2xl font-light">:</span>
                            <span className="text-4xl font-bold tabular-nums text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                                {dS.toString().padStart(2, "0")}
                            </span>
                        </div>
                    )}
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-2">
                        {hasFinished
                            ? "tiempo cumplido"
                            : hasStarted
                                ? storeRunning
                                    ? "en curso"
                                    : "pausado"
                                : "configura el tiempo"}
                    </p>
                </div>
            </div>

            {/* Editor de tiempo (solo cuando no ha iniciado) */}
            {!hasStarted && (
                <div className="mb-6 flex items-center gap-4">
                    <TimeField
                        label="H"
                        value={hours}
                        onDec={() => adjust(setTime, "h", -1, 23)}
                        onInc={() => adjust(setTime, "h", 1, 23)}
                    />
                    <span className="text-white/30 text-xl font-light">:</span>
                    <TimeField
                        label="M"
                        value={minutes}
                        onDec={() => adjust(setTime, "m", -1, 59)}
                        onInc={() => adjust(setTime, "m", 1, 59)}
                    />
                    <span className="text-white/30 text-xl font-light">:</span>
                    <TimeField
                        label="S"
                        value={seconds}
                        onDec={() => adjust(setTime, "s", -1, 59)}
                        onInc={() => adjust(setTime, "s", 1, 59)}
                    />
                </div>
            )}

            {/* Presets */}
            {!hasStarted && (
                <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
                    {PRESETS.map((p) => (
                        <button
                            key={p.seconds}
                            onClick={() => handlePreset(p.seconds)}
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wider transition-all ${
                                totalConfigured === p.seconds
                                    ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                                    : "border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20"
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Controles */}
            <div className="flex items-center gap-3">
                <button
                    onClick={handleReset}
                    disabled={!hasStarted}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-white/60 transition-all hover:bg-white/[0.06] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Reiniciar"
                >
                    <RotateCcw size={18} />
                </button>

                <button
                    onClick={handleToggle}
                    disabled={!hasFinished && totalConfigured === 0}
                    className={`flex h-16 w-16 items-center justify-center rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                        storeRunning
                            ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                            : "border border-white/20 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                    }`}
                    aria-label={storeRunning ? "Pausar" : "Iniciar"}
                >
                    {storeRunning ? (
                        <Pause size={24} fill="currentColor" />
                    ) : (
                        <Play size={24} fill="currentColor" className="translate-x-0.5" />
                    )}
                </button>

                <button
                    onClick={playAlarm}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-white/60 transition-all hover:bg-white/[0.06] hover:text-white"
                    aria-label="Probar sonido"
                    title="Probar sonido"
                >
                    <Volume2 size={18} />
                </button>
            </div>
        </div>
    );
}

function TimeField({
                       label,
                       value,
                       onDec,
                       onInc,
                   }: {
    label: string;
    value: number;
    onDec: () => void;
    onInc: () => void;
}) {
    return (
        <div className="flex flex-col items-center gap-1">
            <button
                onClick={onInc}
                className="flex h-7 w-9 items-center justify-center rounded-md border border-white/[0.08] text-white/50 transition-all hover:bg-white/[0.06] hover:text-white"
                aria-label={`Aumentar ${label}`}
            >
                <Plus size={13} />
            </button>
            <div className="flex flex-col items-center">
                <span className="text-2xl font-semibold tabular-nums text-white w-12 text-center">
                    {value.toString().padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-white/40">
                    {label}
                </span>
            </div>
            <button
                onClick={onDec}
                className="flex h-7 w-9 items-center justify-center rounded-md border border-white/[0.08] text-white/50 transition-all hover:bg-white/[0.06] hover:text-white"
                aria-label={`Disminuir ${label}`}
            >
                <Minus size={13} />
            </button>
        </div>
    );
}