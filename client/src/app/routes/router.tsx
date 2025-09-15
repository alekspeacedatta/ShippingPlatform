// routes/router.tsx
import { createHashRouter, Outlet, Navigate } from 'react-router-dom';
import Login from '../../pages/auth/Login';
import RegisterUser from '../../pages/auth/RegisterUser';
import RegisterCompany from '../../pages/auth/RegisterCompany';
import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoutes';

import ClientDashboard from '../../pages/client/Dashboard';
import CompanyDashboard from '../../pages/company/Dashboard';
import CreateRequest from '../../pages/client/CreateRequest';
import RequestList from '../../components/client/RequestList';
import RequestDetail from '../../components/client/RequestDetail';
import RequestDetailPanel from '../../components/company/RequestDetailPanel';
import Requsests from '../../pages/company/Requsests';
import Pricing from '../../pages/company/Pricing';
import Settings from '../../pages/company/Settings';

export const router = createHashRouter([
  // Root → login
  { path: '/', element: <Navigate to="/login" replace /> },

  // Public auth
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <Login />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/register/user',
    element: (
      <PublicOnlyRoute>
        <RegisterUser />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/register/company',
    element: (
      <PublicOnlyRoute>
        <RegisterCompany />
      </PublicOnlyRoute>
    ),
  },

  // Client
  {
    path: '/client',
    element: (
      <ProtectedRoute allowed={['USER']}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> }, // /client → /client/dashboard
      { path: 'dashboard', element: <ClientDashboard /> },
      { path: 'create-request', element: <CreateRequest /> },
      { path: 'requests', element: <RequestList /> },
      { path: 'requests/:parcelId', element: <RequestDetail /> },
      { path: 'track', element: <h1>client Track Parcel</h1> },
    ],
  },

  // Company
  {
    path: '/company',
    element: (
      <ProtectedRoute allowed={['COMPANY_ADMIN']}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> }, // /company → /company/dashboard
      { path: 'dashboard', element: <CompanyDashboard /> },
      { path: 'requests', element: <Requsests /> },
      { path: 'requests/:parcelId', element: <RequestDetailPanel /> },
      { path: 'pricing', element: <Pricing /> },
      { path: 'settings', element: <Settings /> },
    ],
  },

  // Fallback
  { path: '*', element: <Navigate to="/login" replace /> },
]);
