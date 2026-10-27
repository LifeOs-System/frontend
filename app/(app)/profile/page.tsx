"use client";

import { useState } from "react";
import {
    Activity,
    CalendarDays,
    Camera,
    Check,
    CircleUserRound,
    Clock3,
    Edit3,
    ImagePlus,
    Ruler,
    Scale,
    ShieldCheck,
    UserRound,
    X,
} from "lucide-react";

type ProfileData = {
    name: string;
    birthDay: string;
    gender: "Male" | "Female";
    weight: string;
    height: string;
};

const initialProfile: ProfileData = {
    name: "Alejandro García",
    birthDay: "2002-05-18",
    gender: "Male",
    weight: "65.5",
    height: "165",
};

const measurements = [
    { label: "Cuello", value: "36", unit: "cm" },
    { label: "Pecho", value: "94", unit: "cm" },
    { label: "Cintura", value: "76", unit: "cm" },
    { label: "Cadera", value: "89", unit: "cm" },
    { label: "Brazo izquierdo", value: "31", unit: "cm" },
    { label: "Brazo derecho", value: "31.5", unit: "cm" },
    { label: "Antebrazo izquierdo", value: "26", unit: "cm" },
    { label: "Antebrazo derecho", value: "26.5", unit: "cm" },
    { label: "Muslo izquierdo", value: "52", unit: "cm" },
    { label: "Muslo derecho", value: "52.5", unit: "cm" },
    { label: "Pantorrilla izquierda", value: "36", unit: "cm" },
    { label: "Pantorrilla derecha", value: "36", unit: "cm" },
];

const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30";

function SectionHeading({
                            eyebrow,
                            title,
                            description,
                            action,
                        }: {
    eyebrow?: string;
    title: string;
    description?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="mb-5 flex items-start justify-between gap-4">
            <div>
                {eyebrow && (
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                        {eyebrow}
                    </p>
                )}
                <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 text-sm leading-6 text-white/40">
                        {description}
                    </p>
                )}
            </div>
            {action}
        </div>
    );
}

function MetricCard({
                        icon: Icon,
                        label,
                        value,
                        unit,
                        detail,
                    }: {
    icon: typeof Scale;
    label: string;
    value: string;
    unit: string;
    detail: string;
}) {
    return (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
            <div className="mb-5 flex items-center justify-between">
                <span className="text-sm text-white/45">{label}</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                    <Icon size={17} className="text-white/60" strokeWidth={1.7} />
                </div>
            </div>
            <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {value}
                </span>
                <span className="text-xs text-white/40">{unit}</span>
            </div>
            <p className="mt-2 text-xs text-white/35">{detail}</p>
        </div>
    );
}

function PhotoPlaceholder({
                              label,
                              date,
                              index,
                          }: {
    label: string;
    date: string;
    index: number;
}) {
    const backgrounds = [
        "from-zinc-700/60 via-zinc-900 to-black",
        "from-stone-700/50 via-zinc-900 to-black",
        "from-neutral-600/40 via-zinc-900 to-black",
    ];

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113]">
            <div
                className={`relative flex aspect-[4/5] items-center justify-center bg-gradient-to-br ${backgrounds[index % backgrounds.length]}`}
            >
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/20" />
                    <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/20" />
                </div>
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                        <Camera size={25} className="text-white/30" strokeWidth={1.3} />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                        Foto de ejemplo
                    </span>
                </div>
                <span className="absolute left-3 top-3 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-[10px] text-white/70 backdrop-blur">
                    {label}
                </span>
            </div>
            <div className="flex items-center justify-between gap-2 p-3.5">
                <span className="text-xs font-medium text-white/70">{date}</span>
                <ImagePlus size={15} className="text-white/30" />
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const [profile, setProfile] = useState(initialProfile);
    const [draft, setDraft] = useState(initialProfile);
    const [editing, setEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<"personal" | "measurements" | "photos">(
        "personal"
    );
    const [saved, setSaved] = useState(false);

    const birthDate = new Date(`${profile.birthDay}T12:00:00`);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
            today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    const weight = Number(profile.weight);
    const height = Number(profile.height);
    const bmi =
        weight > 0 && height > 0
            ? (weight / Math.pow(height / 100, 2)).toFixed(1)
            : "—";

    const openEditor = () => {
        setDraft(profile);
        setSaved(false);
        setEditing(true);
    };

    const saveProfile = () => {
        setProfile(draft);
        setEditing(false);
        setSaved(true);
    };

    return (
        <main className="min-h-screen px-4 py-7 text-white sm:px-7 sm:py-9 lg:px-10 pb-5">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Mi perfil
                        </h1>
                        <p className="mt-2 text-sm text-white/40">
                            Tu información personal y evolución física.
                        </p>
                    </div>

                    <button
                        onClick={openEditor}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/10"
                    >
                        <Edit3 size={15} />
                        Editar perfil
                    </button>
                </header>

                {/* Profile identity */}
                <section className="relative mb-6 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#101012] p-5 sm:p-7">
                    <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-white/[0.035] blur-3xl" />
                    <div className="relative flex items-center gap-4">
                        <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] text-xl font-semibold tracking-tight text-white">
                            {profile.name
                                .trim()
                                .split(/\s+/)
                                .slice(0, 2)
                                .map((part) => part[0]?.toUpperCase())
                                .join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <h2 className="text-xl font-semibold tracking-tight">{profile.name}</h2>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-white/55">
                                    <ShieldCheck size={12} /> Perfil personal
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/40">
                                <span className="inline-flex items-center gap-1.5">
                                    <CalendarDays size={13} /> {age} años
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <UserRound size={13} /> {profile.gender === "Male" ? "Masculino" : "Femenino"}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Navigation tabs */}
                <div className="mb-7 flex gap-1 overflow-x-auto border-b border-white/[0.08]">
                    {[
                        { id: "personal", label: "Información personal" },
                        { id: "measurements", label: "Medidas corporales" },
                        { id: "photos", label: "Fotos de progreso" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() =>
                                setActiveTab(tab.id as typeof activeTab)
                            }
                            className={`relative shrink-0 px-4 py-3 text-sm transition ${
                                activeTab === tab.id
                                    ? "text-white"
                                    : "text-white/40 hover:text-white/70"
                            }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-white" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Personal information tab */}
                {activeTab === "personal" && (
                    <div className="space-y-8">
                        <section>
                            <SectionHeading
                                eyebrow="Información de cuenta"
                                title="Datos personales"
                                description="Consulta y administra la información básica de tu perfil."
                                action={
                                    <button
                                        onClick={openEditor}
                                        className="inline-flex items-center gap-1.5 text-xs text-white/45 transition hover:text-white"
                                    >
                                        Editar <Edit3 size={14} />
                                    </button>
                                }
                            />
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {[
                                    { label: "Nombre completo", value: profile.name, icon: CircleUserRound },
                                    {
                                        label: "Fecha de nacimiento",
                                        value: birthDate.toLocaleDateString("es-ES", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        }),
                                        icon: CalendarDays,
                                    },
                                    { label: "Género", value: profile.gender === "Male" ? "Masculino" : "Femenino", icon: UserRound },
                                    { label: "Edad", value: `${age} años`, icon: Clock3 },
                                ].map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={item.label} className="flex items-center gap-3.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035]">
                                                <Icon size={17} className="text-white/50" strokeWidth={1.7} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs text-white/35">{item.label}</p>
                                                <p className="mt-1 truncate text-sm font-medium text-white/85">{item.value}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section>
                            <SectionHeading
                                eyebrow="Estado actual"
                                title="Datos físicos"
                                description="Tus indicadores físicos principales registrados en LifeOS."
                            />
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                <MetricCard icon={Scale} label="Peso actual" value={profile.weight} unit="kg" detail="Último peso registrado" />
                                <MetricCard icon={Ruler} label="Estatura" value={profile.height} unit="cm" detail="Altura registrada" />
                                <MetricCard icon={Activity} label="IMC" value={bmi} unit="kg/m²" detail="Índice de masa corporal" />
                            </div>
                            <p className="mt-3 text-xs leading-5 text-white/30">
                                El IMC es un indicador general y no distingue entre masa muscular y grasa corporal.
                            </p>
                        </section>
                    </div>
                )}

                {/* Measurements tab */}
                {activeTab === "measurements" && (
                    <section>
                        <SectionHeading
                            eyebrow="Seguimiento corporal"
                            title="Medidas corporales"
                            description="Consulta las 12 medidas que forman parte de tu perfil físico."
                        />

                        <div className="mb-5 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 sm:max-w-xs">
                            <p className="text-xs text-white/40">Total de medidas registradas</p>
                            <p className="mt-2 text-2xl font-semibold">{measurements.length}</p>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
                            <div className="grid grid-cols-[1fr_auto] border-b border-white/[0.07] bg-white/[0.025] px-4 py-3.5 sm:px-5">
                                <span className="text-xs font-medium text-white/45">
                                    Medida
                                </span>
                                <span className="text-xs font-medium text-white/45">
                                    Valor registrado
                                </span>
                            </div>
                            {measurements.map((item, index) => (
                                <div
                                    key={item.label}
                                    className={`grid grid-cols-[1fr_auto] items-center px-4 py-4 sm:px-5 ${
                                        index !== measurements.length - 1
                                            ? "border-b border-white/[0.06]"
                                            : ""
                                    }`}
                                >
                                    <span className="text-sm text-white/75">
                                        {item.label}
                                    </span>
                                    <span className="text-sm font-medium tabular-nums text-white">
                                        {item.value}{" "}
                                        <span className="text-xs font-normal text-white/35">
                                            {item.unit}
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-xs leading-5 text-white/30">
                            Datos simulados para el diseño. Más adelante podrás
                            consultar los valores reales y su historial.
                        </p>
                    </section>
                )}

                {/* Photos tab */}
                {activeTab === "photos" && (
                    <section>
                        <SectionHeading
                            eyebrow="Evolución visual"
                            title="Fotos de progreso"
                            description="Consulta las fotografías de referencia organizadas por fecha y posición."
                        />

                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
                                    <Camera size={18} className="text-white/60" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        Registro fotográfico
                                    </p>
                                    <p className="mt-1 text-xs text-white/40">
                                        3 fotografías de muestra
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-white/40">
                                Próximamente: subir fotos
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <PhotoPlaceholder
                                label="Frontal"
                                date="12 ago 2026"
                                index={0}
                            />
                            <PhotoPlaceholder
                                label="Lateral"
                                date="12 sep 2026"
                                index={1}
                            />
                            <PhotoPlaceholder
                                label="Frontal"
                                date="12 oct 2026"
                                index={2}
                            />
                        </div>
                    </section>
                )}
            </div>

            {/* Edit profile modal */}
            {editing && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setEditing(false);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-profile-title"
                        className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#111113] p-5 shadow-2xl sm:p-7"
                    >
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2
                                    id="edit-profile-title"
                                    className="text-lg font-semibold"
                                >
                                    Editar perfil
                                </h2>
                                <p className="mt-1 text-sm text-white/40">
                                    Actualiza tu información personal.
                                </p>
                            </div>
                            <button
                                onClick={() => setEditing(false)}
                                aria-label="Cerrar"
                                className="rounded-lg p-2 text-white/40 transition hover:bg-white/[0.06] hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs text-white/55">
                                Nombre completo
                                <input
                                    className={inputClass}
                                    value={draft.name}
                                    onChange={(event) =>
                                        setDraft({
                                            ...draft,
                                            name: event.target.value,
                                        })
                                    }
                                    placeholder="Tu nombre"
                                    required
                                />
                            </label>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <label className="block text-xs text-white/55">
                                    Fecha de nacimiento
                                    <input
                                        className={inputClass}
                                        type="date"
                                        max={new Date().toISOString().slice(0, 10)}
                                        value={draft.birthDay}
                                        onChange={(event) =>
                                            setDraft({
                                                ...draft,
                                                birthDay: event.target.value,
                                            })
                                        }
                                        required
                                    />
                                </label>

                                <label className="block text-xs text-white/55">
                                    Género
                                    <select
                                        className={inputClass}
                                        value={draft.gender}
                                        onChange={(event) =>
                                            setDraft({
                                                ...draft,
                                                gender: event.target.value as
                                                    | "Male"
                                                    | "Female",
                                            })
                                        }
                                    >
                                        <option value="Male">Masculino</option>
                                        <option value="Female">Femenino</option>
                                    </select>
                                </label>

                                <label className="block text-xs text-white/55">
                                    Peso (kg)
                                    <input
                                        className={inputClass}
                                        type="number"
                                        min="1"
                                        max="500"
                                        step="0.1"
                                        value={draft.weight}
                                        onChange={(event) =>
                                            setDraft({
                                                ...draft,
                                                weight: event.target.value,
                                            })
                                        }
                                        required
                                    />
                                </label>

                                <label className="block text-xs text-white/55">
                                    Estatura (cm)
                                    <input
                                        className={inputClass}
                                        type="number"
                                        min="50"
                                        max="300"
                                        step="0.1"
                                        value={draft.height}
                                        onChange={(event) =>
                                            setDraft({
                                                ...draft,
                                                height: event.target.value,
                                            })
                                        }
                                        required
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="mt-7 flex justify-end gap-3">
                            <button
                                onClick={() => setEditing(false)}
                                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/60 transition hover:bg-white/[0.05]"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveProfile}
                                disabled={
                                    !draft.name.trim() ||
                                    !draft.birthDay ||
                                    new Date(`${draft.birthDay}T00:00:00`) > new Date() ||
                                    !Number.isFinite(Number(draft.weight)) ||
                                    Number(draft.weight) <= 0 ||
                                    !Number.isFinite(Number(draft.height)) ||
                                    Number(draft.height) <= 0
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Check size={15} />
                                Guardar cambios
                            </button>
                        </div>
                        <p className="mt-4 text-xs leading-5 text-white/25">
                            Los cambios se guardan solo en el estado de esta
                            página. Todavía no se envían al servidor.
                        </p>
                    </div>
                </div>
            )}
        </main>
    );
}
