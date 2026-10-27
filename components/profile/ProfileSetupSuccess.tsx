"use client";

import {
    Check,
    ArrowRight,
    BrainCircuit,
    ShieldCheck,
    ChartColumnIncreasing,
} from "lucide-react";

type BodyFatAIResponse = {
    analysis: string;
    bodyFat: number | null;
    range: [number, number] | null;
    confidence: "alta" | "media" | "baja";
};

type Props = {
    onContinue: () => void;
    bodyFatResult: BodyFatAIResponse;
};

const confidenceStyles = {
    alta: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    media: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    baja: "border-red-400/20 bg-red-400/10 text-red-300",
};

export default function ProfileSetupSuccess({
                                                onContinue,
                                                bodyFatResult,
                                            }: Props) {
    return (
        <main className="min-h-screen bg-[#09090b] px-4 py-12 text-white">
            <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center">
                {/* Encabezado */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-white text-black">
                        <Check className="size-8" />
                    </div>

                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                        LifeOS
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                        Perfil creado
                    </h1>

                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/50">
                        Tus datos se han guardado correctamente. Este es tu
                        análisis inicial de composición corporal.
                    </p>
                </div>

                {/* Resultado de la IA */}
                <section className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="size-5 text-white/70" />
                        <h2 className="font-medium">
                            Composición corporal
                        </h2>
                    </div>

                    <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.025] p-5">
                        <p className="text-sm text-white/45">
                            Grasa corporal estimada
                        </p>

                        {bodyFatResult.bodyFat !== null ? (
                            <>
                                <div className="mt-2 flex flex-wrap items-end gap-3">
                                    <span className="text-5xl font-semibold tracking-tight">
                                        {bodyFatResult.bodyFat.toFixed(1)}%
                                    </span>

                                    <span className="pb-1 text-sm text-white/40">
                                        estimación visual
                                    </span>
                                </div>

                                {bodyFatResult.range && (
                                    <p className="mt-3 text-sm text-white/55">
                                        Rango estimado:{" "}
                                        <span className="font-medium text-white/80">
                                            {bodyFatResult.range[0]}% –{" "}
                                            {bodyFatResult.range[1]}%
                                        </span>
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="mt-3 text-sm leading-6 text-white/60">
                                No fue posible estimar el porcentaje con
                                suficiente información visual.
                            </p>
                        )}
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-white/10 p-4">
                            <div className="flex items-center gap-2 text-white/50">
                                <ShieldCheck className="size-4" />
                                <span className="text-xs">
                                    Confianza de la IA
                                </span>
                            </div>

                            <span
                                className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-medium capitalize ${
                                    confidenceStyles[bodyFatResult.confidence]
                                }`}
                            >
                                {bodyFatResult.confidence}
                            </span>
                        </div>

                        <div className="rounded-xl border border-white/10 p-4">
                            <div className="flex items-center gap-2 text-white/50">
                                <ChartColumnIncreasing className="size-4" />
                                <span className="text-xs">
                                    Tipo de resultado
                                </span>
                            </div>

                            <p className="mt-3 text-sm font-medium">
                                Estimación orientativa
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-white/80">
                            Análisis de la IA
                        </h3>

                        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-white/60">
                            {bodyFatResult.analysis ||
                                "No se proporcionó un análisis textual."}
                        </p>
                    </div>

                    <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-5 text-white/35">
                        Este resultado es una estimación orientativa, no una
                        medición clínica. La iluminación, la postura, los
                        ángulos y la calidad de las fotografías pueden afectar
                        su precisión.
                    </p>
                </section>

                {/* Continuar */}
                <button
                    type="button"
                    onClick={onContinue}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-medium text-black transition hover:bg-white/90"
                >
                    Continuar a LifeOS
                    <ArrowRight className="size-4" />
                </button>
            </div>
        </main>
    );
}