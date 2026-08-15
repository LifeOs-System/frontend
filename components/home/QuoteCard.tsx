"use client";

import { useMemo } from "react";

const QUOTES = [
    { text: "La disciplina es el puente entre las metas y los logros.", author: "Jim Rohn" },
    { text: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.", author: "Robert Collier" },
    { text: "No cuentes los días, haz que los días cuenten.", author: "Muhammad Ali" },
    { text: "El único modo de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs" },
    { text: "La vida es lo que pasa mientras estás ocupado haciendo otros planes.", author: "John Lennon" },
];

interface QuoteCardProps {
    dayOfYear: number;
}

export function QuoteCard({ dayOfYear }: QuoteCardProps) {
    const quote = useMemo(
        () => QUOTES[(dayOfYear - 1) % QUOTES.length] ?? QUOTES[0],
        [dayOfYear]
    );

    return (
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.05] bg-white/[0.01] p-10 backdrop-blur-sm">
            {/* Número del día decorativo de fondo */}
            <div className="pointer-events-none absolute -right-8 -top-12 select-none">
                <span className="text-[280px] font-bold leading-none text-white/[0.03] tabular-nums">
                    {dayOfYear}
                </span>
            </div>

            {/* Patrón de puntos */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: "28px 28px",
                }}
            />

            {/* Header */}
            <div className="relative flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
                    Cita del día
                </p>
            </div>

            {/* Cita */}
            <div className="relative my-auto space-y-4 py-10">
                <p className="text-2xl font-light leading-relaxed tracking-tight text-white/90 md:text-[28px]">
                    <span className="mr-1 align-top text-4xl leading-none text-white/30">
                        "
                    </span>
                    {quote.text}
                    <span className="ml-1 align-bottom text-4xl leading-none text-white/30">
                        "
                    </span>
                </p>
                <p className="text-[13px] font-medium tracking-wide text-white/50">
                    — {quote.author}
                </p>
            </div>

            {/* Footer */}
            <div className="relative flex items-center justify-end border-t border-white/[0.05] pt-4">
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/30">
                    Día {dayOfYear}
                </span>
            </div>
        </div>
    );
}