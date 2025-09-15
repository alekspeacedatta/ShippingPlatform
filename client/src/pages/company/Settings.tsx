import { useEffect, useMemo, useState } from 'react';
import { useCompanyDataUpdate, useGetCompany } from '../../api/useCompany';
import { Input } from '../../components/commons/Input';
import { useCompanyStore } from '../../store/useCompanyStore';
import type { Company } from '../../types/Types';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/commons/Button';
import { useAuthStore } from '../../store/useAuthStore';
import DashboardHeader from '../../components/company/dashboardHeader';

type CompanyForm = {
  userId: string;
  companyId: string;
  name: string;
  contactEmail: string;
  phone: string;
  logoUrl: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

type Banner = { type: 'success' | 'error'; text: string } | null;
type FieldErrors = Partial<Record<keyof CompanyForm, string>>;

const Settings = () => {
  const navigate = useNavigate();
  const companyId = useCompanyStore((s) => s.companyInfo?.companyId);
  const userId = useAuthStore((s) => s.authInfo?.userId) ?? '';
  const { data, isLoading, isError, error } = useGetCompany(companyId ?? '');

  const { mutate, isPending } = useCompanyDataUpdate?.() ?? ({ mutate: () => {}, isPending: false } as any);

  const [banner, setBanner] = useState<Banner>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

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
  });

  const [initialData, setInitialData] = useState<
    Pick<CompanyForm, 'userId' | 'companyId' | 'name' | 'contactEmail' | 'phone' | 'logoUrl'>
  >({
    userId: '',
    companyId: '',
    name: '',
    contactEmail: '',
    phone: '',
    logoUrl: '',
  });

  useEffect(() => {
    if (data) {
      const c = data as Company;
      const next = {
        userId,
        companyId: c._id,
        name: c.name ?? '',
        contactEmail: c.contactEmail ?? '',
        phone: c.phone ?? '',
        logoUrl: c.logoUrl ?? '',
      };
      setCompanyData((prev) => ({ ...prev, ...next }));
      setInitialData(next);
    }
  }, [data, userId]);

  const wantsPasswordChange = Boolean(
    companyData.currentPassword || companyData.newPassword || companyData.confirmPassword,
  );

  const isDirty = useMemo(() => {
    const keys: (keyof typeof initialData)[] = ['userId', 'companyId', 'name', 'contactEmail', 'phone', 'logoUrl'];
    const changed = keys.some((k) => (companyData as any)[k] !== (initialData as any)[k]) || wantsPasswordChange;
    return changed;
  }, [companyData, initialData, wantsPasswordChange]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const clearFieldError = (field: keyof CompanyForm) => setErrors((e) => ({ ...e, [field]: undefined }));

  const handleDataUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);
    setErrors({});

    if (!isDirty) {
      return;
    }

    if (wantsPasswordChange) {
      if (!companyData.currentPassword) {
        setErrors((e) => ({ ...e, currentPassword: 'Required.' }));
      }
      if (!companyData.newPassword) {
        setErrors((e) => ({ ...e, newPassword: 'Required.' }));
      }
      if (!companyData.confirmPassword) {
        setErrors((e) => ({ ...e, confirmPassword: 'Required.' }));
      }
      if (
        companyData.newPassword &&
        companyData.confirmPassword &&
        companyData.newPassword !== companyData.confirmPassword
      ) {
        setErrors((e) => ({
          ...e,
          newPassword: 'Passwords do not match.',
          confirmPassword: 'Passwords do not match.',
        }));
      }
      if (companyData.newPassword && companyData.newPassword.length < 6) {
        setErrors((e) => ({ ...e, newPassword: 'Must be at least 6 characters.' }));
      }

      const anyPwdError = !!errors.currentPassword || !!errors.newPassword || !!errors.confirmPassword;

      const computedPwdErrors = {
        currentPassword: (!companyData.currentPassword && 'Required.') || undefined,
        newPassword:
          (!companyData.newPassword && 'Required.') ||
          (companyData.newPassword && companyData.newPassword.length < 6
            ? 'Must be at least 6 characters.'
            : undefined) ||
          (companyData.newPassword &&
          companyData.confirmPassword &&
          companyData.newPassword !== companyData.confirmPassword
            ? 'Passwords do not match.'
            : undefined),
        confirmPassword:
          (!companyData.confirmPassword && 'Required.') ||
          (companyData.newPassword &&
          companyData.confirmPassword &&
          companyData.newPassword !== companyData.confirmPassword
            ? 'Passwords do not match.'
            : undefined),
      };
      if (
        computedPwdErrors.currentPassword ||
        computedPwdErrors.newPassword ||
        computedPwdErrors.confirmPassword ||
        anyPwdError
      ) {
        setErrors((e) => ({ ...e, ...computedPwdErrors }));
        return;
      }
    }

    const { currentPassword, newPassword, confirmPassword, ...rest } = companyData;

    mutate(
      {
        ...rest,
        currentPassword: wantsPasswordChange ? currentPassword : undefined,
        newPassword: wantsPasswordChange ? newPassword : undefined,
      },
      {
        onSuccess: () => {
          const nextInitial = {
            userId: companyData.userId,
            companyId: companyData.companyId,
            name: companyData.name,
            contactEmail: companyData.contactEmail,
            phone: companyData.phone,
            logoUrl: companyData.logoUrl,
          };
          setInitialData(nextInitial);

          setCompanyData((p) => ({
            ...p,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }));

          setBanner({ type: 'success', text: 'Company information updated successfully.' });
        },
        onError: (err: any) => {
          const fieldErrors: Record<string, string> | undefined = err?.response?.data?.errors;
          if (fieldErrors && typeof fieldErrors === 'object') {
            const mapped: FieldErrors = {};
            (Object.keys(fieldErrors) as (keyof CompanyForm)[]).forEach((k) => {
              mapped[k] = fieldErrors[k] as any;
            });
            setErrors(mapped);
          }

          const msg =
            (err?.response?.data?.message as string) || (err?.message as string) || 'Update failed. Please try again.';
          setBanner({ type: 'error', text: msg });
        },
      },
    );
  };

  const errorClass = 'ring-2 ring-red-300 border-red-300';
  const help = (msg?: string) => (msg ? <p className="mt-1 text-sm text-red-600">{msg}</p> : null);

  return (
    <>
      <DashboardHeader />
      <div className="flex min-h-[90vh] items-center justify-center">
        <div className="flex w-full max-w-3xl flex-col justify-end gap-4">
          <div className="flex items-center gap-2">
            <p
              className="cursor-pointer hover:font-semibold hover:underline hover:underline-offset-4"
              onClick={() => navigate('/company/dashboard')}
            >
              Dashboard
            </p>
            <span>→</span>
            <p className="cursor-pointer font-semibold text-indigo-500 underline underline-offset-4 transition-all duration-200">
              Settings
            </p>
          </div>

          <form onSubmit={handleDataUpdate} className="flex flex-col gap-7 rounded border bg-white p-4">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold">Edit company information</h1>

              {banner && (
                <div
                  role="status"
                  className={`rounded-lg p-3 text-sm ring-1 ${
                    banner.type === 'success'
                      ? 'bg-green-50 text-green-700 ring-green-200'
                      : 'bg-red-50 text-red-700 ring-red-200'
                  }`}
                >
                  {banner.text}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
              <section className="flex flex-col">
                <label>Company Email</label>
                <Input
                  value={companyData.contactEmail}
                  onChange={(e) => {
                    setCompanyData((p) => ({ ...p, contactEmail: e.target.value }));
                    clearFieldError('contactEmail');
                    setBanner(null);
                  }}
                  className={errors.contactEmail ? errorClass : ''}
                  aria-invalid={!!errors.contactEmail}
                />
                {help(errors.contactEmail)}
              </section>

              <section className="flex flex-col">
                <label>Company Name</label>
                <Input
                  value={companyData.name}
                  onChange={(e) => {
                    setCompanyData((p) => ({ ...p, name: e.target.value }));
                    clearFieldError('name');
                    setBanner(null);
                  }}
                  className={errors.name ? errorClass : ''}
                  aria-invalid={!!errors.name}
                />
                {help(errors.name)}
              </section>

              <section className="flex flex-col md:col-span-2">
                <label>Phone</label>
                <Input
                  value={companyData.phone}
                  onChange={(e) => {
                    setCompanyData((p) => ({ ...p, phone: e.target.value }));
                    clearFieldError('phone');
                    setBanner(null);
                  }}
                  className={errors.phone ? errorClass : ''}
                  aria-invalid={!!errors.phone}
                />
                {help(errors.phone)}
              </section>

              <section className="flex flex-col md:col-span-2">
                <label>Logo URL</label>
                <Input
                  value={companyData.logoUrl}
                  onChange={(e) => {
                    setCompanyData((p) => ({ ...p, logoUrl: e.target.value }));
                    clearFieldError('logoUrl');
                    setBanner(null);
                  }}
                  className={errors.logoUrl ? errorClass : ''}
                  aria-invalid={!!errors.logoUrl}
                />
                {help(errors.logoUrl)}
              </section>
            </div>

            <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
              <section className="flex flex-col">
                <label>Current password</label>
                <Input
                  type="password"
                  placeholder="Current password"
                  value={companyData.currentPassword}
                  onChange={(e) => {
                    setCompanyData((p) => ({ ...p, currentPassword: e.target.value }));
                    clearFieldError('currentPassword');
                    setBanner(null);
                  }}
                  className={errors.currentPassword ? errorClass : ''}
                  aria-invalid={!!errors.currentPassword}
                />
                {help(errors.currentPassword)}
              </section>

              <section className="flex flex-col">
                <label>New password</label>
                <Input
                  type="password"
                  placeholder="New password"
                  value={companyData.newPassword}
                  onChange={(e) => {
                    setCompanyData((p) => ({ ...p, newPassword: e.target.value }));
                    clearFieldError('newPassword');
                    setBanner(null);
                  }}
                  className={errors.newPassword ? errorClass : ''}
                  aria-invalid={!!errors.newPassword}
                />
                {help(errors.newPassword)}
              </section>

              <section className="flex flex-col">
                <label>Confirm new password</label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={companyData.confirmPassword}
                  onChange={(e) => {
                    setCompanyData((p) => ({ ...p, confirmPassword: e.target.value }));
                    clearFieldError('confirmPassword');
                    setBanner(null);
                  }}
                  className={errors.confirmPassword ? errorClass : ''}
                  aria-invalid={!!errors.confirmPassword}
                />
                {help(errors.confirmPassword)}
              </section>
            </div>

            <Button type="submit" disabled={isPending || !isDirty}>
              {isPending ? 'Saving…' : 'Save'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Settings;
