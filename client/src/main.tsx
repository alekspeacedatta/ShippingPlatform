import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import 'virtual:windi.css'
import { router } from './app/routes/router.tsx';
import './App.css';
import './styles/base.css';
import AppProvider from './app/providers/provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>  
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>,
)
