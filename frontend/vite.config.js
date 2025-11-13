import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins:[
        react(),
        tailwindcss(),
    ],
    build: {
        outDir:"build" // Salida de build predeterminada de CRA
    },
    server: {
        host:true // Hacer app accessible fuera del contenedor
    }
});