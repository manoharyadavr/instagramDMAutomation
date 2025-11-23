# Troubleshooting Guide

## Port Already in Use

### Issue: "Port 3000 is in use by process XXXX"

**Solution 1: Kill the process (Windows PowerShell)**
```powershell
# Find and kill process on port 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

**Solution 2: Use the helper script**
```powershell
.\scripts\check-port.ps1
```

**Solution 3: Use a different port**
If you need to use port 3001:
1. Update ngrok: `ngrok http 3001`
2. Update `.env`: `NEXTAUTH_URL="https://YOUR-NGROK-DOMAIN.ngrok-free.app"`
3. Update Facebook App settings with the new callback URL

---

## Next.js Lock File Error

### Issue: "Unable to acquire lock at .next/dev/lock"

**Solution:**
```powershell
# Remove the lock file
Remove-Item -Path ".next\dev\lock" -Force
```

Or use the helper script:
```powershell
.\scripts\check-port.ps1
```

---

## Ngrok Setup Issues

### Issue: Ngrok URL keeps changing

**Solution:**
- Free ngrok URLs change each restart
- Update Facebook App settings each time
- Or use ngrok authtoken for persistent domains (requires account)

### Issue: "Can't load URL - domain not included"

**Solution:**
1. Make sure ngrok is running
2. Copy your ngrok HTTPS URL
3. Add domain (without https://) to Facebook App Domains
4. Add full callback URL to Valid OAuth Redirect URIs
5. Wait 2-3 minutes for changes to propagate

---

## Database Connection Issues

### Issue: "Authentication failed against database server"

**Solution:**
1. Check MySQL is running: `docker-compose -f infra/docker-compose.dev.yml up -d`
2. Verify DATABASE_URL in `.env`
3. Test connection: `npm run db:test`
4. Create database if needed: `npm run db:create`

---

## Session/Auth Issues

### Issue: "Access Denied" or redirects to login

**Solution:**
1. Make sure `NEXTAUTH_URL` matches your current URL (ngrok or localhost)
2. Clear browser cookies
3. Restart dev server after changing `.env`
4. Check `NEXTAUTH_SECRET` is set

---

## Quick Fixes

### Clear Next.js cache
```powershell
Remove-Item -Path ".next" -Recurse -Force
npm run dev
```

### Reset database
```powershell
npm run db:migrate
```

### Check all services
```powershell
# Check MySQL
docker ps

# Check Redis (if using)
redis-cli ping

# Check ports
netstat -ano | findstr :3000
netstat -ano | findstr :3306
```



