import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';
import {VitePWA} from 'vite-plugin-pwa';

const manifest={
    registerType: 'prompt',
    includeAssets: ['favicon.ico','logo192.png','logo512.png'],
    manifest: {
        name: "Colegio de Periodistas y Comunicadores de Tlaxcala",
        short_name: "CoPyComTlax",
        description:"Página oficial del Colegio de Periodistas y Comunicadores de Tlaxcala",
        icons:[
            {
                src: "/favicon.ico",
                sizes: "64x64 32x32 24x24 16x16",
                type: "image/x-icon",
                purpose: "favicon"
            },
            {
                src: "/logo192.png",
                type: "image/png",
                sizes: "192x192",
                purpose: "favicon"
            },
            {
                src: "/logo512.png",
                type: "image/png",
                sizes: "512x512",
                purpose: "favicon"
            }
        ],
        theme_color:"#003366",
        background_color:"#FFFFFF",
        display: "standalone",
        scope: "/",
        start_url: ""
    }
}

export default defineConfig({
    plugins:[
        react(),
        tailwindcss(),
        VitePWA(manifest)
    ],
    build: {
        outDir:"build" // Salida de build predeterminada de CRA
    },
    server: {
        host:true // Hacer app accessible fuera del contenedor
    }
});