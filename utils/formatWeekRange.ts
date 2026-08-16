// lib/formatWeekRange.ts

import {LastWeekResponse} from "@/lib/habits/habitSchema";

const MONTH_NAMES = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic",
];

// ⭐ Parsea "2026-08-09" sin crear un Date (evita el shift de zona horaria)
function parseDateOnly(value: string): { day: number; monthIndex: number } {
    const [, month, day] = value.split("-").map(Number);
    return { day, monthIndex: month - 1 };
}

export function formatWeekRange(data: LastWeekResponse): string {
    const start = parseDateOnly(data.startDate);
    const end = parseDateOnly(data.endDate);

    const sameMonth = start.monthIndex === end.monthIndex;

    const range = sameMonth
        ? `${start.day} – ${end.day} ${MONTH_NAMES[end.monthIndex]}`
        : `${start.day} ${MONTH_NAMES[start.monthIndex]} – ${end.day} ${MONTH_NAMES[end.monthIndex]}`;

    return `${data.totalHabits} hábitos · ${data.overallCompletionPercentage}% cumplimiento · ${range}`;
}

export function getWeekNumber(dateStr: string): number {
    // ⭐ Date en tiempo LOCAL, no UTC
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const startOfYear = new Date(year, 0, 1);

    const diff = date.getTime() - startOfYear.getTime();
    return Math.ceil((diff / 86400000 + startOfYear.getDay() + 1) / 7);
}