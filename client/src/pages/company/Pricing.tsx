import { useNavigate } from "react-router-dom"
import PricingForm from "../../components/company/PricingForm"

const Pricing = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col gap-4 min-h-screen justify-center items-center">
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <p className="cursor-pointer hover:underline hover:underline-offset-4 hover:font-semibold" onClick={() => navigate(-1)}>Dashboard</p>
                    <span>→</span>
                    <p className="cursor-pointer underline transition-all duration-200 underline-offset-4 font-semibold text-indigo-500">Pricing</p>
                </div>
                <div className="flex flex-col gap-4">
                    <h1 className="font=semibold text-2xl">Company Pricing form that you can edit</h1>
                    <PricingForm/>
                </div>
            </div>
        </div>
    )
}
export default Pricing