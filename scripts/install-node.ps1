# install-node.ps1
# Run in PowerShell as Administrator.
# Checks for node, tries to install Node LTS with winget if missing,
# then runs npm install and npm run eval in the project root.

$ErrorActionPreference = 'Stop'

function Test-Node {
    try {
        $v = & node -v 2>$null
        return $true
    } catch {
        return $false
    }
}

function Test-Winget {
    try {
        & winget --version > $null 2>&1
        return $true
    } catch {
        return $false
    }
}

if (Test-Node) {
    Write-Host "Node is already installed:" -ForegroundColor Green
    & node -v
    & npm -v
} else {
    Write-Host "Node not found on PATH." -ForegroundColor Yellow
    if (Test-Winget) {
        Write-Host "winget found — attempting to install Node LTS..." -ForegroundColor Cyan
        try {
            winget install --id OpenJS.NodeJS.LTS -e --silent
            Write-Host "winget install completed. You may need to restart the shell." -ForegroundColor Green
        } catch {
            Write-Host "winget installation failed: $_" -ForegroundColor Red
            Write-Host "Please install Node from https://nodejs.org/en/download/" -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host "winget not available. Please install Node manually from:" -ForegroundColor Yellow
        Write-Host "https://nodejs.org/en/download/" -ForegroundColor Cyan
        exit 1
    }
}

# Reload environment for the current shell if possible
Write-Host "Refreshing environment and verifying Node..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

if (-not (Test-Node)) {
    Write-Host "Node still not found. Please close and reopen PowerShell, then re-run this script." -ForegroundColor Red
    exit 1
}

# Run project setup
Write-Host "Installing project dependencies and running eval..." -ForegroundColor Cyan
npm install
npm run eval

Write-Host "Done. If eval produced eval_report.md check the file in project root." -ForegroundColor Green
