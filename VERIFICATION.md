# ✅ Verification Checklist

## Files Modified ✓

- [x] `server.ts` - Backend endpoints fixed
  - Added dotenv loading
  - Input validation on all endpoints
  - Consistent JSON responses
  - Better error handling
  
- [x] `src/pages/Premium.tsx` - Frontend payment handlers fixed
  - Added response validation
  - Better error messages
  - Proper async handling

## Documentation Added ✓

- [x] `README_PAYMENTS.md` - Quick start guide
- [x] `PAYMENT_SETUP.md` - Complete setup guide  
- [x] `RAZORPAY_FIXES.md` - Summary of fixes
- [x] `DEBUGGING_RAZORPAY.md` - Troubleshooting guide
- [x] `CODE_CHANGES.md` - Technical details

## Pre-Run Checklist

Before running `npm run dev`, verify:

- [ ] You have Node.js installed: `node --version`
- [ ] You have npm installed: `npm --version`
- [ ] `.env` file exists in project root
- [ ] `.env` is in `.gitignore`
- [ ] `index.html` has Razorpay script (should already be there)

## Razorpay Account Setup

- [ ] Account created at https://dashboard.razorpay.com
- [ ] Email verified
- [ ] Phone verified
- [ ] **Test Mode** credentials copied:
  - [ ] Key ID (starts with `rzp_test_`)
  - [ ] Key Secret (long string)

## .env File Setup

```
# Verify these are in your .env file:
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx      ← Your test key ID
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx      ← Your test key secret
```

Check file exists:
```bash
ls -la .env        # Linux/Mac
dir .env          # Windows PowerShell
```

Check `.gitignore` includes it:
```bash
grep ".env" .gitignore
```

## Running the Application

### Step 1: Install Dependencies
```bash
npm install
```

**Expected output:**
```
added X packages, and changed Y dependencies in Z seconds
```

### Step 2: Start Server
```bash
npm run dev
```

**Expected output:**
```
Server running on http://localhost:3000
```

If you see error about missing environment variables, your `.env` file isn't loaded. Check:
- Does `.env` file exist in project root?
- Are credentials exactly copied (no extra spaces)?
- Did you restart the terminal after creating `.env`?

### Step 3: Open Browser
```
http://localhost:3000
```

**Expected:** App loads, navbar visible, can click at links

### Step 4: Navigate to Premium
- Click **Premium** in navbar
- Should see pricing cards

### Step 5: Test Payment
- Click **Initialize Upgrade** button
- Razorpay modal should open (not error message)
- Use test card: `4111 1111 1111 1111`
- Use any future expiry: `12/25`
- Use any CVV: `123`
- OTP: `123456`

**Expected:**
- Modal closes
- Redirects to `/dashboard?success=true`
- User has `isPremium: true` in Firebase

## Verification Tests

### Test 1: Server Is Running
```bash
# In another terminal
curl http://localhost:3000
```

**Expected:** HTML response (app loads)

### Test 2: API Endpoint
```bash
curl -X POST http://localhost:3000/api/razorpay/order \
  -H "Content-Type: application/json" \
  -d '{"amount": 499}'
```

**Expected response:**
```json
{
  "id": "order_xxxxx",
  "amount": 49900,
  "currency": "INR",
  "receipt": "receipt_xxxxx"
}
```

**If error:** Check Terminal where `npm run dev` runs for error logs

### Test 3: Browser Console
Open DevTools (F12) and go to Console tab:

1. No red errors should appear on page load
2. Click "Initialize Upgrade"
3. Should see logs like:
   ```
   "Cashfree Environment: SANDBOX Mode: sandbox"
   "Order created: order_xxxxx"
   ```

## Troubleshooting Quick Fixes

### Issue: "Server running on..." doesn't appear
```bash
# Kill any existing Node processes
# On Mac/Linux:
pkill -f "node"
pkill -f "npm"

# On Windows PowerShell:
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process

# Try again:
npm run dev
```

### Issue: "Cannot find module 'dotenv'"
```bash
npm install dotenv
npm run dev
```

### Issue: "Razorpay API keys are missing"
1. Check `.env` file exists
2. Check it has both variables exactly
3. Check for typos (exact match matters!)
4. Restart terminal after adding `.env`

### Issue: "Unexpected token 'T'"
1. Stop server: Ctrl+C
2. Clear cache: Ctrl+Shift+Delete
3. Delete `node_modules` folder: `rm -rf node_modules`
4. Reinstall: `npm install`
5. Start again: `npm run dev`

### Issue: ".env file not found"
```bash
# Create it manually
# On Mac/Linux:
touch .env

# On Windows PowerShell:
New-Item -Name ".env" -ItemType "file"

# Edit it and add your credentials
```

## Deployment Verification

Before deploying to Vercel:

- [ ] Payment works locally with Test mode
- [ ] `.env` file not committed to Git
- [ ] GitHub repo has the latest code
- [ ] Razorpay credentials copied (Test mode)
- [ ] Vercel environment variables updated:
  - `RAZORPAY_KEY_SECRET` = test secret key
  - `VITE_RAZORPAY_KEY_ID` = test key ID

### Deploy Steps:
```bash
git status                    # Verify .env is NOT in changes
git add .
git commit -m "Fix Razorpay integration"
git push origin main          # Auto-deploys to Vercel
```

### After Deploy:
1. Visit Vercel URL
2. Test payment with Test mode credentials
3. Verify in Razorpay dashboard → Payments

## Production Checklist

- [ ] Tested on Vercel with Test mode credentials
- [ ] Razorpay live mode keys obtained
- [ ] Vercel environment secrets updated with Live keys
- [ ] Deployed with live keys
- [ ] Tested live payment
- [ ] Monitored Razorpay dashboard

## Security Verification

- [ ] `.env` file is in `.gitignore`
- [ ] `.env` not committed to Git (check `git log`)
- [ ] Secret key never appears in code
- [ ] Secret key never in error messages shown to users
- [ ] Signature verification happens on backend
- [ ] No sensitive data in API responses

## Logs to Check

### Terminal Logs (where `npm run dev` runs)
```
✅ Razorpay order created: order_xxxxx
✅ Payment verified successfully: pay_xxxxx
✅ Cashfree order created: order_xxxxx

❌ Razorpay order error: Error message
❌ Razorpay verification error: Error message
❌ RAZORPAY_KEY_SECRET is not set
```

### Browser Console (F12)
```
✅ Should be empty or have normal logs
✅ No red error messages

❌ Razorpay initiation error: ...
❌ Verification error: ...
❌ Unexpected token
```

### Network Tab (F12 → Network)
```
✅ /api/razorpay/order → Status 200 → JSON response
✅ /api/razorpay/verify → Status 200 → {'success': true}

❌ /api/razorpay/order → Status 500
❌ /api/razorpay/order → Status 404
❌ Response is HTML instead of JSON
```

## Success Indicators

✅ All these should be true:

- [x] `npm run dev` starts without errors
- [x] Browser opens to http://localhost:3000
- [x] Premium page loads
- [x] "Initialize Upgrade" button visible
- [x] Clicking button opens Razorpay modal (not error)
- [x] Card payment enters without errors
- [x] Redirects to `/dashboard?success=true`
- [x] Terminal shows "Payment verified successfully"
- [x] No red errors in browser console
- [x] No red errors in Terminal

## Quick Reference Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for TypeScript errors
npm run lint

# Kill Node processes (if stuck)
pkill -f "node"              # Mac/Linux
pkill -f "npm"               # Mac/Linux
taskkill /IM node.exe /F     # Windows CMD

# Check if .env exists
test -f .env && echo "✓ .env exists" || echo "✗ .env missing"

# Check .gitignore
grep ".env" .gitignore

# View environment variables (be careful with secrets!)
cat .env                     # All variables
grep RAZORPAY .env          # Just Razorpay vars
```

## Support Quick Links

- **Razorpay Dashboard:** https://dashboard.razorpay.com
- **API Keys:** https://dashboard.razorpay.com/app/settings/api
- **Razorpay Test Cards:** https://razorpay.com/docs/test-cards/
- **Razorpay Docs:** https://razorpay.com/docs/

## When Everything Works ✓

Congratulations! Your Razorpay integration is:

- ✅ Fully functional locally
- ✅ Ready for production
- ✅ Secure (secrets not exposed)
- ✅ Well-documented
- ✅ Production-ready for Vercel

Next: Deploy to Vercel with live keys!

