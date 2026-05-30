import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 4173,
    https: true,
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
});
