-- Secure admin functions: set search_path and revoke public access

-- Fix search_path for get_recent_test_submissions
ALTER FUNCTION public.get_recent_test_submissions(integer) SET search_path = '';

-- Revoke execute from anon and authenticated for admin-only functions
REVOKE EXECUTE ON FUNCTION public.get_admin_dashboard_stats() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_recent_test_submissions(integer) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_activity_stats(integer) FROM anon, authenticated;

-- Grant execute only to authenticated users (the function itself checks is_admin)
-- This is safer than allowing anon access
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_recent_test_submissions(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_activity_stats(integer) TO authenticated;;
