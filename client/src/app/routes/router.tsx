import { createHashRouter, Outlet, Navigate } from 'react-router-dom';
import { lazy, Suspense, type JSX } from 'react';

const Login = lazy(() => import('../../pages/auth/Login'));
const RegisterUser = lazy(() => import('../../pages/auth/RegisterUser'));
const RegisterCompany = lazy(() => import('../../pages/auth/RegisterCompany'));

const ClientDashboard = lazy(() => import('../../pages/client/Dashboard'));
const CreateRequest = lazy(() => import('../../pages/client/CreateRequest'));
const RequestList = lazy(() => import('../../components/client/RequestList'));
const RequestDetail = lazy(() => import('../../components/client/RequestDetail'));

const CompanyDashboard = lazy(() => import('../../pages/company/Dashboard'));
const Requests = lazy(() => import('../../pages/company/Requests'));
const RequestDetailPanel = lazy(() => import('../../components/company/RequestDetailPanel'));
const Pricing = lazy(() => import('../../pages/company/Pricing'));
const Settings = lazy(() => import('../../pages/company/Settings'));
const Track = lazy(() => import('../../pages/client/Track'));

import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoutes';

const wrap = (el: JSX.Element) => <Suspense fallback={<div className="p-6">Loading…</div>}>{el}</Suspense>;

export const router = createHashRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  {
    path: '/login',
    element: wrap(
      <PublicOnlyRoute>
        <Login />
      </PublicOnlyRoute>,
    ),
  },
  {
    path: '/register/user',
    element: wrap(
      <PublicOnlyRoute>
        <RegisterUser />
      </PublicOnlyRoute>,
    ),
  },
  {
    path: '/register/company',
    element: wrap(
      <PublicOnlyRoute>
        <RegisterCompany />
      </PublicOnlyRoute>,
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
      { path: 'dashboard', element: wrap(<ClientDashboard />) },
      { path: 'create-request', element: wrap(<CreateRequest />) },
      { path: 'requests', element: wrap(<RequestList />) },
      { path: 'requests/:parcelId', element: wrap(<RequestDetail />) },
      { path: 'track', element: wrap(<Track />) },
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
      { path: 'dashboard', element: wrap(<CompanyDashboard />) },
      { path: 'requests', element: wrap(<Requests />) },
      { path: 'requests/:parcelId', element: wrap(<RequestDetailPanel />) },
      { path: 'pricing', element: wrap(<Pricing />) },
      { path: 'settings', element: wrap(<Settings />) },
    ],
  },

  { path: '*', element: <Navigate to="/login" replace /> },
]);
