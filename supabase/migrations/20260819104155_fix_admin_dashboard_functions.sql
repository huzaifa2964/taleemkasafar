-- Fix the admin dashboard stats function to use correct columns
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS json
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
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
    'total_mock_attempts', (SELECT COUNT(*) FROM public.attempts WHERE mode = 'mock'),
    'total_practice_attempts', (SELECT COUNT(*) FROM public.attempts WHERE mode = 'practice'),
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

-- Fix get_recent_test_submissions to use correct column names
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
SET search_path = ''
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
    a.mode::text as usage,
    et.name as entry_test_name,
    CASE 
      WHEN a.mode = 'mock' THEN 'Mock Test'
      ELSE COALESCE(t.name, 'N/A')
    END as subject_name,
    CASE 
      WHEN a.status = 'completed' AND EXISTS(
        SELECT 1 FROM public.attempt_answers aa WHERE aa.attempt_id = a.id
      )
      THEN (
        SELECT ROUND(
          (COUNT(CASE WHEN aa.is_correct THEN 1 END)::numeric / COUNT(*)::numeric) * 100, 
          2
        )
        FROM public.attempt_answers aa
        WHERE aa.attempt_id = a.id
      )
      ELSE 0
    END as score_percent,
    a.submitted_at
  FROM public.attempts a
  LEFT JOIN auth.users u ON a.user_id = u.id
  LEFT JOIN public.entry_tests et ON a.entry_test_id = et.id
  LEFT JOIN public.topics t ON a.topic_id = t.id
  WHERE a.submitted_at IS NOT NULL
  ORDER BY a.submitted_at DESC
  LIMIT p_limit;
END;
$$;;
