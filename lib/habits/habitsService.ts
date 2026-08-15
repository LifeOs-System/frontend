import { api } from "@/lib/axios";
import {
    CreateHabitSchema,
    CreateHabitRecordSchema,
    HabitSchema,
    HabitTodaySchema,
    type CreateHabitDto,
    type CreateHabitRecordDto,
    type Habit,
    type HabitToday,
} from "@/lib/habits/habitSchema";
import z, { ZodError } from "zod";

export class ValidationError extends Error {
    fieldErrors: Record<string, string>;

    constructor(zodError: ZodError) {
        super("Datos inválidos");
        this.name = "ValidationError";
        this.fieldErrors = Object.fromEntries(
            zodError.issues.map((issue) => [issue.path.join(".") || "form", issue.message])
        );
    }
}

export const habitService = {
    /** GET /habits — lista completa */
    async getAll(): Promise<Habit[]> {
        const response = await api.get("/habits");
        const parsed = z.array(HabitSchema).safeParse(response.data);
        if (!parsed.success) {
            console.error("[habitService.getAll] respuesta inválida:", parsed.error);
            throw new Error("Respuesta inválida del servidor");
        }
        return parsed.data;
    },

    /** GET /habits/today — hábitos del día */
    async getAllToday(): Promise<HabitToday[]> {
        const response = await api.get("/habits/today");
        const parsed = z.array(HabitTodaySchema).safeParse(response.data);
        if (!parsed.success) {
            console.error("[habitService.getAllToday] respuesta inválida:", parsed.error);
            throw new Error("Respuesta inválida del servidor");
        }
        return parsed.data;
    },

    /** POST /habits — crear hábito */
    async create(dto: CreateHabitDto): Promise<void> {
        const parsedInput = CreateHabitSchema.safeParse(dto);
        if (!parsedInput.success) throw new ValidationError(parsedInput.error);

        const payload = {
            ...parsedInput.data,
            target: parsedInput.data.type === "Binary" ? null : parsedInput.data.target,
            unit: parsedInput.data.type === "Binary" ? null : parsedInput.data.unit,
        };

        await api.post("/habits", payload);
    },

    /** POST /api/habit-record — registrar hábito de hoy */
    async createRecord(dto: CreateHabitRecordDto): Promise<void> {
        const parsed = CreateHabitRecordSchema.safeParse(dto);
        if (!parsed.success) throw new ValidationError(parsed.error);

        await api.post("/habit-record", parsed.data);
    },
};