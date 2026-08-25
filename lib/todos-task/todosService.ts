// src/lib/todos/todosService.ts
import { api } from "@/lib/axios";

import { z, ZodError } from "zod";
import {CreateToDoTaskDto, CreateToDoTaskSchema, ToDoTask, ToDoTaskSchema} from "@/lib/todos-task/todosSchemas";

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

export const todoService = {
    /** GET /todotasks — lista completa de tareas */
    async getAll(): Promise<ToDoTask[]> {
        const response = await api.get("/todotasks");
        const parsed = z.array(ToDoTaskSchema).safeParse(response.data);
        if (!parsed.success) {
            console.error("[todoService.getAll] respuesta inválida:", parsed.error);
            throw new Error("Respuesta inválida del servidor");
        }
        return parsed.data;
    },

    /** POST /todotasks — crear tarea */
    async create(dto: CreateToDoTaskDto): Promise<void> {
        const parsedInput = CreateToDoTaskSchema.safeParse(dto);
        if (!parsedInput.success) throw new ValidationError(parsedInput.error);

        await api.post("/todotasks", parsedInput.data);
    },

    /** POST /todotasks/{id}/complete — completar tarea */
    async complete(id: string): Promise<void> {
        await api.post(`/todotasks/${id}/complete`);
    },

    /** DELETE /todotasks/{id} — eliminar tarea */
    async delete(id: string): Promise<void> {
        await api.delete(`/todotasks/${id}`);
    },
};