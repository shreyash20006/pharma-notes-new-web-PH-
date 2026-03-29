# Firebase Google Authentication Setup Guide

## 🚀 Overview

This guide explains how to configure Firebase Google Authentication for your production domain `notesdrive.shop`. The application uses the **redirect-based authentication flow** instead of popup-based authentication to avoid unauthorized-domain errors.

---

## 🔧 Required Firebase Console Configuration

To fix the `auth/unauthorized-domain` error on your production domain, follow these steps:

### Step 1: Access Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **gen-lang-client**
3. Navigate to **Authentication** → **Settings**

### Step 2: Add Authorized JavaScript Origins

Under the **Authorized JavaScript origins** section, add:

```
https://www.notesdrive.shop
https://notesdrive.shop
http://localhost:3000
http://localhost:5173
```

**Why these domains?**
- `https://www.notesdrive.shop` - Production domain (www)
- `https://notesdrive.shop` - Production domain (without www)
- `http://localhost:3000` - Development testing
- `http://localhost:5173` - Vite dev server default port

### Step 3: Add Authorized Redirect URIs

Under the **Authorized redirect URIs** section, add:

```
https://www.notesdrive.shop/auth
https://notesdrive.shop/auth
http://localhost:3000/auth
http://localhost:5173/auth
```

**Why?**
- These are the exact redirect URLs where users will be returned after Google authentication
- The `/auth` path is where your Auth component is located

### Step 4: Verify Google OAuth Consent Screen

1. Navigate to **OAuth consent screen** in the left sidebar
2. Ensure your app is in **Production** status (not Testing)
3. Add required scopes:
   - `openid`
   - `email`
   - `profile`

### Step 5: Add Test Users (Optional)

If using a Test app, add your email to the test users list:
1. Go to **OAuth consent screen** → **Test users**
2. Click **Add users**
3. Add your email address

---

## 📋 Implementation Details

### File: `src/lib/firebase.ts`

Key features of the updated Firebase configuration:

```typescript
// Initialize database
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Configure Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account', // Force account selection
});

// Enable device language support
auth.useDeviceLanguage();

// Enable session persistence
setPersistence(auth, browserLocalPersistence);
```

#### Main Functions:

1. **`signInWithGoogle()`**
   - Initiates redirect to Google Sign-In
   - User is sent to Google, then redirected back to `/auth` page
   - Does NOT return until user completes authentication

2. **`handleRedirectResult()`**
   - Called on the Auth page to process redirect result
   - Returns user object if authentication was successful
   - Handles 6+ specific Firebase error codes with detailed messages
   - Must be called on every page load to check for redirect results

3. **`onAuthStateChange(callback)`**
   - Listens to Firebase auth state changes
   - Useful for checking if user is already logged in
   - Session persists across page refreshes due to `browserLocalPersistence`

4. **`getCurrentUser()`**
   - Gets the currently authenticated user object
   - Returns `null` if no user is logged in

5. **`isUserAuthenticated()`**
   - Boolean helper to check if user is logged in
   - Returns `true` or `false`

### File: `src/pages/Auth.tsx`

Updated authentication flow:

```typescript
// Check for redirect result on component mount
useEffect(() => {
  const handleAuthFlow = async () => {
    // 1. Check if user already authenticated
    if (isUserAuthenticated()) {
      navigate('/dashboard');
      return;
    }

    // 2. Check for Google redirect result
    const result = await handleRedirectResult();
    if (result?.user) {
      navigate('/dashboard');
    }
  };

  handleAuthFlow();
}, [navigate]);

// Listen to auth state changes globally
useEffect(() => {
  const unsubscribe = onAuthStateChange((user) => {
    if (user) navigate('/dashboard');
  });
  return () => unsubscribe();
}, [navigate]);
```

#### Error Handling:

- **auth/unauthorized-domain**: Domain not whitelisted in Firebase Console
- **auth/account-exists-with-different-credential**: Email already registered
- **auth/network-request-failed**: No internet connection
- **auth/popup-closed-by-user**: User closed authentication window
- **auth/operation-not-supported-in-this-environment**: Browser incompatibility

---

## 🔐 Security Notes

✅ **Secure Practices:**
- Google Sign-In uses OAuth 2.0 redirect flow
- Session stored in browser's local storage (not exposed to backend)
- Firebase handles all token management securely
- Secrets never exposed to frontend

⚠️ **Important:**
- Never expose `RAZORPAY_KEY_SECRET` in frontend code (server-side only)
- Email/password credentials handled by Supabase (not Firebase)
- Always use HTTPS in production

---

## 🧪 Testing

### Local Development

```bash
npm run dev
```

1. Open `http://localhost:3000/auth`
2. Click **"Continue with Google"** button
3. Sign in with your Google account
4. You should be redirected to `/dashboard`
5. Check browser console for detailed logs

### Production Testing

1. Update your DNS to point `notesdrive.shop` to your Vercel deployment
2. Open `https://www.notesdrive.shop/auth`
3. Complete the authentication flow
4. Verify you're logged in on `/dashboard`

### Debugging

Check browser console for logs:

```
✓ Auth state changed - User is signed in: user@example.com
✓ Google Sign-In redirect initiated
🔄 Checking for redirect result from Google...
✓ Google Sign-In successful - user@example.com
```

---

## 🐛 Troubleshooting

### Issue: "auth/unauthorized-domain" error

**Solution:**
1. Verify domain is in Firebase Console (Settings → Authorized JavaScript origins)
2. Clear browser cookies and cache
3. Try in an incognito/private window
4. Restart development server: `npm run dev`

### Issue: Redirect loop (keeps redirecting to auth page)

**Solution:**
1. Check if user is already authenticated with `isUserAuthenticated()`
2. Add conditional check before redirect:
   ```typescript
   if (isUserAuthenticated()) {
     navigate('/dashboard');
     return;
   }
   ```

### Issue: Session not persisting after refresh

**Solution:**
- Ensure `browserLocalPersistence` is enabled in `firebase.ts`
- Check that cookies are allowed in browser settings
- Verify browser has local storage enabled

### Issue: "account-exists-with-different-credential"

**Solution:**
- This email is registered with a different auth method
- User can:
  - Sign in with the original method (email/password)
  - Create a new account with a different email
  - Contact support to merge accounts

---

## 📱 Environment Variables

### Required in `.env`:

```env
# Firebase configuration is in firebase-applet-config.json
# No Firebase config needed in .env (it's public JSON)

# Other required variables:
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
VITE_RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
GEMINI_API_KEY=your-gemini-key
```

---

## 🚀 Deployment to Vercel

### Step 1: Add Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all variables from `.env` (except Firebase which is public)

### Step 2: Ensure Domains are Configured

1. Go to Settings → Domains
2. Add both `notesdrive.shop` and `www.notesdrive.shop`
3. Verify DNS configuration

### Step 3: Redeploy

```bash
git push origin master
```

Vercel will automatically redeploy with your changes.

---

## 🔗 Useful Links

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Google Sign-In Integration](https://firebase.google.com/docs/auth/web/google-signin)
- [Firebase Error Codes](https://firebase.google.com/docs/auth/handle-errors)
- [Vercel Deployment Docs](https://vercel.com/docs)

---

## ✅ Checklist

- [ ] Added domains to Firebase Console Authorized JavaScript origins
- [ ] Added domains to Firebase Console Authorized redirect URIs
- [ ] Verified Firebase OAuth consent screen
- [ ] Tested Google Sign-In locally
- [ ] Added environment variables to Vercel
- [ ] Deployed to Vercel with `npm run build`
- [ ] Tested Google Sign-In on production domain
- [ ] Verified session persists after page refresh

---

## 📞 Support

If you encounter issues:

1. Check browser console for error codes
2. Verify Firebase Console configuration matches this guide
3. Clear browser cache and cookies
4. Try in an incognito window
5. Check that domain SSL certificate is valid (HTTPS only)

---

**Last Updated:** March 29, 2026  
**Auth Method:** Firebase Google Sign-In with Redirect Flow  
**Production Domain:** notesdrive.shop
