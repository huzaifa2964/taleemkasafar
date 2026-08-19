-- =====================================================
-- Admin Panel Setup Migration
-- =====================================================
-- Creates: admins table, user role system, blogs table
-- Adds admin authentication and authorization support
-- =====================================================

-- 1. Add role column to auth.users metadata
-- We'll use user_metadata to store role information
-- Default role is 'student', admin role is 'admin'

-- 2. Create admins table for admin credentials
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  last_login_at timestamptz,
  is_active boolean DEFAULT true NOT NULL,
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 50)
);

COMMENT ON TABLE public.admins IS 'Admin users with special privileges for the admin panel';
COMMENT ON COLUMN public.admins.user_id IS 'References auth.users - admin must have a valid Supabase auth account';
COMMENT ON COLUMN public.admins.username IS 'Unique username for admin login';
COMMENT ON COLUMN public.admins.is_active IS 'Allows temporarily disabling admin access without deletion';

CREATE INDEX idx_admins_user_id ON public.admins(user_id);
CREATE INDEX idx_admins_username ON public.admins(username);
CREATE INDEX idx_admins_is_active ON public.admins(is_active);

-- 3. Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  featured_image_url text,
  author_id uuid REFERENCES public.admins(id) ON DELETE SET NULL,
  status text DEFAULT 'draft' NOT NULL,
  published_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  views_count integer DEFAULT 0 NOT NULL,
  
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT status_values CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT title_length CHECK (char_length(title) >= 3 AND char_length(title) <= 200)
);

COMMENT ON TABLE public.blogs IS 'Blog posts created and managed by admins';
COMMENT ON COLUMN public.blogs.slug IS 'URL-friendly identifier for the blog post';
COMMENT ON COLUMN public.blogs.status IS 'Publication status: draft, published, or archived';
COMMENT ON COLUMN public.blogs.author_id IS 'Admin who created the blog post';

CREATE INDEX idx_blogs_slug ON public.blogs(slug);
CREATE INDEX idx_blogs_status ON public.blogs(status);
CREATE INDEX idx_blogs_published_at ON public.blogs(published_at);
CREATE INDEX idx_blogs_author_id ON public.blogs(author_id);

-- 4. Create blog_tags for categorization (optional, for future use)
CREATE TABLE IF NOT EXISTS public.blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  
  CONSTRAINT tag_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 50)
);

CREATE TABLE IF NOT EXISTS public.blog_post_tags (
  blog_id uuid REFERENCES public.blogs(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  
  PRIMARY KEY (blog_id, tag_id)
);

CREATE INDEX idx_blog_post_tags_blog_id ON public.blog_post_tags(blog_id);
CREATE INDEX idx_blog_post_tags_tag_id ON public.blog_post_tags(tag_id);

-- 5. Add updated_at triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER admins_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  -- Check if current user exists in admins table and is active
  SELECT EXISTS (
    SELECT 1 
    FROM public.admins 
    WHERE user_id = auth.uid() 
      AND is_active = true
  ) INTO v_is_admin;
  
  RETURN COALESCE(v_is_admin, false);
END;
$$;

COMMENT ON FUNCTION public.is_admin IS 'Returns true if the current authenticated user is an active admin';

-- 7. Helper function to get admin dashboard stats
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS json
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_stats json;
BEGIN
  -- Only admins can access dashboard stats
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users),
    'total_attempts', (SELECT COUNT(*) FROM public.attempts),
    'total_mock_attempts', (SELECT COUNT(*) FROM public.attempts WHERE usage = 'mock'),
    'total_practice_attempts', (SELECT COUNT(*) FROM public.attempts WHERE usage IN ('practice', 'past-paper')),
    'total_questions', (SELECT COUNT(*) FROM public.questions),
    'total_blogs', (SELECT COUNT(*) FROM public.blogs),
    'published_blogs', (SELECT COUNT(*) FROM public.blogs WHERE status = 'published'),
    'recent_signups_7days', (
      SELECT COUNT(*) 
      FROM auth.users 
      WHERE created_at >= now() - interval '7 days'
    ),
    'active_users_today', (
      SELECT COUNT(DISTINCT user_id)
      FROM public.attempts
      WHERE created_at >= current_date
    )
  ) INTO v_stats;

  RETURN v_stats;
END;
$$;

COMMENT ON FUNCTION public.get_admin_dashboard_stats IS 'Returns aggregated statistics for the admin dashboard';

-- 8. Function to get recent test submissions
CREATE OR REPLACE FUNCTION public.get_recent_test_submissions(
  p_limit integer DEFAULT 20
)
RETURNS TABLE (
  attempt_id uuid,
  user_id uuid,
  user_email text,
  usage text,
  entry_test_name text,
  subject_name text,
  score_percent numeric,
  submitted_at timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  -- Only admins can access this data
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  RETURN QUERY
  SELECT 
    a.id as attempt_id,
    a.user_id,
    u.email as user_email,
    a.usage::text,
    et.name as entry_test_name,
    s.name as subject_name,
    CASE 
      WHEN a.total_questions > 0 
      THEN ROUND((a.score::numeric / a.total_questions::numeric) * 100, 2)
      ELSE 0
    END as score_percent,
    a.submitted_at
  FROM public.attempts a
  LEFT JOIN auth.users u ON a.user_id = u.id
  LEFT JOIN public.topics t ON a.topic_id = t.id
  LEFT JOIN public.subjects s ON t.subject_id = s.id
  LEFT JOIN public.entry_tests et ON s.entry_test_id = et.id
  WHERE a.submitted_at IS NOT NULL
  ORDER BY a.submitted_at DESC
  LIMIT p_limit;
END;
$$;

COMMENT ON FUNCTION public.get_recent_test_submissions IS 'Returns recent test submissions with user and performance details for admin dashboard';

-- 9. Function to get user activity stats
CREATE OR REPLACE FUNCTION public.get_user_activity_stats(
  p_days integer DEFAULT 30
)
RETURNS TABLE (
  date date,
  new_signups bigint,
  active_users bigint,
  total_attempts bigint
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  -- Only admins can access this data
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      current_date - (p_days || ' days')::interval,
      current_date,
      '1 day'::interval
    )::date as date
  ),
  signups AS (
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as count
    FROM auth.users
    WHERE created_at >= current_date - (p_days || ' days')::interval
    GROUP BY DATE(created_at)
  ),
  active_users AS (
    SELECT 
      DATE(created_at) as date,
      COUNT(DISTINCT user_id) as count
    FROM public.attempts
    WHERE created_at >= current_date - (p_days || ' days')::interval
    GROUP BY DATE(created_at)
  ),
  attempts AS (
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as count
    FROM public.attempts
    WHERE created_at >= current_date - (p_days || ' days')::interval
    GROUP BY DATE(created_at)
  )
  SELECT 
    ds.date,
    COALESCE(s.count, 0) as new_signups,
    COALESCE(au.count, 0) as active_users,
    COALESCE(at.count, 0) as total_attempts
  FROM date_series ds
  LEFT JOIN signups s ON ds.date = s.date
  LEFT JOIN active_users au ON ds.date = au.date
  LEFT JOIN attempts at ON ds.date = at.date
  ORDER BY ds.date DESC;
END;
$$;

COMMENT ON FUNCTION public.get_user_activity_stats IS 'Returns daily user activity metrics for the specified number of days';

-- 10. RLS Policies for admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Admins can read their own record
CREATE POLICY "Admins can view their own profile"
  ON public.admins
  FOR SELECT
  USING (user_id = auth.uid() AND is_active = true);

-- Only existing admins can create new admins
CREATE POLICY "Admins can create other admins"
  ON public.admins
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Admins can update other admin records
CREATE POLICY "Admins can update admin records"
  ON public.admins
  FOR UPDATE
  USING (public.is_admin());

-- Admins can delete other admin records
CREATE POLICY "Admins can delete admin records"
  ON public.admins
  FOR DELETE
  USING (public.is_admin());

-- 11. RLS Policies for blogs table
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Anyone can read published blogs
CREATE POLICY "Anyone can view published blogs"
  ON public.blogs
  FOR SELECT
  USING (status = 'published' OR public.is_admin());

-- Only admins can insert blogs
CREATE POLICY "Admins can create blogs"
  ON public.blogs
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Only admins can update blogs
CREATE POLICY "Admins can update blogs"
  ON public.blogs
  FOR UPDATE
  USING (public.is_admin());

-- Only admins can delete blogs
CREATE POLICY "Admins can delete blogs"
  ON public.blogs
  FOR DELETE
  USING (public.is_admin());

-- 12. RLS Policies for blog tags
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view blog tags"
  ON public.blog_tags
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage blog tags"
  ON public.blog_tags
  FOR ALL
  USING (public.is_admin());

CREATE POLICY "Anyone can view blog post tags"
  ON public.blog_post_tags
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage blog post tags"
  ON public.blog_post_tags
  FOR ALL
  USING (public.is_admin());

-- 13. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT ON public.admins TO authenticated;
GRANT ALL ON public.admins TO authenticated;
GRANT SELECT ON public.blogs TO authenticated, anon;
GRANT ALL ON public.blogs TO authenticated;
GRANT SELECT ON public.blog_tags TO authenticated, anon;
GRANT ALL ON public.blog_tags TO authenticated;
GRANT SELECT ON public.blog_post_tags TO authenticated, anon;
GRANT ALL ON public.blog_post_tags TO authenticated;
