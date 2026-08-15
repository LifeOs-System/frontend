"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

// ─── Definición de variantes con CVA ──────────────────────────────────────────
const buttonVariants = cva(
    // Estilos base aplicados a TODAS las variantes
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-[13px] font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 overflow-hidden",
    {
        variants: {
            variant: {
                // Primario: Fondo oscuro premium con glow blanco al hover
                default:
                    "bg-[#0a0a0c] text-white border border-white/[0.1] hover:bg-[#111113] hover:border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_25px_rgba(255,255,255,0.08)]",

                // Outline con Glow: Fondo oscuro translúcido + borde + brillo superior
                outline:
                    "group bg-white/[0.02] border border-white/[0.06] text-white/80 hover:bg-white/[0.05] hover:text-white hover:border-white/10",
            },
            size: {
                default: "h-10 px-4 py-2.5",
                sm: "h-8 rounded-lg px-3 text-[12px]",
                lg: "h-12 rounded-xl px-6 text-[14px]",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    icon?: React.ReactNode;
    iconRight?: React.ReactNode;
    isLoading?: boolean;
}

// ─── Componente ───────────────────────────────────────────────────────────────
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, icon, iconRight, isLoading, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                className={buttonVariants({ variant, size, className })}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {/* Glow superior exclusivo para la variante outline */}
                {variant === "outline" && (
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}

                {/* Spinner de carga */}
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        {icon && <span className="flex items-center">{icon}</span>}
                        {children}
                        {iconRight && <span className="flex items-center">{iconRight}</span>}
                    </>
                )}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };