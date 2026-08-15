// mocks/habits.ts

export type HabitKind = "binary" | "quantity" | "time";

export interface WeekDay {
    date: string; // ISO
    label: string; // letra del día
    dayNum: number;
}

export interface Habit {
    id: string;
    name: string;
    category: string;
    kind: HabitKind;
    unit?: string;
    unitShort?: string;
    dailyGoal?: number;
    activeDays: string[]; // fechas activas
}

export interface DailyRecord {
    habitId: string;
    date: string;
    completed: boolean;
    value?: number;
}

// ⭐ Últimos 7 días (hoy = 15 → se muestra 8–14)
export const WEEK_DAYS: WeekDay[] = [
    { date: "2026-08-08", label: "S", dayNum: 8 },
    { date: "2026-08-09", label: "D", dayNum: 9 },
    { date: "2026-08-10", label: "L", dayNum: 10 },
    { date: "2026-08-11", label: "M", dayNum: 11 },
    { date: "2026-08-12", label: "M", dayNum: 12 },
    { date: "2026-08-13", label: "J", dayNum: 13 },
    { date: "2026-08-14", label: "V", dayNum: 14 },
];

const ALL_DAYS = WEEK_DAYS.map((d) => d.date);

export const HABITS_MOCK: Habit[] = [
    { id: "h1", name: "Tomar Creatina", category: "SALUD", kind: "binary", activeDays: ALL_DAYS },
    { id: "h2", name: "Tomar Magnesio", category: "SALUD", kind: "binary", activeDays: ALL_DAYS },
    { id: "h3", name: "Tomar Omega", category: "SALUD", kind: "binary", activeDays: ALL_DAYS },
    { id: "h4", name: "Hacer Cardio", category: "SALUD", kind: "binary", activeDays: ALL_DAYS },
    { id: "h5", name: "Ir al Gimnasio", category: "SALUD", kind: "binary", activeDays: ALL_DAYS },
    { id: "h6", name: "Consumir Proteina", category: "SALUD", kind: "quantity", unit: "gramos", unitShort: "g", dailyGoal: 120, activeDays: ALL_DAYS },
    { id: "h7", name: "Coursera", category: "CONOCIMIENTO", kind: "quantity", unit: "leccion", unitShort: "lec", dailyGoal: 1, activeDays: ALL_DAYS },
    { id: "h8", name: "Leer", category: "CONOCIMIENTO", kind: "time", unit: "minutos", unitShort: "min", dailyGoal: 30, activeDays: ALL_DAYS },
    { id: "h9", name: "Estudiar ingles", category: "CONOCIMIENTO", kind: "time", unit: "minutos", unitShort: "min", dailyGoal: 30, activeDays: ["2026-08-08", "2026-08-10", "2026-08-13", "2026-08-14"] },
];

export const WEEKLY_RECORDS_MOCK: DailyRecord[] = [
    // Creatina: falló el 12
    { habitId: "h1", date: "2026-08-08", completed: true },
    { habitId: "h1", date: "2026-08-09", completed: true },
    { habitId: "h1", date: "2026-08-10", completed: true },
    { habitId: "h1", date: "2026-08-11", completed: true },
    { habitId: "h1", date: "2026-08-12", completed: false },
    { habitId: "h1", date: "2026-08-13", completed: true },
    { habitId: "h1", date: "2026-08-14", completed: true },

    // Magnesio: perfecto
    { habitId: "h2", date: "2026-08-08", completed: true },
    { habitId: "h2", date: "2026-08-09", completed: true },
    { habitId: "h2", date: "2026-08-10", completed: true },
    { habitId: "h2", date: "2026-08-11", completed: true },
    { habitId: "h2", date: "2026-08-12", completed: true },
    { habitId: "h2", date: "2026-08-13", completed: true },
    { habitId: "h2", date: "2026-08-14", completed: true },

    // Omega: falló el 13
    { habitId: "h3", date: "2026-08-08", completed: true },
    { habitId: "h3", date: "2026-08-09", completed: true },
    { habitId: "h3", date: "2026-08-10", completed: true },
    { habitId: "h3", date: "2026-08-11", completed: true },
    { habitId: "h3", date: "2026-08-12", completed: true },
    { habitId: "h3", date: "2026-08-13", completed: false },
    { habitId: "h3", date: "2026-08-14", completed: true },

    // Cardio: 8, 10, 12, 14
    { habitId: "h4", date: "2026-08-08", completed: true },
    { habitId: "h4", date: "2026-08-09", completed: false },
    { habitId: "h4", date: "2026-08-10", completed: true },
    { habitId: "h4", date: "2026-08-11", completed: false },
    { habitId: "h4", date: "2026-08-12", completed: true },
    { habitId: "h4", date: "2026-08-13", completed: false },
    { habitId: "h4", date: "2026-08-14", completed: true },

    // Gimnasio: 9, 11, 13
    { habitId: "h5", date: "2026-08-08", completed: false },
    { habitId: "h5", date: "2026-08-09", completed: true },
    { habitId: "h5", date: "2026-08-10", completed: false },
    { habitId: "h5", date: "2026-08-11", completed: true },
    { habitId: "h5", date: "2026-08-12", completed: false },
    { habitId: "h5", date: "2026-08-13", completed: true },
    { habitId: "h5", date: "2026-08-14", completed: false },

    // Proteína (120g): 750 / 840 = 89%
    { habitId: "h6", date: "2026-08-08", completed: true, value: 130 },
    { habitId: "h6", date: "2026-08-09", completed: false, value: 80 },
    { habitId: "h6", date: "2026-08-10", completed: true, value: 120 },
    { habitId: "h6", date: "2026-08-11", completed: false, value: 60 },
    { habitId: "h6", date: "2026-08-12", completed: true, value: 150 },
    { habitId: "h6", date: "2026-08-13", completed: true, value: 120 },
    { habitId: "h6", date: "2026-08-14", completed: false, value: 90 },

    // Coursera (1 lec): 6 / 7
    { habitId: "h7", date: "2026-08-08", completed: true, value: 1 },
    { habitId: "h7", date: "2026-08-09", completed: true, value: 1 },
    { habitId: "h7", date: "2026-08-10", completed: false, value: 0 },
    { habitId: "h7", date: "2026-08-11", completed: true, value: 1 },
    { habitId: "h7", date: "2026-08-12", completed: false, value: 0 },
    { habitId: "h7", date: "2026-08-13", completed: true, value: 1 },
    { habitId: "h7", date: "2026-08-14", completed: true, value: 2 },

    // Leer (30min): 240 / 210 = 114%
    { habitId: "h8", date: "2026-08-08", completed: false, value: 0 },
    { habitId: "h8", date: "2026-08-09", completed: true, value: 90 },
    { habitId: "h8", date: "2026-08-10", completed: false, value: 0 },
    { habitId: "h8", date: "2026-08-11", completed: true, value: 45 },
    { habitId: "h8", date: "2026-08-12", completed: false, value: 15 },
    { habitId: "h8", date: "2026-08-13", completed: true, value: 60 },
    { habitId: "h8", date: "2026-08-14", completed: true, value: 30 },

    // Inglés (activo 8, 10, 13, 14): 105 / 120
    { habitId: "h9", date: "2026-08-08", completed: true, value: 30 },
    { habitId: "h9", date: "2026-08-10", completed: true, value: 45 },
    { habitId: "h9", date: "2026-08-13", completed: false, value: 0 },
    { habitId: "h9", date: "2026-08-14", completed: true, value: 30 },
];