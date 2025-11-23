# 🚀 Quick Start: Instagram OAuth with Ngrok

## Why Ngrok?

Meta (Facebook/Instagram) **requires HTTPS** for OAuth. Localhost won't work. Use ngrok to create an HTTPS tunnel.

---

## ⚡ Quick Setup (5 minutes)

### 1. Install Ngrok
```bash
npm install -g ngrok
```

### 1.5. Configure Ngrok Authtoken (REQUIRED)

Ngrok requires an authtoken even for free accounts:

1. **Sign up:** https://dashboard.ngrok.com/signup (free, no credit card)
2. **Get authtoken:** https://dashboard.ngrok.com/get-started/your-authtoken
3. **Install authtoken:**
   ```bash
   ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
   ```

### 2. Start Your App (MUST BE FIRST!)
```bash
npm run dev
```

**Wait until you see:** `✓ Ready` and `○ Local: http://localhost:3000`

**⚠️ IMPORTANT:** Your dev server MUST be running before starting ngrok!

### 3. Start Ngrok (New Terminal)
```bash
ngrok http 3000
```

**If you get error `ERR_NGROK_8012`:** Your dev server isn't running. Go back to step 2!

You'll see:
```
Forwarding   https://abc123.ngrok-free.app -> http://localhost:3000
```

### 4. Copy Your Ngrok URL
Copy the HTTPS URL: `https://abc123.ngrok-free.app`

### 5. Update .env
Change this line:
```env
NEXTAUTH_URL="https://abc123.ngrok-free.app"
```

### 6. Update Facebook App

Go to: https://developers.facebook.com/apps/1179532514269250/settings/basic/

**App Domains:**
- Add: `abc123.ngrok-free.app` (no https://)

**Valid OAuth Redirect URIs:**
- Add: `https://abc123.ngrok-free.app/api/auth/instagram/callback`

Click **Save Changes**

### 7. Restart Dev Server
```bash
# Stop (Ctrl+C) and restart
npm run dev
```

### 8. Access via Ngrok
Open: `https://abc123.ngrok-free.app` (NOT localhost!)

---

## ✅ Checklist

- [ ] Ngrok installed
- [ ] Dev server running on port 3000
- [ ] Ngrok running and forwarding to localhost:3000
- [ ] Copied ngrok HTTPS URL
- [ ] Updated `NEXTAUTH_URL` in `.env`
- [ ] Added ngrok domain to Facebook App Domains
- [ ] Added callback URL to Facebook Valid OAuth Redirect URIs
- [ ] Restarted dev server
- [ ] Accessing app via ngrok URL (not localhost)

---

## ⚠️ Important Notes

1. **Keep ngrok running** - Don't close the ngrok terminal
2. **Free ngrok URLs change** - Update settings each time you restart ngrok
3. **Always use ngrok URL** - Never use localhost for Instagram OAuth
4. **Wait 2-3 minutes** - After updating Facebook App settings

---

## 📚 Full Documentation

See `docs/INSTAGRAM_OAUTH_SETUP.md` for detailed instructions.

