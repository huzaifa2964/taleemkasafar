# Quick check: Who am I currently set as?

Write-Host ""
Write-Host "=== Current Git Identity ===" -ForegroundColor Yellow
Write-Host "Name:  $(git config user.name)" -ForegroundColor Cyan
Write-Host "Email: $(git config user.email)" -ForegroundColor Cyan
Write-Host ""

$currentUser = git config user.name
if ($currentUser -eq "whuzaifa2964") {
    Write-Host "You are currently: Contributor A (whuzaifa2964)" -ForegroundColor Green
    Write-Host "When pushing, use whuzaifa2964's GitHub account" -ForegroundColor White
} elseif ($currentUser -eq "salah-ul-din") {
    Write-Host "You are currently: Contributor B (salah-ul-din)" -ForegroundColor Green
    Write-Host "When pushing, use salah-ul-din's GitHub account" -ForegroundColor White
} else {
    Write-Host "⚠️  Unknown contributor" -ForegroundColor Red
    Write-Host "Run switch-to-A.ps1 or switch-to-B.ps1 to set identity" -ForegroundColor Yellow
}
Write-Host ""
