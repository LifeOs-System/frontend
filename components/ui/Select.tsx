"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption<T extends string | number> {
    value: T;
    label: string;
}

interface SelectProps<T extends string | number> {
    options: SelectOption<T>[];
    value: T;
    onChange: (value: T) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean; //  Nueva prop opcional
}

export function Select<T extends string | number>({
                                                      options,
                                                      value,
                                                      onChange,
                                                      placeholder = "Seleccionar...",
                                                      className = "",
                                                      disabled = false, // ⭐ Valor por defecto
                                                  }: SelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Cerrar el dropdown al hacer clic fuera del componente
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Trigger (Botón principal) */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm font-medium outline-none transition focus:border-white/20 ${
                    disabled
                        ? "text-white/40 cursor-not-allowed opacity-50"
                        : "text-white/80 hover:bg-white/[0.06]"
                }`}
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                        disabled ? "text-white/30" : "text-white/50"
                    } ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown (Menú desplegable) */}
            {isOpen && !disabled && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                    <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {options.map((option) => {
                            const isSelected = option.value === value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                                        isSelected
                                            ? "bg-white/[0.08] text-white"
                                            : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                                    }`}
                                >
                                    <span>{option.label}</span>
                                    {isSelected && <Check className="h-4 w-4 text-white" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}