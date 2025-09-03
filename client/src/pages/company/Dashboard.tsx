import { useGetUser } from "../../api/useAuth";
import { Button } from "../../components/commons/Button";
import { useAuthStore } from "../../store/useAuthStore"
import { useCompanyStore } from "../../store/useCompanyStore";

const Dashboard = () => {
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
                <h1>{admin?.fullName} this is your Dashboard</h1>
                <Button onClick={handleLogout}>Logout</Button>
            </div>
        </>
    )
}
export default Dashboard