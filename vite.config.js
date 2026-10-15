import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],

    base: "./",

    build: {
        outDir: "dist",
        emptyOutDir: true,

        rolldownOptions: {
            input: {
                main: "index.html",
                settings: "settings.html"
            }
        }
    }
});