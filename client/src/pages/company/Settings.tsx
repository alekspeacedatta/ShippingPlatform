import { useEffect, useState } from "react";
import { useGetCompanies, useGetCompany } from "../../api/useCompany";
import { Input } from "../../components/commons/Input"
import { useCompanyStore } from "../../store/useCompanyStore"
import type { Company } from "../../types/Types";

const Settings = () => {
    const companyId = useCompanyStore(state => state.companyInfo?.companyId);
    const { data, isLoading, isError, error } = useGetCompany(companyId ?? '');

    const [ companyInfo, setCompanyInfo ] = useState<Company | null>(null)

    useEffect(() => {
        if (data) {
          const company = data as Company;
          setCompanyInfo(company)
        }
      }, [data]);

    if(isLoading) return <p>Loading...</p>
    if(isError) return <p>Error: {error.message}</p>

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form action="">
                <section className="flex flex-col">
                    <label htmlFor="">Change company Email</label>
                    <Input value={companyInfo?.contactEmail} />
                </section>
                <section className="flex flex-col">
                    <label htmlFor="">Change company name</label>
                    <Input value={companyInfo?.name} />
                </section>
                <section className="flex flex-col">
                    <label htmlFor="">Change company phone</label>
                    <Input value={companyInfo?.phone} />
                </section>
                <section className="flex flex-col">
                    <label htmlFor="">Change company name</label>
                    <Input value={companyInfo?.password} />
                </section>
            </form>
        </div>
    )
}
export default Settings