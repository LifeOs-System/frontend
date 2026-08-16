import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TimerState {
    // Configuración
    hours: number;
    minutes: number;
    seconds: number;

    // Estado de ejecución
    endTime: number | null;      // timestamp de fin (solo mientras corre)
    remainingMs: number | null;  // tiempo restante congelado (solo en pausa)
    isRunning: boolean;
    hasStarted: boolean;
    hasFinished: boolean;

    setTime: (h: number, m: number, s: number) => void;
    start: () => void;
    pause: () => void;
    reset: () => void;
    markFinished: () => void;
    clearFinished: () => void;
    applyPreset: (secs: number) => void;
}

export const useTimerStore = create<TimerState>()(
    persist(
        (set, get) => ({
            hours: 0,
            minutes: 25,
            seconds: 0,
            endTime: null,
            remainingMs: null,
            isRunning: false,
            hasStarted: false,
            hasFinished: false,

            setTime: (h, m, s) =>
                set({
                    hours: h,
                    minutes: m,
                    seconds: s,
                    endTime: null,
                    remainingMs: null,
                    hasStarted: false,
                    hasFinished: false,
                }),

            start: () => {
                const { isRunning, remainingMs, hours, minutes, seconds } = get();
                if (isRunning) return;

                // ⭐ Si venía de una pausa, uso el restante congelado;
                // si no, el tiempo configurado
                const baseMs =
                    remainingMs ?? (hours * 3600 + minutes * 60 + seconds) * 1000;
                if (baseMs <= 0) return;

                set({
                    isRunning: true,
                    hasStarted: true,
                    hasFinished: false,
                    endTime: Date.now() + baseMs, // ⭐ endTime nuevo desde AHORA
                    remainingMs: null,
                });
            },

            pause: () => {
                const { isRunning, endTime } = get();
                if (!isRunning || !endTime) return;

                // ⭐ Congelo el restante exacto al momento de pausar
                const rem = Math.max(0, endTime - Date.now());

                if (rem <= 0) {
                    set({ isRunning: false, endTime: null, remainingMs: null, hasFinished: true });
                    return;
                }

                set({ isRunning: false, endTime: null, remainingMs: rem });
            },

            reset: () =>
                set({
                    isRunning: false,
                    endTime: null,
                    remainingMs: null,
                    hasStarted: false,
                    hasFinished: false,
                }),

            markFinished: () =>
                set({ isRunning: false, endTime: null, remainingMs: null, hasFinished: true }),

            clearFinished: () =>
                set({ hasFinished: false, hasStarted: false, endTime: null, remainingMs: null }),

            applyPreset: (secs) =>
                set({
                    hours: Math.floor(secs / 3600),
                    minutes: Math.floor((secs % 3600) / 60),
                    seconds: secs % 60,
                    isRunning: false,
                    endTime: null,
                    remainingMs: null,
                    hasStarted: false,
                    hasFinished: false,
                }),
        }),
        {
            name: "know-timer",
            partialize: (s) => ({
                hours: s.hours,
                minutes: s.minutes,
                seconds: s.seconds,
                endTime: s.endTime,
                remainingMs: s.remainingMs,
                isRunning: s.isRunning,
                hasStarted: s.hasStarted,
                hasFinished: s.hasFinished,
            }),
        }
    )
);