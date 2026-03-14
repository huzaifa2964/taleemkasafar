# Check current Git identity and SSH configuration

Write-Host ""
Write-Host "=== Current Git Identity ===" -ForegroundColor Yellow
Write-Host "Repository config (local):" -ForegroundColor Cyan
$localName = git config --local user.name
$localEmail = git config --local user.email
if ($localName) {
    Write-Host "  Name:  $localName" -ForegroundColor White
    Write-Host "  Email: $localEmail" -ForegroundColor White
} else {
    Write-Host "  (none set locally, using global)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Global config:" -ForegroundColor Cyan
Write-Host "  Name:  $(git config --global user.name)" -ForegroundColor White
Write-Host "  Email: $(git config --global user.email)" -ForegroundColor White

Write-Host ""
Write-Host "Effective config (what will be used):" -ForegroundColor Cyan
Write-Host "  Name:  $(git config user.name)" -ForegroundColor Green
Write-Host "  Email: $(git config user.email)" -ForegroundColor Green

Write-Host ""
Write-Host "=== Environment Variables ===" -ForegroundColor Yellow
if ($env:GIT_AUTHOR_NAME) {
    Write-Host "  GIT_AUTHOR_NAME:     $env:GIT_AUTHOR_NAME" -ForegroundColor White
    Write-Host "  GIT_AUTHOR_EMAIL:    $env:GIT_AUTHOR_EMAIL" -ForegroundColor White
    Write-Host "  GIT_COMMITTER_NAME:  $env:GIT_COMMITTER_NAME" -ForegroundColor White
    Write-Host "  GIT_COMMITTER_EMAIL: $env:GIT_COMMITTER_EMAIL" -ForegroundColor White
} else {
    Write-Host "  (none set)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Remote Configuration ===" -ForegroundColor Yellow
$remoteUrl = git remote get-url origin
Write-Host "  Origin: $remoteUrl" -ForegroundColor White

if ($remoteUrl -match "github-huzaifa") {
    Write-Host "  → Using Contributor A's SSH key" -ForegroundColor Green
} elseif ($remoteUrl -match "github-contributorB") {
    Write-Host "  → Using Contributor B's SSH key" -ForegroundColor Green
} elseif ($remoteUrl -match "https://") {
    Write-Host "  → Using HTTPS (not configured for SSH yet)" -ForegroundColor Yellow
} else {
    Write-Host "  → Unknown configuration" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Last 3 Commits ===" -ForegroundColor Yellow
git log --oneline --format="%h %an <%ae> - %s" -3

Write-Host ""
