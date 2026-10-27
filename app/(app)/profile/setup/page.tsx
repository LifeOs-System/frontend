
"use client";

import { useState, type ChangeEvent } from "react";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Loader2,
} from "lucide-react";

import { useAI } from "@/hooks/use-ai";

import {
    API_URL,
    initialForm,
    measurementApiNames,
    measurementFields,
} from "./constants";

import { getBodyFatPrompts } from "./prompts";

import type {
    ProfileForm,
    ProfilePhoto,
} from "./types";

import ProfileSetupSuccess from "@/components/profile/ProfileSetupSuccess";
import ProfileSetupProgress from "@/components/profile/ProfileSetupProgress";
import PersonalInfoStep from "@/components/profile/PersonalInfoStep";
import PhysicalDataStep from "@/components/profile/PhysicalDataStep";
import BodyMeasurementsStep from "@/components/profile/BodyMeasurementsStep";
import ProgressPhotosStep from "@/components/profile/ProgressPhotosStep";

const MAX_PHOTOS = 10;
const MAX_PHOTO_SIZE = 10 * 1024 * 1024;

type BodyFatAIResponse = {
    analysis: string;
    bodyFat: number | null;
    range: [number, number] | null;
    confidence: "alta" | "media" | "baja";
};

export default function ProfileSetupPage() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<ProfileForm>(initialForm);
    const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    // Guardamos toda la respuesta de la IA para mostrarla
    // en la pantalla de perfil creado.
    const [bodyFatResult, setBodyFatResult] =
        useState<BodyFatAIResponse | null>(null);

    const { execute } = useAI();

    const updateField = (key: keyof ProfileForm, value: string) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));

        setError("");
    };

    const handlePhotoChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const selectedFiles = Array.from(event.target.files ?? []);

        event.target.value = "";

        const remaining = MAX_PHOTOS - photos.length;

        if (remaining <= 0) {
            setError(`Puedes subir un máximo de ${MAX_PHOTOS} imágenes.`);
            return;
        }

        const newPhotos: ProfilePhoto[] = [];
        let photoError = "";

        for (const file of selectedFiles.slice(0, remaining)) {
            if (!file.type.startsWith("image/")) {
                photoError = "Todos los archivos deben ser imágenes.";
                continue;
            }

            if (file.size > MAX_PHOTO_SIZE) {
                photoError = `${file.name} supera el límite de 10 MB.`;
                continue;
            }

            newPhotos.push({
                id: crypto.randomUUID(),
                file,
                preview: URL.createObjectURL(file),
            });
        }

        setPhotos((current) => [...current, ...newPhotos]);
        setError(photoError);
        setBodyFatResult(null);
    };

    const removePhoto = (id: string) => {
        const photo = photos.find((item) => item.id === id);

        if (photo) {
            URL.revokeObjectURL(photo.preview);
        }

        setPhotos((current) =>
            current.filter((item) => item.id !== id),
        );

        setBodyFatResult(null);
        setError("");
    };

    const calculateAge = (birthDay: string): number => {
        const birthday = new Date(`${birthDay}T00:00:00`);
        const today = new Date();

        let age = today.getFullYear() - birthday.getFullYear();

        if (
            today.getMonth() < birthday.getMonth() ||
            (today.getMonth() === birthday.getMonth() &&
                today.getDate() < birthday.getDate())
        ) {
            age--;
        }

        return age;
    };

    const calculateBMI = (): number => {
        const weight = Number(form.weight);
        const heightInMeters = Number(form.height) / 100;

        if (
            !Number.isFinite(weight) ||
            !Number.isFinite(heightInMeters) ||
            weight <= 0 ||
            heightInMeters <= 0
        ) {
            throw new Error("El peso o la altura no son válidos.");
        }

        return Number(
            (weight / Math.pow(heightInMeters, 2)).toFixed(1),
        );
    };

    const validateStep = (): boolean => {
        if (step === 1) {
            if (!form.name.trim()) {
                setError("Introduce tu nombre.");
                return false;
            }

            if (!form.birthDay) {
                setError("Selecciona tu fecha de nacimiento.");
                return false;
            }

            const birthday = new Date(`${form.birthDay}T00:00:00`);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (
                Number.isNaN(birthday.getTime()) ||
                birthday > today
            ) {
                setError("Introduce una fecha de nacimiento válida.");
                return false;
            }

            if (!form.gender) {
                setError("Selecciona tu género.");
                return false;
            }
        }

        if (step === 2) {
            if (
                !form.weight ||
                !Number.isFinite(Number(form.weight)) ||
                Number(form.weight) <= 0
            ) {
                setError("Introduce un peso válido en kilogramos.");
                return false;
            }

            if (
                !form.height ||
                !Number.isFinite(Number(form.height)) ||
                Number(form.height) <= 0
            ) {
                setError("Introduce una altura válida en centímetros.");
                return false;
            }
        }

        if (step === 3) {
            const values: string[] = measurementFields.map(
                ({ key }) => form[key],
            );

            const hasAnyMeasurement = values.some(
                (value) => value.trim() !== "",
            );

            if (hasAnyMeasurement) {
                const hasMissingMeasurement = values.some(
                    (value) => value.trim() === "",
                );

                if (hasMissingMeasurement) {
                    setError(
                        "Completa las 12 medidas o déjalas todas vacías para continuar sin ellas.",
                    );
                    return false;
                }

                const hasInvalidMeasurement = values.some(
                    (value) =>
                        !Number.isFinite(Number(value)) ||
                        Number(value) <= 0,
                );

                if (hasInvalidMeasurement) {
                    setError(
                        "Todas las medidas deben ser números mayores que cero.",
                    );
                    return false;
                }
            }
        }

        setError("");
        return true;
    };

    const goNext = () => {
        if (!validateStep()) return;

        setStep((current) => Math.min(current + 1, 4));
    };

    const goBack = () => {
        setError("");
        setStep((current) => Math.max(current - 1, 1));
    };

    const estimateBodyFat = async (): Promise<BodyFatAIResponse> => {
        if (photos.length === 0) {
            throw new Error(
                "Necesitas subir al menos una fotografía para estimar tu porcentaje de grasa corporal.",
            );
        }

        const bmi = calculateBMI();
        const age = calculateAge(form.birthDay);

        const { systemPrompt, prompt } = getBodyFatPrompts({
            form,
            age,
            bmi,
        });

        const result = await execute(
            `${systemPrompt}\n\n${prompt}`,
            photos.map((photo) => photo.file),
        );

        if (!result.success) {
            throw new Error(result.error);
        }

        const normalized = result.text.trim();

        let parsed: BodyFatAIResponse;

        try {
            const cleaned = normalized
                .replace(/^```(?:json)?\s*/i, "")
                .replace(/\s*```$/, "");

            parsed = JSON.parse(cleaned) as BodyFatAIResponse;
        } catch {
            throw new Error(
                "La IA devolvió una respuesta JSON no válida. Inténtalo de nuevo.",
            );
        }

        if (
            typeof parsed !== "object" ||
            parsed === null ||
            typeof parsed.analysis !== "string" ||
            !["alta", "media", "baja"].includes(parsed.confidence)
        ) {
            throw new Error(
                "La respuesta de la IA no tiene el formato esperado.",
            );
        }

        if (
            typeof parsed.bodyFat !== "number" ||
            !Number.isFinite(parsed.bodyFat) ||
            parsed.bodyFat < 3 ||
            parsed.bodyFat > 60
        ) {
            throw new Error(
                "La IA no pudo obtener un porcentaje de grasa corporal válido. Inténtalo con fotografías más claras.",
            );
        }

        if (
            parsed.range !== null &&
            (
                !Array.isArray(parsed.range) ||
                parsed.range.length !== 2 ||
                !parsed.range.every(
                    (value) =>
                        typeof value === "number" &&
                        Number.isFinite(value) &&
                        value >= 3 &&
                        value <= 60,
                ) ||
                parsed.range[0] > parsed.range[1]
            )
        ) {
            throw new Error(
                "La IA devolvió un rango de grasa corporal no válido.",
            );
        }

        return {
            ...parsed,
            bodyFat: Number(parsed.bodyFat.toFixed(1)),
        };
    };

    const handleSubmit = async () => {
        if (loading || !validateStep()) return;

        setLoading(true);
        setError("");

        try {
            const bmi = calculateBMI();
            const age = calculateAge(form.birthDay);

            // Obtenemos la respuesta completa de la IA.
            const aiResult = await estimateBodyFat();
            const bodyFat = aiResult.bodyFat;

            // Conservamos análisis, rango, porcentaje y confianza.
            setBodyFatResult(aiResult);

            const data = new FormData();

            data.append("Name", form.name.trim());
            data.append("BirthDay", form.birthDay);
            data.append("Weight", form.weight);
            data.append("Height", form.height);
            data.append("Gender", form.gender);

            data.append("Age", String(age));
            data.append("BMI", String(bmi));
            data.append("BodyFatPercentage", String(bodyFat));

            const hasMeasurements = measurementFields.every(
                ({ key }) => form[key].trim() !== "",
            );

            if (hasMeasurements) {
                for (const { key } of measurementFields) {
                    data.append(
                        `BodyMetricsRequest.${measurementApiNames[key]}`,
                        form[key],
                    );
                }
            }

            for (const photo of photos) {
                data.append(
                    "Images",
                    photo.file,
                    photo.file.name,
                );
            }

            const response = await fetch(`${API_URL}/user`, {
                method: "POST",
                body: data,
            });

            if (!response.ok) {
                const message = await response.text();

                throw new Error(
                    message ||
                    `No se pudo crear el perfil (${response.status}).`,
                );
            }

            setCompleted(true);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Ocurrió un error al guardar tu perfil.",
            );
        } finally {
            setLoading(false);
        }
    };

    const continueToHome = () => {
        photos.forEach((photo) => {
            URL.revokeObjectURL(photo.preview);
        });

        window.location.assign("/");
    };

    if (completed && bodyFatResult) {
        return (
            <ProfileSetupSuccess
                onContinue={continueToHome}
                bodyFatResult={bodyFatResult}
            />
        );
    }

    return (
        <main className="min-h-screen bg-[#09090b] px-4 py-8 text-white sm:py-12">
            <div className="mx-auto w-full max-w-3xl">
                <header className="mb-8">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                        LifeOS
                    </p>

                    <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                        Configura tu perfil
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-white/50">
                        Completa tu información para personalizar tu experiencia.
                    </p>
                </header>

                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">
                    <ProfileSetupProgress step={step} />

                    {step === 1 && (
                        <PersonalInfoStep
                            form={form}
                            updateField={updateField}
                        />
                    )}

                    {step === 2 && (
                        <PhysicalDataStep
                            form={form}
                            updateField={updateField}
                        />
                    )}

                    {step === 3 && (
                        <BodyMeasurementsStep
                            form={form}
                            updateField={updateField}
                        />
                    )}

                    {step === 4 && (
                        <>
                            <ProgressPhotosStep
                                photos={photos}
                                onPhotoChange={handlePhotoChange}
                                onRemovePhoto={removePhoto}
                            />

                            <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                                <p className="text-sm font-medium text-white/80">
                                    Estimación de grasa corporal con IA
                                </p>

                                <p className="mt-1 text-xs leading-5 text-white/40">
                                    Selecciona al menos una fotografía corporal.
                                    Gemini analizará las imágenes junto con tu
                                    peso, altura, edad, sexo, IMC y las medidas
                                    corporales que hayas proporcionado.
                                </p>

                                {bodyFatResult && (
                                    <div className="mt-4">
                                        <p className="text-xs text-white/40">
                                            Última estimación obtenida
                                        </p>

                                        <p className="mt-1 text-2xl font-semibold">
                                            {bodyFatResult.bodyFat?.toFixed(1)}%
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {error && (
                        <div
                            role="alert"
                            className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm leading-5 text-red-300"
                        >
                            {error}
                        </div>
                    )}

                    <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                        <button
                            type="button"
                            onClick={goBack}
                            disabled={step === 1 || loading}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ArrowLeft className="size-4" />
                            Atrás
                        </button>

                        {step < 4 ? (
                            <button
                                type="button"
                                onClick={goNext}
                                disabled={loading}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Continuar
                                <ArrowRight className="size-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading || photos.length === 0}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Analizando y guardando...
                                    </>
                                ) : (
                                    <>
                                        Crear perfil
                                        <CheckCircle2 className="size-4" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </section>

                <p className="mt-5 text-center text-xs leading-5 text-white/30">
                    Tus datos se utilizarán para personalizar tu experiencia
                    en LifeOS. El porcentaje de grasa es una estimación visual.
                </p>
            </div>
        </main>
    );
}
