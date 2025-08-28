import { Button } from "../../components/commons/Button";
import { Card } from "../../components/commons/Card";
import { Input } from "../../components/commons/Input";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="basis-full md:basis-[560px] shrink-0 flex items-center justify-center px-6">
        <Card>
          <form className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Login</h1>
            <section className="flex flex-col gap-2">
              <span>Email</span>
              <Input type="email" placeholder="luka@example.com"  required />
            </section>

            <section className="flex flex-col gap-2">
              <span>Password</span>
              <Input type="password" placeholder="••••••••" required />
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