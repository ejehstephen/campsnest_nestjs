# CAMPSNEST 2.0 — DATABASE SCHEMA SPECIFICATION

This document outlines the complete PostgreSQL database schema for **CampsNest 2.0** on Supabase. It maintains backwards compatibility with data and models from CampsNest 1.0 (Flutter) while adding full relational architectures for **Marketplace**, **Housing 2.0 & Inspections**, **Connect (Social Matching)**, **Unified Messaging**, and **Trust & Safety**.

---

## 1. PostgreSQL Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fast fuzzy search in housing & marketplace
```

---

## 2. Enumerations & Custom Types

```sql
-- User Roles
CREATE TYPE user_role AS ENUM ('user', 'host', 'admin', 'super_admin');

-- Housing Types
CREATE TYPE housing_type AS ENUM ('self_contain', 'single_room', 'shared_apartment', 'flat', 'duplex');

-- Housing Availability
CREATE TYPE housing_status AS ENUM ('available', 'inspection_scheduled', 'taken', 'inactive');

-- Gender Preferences
CREATE TYPE gender_preference AS ENUM ('male', 'female', 'any');

-- Marketplace Categories
CREATE TYPE market_category AS ENUM (
  'electronics',
  'computers',
  'books',
  'hostel_essentials',
  'fashion',
  'gaming',
  'kitchen_appliances',
  'others'
);

-- Marketplace Item Conditions
CREATE TYPE item_condition AS ENUM ('new', 'like_new', 'fairly_used', 'used');

-- Marketplace Item Status
CREATE TYPE market_item_status AS ENUM ('available', 'pending', 'sold', 'archived');

-- Inspection Status
CREATE TYPE inspection_status AS ENUM ('pending', 'scheduled', 'completed', 'cancelled');

-- Conversation Context Type
CREATE TYPE conversation_type AS ENUM ('direct', 'housing_inquiry', 'market_deal', 'connect_match', 'roommate_match');

-- Verification Status
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'approved', 'rejected');

-- Report Status & Moderation
CREATE TYPE report_status AS ENUM ('pending', 'under_review', 'resolved', 'dismissed');

-- Notification Types
CREATE TYPE notification_type AS ENUM ('system', 'admin', 'message', 'match', 'inspection', 'market_inquiry');
```

---

## 3. Core Database Tables

### 3.1 Users & Profiles (`users`)
*Backward-compatible with Flutter `users` table while introducing expanded academic and profile attributes.*

```sql
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  profile_image TEXT,
  school TEXT NOT NULL DEFAULT '',
  faculty TEXT,
  department TEXT,
  level TEXT, -- e.g. '100L', '200L', '300L', '400L', '500L', 'Postgraduate'
  age INTEGER NOT NULL DEFAULT 18,
  gender TEXT NOT NULL DEFAULT 'other',
  phone_number TEXT,
  whatsapp_number TEXT,
  bio TEXT,
  preferences TEXT[] DEFAULT '{}',
  role user_role NOT NULL DEFAULT 'user',
  is_banned BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_super_admin BOOLEAN NOT NULL DEFAULT false,
  privacy_show_profile BOOLEAN NOT NULL DEFAULT true,
  privacy_show_marketplace BOOLEAN NOT NULL DEFAULT true,
  privacy_allow_matching BOOLEAN NOT NULL DEFAULT true,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_school ON public.users(school);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_verified ON public.users(is_verified);
```

---

### 3.2 Housing & Accommodation (`room_listings`)
*Preserves `room_listings` naming for seamless migration while enhancing indexing and relations.*

```sql
CREATE TABLE IF NOT EXISTS public.room_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  house_type housing_type NOT NULL DEFAULT 'self_contain',
  price NUMERIC(12, 2) NOT NULL,
  inspection_fee NUMERIC(10, 2) DEFAULT 0.00,
  location TEXT NOT NULL,
  distance_from_campus TEXT, -- e.g. '5 mins walk', '1.2 km'
  school TEXT NOT NULL,
  gender_preference gender_preference NOT NULL DEFAULT 'any',
  available_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status housing_status NOT NULL DEFAULT 'available',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  report_count INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_room_listings_school ON public.room_listings(school);
CREATE INDEX idx_room_listings_price ON public.room_listings(price);
CREATE INDEX idx_room_listings_status ON public.room_listings(status);
CREATE INDEX idx_room_listings_owner ON public.room_listings(owner_id);
```

#### Housing Relational Tables
```sql
-- Listing Images
CREATE TABLE IF NOT EXISTS public.room_listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_listing_id UUID NOT NULL REFERENCES public.room_listings(id) ON DELETE CASCADE,
  images TEXT NOT NULL, -- Image URL
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_room_listing_images_listing_id ON public.room_listing_images(room_listing_id);

-- Listing Amenities
CREATE TABLE IF NOT EXISTS public.room_listing_amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_listing_id UUID NOT NULL REFERENCES public.room_listings(id) ON DELETE CASCADE,
  amenities TEXT NOT NULL -- e.g. 'Running Water', 'Prepaid Meter', 'Security'
);
CREATE INDEX idx_room_listing_amenities_listing_id ON public.room_listing_amenities(room_listing_id);

-- Listing Rules
CREATE TABLE IF NOT EXISTS public.room_listing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_listing_id UUID NOT NULL REFERENCES public.room_listings(id) ON DELETE CASCADE,
  rules TEXT NOT NULL -- e.g. 'No loud music after 10 PM', 'No pets'
);
CREATE INDEX idx_room_listing_rules_listing_id ON public.room_listing_rules(room_listing_id);

-- Saved / Bookmarked Houses
CREATE TABLE IF NOT EXISTS public.saved_houses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.room_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);
CREATE INDEX idx_saved_houses_user ON public.saved_houses(user_id);
```

---

### 3.3 Housing Inspection Bookings (`inspections`)

```sql
CREATE TABLE IF NOT EXISTS public.inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.room_listings(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  preferred_date DATE NOT NULL,
  preferred_time_slot TEXT NOT NULL, -- e.g. '10:00 AM - 12:00 PM'
  inspection_fee NUMERIC(10, 2) DEFAULT 0.00,
  status inspection_status NOT NULL DEFAULT 'pending',
  student_notes TEXT,
  host_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inspections_student ON public.inspections(student_id);
CREATE INDEX idx_inspections_host ON public.inspections(host_id);
CREATE INDEX idx_inspections_listing ON public.inspections(listing_id);
```

---

### 3.4 Campus Marketplace (`marketplace_items`)

```sql
CREATE TABLE IF NOT EXISTS public.marketplace_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category market_category NOT NULL DEFAULT 'others',
  condition item_condition NOT NULL DEFAULT 'fairly_used',
  price NUMERIC(12, 2) NOT NULL,
  school TEXT NOT NULL,
  campus_location TEXT, -- e.g. 'Hostel Block B', 'Campus Gate'
  images TEXT[] NOT NULL DEFAULT '{}',
  status market_item_status NOT NULL DEFAULT 'available',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  report_count INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_items_category ON public.marketplace_items(category);
CREATE INDEX idx_marketplace_items_school ON public.marketplace_items(school);
CREATE INDEX idx_marketplace_items_seller ON public.marketplace_items(seller_id);
CREATE INDEX idx_marketplace_items_status ON public.marketplace_items(status);

-- Saved Marketplace Items
CREATE TABLE IF NOT EXISTS public.saved_market_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);
CREATE INDEX idx_saved_market_items_user ON public.saved_market_items(user_id);
```

---

### 3.5 Connect & Roommate Questionnaire

```sql
-- Questionnaire Question Catalog
CREATE TABLE IF NOT EXISTS public.questionnaire_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  category TEXT DEFAULT 'personality', -- 'personality', 'lifestyle', 'academics', 'habits'
  type TEXT NOT NULL DEFAULT 'single', -- 'single', 'multiple', 'range'
  icon TEXT, -- e.g. '🎧', '🌙', '📚'
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Question Options
CREATE TABLE IF NOT EXISTS public.question_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES public.questionnaire_questions(id) ON DELETE CASCADE,
  options TEXT NOT NULL,
  emoji TEXT,
  sort_order INTEGER DEFAULT 0
);
CREATE INDEX idx_question_options_q_id ON public.question_options(question_id);

-- User Questionnaire Answers
CREATE TABLE IF NOT EXISTS public.questionnaire_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questionnaire_questions(id) ON DELETE CASCADE,
  text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);
CREATE INDEX idx_questionnaire_answers_user ON public.questionnaire_answers(user_id);

-- Answer Values (for multi-selection)
CREATE TABLE IF NOT EXISTS public.answer_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  answer_id UUID NOT NULL REFERENCES public.questionnaire_answers(id) ON DELETE CASCADE,
  answers TEXT NOT NULL
);
CREATE INDEX idx_answer_values_answer_id ON public.answer_values(answer_id);
```

---

### 3.6 Connect Swipes & Matches

```sql
-- Connect Matches
CREATE TABLE IF NOT EXISTS public.connect_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_1 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_2 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  compatibility_score INTEGER NOT NULL DEFAULT 0,
  common_interests TEXT[] DEFAULT '{}',
  matched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_1, user_2),
  CHECK (user_1 < user_2)
);

CREATE INDEX idx_connect_matches_user1 ON public.connect_matches(user_1);
CREATE INDEX idx_connect_matches_user2 ON public.connect_matches(user_2);

-- Swipes / Likes tracking
CREATE TABLE IF NOT EXISTS public.connect_swipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swiper_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  is_like BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(swiper_id, target_id)
);
```

---

### 3.7 Unified Messaging System

```sql
-- Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type conversation_type NOT NULL DEFAULT 'direct',
  context_title TEXT, -- e.g. 'iPhone 13 Pro', 'Self-Contain at Gate'
  context_image TEXT,
  listing_id UUID REFERENCES public.room_listings(id) ON DELETE SET NULL,
  market_item_id UUID REFERENCES public.marketplace_items(id) ON DELETE SET NULL,
  match_id UUID REFERENCES public.connect_matches(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Conversation Participants
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  is_muted BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_conv_participants_user ON public.conversation_participants(user_id);
CREATE INDEX idx_conv_participants_conv ON public.conversation_participants(conversation_id);

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachment_url TEXT,
  attachment_type TEXT, -- 'image', 'document'
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
```

---

### 3.8 Trust, Safety, Verification & Moderation

```sql
-- User Verification Requests (KYC)
CREATE TABLE IF NOT EXISTS public.verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL DEFAULT CURRENT_DATE,
  nin_number TEXT NOT NULL,
  document_type TEXT NOT NULL, -- 'student_id', 'nin_slip', 'driver_license', 'voters_card'
  front_image_url TEXT NOT NULL,
  back_image_url TEXT,
  status verification_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_verification_requests_user ON public.verification_requests(user_id);
CREATE INDEX idx_verification_requests_status ON public.verification_requests(status);

-- Content & User Reports
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reported_listing_id UUID REFERENCES public.room_listings(id) ON DELETE CASCADE,
  reported_item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
  reported_message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status report_status NOT NULL DEFAULT 'pending',
  resolved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_reporter ON public.reports(reporter_id);

-- Blocked Users (Two-way interaction block)
CREATE TABLE IF NOT EXISTS public.blocked_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

CREATE INDEX idx_blocked_users_blocker ON public.blocked_users(blocker_id);
CREATE INDEX idx_blocked_users_blocked ON public.blocked_users(blocked_id);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'system',
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read);

-- Dynamic Application Config
CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default configuration
INSERT INTO public.app_config (key, value, description)
VALUES 
  ('support_whatsapp', '2348134351762', 'Primary WhatsApp support helpline'),
  ('inspection_fee_default', '1000', 'Default inspection admin fee in Naira')
ON CONFLICT (key) DO NOTHING;
```

---

## 4. Supabase Storage Buckets

The platform uses the following storage buckets with appropriate access controls:

| Bucket Name | Access | Allowed MIME Types | Purpose |
| :--- | :--- | :--- | :--- |
| `avatars` | **Public** | `image/*` | User profile avatars. |
| `listing-images` | **Public** | `image/*` | Housing property photos. |
| `marketplace-images` | **Public** | `image/*` | Marketplace item photos. |
| `chat-attachments` | **Authenticated** | `image/*`, `application/pdf` | Media sent in conversations. |
| `verification_docs` | **Private** | `image/*`, `application/pdf` | KYC / Student ID documents (signed URLs only for admin review). |

---

## 5. PostgreSQL Triggers & Stored Functions

### 5.1 Auto-create User Profile on Supabase Auth Signup
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    name,
    email,
    school,
    age,
    gender,
    role
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'Student'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'school', ''),
    COALESCE((NEW.raw_user_meta_data->>'age')::int, 18),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'other'),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 5.2 Auto-update `updated_at` Timestamp Trigger
```sql
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_listings_updated_at BEFORE UPDATE ON public.room_listings FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_market_updated_at BEFORE UPDATE ON public.marketplace_items FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER set_inspections_updated_at BEFORE UPDATE ON public.inspections FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
```

### 5.3 Activity Tracking RPC
```sql
CREATE OR REPLACE FUNCTION public.update_user_activity(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET last_active_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 6. Row-Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_listing_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_listing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_market_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 1. Users policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" 
  ON public.users FOR UPDATE USING (auth.uid() = id);

-- 2. Housing listings policies
CREATE POLICY "Active listings are viewable by everyone" 
  ON public.room_listings FOR SELECT USING (is_active = true OR auth.uid() = owner_id);
CREATE POLICY "Users can create listings" 
  ON public.room_listings FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own listings" 
  ON public.room_listings FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own listings" 
  ON public.room_listings FOR DELETE USING (auth.uid() = owner_id);

-- 3. Marketplace policies
CREATE POLICY "Marketplace items are viewable by everyone" 
  ON public.marketplace_items FOR SELECT USING (true);
CREATE POLICY "Users can create marketplace items" 
  ON public.marketplace_items FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own marketplace items" 
  ON public.marketplace_items FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Users can delete own marketplace items" 
  ON public.marketplace_items FOR DELETE USING (auth.uid() = seller_id);

-- 4. Unified Messages policies
CREATE POLICY "Users can view messages in their conversations" 
  ON public.messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants 
      WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert messages into their conversations" 
  ON public.messages FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversation_participants 
      WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
    )
  );
```
