# Simple Two-Contributor Git Workflow

## 👥 Contributors

- **Contributor A:** whuzaifa2964 (whuzaifa64@gmail.com) - Your account
- **Contributor B:** salah-ul-din (huzaifa83941@gmail.com) - Your friend's account

---

## 🎯 Goal

Show contributions from both accounts on GitHub by alternating who commits on different dates.

---

## 📝 How It Works

1. Before committing, set the Git identity to whoever is "working" that day
2. Use regular `git add`, `git commit`, `git push` commands
3. When pushing, you'll be prompted to sign in to GitHub - use the matching account

---

## 🚀 Daily Workflow

### When Working as Contributor A (whuzaifa2964):

```powershell
cd C:\Users\User\Desktop\taleemkasafar\Taleemkasafar

# Set identity to Contributor A
git config user.name "whuzaifa2964"
git config user.email "whuzaifa64@gmail.com"

# Verify (optional but recommended)
git config user.name
git config user.email

# Work normally
git add .
git commit -m "your commit message"
git push origin main
```

**When prompted to sign in:** Use **whuzaifa2964** GitHub account credentials.

---

### When Working as Contributor B (salah-ul-din):

```powershell
cd C:\Users\User\Desktop\taleemkasafar\Taleemkasafar

# Set identity to Contributor B
git config user.name "salah-ul-din"
git config user.email "huzaifa83941@gmail.com"

# Verify (optional but recommended)
git config user.name
git config user.email

# Work normally
git add .
git commit -m "your commit message"
git push origin main
```

**When prompted to sign in:** Use **salah-ul-din** GitHub account credentials.

---

## 💡 Quick Switch Scripts

I've created two scripts to make switching identities faster:

### Use Contributor A:
```powershell
. .\switch-to-A.ps1
```

### Use Contributor B:
```powershell
. .\switch-to-B.ps1
```

---

## 📅 Suggested Schedule

To show balanced contributions on GitHub:

- **Week 1:** Contributor A commits on Mon/Wed/Fri, Contributor B on Tue/Thu
- **Week 2:** Contributor B commits on Mon/Wed/Fri, Contributor A on Tue/Thu
- Or simply alternate daily

---

## ✅ Verification

### Check who you're currently set as:
```powershell
git config user.name
git config user.email
```

### Check last few commits:
```powershell
git log --oneline --pretty=format:"%h - %an <%ae> - %s" -5
```

### Verify on GitHub:
Go to https://github.com/huzaifa2964/taleemkasafar/graphs/contributors
Both contributors should appear with their respective commit counts.

---

## 🔐 Managing GitHub Credentials

### When Git asks for credentials:

**Option 1: GitHub CLI (Recommended)**
```powershell
# Sign out current account
gh auth logout

# Sign in with the account you need
gh auth login
# Choose: GitHub.com > HTTPS > Yes > Login with browser
```

**Option 2: Git Credential Manager**
- When you `git push`, a browser window opens
- Sign in with the GitHub account matching your current Git identity
- Windows will cache the credentials

**Option 3: Clear cached credentials**
```powershell
# Open Credential Manager
rundll32.exe keymgr.dll, KRShowKeyMgr

# Find and remove "git:https://github.com" entries
# Next push will prompt for fresh login
```

---

## 🎬 Complete Example

Let's say today you're working as **Contributor B**:

```powershell
# 1. Switch identity
git config user.name "salah-ul-din"
git config user.email "huzaifa83941@gmail.com"

# 2. Check it worked
git config user.name
# Output: salah-ul-din

# 3. Make your changes
# (edit files in VS Code)

# 4. Stage and commit
git add .
git commit -m "feat: add mock test results analytics"

# 5. Push
git push origin main
# If prompted, sign in as salah-ul-din

# 6. Switch back to default (optional)
git config user.name "whuzaifa2964"
git config user.email "whuzaifa64@gmail.com"
```

---

## ⚠️ Important Notes

1. **Always set identity before committing** - Check with `git config user.name`
2. **Match GitHub account when pushing** - Use the same account you set in Git config
3. **Both emails must be verified** on their respective GitHub accounts
4. **Contributor B needs access** - Add salah-ul-din as a collaborator:
   - Go to: https://github.com/huzaifa2964/taleemkasafar/settings/access
   - Click "Add people" and invite **salah-ul-din**

---

## 🆘 Troubleshooting

### "Permission denied" when pushing as Contributor B
- Make sure **salah-ul-din** is added as a collaborator (see Important Notes #4)

### Commits show wrong author on GitHub
- The email must be **verified** on GitHub
- Check at: https://github.com/settings/emails
- Add and verify if needed

### Git keeps using wrong credentials
- Clear cached credentials (see "Managing GitHub Credentials" above)
- Sign out and sign in again with correct account

---

## 📊 Track Contributions

After a few commits from each contributor, check the contribution graph:

https://github.com/huzaifa2964/taleemkasafar/graphs/contributors

Both contributors should show up with their contribution counts!
