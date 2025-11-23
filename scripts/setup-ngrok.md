# Ngrok Setup Guide

## ⚠️ Important: Ngrok Requires Authtoken

Ngrok now requires a verified account and authtoken, even for free usage.

---

## Step-by-Step Setup

### 1. Sign Up for Ngrok (Free)

1. Visit: https://dashboard.ngrok.com/signup
2. Sign up with email (free account, no credit card required)
3. Verify your email

### 2. Get Your Authtoken

1. After signing up, go to: https://dashboard.ngrok.com/get-started/your-authtoken
2. You'll see your authtoken (looks like: `2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`)
3. **Copy the authtoken**

### 3. Install the Authtoken

Open PowerShell or Command Prompt and run:

```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

Replace `YOUR_AUTHTOKEN_HERE` with the authtoken you copied.

**Example:**
```bash
ngrok config add-authtoken 2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

### 4. Verify Setup

Test that ngrok is configured correctly:

```bash
ngrok version
```

You should see the version number without any errors.

### 5. Start Ngrok

Once configured, you can start ngrok:

```bash
ngrok http 3000
```

Or use the npm script:

```bash
npm run ngrok
```

---

## Troubleshooting

### Error: "authentication failed: Usage of ngrok requires a verified account and authtoken"

**Solution:**
- Make sure you've signed up at https://dashboard.ngrok.com/signup
- Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken
- Run: `ngrok config add-authtoken YOUR_AUTHTOKEN`

### Error: "command not found: ngrok"

**Solution:**
- Install ngrok: `npm install -g ngrok`
- Or download from https://ngrok.com/download and add to PATH

### Authtoken Not Working

**Solution:**
- Make sure you copied the entire authtoken (it's long)
- Try running the command again: `ngrok config add-authtoken YOUR_AUTHTOKEN`
- Check that you're signed in to ngrok dashboard

---

## Next Steps

After setting up ngrok:

1. Start your dev server: `npm run dev`
2. Start ngrok: `ngrok http 3000`
3. Copy your ngrok HTTPS URL
4. Update `.env` with the ngrok URL
5. Update Facebook App settings

See `docs/INSTAGRAM_OAUTH_SETUP.md` for complete instructions.



