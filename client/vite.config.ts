import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import WindiCSS from 'vite-plugin-windicss';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/ShippingPlatform/' : '/',
  server: { open: '/login' },
  plugins: [react(), WindiCSS()],
}));