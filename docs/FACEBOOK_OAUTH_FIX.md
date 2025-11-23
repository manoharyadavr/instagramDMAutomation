# 🔧 Fix Facebook OAuth Redirect URI Error

## ❌ Current Error
"URL blocked - This redirect failed because the redirect URI is not white-listed in the app's client OAuth settings."

## ✅ Solution

### Step 1: Go to Facebook App Settings

1. Go to: https://developers.facebook.com/apps
2. Select your app: **ManioraDMAutomation** (App ID: 1179532514269250)
3. Click **Settings** → **Basic** (in left sidebar)

### Step 2: Add App Domain

1. Scroll to **"App Domains"** section
2. Click **"Add Domain"**
3. Add: `instagram-dm-automation-sp3b.vercel.app`
   - ⚠️ **NO** `https://`
   - ⚠️ **NO** trailing slash
   - ⚠️ Just the domain: `instagram-dm-automation-sp3b.vercel.app`

### Step 3: Add Valid OAuth Redirect URI

1. Scroll to **"Valid OAuth Redirect URIs"** section
2. Click **"Add URI"**
3. Add this **EXACT** URL:
   ```
   https://instagram-dm-automation-sp3b.vercel.app/api/auth/callback/instagram
   ```
   - ⚠️ Must include `https://`
   - ⚠️ Must include `/api/auth/callback/instagram`
   - ⚠️ **NO** trailing slash
   - ⚠️ **NO** `/route.ts` suffix

### Step 4: Enable OAuth Settings

1. Scroll to **"Facebook Login"** section (or "Facebook Login for Business")
2. Make sure these are **ON**:
   - ✅ **Client OAuth login**: Enabled
   - ✅ **Web OAuth login**: Enabled
   - ✅ **Enforce HTTPS**: Enabled
   - ✅ **Use Strict Mode for redirect URIs**: Enabled (recommended)

### Step 5: Save Changes

1. Click **"Save Changes"** button at the bottom
2. **Wait 2-3 minutes** for changes to propagate

### Step 6: Verify in Redirect URI Validator

1. Scroll to **"Redirect URI Validator"** section
2. Enter: `https://instagram-dm-automation-sp3b.vercel.app/api/auth/callback/instagram`
3. Click **"Check URI"**
4. Should show: ✅ **"This is a valid redirect URI"**

### Step 7: Test Instagram Login

1. Go to: https://instagram-dm-automation-sp3b.vercel.app/auth/login
2. Click **"Continue with Instagram"**
3. Should redirect to Facebook login (not error page)

## 📋 Checklist

- [ ] App Domain added: `instagram-dm-automation-sp3b.vercel.app`
- [ ] Valid OAuth Redirect URI added: `https://instagram-dm-automation-sp3b.vercel.app/api/auth/callback/instagram`
- [ ] Client OAuth login: Enabled
- [ ] Web OAuth login: Enabled
- [ ] Enforce HTTPS: Enabled
- [ ] Changes saved
- [ ] Waited 2-3 minutes
- [ ] URI validator shows valid
- [ ] Tested Instagram login

## 🚨 Common Mistakes

❌ **Wrong**: `https://instagram-dm-automation-sp3b.vercel.app/api/auth/callback/instagram/`
- Has trailing slash

❌ **Wrong**: `https://instagram-dm-automation-sp3b.vercel.app/api/auth/instagram/callback`
- Wrong path (should be `/callback/instagram`, not `/instagram/callback`)

❌ **Wrong**: `instagram-dm-automation-sp3b.vercel.app/api/auth/callback/instagram`
- Missing `https://`

❌ **Wrong**: `https://instagram-dm-automation-sp3b.vercel.app/api/auth/callback/instagram/route.ts`
- Has `/route.ts` suffix

✅ **Correct**: `https://instagram-dm-automation-sp3b.vercel.app/api/auth/callback/instagram`

## 🔍 Why This URL?

NextAuth automatically creates callback routes at:
- Pattern: `/api/auth/callback/[provider-id]`
- Your provider ID: `instagram`
- Full URL: `/api/auth/callback/instagram`

## 📞 Still Not Working?

1. **Double-check the exact URL** - Copy/paste from this guide
2. **Wait longer** - Sometimes takes 5-10 minutes
3. **Clear browser cache** - Try incognito/private window
4. **Check NEXTAUTH_URL** - Should be `https://instagram-dm-automation-sp3b.vercel.app`
5. **Verify App ID/Secret** - In Vercel environment variables

