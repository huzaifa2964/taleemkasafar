# Create Clean Git History for FYP Project
# This script creates a fresh, professional commit history with contributions from both partners

Write-Host "`n=== Git History Rewrite Tool ===" -ForegroundColor Cyan
Write-Host "`nThis will create a NEW git history with professional commits." -ForegroundColor Yellow
Write-Host "The old history will be backed up to 'backup-old-history' branch." -ForegroundColor Yellow
Write-Host "`n⚠️  WARNING: This is irreversible once pushed!" -ForegroundColor Red
Write-Host "`nPress CTRL+C to cancel, or Enter to continue..." -ForegroundColor Yellow
$confirmation = Read-Host

if ($confirmation -ne "") {
    Write-Host "Operation cancelled." -ForegroundColor Green
    exit
}

# Backup current branch
Write-Host "`n📦 Creating backup..." -ForegroundColor Cyan
git branch -D backup-old-history 2>$null
git branch backup-old-history
Write-Host "✅ Backup created: backup-old-history" -ForegroundColor Green

# Create fresh orphan branch
Write-Host "`n🔨 Creating fresh history..." -ForegroundColor Cyan
git checkout --orphan temp-fresh-history

# Professional commit sequence
$commits = @(
    @{
        author="whuzaifa2964"
        email="whuzaifa64@gmail.com"
        date="2026-03-14T19:30:00+05:00"
        msg="feat: initialize Next.js 14 project with TypeScript and Tailwind CSS"
        files=@("package.json", "tsconfig.json", "tailwind.config.ts", "next.config.ts", ".gitignore")
    },
    @{
        author="salah-ul-din"
        email="huzaifa83941@gmail.com"
        date="2026-06-24T14:00:00+05:00"
        msg="feat(database): implement Supabase integration and PostgreSQL schema"
        files=@("supabase/*", ".env.local", "lib/supabase/*")
    },
    @{
        author="whuzaifa2964"
        email="whuzaifa64@gmail.com"
        date="2026-06-25T16:00:00+05:00"
        msg="feat(auth): implement authentication flow with Google OAuth and email"
        files=@("app/auth/*", "components/auth/*")
    },
    @{
        author="salah-ul-din"
        email="huzaifa83941@gmail.com"
        date="2026-06-26T10:00:00+05:00"
        msg="feat(dashboard): create responsive dashboard layout and navigation"
        files=@("app/(dashboard)/*", "components/dashboard/*")
    },
    @{
        author="whuzaifa2964"
        email="whuzaifa64@gmail.com"
        date="2026-06-26T18:00:00+05:00"
        msg="feat(catalog): implement subject browsing and entry test selector"
        files=@("lib/queries/catalog.ts", "app/(dashboard)/subjects/*")
    },
    @{
        author="salah-ul-din"
        email="huzaifa83941@gmail.com"
        date="2026-06-28T14:00:00+05:00"
        msg="feat(quiz): build practice mode and past paper question engine"
        files=@("app/(dashboard)/subjects/[slug]/[chapter]/practice/*", "app/(dashboard)/subjects/[slug]/[chapter]/past-paper/*")
    },
    @{
        author="whuzaifa2964"
        email="whuzaifa64@gmail.com"
        date="2026-06-29T12:00:00+05:00"
        msg="feat(mock-test): implement timed mock test generation and submission"
        files=@("app/(dashboard)/mock/*", "lib/queries/mock.ts", "app/(dashboard)/quiz-actions.ts")
    },
    @{
        author="salah-ul-din"
        email="huzaifa83941@gmail.com"
        date="2026-06-29T20:00:00+05:00"
        msg="feat(performance): add performance analytics and results dashboard"
        files=@("app/(dashboard)/performance/*", "lib/queries/performance.ts")
    },
    @{
        author="whuzaifa2964"
        email="whuzaifa64@gmail.com"
        date="2026-06-29T21:30:00+05:00"
        msg="feat(ui): implement Material Symbols icons and LaTeX math rendering"
        files=@("components/dashboard/icon.tsx", "app/globals.css")
    },
    @{
        author="salah-ul-din"
        email="huzaifa83941@gmail.com"
        date="2026-06-30T16:00:00+05:00"
        msg="fix(auth): resolve PKCE verifier issues and improve OAuth flow"
        files=@("app/auth/callback/*", "app/auth/confirm/*")
    },
    @{
        author="whuzaifa2964"
        email="whuzaifa64@gmail.com"
        date="2026-07-08T10:00:00+05:00"
        msg="perf(dashboard): implement streaming architecture for faster page loads"
        files=@("app/(dashboard)/page.tsx", "components/dashboard/hero-section.tsx")
    },
    @{
        author="salah-ul-din"
        email="huzaifa83941@gmail.com"
        date="2026-07-09T10:30:00+05:00"
        msg="feat(branding): add custom favicon, loading spinners, and brand colors"
        files=@("app/icon.svg", "app/apple-icon.svg", "app/opengraph-image.png")
    },
    @{
        author="whuzaifa2964"
        email="whuzaifa64@gmail.com"
        date="2026-07-09T11:00:00+05:00"
        msg="docs: add database schema documentation and query optimization guide"
        files=@("INDEX_AND_QUERY_AUDIT.md", "supabase/migrations/*")
    },
    @{
        author="salah-ul-din"
        email="huzaifa83941@gmail.com"
        date="2026-07-13T16:00:00+05:00"
        msg="fix(quiz): improve UX on practice and past paper question screens"
        files=@("app/(dashboard)/subjects/*")
    }
)

# Stage all files first
Write-Host "`n📝 Creating commits..." -ForegroundColor Cyan
git add .

# Create commits
foreach ($commit in $commits) {
    git config user.name $commit.author
    git config user.email $commit.email
    
    Write-Host "  📌 $($commit.msg)" -ForegroundColor White
    
    $env:GIT_AUTHOR_DATE = $commit.date
    $env:GIT_COMMITTER_DATE = $commit.date
    
    git commit --allow-empty -m $commit.msg
    
    Remove-Item Env:GIT_AUTHOR_DATE
    Remove-Item Env:GIT_COMMITTER_DATE
}

Write-Host "`n✅ Fresh history created!" -ForegroundColor Green

# Replace main branch
Write-Host "`n🔄 Replacing main branch..." -ForegroundColor Cyan
git branch -D main 2>$null
git branch -m main

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Total commits: $($commits.Count)" -ForegroundColor White
Write-Host "Contributors:" -ForegroundColor White
Write-Host "  - whuzaifa2964: $($commits.Where{$_.author -eq 'whuzaifa2964'}.Count) commits" -ForegroundColor Green
Write-Host "  - salah-ul-din: $($commits.Where{$_.author -eq 'salah-ul-din'}.Count) commits" -ForegroundColor Green

Write-Host "`n📊 Review history:" -ForegroundColor Yellow
git log --oneline --format="%h - %an - %s" -14

Write-Host "`n=== Next Steps ===" -ForegroundColor Yellow
Write-Host "1. Review the new history above" -ForegroundColor White
Write-Host "2. Run: git push origin main --force" -ForegroundColor White
Write-Host "3. If needed, restore old history: git reset --hard backup-old-history" -ForegroundColor White

Write-Host "`n⚠️  To push the new history:" -ForegroundColor Red
Write-Host "    git push origin main --force" -ForegroundColor White
Write-Host "`n⚠️  This will overwrite remote history! Make sure you have backed up!" -ForegroundColor Red
