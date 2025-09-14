// routes/router.tsx
import { createBrowserRouter, Outlet } from 'react-router-dom';
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

export const router = createBrowserRouter([
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

  {
    path: '/client',
    element: (
      <ProtectedRoute allowed={['USER']}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <ClientDashboard /> },
      { path: 'create-request', element: <CreateRequest /> },
      { path: 'requests', element: <RequestList /> },
      { path: 'requests/:parcelId', element: <RequestDetail /> },
      {
        path: 'track',
        element: (
          <>
            <h1>client Track Parcel</h1>
          </>
        ),
      },
    ],
  },
  {
    path: '/company',
    element: (
      <ProtectedRoute allowed={['COMPANY_ADMIN']}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <CompanyDashboard /> },
      { path: 'requests', element: <Requsests /> },
      { path: 'requests/:parcelId', element: <RequestDetailPanel /> },
      { path: 'pricing', element: <Pricing /> },
      {
        path: 'settings',
        element: <Settings/>
      },
    ],
  },
]);
