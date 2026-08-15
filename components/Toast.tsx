// components/ui/Toast.tsx
"use client";

import { Toaster as SonnerToaster, toast } from "sonner";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

// ─── Configuración del Toaster visual ─────────────────────────────────────────
export function Toaster() {
    return (
        <SonnerToaster
            position="top-center"
            expand={true}
            richColors={false}
            gap={10}
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: 'group relative flex w-[340px] overflow-hidden rounded-xl transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-full data-[state=open]:slide-in-from-top-full',
                    title: 'text-[13px] font-medium text-white/95 tracking-tight',
                    description: 'text-[12px] text-white/50 mt-0.5 leading-relaxed font-normal',
                    closeButton: 'absolute right-2.5 top-2.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none p-1 text-white/40 hover:text-white hover:bg-white/[0.06]',
                },
            }}
        />
    );
}

// ─── Funciones Helper ─────────────────────────────────────────────────────────
type ToastProps = {
    title: string;
    description?: string;
};

type ToastVariant = "success" | "error" | "warning" | "info";

// Configuración centralizada de cada variante
const TOAST_VARIANTS: Record<ToastVariant, {
    icon: React.ReactNode;
    borderColor: string;
    glowShadow: string;
    iconColor: string;
}> = {
    success: {
        icon: <CheckCircle2 className="h-6 w-6" strokeWidth={1.75} />,
        borderColor: "border-white/80",
        glowShadow: "shadow-[0_0_20px_rgba(255,255,255,0.35),0_8px_32px_rgba(0,0,0,0.5)]",
        iconColor: "text-white",
    },
    error: {
        icon: <XCircle className="h-6 w-6" strokeWidth={1.75} />,
        borderColor: "border-white/50",
        glowShadow: "shadow-[0_0_14px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.5)]",
        iconColor: "text-white/80",
    },
    warning: {
        icon: <AlertTriangle className="h-6 w-6" strokeWidth={1.75} />,
        borderColor: "border-white/60",
        glowShadow: "shadow-[0_0_16px_rgba(255,255,255,0.25),0_8px_32px_rgba(0,0,0,0.5)]",
        iconColor: "text-white/90",
    },
    info: {
        icon: <Info className="h-6 w-6" strokeWidth={1.75} />,
        borderColor: "border-white/30",
        glowShadow: "shadow-[0_0_10px_rgba(255,255,255,0.12),0_8px_32px_rgba(0,0,0,0.5)]",
        iconColor: "text-white/60",
    },
};

// ─── Contenedor reutilizable ──────────────────────────────────────────────────
function ToastContainer({
                            variant,
                            title,
                            description
                        }: {
    variant: ToastVariant;
    title: string;
    description?: string;
}) {
    const config = TOAST_VARIANTS[variant];

    return (
        <div
            className={`relative flex items-center gap-3 w-full rounded-xl bg-[#0c0c0e]/95 backdrop-blur-xl p-3.5 pr-8 border ${config.borderColor} ${config.glowShadow}`}
        >
            {/* ── Icono (h-6 w-6, centrado verticalmente) ── */}
            <div className={`flex-shrink-0 ${config.iconColor}`}>
                {config.icon}
            </div>

            {/* ── Contenido ── */}
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white/95 tracking-tight truncate">
                    {title}
                </p>
                {description && (
                    <p className="text-[12px] text-white/50 leading-relaxed line-clamp-2">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

// ─── API Pública ──────────────────────────────────────────────────────────────
export const notify = {
    success: ({ title, description }: ToastProps) =>
        toast.custom(() => <ToastContainer variant="success" title={title} description={description} />),

    error: ({ title, description }: ToastProps) =>
        toast.custom(() => <ToastContainer variant="error" title={title} description={description} />),

    warning: ({ title, description }: ToastProps) =>
        toast.custom(() => <ToastContainer variant="warning" title={title} description={description} />),

    info: ({ title, description }: ToastProps) =>
        toast.custom(() => <ToastContainer variant="info" title={title} description={description} />),
};