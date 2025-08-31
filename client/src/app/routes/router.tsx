import { createBrowserRouter, Outlet } from "react-router-dom"
import Login from "../../pages/auth/Login"
import RegisterUser from "../../pages/auth/RegisterUser"
import RegisterCompany from "../../pages/auth/RegisterCompany"
import ProtectedRoute from "./ProtectedRoute"
import ClientDashboard from "../../pages/client/Dashboard"
import CompanyDashboard from "../../pages/company/Dashboard"
import ParcelForm from "../../components/client/ParcelForm"
export const router = createBrowserRouter([

    { path: '/login', element: <Login/>},
    { path: '/register/user', element: <RegisterUser/>},
    { path: '/register/company', element: <RegisterCompany/>},

    {path: '/client', element: ( <ProtectedRoute allowed={['USER']}><Outlet/></ProtectedRoute> ), children: [
        { path: 'dashboard', element: <ClientDashboard/>},
        { path: 'create-request', element: <ParcelForm/>},
        { path: 'requests/:id', element: <><h1>client requests ID</h1></>},
        { path: 'track', element: <><h1>client Track Parcel</h1></>},
    ]},
    
    {path: '/company', element: ( <ProtectedRoute allowed={['COMPANY_ADMIN']}><Outlet/></ProtectedRoute> ), children: [
        { path: 'dashboard', element: <CompanyDashboard/>},
        { path: 'requests', element: <><h1>company request</h1></>},
        { path: 'requests/:id', element: <><h1>company request ID</h1></>},
        { path: 'pricing', element: <><h1>company pricing</h1></>},
        { path: 'settings', element: <><h1>company settings</h1></>},
    ]},
]);