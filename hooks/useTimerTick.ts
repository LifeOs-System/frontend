"use client";

import { useEffect, useState } from "react";
import { useTimerStore } from "@/stores/useTimerStore";

/**
 * Devuelve los segundos restantes calculados desde el timestamp del stores.
 * Funciona incluso si el componente se desmonta y remonta.
 */
export function useTimerTick() {
    const endTime = useTimerStore((s) => s.endTime);
    const isRunning = useTimerStore((s) => s.isRunning);
    const hasFinished = useTimerStore((s) => s.hasFinished);
    const markFinished = useTimerStore((s) => s.markFinished);

    const computeLeft = () => {
        if (!endTime) return 0;
        return Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    };

    const [secondsLeft, setSecondsLeft] = useState(() => computeLeft());

    useEffect(() => {
        if (!isRunning || !endTime) return;

        const tick = () => {
            const left = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setSecondsLeft(left);

            if (left <= 0) {
                markFinished();
            }
        };

        // Tick inmediato para sincronizar
        tick();

        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [isRunning, endTime, markFinished]);

    // Cuando no está corriendo, reflejar el tiempo configurado
    useEffect(() => {
        if (!isRunning && !hasFinished) {
            setSecondsLeft(computeLeft());
        }
    }, [isRunning, hasFinished]);

    return { secondsLeft, isRunning, hasFinished, endTime };
}