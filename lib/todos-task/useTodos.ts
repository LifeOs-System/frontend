// src/features/todos/useTodos.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/components/Toast";
import {CreateToDoTaskDto, ToDoTask} from "@/lib/todos-task/todosSchemas";
import {todoService} from "@/lib/todos-task/todosService";
import {ValidationError} from "@/lib/habits/habitsService"; // Ajusta la ruta si es diferente

// Claves de caché para React Query
export const todoKeys = {
    all: ["todos"] as const,
};

/** GET /todotasks — lista completa de tareas */
export function useTodos() {
    return useQuery<ToDoTask[]>({
        queryKey: todoKeys.all,
        queryFn: () => todoService.getAll(),
        staleTime: 60_000, // 1 minuto
        retry: 1,
    });
}

/** POST /todotasks — crear una nueva tarea */
export function useCreateTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateToDoTaskDto) => todoService.create(dto),
        onSuccess: (_, dto) => {
            notify.success({
                title: "¡Tarea creada!",
                description: `"${dto.name}" se añadió a tu lista.`,
            });
            // Invalida la caché para que la lista se actualice automáticamente
            queryClient.invalidateQueries({ queryKey: todoKeys.all });
        },
        onError: (error) => {
            if (error instanceof ValidationError) {
                notify.error({
                    title: "Revisa el formulario",
                    description: Object.values(error.fieldErrors)[0],
                });
            } else {
                notify.error({
                    title: "Error del servidor",
                    description: "No se pudo crear la tarea. Intenta de nuevo.",
                });
            }
        },
    });
}

/** POST /todotasks/{id}/complete — marcar tarea como completada */
export function useCompleteTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => todoService.complete(id),
        onSuccess: () => {
            notify.success({
                title: "¡Tarea completada!",
                description: "Buen trabajo, sigue así.",
            });
            queryClient.invalidateQueries({ queryKey: todoKeys.all });
        },
        onError: () => {
            notify.error({
                title: "Error",
                description: "No se pudo completar la tarea.",
            });
        },
    });
}

/** DELETE /todotasks/{id} — eliminar una tarea */
export function useDeleteTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => todoService.delete(id),
        onSuccess: () => {
            notify.success({
                title: "Tarea eliminada",
                description: "La tarea ha sido eliminada correctamente.",
            });
            queryClient.invalidateQueries({ queryKey: todoKeys.all });
        },
        onError: () => {
            notify.error({
                title: "Error",
                description: "No se pudo eliminar la tarea.",
            });
        },
    });
}