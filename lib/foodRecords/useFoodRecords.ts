import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateFoodRecordRequest } from "./types";
import { foodRecordService } from "./foodRecordService";
import { notify } from "@/components/Toast";

/**
 * Hook para crear un nuevo registro de comida
 */
export function useCreateFoodRecord() {
    return useMutation({
        mutationFn: (data: CreateFoodRecordRequest) => foodRecordService.create(data),
        onSuccess: () => {
            notify.success({
                title: "¡Registro guardado!",
                description: "El análisis nutricional se añadió a tu historial.",
            });
        },
        onError: (error: any) => {
            notify.error({
                title: "Error al guardar",
                description: error?.response?.data?.message || "No se pudo guardar el registro nutricional.",
            });
        },
    });
}