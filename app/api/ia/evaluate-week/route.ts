import { NextResponse } from "next/server";
import {LastWeekResponse} from "@/lib/habits/habitSchema";
import {buildWeekPrompt} from "@/lib/ia/buildWeekPrompt";


export async function POST(req: Request) {
    const apiKey = process.env.XAI_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "Falta configurar XAI_API_KEY" },
            { status: 500 }
        );
    }

    let data: LastWeekResponse;
    try {
        data = (await req.json()) as LastWeekResponse;
    } catch {
        return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const prompt = buildWeekPrompt(data);

    try {
        const response = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "grok-4-latest",  // o "grok-beta", "grok-2-latest"
                messages: [
                    {
                        role: "system",
                        content:
                            "Eres un coach de hábitos motivador, honesto y directo. Respondes siempre en español, de forma breve y concreta.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 600,
            }),
        });

        if (!response.ok) {
            console.error("[AI] Grok error:", await response.text());
            return NextResponse.json(
                { error: "El servicio de IA falló" },
                { status: 502 }
            );
        }

        const json = await response.json();
        const text =
            json?.choices?.[0]?.message?.content ??
            "No se pudo generar la evaluación.";

        return NextResponse.json({ evaluation: text });
    } catch (error) {
        console.error("[AI] error inesperado:", error);
        return NextResponse.json(
            { error: "Error inesperado al evaluar" },
            { status: 500 }
        );
    }
}