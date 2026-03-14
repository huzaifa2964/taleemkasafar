# Git History Rewrite Instructions

## ⚠️ WARNING: This rewrites all commit history

**Backup created:** `backup-before-rewrite` branch

## Option 1: Simple Approach (Squash and Rewrite)

This is the safest and cleanest approach - create a fresh history:

```powershell
# 1. Create a new orphan branch (starts with no history)
git checkout --orphan fresh-history

# 2. Stage all current files
git add .

# 3. Create the new commit history with professional messages
# We'll create ~10 commits representing major milestones

# Commit 1 - Project Setup (Contributor A)
git config user.name "whuzaifa2964"
git config user.email "whuzaifa64@gmail.com"
git commit -m "feat: initialize Next.js project with TypeScript and Supabase integration" --date="2026-03-14T19:26:13+05:00"

# Commit 2 - Database Schema (Contributor B)
git config user.name "salah-ul-din"
git config user.email "huzaifa83941@gmail.com"
git add .
git commit --amend -m "feat(database): design and implement PostgreSQL schema for MCQ platform" --date="2026-06-25T20:27:36+05:00"

# Add more commits as needed for major features...

# 4. Delete old main branch and rename fresh-history to main
git branch -D main
git branch -m main

# 5. Force push to remote
git push origin main --force
```

## Option 2: Detailed Rewrite (Preserves All Commits)

Use this PowerShell script to rewrite author for each commit:

```powershell
# Install git-filter-repo if not installed
# Download from: https://github.com/newren/git-filter-repo

# Create author mapping file
@"
muhmdusman <muhammad.usman@markaz.app> ==> whuzaifa2964 <whuzaifa64@gmail.com>
"@ | Out-File -Encoding UTF8 authors.txt

# Run filter-repo
python git-filter-repo --mailmap authors.txt --force

# Push
git push origin main --force
```

## Option 3: Manual Rebase (Most Control)

Recommended for full control over each commit:

```powershell
# Start interactive rebase from the first commit
git rebase -i --root

# In the editor, change 'pick' to 'edit' for commits you want to change
# Save and close

# For each commit that stops:
git commit --amend --author="whuzaifa2964 <whuzaifa64@gmail.com>" --no-edit
git rebase --continue

# After all commits are done:
git push origin main --force
```

## Recommended: Clean Slate Approach

Since you want professional commit messages and proper attribution, I recommend:

### Step 1: Backup current work
```powershell
git branch backup-old-history
```

### Step 2: Create new history manually
Run the script I'll create: `create-clean-history.ps1`

This will:
- Analyze current code
- Create ~10-12 meaningful commits
- Alternate between contributors
- Use professional commit messages
- Preserve all code changes

### Step 3: Force push
```powershell
git push origin main --force
```

## Recovery

If something goes wrong:
```powershell
git reset --hard backup-before-rewrite
git push origin main --force
```
