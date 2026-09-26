# HabitFlow — Precision Habit Tracker & SaaS Analytics

> Inspired by high-performance habit tracking spreadsheets, transformed into a modern, responsive, and visually stunning SaaS web application.

---

## 🌟 Overview & Key Features

HabitFlow translates the density, week-by-week structure, and comprehensive progress metrics of classic habit tracking spreadsheets (as captured in reference design specifications) into a polished SaaS experience:

- **Interactive Habit Matrix**: Full month-by-month spreadsheet view organized into Weeks (Week 1 to Week 5) with responsive, touch-friendly checkboxes, daily volume bars, and real-time completion percentages.
- **Visual Analytics Suite**:
  - **Daily Progress Trend Chart**: Area chart showing daily completion rates across the month.
  - **Overview Monthly Progress Donut**: Real-time completed vs. remaining distribution.
  - **Top Daily Habits**: Ranked consistency leaderboard with streak indicators.
  - **Consistency Heatmap**: 90-day GitHub-style activity contribution grid.
  - **Weekday Performance Breakdown**: Day-of-week consistency analysis.
  - **Category Breakdown**: Distribution across health, productivity, fitness, study, mindfulness, and finance.
- **1-Tap Focus Checklist**: Immediate daily action list prioritizing completion speed over navigation clutter.
- **Smart Streaks & Schedule**: Calculations that respect custom frequencies (daily, weekdays, weekends, custom) without penalizing unscheduled days.
- **Authentication & Cloud Architecture**:
  - **Firebase Google OAuth**: Secure one-click Google Sign-In with private per-user Firestore isolation.
  - **Zero-Setup Demo Mode**: Automatic local persistence fallback allowing full testing without external API credentials.
- **Data Portability**: Full client-side data export to both CSV (spreadsheet format) and JSON (raw backup).
- **Theme System**: Full light, dark, and system-adaptive themes with cohesive design tokens.

---

## 🛠️ Technology Stack

- **Core**: React 19, TypeScript
- **Bundler & Tooling**: Vite
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Charts**: Recharts
- **Celebration Effects**: Canvas Confetti
- **Backend / Cloud**: Firebase v11 (Authentication, Firestore, Security Rules)
- **Styling**: Vanilla CSS Design System with CSS Custom Properties, Glassmorphism, and Micro-interactions

---

## 📁 Project Architecture

```
Habit_Tracker/
├── .env.example               # Template for Firebase credentials
├── firestore.rules            # Production Firestore security rules
├── index.html                 # App shell with Google Fonts & SEO meta tags
├── package.json               # Dependency definitions
├── vite.config.ts             # Vite configuration
└── src/
    ├── types/                 # TypeScript interfaces (Habit, Completion, User, Overview)
    ├── config/                # Firebase initialization & demo mode fallback
    ├── context/
    │   ├── AuthContext.tsx    # Google OAuth & demo session management
    │   └── HabitContext.tsx   # Optimistic state, CRUD, & month overview calculations
    ├── services/
    │   ├── habitService.ts    # Firestore & LocalStorage synchronized repository
    │   └── exportService.ts   # CSV & JSON file generation
    ├── utils/
    │   ├── dateUtils.ts       # Timezone-safe date formatting & week chunking
    │   ├── analyticsUtils.ts  # Streaks, day summaries, and overview metrics
    │   └── seedData.ts        # Reference spreadsheet template data (Sep 2026)
    ├── components/
    │   ├── layout/            # AppShell, Sidebar, Header, MobileNav
    │   ├── dashboard/         # SummaryCards, MonthlyTrendChart, MonthlyDonutChart, TopHabitsCard, TodayHabitsList
    │   ├── matrix/            # HabitMatrix (Reference 1 & 2 modernized matrix)
    │   ├── habits/            # AddEditHabitModal, DeleteConfirmModal
    │   └── common/            # Toast notifications, accessible controls
    ├── pages/                 # LandingPage, DashboardPage, MatrixPage, HabitsPage, CalendarPage, AnalyticsPage, HabitDetailPage, SettingsPage, NotFoundPage
    └── styles/
        └── index.css          # Design tokens, themes, layout, and animations
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd Habit_Tracker

# Install dependencies
npm install
```

### 3. Local Development (Instant Demo Mode)
To launch immediately without Firebase credentials:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. Click **"Try Instant Demo Mode"** to load the pre-configured reference habits and start tracking!

---

## 🔥 Firebase Cloud Setup (Optional for Cloud Sync)

To enable real Google Sign-In and cloud Firestore syncing across devices:

### Step 1: Create a Firebase Project
1. Visit the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it (e.g., `habitflow-app`).

### Step 2: Enable Google Authentication
1. Navigate to **Build > Authentication > Sign-in method**.
2. Click **Google**, enable it, specify your support email, and save.
3. In **Settings > Authorized domains**, ensure `localhost` is listed.

### Step 3: Create Cloud Firestore Database
1. Navigate to **Build > Firestore Database**.
2. Click **Create database** in Production or Test mode.
3. Deploy the included `firestore.rules` file in the Firebase Console under **Firestore > Rules**.

### Step 4: Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Web App credentials:
```bash
cp .env.example .env
```
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=habitflow-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=habitflow-app
VITE_FIREBASE_STORAGE_BUCKET=habitflow-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:...
```

---

## 🔒 Security Architecture

The application enforces per-user isolation:
- Data is stored in Firestore subcollections under `/users/{userId}/habits/{habitId}` and `/users/{userId}/completions/{completionId}`.
- `firestore.rules` ensures that `request.auth.uid == userId` for all read, write, and delete operations.
- No client can read or modify another user's habits or progress.
