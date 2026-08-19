-- Create function to get all users for admin panel
-- This avoids needing service role key on the client

CREATE OR REPLACE FUNCTION public.get_all_users_admin(
  p_search text DEFAULT '',
  p_page integer DEFAULT 1,
  p_page_size integer DEFAULT 20
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_result jsonb;
  v_total integer;
  v_offset integer;
BEGIN
  -- Only admins can access this data
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Calculate offset
  v_offset := (p_page - 1) * p_page_size;

  -- Get total count (with search filter if provided)
  IF p_search = '' THEN
    SELECT COUNT(*) INTO v_total FROM auth.users;
  ELSE
    SELECT COUNT(*) INTO v_total 
    FROM auth.users
    WHERE 
      email ILIKE '%' || p_search || '%' OR
      raw_user_meta_data->>'display_name' ILIKE '%' || p_search || '%';
  END IF;

  -- Get users with stats
  SELECT jsonb_build_object(
    'users', COALESCE(jsonb_agg(
      jsonb_build_object(
        'id', u.id::text,
        'email', u.email,
        'created_at', u.created_at::text,
        'last_sign_in_at', u.last_sign_in_at::text,
        'email_confirmed_at', u.email_confirmed_at::text,
        'banned_until', u.banned_until::text,
        'display_name', u.raw_user_meta_data->>'display_name',
        'total_attempts', COALESCE(stats.total_attempts, 0),
        'total_mocks', COALESCE(stats.total_mocks, 0)
      )
    ), '[]'::jsonb),
    'total', v_total,
    'totalPages', CEIL(v_total::numeric / p_page_size::numeric)::integer
  )
  INTO v_result
  FROM (
    SELECT *
    FROM auth.users
    WHERE 
      CASE 
        WHEN p_search = '' THEN true
        ELSE 
          email ILIKE '%' || p_search || '%' OR
          raw_user_meta_data->>'display_name' ILIKE '%' || p_search || '%'
      END
    ORDER BY created_at DESC
    LIMIT p_page_size
    OFFSET v_offset
  ) u
  LEFT JOIN (
    SELECT 
      user_id,
      COUNT(*) as total_attempts,
      COUNT(*) FILTER (WHERE mode = 'mock') as total_mocks
    FROM public.attempts
    GROUP BY user_id
  ) stats ON u.id = stats.user_id;

  RETURN v_result;
END;
$$;

COMMENT ON FUNCTION public.get_all_users_admin IS 'Returns all users with stats for admin panel';

-- Secure the function
REVOKE EXECUTE ON FUNCTION public.get_all_users_admin(text, integer, integer) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_users_admin(text, integer, integer) TO authenticated;;
