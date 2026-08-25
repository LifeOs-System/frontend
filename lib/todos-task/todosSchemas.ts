// src/lib/todos/todoSchema.ts
import { z } from "zod";

// Schema para la respuesta de una tarea
export const ToDoTaskSchema = z.object({
    id: z.string(),
    name: z.string(),
    date: z.string().nullable(),
});

export type ToDoTask = z.infer<typeof ToDoTaskSchema>;

// Schema para crear una tarea (input)
export const CreateToDoTaskSchema = z.object({
    name: z
        .string("El nombre es obligatorio")
        .min(1, "El nombre no puede estar vacío")
        .max(100, "El nombre no puede exceder los 100 caracteres")
        .trim(),
    date: z
        .string()
        .optional()
        .nullable(),
});

export type CreateToDoTaskDto = z.infer<typeof CreateToDoTaskSchema>;