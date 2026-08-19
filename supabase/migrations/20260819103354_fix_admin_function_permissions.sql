-- Grant execute permissions on admin functions to authenticated users
-- The functions themselves check is_admin() internally for security

-- Grant execute on admin dashboard functions
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_recent_test_submissions(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_activity_stats(integer) TO authenticated;

-- These functions already have internal admin checks via is_admin()
-- So it's safe to grant execute - non-admins will get proper error messages;
