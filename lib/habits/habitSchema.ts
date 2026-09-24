// schemas/habitSchema.ts
import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const AreaSchema = z.enum(["Health", "Knowledge", "Finance", "Work", "Personal"]);
export const HabitTypeSchema = z.enum(["Binary", "Time", "Quantity"]);
export const HabitStatusSchema = z.enum(["Active", "Paused", "Deleted"]);
export const DayOfWeekSchema = z.enum([
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]);
export const HabitFrequencySchema = z.enum(["Weekly", "Monthly"]).nullable();

export type Area = z.infer<typeof AreaSchema>;
export type HabitType = z.infer<typeof HabitTypeSchema>;
export type HabitStatus = z.infer<typeof HabitStatusSchema>;
export type DayOfWeek = z.infer<typeof DayOfWeekSchema>;

// ─── Create Habit Schema ──────────────────────────────────────────────────────
export const CreateHabitSchema = z.object({
    name: z.string().trim().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
    type: HabitTypeSchema,

    // ➕ NUEVOS CAMPOS agregados para la creación
    frequency: HabitFrequencySchema, // Ya incluye .nullable() por tu definición global
    occurrences: z.number().int().min(1, "Debe ser al menos 1").nullable().optional(),

    target: z.number().positive("Debe ser un número positivo").nullable(),
    unit: z.string().trim().max(20, "La unidad no puede exceder 20 caracteres").nullable(),
    area: AreaSchema,
    days: z.array(DayOfWeekSchema).min(1, "Selecciona al menos un día").max(7, "Máximo 7 días"),
}).superRefine((data, ctx) => {
    // Validación existente: Si no es Binary, requiere target y unit
    if (data.type !== "Binary") {
        if (data.target == null) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Requiere objetivo", path: ["target"] });
        }
        if (data.unit == null || data.unit === "") {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Requiere unidad", path: ["unit"] });
        }
    }

    // ➕ Validación nueva: Si se define una frecuencia, las ocurrencias son obligatorias
    if (data.frequency !== null && (data.occurrences == null || data.occurrences <= 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Debes especificar la cantidad de ocurrencias si eliges una frecuencia",
            path: ["occurrences"]
        });
    }
});

export type CreateHabitDto = z.infer<typeof CreateHabitSchema>;