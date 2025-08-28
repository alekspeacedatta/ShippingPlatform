import { createBrowserRouter } from "react-router-dom"
import Login from "../../pages/auth/Login"
import RegisterUser from "../../pages/auth/RegisterUser"
import RegisterCompany from "../../pages/auth/RegisterCompany"
import ProtectedRoute from "./ProtectedRoute"
import Stepper from "../../components/commons/Stepper"
export const router = createBrowserRouter([

    { path: '/login', element: <Login/>},
    { path: '/register/user', element: <RegisterUser/>},
    { path: '/register/company', element: <RegisterCompany/>},


    { path: '/client/dashboard', element: <><h1><Stepper/></h1></>},
    { path: '/client/create-request', element: <><h1>client create request</h1></>},
    { path: '/client/requests/:id', element: <><h1>client requests ID</h1></>},
    { path: '/client/track', element: <><h1>client requests ID</h1></>},


    { path: '/company/dashboard', element: <><h1>company dashboard</h1></>},
    { path: '/company/requests', element: <><h1>company request</h1></>},
    { path: '/company/requests/:id', element: <><h1>company request ID</h1></>},
    { path: '/company/pricing', element: <><h1>company pricing</h1></>},
    { path: '/company/settings', element: <><h1>company settings</h1></>},


])