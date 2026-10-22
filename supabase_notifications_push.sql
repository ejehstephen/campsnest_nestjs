-- ============================================================================
-- CAMPSNEST 2.0: NOTIFICATIONS & WEB PUSH DATABASE CONFIGURATION
-- ============================================================================
-- Run this script in the Supabase Dashboard -> SQL Editor -> New Query.
-- It fixes:
--   1. Ensures notifications table has all necessary columns (including data JSONB)
--   2. Enables clean RLS policies so notifications can be inserted and viewed reliably
--   3. Adds a convenient send_notification() helper function
-- ============================================================================

-- 1. Ensure notifications table exists
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'system',
  is_read BOOLEAN DEFAULT false,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure data column exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'notifications' AND column_name = 'data'
  ) THEN
    ALTER TABLE public.notifications ADD COLUMN data JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- 2. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop old overly-restrictive policies
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users and system can insert notifications" ON public.notifications;

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view own notifications" 
  ON public.notifications FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (e.g. mark as read)
CREATE POLICY "Users can update own notifications" 
  ON public.notifications FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" 
  ON public.notifications FOR DELETE 
  USING (auth.uid() = user_id);

-- Policy: Authenticated users & system can insert notifications
CREATE POLICY "Users and system can insert notifications" 
  ON public.notifications FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Stored Procedure: send_notification()
CREATE OR REPLACE FUNCTION public.send_notification(
  p_user_id UUID,
  p_title TEXT,
  p_body TEXT,
  p_type TEXT DEFAULT 'system',
  p_action_url TEXT DEFAULT '/notifications',
  p_action_text TEXT DEFAULT 'View Alert'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notif_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    title,
    body,
    type,
    is_read,
    data,
    created_at
  ) VALUES (
    p_user_id,
    p_title,
    p_body,
    p_type,
    false,
    jsonb_build_object('action_url', p_action_url, 'action_text', p_action_text),
    NOW()
  )
  RETURNING id INTO v_notif_id;

  RETURN v_notif_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.send_notification TO anon, authenticated, service_role;
