import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import WindiCSS from 'vite-plugin-windicss';

export default defineConfig(() => ({
  base: '/ShippingPlatform/',               
  build: { outDir: 'docs', emptyOutDir: true },
  plugins: [react(), WindiCSS()],
  server: { open: '/login' },
}));