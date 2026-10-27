import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HabitAnalysis } from "@/app/(app)/habits/ia-30-days-summary/prompts";
import { HabitCard } from "./HabitCard";

interface HabitCarouselProps {
    habits: HabitAnalysis[];
}

export function HabitCarousel({ habits }: HabitCarouselProps) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);

    const handleScroll = () => {
        const el = carouselRef.current;
        if (!el) return;
        setIndex(Math.round(el.scrollLeft / el.clientWidth));
    };

    const scrollCarousel = (direction: 1 | -1) => {
        const el = carouselRef.current;
        if (!el) return;
        el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                    Análisis por hábito
                </p>
                <div className="flex items-center gap-3">
                    <span className="text-[11px] text-white/40 tabular-nums">
                        {index + 1} / {habits.length}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => scrollCarousel(-1)}
                            disabled={index === 0}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-white/60 transition-all hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
                            aria-label="Anterior"
                        >
                            <ChevronLeft size={15} />
                        </button>
                        <button
                            onClick={() => scrollCarousel(1)}
                            disabled={index === habits.length - 1}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-white/60 transition-all hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
                            aria-label="Siguiente"
                        >
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            </div>

            <div
                ref={carouselRef}
                onScroll={handleScroll}
                className="shelf-scroll flex overflow-x-auto snap-x snap-mandatory pb-4"
            >
                {habits.map((h) => (
                    <HabitCard key={h.id} habit={h} />
                ))}
            </div>
        </section>
    );
}