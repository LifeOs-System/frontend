import { api } from "@/lib/axios";
import z, { ZodError } from "zod";
import {CreateHabitDto, CreateHabitSchema} from "@/lib/habits/habitSchema";
import {Habit, TodayHabit} from "@/lib/habits/types";
import {CreateHabitRecordDto, CreateHabitRecordSchema} from "@/lib/habits/habitRecordSchema";

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
        // Axios infiere el tipo de retorno gracias a <Habit[]>
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


};