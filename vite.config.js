import { defineConfig } from 'vite';

export default defineConfig({
    base: '/holi/',
    server: {
        host: true, // Listen on all local IPs
        port: 5173,
        strictPort: true,
    },
});
