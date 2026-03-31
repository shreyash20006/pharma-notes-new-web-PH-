# NotesDrive - Product Requirements Document

## Project Overview
NotesDrive is an educational SaaS platform for BTech and B.Pharma students. Provides access to study notes, AI-powered summaries, and MCQ practice.

## Tech Stack
- Frontend: React + TypeScript + Vite (served via Express/server.ts on port 3000)
- Database: Firebase Firestore
- Auth: Firebase Auth (Google + GitHub OAuth)
- Animations: Framer Motion (motion v12)
- Styling: Tailwind CSS v4
- Payments: Razorpay + Cashfree

## Architecture
- App in /app (not /app/frontend)
- Main entry: /app/server.ts (Express + Vite)
- Frontend: /app/src/
- Firebase config: /app/src/lib/firebase.ts
- Firestore rules: /app/firestore.rules (notes require auth to read)

## User Personas
- Engineering/Pharma students (BTech, B.Pharma, D.Pharma)
- Note uploaders (earn by sharing)
- Admin (notesdriveshop@gmail.com, shreyash20006@gmail.com)

## Core Requirements (Static)
1. Browse/download study notes by stream/branch/semester/subject
2. AI PDF Summarizer
3. Quiz/MCQ practice
4. User auth with premium subscription
5. Admin panel for note approval
6. Payment via Razorpay/Cashfree

## What's Been Implemented
### Session 1 (Initial setup) - 2026-03-31
- Full platform already existed with all core features
- Firebase integration for notes, auth, profiles
- Payment gateway (Razorpay + Cashfree)
- Splash screen animation
- NewHomepage with hero, features, stats, CTA sections

### Session 2 (Stacked Notes Animation) - 2026-03-31
- Built `StackedNotesSection` component (/app/src/components/StackedNotesSection.tsx)
- Scroll-triggered stacked card animation using framer-motion useScroll
- 4-5 cards stacked like a physical deck, each slides up as user scrolls
- Fetches real notes from Firebase; falls back to Human Anatomy notes (bpharma/DBATU) when unauthenticated
- Inserted between Hero and Features sections in NewHomepage.tsx
- Dark navy/blue theme with per-card color palettes
- Fixed supervisor setup for /app/frontend directory
- All tests passing (100% frontend success)

## Prioritized Backlog
### P0 (Critical)
- None currently

### P1 (High Priority)
- Firestore rules: Consider making notes publicly readable for homepage preview (currently auth-required)
- Stacked section: Replace fallback notes with authenticated Firebase fetch when user logs in

### P2 (Nice to Have)
- Progress indicator showing which card # is currently showing (e.g., 2/4)
- Click-to-advance feature (in addition to scroll)
- Auto-play mode for mobile where scrolling is different

## Next Tasks
1. Update Firestore rules to allow public read for approved/published notes
2. Add note count progress indicator to stacked section
3. Consider mobile responsiveness of the stacked animation
