import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import WindiCSS from 'vite-plugin-windicss';
import { VitePWA } from 'vite-plugin-pwa';

const REPO_NAME = 'ShippingPlatform';
const BASE_PATH = `/${REPO_NAME}/`;

export default defineConfig(({ command }) => ({
  base: command === 'build' ? BASE_PATH : '/',
  server: { open: '/login' },
  plugins: [
    react(),
    WindiCSS(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'vite.svg',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
      ],
      manifest: {
        name: 'ICSP',
        short_name: 'ICSP',
        description: 'ICSP Shipping Platform',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: BASE_PATH,
        start_url: `${BASE_PATH}#/login`,
        icons: [
          {
            src: `${BASE_PATH}pwa-192x192.png`,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: `${BASE_PATH}pwa-512x512.png`,
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: `${BASE_PATH}pwa-512x512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
}));