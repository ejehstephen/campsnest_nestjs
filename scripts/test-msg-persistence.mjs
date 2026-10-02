import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mmzchrpwefipnmodpwor.supabase.co';
const supabaseKey = 'sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEnsureConvAndSendMsg() {
  const convId = 'f1e3321f-9553-4ef0-a369-1762325fde83';
  const senderId = '433b3374-3bc7-41a3-9207-bc5e1f9d5627';

  // 1. Ensure conversation exists
  const { data: conv, error: convErr } = await supabase
    .from('conversations')
    .upsert({
      id: convId,
      title: 'Executive Lodge Chat',
      type: 'housing',
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' })
    .select();
  
  console.log("Upsert conversation:", { conv, convErr });

  // 2. Insert message
  const { data: msg, error: msgErr } = await supabase
    .from('messages')
    .insert({
      conversation_id: convId,
      sender_id: senderId,
      text: 'Testing real live message persistence at ' + new Date().toLocaleTimeString()
    })
    .select();
  
  console.log("Insert message:", { msg, msgErr });

  // 3. Select messages for this conversation
  const { data: msgs, error: fetchErr } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', convId)
    .order('created_at', { ascending: true });

  console.log("Fetched messages:", msgs);
}

testEnsureConvAndSendMsg();
