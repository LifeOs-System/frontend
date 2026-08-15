// utils/labels.ts
import type { Area, DayOfWeek, HabitType, HabitStatus } from "@/lib/habits/habitSchema";

// ─── Áreas ────────────────────────────────────────────────────────────────────
export const AREA_LABELS: Record<Area, string> = {
    Health: "Salud",
    Knowledge: "Conocimiento",
    Finance: "Finanza",
    Work: "Trabajo",
    Personal: "Personal",
};
export const AREAS = Object.keys(AREA_LABELS) as Area[];

// ─── Días de la semana ────────────────────────────────────────────────────────
export const DAY_LABELS: Record<DayOfWeek, string> = {
    Monday: "L",
    Tuesday: "M",
    Wednesday: "M",
    Thursday: "J",
    Friday: "V",
    Saturday: "S",
    Sunday: "D",
};
export const DAYS = Object.keys(DAY_LABELS) as DayOfWeek[];

// ─── Tipos de hábito ──────────────────────────────────────────────────────────
export const HABIT_TYPE_LABELS: Record<HabitType, { label: string; subtitle: string }> = {
    Binary:   { label: "Binario",  subtitle: "¿Lo hice?" },
    Time:     { label: "Tiempo",   subtitle: "¿Cuánto tiempo?" },
    Quantity: { label: "Cantidad", subtitle: "¿Cuánto?" },
};
export const HABIT_TYPES = Object.keys(HABIT_TYPE_LABELS) as HabitType[];

// ─── Estados de hábito ────────────────────────────────────────────────────────
export const HABIT_STATUS_LABELS: Record<HabitStatus, string> = {
    Active:  "Activo",
    Paused:  "Pausado",
    Deleted: "Eliminado",
};