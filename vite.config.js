import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    envPrefix: "VITE_",
    plugins: [
        laravel({
            input: [
                "resources/css/app.css",
                "resources/js/app.jsx",
                'resources/sass/app.scss',
            ],
            refresh: true,
        }),
        react(),
    ],
});
