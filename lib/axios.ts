// lib/axios.ts
import axios, { AxiosError } from "axios";
import { notify } from "@/components/Toast";

// ─── Instancia base ───────────────────────────────────────────────────────────
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// ─── Interceptor: SOLO errores ────────────────────────────────────────────────
api.interceptors.response.use(
    // ✅ Éxito → pasa directo, sin tocar nada
    (response) => response,

    // ❌ Error → toast automático
    (error: AxiosError<{ message?: string }>) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        switch (status) {
            case 400:
                notify.error({ title: "Solicitud inválida", description: message });
                break;
            case 404:
                notify.warning({ title: "Recurso no encontrado", description: message });
                break;
            case 409:
                notify.warning({ title: "Conflicto", description: message });
                break;
            case 422:
                notify.error({ title: "Datos inválidos", description: message });
                break;
            case 500:
            case 502:
            case 503:
            case 504:
                notify.error({
                    title: "Error del servidor",
                    description: "Algo salió mal en el backend. Inténtalo de nuevo.",
                });
                break;
            default:
                if (!error.response) {
                    notify.error({
                        title: "Sin conexión con el servidor",
                        description: "Verifica que el backend esté corriendo.",
                    });
                } else {
                    notify.error({ title: "Error inesperado", description: error.message });
                }
        }

        return Promise.reject(error);
    }
);

export default api;