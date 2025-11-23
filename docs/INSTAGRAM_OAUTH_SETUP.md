# Instagram OAuth Setup Guide

## ⚠️ Important: Meta/Facebook Requires HTTPS

Meta (Facebook/Instagram) **requires HTTPS** for OAuth redirects. Localhost (`http://localhost`) is **not allowed**. You must use **ngrok** or another HTTPS tunnel for local development.

---

## ✅ Solution: Use Ngrok (Recommended)

### Step 1: Install Ngrok

**Option A: Using npm (Global)**
```bash
npm install -g ngrok
```

**Option B: Download from Website**
1. Visit https://ngrok.com
2. Sign up for a free account
3. Download ngrok for Windows
4. Extract and add to PATH, or use from the extracted folder

### Step 1.5: Configure Ngrok Authtoken (REQUIRED)

**Ngrok now requires an authtoken even for free accounts.**

1. **Sign up for a free ngrok account:**
   - Visit https://dashboard.ngrok.com/signup
   - Create a free account (no credit card required)

2. **Get your authtoken:**
   - After signing up, go to https://dashboard.ngrok.com/get-started/your-authtoken
   - Copy your authtoken (it looks like: `2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`)

3. **Install the authtoken:**
   ```bash
   ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
   ```
   
   Replace `YOUR_AUTHTOKEN_HERE` with the authtoken you copied.

4. **Verify it works:**
   ```bash
   ngrok version
   ```
   
   You should see the version without any errors.

### Step 2: Start Your Next.js Dev Server

In one terminal:
```bash
npm run dev
```

Your app should be running on `http://localhost:3000`

### Step 3: Start Ngrok Tunnel

In a **new terminal**, run:
```bash
ngrok http 3000
```

You will get output like:
```
Forwarding   https://8f21-102-67-99-121.ngrok-free.app -> http://localhost:3000
```

**Copy the HTTPS URL** (e.g., `https://8f21-102-67-99-121.ngrok-free.app`)

### Step 4: Update Facebook App Settings

1. Go to [Facebook Developers](https://developers.facebook.com/apps)
2. Select your app (App ID: `1179532514269250`)
3. Go to **Settings** → **Basic**

#### Add App Domain:
- Scroll to **App Domains**
- Add: `8f21-102-67-99-121.ngrok-free.app` (your ngrok domain, **without** `https://`)
- Click **Save Changes**

#### Add Valid OAuth Redirect URI:
- Scroll to **Valid OAuth Redirect URIs**
- Click **Add URI**
- Add: `https://8f21-102-67-99-121.ngrok-free.app/api/auth/instagram/callback`
- Replace `8f21-102-67-99-121.ngrok-free.app` with **your** ngrok domain
- Click **Save Changes**

### Step 5: Update .env File

Update your `.env` file with the ngrok URL:

```env
NEXTAUTH_URL="https://8f21-102-67-99-121.ngrok-free.app"
```

Replace `8f21-102-67-99-121.ngrok-free.app` with **your** ngrok domain.

### Step 6: Restart Your Dev Server

1. Stop your dev server (Ctrl+C)
2. Restart it:
   ```bash
   npm run dev
   ```

### Step 7: Test Instagram Connection

1. Make sure ngrok is still running
2. Go to Dashboard → Instagram Accounts
3. Click "Connect Account"
4. You should be redirected to Facebook login (not the error page)
5. After authorizing, you'll be redirected back to your app

---

## 📝 Quick Reference

### Your Current Configuration

Based on your `.env` file:
- **App ID**: `1179532514269250`
- **App Secret**: `29b43fe7be13b154467c820372ad3929`
- **Redirect URI**: `https://YOUR-NGROK-DOMAIN.ngrok-free.app/api/auth/instagram/callback`
- **NEXTAUTH_URL**: `https://YOUR-NGROK-DOMAIN.ngrok-free.app`

### Required Facebook App Settings

1. **App Domains**: `YOUR-NGROK-DOMAIN.ngrok-free.app` (no https://)
2. **Valid OAuth Redirect URIs**: `https://YOUR-NGROK-DOMAIN.ngrok-free.app/api/auth/instagram/callback`

---

## 🔧 Ngrok Tips

### Free ngrok URLs Change Each Time

**Problem**: Free ngrok URLs change every time you restart ngrok.

**Solution**: 
- Use ngrok's free static domain feature (requires account)
- Or update Facebook App settings each time you get a new URL
- Or use ngrok authtoken for persistent domains

### Get Persistent ngrok Domain

1. Sign up at https://ngrok.com
2. Get your authtoken from dashboard
3. Run: `ngrok config add-authtoken YOUR_AUTH_TOKEN`
4. Use reserved domains (paid feature) or update settings each time

### Keep ngrok Running

- Keep the ngrok terminal window open while developing
- If ngrok stops, you'll need to:
  1. Get the new ngrok URL
  2. Update Facebook App settings
  3. Update `.env` file
  4. Restart dev server

---

## 🚀 Production Setup

For production, use your actual domain:

1. **App Domains**: `yourdomain.com`
2. **Valid OAuth Redirect URIs**: `https://yourdomain.com/api/auth/instagram/callback`
3. **NEXTAUTH_URL**: `https://yourdomain.com`

---

## ⚙️ Configure Instagram Product

1. Go to **Products** in Facebook App dashboard
2. Find **Instagram** and click **Set Up**
3. Make sure **Instagram Graph API** is enabled (required for Business accounts)
4. Configure required permissions

### Required Permissions

Make sure your app requests these permissions:
- `instagram_basic`
- `instagram_manage_comments`
- `instagram_manage_messages`
- `pages_show_list`
- `pages_read_engagement`
- `business_management`

---

## 🐛 Troubleshooting

### Error: "Can't load URL - The domain of this URL isn't included in the app's domains"

**Solution:**
1. Make sure ngrok is running
2. Copy your ngrok HTTPS URL
3. Add the domain (without https://) to **App Domains** in Facebook App settings
4. Add the full callback URL to **Valid OAuth Redirect URIs**
5. Wait 2-3 minutes for changes to propagate
6. Restart your dev server

### Error: "Invalid redirect_uri"

**Solution:**
- Make sure the redirect URI in Facebook App settings matches exactly: `https://YOUR-NGROK-DOMAIN.ngrok-free.app/api/auth/instagram/callback`
- Check that `NEXTAUTH_URL` in `.env` matches your ngrok URL
- Ensure ngrok is still running
- Restart your dev server after updating `.env`

### Error: "ngrok URL changed"

**Solution:**
- Free ngrok URLs change on restart
- Update Facebook App settings with the new URL
- Update `.env` file
- Restart dev server

### Error: "Session expired" or redirects to login

**Solution:**
- Make sure you're accessing the app via the ngrok URL, not localhost
- Update `NEXTAUTH_URL` in `.env` to match ngrok URL
- Clear browser cookies and try again

---

## ✅ Verification Checklist

Before testing Instagram connection:

- [ ] Ngrok is installed and running
- [ ] Dev server is running on port 3000
- [ ] Ngrok is forwarding to localhost:3000
- [ ] `.env` file has `NEXTAUTH_URL` set to ngrok HTTPS URL
- [ ] Facebook App has ngrok domain in **App Domains**
- [ ] Facebook App has callback URL in **Valid OAuth Redirect URIs**
- [ ] Instagram product is set up in Facebook App
- [ ] Required permissions are configured
- [ ] Dev server was restarted after updating `.env`

---

## 📚 Additional Resources

- [Ngrok Documentation](https://ngrok.com/docs)
- [Facebook App Settings](https://developers.facebook.com/apps)
- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
