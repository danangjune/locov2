import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/css/app.css",
                "resources/js/app.jsx",
                "resources/js/pecut/main.jsx",
                'resources/sass/app.scss',
            ],
            refresh: true,
        }),
        react(),
    ],
});
