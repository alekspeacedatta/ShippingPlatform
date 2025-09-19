// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppProvider from './app/providers/provider';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes/router';

import 'virtual:windi.css';
import './styles/base.css';

if (!location.hash) {
  location.replace(`${location.pathname}#/login`);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>,
);
