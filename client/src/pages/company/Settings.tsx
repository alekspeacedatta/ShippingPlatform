import { useEffect, useState } from 'react'
import { useCompanyDataUpdate, useGetCompany } from '../../api/useCompany'
import { Input } from '../../components/commons/Input'
import { useCompanyStore } from '../../store/useCompanyStore'
import type { Company } from '../../types/Types'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/commons/Button'
import { useAuthStore } from '../../store/useAuthStore'

type CompanyForm = {
  userId: string
  companyId: string
  name: string
  contactEmail: string
  phone: string
  logoUrl: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

const Settings = () => {
  const navigate = useNavigate()
  const companyId = useCompanyStore((s) => s.companyInfo?.companyId)
  const userId = useAuthStore((s) => s.authInfo?.userId) ?? ''
  const { data, isLoading, isError, error } = useGetCompany(companyId ?? '')
  const { mutate } = useCompanyDataUpdate()

  const [companyData, setCompanyData] = useState<CompanyForm>({
    userId: '',
    companyId: '',
    name: '',
    contactEmail: '',
    phone: '',
    logoUrl: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (data) {
      const c = data as Company
      setCompanyData((prev) => ({
        ...prev,
        userId,
        companyId: c._id,
        name: c.name ?? '',
        contactEmail: c.contactEmail ?? '',
        phone: c.phone ?? '',
        logoUrl: c.logoUrl ?? '',
      }))
    }
  }, [data, userId])

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error: {error.message}</p>

  const handleDataUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    const { currentPassword, newPassword, confirmPassword, ...rest } = companyData

    const wantsPasswordChange = Boolean(currentPassword || newPassword || confirmPassword)

    if (wantsPasswordChange) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Please fill all password fields.')
        return
      }
      if (newPassword !== confirmPassword) {
        alert('New passwords do not match.')
        return
      }
      if (newPassword.length < 6) {
        alert('New password must be at least 6 characters.')
        return
      }
    }

    mutate({
      ...rest,
      currentPassword: wantsPasswordChange ? currentPassword : undefined,
      newPassword: wantsPasswordChange ? newPassword : undefined,
    })
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='flex w-full max-w-3xl flex-col justify-end gap-4'>
        <div className='flex items-center gap-2'>
          <p
            className='cursor-pointer hover:font-semibold hover:underline hover:underline-offset-4'
            onClick={() => navigate(-1)}
          >
            Dashboard
          </p>
          <span>→</span>
          <p className='cursor-pointer font-semibold text-indigo-500 underline underline-offset-4 transition-all duration-200'>
            Settings
          </p>
        </div>

        <form onSubmit={handleDataUpdate} className='flex flex-col gap-7 rounded border bg-white p-4'>
          <h1 className='text-2xl font-bold'>Edit company information</h1>

          <div className='grid grid-cols-1 gap-7 md:grid-cols-2'>
            <section className='flex flex-col'>
              <label>Company Email</label>
              <Input
                value={companyData.contactEmail}
                onChange={(e) => setCompanyData((p) => ({ ...p, contactEmail: e.target.value }))}
              />
            </section>

            <section className='flex flex-col'>
              <label>Company Name</label>
              <Input
                value={companyData.name}
                onChange={(e) => setCompanyData((p) => ({ ...p, name: e.target.value }))}
              />
            </section>

            <section className='flex flex-col md:col-span-2'>
              <label>Phone</label>
              <Input
                value={companyData.phone}
                onChange={(e) => setCompanyData((p) => ({ ...p, phone: e.target.value }))}
              />
            </section>

            <section className='flex flex-col md:col-span-2'>
              <label>Logo URL</label>
              <Input
                value={companyData.logoUrl}
                onChange={(e) => setCompanyData((p) => ({ ...p, logoUrl: e.target.value }))}
              />
            </section>
          </div>

          <div className='grid grid-cols-1 gap-7 md:grid-cols-3'>
            <section className='flex flex-col'>
              <label>Current password</label>
              <Input
                type='password'
                placeholder='Current password'
                value={companyData.currentPassword}
                onChange={(e) => setCompanyData((p) => ({ ...p, currentPassword: e.target.value }))}
              />
            </section>
            <section className='flex flex-col'>
              <label>New password</label>
              <Input
                type='password'
                placeholder='New password'
                value={companyData.newPassword}
                onChange={(e) => setCompanyData((p) => ({ ...p, newPassword: e.target.value }))}
              />
            </section>
            <section className='flex flex-col'>
              <label>Confirm new password</label>
              <Input
                type='password'
                placeholder='Confirm new password'
                value={companyData.confirmPassword}
                onChange={(e) => setCompanyData((p) => ({ ...p, confirmPassword: e.target.value }))}
              />
            </section>
          </div>

          <Button type='submit'>Save</Button>
        </form>
      </div>
    </div>
  )
}

export default Settings
