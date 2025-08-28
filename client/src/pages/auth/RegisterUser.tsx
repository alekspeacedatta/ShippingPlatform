import { useState } from "react";
import { Button } from "../../components/commons/Button";
import { Input } from "../../components/commons/Input";
import { Link } from "react-router-dom";
import type { User } from "../../types/Types";
import { useRegister } from "../../api/useAuth";

export default function RegisterUser() {
  const [ registeredInfo, setRegisteredInfo ] = useState<User>({
    fullName: '',
    password: '',
    email: '',
    phone: '',
    addresses: [{ country: "", city: "", line1: "", postalCode: "" }],
    role: 'USER'
  })
  const { mutate, isError, error } = useRegister()
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(registeredInfo);
  }
  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="w-[760px] flex items-center justify-center px-6">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl ring-1 ring-black/5 p-10">
          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            <h1 className="text-2xl font-semibold">Register</h1>
            { isError ? ( <p>registered failed {error.message}</p> ) : ( <p></p> ) }
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="flex flex-col gap-2">
                <span>Full name</span>
                <Input type="text" placeholder="Aleksandre Kobulashvili" onChange={(e) =>
                setRegisteredInfo({ ...registeredInfo, fullName: e.target.value })
              } required />
              </section>

              <section className="flex flex-col gap-2">
                <span>Email</span>
                <Input type="email" placeholder="luka@example.com" onChange={(e) =>
                setRegisteredInfo({ ...registeredInfo, email: e.target.value })
              } required />
              </section>

              <section className="flex flex-col gap-2">
                <span>Password</span>
                <Input type="password" placeholder="••••••••" onChange={(e) =>
                setRegisteredInfo({ ...registeredInfo, password: e.target.value })
              } required/>
              </section>

              <section className="flex flex-col gap-2">
                <span>Phone</span>
                <Input type="tel"  onChange={(e) =>
                setRegisteredInfo({ ...registeredInfo, phone: e.target.value })
              } placeholder="+(ur country) xxx xx xx xx" />
              </section>
            </section>

            <h2 className="text-lg font-medium mt-2">Address</h2>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="flex flex-col gap-2">
                <span>Country</span>
                <Input type="text" value={registeredInfo.addresses[0].country}
                  onChange={(e) =>
                    setRegisteredInfo({
                      ...registeredInfo,
                      addresses: [{ ...registeredInfo.addresses[0], country: e.target.value }],
                    })
                  } placeholder="Georgia" />
              </section>

              <section className="flex flex-col gap-2" >
                <span>City</span>
                <Input type="text" value={registeredInfo.addresses[0].city}
                  onChange={(e) =>
                    setRegisteredInfo({
                      ...registeredInfo,
                      addresses: [{ ...registeredInfo.addresses[0], city: e.target.value }],
                    })
                  } placeholder="Tbilisi" />
              </section>

              <section className="flex flex-col gap-2">
                <span>Line 1</span>
                <Input type="text" value={registeredInfo.addresses[0].line1}
                  onChange={(e) =>
                    setRegisteredInfo({
                      ...registeredInfo,
                      addresses: [{ ...registeredInfo.addresses[0], line1: e.target.value }],
                    })
                  } placeholder="Street, building, apt" />
              </section>

              <section className="flex flex-col gap-2">
                <span>Postal code</span>
                <Input type="text" value={registeredInfo.addresses[0].postalCode}
                  onChange={(e) =>
                    setRegisteredInfo({
                      ...registeredInfo,
                      addresses: [{ ...registeredInfo.addresses[0], postalCode: e.target.value }],
                    })
                  } placeholder="0105" />
              </section>
            </section>

            <div className="mt-2 flex items-center gap-4">
              <Button type="submit" className="w-[30%]">Register</Button>
              <div className="text-sm">
                <span>
                  Already have an account?{" "}
                  <Link to="/login" className="text-indigo-600 underline">Login</Link>
                </span>
                <span className="ml-3">
                  Are you a company?{" "}
                  <Link to="/register/company" className="text-indigo-600 underline">
                    Register company
                  </Link>
                </span>
              </div>
            </div>
          </form>
        </div>
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
