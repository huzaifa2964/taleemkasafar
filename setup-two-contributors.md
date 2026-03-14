# Two-Contributor Git Setup Guide (Windows)

## Current State
- **Repo:** https://github.com/huzaifa2964/taleemkasafar.git
- **Current identity:** whuzaifa2964 <whuzaifa64@gmail.com> (Contributor A)
- **Authentication:** HTTPS with Git Credential Manager

## Goal
Allow two contributors (A and B) to commit from the same PC with correct GitHub attribution.

---

## Step 1: Collect Information

You need to know:
- **Contributor A GitHub username:** huzaifa2964
- **Contributor A GitHub email:** whuzaifa64@gmail.com (already configured)
- **Contributor B GitHub username:** ??? salah-ul-din
- **Contributor B GitHub email:** huzaifa83941@gmail.com 

**Important:** Both emails must be verified in their respective GitHub account settings, or commits won't show as verified/attributed correctly.

---

## Step 2: Generate SSH Keys for Each Contributor

Open PowerShell and run these commands:

### For Contributor A (huzaifa2964):
```powershell
ssh-keygen -t ed25519 -C "whuzaifa64@gmail.com" -f "$env:USERPROFILE\.ssh\id_ed25519_github_huzaifa"
```
Press Enter when prompted for passphrase (or set one if you prefer security).

### For Contributor B:
```powershell
ssh-keygen -t ed25519 -C "contributorB@example.com" -f "$env:USERPROFILE\.ssh\id_ed25519_github_contributorB"
```
(Replace `contributorB@example.com` with their actual GitHub email)

---

## Step 3: Add SSH Keys to GitHub Accounts

### For Contributor A:
1. Copy the public key:
   ```powershell
   Get-Content "$env:USERPROFILE\.ssh\id_ed25519_github_huzaifa.pub" | Set-Clipboard
   ```
2. Go to: https://github.com/settings/keys
3. Click "New SSH key"
4. Title: "Taleemkasafar FYP PC"
5. Paste the key and save

### For Contributor B:
1. **Sign out of GitHub in your browser**
2. **Sign in as Contributor B**
3. Copy their public key:
   ```powershell
   Get-Content "$env:USERPROFILE\.ssh\id_ed25519_github_contributorB.pub" | Set-Clipboard
   ```
4. Go to: https://github.com/settings/keys
5. Click "New SSH key"
6. Title: "Taleemkasafar FYP PC"
7. Paste the key and save

---

## Step 4: Configure SSH to Use the Right Key

Create/edit `C:\Users\User\.ssh\config`:

```powershell
# Open SSH config in notepad
notepad "$env:USERPROFILE\.ssh\config"
```

Add this content (adjust usernames/emails as needed):

```
# Contributor A (huzaifa2964)
Host github-huzaifa
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github_huzaifa
  IdentitiesOnly yes

# Contributor B
Host github-contributorB
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github_contributorB
  IdentitiesOnly yes
```

Save and close.

---

## Step 5: Switch Repository from HTTPS to SSH

In the repository directory:

```powershell
cd C:\Users\User\Desktop\taleemkasafar\Taleemkasafar

# Switch to SSH URL using Contributor A's SSH host alias (default owner)
git remote set-url origin git@github-huzaifa:huzaifa2964/taleemkasafar.git

# Verify
git remote -v
```

You should see:
```
origin  git@github-huzaifa:huzaifa2964/taleemkasafar.git (fetch)
origin  git@github-huzaifa:huzaifa2964/taleemkasafar.git (push)
```

---

## Step 6: Test SSH Connection

```powershell
# Test Contributor A's connection
ssh -T git@github-huzaifa

# Test Contributor B's connection
ssh -T git@github-contributorB
```

Expected output: "Hi [username]! You've successfully authenticated..."

---

## Step 7: Configure Git Identity Switching

### Option A: Set identity per commit (Recommended)
Before each commit, run one of these:

**When Contributor A is working:**
```powershell
git config user.name "whuzaifa2964"
git config user.email "whuzaifa64@gmail.com"
```

**When Contributor B is working:**
```powershell
git config user.name "contributorB-github-username"
git config user.email "contributorB@example.com"
```

### Option B: Use environment variables (Advanced)
Create two scripts:

**`use-contributor-A.ps1`:**
```powershell
$env:GIT_AUTHOR_NAME = "whuzaifa2964"
$env:GIT_AUTHOR_EMAIL = "whuzaifa64@gmail.com"
$env:GIT_COMMITTER_NAME = "whuzaifa2964"
$env:GIT_COMMITTER_EMAIL = "whuzaifa64@gmail.com"
Write-Host "✓ Git identity set to Contributor A (huzaifa2964)" -ForegroundColor Green
```

**`use-contributor-B.ps1`:**
```powershell
$env:GIT_AUTHOR_NAME = "contributorB-github-username"
$env:GIT_AUTHOR_EMAIL = "contributorB@example.com"
$env:GIT_COMMITTER_NAME = "contributorB-github-username"
$env:GIT_COMMITTER_EMAIL = "contributorB@example.com"
Write-Host "✓ Git identity set to Contributor B" -ForegroundColor Green
```

Run the appropriate script before working:
```powershell
. .\use-contributor-A.ps1
# or
. .\use-contributor-B.ps1
```

---

## Step 8: Verify Before Committing

**Check current Git identity:**
```powershell
git config user.name
git config user.email
```

**Or check environment variables:**
```powershell
echo "Name: $env:GIT_AUTHOR_NAME"
echo "Email: $env:GIT_AUTHOR_EMAIL"
```

---

## Step 9: Make a Test Commit

**As Contributor A:**
```powershell
git config user.name "whuzaifa2964"
git config user.email "whuzaifa64@gmail.com"

# Make a change
echo "# Test by Contributor A" >> test-commit-A.txt
git add test-commit-A.txt
git commit -m "test: verify Contributor A attribution"
git push origin main
```

**As Contributor B:**
```powershell
git config user.name "contributorB-github-username"
git config user.email "contributorB@example.com"

# Make a change
echo "# Test by Contributor B" >> test-commit-B.txt
git add test-commit-B.txt
git commit -m "test: verify Contributor B attribution"

# IMPORTANT: Switch remote URL to B's SSH alias
git remote set-url origin git@github-contributorB:huzaifa2964/taleemkasafar.git
git push origin main

# Switch back to A's URL after push
git remote set-url origin git@github-huzaifa:huzaifa2964/taleemkasafar.git
```

---

## Step 10: Verify on GitHub

1. Go to: https://github.com/huzaifa2964/taleemkasafar/commits/main
2. Check the commit list — each commit should show the correct avatar and username
3. Click on a commit to see details — the author should match the person who made it

---

## Daily Workflow Summary

### When Contributor A is working:
```powershell
cd C:\Users\User\Desktop\taleemkasafar\Taleemkasafar

# Set identity
git config user.name "whuzaifa2964"
git config user.email "whuzaifa64@gmail.com"

# Verify
git config user.name  # Should show: whuzaifa2964

# Work normally
git add .
git commit -m "your message"
git push origin main
```

### When Contributor B is working:
```powershell
cd C:\Users\User\Desktop\taleemkasafar\Taleemkasafar

# Set identity
git config user.name "contributorB-github-username"
git config user.email "contributorB@example.com"

# Verify
git config user.name  # Should show: contributorB-github-username

# Switch to B's SSH key for push
git remote set-url origin git@github-contributorB:huzaifa2964/taleemkasafar.git

# Work
git add .
git commit -m "your message"
git push origin main

# Switch back to A's SSH key (default)
git remote set-url origin git@github-huzaifa:huzaifa2964/taleemkasafar.git
```

---

## Troubleshooting

### "Permission denied (publickey)"
- Make sure you ran Step 3 (added SSH keys to GitHub)
- Verify SSH config host aliases match the remote URL
- Test connection: `ssh -T git@github-huzaifa`

### Commits show wrong author on GitHub
- The email must be verified on GitHub
- Check the email: `git config user.email`
- GitHub links commits to accounts by matching the commit email to verified emails

### "Repository not found"
- Make sure Contributor B has push access to the repo
- Go to: https://github.com/huzaifa2964/taleemkasafar/settings/access
- Add Contributor B as a collaborator

---

## Important Notes

1. **Both contributors need push access** to the repository (add as collaborator on GitHub)
2. **Email must be verified** on GitHub for proper attribution
3. **Don't fake commit history** — this setup ensures real attribution going forward
4. **Existing commits remain unchanged** — they'll keep showing Contributor A's name
5. **Always verify identity before committing** using `git config user.name`

---

## Alternative: Global Identity with Override

If you want to keep Contributor A as the "default" globally:

```powershell
# Keep global config for A
git config --global user.name "whuzaifa2964"
git config --global user.email "whuzaifa64@gmail.com"

# Override locally for B when needed
cd C:\Users\User\Desktop\taleemkasafar\Taleemkasafar
git config --local user.name "contributorB-github-username"
git config --local user.email "contributorB@example.com"

# Check effective config
git config user.name  # Shows local (B) if set, otherwise global (A)
```

This way, Contributor A commits automatically with their identity, and you explicitly set B's identity only when B is working.
