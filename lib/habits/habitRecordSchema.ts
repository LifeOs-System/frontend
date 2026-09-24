import { z } from "zod";

export const CreateHabitRecordSchema = z.object({
    // C#: required string HabitId
    // (Opcional: puedes agregar .uuid("El ID debe tener formato válido") si quieres ser estricto con el Guid)
    habitId: z.string().min(1, "El ID del hábito es requerido"),

    // C#: decimal? Value
    // Usamos .min(0) para permitir registrar "0" (ej. 0 gramos), pero rechazar negativos.
    value: z.number().min(0, "El valor no puede ser negativo").nullable().optional(),

    // C#: bool? IsCompleted
    isCompleted: z.boolean().nullable().optional(),
})
    .strict() // Protege el backend: rechaza cualquier campo extra que no esté en la clase C#
    .refine(
        (data) => {
            // != null atrapa tanto 'null' como 'undefined' de manera segura
            const hasValue = data.value != null;
            const hasIsCompleted = data.isCompleted != null;

            // Lógica XOR: debe tener exactamente uno de los dos, no ambos ni ninguno
            return hasValue !== hasIsCompleted;
        },
        {
            message: "Debes enviar 'value' o 'isCompleted', pero no ambos",
            path: ["value"], // Asocia el mensaje de error al campo 'value' para que tu UI lo muestre ahí
        }
    );

export type CreateHabitRecordDto = z.infer<typeof CreateHabitRecordSchema>;