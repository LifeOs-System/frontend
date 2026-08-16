// schemas/habitSchema.ts
import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const AreaSchema = z.enum(["Health", "Knowledge", "Finance", "Work", "Personal"]);
export const HabitTypeSchema = z.enum(["Binary", "Time", "Quantity"]);
export const HabitStatusSchema = z.enum(["Active", "Paused", "Deleted"]);
export const DayOfWeekSchema = z.enum([
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]);

export type Area = z.infer<typeof AreaSchema>;
export type HabitType = z.infer<typeof HabitTypeSchema>;
export type HabitStatus = z.infer<typeof HabitStatusSchema>;
export type DayOfWeek = z.infer<typeof DayOfWeekSchema>;

// ─── Create Habit Schema ──────────────────────────────────────────────────────
export const CreateHabitSchema = z.object({
    name: z.string().trim().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
    type: HabitTypeSchema,
    target: z.number().positive("Debe ser un número positivo").nullable(),
    unit: z.string().trim().max(20, "La unidad no puede exceder 20 caracteres").nullable(),
    area: AreaSchema,
    days: z.array(DayOfWeekSchema).min(1, "Selecciona al menos un día").max(7, "Máximo 7 días"),
}).superRefine((data, ctx) => {
    if (data.type !== "Binary") {
        if (data.target == null) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Requiere objetivo", path: ["target"] });
        }
        if (data.unit == null || data.unit === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Requiere unidad", path: ["unit"] });
        }
    }
});
export type CreateHabitDto = z.infer<typeof CreateHabitSchema>;

// ─── Habit Schema (lista completa de hábitos) ─────────────────────────────────
export const HabitSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: HabitTypeSchema,
    target: z.number().nullable(),
    unit: z.string().nullable(),
    area: AreaSchema,
    days: z.array(DayOfWeekSchema).min(1),
    startDate: z.string(),
    completionRate: z.number().min(0).max(100),
    completedDays: z.number().min(0),
    totalDays: z.number().min(0),
    status: HabitStatusSchema,
});
export type Habit = z.infer<typeof HabitSchema>;

// ─── HabitToday Schema (vista de "Hoy") ───────────────────────────────────────
export const HabitTodaySchema = z.object({
    id: z.string(),
    name: z.string(),
    type: HabitTypeSchema,
    target: z.number().nullable(),
    value: z.number().nullable(),
    unit: z.string().nullable(),
    isCompleted: z.boolean(),
    area: AreaSchema,
});
export type HabitToday = z.infer<typeof HabitTodaySchema>;

export interface TodayHabit {
    id: string;
    name: string;
    type: HabitType;
    target: number | null;
    unit: string | null;
    area: Area;
    completedToday: boolean;
    todayValue: number | null;
}

// ─── Create Habit Record Schema (POST /api/habit-record) ─────────────────────
// Regla: si viene value NO puede venir isCompleted, y viceversa.
//   - Hábitos Binary      → se manda { isCompleted: true }
//   - Hábitos Time/Quantity → se manda { value: 30 }
export const CreateHabitRecordSchema = z.object({
    habitId: z.string().min(1, "El ID del hábito es requerido"),
    value: z.number().positive("El valor debe ser positivo").nullable().optional(),
    isCompleted: z.boolean().nullable().optional(),
})
    .strict()
    .refine(
        (data) => {
            const hasValue = data.value != null;
            const hasIsCompleted = data.isCompleted != null;
            return hasValue !== hasIsCompleted;
        },
        {
            message: "Debes enviar 'value' o 'isCompleted', no ambos",
            path: ["value"],
        }
    );

export type CreateHabitRecordDto = z.infer<typeof CreateHabitRecordSchema>;

// ─── Last Week Schema (GET /api/habit/last-week) ──────────────────────────────

// "Magnesio · 7 de 7 días"
export const HabitSummaryHighlightSchema = z.object({
    habitId: z.string(),
    habitName: z.string(),
    completedDays: z.number().min(0),
    totalDays: z.number().min(0),
});
export type HabitSummaryHighlight = z.infer<typeof HabitSummaryHighlightSchema>;

// "Miércoles · 50% cumplido"
export const WeakestDaySummarySchema = z.object({
    date: z.string(),
    dayName: z.string(),
    completionPercentage: z.number().min(0).max(100),
});
export type WeakestDaySummary = z.infer<typeof WeakestDaySummarySchema>;

// "+8% · 68% → 76%"
export const WeekComparisonSummarySchema = z.object({
    percentageDifference: z.number(),
    previousWeekPercentage: z.number().min(0).max(100),
    currentWeekPercentage: z.number().min(0).max(100),
});
export type WeekComparisonSummary = z.infer<typeof WeekComparisonSummarySchema>;

// Cabecera de columna: "S 8"
export const WeekDayHeaderSchema = z.object({
    date: z.string(),
    dayLetter: z.string().length(1),
    dayNumber: z.number().int().min(1).max(31),
});
export type WeekDayHeader = z.infer<typeof WeekDayHeaderSchema>;

// Celda: un día de un hábito
export const HabitDaySummarySchema = z.object({
    date: z.string(),
    hasRecord: z.boolean(),
    isCompleted: z.boolean().nullable(),
    value: z.number().nullable(),
    metDailyTarget: z.boolean(),
});
export type HabitDaySummary = z.infer<typeof HabitDaySummarySchema>;

// Fila: resumen semanal de un hábito
export const HabitWeekSummarySchema = z.object({
    habitId: z.string(),
    name: z.string(),
    type: HabitTypeSchema,
    unit: z.string().nullable(),
    completedDays: z.number().min(0),
    totalDays: z.number().min(0),
    weekTotalValue: z.number().nullable(),
    weekTotalTarget: z.number().nullable(),
    dailyTarget: z.number().nullable(),
    weekCompletionPercentage: z.number().min(0).max(100),
    days: z.array(HabitDaySummarySchema),
});
export type HabitWeekSummary = z.infer<typeof HabitWeekSummarySchema>;

// Respuesta completa del endpoint
export const LastWeekResponseSchema = z.object({
    totalHabits: z.number().min(0),
    overallCompletionPercentage: z.number().min(0).max(100),
    startDate: z.string(),
    endDate: z.string(),
    starHabit: HabitSummaryHighlightSchema.nullable(),
    atRiskHabit: HabitSummaryHighlightSchema.nullable(),
    weakestDay: WeakestDaySummarySchema.nullable(),
    weekComparison: WeekComparisonSummarySchema,
    days: z.array(WeekDayHeaderSchema).length(7),
    habits: z.array(HabitWeekSummarySchema),
});

export type LastWeekResponse = z.infer<typeof LastWeekResponseSchema>;