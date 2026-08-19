-- Drop and recreate get_recent_test_submissions to return JSONB
-- This fixes "structure of query does not match function result type" error

DROP FUNCTION IF EXISTS public.get_recent_test_submissions(integer);

CREATE OR REPLACE FUNCTION public.get_recent_test_submissions(
  p_limit integer DEFAULT 20
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
BEGIN
  -- Only admins can access this data
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  SELECT jsonb_agg(
    jsonb_build_object(
      'attempt_id', a.id::text,
      'user_id', a.user_id::text,
      'user_email', COALESCE(u.email, ''),
      'usage', a.mode::text,
      'entry_test_name', et.name,
      'subject_name', COALESCE(
        -- For practice mode: get subject from topic
        s_topic.name,
        -- For mock mode: get subject from test_subject
        s_test.name
      ),
      'score_percent', COALESCE(
        CASE 
          WHEN mr.total_questions > 0 
          THEN ROUND(mr.score_percent, 2)
          ELSE 0
        END,
        0
      ),
      'submitted_at', a.submitted_at::text
    )
  )
  INTO v_result
  FROM (
    SELECT *
    FROM public.attempts
    WHERE submitted_at IS NOT NULL
    ORDER BY submitted_at DESC
    LIMIT p_limit
  ) a
  LEFT JOIN auth.users u ON a.user_id = u.id
  LEFT JOIN public.entry_tests et ON a.entry_test_id = et.id
  -- For practice mode attempts (topic_id)
  LEFT JOIN public.topics t ON a.topic_id = t.id
  LEFT JOIN public.subjects s_topic ON t.subject_id = s_topic.id
  -- For mock mode attempts (test_subject_id)
  LEFT JOIN public.test_subjects ts ON a.test_subject_id = ts.id
  LEFT JOIN public.subjects s_test ON ts.subject_id = s_test.id
  -- Get score from mock_results
  LEFT JOIN public.mock_results mr ON a.id = mr.attempt_id;

  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$;

COMMENT ON FUNCTION public.get_recent_test_submissions IS 'Returns recent test submissions as JSONB array for admin dashboard';;
