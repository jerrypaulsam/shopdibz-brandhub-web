# --- CONFIGURATION ---
$EC2_HOST = "13.206.245.53"
$EC2_USER = "ubuntu"
$KEY_PATH = "C:\Users\jerry\.ssh\seller_hub_web.pem"
$APP_DIR = "/home/ubuntu/shopdibz-brandhub"
$PM2_APP_NAME = "shopdibz-brandhub"
$SSH_TARGET = "$($EC2_USER)@$($EC2_HOST)"
$EXPECTED_NODE_MAJOR = "22"
$REMOTE_NVM_DIR = "/home/$EC2_USER/.nvm"
$REMOTE_NODE_BOOTSTRAP = "test -s $REMOTE_NVM_DIR/nvm.sh && . $REMOTE_NVM_DIR/nvm.sh && nvm use 22 > /dev/null 2>&1"

Write-Host "--- STARTING SHOPDIBZ BRAND HUB DEPLOYMENT ---" -ForegroundColor Yellow

# --- STEP 0: VERSION CHECK ---
$LOCAL_NODE_VERSION = (node -v).Trim()
$LOCAL_NPM_VERSION = (npm -v).Trim()

Write-Host "Local Node: $LOCAL_NODE_VERSION" -ForegroundColor DarkCyan
Write-Host "Local npm: $LOCAL_NPM_VERSION" -ForegroundColor DarkCyan

if (-not $LOCAL_NODE_VERSION.StartsWith("v$EXPECTED_NODE_MAJOR.")) {
  Write-Host "Expected local Node.js major version $EXPECTED_NODE_MAJOR.x but found $LOCAL_NODE_VERSION" -ForegroundColor Red
  exit 1
}

$REMOTE_NODE_VERSION = (ssh -i "$KEY_PATH" $SSH_TARGET "bash -lc '$REMOTE_NODE_BOOTSTRAP; node -v'").Trim()
$REMOTE_NPM_VERSION = (ssh -i "$KEY_PATH" $SSH_TARGET "bash -lc '$REMOTE_NODE_BOOTSTRAP; npm -v'").Trim()

Write-Host "Remote Node: $REMOTE_NODE_VERSION" -ForegroundColor DarkCyan
Write-Host "Remote npm: $REMOTE_NPM_VERSION" -ForegroundColor DarkCyan

if ($LASTEXITCODE -ne 0) {
  Write-Host "Unable to verify remote Node/npm versions" -ForegroundColor Red
  exit 1
}

if (-not $REMOTE_NODE_VERSION.StartsWith("v$EXPECTED_NODE_MAJOR.")) {
  Write-Host "Expected remote Node.js major version $EXPECTED_NODE_MAJOR.x but found $REMOTE_NODE_VERSION" -ForegroundColor Red
  exit 1
}

# --- STEP 1: LOCAL BUILD ---
Write-Host "Building project..." -ForegroundColor Cyan
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "deploy_brandhub.zip") { Remove-Item -Force "deploy_brandhub.zip" }

npm run build
if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed" -ForegroundColor Red
  exit 1
}

if (!(Test-Path ".next\standalone")) {
  Write-Host ".next\\standalone not found. Enable standalone output before using this deploy script." -ForegroundColor Red
  exit 1
}

Write-Host "Organizing standalone files..." -ForegroundColor Cyan
if (!(Test-Path "public")) {
  New-Item -ItemType Directory -Force -Path "public" | Out-Null
}

New-Item -ItemType Directory -Force -Path ".next\standalone\public" | Out-Null
New-Item -ItemType Directory -Force -Path ".next\standalone\.next\static" | Out-Null

Copy-Item -Path "public\*" -Destination ".next\standalone\public" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path ".next\static\*" -Destination ".next\standalone\.next\static" -Recurse -Force

Write-Host "Packaging deploy archive..." -ForegroundColor Cyan
Push-Location ".next\standalone"
tar -acf ..\..\deploy_brandhub.zip *
Pop-Location

# --- STEP 2: UPLOAD ---
Write-Host "Uploading code and environment variables..." -ForegroundColor Cyan
ssh -i "$KEY_PATH" $SSH_TARGET "mkdir -p $APP_DIR"
scp -i "$KEY_PATH" deploy_brandhub.zip "$($SSH_TARGET):/home/$($EC2_USER)/deploy_brandhub.zip"

if (Test-Path ".env") {
  scp -i "$KEY_PATH" .env "$($SSH_TARGET):$APP_DIR/.env"
}

if (Test-Path ".env.local") {
  scp -i "$KEY_PATH" .env.local "$($SSH_TARGET):$APP_DIR/.env.local"
}

if ($LASTEXITCODE -ne 0) {
  Write-Host "Upload failed" -ForegroundColor Red
  exit 1
}

# --- STEP 3: REMOTE EXECUTION ---
Write-Host "Restarting Server..." -ForegroundColor Cyan

$COMMANDS = @(
  "$REMOTE_NODE_BOOTSTRAP",
  "sudo mkdir -p $APP_DIR",
  "cd $APP_DIR",
  "pm2 stop $PM2_APP_NAME > /dev/null 2>&1",
  "sudo rm -rf .next public node_modules server.js package.json package-lock.json",
  "unzip -o ~/deploy_brandhub.zip -d . > /dev/null",
  "sudo chown -R ubuntu:ubuntu .",
  "pm2 delete $PM2_APP_NAME > /dev/null 2>&1",
  "pm2 start server.js --name '$PM2_APP_NAME'"
)

$CLEAN_COMMANDS = $COMMANDS -join "; "
ssh -i "$KEY_PATH" $SSH_TARGET "bash -lc ""$CLEAN_COMMANDS"""

if ($LASTEXITCODE -ne 0) {
  Write-Host "Remote deployment failed" -ForegroundColor Red
  exit 1
}

Write-Host "-------------------------------------------"
Write-Host "Shopdibz Brand Hub deployed successfully!" -ForegroundColor Green
Write-Host "Check it at: https://brandhub.shopdibz.com"
Write-Host "-------------------------------------------"
