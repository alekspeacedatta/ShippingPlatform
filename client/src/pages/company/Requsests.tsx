import { useNavigate } from "react-router-dom"
import RequestsTable from "../../components/company/RequestsTable"

const Requsests = () => {
  const navigate = useNavigate()
  return (
    <>    
      <RequestsTable/>
    </>
  )
}
export default Requsests