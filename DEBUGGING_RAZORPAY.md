# Razorpay Integration - Debugging Guide

## Common Issues & Solutions

### Issue 1: "Failed to initiate Razorpay payment"

**What it means:** The frontend couldn't start the payment flow.

**Debugging Steps:**

#### Step 1: Check Backend is Running
```bash
# Terminal where you ran npm run dev
# You should see: "Server running on http://localhost:3000"
```

If not running:
```bash
npm run dev
```

#### Step 2: Check Console Error
1. Press `F12` (DevTools)
2. Go to **Console** tab
3. Look for red error messages
4. Copy the full error message

#### Step 3: Check Network Request
1. Press `F12` (DevTools)
2. Go to **Network** tab
3. Click "Initialize Upgrade" button
4. Look for request to `/api/razorpay/order`
5. Click it and check:
   - **Status**: Should be `200`
   - **Response**: Should be JSON with `id` field

**Response should look like:**
```json
{
  "id": "order_xxxxx",
  "amount": 49900,
  "currency": "INR",
  "receipt": "receipt_1234567890"
}
```

**If Status is 404:**
- Backend not running
- API route not found
- Check server.ts is correct

**If Status is 500:**
- Check backend Terminal for error logs
- Missing credentials in .env
- Invalid Razorpay keys

---

### Issue 2: "Unexpected token 'T'... not valid JSON"

**What it means:** Response isn't valid JSON (usually an HTML error page).

**Debugging Steps:**

#### Step 1: Check What Server Returned
1. DevTools → Network tab
2. Click `/api/razorpay/order` request
3. Go to **Response** tab
4. **If it starts with `<!DOCTYPE`** → HTML error page (server crashed)
5. **If it shows error text** → Server error

#### Step 2: Read Server Error
In the Terminal where `npm run dev` is running, look for:
```
Razorpay order error: Error: Razorpay API keys are missing...
```

**Solution:** Add credentials to `.env`:
```
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=secret_xxxxx
```

#### Step 3: Restart Server
```bash
# Press Ctrl+C to stop
# Then run:
npm run dev
```

#### Step 4: Try Again
- Refresh browser (Ctrl+R)
- Click "Initialize Upgrade" button
- Check if error changed

---

### Issue 3: Razorpay SDK Not Loaded

**What it means:** `window.Razorpay` is undefined

**Debugging Steps:**

#### Step 1: Check Script in HTML
Open `index.html` and verify:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

If missing, add it to `<head>`:
```html
<head>
  ...
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</head>
```

#### Step 2: Check Script Loaded
1. DevTools → Network tab
2. Search for "checkout.razorpay"
3. Status should be `200` (not 404)

#### Step 3: Clear Cache
- Press `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete`)
- Clear browsing data
- Refresh page
- Try payment again

---

### Issue 4: Payment Verification Failed

**What it means:** Signature verification on backend failed

**Debugging Steps:**

#### Step 1: Check Server Secret Key
In `.env`:
```
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
```

**Is it exactly correct?** (Copy-paste from Razorpay dashboard)

#### Step 2: Check Backend Logs
In Terminal where `npm run dev` is running, look for:
```
Payment verified successfully: pay_xxxxx
// OR
Invalid payment signature for order: order_xxxxx
```

#### Step 3: Verify Signature Calculation
The backend verifies like this:
```javascript
const body = razorpay_order_id + "|" + razorpay_payment_id;
const expectedSignature = crypto
  .createHmac("sha256", RAZORPAY_KEY_SECRET)
  .update(body)
  .digest("hex");
```

If this fails, the `RAZORPAY_KEY_SECRET` is wrong.

#### Step 4: Double-Check Credentials
1. Go to https://dashboard.razorpay.com
2. **Settings → API Keys**
3. Make sure you're in **Test Mode** (not Live)
4. Copy exact Key Secret
5. Update `.env`
6. Restart: Ctrl+C then `npm run dev`

---

### Issue 5: Payment Shows but Then Error

**What it means:** Razorpay modal opened, but after payment got error

**Scenario A: "Payment cancelled"**
- User closed the modal without paying
- Try again with actual payment

**Scenario B: "Payment verification failed"**
- See Issue 4 above (signature verification)

**Scenario C: "Failed to verify payment. Contact support"**
- Check backend logs for error
- Network error between frontend and backend
- Try again in a few moments

---

## Step-by-Step Complete Test

Follow this to test everything from scratch:

### 1. Setup (5 minutes)
```bash
# Get credentials from https://dashboard.razorpay.com
# Settings → API Keys → Copy Key ID and Key Secret (Test mode)
```

### 2. Update .env
```
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Start Server
```bash
npm run dev
# Wait for: "Server running on http://localhost:3000"
```

### 4. Open in Browser
```
http://localhost:3000
```

### 5. Navigate to Premium
- Click "Premium" in navbar
- Scroll to upgrade button

### 6. Open DevTools (F12)
1. Go to **Console** tab
2. Go to **Network** tab
3. Keep both visible

### 7. Click "Initialize Upgrade"
Watch in DevTools:
- **Console**: Should show payment logs
- **Network**: Should show `/api/razorpay/order` request
  - Status: 200
  - Response: JSON with order id

### 8. Complete Payment
- Razorpay modal appears
- Click "Pay"
- Use card: `4111 1111 1111 1111`
- Expiry: `12/25`
- CVV: `123`
- OTP: `123456` (if prompted)

### 9. Verify Success
- Check **Network** tab for `/api/razorpay/verify` request
- Should have Status: 200
- Check **Console** for success message
- Page should redirect to `/dashboard?success=true`
- Check Razorpay dashboard → **Payments** for the transaction

---

## What Each Console Log Means

In browser Console (F12):

```javascript
// Good logs (normal flow):
"Razorpay initiation error: Razorpay SDK not loaded"
// → Script not loaded, refresh page

"Razorpay order created: order_1AVj5i47B9Zp0P"
// → Successfully got order from backend, modal about to open ✅

"Verification error: Failed to verify payment"
// → Signature verification failed, check RAZORPAY_KEY_SECRET

"Payment verified successfully (Firebase update would happen now)"
// → Success! User gets premium access ✅
```

In Terminal (where `npm run dev` runs):

```
Razorpay order created: order_1AVj5i47B9Zp0P
// → Backend successfully created order ✅

Razorpay order error: Razorpay API keys are missing
// → Missing RAZORPAY_KEY_SECRET in .env ❌

Payment verified successfully: pay_1AVj5i47B9Zp0Q
// → Payment signature verified ✅

Invalid payment signature for order: order_1AVj5i47B9Zp0P
// → RAZORPAY_KEY_SECRET is wrong ❌
```

---

## Quick Fixes Checklist

- [ ] `.env` has both `VITE_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- [ ] `npm run dev` is running (terminal shows "Server running on...")
- [ ] Browser can reach `http://localhost:3000`
- [ ] `index.html` has Razorpay script: `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>`
- [ ] Using Test mode credentials (not Live)
- [ ] No error in browser Console (F12)
- [ ] Network request to `/api/razorpay/order` returns Status 200

---

## Emergency Commands

**If everything breaks:**

```bash
# Stop server
Ctrl+C

# Clear everything
rm -rf node_modules package-lock.json
npm install

# Clear browser cache
# Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
# Clear everything

# Restart
npm run dev
```

**Then test again from scratch.**

---

## Getting Help

1. **Check the logs first:**
   - Browser Console (F12)
   - Terminal where `npm run dev` runs
   - Network tab in DevTools

2. **Common fixes:**
   - Restart server: Ctrl+C then `npm run dev`
   - Clear browser cache: Ctrl+Shift+Delete
   - Verify credentials: https://dashboard.razorpay.com

3. **If stuck:**
   - Share screenshots of:
     - .env file (hide secret key)
     - Browser console error
     - Network request response
     - Terminal logs

---

## Production Checklist

Before deploying to Vercel:

- [ ] Test works locally with Test mode credentials
- [ ] Get Production credentials from Razorpay → Live mode
- [ ] Add to Vercel environment variables (NOT code)
- [ ] `.env` in `.gitignore` (don't commit)
- [ ] Remove test code/logs
- [ ] Test on Vercel URL with Production credentials

