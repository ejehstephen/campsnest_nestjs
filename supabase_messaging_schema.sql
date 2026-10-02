-- ============================================================================
-- CampsNest 2.0 Messaging System Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/mmzchrpwefipnmodpwor/sql)
-- ============================================================================

-- 1. Create Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255),
    type VARCHAR(50) DEFAULT 'connect', -- 'market', 'housing', 'connect'
    context_id VARCHAR(255), -- references room_listing ID or marketplace_item ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Conversation Participants Table (links users to conversations)
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(conversation_id, user_id)
);

-- 3. Create Messages Table (stores individual chat messages)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    text TEXT NOT NULL,
    image_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Conversations: Allow authenticated users to view & insert
CREATE POLICY "Allow authenticated users to select conversations" 
ON public.conversations FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert conversations" 
ON public.conversations FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update conversations" 
ON public.conversations FOR UPDATE TO authenticated USING (true);

-- Conversation Participants: Allow authenticated users
CREATE POLICY "Allow authenticated users on conversation_participants" 
ON public.conversation_participants FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Messages: Allow authenticated users to read and send messages
CREATE POLICY "Allow authenticated users to select messages" 
ON public.messages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert messages" 
ON public.messages FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update messages" 
ON public.messages FOR UPDATE TO authenticated USING (true);

-- Allow public / anon read & insert if using publishable key during transitional phase
CREATE POLICY "Allow anon read messages" 
ON public.messages FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon insert messages" 
ON public.messages FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon read conversations" 
ON public.conversations FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon insert conversations" 
ON public.conversations FOR INSERT TO anon WITH CHECK (true);

-- 6. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON public.conversation_participants(user_id);
