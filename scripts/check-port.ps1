# PowerShell script to check and kill processes on ports 3000 and 3001

Write-Host "Checking ports 3000 and 3001..." -ForegroundColor Cyan

# Check port 3000
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    $processId = $port3000 | Select-Object -ExpandProperty OwningProcess -First 1
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    Write-Host "Port 3000 is in use by process $processId ($($process.ProcessName))" -ForegroundColor Yellow
    $kill = Read-Host "Kill this process? (y/n)"
    if ($kill -eq 'y') {
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Write-Host "Process killed." -ForegroundColor Green
    }
} else {
    Write-Host "Port 3000 is free" -ForegroundColor Green
}

# Check port 3001
$port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($port3001) {
    $processId = $port3001 | Select-Object -ExpandProperty OwningProcess -First 1
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    Write-Host "Port 3001 is in use by process $processId ($($process.ProcessName))" -ForegroundColor Yellow
    $kill = Read-Host "Kill this process? (y/n)"
    if ($kill -eq 'y') {
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Write-Host "Process killed." -ForegroundColor Green
    }
} else {
    Write-Host "Port 3001 is free" -ForegroundColor Green
}

# Clean Next.js lock file
if (Test-Path ".next\dev\lock") {
    Write-Host "Removing Next.js lock file..." -ForegroundColor Yellow
    Remove-Item -Path ".next\dev\lock" -Force -ErrorAction SilentlyContinue
    Write-Host "Lock file removed." -ForegroundColor Green
}

Write-Host "`nDone! You can now run 'npm run dev'" -ForegroundColor Green



