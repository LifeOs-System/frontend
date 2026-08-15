"use client";

import { useTimerAlarm } from "@/hooks/useTimerAlarm";

export function TimerAlarmProvider() {
    useTimerAlarm();
    return null; // no renderiza nada
}