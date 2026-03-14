# Switch Git identity to Contributor A (huzaifa2964)

# Set Git config locally for this repository
git config user.name "whuzaifa2964"
git config user.email "whuzaifa64@gmail.com"

# Also set environment variables for this PowerShell session
$env:GIT_AUTHOR_NAME = "whuzaifa2964"
$env:GIT_AUTHOR_EMAIL = "whuzaifa64@gmail.com"
$env:GIT_COMMITTER_NAME = "whuzaifa2964"
$env:GIT_COMMITTER_EMAIL = "whuzaifa64@gmail.com"

# Set SSH remote URL to use Contributor A's SSH key
git remote set-url origin git@github-huzaifa:huzaifa2964/taleemkasafar.git

Write-Host ""
Write-Host "✓ Git identity switched to Contributor A" -ForegroundColor Green
Write-Host "  Name:  $(git config user.name)" -ForegroundColor Cyan
Write-Host "  Email: $(git config user.email)" -ForegroundColor Cyan
Write-Host "  SSH:   github-huzaifa (id_ed25519_github_huzaifa)" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now commit and push as Contributor A." -ForegroundColor White
