import { Button } from "../../components/commons/Button";
import { useAuthStore } from "../../store/useAuthStore"

const Dashboard = () => {
    const logout = useAuthStore(state => state.logout);
    const user = useAuthStore(state => state.user);

    return (
        <>
            <h1>{user?.fullName} this is your Dashboard</h1>
            <Button onClick={logout}>Logout</Button>
        </>
    )
}
export default Dashboard