-- Create function to get a single user by ID for admin panel

CREATE OR REPLACE FUNCTION public.get_user_by_id_admin(
  p_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_result jsonb;
BEGIN
  -- Only admins can access this data
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Get user with stats
  SELECT jsonb_build_object(
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
  INTO v_result
  FROM auth.users u
  LEFT JOIN (
    SELECT 
      user_id,
      COUNT(*) as total_attempts,
      COUNT(*) FILTER (WHERE mode = 'mock') as total_mocks
    FROM public.attempts
    WHERE user_id = p_user_id
    GROUP BY user_id
  ) stats ON u.id = stats.user_id
  WHERE u.id = p_user_id;

  RETURN v_result;
END;
$$;

COMMENT ON FUNCTION public.get_user_by_id_admin IS 'Returns a single user with stats for admin panel';

-- Secure the function
REVOKE EXECUTE ON FUNCTION public.get_user_by_id_admin(uuid) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_by_id_admin(uuid) TO authenticated;;
