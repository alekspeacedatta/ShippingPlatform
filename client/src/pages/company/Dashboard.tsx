import { useGetUser } from "../../api/useAuth";
import { Button } from "../../components/commons/Button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore"
import { useCompanyStore } from "../../store/useCompanyStore";

const Dashboard = () => {
    const navigate = useNavigate();
    const navigation = (route: string) => {
        navigate(route);
    }
    const { data: admin, isLoading, isError, error } = useGetUser();
    const logout = useAuthStore(state => state.logout);
    const companyLogout = useCompanyStore(state => state.companyLogout);

    if(isLoading) return <p>Loading...</p>
    if(isError) return <p>Error  {error.message}</p>
    const handleLogout = () => {
        logout();
        companyLogout();
    }
    return (
        <>
            <div className="min-h-screen flex justify-center items-center flex-col gap-3">
                <h1>{admin?.fullName} this is your Admin Dashboard</h1>
                <div className="flex gap-10 items-center">
                    <Button onClick={() => { navigation('/company/requests') }}>All Requests</Button>
                    <Button onClick={() => { navigation('/company/pricing') }}>pricing</Button>
                    <Button onClick={() => { navigation('/company/settings') }}>settings</Button>
                    <Button onClick={handleLogout}>Logout</Button>
                </div>
            </div>
        </>
    )
}
export default Dashboard