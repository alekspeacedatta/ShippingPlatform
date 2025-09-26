International cargo Shipping Platform which allows you send parcel requests as a customer or register your own company and get requests from customers
In this project are two roles: CLIENT and COMPANY_ADMIN 


Authentication Pages: 

you can register basic 'CLINET' user or register Company which will automaticly create "COMPANY_ADMIN" user according to your email and password

<img width="330" alt="Screenshot 2025-09-19 154136" src="https://github.com/user-attachments/assets/bab3293c-3295-41cf-b568-159f9e7935ba" />
<img width="330" alt="Screenshot 2025-09-19 154148" src="https://github.com/user-attachments/assets/74cae3b3-ae3f-4c73-bfcb-fe516d10434e" />
<img width="330" alt="Screenshot 2025-09-19 154217" src="https://github.com/user-attachments/assets/34a3588c-2579-4728-a4d8-12635c61ac7a" />


Client Pages

In Client Dashboard you can: Create Request, See All Requests, See Parcel Details. 

<img width="330" alt="Screenshot 2025-09-19 154242" src="https://github.com/user-attachments/assets/b141d00f-e858-4ae1-866b-2a7c83093354" />

client can see all companies and see the best prices

<img width="330" alt="Screenshot 2025-09-19 155819" src="https://github.com/user-attachments/assets/e3b3b4cb-ca7d-4551-90c8-f0f12e270a27" />

other pages...

<img width="330" alt="Screenshot 2025-09-19 155811" src="https://github.com/user-attachments/assets/f25fefb9-7f79-4687-ad27-a0cf32aad50f" />
<img width="330" alt="Screenshot 2025-09-19 155831" src="https://github.com/user-attachments/assets/f43ac812-df86-4d1d-aaf9-14181830d44a" />
<img width="330" alt="Screenshot 2025-09-19 160537" src="https://github.com/user-attachments/assets/f9824bc0-f723-43b0-bda5-8e028a754421" />


Company Pages

<img width="330" alt="Screenshot 2025-09-19 160121" src="https://github.com/user-attachments/assets/ec9ffa71-c3dd-4ea1-a0b7-743bb1a2cce1" />
<img width="330" alt="Screenshot 2025-09-19 160247" src="https://github.com/user-attachments/assets/890e118a-f358-4cce-b285-e2a2391d9e0a" />
<img width="330" alt="Screenshot 2025-09-19 160301" src="https://github.com/user-attachments/assets/f9ce01a1-4c17-4da5-a553-06ce7147c0d7" />
<img width="330" alt="Screenshot 2025-09-19 160110" src="https://github.com/user-attachments/assets/965aedcc-87bf-4bf6-ae19-da725a5c5705" />
<img width="330" alt="Screenshot 2025-09-19 160059" src="https://github.com/user-attachments/assets/1a9e86d5-69c9-47d2-b6a1-010c215920b9" />




TECH STACK
🚀 Tech Stack

Frontend

 • React + Vite + TypeScript

 • Zustand (state management)

 • React Query (API fetching & caching)

 • Styled-Components & WindiCSS (styling)

 • GSAP (animations)

 • React Router v6 (routing, role guards)

Backend

 • Node.js + Express

 • MongoDB + Mongoose

 • JWT Authentication

Other

 • Prettier + ESLint (code quality)

 • GitHub Actions (CI/CD)

 • Deployed on GitHub Pages (client) + Render (server)



GETTING STARTED

now it deployed to github pages and MONGO ATLAS/RENDER

so you can check it  there but if you want to run it on your pc 

  1) download mongoDB
  
  2) open two terminals in project root
  
  3) cd client -> npm i -> npm run dev
  
  4) cd server -> npm i -> npm run dev
  
  5) server/src/config/db.ts
  
  await mongoose.connect(process.env.MONGO_URI!); -> await mongoose.connect(<your mongodb uri>);
  
  6) server/src/server.ts
  
  35line const PORT = Number(process.env.PORT) || 5000; -> const PORT = Number(<your port>);
  
  7) on 37 line   app.listen(PORT, '0.0.0.0', () => {...} ->   app.listen(<YOUR PORT>, '0.0.0.0', () => {...}
  
  8) console.log(`✅ Server listening on :${PORT}`); -> console.log(`✅ Server listening on :${<your port>}`);
  
  9) client/src/types/Types.ts

  on 1 line export const BASE_URL = import.meta.env.VITE_API_URL; -> export const BASE_URL = <your localhost from backend>;


Scripts: dev/build/lint/typecheck/tes

  • npm run dev → start development server
  
  • npm run build → build production bundle
  
  • npm run preview → preview built app
  
  • npm run lint → run ESLint
  
  • npm run typecheck → run TypeScript type checks
  
  • npm run test → run unit tests (planned)

Folder Structure
client/

 ├─ src/
 
 │   ├─ api/            # React Query hooks (useAuth, useCompany, useParcels…)
 
 │   ├─ components/     # Reusable UI components (Button, Input, Stepper…)
 
 │   ├─ pages/          # Auth pages, Client Dashboard, Company Dashboard…
 
 │   ├─ routes/         # React Router setup (role guards)
 
 │   ├─ services/       # Business logic (PricingService, etc.)
 
 │   ├─ store/          # Zustand stores (auth, company…)
 
 │   ├─ types/          # TypeScript types & enums
 
 │   └─ utils/          # Helper functions
 
 └─ vite.config.ts

server/

 ├─ models/             # Mongoose schemas (User, Company, Parcel…)
 
 ├─ routes/             # Express routes (auth, company, parcel, pricing…)
 
 ├─ middleware/         # Auth middleware (JWT verify, role guard)
 
 └─ index.ts            # Server entrypoint


ARCHITECTURE NOTES

  • Services → contain calculation/business logic (e.g., PricingService).
  
  • Query (React Query) → API calls wrapped in custom hooks for caching & error handling.
  
  • Store (Zustand) → Global state persistence (auth token, company info, UI states).
  
PRICING ALGORITHM & ASSUMOTIONS


  • Volumetric weight = (width × height × length) / 5000
  
  • Chargeable weight = max(real weight, volumetric weight)
  
  • Base price = basePrice + (chargeableWeight × pricePerKg)
  
  • Type multiplier = based on shipping type (AIR, SEA, ROAD, RAILWAY)
  
  • Additional multipliers → fuel surcharge, insurance %, remote area %
  
  • All prices shown are estimates — not real carrier prices.

CI/CD & DEPLOYMENT
  
  • Frontend deployed on GitHub Pages:
    ShippingPlatform Client
  
  • Backend deployed on Render:
    https://dashboard.render.com/web/srv-d348253ipnbc73cmof00
  
  • CI/CD: GitHub Actions runs lint + typecheck before deploy.



⚠️ Known Limitations & Future Work
  
  ❌ No real payment integration yet
  
  ❌ No Accept/Reject possibility for company
  
  ❌ No Inline Chat and review from company
  
  ❌ Limited pricing accuracy (demo only)
  
  ❌ Basic error handling & validation
  
  ❌ No parcel tracking with status updates

  Planned:
  
  ✅ Add payment gateway (Stripe/PayPal)
  
  ✅ Improve dashboard analytics
  
  ✅ Add multi-language support (Georgian, English, Russian)
  
  ✅ Add Client profile page, possibility to change user data
  
  ✅ Add Accept/Reject for company
  
  ✅ Inline chat with company while creating user
  
  ✅ Add reviews after company changes parcel request status
  
  ✅ Full test coverage
  

   
