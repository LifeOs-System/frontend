"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import {Button} from "@/components/Button";


interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];

    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;

    prompt(): Promise<void>;
}

export default function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            console.log("🔥 beforeinstallprompt recibido");

            event.preventDefault();

            const promptEvent =
                event as BeforeInstallPromptEvent;

            setDeferredPrompt(promptEvent);
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt
        );

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt
            );
        };
    }, []);

    const handleInstallClick = async () => {
        console.log("🟢 Botón de instalar pulsado");

        if (!deferredPrompt) {
            console.error(
                "❌ No existe deferredPrompt. El navegador no ha proporcionado beforeinstallprompt."
            );

            return;
        }

        try {
            await deferredPrompt.prompt();

            const { outcome } =
                await deferredPrompt.userChoice;

            console.log("Resultado de instalación:", outcome);

            setDeferredPrompt(null);
        } catch (error) {
            console.error(
                "❌ Error intentando instalar LifeOS:",
                error
            );
        }
    };

    return (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col items-end gap-2 max-w-[calc(100%-3rem)]">
            <Button onClick={handleInstallClick}>
                <Download className="h-5 w-5 shrink-0" />

                <span className="truncate">
          Instalar LifeOS
        </span>
            </Button>
        </div>
    );
}