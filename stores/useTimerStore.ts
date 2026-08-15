import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TimerState {
    // Configuración (lo que el usuario selecciona)
    hours: number;
    minutes: number;
    seconds: number;

    // Estado en ejecución
    endTime: number | null; // timestamp (ms) cuando debe terminar
    isRunning: boolean;
    hasFinished: boolean;

    // Acciones
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
            isRunning: false,
            hasFinished: false,

            setTime: (h, m, s) =>
                set({ hours: h, minutes: m, seconds: s, hasFinished: false }),

            start: () => {
                const { hours, minutes, seconds, isRunning, endTime } = get();
                if (isRunning) return;

                const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
                if (totalMs === 0) return;

                // Si hay un endTime previo (era pausado), calcular remaining
                let newEnd: number;
                if (endTime && endTime > Date.now()) {
                    newEnd = endTime;
                } else {
                    newEnd = Date.now() + totalMs;
                }

                set({
                    isRunning: true,
                    endTime: newEnd,
                    hasFinished: false,
                });
            },

            pause: () => {
                set({ isRunning: false });
                // No tocamos endTime: al reanudar recalculamos desde ahí
            },

            reset: () => {
                set({
                    isRunning: false,
                    endTime: null,
                    hasFinished: false,
                });
            },

            markFinished: () => {
                set({ isRunning: false, hasFinished: true, endTime: null });
            },

            clearFinished: () => {
                set({ hasFinished: false });
            },

            applyPreset: (secs) => {
                set({
                    hours: Math.floor(secs / 3600),
                    minutes: Math.floor((secs % 3600) / 60),
                    seconds: secs % 60,
                    isRunning: false,
                    endTime: null,
                    hasFinished: false,
                });
            },
        }),
        {
            name: "know-timer",
            // Persistir todo: config + estado de ejecución
            partialize: (state) => ({
                hours: state.hours,
                minutes: state.minutes,
                seconds: state.seconds,
                endTime: state.endTime,
                isRunning: state.isRunning,
                hasFinished: state.hasFinished,
            }),
        }
    )
);