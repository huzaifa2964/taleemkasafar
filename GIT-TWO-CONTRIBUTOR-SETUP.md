# Two-Contributor Git Setup for Taleemkasafar FYP

## 📋 Your Project Details

- **Repository:** https://github.com/huzaifa2964/taleemkasafar.git
- **Contributor A:** whuzaifa2964 (whuzaifa64@gmail.com) ✅ Already configured
- **Contributor B:** salah-ul-din (huzaifa83941@gmail.com) 🔧 Needs setup

---

## 🎯 What We're Going to Do

1. Generate separate SSH keys for each GitHub account
2. Add those keys to GitHub
3. Configure SSH to use the right key automatically
4. Create simple PowerShell scripts to switch identities
5. Test the setup

---

## 📝 Step-by-Step Instructions

### Step 1: Generate SSH Keys (One-time setup)

Open PowerShell in your repository folder and run:

```powershell
# For Contributor A (whuzaifa2964)
ssh-keygen -t ed25519 -C "whuzaifa64@gmail.com" -f "$env:USERPROFILE\.ssh\id_ed25519_huzaifa"

# For Contributor B (salah-ul-din)
ssh-keygen -t ed25519 -C "huzaifa83941@gmail.com" -f "$env:USERPROFILE\.ssh\id_ed25519_salahuldin"
```

**Press Enter** when asked for passphrase (or set one if you want extra security).

---

### Step 2: Add SSH Keys to GitHub

#### For Contributor A (whuzaifa2964):

1. Copy the public key:
   ```powershell
   Get-Content "$env:USERPROFILE\.ssh\id_ed25519_huzaifa.pub" | Set-Clipboard
   ```

2. Go to https://github.com/settings/keys (logged in as **whuzaifa2964**)
3. Click **"New SSH key"**
4. Title: `Taleemkasafar FYP - whuzaifa2964`
5. Paste and click **"Add SSH key"**

#### For Contributor B (salah-ul-din):

1. **Sign out** of GitHub in your browser
2. **Sign in** as **salah-ul-din**
3. Copy the public key:
   ```powershell
   Get-Content "$env:USERPROFILE\.ssh\id_ed25519_salahuldin.pub" | Set-Clipboard
   ```
4. Go to https://github.com/settings/keys
5. Click **"New SSH key"**
6. Title: `Taleemkasafar FYP - salah-ul-din`
7. Paste and click **"Add SSH key"**

---

### Step 3: Configure SSH (One-time setup)

Create/edit the SSH config file:

```powershell
notepad "$env:USERPROFILE\.ssh\config"
```

Add this content:

```
# Contributor A (whuzaifa2964)
Host github-huzaifa
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_huzaifa
  IdentitiesOnly yes

# Contributor B (salah-ul-din)
Host github-salahuldin
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_salahuldin
  IdentitiesOnly yes
```

**Save and close** the file.

---

### Step 4: Switch Repository to SSH

```powershell
cd C:\Users\User\Desktop\taleemkasafar\Taleemkasafar

# Change remote URL to use Contributor A's SSH key (default)
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

### Step 5: Test SSH Connections

```powershell
# Test Contributor A
ssh -T git@github-huzaifa

# Test Contributor B
ssh -T git@github-salahuldin
```

Both should say: `Hi [username]! You've successfully authenticated...`

---

### Step 6: Create Identity Switching Scripts

The scripts `use-contributor-A.ps1` and `use-contributor-B.ps1` are already created in your repo.

---

## 🚀 Daily Workflow

### When Contributor A (whuzaifa2964) is Working:

```powershell
cd C:\Users\User\Desktop\taleemkasafar\Taleemkasafar

# Switch to Contributor A
. .\use-contributor-A.ps1

# Verify (optional but recommended)
. .\check-git-identity.ps1

# Work normally
git add .
git commit -m "your message"
git push origin main
```

### When Contributor B (salah-ul-din) is Working:

```powershell
cd C:\Users\User\Desktop\taleemkasafar\Taleemkasafar

# Switch to Contributor B
. .\use-contributor-B.ps1

# Verify (optional but recommended)
. .\check-git-identity.ps1

# Work normally
git add .
git commit -m "your message"
git push origin main

# IMPORTANT: Switch back to A when done
. .\use-contributor-A.ps1
```

---

## ✅ Verification Checklist

After setup, verify:

1. **SSH works for both:**
   ```powershell
   ssh -T git@github-huzaifa
   ssh -T git@github-salahuldin
   ```

2. **Scripts exist:**
   ```powershell
   ls use-contributor-*.ps1
   ```

3. **Identity switching works:**
   ```powershell
   . .\use-contributor-A.ps1
   . .\check-git-identity.ps1
   
   . .\use-contributor-B.ps1
   . .\check-git-identity.ps1
   ```

4. **Make a test commit as each contributor** and check on GitHub that it shows the correct avatar/username

---

## 🔧 Troubleshooting

### "Permission denied (publickey)"
- Make sure you added the SSH key to GitHub (Step 2)
- Verify SSH config is correct (Step 3)
- Test connection: `ssh -T git@github-huzaifa`

### Commits show wrong author on GitHub
- The email **must be verified** on GitHub
- Check: https://github.com/settings/emails
- Add and verify the email if needed

### "Repository not found" when B pushes
- Contributor B needs **write access** to the repo
- Go to: https://github.com/huzaifa2964/taleemkasafar/settings/access
- Click **"Add people"** and invite **salah-ul-din** as a collaborator

---

## 📌 Important Notes

1. ✅ **This setup is legitimate** - each contributor uses their own GitHub account
2. ✅ **Existing commits are untouched** - they keep their current author
3. ✅ **Future commits will be correctly attributed** to whoever makes them
4. ⚠️ **Always run** `use-contributor-X.ps1` before committing
5. ⚠️ **Always run** `use-contributor-A.ps1` after B is done (to reset to default)
6. 📧 **Both emails must be verified** on their respective GitHub accounts

---

## 🆘 Need Help?

Run this anytime to see your current Git identity:
```powershell
. .\check-git-identity.ps1
```

This shows:
- Current Git name/email
- Active SSH remote
- Last 3 commits with their authors
