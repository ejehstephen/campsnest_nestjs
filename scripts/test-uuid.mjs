import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mmzchrpwefipnmodpwor.supabase.co';
const supabaseKey = 'sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWithUUID() {
  const convId = 'b9060c21-f32c-4b64-82b4-535c8a947c36'; // valid uuid
  console.log("Testing with valid UUID conversation_id...");

  // Let's see if conversation exists or can be inserted
  const { data: convData, error: convError } = await supabase.from('conversations').insert({
    id: convId,
    title: 'Test Conversation',
    type: 'housing'
  }).select();
  console.log("Conversation insert:", { data: convData, error: convError });

  // Let's see if message can be inserted
  const { data: msgData, error: msgError } = await supabase.from('messages').insert({
    conversation_id: convId,
    sender_id: 'fb52aba3-c740-4b38-b315-7dfaf7d7fa48',
    text: 'Hello from CampsNest test'
  }).select();
  console.log("Message insert:", { data: msgData, error: msgError });
}

testWithUUID();
