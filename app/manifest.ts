import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "LifeOS",
        short_name: "LifeOS",
        description: "Sistema de gestión de hábitos y vida personal.",
        start_url: "/",
        display: "fullscreen",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
            {
                src: "/logo.png",
                sizes: "192x192",
                type: "image/png",
            },
        ],
    };
}