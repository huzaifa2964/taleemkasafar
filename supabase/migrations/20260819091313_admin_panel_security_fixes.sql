-- Security fixes for admin panel functions

-- Fix search_path for all functions
ALTER FUNCTION public.is_admin() SET search_path = '';
ALTER FUNCTION public.handle_updated_at() SET search_path = '';
ALTER FUNCTION public.get_admin_dashboard_stats() SET search_path = '';
ALTER FUNCTION public.get_recent_test_submissions(integer) SET search_path = '';
ALTER FUNCTION public.get_user_activity_stats(integer) SET search_path = '';

-- Revoke public execute on admin functions
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_admin_dashboard_stats() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_recent_test_submissions(integer) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_activity_stats(integer) FROM anon, authenticated;

-- handle_updated_at should only be callable by triggers
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM anon, authenticated, public;

-- Grant execute only to authenticated users for admin check (they need it for RLS)
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;;
