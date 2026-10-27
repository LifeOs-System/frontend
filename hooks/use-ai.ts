
"use client";

import { useCallback, useState } from "react";
import {AIImage, askAI} from "@/app/actions/ia";


type AIResult = {
    success: true;
    text: string;
} | {
    success: false;
    error: string;
};

async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject(new Error("No se pudo leer la imagen."));
            }
        };

        reader.onerror = () => reject(
            new Error("No se pudo leer la imagen.")
        );

        reader.readAsDataURL(file);
    });
}

export function useAI() {
    const [data, setData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const execute = useCallback(
        async (prompt: string, files: File[] = []): Promise<AIResult> => {
            setLoading(true);
            setError(null);
            setData(null);

            try {
                const images: AIImage[] = await Promise.all(
                    files.map(async (file) => ({
                        dataUrl: await fileToDataUrl(file),
                    }))
                );

                const result = await askAI(prompt, images);

                if (!result.success) {
                    setError(result.error);
                    return result;
                }

                setData(result.text);
                return result;
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error al llamar a la IA.";

                setError(message);

                return {
                    success: false,
                    error: message,
                };
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return {
        execute,
        data,
        error,
        loading,
        reset,
    };
}
