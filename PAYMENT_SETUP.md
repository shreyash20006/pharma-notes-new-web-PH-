# Razorpay Payment Integration Setup Guide

## Overview
This guide covers the complete setup of Razorpay payment integration for your React + Vite + Express project. The proper architecture ensures that secret keys never reach the frontend browser.

## Architecture

```
Frontend (React + Vite)
    ↓ (POST /api/razorpay/order with amount)
Backend (Express + Node.js)
    ↓ (Uses RAZORPAY_KEY_SECRET)
Razorpay API
    ↓ (Returns order object)
Backend → Frontend
    ↓ (Returns order.id only)
Razorpay Checkout Modal (in browser with VITE_RAZORPAY_KEY_ID)
    ↓ (User completes payment)
Frontend → Backend
    ↓ (POST /api/razorpay/verify with signature)
Backend (Verifies with RAZORPAY_KEY_SECRET)
    ↓
Firebase (Update user to isPremium: true)
```

## Environment Variables Setup

### 1. Add to `.env` file (should have both frontend and backend keys)
```
# Frontend visible (safe to expose in VCS)
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx   # Your Razorpay Key ID

# Backend only (NEVER push to VCS!)
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx   # Your Razorpay Secret (from Razorpay dashboard)
```

### 2. Add `.env` to `.gitignore` (if not already there)
```
.env
.env.local
.env.*.local
```

### 3. Update `.env.example` with placeholders
```
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx_NEVER_SHARE_THIS
```

## Getting Razorpay Credentials

1. Go to https://dashboard.razorpay.com
2. Sign up or log in
3. Navigate to **Settings → API Keys**
4. Copy your **Key ID** (starts with `rzp_test_` or `rzp_live_`)
5. Copy your **Key Secret** (long string)
6. For testing use `Key ID` and `Key Secret` from **Test mode**
7. When deploying to production, switch to **Live mode** keys

## Running Locally

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Backend Server
```bash
npm run dev
```

This will:
- Load environment variables from `.env`
- Start Express server on `http://localhost:3000`
- Run Vite dev server for auto-reload
- Serve frontend on same port (proxied through Express)

**Console output should show:**
```
Server running on http://localhost:3000
```

### Step 3: Open in Browser
```
http://localhost:3000
```

### Step 4: Test Payment Flow
1. Click "Initialize Upgrade" button on Premium page
2. Complete test payment using:
   - **Card**: 4111 1111 1111 1111
   - **Expiry**: Any future date (e.g., 12/25)
   - **CVV**: Any 3 digits (e.g., 123)
   - **OTP**: 123456 (if prompted)

3. If successful, you'll be redirected to `/dashboard?success=true`
4. User will have `isPremium: true` in Firebase

## Troubleshooting

### Error: "Failed to initiate Razorpay payment"
**Cause**: Backend `/api/razorpay/order` endpoint failed

**Solutions**:
1. Check that backend is running: `npm run dev`
2. Verify `.env` has `VITE_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
3. Check browser console for specific error message
4. Check terminal console for backend error logs

### Error: "Unexpected token 'T'... not valid JSON"
**Cause**: Response from server is not valid JSON (often HTML error page)

**Solutions**:
1. Make sure backend server is running
2. Clear browser cache and refresh
3. Check network tab in DevTools - look at actual response
4. Verify RAZORPAY_KEY_SECRET is correct in `.env`

### Error: "Razorpay SDK not loaded"
**Cause**: Razorpay checkout script not loaded in HTML

**Solutions**:
1. Check `index.html` has Razorpay script (should be there already)
2. Clear browser cache
3. Check network tab for script loading errors
4. Make sure .env has `VITE_RAZORPAY_KEY_ID`

### Error: "Invalid payment signature"
**Cause**: Backend couldn't verify the payment

**Solutions**:
1. Verify `RAZORPAY_KEY_SECRET` is exactly correct
2. Check that `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` are being sent from frontend
3. Check backend console logs for more details

## Frontend Code Reference

### Payment Button
Located in [src/pages/Premium.tsx](src/pages/Premium.tsx)

The button calls `handleRazorpayPayment()` which:
1. ✅ Calls `/api/razorpay/order` to create order on backend
2. ✅ Opens Razorpay Checkout modal
3. ✅ On successful payment, calls `/api/razorpay/verify`
4. ✅ Updates Firebase with `isPremium: true`
5. ✅ Redirects to `/dashboard?success=true`

### Key Frontend Code
- Never use secret key in frontend code
- Use `import.meta.env.VITE_RAZORPAY_KEY_ID` to access public key
- Always validate API responses before using them
- Handle errors gracefully with user-friendly messages

## Backend Code Reference

### API Endpoints
Located in [server.ts](server.ts)

#### POST `/api/razorpay/order`
- **Input**: `{ amount: number }`
- **Output**: `{ id, amount, currency, receipt }`
- **Errors**: Returns JSON error responses

#### POST `/api/razorpay/verify`
- **Input**: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`
- **Output**: `{ success: true }` or `{ success: false, error: string }`
- **Security**: HMAC-SHA256 signature verification using `RAZORPAY_KEY_SECRET`

## Deployment to Vercel

### Step 1: Push code to GitHub
```bash
git add .
git commit -m "Fix Razorpay payment integration"
git push origin main
```

### Step 2: Add Environment Variables to Vercel
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add these variables:

```
RAZORPAY_KEY_SECRET = (your production secret key)
VITE_RAZORPAY_KEY_ID = rzp_live_xxxxxxxxxxxxx    (production key)
```

**Do NOT add these to your code - they stay only in Vercel.**

### Step 3: Update Production Razorpay Keys
1. In Razorpay dashboard, switch to **Live mode**
2. Copy Live mode **Key ID** and **Key Secret**
3. Add to Vercel environment variables (as shown above)

### Step 4: Deploy
1. Connect GitHub to Vercel (if not already done)
2. Vercel will auto-deploy on every `git push`
3. View deployment logs: **Deployments → View Details**

### Step 5: Test Production
1. Visit deployed URL: `https://your-project.vercel.app`
2. Try the payment flow
3. Check Razorpay dashboard → **Payments** to verify transaction

## Security Checklist

✅ **Frontend**: 
- Never hardcode secret keys
- Use `VITE_` prefix for public env vars
- Validate all API responses

✅ **Backend**:
- Load env vars at server startup
- Verify HMAC signatures for payments
- Return only safe data to frontend
- Log warnings for failed verifications

✅ **Deployment**:
- Secret keys in Vercel (not in code)
- `.env` in `.gitignore`
- Use environment-specific keys (test vs live)
- Monitor Razorpay dashboard for suspicious activity

## Key Differences from Buggy Version

### Before (Broken)
```javascript
// ❌ BAD: Secret key accessible in frontend
const secret = import.meta.env.VITE_RAZORPAY_SECRET_KEY;

// ❌ BAD: Response parsing without error handling
const order = await response.json(); // Crashes if not JSON
```

### After (Fixed)
```javascript
// ✅ GOOD: Secret key only in backend
const secret = process.env.RAZORPAY_KEY_SECRET; // Backend only

// ✅ GOOD: Proper error handling
if (!response.ok) {
  const errorData = await response.json().catch(() => ({...}));
  throw new Error(errorData.error);
}
```

## Support

For Razorpay issues:
- **Docs**: https://razorpay.com/docs/
- **Dashboard**: https://dashboard.razorpay.com
- **Support**: support@razorpay.com

For your app issues, check:
1. Browser console (F12)
2. Backend terminal logs (where `npm run dev` is running)
3. Network tab in DevTools (actual API responses)
