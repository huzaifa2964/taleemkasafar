# Admin Panel Setup Guide

## 🔐 Creating Your First Admin User

Since the admin panel requires an existing admin to create new admins (security feature), you need to manually create the first admin user directly in the database.

### Step 1: Create a Regular User Account

1. Go to your app's sign-up page: `http://localhost:3000/auth/sign-up`
2. Create an account with your desired admin email and password
3. Verify the email if required
4. Note down the email address you used

### Step 2: Add Admin Role via Supabase Dashboard

#### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run this SQL query (replace `your-admin-email@example.com` with your actual email):

```sql
-- Insert admin record for an existing user
INSERT INTO public.admins (user_id, username, is_active)
SELECT 
  id as user_id,
  'admin' as username,
  true as is_active
FROM auth.users
WHERE email = 'your-admin-email@example.com';
```

#### Option B: Using Table Editor

1. Go to **Table Editor** in Supabase Dashboard
2. Open the `auth.users` table
3. Find your user and copy the `id` (UUID)
4. Go to the `public.admins` table
5. Click **Insert** → **Insert row**
6. Fill in:
   - `user_id`: paste the UUID from step 3
   - `username`: `admin` (or any username you prefer)
   - `is_active`: `true`
7. Click **Save**

### Step 3: Login to Admin Panel

1. Go to `http://localhost:3000/admin/login`
2. Use the **same email and password** from Step 1
3. You should now have access to the admin panel! 🎉

---

## 📋 Admin Panel Features

Once logged in, you can:

- **Dashboard**: View real-time statistics (users, tests, attempts)
- **Users**: Manage all users (view, edit, block/unblock)
- **Questions**: Add, edit, and delete MCQ questions
- **Entry Tests**: Manage entry tests, subjects, and chapters
- **Blogs**: Create and publish blog posts

---

## 🔒 Security Notes

1. **Admin credentials are stored in the database**, not in environment variables
2. **Only authenticated users in the `admins` table** can access the admin panel
3. **RLS policies** ensure regular users cannot access admin data
4. **Admin functions** are protected and only callable by admins
5. The first admin must be created manually; after that, admins can create other admins through the panel

---

## 🆘 Troubleshooting

### "Access denied: Admin privileges required"
- Your user account exists but is not in the `admins` table
- Follow Step 2 again to add the admin role

### "Admin account is deactivated"
- Your admin record has `is_active = false`
- Update it to `true` in the Supabase dashboard

### "Invalid credentials"
- Email or password is incorrect
- Try resetting your password through the regular auth flow

### Can't create more admins
- Make sure you're logged in as an admin
- Check that your admin account has `is_active = true`

---

## 📝 Creating Additional Admin Users

Once you're logged in as an admin:

1. The user must first create a regular account
2. You can then promote them to admin by inserting their `user_id` into the `admins` table
3. Alternatively, build an admin user management interface to do this through the UI

---

## 🚀 Production Deployment

Before deploying to production:

1. ✅ Change admin passwords to strong, unique values
2. ✅ Enable 2FA for admin accounts (if Supabase supports it)
3. ✅ Set up monitoring and alerts for admin logins
4. ✅ Regularly audit admin access logs
5. ✅ Use environment-specific admin accounts (dev vs. prod)
