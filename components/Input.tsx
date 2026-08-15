// components/ui/Input.tsx
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

// Usamos React.forwardRef para que el input pueda recibir referencias (útil para animaciones o focus management de Radix)
const Input = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & { asChild?: boolean }
>(({ className = "", type, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "input";

    return (
        <Comp
            type={type}
            className={`
                /* Reset total del input nativo */
                flex h-12 w-full rounded-xl border bg-white/[0.02] px-4 py-3 
                text-[14px] text-white placeholder:text-white/20 
                outline-none transition-all duration-300 ease-out
                file:border-0 file:bg-transparent file:text-sm file:font-medium
                
                /* Estados personalizados (Hover y Focus) */
                border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]
                focus-visible:border-white/20 focus-visible:bg-white/[0.04] 
                focus-visible:shadow-[0_0_20px_rgba(255,255,255,0.05)]
                focus-visible:ring-0 /* Quitamos el anillo por defecto */
                
                /* Estado deshabilitado */
                disabled:cursor-not-allowed disabled:opacity-50
                
                ${className}
            `}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };