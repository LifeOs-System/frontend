import { api } from "@/lib/axios";
import z, { ZodError } from "zod";
import { CreateHabitDto, CreateHabitSchema } from "@/lib/habits/habitSchema";
import { GetLast30DaysResponse, Habit, TodayHabit } from "@/lib/habits/types";
import { CreateHabitRecordDto, CreateHabitRecordSchema } from "@/lib/habits/habitRecordSchema";

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

// Schema Zod para validar la respuesta de last30days
const Last30DaysResponseSchema = z.object({
    habits: z.array(
        z.object({
            name: z.string(),
            type: z.enum(["Binary", "Quantity", "Time"]),
            status: z.enum(["Active", "Paused", "Deleted"]),
            startDate: z.string().nullable(),
            target: z.number().nullable(),
            unit: z.string().nullable(),
            area: z.string(),
            days: z.array(z.enum(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])),
            frequency: z.enum(["Weekly"]).nullable(),
            occurrences: z.number().nullable(),
            records: z.array(
                z.object({
                    date: z.string(),
                    value: z.number().nullable(),
                    target: z.number().nullable(),
                    isCompleted: z.boolean(),
                })
            ),
        })
    ),
});

export const habitService = {
    async getAll(): Promise<Habit[]> {
        const response = await api.get<Habit[]>("/habits");
        return response.data;
    },

    async getAllToday(): Promise<TodayHabit[]> {
        const response = await api.get<TodayHabit[]>("/habits/today");
        return response.data;
    },

    async createRecord(dto: CreateHabitRecordDto): Promise<void> {
        const parsed = CreateHabitRecordSchema.safeParse(dto);
        if (!parsed.success) throw new ValidationError(parsed.error);

        await api.post("/habit-record", parsed.data);
    },

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

    /** GET /habits/last30days — hábitos con registros de los últimos 30 días */
    async getLast30Days(): Promise<GetLast30DaysResponse> {
        const response = await api.get("/habits/last30days");

        // Validar la respuesta con Zod
        const parsed = Last30DaysResponseSchema.safeParse(response.data);
        if (!parsed.success) {
            console.error("Respuesta inválida de /habits/last30days:", parsed.error);
            throw new Error("Formato de respuesta inválido");
        }

        return parsed.data;
    },
};