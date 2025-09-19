import { Button } from '../../components/commons/Button';
import { Card } from '../../components/commons/Card';
import { Input } from '../../components/commons/Input';
import { Link } from 'react-router-dom';
import { useLogin } from '../../api/useAuth';
import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function Login() {
  const formRef = useRef<HTMLDivElement | null>(null);

  gsap.registerPlugin(useGSAP);
  useGSAP(
    () => {
      if (!formRef.current) return;
      gsap.from(formRef.current, { opacity: 0, y: 8, duration: 0.25, ease: 'power2.out' });
    },
    { scope: formRef },
  );

  const [loginInfo, setLoginInfo] = useState<{ email: string; password: string }>({ email: '', password: '' });
  const { mutate, isError, error } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(loginInfo);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50">
      <div className="flex items-center justify-center px-4 py-8 sm:px-6 md:px-8">
        <Card ref={formRef} className="w-full max-w-sm sm:max-w-md md:max-w-lg">
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <h1 className="text-2xl sm:text-3xl font-semibold">Login</h1>

            {isError && (
              <p role="alert" aria-live="assertive" className="text-sm sm:text-base text-red-700">
                {error.message}
              </p>
            )}

            <section className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="luka@example.com"
                onChange={(e) => setLoginInfo({ ...loginInfo, email: e.target.value })}
                required
              />
            </section>

            <section className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })}
                required
              />
            </section>

            <section className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Button type="submit" className="w-full sm:w-1/3">
                Login
              </Button>
              <p className="text-sm text-center sm:text-left">
                Don’t have an account?{' '}
                <Link to="/register/user" className="text-indigo-600 underline">
                  Register
                </Link>
              </p>
            </section>
          </form>
        </Card>
      </div>

      <aside className="hidden md:flex items-center justify-start bg-blue-600 text-white">
        <div className="mx-8 md:mx-10 lg:mx-16 flex flex-col gap-3 md:gap-4">
          <h1 className="text-4xl lg:text-6xl leading-tight">International</h1>
          <h1 className="text-4xl lg:text-6xl leading-tight">Cargo</h1>
          <h1 className="text-4xl lg:text-6xl leading-tight">Shipping</h1>
          <h1 className="text-4xl lg:text-6xl leading-tight">Platform</h1>
        </div>
      </aside>
    </div>
  );
}
