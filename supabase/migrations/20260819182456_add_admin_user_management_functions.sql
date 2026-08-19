-- Create admin user management functions

-- Function to ban a user
CREATE OR REPLACE FUNCTION public.admin_ban_user(
  p_user_id uuid,
  p_days integer DEFAULT 30
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_banned_until timestamptz;
BEGIN
  -- Only admins can perform this action
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Calculate ban expiration
  v_banned_until := now() + (p_days || ' days')::interval;

  -- Update user ban status in auth.users
  UPDATE auth.users
  SET banned_until = v_banned_until
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Function to unban a user
CREATE OR REPLACE FUNCTION public.admin_unban_user(
  p_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only admins can perform this action
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Clear ban by setting banned_until to NULL
  UPDATE auth.users
  SET banned_until = NULL
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Function to delete a user
CREATE OR REPLACE FUNCTION public.admin_delete_user(
  p_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_current_user_id uuid;
BEGIN
  -- Only admins can perform this action
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Get current user ID
  v_current_user_id := auth.uid();

  -- Prevent self-deletion
  IF p_user_id = v_current_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot delete your own account');
  END IF;

  -- Delete user (CASCADE will handle related data)
  DELETE FROM auth.users
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;

COMMENT ON FUNCTION public.admin_ban_user IS 'Ban a user for specified number of days';
COMMENT ON FUNCTION public.admin_unban_user IS 'Remove ban from a user';
COMMENT ON FUNCTION public.admin_delete_user IS 'Permanently delete a user';

-- Secure the functions
REVOKE EXECUTE ON FUNCTION public.admin_ban_user(uuid, integer) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_ban_user(uuid, integer) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_unban_user(uuid) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_unban_user(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.admin_delete_user(uuid) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(uuid) TO authenticated;;
