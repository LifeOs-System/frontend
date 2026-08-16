"use client";

import { useEffect, useState } from "react";
import { useTimerStore } from "@/stores/useTimerStore";

export function useTimerTick() {
    const endTime = useTimerStore((s) => s.endTime);
    const isRunning = useTimerStore((s) => s.isRunning);
    const remainingMs = useTimerStore((s) => s.remainingMs);
    const hours = useTimerStore((s) => s.hours);
    const minutes = useTimerStore((s) => s.minutes);
    const seconds = useTimerStore((s) => s.seconds);
    const markFinished = useTimerStore((s) => s.markFinished);

    const configured = hours * 3600 + minutes * 60 + seconds;

    const compute = () => {
        if (isRunning && endTime) {
            return Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        }
        if (remainingMs != null) {
            // ⭐ En pausa muestro el tiempo congelado, no avanza
            return Math.max(0, Math.ceil(remainingMs / 1000));
        }
        return configured;
    };

    const [secondsLeft, setSecondsLeft] = useState(compute);

    useEffect(() => {
        if (!isRunning) {
            setSecondsLeft(compute());
            return;
        }

        const tick = () => {
            if (!endTime) return;
            const left = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setSecondsLeft(left);
            if (left <= 0) markFinished();
        };

        tick();
        const id = setInterval(tick, 250);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRunning, endTime, remainingMs, configured]);

    return { secondsLeft, isRunning };
}