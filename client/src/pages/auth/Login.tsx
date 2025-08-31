import { Button } from "../../components/commons/Button";
import { Card } from "../../components/commons/Card";
import { Input } from "../../components/commons/Input";
import { Link } from "react-router-dom";
import { useLogin } from "../../api/useAuth";
import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from 'gsap';

export default function Login() {
  const formRef = useRef(null);
  gsap.registerPlugin(useGSAP);
  useGSAP(() => {
    gsap.from(formRef.current, { opacity: 0, scale: 0.95, duration: 0.2})
    
  })
  const [ loginInfo, setLoginInfo] = useState<{email: string, password: string}>({
    email: '',
    password: ''
  });
  const { mutate, isError, error } = useLogin();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(loginInfo);
  }
  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="basis-full md:basis-[760px] shrink-0 flex items-center justify-center px-6">
        <Card className="form" ref={formRef}>
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <h1 className="text-2xl font-semibold">Login</h1>
            { isError && ( <p className="text-red-800">{error.message}</p> )}
            <section className="flex flex-col gap-2">
              <span>Email</span>
              <Input type="email" placeholder="luka@example.com" onChange={e => setLoginInfo({...loginInfo, email: e.target.value })} required />
            </section>

            <section className="flex flex-col gap-2">
              <span>Password</span>
              <Input type="password" placeholder="••••••••" onChange={e => setLoginInfo({...loginInfo, password: e.target.value })} required />
            </section>

            <section className="mt-2 flex items-center gap-4">
              <Button type="submit" className="w-[30%]">Login</Button>
              <p className="text-sm">
                Don’t have an account?{" "}
                <Link to="/register/user" className="text-indigo-600 underline">Register</Link>
              </p>
            </section>
          </form>
        </Card>
      </div>

      <aside className="hidden md:flex flex-1 items-center justify-start bg-blue-600 text-white">
        <div className="flex flex-col items-start ml-[30px] gap-7">
          <h1 className="text-5xl leading-tight">International</h1>
          <h1 className="text-5xl leading-tight">Cargo</h1>
          <h1 className="text-5xl leading-tight">Shipping</h1>
          <h1 className="text-5xl leading-tight">Platform</h1>
        </div>
      </aside>
    </div>
  );
}