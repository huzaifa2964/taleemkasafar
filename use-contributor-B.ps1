# Switch Git identity to Contributor B

# IMPORTANT: Update these values with Contributor B's actual GitHub details
$CONTRIBUTOR_B_NAME = "contributorB-github-username"  # TODO: Replace with actual username
$CONTRIBUTOR_B_EMAIL = "contributorB@example.com"     # TODO: Replace with actual email

# Set Git config locally for this repository
git config user.name "$CONTRIBUTOR_B_NAME"
git config user.email "$CONTRIBUTOR_B_EMAIL"

# Also set environment variables for this PowerShell session
$env:GIT_AUTHOR_NAME = $CONTRIBUTOR_B_NAME
$env:GIT_AUTHOR_EMAIL = $CONTRIBUTOR_B_EMAIL
$env:GIT_COMMITTER_NAME = $CONTRIBUTOR_B_NAME
$env:GIT_COMMITTER_EMAIL = $CONTRIBUTOR_B_EMAIL

# Set SSH remote URL to use Contributor B's SSH key
git remote set-url origin git@github-contributorB:huzaifa2964/taleemkasafar.git

Write-Host ""
Write-Host "✓ Git identity switched to Contributor B" -ForegroundColor Green
Write-Host "  Name:  $(git config user.name)" -ForegroundColor Cyan
Write-Host "  Email: $(git config user.email)" -ForegroundColor Cyan
Write-Host "  SSH:   github-contributorB (id_ed25519_github_contributorB)" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now commit and push as Contributor B." -ForegroundColor White
Write-Host ""
Write-Host "REMINDER: After pushing, run 'use-contributor-A.ps1' to switch back." -ForegroundColor Yellow
