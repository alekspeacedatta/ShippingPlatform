import { useState, useRef } from 'react';
import { Button } from '../../components/commons/Button';
import { Input } from '../../components/commons/Input';
import { Link } from 'react-router-dom';
import type { User } from '../../types/Types';
import { useRegister } from '../../api/useAuth';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
export default function RegisterUser() {
  const formRef = useRef(null);
  gsap.registerPlugin(useGSAP);
  useGSAP(() => {
    gsap.from(formRef.current, { opacity: 0, scale: 0.95, duration: 0.2 });
  });
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
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex w-[760px] items-center justify-center px-6">
        <div
          ref={formRef}
          className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl ring-1 ring-black/5"
        >
          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            <h2 className="text-2xl font-semibold">Register</h2>
            {isError && <p className="text-red-800">{error.message}</p>}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <section className="flex flex-col gap-2">
                <span>Full name</span>
                <Input
                  type="text"
                  placeholder="name and lastname"
                  onChange={(e) =>
                    setRegisteredInfo({ ...registeredInfo, fullName: e.target.value })
                  }
                  required
                />
              </section>

              <section className="flex flex-col gap-2">
                <span>Email</span>
                <Input
                  type="email"
                  placeholder="someemail@example.com"
                  onChange={(e) => setRegisteredInfo({ ...registeredInfo, email: e.target.value })}
                  required
                />
              </section>

              <section className="flex flex-col gap-2">
                <span>Password</span>
                <Input
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) =>
                    setRegisteredInfo({ ...registeredInfo, password: e.target.value })
                  }
                  required
                />
              </section>

              <section className="flex flex-col gap-2">
                <span>Phone</span>
                <Input
                  type="tel"
                  onChange={(e) => setRegisteredInfo({ ...registeredInfo, phone: e.target.value })}
                  placeholder="+(ur country) xxx xx xx xx"
                />
              </section>
            </section>

            <h2 className="mt-2 text-lg font-medium">Address</h2>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <section className="flex flex-col gap-2">
                <span>Country</span>
                <Input
                  type="text"
                  value={registeredInfo.addresses[0].country}
                  onChange={(e) =>
                    setRegisteredInfo({
                      ...registeredInfo,
                      addresses: [{ ...registeredInfo.addresses[0], country: e.target.value }],
                    })
                  }
                  placeholder="Georgia"
                />
              </section>

              <section className="flex flex-col gap-2">
                <span>City</span>
                <Input
                  type="text"
                  value={registeredInfo.addresses[0].city}
                  onChange={(e) =>
                    setRegisteredInfo({
                      ...registeredInfo,
                      addresses: [{ ...registeredInfo.addresses[0], city: e.target.value }],
                    })
                  }
                  placeholder="Tbilisi"
                />
              </section>

              <section className="flex flex-col gap-2">
                <span>Line 1</span>
                <Input
                  type="text"
                  value={registeredInfo.addresses[0].line1}
                  onChange={(e) =>
                    setRegisteredInfo({
                      ...registeredInfo,
                      addresses: [{ ...registeredInfo.addresses[0], line1: e.target.value }],
                    })
                  }
                  placeholder="Street, building, apt"
                />
              </section>

              <section className="flex flex-col gap-2">
                <span>Postal code</span>
                <Input
                  type="text"
                  value={registeredInfo.addresses[0].postalCode}
                  onChange={(e) =>
                    setRegisteredInfo({
                      ...registeredInfo,
                      addresses: [{ ...registeredInfo.addresses[0], postalCode: e.target.value }],
                    })
                  }
                  placeholder="0105"
                />
              </section>
            </section>

            <div className="mt-2 flex items-center gap-4">
              <Button type="submit" className="w-[30%]">
                Register
              </Button>
              <div className="text-sm">
                <span>
                  Already have an account?{' '}
                  <Link to="/login" className="text-indigo-600 underline">
                    Login
                  </Link>
                </span>
                <span className="ml-3">
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

      <aside className="hidden flex-1 items-center justify-start bg-blue-600 text-white md:flex">
        <div className="ml-[30px] flex flex-col items-start gap-7">
          <h1 className="text-5xl leading-tight">International</h1>
          <h1 className="text-5xl leading-tight">Cargo</h1>
          <h1 className="text-5xl leading-tight">Shipping</h1>
          <h1 className="text-5xl leading-tight">Platform</h1>
        </div>
      </aside>
    </div>
  );
}
