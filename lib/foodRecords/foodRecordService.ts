import api from "@/lib/axios";
import { CreateFoodRecordRequest } from "./types";

export const foodRecordService = {
    /**
     * Crea un nuevo registro de comida en la base de datos
     */
    create: async (data: CreateFoodRecordRequest): Promise<void> => {
        await api.post("/food-records", data);
    },
};