import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mmzchrpwefipnmodpwor.supabase.co';
const supabaseKey = 'sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFullFlow() {
  const listingId = 'b9060c21-f32c-4b64-82b4-535c8a947c36';

  console.log("1. Upserting conversation...");
  const { data: conv, error: convErr } = await supabase.from('conversations').upsert({
    id: listingId,
    title: 'Executive Lodge Chat',
    type: 'housing',
    updated_at: new Date().toISOString()
  }).select();
  console.log("Conv result:", { conv, convErr });

  console.log("2. Inserting real message...");
  const { data: msg, error: msgErr } = await supabase.from('messages').insert({
    conversation_id: listingId,
    sender_id: 'fb52aba3-c740-4b38-b315-7dfaf7d7fa48',
    text: 'Hello, is this room still available for physical inspection tomorrow?',
    is_read: false
  }).select();
  console.log("Msg result:", { msg, msgErr });

  console.log("3. Fetching messages for conversation...");
  const { data: fetched, error: fetchErr } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', listingId)
    .order('created_at', { ascending: true });
  console.log("Fetched messages:", { count: fetched?.length, fetched, fetchErr });
}

testFullFlow();
