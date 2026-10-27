import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    reactCompiler: true,

    experimental: {
        serverActions: {
            bodySizeLimit: "50mb",
        },
    },

    turbopack: {
        root: path.join(__dirname, ".."),
    },
};

export default nextConfig;
