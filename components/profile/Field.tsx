import type { ReactNode } from "react";

type FieldProps = {
    label: string;
    children: ReactNode;
    hint?: string;
};

export default function Field({
                                  label,
                                  children,
                                  hint,
                              }: FieldProps) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-medium text-white/80">
                {label}
            </span>

            {children}

            {hint && (
                <span className="block text-xs text-white/40">
                    {hint}
                </span>
            )}
        </label>
    );
}