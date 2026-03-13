import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Añadimos esto

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(), // Y activamos el plugin aquí
    ],
})