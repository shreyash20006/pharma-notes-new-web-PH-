# PharmaNotes - B.Pharma Study Platform

A complete, mobile-responsive study notes website for Indian college students.

## Features
- **Google Login**: Secure authentication with Firebase.
- **Study Notes**: Browse and download subject-wise PDFs.
- **AI Summarizer**: Simplify complex notes using Google Gemini AI.
- **MCQ Generator**: Generate practice questions from notes.
- **Premium Membership**: Unlock exclusive content with Razorpay.
- **Dashboard**: Track your progress and premium status.
- **Telegram Integration**: Stay updated with our community.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Express.js (for Razorpay integration).
- **Database**: Supabase.
- **Authentication**: Firebase.
- **AI**: Google Gemini API.
- **Payments**: Razorpay.

## Setup Instructions

### 1. Firebase Setup
The AI Studio agent has already initiated the Firebase setup. Once you approve the terms in the UI, the `firebase-applet-config.json` file will be generated.

### 2. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com/).
2. Go to the SQL Editor and run the contents of `supabase_setup.sql` to create the `users` and `notes` tables.
3. Copy your **Supabase URL** and **Anon Key** and add them to your environment variables or `.env` file.

### 3. Razorpay Setup
1. Create a [Razorpay](https://razorpay.com/) account.
2. Generate **Key ID** and **Key Secret** from the Settings panel.
3. Add these to your environment variables.

### 4. Gemini API Key
Ensure your `GEMINI_API_KEY` is set in the AI Studio Secrets panel.

## Environment Variables
Add the following to your environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `GEMINI_API_KEY`

## Deployment
This project is ready to be deployed on Vercel or any other platform that supports Node.js and React.
