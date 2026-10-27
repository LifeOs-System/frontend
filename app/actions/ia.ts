"use server";

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemma-4-31b-it",
    "gemma-4-26b-a4b-it",
];

export type AIImage = {
    dataUrl: string;
};

function getErrorStatus(error: any): number | undefined {
    const status =
        error?.status ??
        error?.code ??
        error?.response?.status ??
        error?.error?.code;

    return typeof status === "number"
        ? status
        : Number(status) || undefined;
}

function parseImage(dataUrl: string) {
    const match = dataUrl.match(
        /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/
    );

    if (!match) {
        throw new Error("Se ha enviado una imagen no válida.");
    }

    return {
        mimeType: match[1],
        data: match[2],
    };
}

export async function askAI(
    prompt: string,
    images: AIImage[] = []
): Promise<{ success: true; text: string } | { success: false; error: string }> {
    if (!apiKey || !ai) {
        return {
            success: false,
            error: "GEMINI_API_KEY no está configurada.",
        };
    }

    if (!prompt.trim()) {
        return {
            success: false,
            error: "Debes proporcionar un prompt.",
        };
    }

    if (images.length > 5) {
        return {
            success: false,
            error: "Puedes enviar un máximo de 5 imágenes por solicitud.",
        };
    }

    try {
        const input: Array<
            | { type: "text"; text: string }
            | { type: "image"; mime_type: string; data: string }
        > = [
            {
                type: "text",
                text: prompt.trim(),
            },
        ];

        for (const image of images) {
            const parsed = parseImage(image.dataUrl);

            input.push({
                type: "image",
                mime_type: parsed.mimeType,
                data: parsed.data,
            });
        }

        let lastError: unknown;

        for (const model of MODELS) {
            try {
                console.info(`[AI] Intentando modelo: ${model}`);

                const response = await ai.interactions.create({
                    model,
                    input,
                });

                const text = response.output_text?.trim();

                if (!text) {
                    throw new Error("La IA devolvió una respuesta vacía.");
                }

                console.info(`[AI] Modelo utilizado: ${model}`);

                return {
                    success: true,
                    text,
                };
            } catch (error: any) {
                lastError = error;
                const status = getErrorStatus(error);

                console.error(`[AI] Error con ${model}:`, error);

                // Probamos otro modelo ante límites o modelos no disponibles.
                if (status === 429 || status === 404) {
                    continue;
                }

                if (status === 401 || status === 403) {
                    return {
                        success: false,
                        error: "La API key de Gemini no es válida o no tiene permisos.",
                    };
                }

                // No ocultamos errores de solicitudes inválidas.
                throw error;
            }
        }

        console.error("[AI] Todos los modelos fallaron:", lastError);

        return {
            success: false,
            error: "Ningún modelo de IA está disponible en este momento.",
        };
    } catch (error: any) {
        console.error("[AI] Error general:", error);

        return {
            success: false,
            error:
                error?.message ||
                "No se pudo completar la solicitud a la IA.",
        };
    }
}
