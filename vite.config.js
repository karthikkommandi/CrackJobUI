import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    server: {
        port: 55682,
        proxy: {
            '/api': {
                target: 'https://localhost:7077',
                changeOrigin: true,
                secure: false, // accept the self-signed dev certificate
            },
        },
    },
})