"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    type CreateHabitDto,
} from "@/lib/habits/habitSchema";
import { habitService, ValidationError } from "@/lib/habits/habitsService";
import { notify } from "@/components/Toast";
import { CreateHabitRecordDto } from "@/lib/habits/habitRecordSchema";
import {HabitAnalysisInput, HabitInput} from "@/app/(app)/habits/ia-30-days-summary/prompts";


export const habitKeys = {
    all: ["habits"] as const,
    today: ["habits", "today"] as const,
    last30Days: ["habits", "last30Days"] as const,
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

/**
 * Obtiene los hábitos con sus registros de los últimos 30 días.
 * Devuelve directamente el payload mapeado al formato que espera el prompt de IA
 * (HabitAnalysisInput), para que la page no tenga que hacer transformaciones.
 */
export function useLast30DaysHabits() {
    return useQuery({
        queryKey: habitKeys.last30Days,
        queryFn: async (): Promise<HabitAnalysisInput> => {
            const response = await habitService.getLast30Days();
            return {
                habits: response.habits.map(
                    (h): HabitInput => ({
                        name: h.name,
                        type: h.type,
                        status: h.status,
                        startDate: h.startDate ?? "",
                        target: h.target,
                        unit: h.unit,
                        area: h.area,
                        days: h.days,
                        frequency: h.frequency,
                        occurrences: h.occurrences,
                        records: h.records.map((r) => ({
                            date: r.date,
                            value: r.value,
                            target: r.target,
                            isCompleted: r.isCompleted,
                        })),
                    })
                ),
            };
        },
        staleTime: 5 * 60_000, // 5 minutos: no hace falta refetchear cada minuto
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
            queryClient.invalidateQueries({ queryKey: habitKeys.last30Days });
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
            const isToggle = dto.isCompleted != null;
            notify.success({
                title: isToggle
                    ? (dto.isCompleted ? "¡Bien hecho!" : "Marcado como pendiente")
                    : "¡Registro guardado!",
                description: isToggle ? undefined : "Registrado correctamente.",
            });
            queryClient.invalidateQueries({ queryKey: habitKeys.today });
            queryClient.invalidateQueries({ queryKey: habitKeys.last30Days });
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