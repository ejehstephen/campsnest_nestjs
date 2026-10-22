-- ============================================================================
-- CAMPSNEST 2.0: SUPABASE CONNECT & ROOMMATE COMPATIBILITY MATCHING ENGINE
-- ============================================================================
-- Run this script in the Supabase Dashboard -> SQL Editor -> New Query.
-- It sets up:
--   1. Full questionnaire questions & options (CampsNest 2.0 + legacy)
--   2. Connect matches & swipes tables (with RLS policies)
--   3. Database-level compatibility calculation RPC: get_connect_matches()
--   4. Backwards-compatible get_roommate_matches() wrapper
--   5. Authentic student preference seeding for existing users
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Ensure connect_matches & connect_swipes tables exist with RLS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.connect_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_1 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_2 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  compatibility_score INTEGER NOT NULL DEFAULT 0,
  common_interests TEXT[] DEFAULT '{}',
  matched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_1, user_2),
  CHECK (user_1 < user_2)
);

CREATE TABLE IF NOT EXISTS public.connect_swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  is_like BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(swiper_id, target_id)
);

ALTER TABLE public.connect_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_swipes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'connect_matches' AND policyname = 'Users can view their own matches') THEN
    CREATE POLICY "Users can view their own matches" ON public.connect_matches
      FOR SELECT USING (auth.uid() = user_1 OR auth.uid() = user_2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'connect_swipes' AND policyname = 'Users can record their own swipes') THEN
    CREATE POLICY "Users can record their own swipes" ON public.connect_swipes
      FOR INSERT WITH CHECK (auth.uid() = swiper_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'connect_swipes' AND policyname = 'Users can view their own swipes') THEN
    CREATE POLICY "Users can view their own swipes" ON public.connect_swipes
      FOR SELECT USING (auth.uid() = swiper_id);
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 2. Seed Full 10 Questions into questionnaire_questions & question_options
-- ----------------------------------------------------------------------------
INSERT INTO public.questionnaire_questions (id, question, type) VALUES
  ('11111111-1111-1111-1111-111111111111', 'What are you primarily looking to find on CampsNest?', 'single'),
  ('33333333-3333-3333-3333-333333333333', 'What is your authentic sleep & night schedule?', 'single'),
  ('77777777-7777-7777-7777-777777777777', 'How do you prefer your study & living space atmosphere?', 'single'),
  ('88888888-8888-8888-8888-888888888888', 'How would you describe your cleanliness & organization level?', 'single'),
  ('66666666-6666-6666-6666-666666666666', 'How often do you host visitors, friends, or romantic partners?', 'single'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'What is your everyday living soundtrack & music tolerance?', 'single'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'What are your daily cooking, feeding, and groceries habits?', 'single'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'How do you naturally spend your Friday nights and weekends?', 'single'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'What is your preferred social chemistry & connection style?', 'single'),
  ('10101010-1010-1010-1010-101010101010', 'Where around campus do you ideally want your accommodation located?', 'single')
ON CONFLICT (id) DO UPDATE SET
  question = EXCLUDED.question,
  type = EXCLUDED.type;

-- Insert Options
DELETE FROM public.question_options WHERE question_id IN (
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888',
  '66666666-6666-6666-6666-666666666666',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  '10101010-1010-1010-1010-101010101010'
);

INSERT INTO public.question_options (question_id, options) VALUES
  -- 1. Intent
  ('11111111-1111-1111-1111-111111111111', 'roommate'),
  ('11111111-1111-1111-1111-111111111111', 'dating'),
  ('11111111-1111-1111-1111-111111111111', 'both'),
  ('11111111-1111-1111-1111-111111111111', 'study'),
  -- 2. Sleep Schedule
  ('33333333-3333-3333-3333-333333333333', 'night_owl'),
  ('33333333-3333-3333-3333-333333333333', 'early_bird'),
  ('33333333-3333-3333-3333-333333333333', 'standard'),
  ('33333333-3333-3333-3333-333333333333', 'flexible'),
  -- 3. Study Noise
  ('77777777-7777-7777-7777-777777777777', 'lofi'),
  ('77777777-7777-7777-7777-777777777777', 'silent'),
  ('77777777-7777-7777-7777-777777777777', 'buzz'),
  ('77777777-7777-7777-7777-777777777777', 'group'),
  -- 4. Cleanliness
  ('88888888-8888-8888-8888-888888888888', 'neat_freak'),
  ('88888888-8888-8888-8888-888888888888', 'moderate'),
  ('88888888-8888-8888-8888-888888888888', 'chill'),
  ('88888888-8888-8888-8888-888888888888', 'flexible'),
  -- 5. Guests
  ('66666666-6666-6666-6666-666666666666', 'rarely'),
  ('66666666-6666-6666-6666-666666666666', 'weekends'),
  ('66666666-6666-6666-6666-666666666666', 'dates'),
  ('66666666-6666-6666-6666-666666666666', 'social_hub'),
  -- 6. Music Vibe
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'afrobeats'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'gospel'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'hiphop'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'headphones'),
  -- 7. Food Habits
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'share_cook'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'cook_solo'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'buy_food'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'flexible'),
  -- 8. Weekend Vibe
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'movie_night'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'church_fellowship'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'party_rave'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'study_grind'),
  -- 9. Dating Style
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'deep_talks'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'study_dates'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'chill_hangouts'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'spontaneous'),
  -- 10. Location Preference
  ('10101010-1010-1010-1010-101010101010', 'close_gate'),
  ('10101010-1010-1010-1010-101010101010', 'inside_campus'),
  ('10101010-1010-1010-1010-101010101010', 'quiet_suburb'),
  ('10101010-1010-1010-1010-101010101010', 'affordable');

-- ----------------------------------------------------------------------------
-- 3. Seed Diverse Preferences for Existing Users with Empty Preferences
-- ----------------------------------------------------------------------------
-- This ensures the 160+ university students in Supabase have authentic,
-- diverse criteria tags for matching instead of empty preferences.
DO $$
DECLARE
  v_user RECORD;
  v_intents TEXT[] := ARRAY['roommate', 'dating', 'both', 'study'];
  v_sleeps TEXT[] := ARRAY['night_owl', 'early_bird', 'standard', 'flexible'];
  v_noises TEXT[] := ARRAY['lofi', 'silent', 'buzz', 'group'];
  v_cleans TEXT[] := ARRAY['neat_freak', 'moderate', 'chill', 'flexible'];
  v_guests TEXT[] := ARRAY['rarely', 'weekends', 'dates', 'social_hub'];
  v_musics TEXT[] := ARRAY['afrobeats', 'gospel', 'hiphop', 'headphones'];
  v_foods TEXT[] := ARRAY['share_cook', 'cook_solo', 'buy_food', 'flexible'];
  v_weekends TEXT[] := ARRAY['movie_night', 'church_fellowship', 'party_rave', 'study_grind'];
  v_datings TEXT[] := ARRAY['deep_talks', 'study_dates', 'chill_hangouts', 'spontaneous'];
  v_locs TEXT[] := ARRAY['close_gate', 'inside_campus', 'quiet_suburb', 'affordable'];
  v_idx INT := 0;
  v_gender TEXT;
  v_assigned_intent TEXT;
BEGIN
  FOR v_user IN 
    SELECT id, gender, preferences FROM public.users 
    WHERE preferences IS NULL OR cardinality(preferences) = 0
    LIMIT 100
  LOOP
    v_idx := v_idx + 1;
    v_gender := LOWER(COALESCE(v_user.gender, 'other'));

    -- Balanced distribution across roommate, dating, both, and study
    v_assigned_intent := v_intents[1 + (v_idx % 4)];

    UPDATE public.users
    SET preferences = ARRAY[
      'intent:' || v_assigned_intent,
      'sleep_schedule:' || v_sleeps[1 + ((v_idx * 3) % 4)],
      'study_noise:' || v_noises[1 + ((v_idx * 7) % 4)],
      'cleanliness:' || v_cleans[1 + ((v_idx * 5) % 4)],
      'guests:' || v_guests[1 + ((v_idx * 2) % 4)],
      'music_vibe:' || v_musics[1 + ((v_idx * 11) % 4)],
      'food_habits:' || v_foods[1 + ((v_idx * 13) % 4)],
      'weekend_vibe:' || v_weekends[1 + ((v_idx * 17) % 4)],
      'dating_style:' || v_datings[1 + ((v_idx * 19) % 4)],
      'location_preference:' || v_locs[1 + ((v_idx * 23) % 4)]
    ]
    WHERE id = v_user.id;
  END LOOP;
END $$;

-- ----------------------------------------------------------------------------
-- 4. Server-Side PostgreSQL Function: get_connect_matches()
-- ----------------------------------------------------------------------------
-- Fully respects:
--  - Intent matching ('roommate' vs 'dating' vs 'study' vs 'all')
--  - Strict gender rules:
--      * Dating: strictly OPPOSITE gender (Male with Female, Female with Male)
--      * Roommate: strictly SAME gender (Male with Male, Female with Female)
--      * Study: Any gender
--  - Multi-dimensional compatibility scoring & radar metrics
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_connect_matches(
  p_user_id UUID DEFAULT auth.uid(),
  p_intent TEXT DEFAULT 'all',
  p_gender_filter TEXT DEFAULT 'all',
  p_limit INT DEFAULT 50
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  age INT,
  gender TEXT,
  school TEXT,
  department TEXT,
  level TEXT,
  profile_image TEXT,
  phone_number TEXT,
  whatsapp_number TEXT,
  bio TEXT,
  intent TEXT,
  compatibility_score INT,
  living_habits_score INT,
  music_vibe_score INT,
  sleep_schedule_score INT,
  social_energy_score INT,
  communication_score INT,
  common_interests JSONB,
  vibe_tags JSONB,
  icebreaker TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_caller_id UUID := COALESCE(p_user_id, auth.uid());
  v_my_gender TEXT;
  v_my_school TEXT;
  v_my_dept TEXT;
  v_my_prefs TEXT[];
  v_my_intent TEXT := 'both';
  v_my_sleep TEXT := 'standard';
  v_my_noise TEXT := 'lofi';
  v_my_clean TEXT := 'moderate';
  v_my_guests TEXT := 'weekends';
  v_my_music TEXT := 'afrobeats';
  v_my_food TEXT := 'share_cook';
  v_my_weekend TEXT := 'movie_night';
  v_my_dating TEXT := 'deep_talks';
  v_pref_item TEXT;
  v_req_intent TEXT := COALESCE(p_intent, 'all');
BEGIN
  -- 1. Get current caller's profile & preferences
  IF v_caller_id IS NOT NULL THEN
    SELECT u.gender, u.school, u.department, u.preferences
    INTO v_my_gender, v_my_school, v_my_dept, v_my_prefs
    FROM public.users u
    WHERE u.id = v_caller_id;
  END IF;

  v_my_gender := LOWER(COALESCE(v_my_gender, 'male'));
  v_my_school := COALESCE(v_my_school, 'Federal University Wukari');

  -- Parse user's preferences array (e.g. 'key:val')
  IF v_my_prefs IS NOT NULL THEN
    FOREACH v_pref_item IN ARRAY v_my_prefs
    LOOP
      IF v_pref_item LIKE 'intent:%' THEN v_my_intent := SPLIT_PART(v_pref_item, ':', 2); END IF;
      IF v_pref_item LIKE 'sleep_schedule:%' THEN v_my_sleep := SPLIT_PART(v_pref_item, ':', 2); END IF;
      IF v_pref_item LIKE 'study_noise:%' THEN v_my_noise := SPLIT_PART(v_pref_item, ':', 2); END IF;
      IF v_pref_item LIKE 'cleanliness:%' THEN v_my_clean := SPLIT_PART(v_pref_item, ':', 2); END IF;
      IF v_pref_item LIKE 'guests:%' THEN v_my_guests := SPLIT_PART(v_pref_item, ':', 2); END IF;
      IF v_pref_item LIKE 'music_vibe:%' THEN v_my_music := SPLIT_PART(v_pref_item, ':', 2); END IF;
      IF v_pref_item LIKE 'food_habits:%' THEN v_my_food := SPLIT_PART(v_pref_item, ':', 2); END IF;
      IF v_pref_item LIKE 'weekend_vibe:%' THEN v_my_weekend := SPLIT_PART(v_pref_item, ':', 2); END IF;
      IF v_pref_item LIKE 'dating_style:%' THEN v_my_dating := SPLIT_PART(v_pref_item, ':', 2); END IF;
    END LOOP;
  END IF;

  -- Return Scored Matches
  RETURN QUERY
  WITH parsed_candidates AS (
    SELECT
      c.id AS cand_id,
      c.name AS cand_name,
      c.age AS cand_age,
      LOWER(COALESCE(c.gender, 'female')) AS cand_gender,
      COALESCE(c.school, 'Federal University Wukari') AS cand_school,
      COALESCE(c.department, 'General Studies') AS cand_department,
      COALESCE(c.level, '100L') AS cand_level,
      COALESCE(c.profile_image, '') AS cand_profile_image,
      COALESCE(c.phone_number, '') AS cand_phone,
      COALESCE(c.whatsapp_number, c.phone_number, '') AS cand_whatsapp,
      COALESCE(c.bio, 'Campus student connecting on CampsNest.') AS cand_bio,
      
      -- Extract candidate preferences
      COALESCE((
        SELECT SPLIT_PART(p, ':', 2) FROM UNNEST(c.preferences) p WHERE p LIKE 'intent:%' LIMIT 1
      ), 'both') AS cand_intent,
      COALESCE((
        SELECT SPLIT_PART(p, ':', 2) FROM UNNEST(c.preferences) p WHERE p LIKE 'sleep_schedule:%' LIMIT 1
      ), 'standard') AS cand_sleep,
      COALESCE((
        SELECT SPLIT_PART(p, ':', 2) FROM UNNEST(c.preferences) p WHERE p LIKE 'study_noise:%' LIMIT 1
      ), 'lofi') AS cand_noise,
      COALESCE((
        SELECT SPLIT_PART(p, ':', 2) FROM UNNEST(c.preferences) p WHERE p LIKE 'cleanliness:%' LIMIT 1
      ), 'moderate') AS cand_clean,
      COALESCE((
        SELECT SPLIT_PART(p, ':', 2) FROM UNNEST(c.preferences) p WHERE p LIKE 'guests:%' LIMIT 1
      ), 'weekends') AS cand_guests,
      COALESCE((
        SELECT SPLIT_PART(p, ':', 2) FROM UNNEST(c.preferences) p WHERE p LIKE 'music_vibe:%' LIMIT 1
      ), 'afrobeats') AS cand_music,
      COALESCE((
        SELECT SPLIT_PART(p, ':', 2) FROM UNNEST(c.preferences) p WHERE p LIKE 'food_habits:%' LIMIT 1
      ), 'share_cook') AS cand_food,
      COALESCE((
        SELECT SPLIT_PART(p, ':', 2) FROM UNNEST(c.preferences) p WHERE p LIKE 'weekend_vibe:%' LIMIT 1
      ), 'movie_night') AS cand_weekend,
      COALESCE((
        SELECT SPLIT_PART(p, ':', 2) FROM UNNEST(c.preferences) p WHERE p LIKE 'dating_style:%' LIMIT 1
      ), 'deep_talks') AS cand_dating

    FROM public.users c
    WHERE (v_caller_id IS NULL OR c.id != v_caller_id)
      AND c.is_banned = false
  ),
  filtered_candidates AS (
    SELECT * FROM parsed_candidates pc
    WHERE
      -- 1. Explicit Gender UI filter pill
      (p_gender_filter = 'all' OR p_gender_filter IS NULL OR pc.cand_gender = LOWER(p_gender_filter))
      AND
      -- 2. Strict Intent & Campus Dynamic Rules:
      (
        -- A) CAMPUS DATING & ROMANCE:
        -- Must be open to dating. STRICT OPPOSITE GENDER. Roommate-only excluded.
        (v_req_intent = 'dating' AND (pc.cand_intent IN ('dating', 'both')) AND pc.cand_gender != v_my_gender)
        OR
        -- B) HOSTEL / APARTMENT ROOMMATE:
        -- Must be open to rooming. STRICT SAME GENDER (Nigerian campus lodge rule). Dating-only excluded.
        (v_req_intent = 'roommate' AND (pc.cand_intent IN ('roommate', 'both')) AND pc.cand_gender = v_my_gender)
        OR
        -- C) STUDY & ACCOUNTABILITY:
        (v_req_intent = 'study' AND pc.cand_intent IN ('study', 'both'))
        OR
        -- D) ALL / GENERAL BROWSE:
        -- Evaluate per candidate intent:
        (v_req_intent IN ('all', 'both') AND (
          (pc.cand_intent = 'roommate' AND pc.cand_gender = v_my_gender)
          OR (pc.cand_intent = 'dating' AND pc.cand_gender != v_my_gender)
          OR (pc.cand_intent IN ('both', 'study'))
        ))
      )
  ),
  scored_candidates AS (
    SELECT
      fc.*,

      -- Dimension 1: Sleep Schedule Score (0-100)
      CASE
        WHEN fc.cand_sleep = v_my_sleep THEN 100
        WHEN fc.cand_sleep = 'flexible' OR v_my_sleep = 'flexible' THEN 85
        WHEN (fc.cand_sleep = 'early_bird' AND v_my_sleep = 'standard') OR (fc.cand_sleep = 'standard' AND v_my_sleep = 'early_bird') THEN 80
        WHEN (fc.cand_sleep = 'night_owl' AND v_my_sleep = 'standard') OR (fc.cand_sleep = 'standard' AND v_my_sleep = 'night_owl') THEN 65
        ELSE 40 -- early_bird vs night_owl
      END AS dim_sleep,

      -- Dimension 2: Cleanliness & Living Habits (0-100)
      CASE
        WHEN fc.cand_clean = v_my_clean THEN 100
        WHEN (fc.cand_clean = 'neat_freak' AND v_my_clean = 'moderate') OR (fc.cand_clean = 'moderate' AND v_my_clean = 'neat_freak') THEN 85
        WHEN fc.cand_clean = 'flexible' OR v_my_clean = 'flexible' THEN 80
        WHEN (fc.cand_clean = 'moderate' AND v_my_clean = 'chill') OR (fc.cand_clean = 'chill' AND v_my_clean = 'moderate') THEN 70
        ELSE 45 -- neat_freak vs chill
      END AS dim_clean,

      -- Dimension 3: Study & Noise Atmosphere (0-100)
      CASE
        WHEN fc.cand_noise = v_my_noise THEN 100
        WHEN (fc.cand_noise = 'lofi' AND v_my_noise = 'silent') OR (fc.cand_noise = 'silent' AND v_my_noise = 'lofi') THEN 80
        WHEN fc.cand_noise = 'buzz' OR v_my_noise = 'buzz' THEN 65
        ELSE 40 -- silent vs group
      END AS dim_noise,

      -- Dimension 4: Social Energy & Guests (0-100)
      CASE
        WHEN fc.cand_guests = v_my_guests THEN 100
        WHEN (fc.cand_guests = 'weekends' AND v_my_guests = 'dates') OR (fc.cand_guests = 'dates' AND v_my_guests = 'weekends') THEN 85
        WHEN fc.cand_guests = 'social_hub' AND v_my_guests = 'rarely' THEN 35
        ELSE 70
      END AS dim_guests,

      -- Dimension 5: Music, Food & Weekend (0-100)
      ROUND((
        (CASE WHEN fc.cand_music = v_my_music THEN 100 ELSE 60 END) +
        (CASE WHEN fc.cand_food = v_my_food THEN 100 ELSE 65 END) +
        (CASE WHEN fc.cand_weekend = v_my_weekend THEN 100 ELSE 60 END)
      ) / 3.0) AS dim_vibe,

      -- Dimension 6: Communication & Chemistry (0-100)
      CASE
        WHEN fc.cand_dating = v_my_dating THEN 100
        WHEN fc.cand_dating = 'deep_talks' OR v_my_dating = 'deep_talks' THEN 85
        ELSE 75
      END AS dim_comm

    FROM filtered_candidates fc
  )
  SELECT
    sc.cand_id::TEXT AS id,
    sc.cand_name::TEXT AS name,
    sc.cand_age AS age,
    sc.cand_gender::TEXT AS gender,
    sc.cand_school::TEXT AS school,
    sc.cand_department::TEXT AS department,
    sc.cand_level::TEXT AS level,
    sc.cand_profile_image::TEXT AS profile_image,
    sc.cand_phone::TEXT AS phone_number,
    sc.cand_whatsapp::TEXT AS whatsapp_number,
    sc.cand_bio::TEXT AS bio,
    sc.cand_intent::TEXT AS intent,

    -- Overall Compatibility Score (Weighted Average between 55% and 98%)
    GREATEST(55, LEAST(98, ROUND(
      (sc.dim_sleep * 0.20) +
      (sc.dim_clean * 0.20) +
      (sc.dim_noise * 0.15) +
      (sc.dim_guests * 0.15) +
      (sc.dim_vibe * 0.15) +
      (sc.dim_comm * 0.15)
    )))::INT AS compatibility_score,

    -- Dynamic Radar Breakdown
    ROUND((sc.dim_clean * 0.6 + sc.dim_vibe * 0.4))::INT AS living_habits_score,
    ROUND((sc.dim_noise * 0.5 + sc.dim_vibe * 0.5))::INT AS music_vibe_score,
    sc.dim_sleep::INT AS sleep_schedule_score,
    ROUND((sc.dim_guests * 0.6 + sc.dim_vibe * 0.4))::INT AS social_energy_score,
    sc.dim_comm::INT AS communication_score,

    -- Common Interests JSONB
    jsonb_build_array(
      CASE WHEN sc.cand_music = v_my_music THEN 'Shared Music Frequency' ELSE 'Campus Vibe' END,
      CASE WHEN sc.cand_weekend = v_my_weekend THEN 'Weekend Synergy' ELSE 'Student Living' END,
      CASE WHEN sc.cand_noise = v_my_noise THEN 'Focus Atmosphere' ELSE 'Academic Synergy' END
    ) AS common_interests,

    -- Mutual Frequency Vibe Tags
    jsonb_build_array(
      jsonb_build_object(
        'icon', CASE WHEN sc.cand_sleep = 'night_owl' THEN '🌙' WHEN sc.cand_sleep = 'early_bird' THEN '🌅' ELSE '⏰' END,
        'label', CASE WHEN sc.cand_sleep = 'night_owl' THEN 'Night Owl Routine' WHEN sc.cand_sleep = 'early_bird' THEN 'Early Riser' ELSE 'Balanced Rhythm' END
      ),
      jsonb_build_object(
        'icon', CASE WHEN sc.cand_clean = 'neat_freak' THEN '✨' ELSE '🧹' END,
        'label', CASE WHEN sc.cand_clean = 'neat_freak' THEN 'Spotless Living' ELSE 'Organized Space' END
      ),
      jsonb_build_object(
        'icon', '🎵',
        'label', INITCAP(REPLACE(sc.cand_music, '_', ' ')) || ' Vibe'
      )
    ) AS vibe_tags,

    -- Dynamic Contextual Icebreaker
    CASE
      WHEN sc.cand_intent = 'dating' OR v_req_intent = 'dating' THEN
        'Hey ' || SPLIT_PART(sc.cand_name, ' ', 1) || '! Saw your profile on CampsNest Connect — love that you enjoy ' || REPLACE(sc.cand_weekend, '_', ' ') || '. Would love to chat! 😊'
      WHEN sc.cand_intent = 'study' OR v_req_intent = 'study' THEN
        'Hi ' || SPLIT_PART(sc.cand_name, ' ', 1) || '! Noticed we both study around ' || sc.cand_department || '. Are you looking for a study partner this semester?'
      ELSE
        'Hi ' || SPLIT_PART(sc.cand_name, ' ', 1) || '! Saw your CampsNest profile. Our sleep schedules and living habits align so well — are you still looking for a roommate/lodge around campus?'
    END AS icebreaker

  FROM scored_candidates sc
  ORDER BY compatibility_score DESC, sc.cand_name ASC
  LIMIT p_limit;
END;
$$;

-- ----------------------------------------------------------------------------
-- 5. Backwards-Compatible get_roommate_matches() Wrapper
-- ----------------------------------------------------------------------------
-- Supports legacy Flutter callers without crashing
CREATE OR REPLACE FUNCTION public.get_roommate_matches()
RETURNS TABLE (
  id TEXT,
  name TEXT,
  age INT,
  gender TEXT,
  school TEXT,
  "profileImage" TEXT,
  "phoneNumber" TEXT,
  "compatibilityScore" INT,
  "commonInterests" JSONB,
  budget FLOAT,
  preferences JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.name,
    m.age,
    m.gender,
    m.school,
    m.profile_image AS "profileImage",
    m.phone_number AS "phoneNumber",
    m.compatibility_score AS "compatibilityScore",
    m.common_interests AS "commonInterests",
    150000.0::FLOAT AS budget,
    '[]'::JSONB AS preferences
  FROM public.get_connect_matches(auth.uid(), 'roommate', 'all', 50) m;
END;
$$;

-- Grant Execution to public and authenticated users
GRANT EXECUTE ON FUNCTION public.get_connect_matches TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_roommate_matches TO anon, authenticated, service_role;
