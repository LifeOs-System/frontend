// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CheckCircle2,
    NotebookText,
    Calendar,
    Library,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/utils/utils";

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface NavItem {
    href: string;
    label: string;
    icon: LucideIcon;
}

interface FooterItem {
    id: "settings" | "logout";
    label: string;
    icon: LucideIcon;
}

// ─── Datos de navegación ──────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
    { href: "/home",   label: "Panel de control", icon: LayoutDashboard },
    { href: "/today",  label: "Hoy",              icon: Calendar        },
    { href: "/habits", label: "Hábitos",          icon: CheckCircle2    },
    { href: "/library", label: "Libreria",        icon: Library    },
];



// ─── Componente principal ─────────────────────────────────────────────────────
export default function Sidebar(): React.JSX.Element {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "relative flex flex-col w-[240px] h-screen",
                "bg-[#0d0d0f] border-r border-white/[0.06]"
            )}
        >
            {/* ── Glow decorativo superior ── */}
            <div className={cn(
                "pointer-events-none absolute top-0 left-0 right-0 h-px",
                "bg-gradient-to-r from-transparent via-white/20 to-transparent"
            )} />

            {/* ── Label sección ── */}
            <p className={cn(
                "px-5 pt-7 pb-2 text-[10px] font-medium tracking-[0.15em]",
                "uppercase text-white/20 select-none"
            )}>
                Navegación
            </p>

            {/* ── Items de navegación ── */}
            <nav className="flex-1 flex flex-col gap-1 px-3">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group relative flex items-center gap-3",
                                "w-full rounded-xl px-3 py-2.5",
                                "text-[13px] font-medium",
                                "transition-all duration-200 ease-out",
                                "outline-none focus-visible:ring-1 focus-visible:ring-white/20",
                                isActive
                                    ? "bg-white/[0.07] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                                    : "text-white/35 hover:text-white/70 hover:bg-white/[0.04]"
                            )}
                        >
                            {/* Barra lateral indicadora activa */}
                            <span
                                className={cn(
                                    "absolute left-0 top-1/2 -translate-y-1/2",
                                    "w-[2px] rounded-r-full bg-white",
                                    "transition-all duration-200",
                                    isActive ? "h-4 opacity-80" : "h-0 opacity-0"
                                )}
                            />

                            <Icon
                                className={cn(
                                    "flex-shrink-0 w-[18px] h-[18px]",
                                    "transition-colors duration-200",
                                    isActive
                                        ? "text-white/90"
                                        : "text-white/30 group-hover:text-white/60"
                                )}
                                strokeWidth={1.8}
                            />

                            <span className="truncate">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}