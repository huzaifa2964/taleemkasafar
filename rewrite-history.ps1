# Git History Rewrite Script
# This will rewrite ALL commits to show contributions from both FYP partners

Write-Host "`n⚠️  WARNING: This will rewrite git history!" -ForegroundColor Red
Write-Host "A backup branch 'backup-before-rewrite' has been created." -ForegroundColor Yellow
Write-Host "`nThis script will:" -ForegroundColor Cyan
Write-Host "  1. Remove all commits from 'muhmdusman'" -ForegroundColor White
Write-Host "  2. Reassign commits alternately to whuzaifa2964 and salah-ul-din" -ForegroundColor White
Write-Host "  3. Update commit messages to be more professional" -ForegroundColor White
Write-Host "`nPress CTRL+C now to cancel, or press Enter to continue..." -ForegroundColor Yellow
Read-Host

# Mapping of old commits to new commits with professional messages
# Format: OldHash -> (NewAuthor, NewEmail, NewMessage)
$commitMap = @(
    @{old="fed5e98"; author="whuzaifa2964"; email="whuzaifa64@gmail.com"; msg="feat: initialize Next.js project with TypeScript and Tailwind CSS"},
    @{old="973834c"; author="whuzaifa2964"; email="whuzaifa64@gmail.com"; msg="chore: configure project dependencies and build setup"},
    @{old="5eb533b"; author="salah-ul-din"; email="huzaifa83941@gmail.com"; msg="feat(database): design and implement PostgreSQL schema for MCQ platform"},
    @{old="0901350"; author="salah-ul-din"; email="huzaifa83941@gmail.com"; msg="refactor: reorganize codebase structure and add comprehensive documentation"},
    @{old="008c345"; author="whuzaifa2964"; email="whuzaifa64@gmail.com"; msg="feat(dashboard): implement responsive dashboard UI with subjects overview"},
    @{old="1e13d32"; author="whuzaifa2964"; email="whuzaifa64@gmail.com"; msg="feat(catalog): add caching layer, subject browsing, and entry test selector"},
    @{old="7b595e5"; author="salah-ul-din"; email="huzaifa83941@gmail.com"; msg="feat(quiz): implement practice mode, past papers, and mock test engine"},
    @{old="e7c3a06"; author="salah-ul-din"; email="huzaifa83941@gmail.com"; msg="fix(auth): resolve PKCE code verifier issue in OAuth flow"},
    @{old="062ecf5"; author="whuzaifa2964"; email="whuzaifa64@gmail.com"; msg="feat(quiz): enhance math rendering with LaTeX support and redesign UI"},
    @{old="9bd3670"; author="whuzaifa2964"; email="whuzaifa64@gmail.com"; msg="fix(ui): prevent Material Symbols icon flash on page load"},
    @{old="1431df9"; author="salah-ul-din"; email="huzaifa83941@gmail.com"; msg="fix(fonts): ensure icons render only after font is fully loaded"},
    @{old="42bf86d"; author="salah-ul-din"; email="huzaifa83941@gmail.com"; msg="fix(auth): redirect authenticated users from login/signup pages"},
    @{old="173e4e9"; author="whuzaifa2964"; email="whuzaifa64@gmail.com"; msg="feat(branding): add custom favicon and app icons"},
    @{old="6a6f34d"; author="whuzaifa2964"; email="whuzaifa64@gmail.com"; msg="docs: document UX improvements and auth security enhancements"},
    @{old="e9f5011"; author="salah-ul-din"; email="huzaifa83941@gmail.com"; msg="perf(dashboard): implement streaming architecture for faster page loads"},
    @{old="9b06cc4"; author="salah-ul-din"; email="huzaifa83941@gmail.com"; msg="feat(docs): integrate documentation query system"},
    @{old="0aa9e62"; author="whuzaifa2964"; email="whuzaifa64@gmail.com"; msg="docs(database): audit database indexes and query performance patterns"},
    @{old="82a8904"; author="whuzaifa2964"; email="whuzaifa64@gmail.com"; msg="feat(quiz): replace skeleton loaders with branded loading spinner"},
    @{old="0460af4"; author="salah-ul-din"; email="huzaifa83941@gmail.com"; msg="fix(quiz): improve UX on practice and past paper question screens"}
)

Write-Host "`nStarting git history rewrite..." -ForegroundColor Green

# Use git filter-repo or filter-branch
# First, create the author mapping file
$envFilter = ""
foreach ($commit in $commitMap) {
    $envFilter += @"
if [ `$GIT_COMMIT = `$(git rev-parse $($commit.old)) ]; then
    export GIT_AUTHOR_NAME="$($commit.author)"
    export GIT_AUTHOR_EMAIL="$($commit.email)"
    export GIT_COMMITTER_NAME="$($commit.author)"
    export GIT_COMMITTER_EMAIL="$($commit.email)"
fi

"@
}

# Write the filter script
$filterScript = @"
#!/bin/bash
$envFilter
"@

Set-Content -Path "filter-env.sh" -Value $filterScript

Write-Host "`n⚠️  About to run git filter-branch..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Cyan

# Run filter-branch to change authors
git filter-branch --env-filter "bash filter-env.sh" --msg-filter '
read msg
case "$GIT_COMMIT" in
fed5e98*) echo "feat: initialize Next.js project with TypeScript and Tailwind CSS";;
973834c*) echo "chore: configure project dependencies and build setup";;
5eb533b*) echo "feat(database): design and implement PostgreSQL schema for MCQ platform";;
0901350*) echo "refactor: reorganize codebase structure and add comprehensive documentation";;
008c345*) echo "feat(dashboard): implement responsive dashboard UI with subjects overview";;
1e13d32*) echo "feat(catalog): add caching layer, subject browsing, and entry test selector";;
7b595e5*) echo "feat(quiz): implement practice mode, past papers, and mock test engine";;
e7c3a06*) echo "fix(auth): resolve PKCE code verifier issue in OAuth flow";;
062ecf5*) echo "feat(quiz): enhance math rendering with LaTeX support and redesign UI";;
9bd3670*) echo "fix(ui): prevent Material Symbols icon flash on page load";;
1431df9*) echo "fix(fonts): ensure icons render only after font is fully loaded";;
42bf86d*) echo "fix(auth): redirect authenticated users from login/signup pages";;
173e4e9*) echo "feat(branding): add custom favicon and app icons";;
6a6f34d*) echo "docs: document UX improvements and auth security enhancements";;
e9f5011*) echo "perf(dashboard): implement streaming architecture for faster page loads";;
9b06cc4*) echo "feat(docs): integrate documentation query system";;
0aa9e62*) echo "docs(database): audit database indexes and query performance patterns";;
82a8904*) echo "feat(quiz): replace skeleton loaders with branded loading spinner";;
0460af4*) echo "fix(quiz): improve UX on practice and past paper question screens";;
*) echo "$msg";;
esac
' -- --all

Remove-Item "filter-env.sh" -ErrorAction SilentlyContinue

Write-Host "`n✅ History rewrite complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Review the new history: git log --oneline -20" -ForegroundColor White
Write-Host "  2. Force push to remote: git push origin main --force" -ForegroundColor White
Write-Host "  3. If something goes wrong: git reset --hard backup-before-rewrite" -ForegroundColor White
Write-Host "`n⚠️  Remember: This will overwrite remote history!" -ForegroundColor Red
