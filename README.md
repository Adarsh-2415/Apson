# APSON INDUSTRIES WEBSITE

Modern, high-performance, responsive B2B platform for **APSON INDUSTRIES** — Roorkee, Uttarakhand, India.

## 🛠️ Technology Stack

- **Frontend Core**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router (`react-router-dom`)
- **Animation**: Framer Motion
- **UI Components**: shadcn/ui primitives + Lucide React icons
- **Backend Platform**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage)
- **Form Management & Validation**: React Hook Form + Zod
- **Build & Quality**: Vite, TypeScript, ESLint

---

## 📁 Project Architecture

```text
apson/
├── public/                 # Static public assets
├── src/
│   ├── assets/             # Images & static graphics
│   ├── components/         # Reusable UI & layout shell components
│   │   ├── common/         # Generic application components
│   │   ├── layout/         # Header, Footer, Admin layouts
│   │   └── ui/             # Primitives & shadcn/ui components
│   ├── config/             # Environment & site constants
│   ├── context/            # Global state context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Library clients (Supabase, helper utils)
│   ├── pages/              # View layer
│   │   ├── public/         # Home, About, Products, Contact
│   │   └── admin/          # CMS Dashboard & management tools
│   ├── routes/             # Client-side router & route guards
│   ├── services/           # Data services & Supabase integration
│   ├── types/              # Strongly-typed TypeScript interfaces
│   └── utils/              # Helper functions (cn class merger, formatters)
├── .env.example            # Environment variables template
├── index.html              # Entry HTML
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # Root TypeScript configuration
├── tsconfig.app.json       # App TypeScript configuration with `@/*` path alias
├── vite.config.ts          # Vite build & plugin configuration
└── README.md               # Project documentation
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone repository & install dependencies:
   ```bash
   npm install
   ```

2. Set up Environment Variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`.

3. Start Development Server:
   ```bash
   npm run dev
   ```

4. Build for Production:
   ```bash
   npm run build
   ```

5. Type-Check:
   ```bash
   npm run typecheck
   ```
