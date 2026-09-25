"use server";

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
    apiKey,
});

/*
|--------------------------------------------------------------------------
| Modelos
|--------------------------------------------------------------------------
|
| Se intentan en este orden.
|
| Si un modelo devuelve:
|
| 429 -> rate limit -> siguiente modelo
| 404 -> modelo no disponible -> siguiente modelo
|
*/

const MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemma-4-31b-it",
    "gemma-4-26b-a4b-it",
];

/*
|--------------------------------------------------------------------------
| System prompt
|--------------------------------------------------------------------------
*/

const SYSTEM_PROMPT = `
Eres un asistente especializado en análisis nutricional de alimentos
mediante imágenes.

    Tu tarea es analizar una fotografía de comida y/o la descripción
proporcionada por el usuario.

    Debes identificar CADA alimento individualmente.

    Para cada alimento debes determinar:

    - Nombre del alimento.
- Cantidad visible o estimada.
- Unidad de medida.
- Peso estimado en gramos.
- Calorías estimadas.
- Proteínas en gramos.
- Carbohidratos en gramos.
- Grasas en gramos.
- Método de preparación.
- Nivel de confianza.

    IMPORTANTE SOBRE LAS CANTIDADES:

    Si puedes identificar unidades físicas, utilízalas.

    Ejemplos:

- 2 salchichas
- 3 huevos
- 1 pechuga
- 1/2 aguacate
- 1 plátano
- 1 taza de arroz

Además, estima el peso total en gramos.

    Si el alimento se encuentra en una cantidad difícil de determinar,
    estima una porción razonable basándote en el tamaño visible.

    La cantidad debe representar la comida visible.

    IMPORTANTE SOBRE LOS ALIMENTOS:

    Debes separar los alimentos.

    Por ejemplo, si ves:

    - arroz
    - frijoles
    - pollo
    - aguacate
    - plátano

NO debes devolverlos como un único alimento llamado "plato".

    Debes devolver cinco objetos diferentes.

    Cada componente claramente identificable debe ser un objeto independiente.

    IMPORTANTE SOBRE PREPARACIÓN:

    Considera el método de preparación cuando sea visible o mencionado.

    Ejemplos:

- frito
- hervido
- asado
- a la plancha
- empanizado
- cocido
- crudo

Si no puedes determinar el método de preparación,
    utiliza "desconocido".

    La preparación debe influir en la estimación nutricional cuando
corresponda.

    Por ejemplo:

    - plátano frito no debe tratarse igual que plátano hervido
- pollo frito no debe tratarse igual que pollo a la plancha
- arroz preparado con aceite puede tener más grasa que arroz simple

IMPORTANTE SOBRE LOS VALORES NUTRICIONALES:

    Las calorías y macronutrientes son estimaciones.

    No debes presentar las estimaciones como valores exactos.

    Utiliza referencias nutricionales razonables para el alimento
y la cantidad estimada.

    Los valores deben ser coherentes con la cantidad estimada.

    Por ejemplo:

    Si estimatedGrams aumenta,
    los valores nutricionales deberían aumentar proporcionalmente.

    Los totales deben ser coherentes con la suma de los alimentos.

    IMPORTANTE SOBRE LA IMAGEN:

    Analiza cuidadosamente:

    - tamaño relativo de los alimentos
- cantidad visible
- proporción del plato
- ingredientes claramente visibles
- método de preparación
- posibles aceites o grasas visibles

No inventes ingredientes que no puedas observar o que el usuario
no haya mencionado.

    Si existe incertidumbre sobre un alimento,
    utiliza un nombre genérico razonable.

    Ejemplos:

En lugar de inventar una marca de salchicha:
    "Salchicha"

En lugar de inventar un tipo específico de arroz:
    "Arroz"

En lugar de inventar un corte de carne:
    "Carne de res"

IMPORTANTE SOBRE LA CANTIDAD:

    Cuando puedas determinar unidades físicas,
    usa una unidad comprensible.

    Ejemplos:

2 unidades
3 huevos
1/2 aguacate
1 taza
1 rebanada
1 pieza

estimatedGrams debe representar el peso total estimado de esa
cantidad.

    IMPORTANTE:

No inventes alimentos.

    Si algo no puede identificarse con suficiente confianza,
    utiliza un nombre genérico o no lo incluyas.

    La respuesta debe contener EXCLUSIVAMENTE el JSON solicitado.

    No escribas markdown.

    No escribas explicaciones.

    No escribas texto fuera del JSON.
    `;

/*
|--------------------------------------------------------------------------
| Response schema
|--------------------------------------------------------------------------
*/

const RESPONSE_SCHEMA = {
    type: "object",

    properties: {
        foods: {
            type: "array",

            description:
                "Lista de todos los alimentos identificados individualmente.",

            items: {
                type: "object",

                properties: {
                    name: {
                        type: "string",

                        description:
                            "Nombre del alimento.",
                    },

                    quantity: {
                        type: "number",

                        description:
                            "Cantidad estimada de unidades, piezas o porciones.",
                    },

                    unit: {
                        type: "string",

                        description:
                            "Unidad utilizada para expresar la cantidad.",
                    },

                    estimatedGrams: {
                        type: "number",

                        description:
                            "Peso total estimado del alimento en gramos.",
                    },

                    calories: {
                        type: "number",

                        description:
                            "Calorías estimadas del alimento.",
                    },

                    proteinGrams: {
                        type: "number",

                        description:
                            "Proteínas estimadas en gramos.",
                    },

                    carbsGrams: {
                        type: "number",

                        description:
                            "Carbohidratos estimados en gramos.",
                    },

                    fatGrams: {
                        type: "number",

                        description:
                            "Grasas estimadas en gramos.",
                    },

                    preparation: {
                        type: "string",

                        description:
                            "Método de preparación observado o indicado.",
                    },

                    confidence: {
                        type: "string",

                        enum: [
                            "low",
                            "medium",
                            "high",
                        ],

                        description:
                            "Nivel de confianza de la estimación.",
                    },
                },

                required: [
                    "name",
                    "quantity",
                    "unit",
                    "estimatedGrams",
                    "calories",
                    "proteinGrams",
                    "carbsGrams",
                    "fatGrams",
                    "preparation",
                    "confidence",
                ],

                additionalProperties: false,
            },
        },

        totals: {
            type: "object",

            properties: {
                calories: {
                    type: "number",

                    description:
                        "Calorías totales de todos los alimentos.",
                },

                proteinGrams: {
                    type: "number",

                    description:
                        "Proteínas totales en gramos.",
                },

                carbsGrams: {
                    type: "number",

                    description:
                        "Carbohidratos totales en gramos.",
                },

                fatGrams: {
                    type: "number",

                    description:
                        "Grasas totales en gramos.",
                },
            },

            required: [
                "calories",
                "proteinGrams",
                "carbsGrams",
                "fatGrams",
            ],

            additionalProperties: false,
        },

        overallConfidence: {
            type: "string",

            enum: [
                "low",
                "medium",
                "high",
            ],

            description:
                "Nivel general de confianza del análisis.",
        },
    },

    required: [
        "foods",
        "totals",
        "overallConfidence",
    ],

    additionalProperties: false,
};

/*
|--------------------------------------------------------------------------
| Image parser
|--------------------------------------------------------------------------
*/

function getImageData(imageBase64: string) {
    if (imageBase64.startsWith("data:")) {
        const match = imageBase64.match(
            /^data:([^;]+);base64,(.+)$/
        );

        if (match) {
            return {
                mimeType: match[1],
                data: match[2],
            };
        }
    }

    return {
        mimeType: "image/jpeg",
        data: imageBase64,
    };
}

/*
|--------------------------------------------------------------------------
| JSON validation
|--------------------------------------------------------------------------
*/

function isValidNutritionResponse(
    content: string
) {
    try {
        const data = JSON.parse(content);

        if (
            !data ||
            !Array.isArray(data.foods) ||
            !data.totals
        ) {
            return false;
        }

        if (
            typeof data.overallConfidence !==
                "string"
        ) {
            return false;
        }

        for (const food of data.foods) {
            if (
                typeof food.name !== "string" ||
                typeof food.quantity !== "number" ||
                typeof food.unit !== "string" ||
                typeof food.estimatedGrams !==
                    "number" ||
                typeof food.calories !==
                    "number" ||
                typeof food.proteinGrams !==
                    "number" ||
                typeof food.carbsGrams !==
                    "number" ||
                typeof food.fatGrams !==
                    "number" ||
                typeof food.preparation !==
                    "string" ||
                typeof food.confidence !==
                    "string"
            ) {
                return false;
            }
        }

        if (
            typeof data.totals.calories !==
                "number" ||
            typeof data.totals.proteinGrams !==
                "number" ||
            typeof data.totals.carbsGrams !==
                "number" ||
            typeof data.totals.fatGrams !==
                "number"
        ) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

/*
|--------------------------------------------------------------------------
| HTTP status
|--------------------------------------------------------------------------
*/

function getErrorStatus(error: any) {
    return (
        error?.status ??
        error?.code ??
        error?.response?.status ??
        error?.error?.code
    );
}

/*
|--------------------------------------------------------------------------
| Analyze Nutrition
|--------------------------------------------------------------------------
*/

export async function analyzeNutrition(
    inputText: string,
    imageBase64?: string
) {
    /*
    |--------------------------------------------------------------------------
    | API key
    |--------------------------------------------------------------------------
    */

    if (!apiKey) {
        return {
            success: false,
            error:
                "GEMINI_API_KEY no está configurada.",
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Input validation
    |--------------------------------------------------------------------------
    */

    if (
        !inputText.trim() &&
        !imageBase64
    ) {
        return {
            success: false,
            error:
                "Debes proporcionar una imagen o una descripción de la comida.",
        };
    }

    try {
        /*
        |--------------------------------------------------------------------------
        | Build input
        |--------------------------------------------------------------------------
        */

        const input: Array<
            | {
                  type: "text";
                  text: string;
              }
            | {
                  type: "image";
                  mime_type: string;
                  data: string;
              }
        > = [];

        input.push({
            type: "text",

            text:
                inputText.trim() ||
                "Analiza nutricionalmente todos los alimentos de esta comida.",
        });

        /*
        |--------------------------------------------------------------------------
        | Add image
        |--------------------------------------------------------------------------
        */

        if (imageBase64) {
            const image =
                getImageData(imageBase64);

            input.push({
                type: "image",

                mime_type:
                    image.mimeType,

                data: image.data,
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Model fallback
        |--------------------------------------------------------------------------
        */

        let interaction: any = null;

        let usedModel = "";

        let lastError: any = null;

        for (const model of MODELS) {
            try {
                console.log(
                    `[Nutrition] Intentando modelo: ${model}`
                );

                /*
                |--------------------------------------------------------------------------
                | Generation config
                |--------------------------------------------------------------------------
                |
                | Gemini 3.8 Flash utiliza thinking_level low.
                |
                | Para los modelos fallback evitamos enviar
                | configuraciones que puedan no ser compatibles.
                |
                */

                const request: any = {
                    model,

                    input,

                    system_instruction:
                        SYSTEM_PROMPT,

                    response_format: {
                        type: "text",

                        mime_type:
                            "application/json",

                        schema:
                            RESPONSE_SCHEMA,
                    },
                };

                if (
                    model ===
                    "gemini-3.8-flash"
                ) {
                    request.generation_config = {
                        thinking_level:
                            "low",
                    };
                }

                /*
                |--------------------------------------------------------------------------
                | Request
                |--------------------------------------------------------------------------
                */

                interaction =
                    await ai.interactions.create(
                        request
                    );

                usedModel = model;

                console.log(
                    `[Nutrition] Modelo utilizado: ${model}`
                );

                break;
            } catch (error: any) {
                lastError = error;

                const status =
                    getErrorStatus(error);

                console.error(
                    `[Nutrition] Error con ${model}:`,
                    error
                );

                /*
                |--------------------------------------------------------------------------
                | Rate limit
                |--------------------------------------------------------------------------
                |
                | Probamos automáticamente el siguiente.
                |
                */

                if (status === 429) {
                    console.warn(
                        `[Nutrition] ${model} alcanzó el límite. Probando siguiente modelo...`
                    );

                    continue;
                }

                /*
                |--------------------------------------------------------------------------
                | Model unavailable
                |--------------------------------------------------------------------------
                |
                | También intentamos el siguiente.
                |
                */

                if (status === 404) {
                    console.warn(
                        `[Nutrition] ${model} no está disponible. Probando siguiente modelo...`
                    );

                    continue;
                }

                /*
                |--------------------------------------------------------------------------
                | Authentication
                |--------------------------------------------------------------------------
                */

                if (status === 401) {
                    return {
                        success: false,

                        error:
                            "La API key de Gemini no es válida.",
                    };
                }

                /*
                |--------------------------------------------------------------------------
                | Otros errores
                |--------------------------------------------------------------------------
                |
                | No tiene sentido cambiar de modelo ante errores
                | como un request inválido.
                |
                */

                throw error;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | No model available
        |--------------------------------------------------------------------------
        */

        if (!interaction) {
            console.error(
                "[Nutrition] Todos los modelos fallaron:",
                lastError
            );

            return {
                success: false,

                error:
                    "Todos los modelos de Gemini alcanzaron su límite o no están disponibles.",
            };
        }

        /*
        |--------------------------------------------------------------------------
        | Extract response
        |--------------------------------------------------------------------------
        */

        const modelResponse =
            interaction.output_text;

        if (
            !modelResponse ||
            typeof modelResponse !==
                "string"
        ) {
            console.error(
                "[Nutrition] Respuesta inesperada:",
                interaction
            );

            return {
                success: false,

                error:
                    "Gemini no devolvió una respuesta válida.",
            };
        }

        /*
        |--------------------------------------------------------------------------
        | Validate JSON
        |--------------------------------------------------------------------------
        */

        if (
            !isValidNutritionResponse(
                modelResponse
            )
        ) {
            console.error(
                "[Nutrition] JSON nutricional inválido:",
                modelResponse
            );

            return {
                success: false,

                error:
                    "Gemini devolvió una estructura nutricional inválida.",
            };
        }

        /*
        |--------------------------------------------------------------------------
        | Parse JSON
        |--------------------------------------------------------------------------
        */

        const nutrition =
            JSON.parse(modelResponse);

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        return {
            success: true,

            nutrition,

            rawContent:
                modelResponse,

            model:
                interaction.model ??
                usedModel,

            interactionId:
                interaction.id ?? null,
        };
    } catch (error: any) {
        /*
        |--------------------------------------------------------------------------
        | Global error
        |--------------------------------------------------------------------------
        */

        console.error(
            "[Nutrition] Error general:",
            error
        );

        const status =
            getErrorStatus(error);

        if (status === 401) {
            return {
                success: false,

                error:
                    "La API key de Gemini no es válida.",
            };
        }

        if (status === 429) {
            return {
                success: false,

                error:
                    "Se alcanzó el límite de solicitudes de Gemini.",
            };
        }

        if (status === 404) {
            return {
                success: false,

                error:
                    "El modelo de Gemini no está disponible para esta API key.",
            };
        }

        return {
            success: false,

            error:
                error?.message ||
                "No se pudo conectar con Gemini.",
        };
    }
}