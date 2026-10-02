import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mmzchrpwefipnmodpwor.supabase.co';
const supabaseKey = 'sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMessageSchema() {
  console.log("Testing insert into messages table...");
  const testMsg = {
    conversation_id: 'test-conv-1',
    sender_id: 'fb52aba3-c740-4b38-b315-7dfaf7d7fa48',
    text: 'Hello test',
    is_read: false
  };

  const { data, error } = await supabase.from('messages').insert(testMsg).select();
  console.log("Insert result:", { data, error });

  console.log("Testing insert into notifications table...");
  const testNotif = {
    user_id: 'fb52aba3-c740-4b38-b315-7dfaf7d7fa48',
    title: 'Test Notification',
    body: 'Test body',
    type: 'message',
    is_read: false
  };
  const { data: nData, error: nError } = await supabase.from('notifications').insert(testNotif).select();
  console.log("Notification insert result:", { data: nData, error: nError });
}

checkMessageSchema();
