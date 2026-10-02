import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mmzchrpwefipnmodpwor.supabase.co';
const supabaseKey = 'sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testNewConvFlow() {
  const newConvId = '11111111-2222-3333-4444-555555555555';
  const senderId = '433b3374-3bc7-41a3-9207-bc5e1f9d5627';

  // 1. Check if conversation exists
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', newConvId)
    .maybeSingle();
  
  if (!existing) {
    console.log("Conversation does not exist, inserting...");
    const { data: newConv, error: cErr } = await supabase.from('conversations').insert({
      id: newConvId,
      title: 'Brand New Lodge Conversation',
      type: 'housing'
    }).select();
    console.log("New conv inserted:", { newConv, cErr });
  }

  // 2. Insert message
  const { data: msg, error: mErr } = await supabase.from('messages').insert({
    conversation_id: newConvId,
    sender_id: senderId,
    text: 'Hello, this is a test in a brand new conversation!'
  }).select();
  console.log("Message inserted:", { msg, mErr });
}

testNewConvFlow();
