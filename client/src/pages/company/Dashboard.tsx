import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/company/DashboardHeader';
import { useState } from 'react';
import { useCompanyStore } from '../../store/useCompanyStore';
import { useGetMessages, useSetMessage } from '../../api/useChat';
import { MessageCircle, X } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const go = (route: string) => navigate(route);

  const companyId = useCompanyStore(state => state.companyInfo?.companyId);

  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [sentMessages, setSentMessages] = useState<{ sentMessage: string, date: Date }[]>([]);
  const { mutate: chatMutate } = useSetMessage();
  const { data: recievedMessages = [] } = useGetMessages(companyId!)


  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    setSentMessages((prev) => [...prev, { sentMessage: trimmed, date: new Date() } ]);
    chatMutate({ companyId: companyId!, message: trimmed, date: new Date() });

    setMessage('');
  };
  return (
    <>
      <DashboardHeader />

      <main className="min-h-screen bg-[radial-gradient(80%_60%_at_50%_0%,#eef2ff_0%,#ffffff_40%,#ffffff_100%)] dark:bg-[radial-gradient(80%_60%_at_50%_0%,#0b1220_0%,#0a0f1a_40%,#0a0f1a_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div
              onClick={() => go('/company/requests')}
              role="button"
              tabIndex={0}
              className="group relative h-44 cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white/90 backdrop-blur shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900/70 md:col-span-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/40"
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && go('/company/requests')}
              aria-label="Requests"
            >
              <div className="flex items-start gap-4 p-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl ring-1 ring-indigo-500/20 bg-gradient-to-br from-indigo-500/15">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-600 dark:text-indigo-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5h6M9 3h6a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1V5a2 2 0 0 1 2-2z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h8M8 15h5" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight">Requests</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    Create, review, and manage all company parcel requests.
                  </p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:via-white/10" />
            </div>
            <div
              onClick={() => go('/company/settings')}
              role="button"
              tabIndex={0}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white/90 backdrop-blur shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900/70 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/40"
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && go('/company/settings')}
              aria-label="Settings"
            >
              <div className="flex items-start gap-4 p-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl ring-1 ring-emerald-500/20 bg-gradient-to-br from-emerald-500/15">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-emerald-600 dark:text-emerald-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317a1 1 0 0 1 1.35-.436l.862.431a1 1 0 0 0 .926 0l.862-.431a1 1 0 0 1 1.35.436l.5.866a1 1 0 0 0 .756.5l.964.14a1 1 0 0 1 .85 1.094l-.093.977a1 1 0 0 0 .287.794l.697.697a1 1 0 0 1 0 1.414l-.697.697a1 1 0 0 0-.287.794l.093.977a1 1 0 0 1-.85 1.094l-.964.14a1 1 0 0 0-.756.5l-.5.866a1 1 0 0 1-1.35.436l-.862-.431a1 1 0 0 0-.926 0l-.862.431a1 1 0 0 1-1.35-.436l-.5-.866a1 1 0 0 0-.756-.5l-.964-.14a1 1 0 0 1-.85-1.094l.093-.977a1 1 0 0 0-.287-.794L4.22 12.99a1 1 0 0 1 0-1.414l.697-.697a1 1 0 0 0 .287-.794l-.093-.977a1 1 0 0 1 .85-1.094l.964-.14a1 1 0 0 0 .756-.5l.5-.866z"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight">Settings</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    Company profile, users, and preferences.
                  </p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:via-white/10" />
            </div>
            <div
              onClick={() => go('/company/pricing')}
              role="button"
              tabIndex={0}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white/90 backdrop-blur shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900/70 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/40"
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && go('/company/pricing')}
              aria-label="Pricing"
            >
              <div className="flex items-start gap-4 p-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl ring-1 ring-amber-500/25 bg-gradient-to-br from-amber-500/15">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-amber-600 dark:text-amber-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.59 13.41 12 22l-8.59-8.59A2 2 0 0 1 3 11V5a2 2 0 0 1 2-2h6a2 2 0 0 1 1.41.59l8.18 8.18a2 2 0 0 1 0 2.82z"
                    />
                    <circle cx="7.5" cy="7.5" r="1.5" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight">Pricing</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    Base rates & transportation multipliers.
                  </p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:via-white/10" />
            </div>
          </section>
        </div>
      </main>
      <div className="fixed bottom-5 right-5 z-50">
        <div
          className={`
            absolute bottom-14 right-14 w-[22rem] max-w-[90vw] h-[60vh] max-h-[70vh]
            overflow-hidden rounded-2xl border bg-white shadow-xl ring-1 ring-black/5
            transition-all duration-200
            ${
              chatOpen
                ? 'pointer-events-auto opacity-100 translate-y-0 scale-100'
                : 'pointer-events-none opacity-0 translate-y-1 scale-95'
            }
            flex flex-col       
          `}
        >
          <div className="flex items-center justify-between rounded-t-2xl bg-gray-100 px-3 py-2">
            <span className="text-sm font-semibold">New Chat With Support</span>
            <button
              onClick={() => setChatOpen(false)}
              className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              aria-label="Close chat"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div id="chat-scroll" className="flex-1 min-h-0 overflow-y-auto px-3 py-2">
            <div className="flex flex-col items-end justify-end gap-2">
              {recievedMessages.length ? (
                recievedMessages.map((m: any, i: number) => (
                  <div key={m._id ?? i} className="flex w-3/4 items-center justify-between gap-2 rounded-xl bg-gray-200 p-2">
                    <p className="whitespace-pre-wrap break-words">{m.sentMessage ?? m.message}</p>
                    <p className="text-xs font-semibold text-gray-500">
                      {new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-lg font-semibold">There are no received messages</p>
              )}
              
              {sentMessages.map((m, i) => (
                <div key={i} className="flex w-3/4 items-center justify-between gap-2 rounded-xl bg-indigo-50 p-2">
                  <p className="whitespace-pre-wrap break-words">{m.sentMessage}</p>
                  <p className="text-xs font-semibold text-gray-500">
                    {m.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <form className="p-2 border-t" onSubmit={handleChatSubmit}>
            
              <div className="flex items-center justify-between gap-2 rounded-xl border p-2">
                
                <input
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  placeholder="New message"
                  className="flex-1 p-1 outline-none"
                />
                <button
                  disabled={!message.trim()}
                  className="rounded-full bg-indigo-500 px-4 py-2 text-white transition disabled:bg-indigo-200"
                  type="submit"
                >
                  ↑
                </button>
              </div>
            
          </form>
        </div>

        <button
          onClick={() => setChatOpen((p) => !p)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition hover:shadow-xl transform transition-all duration-200 active:scale-90"
          title="Support chat"
          aria-pressed={chatOpen}
          aria-label="Toggle support chat"
        >
          <MessageCircle size={26} />
        </button>
      </div>
    </>
  );
};

export default Dashboard;
