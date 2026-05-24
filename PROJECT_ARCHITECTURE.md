# BILLIARD PLUS — PROJECT ARCHITECTURE DOCUMENT
> Version: 1.0 | Last Updated: 2025 | Status: Active Development
> **Use this document at the start of every new chat session to restore full project context.**

---

## TABLE OF CONTENTS
1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Database Schema](#5-database-schema)
6. [API Structure](#6-api-structure)
7. [Authentication Flow](#7-authentication-flow)
8. [User Roles & Permissions](#8-user-roles--permissions)
9. [Booking Flow](#9-booking-flow)
10. [Payment Flow](#10-payment-flow)
11. [WebSocket & Live Stream Architecture](#11-websocket--live-stream-architecture)
12. [Reusable Components Map](#12-reusable-components-map)
13. [State Management Strategy](#13-state-management-strategy)
14. [Folder Conventions](#14-folder-conventions)
15. [Coding Conventions](#15-coding-conventions)
16. [UI/UX Design System](#16-uiux-design-system)
17. [Environment Variables](#17-environment-variables)
18. [Deployment Strategy](#18-deployment-strategy)
19. [Completed Modules](#19-completed-modules)
20. [Incomplete Modules](#20-incomplete-modules)
21. [Technical Debt](#21-technical-debt)
22. [Roadmap](#22-roadmap)
23. [Future Scaling Strategy](#23-future-scaling-strategy)
24. [Quick Reference](#24-quick-reference)

---

## 1. PROJECT OVERVIEW

**Billiard Plus** is Iran's first comprehensive billiards platform providing:
- Online table reservation for billiard clubs
- Official player/coach/club rankings
- Equipment marketplace (buy/sell)
- Live match streaming with real-time chat
- Tournament management
- Educational content

**Repository:** `https://github.com/BabakNabavi/billiard-plus` (private)
**Local Path:** `I:\Billiard Plus\billiard-plus`
**Type:** Monorepo (Turborepo)

---

## 2. SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│  Next.js 16 (App Router) — port 3000                    │
│  Tailwind CSS + Inline Styles (glassmorphism)           │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP / WebSocket
┌─────────────────────▼───────────────────────────────────┐
│                    API LAYER                             │
│  NestJS 11 — port 4000                                  │
│  REST API + WebSocket Gateway                           │
│  JWT Authentication (access + refresh tokens)           │
└─────────────────────┬───────────────────────────────────┘
                      │ TypeORM
┌─────────────────────▼───────────────────────────────────┐
│                  DATABASE LAYER                          │
│  PostgreSQL via Supabase                                │
│  Supabase Storage (images, videos)                      │
└─────────────────────────────────────────────────────────┘

External Services:
├── Zarinpal / Mellat / Parsian  → Payment Gateway
├── Google Maps Embed API        → Club location
└── (Future) SMS Provider        → Booking confirmations
```

**Tech Stack:**

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js | 16 |
| Backend | NestJS | 11 |
| Database | PostgreSQL (Supabase) | Latest |
| ORM | TypeORM | Latest |
| Auth | JWT (access + refresh) | — |
| State | Zustand | Latest |
| HTTP Client | Axios | Latest |
| Styling | Tailwind CSS + Inline | Latest |
| Package Manager | npm | — |
| Monorepo | Turborepo | Latest |

---

## 3. FRONTEND ARCHITECTURE

### Structure
```
apps/web/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Navbar + Footer)
│   ├── page.tsx                  # Home page ✅
│   ├── login/page.tsx            # Login ✅
│   ├── register/page.tsx         # Register ❌
│   ├── dashboard/page.tsx        # User dashboard ❌
│   ├── profile/page.tsx          # User profile ❌
│   ├── clubs/
│   │   ├── page.tsx              # Clubs list ✅
│   │   ├── [id]/page.tsx         # Club profile + booking ✅
│   │   └── new/page.tsx          # Register club ❌
│   ├── shop/
│   │   ├── page.tsx              # Shop main ✅
│   │   ├── [id]/page.tsx         # Product detail ❌
│   │   └── new/page.tsx          # Sell product ❌
│   ├── rankings/page.tsx         # Rankings ❌
│   ├── events/
│   │   ├── page.tsx              # Events list ⚠️
│   │   └── [id]/page.tsx         # Event detail ✅
│   ├── news/
│   │   ├── page.tsx              # News list ⚠️
│   │   └── [id]/page.tsx         # News detail ✅
│   ├── live/
│   │   ├── page.tsx              # Live streams list ✅
│   │   └── [id]/page.tsx         # Live stream + chat ✅
│   └── admin/
│       ├── page.tsx              # Admin panel ❌
│       └── ads/page.tsx          # Ads management ✅
│
├── components/
│   ├── Navbar.tsx                # Responsive navbar ✅
│   ├── Footer.tsx                # Footer + SVG wave ✅
│   ├── Stories.tsx               # Instagram-like stories ✅
│   ├── AdSlider.tsx              # Ad carousel ✅
│   └── ScrollReveal.tsx          # Scroll animation wrapper ✅
│
├── store/
│   └── auth.store.ts             # Zustand auth store ✅
│
├── lib/
│   └── api.ts                    # Axios instance ✅
│
└── public/
    └── images/
        ├── billiadr-club-1.jpg   # Real billiard images ✅
        ├── billiadr-club-2.jpg
        └── billiadr-club-3.jpg
```

### Routing Strategy
- **App Router** (Next.js 16) — all pages use `'use client'`
- Dynamic routes: `[id]` pattern for clubs, shop, events, news, live
- No middleware auth guard yet — client-side redirect via `useAuthStore`

### Data Fetching Pattern
```typescript
// Standard pattern used across all pages
useEffect(() => {
  api.get('/endpoint').then(res => {
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      setData(res.data);
    }
    // Always fall back to sampleData if API returns empty
  }).catch(() => {});
}, []);
```

---

## 4. BACKEND ARCHITECTURE

### Structure
```
apps/api/
└── src/
    ├── main.ts                   # Entry point, port 4000
    ├── app.module.ts             # Root module
    ├── auth/                     # JWT auth module ✅
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.module.ts
    │   ├── jwt.strategy.ts
    │   └── dto/
    ├── users/                    # User management ✅
    │   ├── users.controller.ts
    │   ├── users.service.ts
    │   ├── users.module.ts
    │   ├── user.entity.ts
    │   └── dto/
    ├── clubs/                    # Club management ✅
    │   ├── clubs.controller.ts
    │   ├── clubs.service.ts
    │   ├── clubs.module.ts
    │   ├── club.entity.ts
    │   └── dto/
    ├── products/                 # Marketplace ✅
    │   ├── products.controller.ts
    │   ├── products.service.ts
    │   ├── products.module.ts
    │   ├── product.entity.ts
    │   └── dto/
    ├── bookings/                 # Table reservation ❌
    ├── events/                   # Tournament events ⚠️
    ├── news/                     # News/articles ⚠️
    ├── live/                     # Live streams ⚠️
    └── rankings/                 # Player rankings ❌
```

### NestJS Patterns Used
- **Modules:** Each feature is an independent NestJS module
- **Guards:** `JwtAuthGuard` for protected routes
- **DTOs:** Class-validator for input validation
- **Entities:** TypeORM entities mapped to PostgreSQL tables
- **Services:** Business logic separated from controllers

---

## 5. DATABASE SCHEMA

### Users Table
```sql
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       VARCHAR(20) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,          -- bcrypt hashed
  firstName   VARCHAR(100),
  lastName    VARCHAR(100),
  primaryRole VARCHAR(50) DEFAULT 'user',     -- see roles section
  isVerified  BOOLEAN DEFAULT false,
  avatar      VARCHAR(500),
  createdAt   TIMESTAMP DEFAULT NOW(),
  updatedAt   TIMESTAMP DEFAULT NOW()
);
```

### Clubs Table
```sql
CREATE TABLE clubs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ownerId             UUID REFERENCES users(id),
  name                VARCHAR(200) NOT NULL,
  managerName         VARCHAR(100),
  description         TEXT,
  address             VARCHAR(500),
  city                VARCHAR(100),
  country             VARCHAR(100) DEFAULT 'ایران',
  latitude            DECIMAL(10,8),
  longitude           DECIMAL(11,8),
  phone               VARCHAR(20),
  website             VARCHAR(500),
  snookerTables       INT DEFAULT 0,
  pocketTables        INT DEFAULT 0,
  highballTables      INT DEFAULT 0,
  vipSnookerTables    INT DEFAULT 0,
  vipPocketTables     INT DEFAULT 0,
  airHockeyTables     INT DEFAULT 0,
  dartBoards          INT DEFAULT 0,
  playstations        INT DEFAULT 0,
  hasCafe             BOOLEAN DEFAULT false,
  hasParking          BOOLEAN DEFAULT false,
  hasWifi             BOOLEAN DEFAULT false,
  hasProfessionalCoach BOOLEAN DEFAULT false,
  specialFeatures     TEXT,
  workingHours        JSONB,                  -- {saturday: {isOpen, open, close}, ...}
  images              TEXT[],                 -- Supabase Storage URLs
  videos              TEXT[],
  isApproved          BOOLEAN DEFAULT false,
  createdAt           TIMESTAMP DEFAULT NOW()
);
```

### Products Table
```sql
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sellerId        UUID REFERENCES users(id),
  title           VARCHAR(500) NOT NULL,
  description     TEXT,
  price           BIGINT NOT NULL,            -- in Tomans
  discountPrice   BIGINT,
  discountPercent INT DEFAULT 0,
  category        VARCHAR(50),               -- table/cue/ball/accessory/clothing/educational/other
  condition       VARCHAR(20),               -- new/like_new/used
  city            VARCHAR(100),
  images          TEXT[],
  isVerified      BOOLEAN DEFAULT false,
  isOfficialStore BOOLEAN DEFAULT false,
  isDailyDeal     BOOLEAN DEFAULT false,
  isSpecialSale   BOOLEAN DEFAULT false,
  isActive        BOOLEAN DEFAULT true,
  createdAt       TIMESTAMP DEFAULT NOW()
);
```

### Bookings Table (INCOMPLETE)
```sql
CREATE TABLE bookings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId      UUID REFERENCES users(id),
  clubId      UUID REFERENCES clubs(id),
  tableId     VARCHAR(50),                    -- e.g. "snooker-1"
  tableBrand  VARCHAR(200),
  tableType   VARCHAR(50),
  bookingDate DATE NOT NULL,
  timeSlots   TEXT[],                         -- ["10:00", "11:00", "12:00"]
  totalHours  INT,
  totalPrice  BIGINT,
  status      VARCHAR(20) DEFAULT 'pending',  -- pending/confirmed/cancelled
  paymentId   VARCHAR(200),
  gateway     VARCHAR(50),                    -- zarinpal/mellat/parsian
  createdAt   TIMESTAMP DEFAULT NOW()
);
```

### WorkingHours JSONB Format
```json
{
  "saturday":  { "isOpen": true,  "open": "10:00", "close": "24:00" },
  "sunday":    { "isOpen": true,  "open": "10:00", "close": "24:00" },
  "monday":    { "isOpen": true,  "open": "10:00", "close": "24:00" },
  "tuesday":   { "isOpen": true,  "open": "10:00", "close": "24:00" },
  "wednesday": { "isOpen": true,  "open": "10:00", "close": "24:00" },
  "thursday":  { "isOpen": true,  "open": "10:00", "close": "24:00" },
  "friday":    { "isOpen": true,  "open": "14:00", "close": "24:00" }
}
```

---

## 6. API STRUCTURE

### Base URL
```
Development: http://localhost:4000
Production:  https://api.billiardplus.ir (planned)
```

### Auth Endpoints
```
POST /auth/login          → { phone, password } → { access_token, user }
POST /auth/register       → { phone, password, firstName, lastName } → { user }
POST /auth/refresh        → { refresh_token } → { access_token }
GET  /auth/me             → Bearer token → { user }
```

### Users Endpoints
```
GET  /users               → (admin) list all users
GET  /users/:id           → user profile
PUT  /users/:id           → update profile
PUT  /users/:id/verify    → (admin) verify user ❌
GET  /users/all           → (admin) all users ❌
```

### Clubs Endpoints
```
GET  /clubs               → list clubs (with filters)
GET  /clubs/:id           → club detail
POST /clubs               → create club (auth required)
PUT  /clubs/:id           → update club (owner/admin)
DELETE /clubs/:id         → delete club (admin)
```

### Products Endpoints
```
GET  /products            → list products (with filters)
GET  /products/:id        → product detail
POST /products            → create listing (auth required)
PUT  /products/:id        → update listing (owner/admin)
DELETE /products/:id      → delete listing
```

### Bookings Endpoints (INCOMPLETE)
```
POST /bookings            → create booking ❌
GET  /bookings/user/:id   → user's bookings ❌
GET  /bookings/club/:id   → club's bookings ❌
PUT  /bookings/:id/cancel → cancel booking ❌
```

### Axios Instance Configuration
```typescript
// apps/web/lib/api.ts
const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor adds Bearer token
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## 7. AUTHENTICATION FLOW

```
User enters phone + password
        ↓
POST /auth/login
        ↓
NestJS validates credentials
bcrypt.compare(password, hash)
        ↓
Returns JWT access_token + user object
        ↓
Zustand auth.store saves:
  - token (localStorage)
  - user object
        ↓
Axios interceptor injects Bearer token
on every subsequent request
        ↓
Protected pages check:
  if (!user) router.push('/login')
```

### JWT Payload
```json
{
  "sub": "user-uuid",
  "phone": "09121327283",
  "primaryRole": "admin",
  "iat": 1700000000,
  "exp": 1700086400
}
```

### Admin Credentials
```
Phone:    09121327283
Password: password
Role:     admin
```

---

## 8. USER ROLES & PERMISSIONS

| Role | Label (FA) | Permissions |
|------|-----------|-------------|
| `admin` | فروشگاه رسمی / ادمین | Full access, verify users/clubs |
| `seller` | فروشگاه | List products, manage own listings |
| `manufacturer` | تولیدکننده | List products, manufacturer badge |
| `player` | بازیکن | Booking, ranking participation |
| `coach` | مربی | Coaching sessions, profile |
| `installer` | متخصص نصب | Installation services listing |
| `referee` | داور | Tournament judging |
| `user` | کاربر | Basic booking, marketplace |
| `club` | باشگاه | Club profile management |

### Role Colors (UI)
```typescript
const roleLabels = {
  admin:        { label: 'فروشگاه رسمی', color: '#7c3aed' },
  seller:       { label: 'فروشگاه',      color: '#2563eb' },
  manufacturer: { label: 'تولیدکننده',   color: '#059669' },
  player:       { label: 'بازیکن',       color: '#d97706' },
  coach:        { label: 'مربی',         color: '#ca8a04' },
  club:         { label: 'باشگاه',       color: '#10b981' },
  user:         { label: 'کاربر',        color: '#6b7280' },
};
```

---

## 9. BOOKING FLOW

### 4-Step Reservation (Frontend Complete, Backend Incomplete)

```
Step 1: انتخاب تاریخ (Jalali Calendar)
├── Jalali date conversion: toJalali(gy, gm, gd)
├── Past days disabled (grayed + line-through)
├── Month navigation with prev/next arrows
└── Selected date highlighted green

Step 2: انتخاب میز
├── Filter by type: اسنوکر / پاکت / هی‌بال / VIP
├── Each table shows: brand name, type, status
├── Status: آزاد (green pulse) / مشغول (red dot)
├── Booked slots shown per table
└── Selected table highlighted

Step 3: انتخاب ساعت (Multi-slot, contiguous)
├── Time slots: 10:00 → 24:00 (from club workingHours)
├── Booked slots: grayed + strikethrough + red dot
├── Selection logic: click start → click end → fills range
├── Cannot select across booked slot
├── Live display: "از 15:00 تا 18:00 — 3 ساعت"
└── Price: slots × 150,000 Tomans (hardcoded, needs backend)

Step 4: پرداخت
├── Booking summary display
├── Gateway selection: زرین‌پال / ملت / پارسیان
├── Price calculation
├── On confirm: simulated (setTimeout 2500ms)
└── Success: notify club owner (NOT IMPLEMENTED)
```

### Jalali Calendar Functions
```typescript
// Gregorian → Jalali
function toJalali(gy: number, gm: number, gd: number): [number, number, number]

// Jalali → Gregorian (for first day of month calculation)
function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number]

// Days in Jalali month
function getJalaliMonthDays(jy: number, jm: number): number
// months 1-6 → 31 days, 7-11 → 30 days, 12 → 29 or 30 (leap)
```

---

## 10. PAYMENT FLOW

### Current State: SIMULATED (No Real Integration)
```
User selects gateway (زرین‌پال / ملت / پارسیان)
        ↓
Button: "💳 پرداخت و تأیید رزرو"
        ↓
setPaying(true) → shows "در حال اتصال به درگاه..."
        ↓
setTimeout(2500ms) → setConfirmed(true)
        ↓
Success screen with booking summary
        ↓
"پیامک تأیید ارسال شد" (NOT ACTUALLY SENT)
"صاحب باشگاه از رزرو مطلع شد" (NOT ACTUALLY SENT)
```

### Real Payment Integration Plan (TODO)
```
Frontend → POST /bookings/initiate
        → Returns: { payment_url, booking_id }
        → Redirect to gateway

Gateway → Callback to: /bookings/verify?status=OK&ref=xxx
        → NestJS verifies with gateway API
        → Updates booking.status = 'confirmed'
        → Sends SMS to user + club owner
        → Returns: { success: true, booking }

Frontend → Polling or redirect back
        → Shows confirmation
```

---

## 11. WEBSOCKET & LIVE STREAM ARCHITECTURE

### Current Implementation
```typescript
// apps/web/app/live/[id]/page.tsx
// Uses simulated WebSocket with useState

const [messages, setMessages] = useState<Message[]>([]);
const [viewers, setViewers] = useState(1234);

// Admin controls: kick user, mute, pin message
// Chat: real-time display (simulated, no actual WS)
```

### Planned Real Architecture
```
Frontend (Socket.io client)
        ↓ connect to ws://localhost:4000
NestJS WebSocket Gateway
        ↓
Rooms: live-{streamId}
Events:
  - join_room   → add viewer
  - leave_room  → remove viewer
  - send_message → broadcast to room
  - pin_message  → admin only
  - kick_user    → admin only
  - viewer_count → broadcast count
```

### Live Stream Data Model
```typescript
interface LiveStream {
  id: string;
  title: string;
  streamerId: string;
  clubId?: string;
  eventId?: string;
  streamUrl: string;       // HLS/RTMP URL
  thumbnailUrl: string;
  isLive: boolean;
  viewerCount: number;
  startedAt: Date;
}

interface ChatMessage {
  id: string;
  streamId: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
}
```

---

## 12. REUSABLE COMPONENTS MAP

### Global Components
```
Navbar.tsx
├── Desktop: logo + nav links + "بیشتر" dropdown + search + profile
├── Mobile: hamburger menu + slide-out drawer
├── "بیشتر" menu: players, coaches, referees, shops, manufacturers,
│              installers, news, events, education
└── Shop link in main nav

Footer.tsx
├── SVG wave at top (matches page background)
├── 4-column grid: brand info, PLATFORM, EXPLORE, ACCOUNT
├── Social links (T/I/Y/T placeholders)
├── Bottom bar: copyright + links
└── Responsive: 4col → 2col → 1col

Stories.tsx
├── Horizontal scroll strip with user avatars
├── Role-colored rings (club=green, player=cyan, shop=amber)
├── Story viewer: full-screen modal via createPortal
├── Progress bar: CSS animation (not JS interval)
├── Auto-advance: setTimeout 15s
├── Reactions: emoji picker + like + message
└── Story data: sampleGroups (hardcoded, needs API)

AdSlider.tsx
├── Auto-rotating ad banners
└── imageUrl optional prop

ScrollReveal.tsx
└── Intersection Observer wrapper for fade-up animations
```

### Page-Specific Components (defined inline)

#### Club Profile `/clubs/[id]/page.tsx`
```
ReservationModal    — 4-step booking modal
HScrollRow          — arrow-nav horizontal scroll (NOT USED HERE)
```

#### Shop `/shop/page.tsx`
```
PCard               — main product card with hover effects
SmallCard           — compact card for special offers section
DealCard            — deal card for daily deals section
HScrollRow          — arrow-nav horizontal scroll row
Countdown           — countdown timer (h:m:s, updates every second)
```

---

## 13. STATE MANAGEMENT STRATEGY

### Zustand Auth Store
```typescript
// apps/web/store/auth.store.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

// Persisted to localStorage via zustand/middleware
// Accessed in components via: const { user, token } = useAuthStore();
```

### Local Component State
All pages use local `useState` for:
- UI state (active tab, modal open/close, hover)
- Server data (fetched via useEffect + api.get)
- Form inputs

### No Global State For:
- Cart (needs to be added for shop)
- Notifications (needs to be added)
- Club/product data (fetched per-page)

---

## 14. FOLDER CONVENTIONS

```
apps/web/app/[feature]/
├── page.tsx              # Main page component
└── [id]/page.tsx         # Dynamic detail page

Naming:
- Components: PascalCase (Navbar.tsx, StoryViewer)
- Pages: lowercase (page.tsx)
- Stores: camelCase.store.ts
- API: camelCase (api.ts)
- Types/Interfaces: inline in page files (no separate types/ folder yet)

CSS:
- Global: tailwind classes (limited use)
- Component: inline styles (primary method)
- Animations: <style> tag inside component JSX
- Classes: short abbreviations (.gc, .ss, .fp, etc.)
```

---

## 15. CODING CONVENTIONS

### TypeScript Patterns
```typescript
// Always 'use client' for pages
'use client';

// Sample data fallback pattern
const [data, setData] = useState<Type[]>(sampleData);
useEffect(() => {
  api.get('/endpoint')
    .then(res => {
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setData(res.data);
      }
    })
    .catch(() => {});
}, []);

// Farsi number conversion
function toFa(n: number): string {
  return n.toLocaleString('fa-IR');
}
function pad(n: number): string {
  return String(n).padStart(2,'0').replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);
}

// Hover state pattern
const [hovered, setHovered] = useState(false);
<div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
     style={{ background: hovered ? 'active-style' : 'default-style' }}>

// Mouse event inline (for non-state hover)
onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
```

### Import Order
```typescript
'use client';
// 1. React hooks
import { useState, useEffect, useRef } from 'react';
// 2. Next.js
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
// 3. Third-party
import { Search, MapPin } from 'lucide-react';
// 4. Internal
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';
```

---

## 16. UI/UX DESIGN SYSTEM

### Color Palette
```css
/* Background — Light Crystal */
background: linear-gradient(160deg, #f0faf5 0%, #e8f5ef 30%, #f4faf7 70%, #edf7f2 100%);

/* Ambient light overlay (fixed) */
background:
  radial-gradient(ellipse at 15% 20%, rgba(16,185,129,0.07) 0%, transparent 50%),
  radial-gradient(ellipse at 85% 80%, rgba(6,182,212,0.05)  0%, transparent 50%);

/* Primary accent */
--green:      #10b981;
--green-dark: #059669;
--cyan:       #06b6d4;
--text-dark:  #0f2318;
--text-mid:   rgba(26,46,36,0.6);
--text-light: rgba(26,46,36,0.35);
```

### Glass Card System
```css
/* Standard glass card */
.glass-card {
  background:       rgba(255,255,255,0.78);
  border:           1px solid rgba(16,185,129,0.1);
  border-radius:    20px;
  backdrop-filter:  blur(20px);
  box-shadow:       0 4px 20px rgba(16,185,129,0.06),
                    inset 0 1px 0 rgba(255,255,255,0.9);
}

/* Hover state */
.glass-card:hover {
  border-color:     rgba(16,185,129,0.28);
  box-shadow:       0 20px 50px rgba(16,185,129,0.14),
                    inset 0 1px 0 rgba(255,255,255,1);
  transform:        translateY(-6px);
}
```

### Typography
```css
/* Section labels */
font-size: 11px; letter-spacing: 0.18em; font-weight: 600; color: #10b981;

/* Section titles */
font-size: 18-28px; font-weight: 900; color: #0f2318; letter-spacing: -0.02em;

/* Body text */
font-size: 13-14px; color: rgba(26,46,36,0.6); line-height: 1.8;

/* Persian numbers */
Always use: n.toLocaleString('fa-IR') or custom pad() function
```

### SVG Wave (Footer separator)
```tsx
// Used in Footer.tsx — appears at TOP of footer
// Background color must match page background (#edf7f2 or transparent)
<div style={{ position: 'relative', lineHeight: 0, background: '#edf7f2' }}>
  <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display:'block', width:'100%', height:'60px' }}>
    <path d="M0,60 C240,0 480,60 720,20 C960,-20 1200,50 1440,10 L1440,60 L0,60 Z" fill="#020806"/>
    <path d="M0,60 C200,10 440,55 680,25 C920,-5 1180,45 1440,20 L1440,60 L0,60 Z" fill="#020806" opacity="0.5"/>
  </svg>
</div>
```

### SVG Wave (Hero → Content separator on home page)
```tsx
<div style={{ position: 'relative', marginTop: '-2px', lineHeight: 0, background: '#0d2016' }}>
  <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display:'block', width:'100%', height:'80px' }}>
    <path d="M0,0 C240,80 480,0 720,50 C960,100 1200,20 1440,60 L1440,80 L0,80 Z" fill="#f0faf5"/>
    <path d="M0,20 C200,70 440,10 680,55 C920,100 1180,15 1440,45 L1440,80 L0,80 Z" fill="#f0faf5" opacity="0.5"/>
  </svg>
</div>
```

### Dark Hero Header Pattern (Club profile)
```css
/* Used on club profile page header */
filter: brightness(0.65) saturate(0.85);   /* bg image */
background: linear-gradient(135deg,
  rgba(6,78,59,0.75) 0%,
  rgba(6,95,70,0.6) 60%,
  rgba(4,120,87,0.5) 100%
);
```

### Button System
```tsx
/* Primary CTA */
background: linear-gradient(135deg, #10b981, #059669);
color: #fff; border: none; border-radius: 14px; padding: 13px 32px;
font-weight: 800; box-shadow: 0 8px 30px rgba(16,185,129,0.3);

/* Secondary */
background: rgba(16,185,129,0.08);
border: 1px solid rgba(16,185,129,0.2);
color: #059669; border-radius: 12px;

/* Ghost (crystal) */
background: rgba(255,255,255,0.92);
border: 1.5px solid rgba(16,185,129,0.22);
color: #059669;
```

### Animation Standards
```css
/* Card entrance */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); filter: blur(4px); }
  to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
}

/* Story progress (CSS only, no JS interval) */
@keyframes storyProgress {
  from { width: 0%; }
  to   { width: 100%; }
}

/* Live indicator pulse */
@keyframes ping {
  75%, 100% { transform: scale(2); opacity: 0; }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}
```

### Responsive Breakpoints
```css
@media (max-width: 900px) {
  /* 2-column → 1-column grids */
}
@media (max-width: 768px) {
  /* Navbar: hamburger menu */
}
@media (max-width: 480px) {
  /* Single column, condensed spacing */
}
```

---

## 17. ENVIRONMENT VARIABLES

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_GOOGLE_MAPS_KEY=xxx          # For map embed
```

### Backend (`apps/api/.env`)
```env
# Database
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=xxx

# Auth
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=4000
NODE_ENV=development

# Payment (TODO)
ZARINPAL_MERCHANT=xxx
MELLAT_TERMINAL=xxx
MELLAT_USERNAME=xxx
MELLAT_PASSWORD=xxx

# SMS (TODO)
SMS_PROVIDER_KEY=xxx
SMS_FROM=xxx
```

---

## 18. DEPLOYMENT STRATEGY

### Current: Development Only
```
Frontend: next dev → http://localhost:3000
Backend:  nest start:dev → http://localhost:4000
Database: Supabase (cloud PostgreSQL)
```

### Planned Production
```
Frontend: Vercel (Next.js optimized)
  - Auto-deploy from GitHub main branch
  - Environment variables in Vercel dashboard

Backend: Railway or Render
  - Docker container
  - Auto-deploy from GitHub main branch

Database: Supabase (keep as-is)
  - Connection pooling via Supabase Pooler

Static Assets: Supabase Storage
  - Club images, videos, user avatars
  - CDN via Supabase CDN
```

### Dockerfile (Backend — planned)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["node", "dist/main"]
```

---

## 19. COMPLETED MODULES

| Module | Status | Notes |
|--------|--------|-------|
| Home page | ✅ | Video hero, stories, clubs, events, news, shop, CTA |
| Clubs list | ✅ | GPS, filters, sorting, search, light theme |
| Club profile | ✅ | Gallery, video, working hours, booking modal |
| Booking modal | ✅ | 4-step: Jalali calendar, table, multi-hour, payment UI |
| Jalali calendar | ✅ | Full conversion, past days disabled, month nav |
| Shop main | ✅ | Categories, slider, banners, special offers, daily deals, filter |
| Stories | ✅ | RAF progress, portal, reactions, auto-advance |
| Navbar | ✅ | Desktop + mobile hamburger, dropdown |
| Footer | ✅ | SVG wave, 4-col responsive grid |
| Auth (login) | ✅ | JWT, Zustand store |
| Live list | ✅ | Stream cards |
| Live player | ✅ | Player + real-time chat (simulated) |
| Event detail | ✅ | Countdown timer |
| News detail | ✅ | Article view |
| Admin ads | ✅ | Ad management |

---

## 20. INCOMPLETE MODULES

| Module | Priority | Blocker |
|--------|----------|---------|
| Register page | HIGH | UI not built |
| User profile | HIGH | UI not built |
| Dashboard | HIGH | UI not built |
| Rankings | HIGH | Backend + UI |
| Shop product detail | HIGH | UI not built |
| Sell product form | HIGH | UI not built |
| Admin panel | HIGH | Full rebuild needed |
| Booking backend | CRITICAL | NestJS service missing |
| Payment real integration | CRITICAL | Gateway keys needed |
| SMS notifications | HIGH | Provider needed |
| Club registration form | MEDIUM | Complex multi-step form |
| News list | MEDIUM | Basic structure exists |
| Events list | MEDIUM | Basic structure exists |
| Real WebSocket chat | MEDIUM | NestJS gateway needed |
| Admin user verify | MEDIUM | Endpoint missing |
| Cart / Checkout | LOW | Full flow missing |
| Supabase Storage policy | MEDIUM | Upload not working |

---

## 21. TECHNICAL DEBT

### Critical
1. **No real booking persistence** — booking modal is purely frontend simulation
2. **No real payment** — setTimeout mock, no gateway integration
3. **No SMS** — "پیامک ارسال شد" is fake
4. **Sample data everywhere** — almost all pages fall back to hardcoded arrays
5. **No input validation** — forms have no client-side validation

### High Priority
6. **TypeScript warnings** — closure issues in Stories.tsx (refs vs state)
7. **No error boundaries** — crashes propagate to blank pages
8. **No loading states** — some pages have spinners, most don't
9. **Image optimization** — no `next/image` used anywhere (all `<img>`)
10. **No pagination** — all lists load everything at once

### Medium Priority
11. **CSS class naming** — abbreviated classes (.gc, .ss) not documented
12. **No unit tests** — zero test coverage
13. **Sample data not extracted** — each page defines its own sampleProducts/sampleClubs
14. **Hardcoded prices** — `slots × 150,000` not from database
15. **No 404 page** — missing fallback

---

## 22. ROADMAP

### Phase 1 — Core Flow (Next)
- [ ] Register page
- [ ] Club registration form
- [ ] Booking backend API
- [ ] Real payment (Zarinpal)
- [ ] SMS notifications
- [ ] User dashboard

### Phase 2 — Marketplace
- [ ] Product detail page
- [ ] Sell product form
- [ ] Cart + checkout
- [ ] Order history
- [ ] Seller dashboard

### Phase 3 — Social & Rankings
- [ ] Rankings system + backend
- [ ] User profiles (public)
- [ ] Player statistics
- [ ] Tournament brackets

### Phase 4 — Content
- [ ] News backend + admin
- [ ] Events backend + admin
- [ ] Education section
- [ ] Coach profiles

### Phase 5 — Premium
- [ ] Real-time WebSocket chat
- [ ] Live streaming (RTMP/HLS)
- [ ] Push notifications
- [ ] Mobile app (React Native)

---

## 23. FUTURE SCALING STRATEGY

### Database
- Add Redis for session caching and rate limiting
- Add database indexing on: userId, clubId, bookingDate, category
- Implement connection pooling via Supabase Pooler

### Backend
- Separate booking microservice (high traffic)
- Queue system (Bull/BullMQ) for SMS and email notifications
- CDN for images/videos

### Frontend
- Extract shared types to `packages/types/`
- Extract shared UI to `packages/ui/`
- Implement React Query for server state management
- Add PWA support for mobile

### Infrastructure
```
Load Balancer
├── Frontend (Vercel — auto-scaled)
└── Backend (Railway — horizontal scaling)
    ├── API Server × N
    ├── WebSocket Server × N
    └── Queue Worker × N
         ↓
    PostgreSQL (Supabase — managed)
    Redis (Upstash — managed)
    Storage (Supabase Storage — CDN)
```

---

## 24. QUICK REFERENCE

### Start Development
```bash
# From: I:\Billiard Plus\billiard-plus
npm run dev          # starts both web (3000) and api (4000)
# OR separately:
cd apps/web && npm run dev
cd apps/api && npm run dev
```

### Git Workflow
```bash
git add .
git commit -m "feat/fix/chore: description"
git push origin main
```

### Key Files to Know
```
apps/web/app/page.tsx              — Home page (most complex)
apps/web/app/clubs/[id]/page.tsx   — Club profile (most important feature)
apps/web/app/shop/page.tsx         — Shop (complex UI)
apps/web/components/Navbar.tsx     — Global navigation
apps/web/components/Footer.tsx     — Global footer + wave
apps/web/components/Stories.tsx    — Instagram-style stories
apps/web/store/auth.store.ts       — Global auth state
apps/web/lib/api.ts                — Axios instance
```

### Design Rule Summary
```
ALWAYS:
✓ Light crystal background on all pages
✓ Glass morphism cards (rgba white + blur)
✓ Green accent (#10b981 / #059669)
✓ SVG wave in Footer (connects pages to dark footer)
✓ Farsi numbers (toFa() / toLocaleString('fa-IR'))
✓ Responsive (900px and 480px breakpoints)
✓ Hover: translateY(-6px) + stronger border/shadow

NEVER:
✗ Dark backgrounds on page content
✗ English numbers in Persian UI
✗ Bullet lists in UI (use cards/badges)
✗ Hard redirects for empty API responses
```

### Images Available
```
/images/billiadr-club-1.jpg   — Billiard hall wide shot
/images/billiadr-club-2.jpg   — Green tables overhead
/images/billiadr-club-3.jpg   — Elegant club interior
```

---

*Document generated from active codebase analysis. Update after each major feature completion.*
*Admin: 09121327283 / password | Repo: github.com/BabakNabavi/billiard-plus*
