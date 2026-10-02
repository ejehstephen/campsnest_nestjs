import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mmzchrpwefipnmodpwor.supabase.co';
const supabaseKey = 'sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const convId = 'f1e3321f-9553-4ef0-a369-1762325fde83';
  
  // 1. Check all users in users table
  const { data: users, error: uErr } = await supabase.from('users').select('id, name, email').limit(5);
  console.log("Users:", { users, uErr });

  // 2. Test inserting into messages with first user
  if (users && users.length > 0) {
    const testUserId = users[0].id;
    console.log("Testing insert with user ID:", testUserId);

    const { data: msgData, error: msgErr } = await supabase.from('messages').insert({
      conversation_id: convId,
      sender_id: testUserId,
      text: 'Test message from script ' + new Date().toISOString()
    }).select();

    console.log("Insert result:", { msgData, msgErr });
  }

  // 3. Select all messages currently in database
  const { data: allMsgs, error: allErr } = await supabase.from('messages').select('*');
  console.log("All messages in DB count:", allMsgs?.length, allMsgs);
}

testInsert();
