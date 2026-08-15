"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    type CreateHabitDto,
    type CreateHabitRecordDto,
} from "@/lib/habits/habitSchema";
import { habitService, ValidationError } from "@/lib/habits/habitsService";
import { notify } from "@/components/Toast";

export const habitKeys = {
    all: ["habits"] as const,
    today: ["habits", "today"] as const,
};

export function useHabits() {
    return useQuery({
        queryKey: habitKeys.all,
        queryFn: () => habitService.getAll(),
        staleTime: 60_000,
        retry: 1,
    });
}

export function useTodayHabits() {
    return useQuery({
        queryKey: habitKeys.today,
        queryFn: () => habitService.getAllToday(),
        staleTime: 60_000,
        retry: 1,
    });
}

export function useCreateHabit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateHabitDto) => habitService.create(dto),
        onSuccess: (_, dto) => {
            notify.success({
                title: "¡Hábito creado!",
                description: `"${dto.name}" se añadió a tu rutina.`,
            });
            queryClient.invalidateQueries({ queryKey: habitKeys.all });
            queryClient.invalidateQueries({ queryKey: habitKeys.today });
        },
        onError: (error) => {
            if (error instanceof ValidationError) {
                notify.error({
                    title: "Revisa el formulario",
                    description: Object.values(error.fieldErrors)[0],
                });
            }
        },
    });
}

/** POST /habit-record — toggle (Binary) o registrar valor (Time/Quantity) */
export function useCreateHabitRecord() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateHabitRecordDto) => habitService.createRecord(dto),

        onSuccess: (_, dto) => {
            // Mensaje según tipo de acción
            const isToggle = dto.isCompleted != null;
            notify.success({
                title: isToggle
                    ? (dto.isCompleted ? "¡Bien hecho!" : "Marcado como pendiente")
                    : "¡Registro guardado!",
                description: isToggle
                    ? undefined
                    : `Registrado correctamente.`,
            });
            queryClient.invalidateQueries({ queryKey: habitKeys.today });
        },

        onError: (error) => {
            if (error instanceof ValidationError) {
                notify.error({
                    title: "Error al registrar",
                    description: Object.values(error.fieldErrors)[0],
                });
            }
        },
    });
}