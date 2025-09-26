import { useEffect, useMemo, useState } from 'react';
import { useCompanyDataUpdate, useGetCompany } from '../../api/useCompany';
import { Input } from '../../components/commons/Input';
import { useCompanyStore } from '../../store/useCompanyStore';
import type { Company, ShippingType } from '../../types/Types';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/commons/Button';
import { useAuthStore } from '../../store/useAuthStore';
import DashboardHeader from '../../components/company/DashboardHeader';

type CompanyForm = {
  userId: string;
  companyId: string;
  name: string;
  contactEmail: string;
  phone: string;
  logoUrl: string;
  supportedTypes: ShippingType[];
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

type Banner = { type: 'success' | 'error'; text: string } | null;
type FieldErrors = Partial<Record<keyof CompanyForm, string>>;

const ALL_TYPES: ShippingType[] = ['AIR', 'SEA', 'ROAD', 'RAILWAY'];

const Settings = () => {
  const navigate = useNavigate();
  const companyId = useCompanyStore((s) => s.companyInfo?.companyId);
  const userId = useAuthStore((s) => s.authInfo?.userId) ?? '';
  const { data, isLoading, isError, error } = useGetCompany(companyId ?? '');

  const { mutate, isPending } = useCompanyDataUpdate?.() ?? { mutate: () => {}, isPending: false };

  const [banner, setBanner] = useState<Banner>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const [companyData, setCompanyData] = useState<CompanyForm>({
    userId: '',
    companyId: '',
    name: '',
    contactEmail: '',
    phone: '',
    logoUrl: '',
    supportedTypes: [],
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [initialData, setInitialData] = useState<
    Pick<CompanyForm, 'userId' | 'companyId' | 'name' | 'contactEmail' | 'phone' | 'logoUrl' | 'supportedTypes'>
  >({
    userId: '',
    companyId: '',
    name: '',
    contactEmail: '',
    phone: '',
    logoUrl: '',
    supportedTypes: [],
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
        supportedTypes: Array.isArray((c as any).supportedTypes) ? ((c as any).supportedTypes as ShippingType[]) : [],
      };
      setCompanyData((prev) => ({ ...prev, ...next }));
      setInitialData(next);
    }
  }, [data, userId]);

  const wantsPasswordChange = Boolean(
    companyData.currentPassword || companyData.newPassword || companyData.confirmPassword,
  );

  const isDirty = useMemo(() => {
    const keys: (keyof typeof initialData)[] = [
      'userId',
      'companyId',
      'name',
      'contactEmail',
      'phone',
      'logoUrl',
      'supportedTypes',
    ];
    return (
      keys.some((k) =>
        Array.isArray(initialData[k])
          ? JSON.stringify(companyData[k]) !== JSON.stringify(initialData[k])
          : companyData[k] !== initialData[k],
      ) || wantsPasswordChange
    );
  }, [companyData, initialData, wantsPasswordChange]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const clearFieldError = (field: keyof CompanyForm) => setErrors((e) => ({ ...e, [field]: undefined }));

  const prettyMultiplier = (type: ShippingType, pricing: Company['pricing']) => {
    const m = pricing?.typeMultipliers?.[type] ?? 1;
    return `${m}x`;
  };

  const toggleType = (t: ShippingType) =>
    setCompanyData((p) => {
      const has = p.supportedTypes?.includes(t);
      const next = has ? p.supportedTypes.filter((x) => x !== t) : [...(p.supportedTypes ?? []), t];
      return { ...p, supportedTypes: next };
    });
  const handleDataUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);
    setErrors({});

    if (!isDirty) return;

    if (!companyData.supportedTypes || companyData.supportedTypes.length === 0) {
      setErrors((e) => ({ ...e, supportedTypes: 'Select at least one shipping type.' }));
      return;
    }

    if (wantsPasswordChange) {
      const computedPwdErrors: FieldErrors = {
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

      if (computedPwdErrors.currentPassword || computedPwdErrors.newPassword || computedPwdErrors.confirmPassword) {
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
            supportedTypes: [...companyData.supportedTypes],
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
        onError: (err) => {
          // @ts-expect-error
          const fieldErrors: Record<string, string> | undefined = err?.response?.data?.errors;
          if (fieldErrors && typeof fieldErrors === 'object') {
            const mapped: FieldErrors = {};
            (Object.keys(fieldErrors) as (keyof CompanyForm)[]).forEach((k) => {
              mapped[k] = fieldErrors[k];
            });
            setErrors(mapped);
          }

          const msg =
            // @ts-expect-error
            (err?.response?.data?.message as string) || (err?.message as string) || 'Update failed. Please try again.';
          setBanner({ type: 'error', text: msg });
        },
      },
    );
  };

  const errorClass = 'ring-2 ring-red-300 border-red-300';
  const help = (msg?: string) => (msg ? <p className="mt-1 text-xs sm:text-sm text-red-600">{msg}</p> : null);

  return (
    <>
      <DashboardHeader />

      <main className="min-h-[90vh]">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-10 flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button
              onClick={() => navigate('/company/dashboard')}
              className="hover:font-semibold hover:underline underline-offset-4"
            >
              Dashboard
            </button>
            <span className="text-gray-400">→</span>
            <span className="font-semibold text-indigo-500 underline underline-offset-4">Settings</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl font-bold">Edit company information</h1>

            {banner && (
              <div
                role="status"
                aria-live="polite"
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

          <form onSubmit={handleDataUpdate} className="flex flex-col gap-6 rounded border bg-white p-4 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <section className="flex flex-col min-w-0">
                <label className="text-sm font-medium">Company Email</label>
                <Input
                  value={companyData.contactEmail}
                  onChange={(e) => {
                    setCompanyData((p) => ({ ...p, contactEmail: e.target.value }));
                    clearFieldError('contactEmail');
                    setBanner(null);
                  }}
                  className={`w-full ${errors.contactEmail ? errorClass : ''}`}
                  aria-invalid={!!errors.contactEmail}
                />
                {help(errors.contactEmail)}
              </section>

              <section className="flex flex-col min-w-0">
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  value={companyData.name}
                  onChange={(e) => {
                    setCompanyData((p) => ({ ...p, name: e.target.value }));
                    clearFieldError('name');
                    setBanner(null);
                  }}
                  className={`w-full ${errors.name ? errorClass : ''}`}
                  aria-invalid={!!errors.name}
                />
                {help(errors.name)}
              </section>

              <section className="flex flex-col md:col-span-2 min-w-0">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={companyData.phone}
                  onChange={(e) => {
                    setCompanyData((p) => ({ ...p, phone: e.target.value }));
                    clearFieldError('phone');
                    setBanner(null);
                  }}
                  className={`w-full ${errors.phone ? errorClass : ''}`}
                  aria-invalid={!!errors.phone}
                />
                {help(errors.phone)}
              </section>

              <section className="flex flex-col md:col-span-2 min-w-0">
                <label className="text-sm font-medium">Logo URL</label>
                <Input
                  value={companyData.logoUrl}
                  onChange={(e) => {
                    setCompanyData((p) => ({ ...p, logoUrl: e.target.value }));
                    clearFieldError('logoUrl');
                    setBanner(null);
                  }}
                  className={`w-full ${errors.logoUrl ? errorClass : ''}`}
                  aria-invalid={!!errors.logoUrl}
                />
                {help(errors.logoUrl)}
              </section>
            </div>

            <section className="mt-2">
              <label className="mb-2 block text-sm font-medium">Supported shipping types</label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ALL_TYPES.map((t) => {
                  const active = companyData.supportedTypes?.includes(t);
                  return (
                    <button
                      type="button"
                      key={t}
                      
                      onClick={() => {
                        toggleType(t);
                        clearFieldError('supportedTypes' as any);
                        setBanner(null);
                      }}
                      className={[
                        'group flex items-center justify-between rounded-xl border-2 border-[#d0d4ff] px-4 py-3 text-left',
                        'transition-all duration-150 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                        active ? 'border-indigo-[#7c86ff] bg-indigo-50' : 'border-gray-200/80 bg-white hover:bg-gray-50',
                      ].join(' ')}
                      aria-pressed={active}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={[
                            'grid h-5 w-5 place-items-center rounded-full border transition-colors',
                            active ? 'border-indigo-600 bg-indigo-600/10' : 'border-gray-300 bg-white',
                          ].join(' ')}
                          aria-hidden="true"
                        >
                          <span
                            className={[
                              'h-2.5 w-2.5 rounded-full transition-opacity',
                              active ? 'bg-indigo-600 opacity-100' : 'opacity-0',
                            ].join(' ')}
                          />
                        </span>

                        <span className="text-sm font-semibold">{t}</span>
                      </div>

                      <span className="text-xs text-gray-600">
                        type multiplier:{' '}
                        <span className={active ? 'font-semibold text-indigo-700' : 'font-medium'}>
                          {prettyMultiplier(t, (data as Company)?.pricing ?? ({} as Company['pricing']))}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {'supportedTypes' in errors && (
                <p className="mt-1 text-xs text-red-600">{(errors as any).supportedTypes}</p>
              )}
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <section className="flex flex-col min-w-0">
                <label className="text-sm font-medium">Current password</label>
                <Input
                  type="password"
                  placeholder="Current password"
                  value={companyData.currentPassword}
                  onChange={(e) => {
                    setCompanyData((p) => ({ ...p, currentPassword: e.target.value }));
                    clearFieldError('currentPassword');
                    setBanner(null);
                  }}
                  className={`w-full ${errors.currentPassword ? errorClass : ''}`}
                  aria-invalid={!!errors.currentPassword}
                />
                {help(errors.currentPassword)}
              </section>

              <section className="flex flex-col min-w-0">
                <label className="text-sm font-medium">New password</label>
                <Input
                  type="password"
                  placeholder="New password"
                  value={companyData.newPassword}
                  onChange={(e) => {
                    setCompanyData((p) => ({ ...p, newPassword: e.target.value }));
                    clearFieldError('newPassword');
                    setBanner(null);
                  }}
                  className={`w-full ${errors.newPassword ? errorClass : ''}`}
                  aria-invalid={!!errors.newPassword}
                />
                {help(errors.newPassword)}
              </section>

              <section className="flex flex-col min-w-0">
                <label className="text-sm font-medium">Confirm new password</label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={companyData.confirmPassword}
                  onChange={(e) => {
                    setCompanyData((p) => ({ ...p, confirmPassword: e.target.value }));
                    clearFieldError('confirmPassword');
                    setBanner(null);
                  }}
                  className={`w-full ${errors.confirmPassword ? errorClass : ''}`}
                  aria-invalid={!!errors.confirmPassword}
                />
                {help(errors.confirmPassword)}
              </section>
            </div>

            <Button type="submit" disabled={isPending || !isDirty} className="w-full sm:w-auto">
              {isPending ? 'Saving…' : 'Save'}
            </Button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Settings;
