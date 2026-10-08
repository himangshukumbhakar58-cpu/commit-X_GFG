# CommitX — Developer Debugging Assistant & Stack Trace Analyzer

![CommitX Engine](https://img.shields.io/badge/Engine-DEVFIX%202.5-3b82f6?style=for-the-badge&logo=codeforces)
![Build Status](https://img.shields.io/badge/CI-Passing-10b981?style=for-the-badge&logo=githubactions)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

> **Challenge:** DEVFIX — *"Turn coding errors into understandable solutions."*

**CommitX** is an AI-powered developer debugging assistant built to parse cryptic terminal stack traces, explain root causes in plain English, and generate production-ready defensive safe code patches in seconds.

---

## 🚀 Key Features

- **Stitch Design Faithful UI:** Pixel-perfect dark theme UI reproduction featuring terminal code windows, line numbering, diagnostic cards, side-by-side diff code comparison, and responsive sidebar.
- **Dual AI & Offline Debug Engine:** Integrates with Gemini 2.5 Dev generative AI for arbitrary error resolution, paired with a local rule-based fallback AST engine for offline reliability.
- **Multi-Language Support:** Instant support for JavaScript (Node / Browser), Python 3.12+, Java / Spring Boot, C / C++, TypeScript, and generic stack traces.
- **Side-by-Side Code Diff:** Compares unsafe buggy code directly against recommended defensive safe fixes with optional chaining, nullish coalescing, and bounds checking.
- **Debug Insights & Proactive Prevention:** Generates error classes, likely root causes, core concepts, difficulty levels, and actionable linter/tsconfig prevention tips.
- **Persistent History & Saved Fixes:** LocalStorage persistence (up to 50 entries) with search, language filter, severity filter, clear history, and instant restoration.
- **One-Click Code Copy:** Copy solution code to clipboard with real-time feedback indicator (`Copied ✓`).
- **Interactive Product Pitch Mode:** Toggleable landing page featuring system architecture, metrics, and command-line installation preview.

---

## 🔄 Core Product Flow

```
ERROR INPUT
     ↓
LANGUAGE SELECTION
     ↓
ANALYZE ERROR (Ctrl+Enter)
     ↓
DIAGNOSTIC ANALYSIS (What Happened)
     ↓
ROOT CAUSE DISCOVERY (Why It Happened)
     ↓
FIX EXPLANATION (How Can I Fix It)
     ↓
SIDE-BY-SIDE CODE DIFF (Unsafe vs Safe Recommended)
     ↓
ONE-CLICK COPY / SAVE FIX
```

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Backend/API:** Node.js, Express, CORS, Dotenv
- **AI Integration:** Google Gemini Generative AI API (`gemini-1.5-flash` / `gemini-2.0-flash`)
- **Testing:** Vitest
- **CI/CD:** GitHub Actions workflow (`.github/workflows/ci.yml`)

---

## 📦 Installation & Local Setup

### 1. Prerequisites
- Node.js (v18.x or higher)
- npm or pnpm

### 2. Clone Repository
```bash
git clone https://github.com/commitx/commitx-core.git
cd commitx-core
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` to include your Gemini API key (optional for AI mode; offline fallback mode active by default):
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```

### 5. Run Development Mode
Start both frontend and backend API proxy:
```bash
# Terminal 1: Backend API Server
npm run server

# Terminal 2: Frontend Vite Dev Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Unit Tests

Run the Vitest unit test suite covering validation, fallback rules, and schema structure:
```bash
npm run test
```

---

## 🏗️ Production Build & Deployment

To create an optimized production bundle:
```bash
npm run build
npm start
```
The Express server serves the compiled `dist/` production assets on port 3001.

### Deploying to Vercel
Set `GEMINI_API_KEY` in Vercel Project Environment Variables. Vercel automatically detects the Vite React app and deploys effortlessly.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
