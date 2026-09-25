"use client";

import { Maximize } from "lucide-react";

export default function FullscreenButton() {
  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.error("No se pudo activar fullscreen:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={enterFullscreen}
      className="fixed bottom-6 left-6 z-[9999] flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-gray-800"
    >
      <Maximize className="h-4 w-4" />
      Pantalla completa
    </button>
  );
}
