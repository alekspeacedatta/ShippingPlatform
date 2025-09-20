import { useState, useRef } from 'react';
import { Button } from '../../components/commons/Button';
import { Input } from '../../components/commons/Input';
import { Link } from 'react-router-dom';
import type { User } from '../../types/Types';
import { useRegister } from '../../api/useAuth';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const RegisterUser = () => {
  const formRef = useRef<HTMLDivElement | null>(null);

  gsap.registerPlugin(useGSAP);
  useGSAP(
    () => {
      if (!formRef.current) return;
      gsap.from(formRef.current, { opacity: 0, y: 8, duration: 0.25, ease: 'power2.out' });
    },
    { scope: formRef },
  );

  const [registeredInfo, setRegisteredInfo] = useState<User>({
    _id: '',
    fullName: '',
    password: '',
    email: '',
    phone: '',
    addresses: [{ country: '', city: '', line1: '', postalCode: '' }],
    role: 'USER',
  });

  const { mutate, isError, error } = useRegister();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(registeredInfo);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50">
      <div className="flex items-center justify-center px-4 py-8 sm:px-6 md:px-8">
        <div
          ref={formRef}
          className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl rounded-3xl bg-white p-6 sm:p-7 shadow-2xl ring-1 ring-black/5"
        >
          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            <h2 className="text-2xl sm:text-3xl font-semibold">Register</h2>

            {isError && (
              <p role="alert" aria-live="assertive" className="text-sm sm:text-base text-red-700">
                {error.message}
              </p>
            )}

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Full name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="name and lastname"
                  onChange={(e) =>
                    setRegisteredInfo((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="someemail@example.com"
                  onChange={(e) =>
                    setRegisteredInfo((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) =>
                    setRegisteredInfo((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </label>
                <Input
                  id="phone"
                  type="tel"
                  onChange={(e) =>
                    setRegisteredInfo((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="+(country) xxx xx xx xx"
                />
              </div>
            </section>

            <h2 className="mt-2 text-lg sm:text-xl font-medium">Address</h2>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="country" className="text-sm font-medium">
                  Country
                </label>
                <Input
                  id="country"
                  type="text"
                  value={registeredInfo.addresses[0].country}
                  onChange={(e) =>
                    setRegisteredInfo((prev) => ({
                      ...prev,
                      addresses: [{ ...prev.addresses[0], country: e.target.value }],
                    }))
                  }
                  placeholder="Georgia"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <Input
                  id="city"
                  type="text"
                  value={registeredInfo.addresses[0].city}
                  onChange={(e) =>
                    setRegisteredInfo((prev) => ({
                      ...prev,
                      addresses: [{ ...prev.addresses[0], city: e.target.value }],
                    }))
                  }
                  placeholder="Tbilisi"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="line1" className="text-sm font-medium">
                  Line 1
                </label>
                <Input
                  id="line1"
                  type="text"
                  value={registeredInfo.addresses[0].line1}
                  onChange={(e) =>
                    setRegisteredInfo((prev) => ({
                      ...prev,
                      addresses: [{ ...prev.addresses[0], line1: e.target.value }],
                    }))
                  }
                  placeholder="Street, building, apt"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="postalCode" className="text-sm font-medium">
                  Postal code
                </label>
                <Input
                  id="postalCode"
                  type="text"
                  value={registeredInfo.addresses[0].postalCode}
                  onChange={(e) =>
                    setRegisteredInfo((prev) => ({
                      ...prev,
                      addresses: [{ ...prev.addresses[0], postalCode: e.target.value }],
                    }))
                  }
                  placeholder="0105"
                />
              </div>
            </section>

            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Button type="submit" className="w-full sm:w-[30%]">
                Register
              </Button>

              <div className="text-sm text-center sm:text-left">
                <span>
                  Already have an account?{' '}
                  <Link to="/login" className="text-indigo-600 underline">
                    Login
                  </Link>
                </span>
                <span className="block sm:inline sm:ml-3">
                  Are you a company?{' '}
                  <Link to="/register/company" className="text-indigo-600 underline">
                    Register company
                  </Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>

      <aside className="hidden md:flex items-center justify-start bg-blue-600 text-white">
        <div className="mx-8 md:mx-10 lg:mx-16 flex flex-col items-start gap-5 md:gap-7">
          <h1 className="text-4xl lg:text-6xl leading-tight">International</h1>
          <h1 className="text-4xl lg:text-6xl leading-tight">Cargo</h1>
          <h1 className="text-4xl lg:text-6xl leading-tight">Shipping</h1>
          <h1 className="text-4xl lg:text-6xl leading-tight">Platform</h1>
        </div>
      </aside>
    </div>
  );
};

export default RegisterUser;
