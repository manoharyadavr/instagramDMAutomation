# Quick Start: Ngrok for Instagram OAuth

## Step-by-Step Instructions

### 1. Install Ngrok

```bash
npm install -g ngrok
```

Or download from: https://ngrok.com/download

### 1.5. Configure Ngrok Authtoken (REQUIRED)

**Ngrok requires an authtoken even for free accounts.**

1. **Sign up:** https://dashboard.ngrok.com/signup (free, no credit card)
2. **Get authtoken:** https://dashboard.ngrok.com/get-started/your-authtoken
3. **Install authtoken:**
   ```bash
   ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
   ```

**Important:** You must do this step before using ngrok!

### 2. Start Your App (MUST BE FIRST!)

**⚠️ IMPORTANT: Start your dev server BEFORE starting ngrok!**

Terminal 1:
```bash
npm run dev
```

**Wait until you see:**
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

**Only then proceed to step 3!**

### 3. Start Ngrok (After Dev Server is Running)

**Open a NEW terminal** (Terminal 2):
```bash
ngrok http 3000
```

**If you get error `ERR_NGROK_8012`:**
- This means your dev server is NOT running
- Go back to step 2 and start `npm run dev` first
- Wait for it to be ready, then start ngrok again

### 4. Copy Your Ngrok URL

You'll see something like:
```
Forwarding   https://abc123.ngrok-free.app -> http://localhost:3000
```

Copy the HTTPS URL: `https://abc123.ngrok-free.app`

### 5. Update .env

Change this line in `.env`:
```env
NEXTAUTH_URL="https://abc123.ngrok-free.app"
```

### 6. Update Facebook App

1. Go to: https://developers.facebook.com/apps/1179532514269250/settings/basic/
2. **App Domains**: Add `abc123.ngrok-free.app` (no https://)
3. **Valid OAuth Redirect URIs**: Add `https://abc123.ngrok-free.app/api/auth/instagram/callback`
4. Save changes

### 7. Restart Dev Server

Stop and restart:
```bash
npm run dev
```

### 8. Access via Ngrok URL

Open in browser: `https://abc123.ngrok-free.app`

**Important**: Always use the ngrok URL, not localhost!

---

## ⚠️ Important Notes

- Keep ngrok running in a separate terminal
- Free ngrok URLs change each restart - update settings each time
- Always use the HTTPS ngrok URL, never localhost
- Wait 2-3 minutes after updating Facebook App settings

