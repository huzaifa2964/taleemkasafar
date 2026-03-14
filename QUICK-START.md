# Quick Start: Two-Contributor Setup

## Before You Begin

You need Contributor B's information:
- [ ] GitHub username
- [ ] GitHub email (must be verified on their GitHub account)

Both contributors should have access to this repository (add as collaborator on GitHub if needed).

---

## Setup Steps (Do Once)

### 1. Generate SSH Keys
```powershell
# For Contributor A (huzaifa2964)
ssh-keygen -t ed25519 -C "whuzaifa64@gmail.com" -f "$env:USERPROFILE\.ssh\id_ed25519_github_huzaifa"

# For Contributor B (replace email!)
ssh-keygen -t ed25519 -C "contributorB@example.com" -f "$env:USERPROFILE\.ssh\id_ed25519_github_contributorB"
```

### 2. Add SSH Keys to GitHub

**For Contributor A:**
```powershell
Get-Content "$env:USERPROFILE\.ssh\id_ed25519_github_huzaifa.pub" | Set-Clipboard
```
Then: https://github.com/settings/keys → New SSH key → Paste

**For Contributor B:**
```powershell
Get-Content "$env:USERPROFILE\.ssh\id_ed25519_github_contributorB.pub" | Set-Clipboard
```
Then: Sign in as B → https://github.com/settings/keys → New SSH key → Paste

### 3. Configure SSH
```powershell
notepad "$env:USERPROFILE\.ssh\config"
```

Add this:
```
Host github-huzaifa
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github_huzaifa
  IdentitiesOnly yes

Host github-contributorB
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github_contributorB
  IdentitiesOnly yes
```

### 4. Edit `use-contributor-B.ps1`
Open the file and replace:
```powershell
$CONTRIBUTOR_B_NAME = "contributorB-github-username"  # Replace with actual
$CONTRIBUTOR_B_EMAIL = "contributorB@example.com"     # Replace with actual
```

### 5. Switch Repository to SSH
```powershell
cd C:\Users\User\Desktop\taleemkasafar\Taleemkasafar
git remote set-url origin git@github-huzaifa:huzaifa2964/taleemkasafar.git
```

### 6. Test Connections
```powershell
ssh -T git@github-huzaifa
ssh -T git@github-contributorB
```

Both should say: "Hi [username]! You've successfully authenticated..."

---

## Daily Usage

### When Contributor A is Working
```powershell
cd C:\Users\User\Desktop\taleemkasafar\Taleemkasafar

# Switch to A's identity
. .\use-contributor-A.ps1

# Verify
. .\check-git-identity.ps1

# Work normally
git add .
git commit -m "your commit message"
git push origin main
```

### When Contributor B is Working
```powershell
cd C:\Users\User\Desktop\taleemkasafar\Taleemkasafar

# Switch to B's identity
. .\use-contributor-B.ps1

# Verify
. .\check-git-identity.ps1

# Work normally
git add .
git commit -m "your commit message"
git push origin main

# Switch back to A (important!)
. .\use-contributor-A.ps1
```

---

## Verification Checklist

After first commits from each contributor:

- [ ] Run `check-git-identity.ps1` before committing
- [ ] Make test commits from both contributors
- [ ] Push to GitHub
- [ ] Visit https://github.com/huzaifa2964/taleemkasafar/commits/main
- [ ] Verify correct avatars/usernames appear on commits
- [ ] Click a commit → verify author matches who made it

---

## Key Points

✅ **Always run `check-git-identity.ps1` before committing** to verify who you're committing as

✅ **Use `. .\use-contributor-A.ps1`** or **`. .\use-contributor-B.ps1`** to switch

✅ **Contributor B should run `use-contributor-A.ps1` after pushing** to reset to default

✅ **Email must be verified on GitHub** for proper attribution

✅ **Both need collaborator access** to push to the repository

❌ **Don't use `git commit --amend --author`** to fake history — that's unethical

❌ **Don't rewrite existing commits** — they stay as-is

---

## Troubleshooting

**"Permission denied (publickey)"**
→ Make sure SSH keys are added to GitHub (Step 2)

**Commits show wrong author**
→ Run `check-git-identity.ps1` before committing
→ Make sure email is verified on GitHub

**Can't push**
→ Make sure contributor is added as collaborator on GitHub
→ Test SSH: `ssh -T git@github-huzaifa` (or `git@github-contributorB`)

**Remote URL is still HTTPS**
→ Run Step 5 again to switch to SSH
