// hooks/useTimerAlarm.ts
"use client";

import { useEffect, useRef } from "react";
import { useTimerStore } from "@/stores/useTimerStore";
import { playAlarm } from "@/lib/sound";

/**
 * Hook global que detecta cuando el timer termina (incluso en background)
 * y toca la alarma + marca hasFinished en el store.
 *
 * Debe montarse en el layout de la app, NO en el componente del timer.
 */
export function useTimerAlarm() {
    const endTime = useTimerStore((s) => s.endTime);
    const isRunning = useTimerStore((s) => s.isRunning);
    const markFinished = useTimerStore((s) => s.markFinished);

    const alarmTriggeredRef = useRef<number | null>(null);

    useEffect(() => {
        // Si no hay timer corriendo, resetear el flag
        if (!isRunning || !endTime) {
            alarmTriggeredRef.current = null;
            return;
        }

        // Marcar el endTime que estamos monitoreando
        if (alarmTriggeredRef.current !== endTime) {
            alarmTriggeredRef.current = endTime;
        }

        // Verificar inmediatamente si ya pasó el tiempo
        const checkNow = () => {
            if (!endTime) return;
            const left = endTime - Date.now();

            if (left <= 0) {
                playAlarm();
                markFinished();
                return true;
            }
            return false;
        };

        if (checkNow()) return;

        // Programar la alarma exactamente cuando debe sonar
        const timeout = setTimeout(() => {
            playAlarm();
            markFinished();
        }, endTime - Date.now());

        // Tick de respaldo cada segundo (por si el setTimeout se retrasa)
        const interval = setInterval(() => {
            if (checkNow()) {
                clearInterval(interval);
            }
        }, 1000);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [endTime, isRunning, markFinished]);
}