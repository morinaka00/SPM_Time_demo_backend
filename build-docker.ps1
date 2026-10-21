param(
    [string]$Tag = "0.1.0",
    [string]$ImageName = "spm-time-backend-demo"
)

$FullImage = "${ImageName}:${Tag}"
$TarFile   = "${ImageName}-${Tag}.tar"

Write-Host "==> Building Docker image: $FullImage" -ForegroundColor Cyan
docker build -t $FullImage .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed." -ForegroundColor Red
    exit 1
}

Write-Host "==> Exporting image to $TarFile ..." -ForegroundColor Cyan
docker save -o $TarFile $FullImage
if ($LASTEXITCODE -ne 0) {
    Write-Host "Export failed." -ForegroundColor Red
    exit 1
}

$SizeMB = [math]::Round((Get-Item $TarFile).Length / 1MB, 1)
Write-Host "==> Done: $TarFile ($SizeMB MB)" -ForegroundColor Green
Write-Host ""
Write-Host "Next, on the server:" -ForegroundColor Yellow
Write-Host "  docker load -i $TarFile"
Write-Host "  docker compose up -d"
