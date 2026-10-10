# Vidya Pragathi — Frontend Web Application

Bilingual (English & Kannada), mobile-first responsive civic & career portal for Karnataka South-East Graduates' Constituency.

## Features
- **Job & Internship Portal:** Verified job opportunities with real-time district, domain, and experience filters, full slide-out job details drawer, and direct official application links.
- **Graduate Career Desk Intake:** Multi-step streamlined registration for candidates across all Karnataka districts with instant token generation.
- **Grievance Redressal Helpdesk:** Public intake ticket generator with tracking tokens, live grievance management across 31 districts, and WhatsApp escalation.
- **Admin Control Center:**
  - Secure JWT authentication
  - Live constituency metric cards
  - Real-time job posting, editing, and deletion
  - Paginated student registration roster with CSV export
  - Paginated helpdesk ticket management with status workflow (Open / In Review / Resolved / Closed)
  - Dedicated mobile card views for touchscreens
- **Bilingual Interface:** Instant language switching between English and Kannada (ಕನ್ನಡ).

## Tech Stack
- **Framework:** React 19 + Vite
- **Styling:** Modular Scoped CSS (CSS Modules)
- **Localization:** React Context Localization Engine (`en` / `kn`)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/kodidela7/Vidya-Pragathi-frontend.git
cd Vidya-Pragathi-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
Create `.env` based on `.env.example`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```
