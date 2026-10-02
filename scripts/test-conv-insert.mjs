import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mmzchrpwefipnmodpwor.supabase.co';
const supabaseKey = 'sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConvInsert() {
  const convId = 'f1e3321f-9553-4ef0-a369-1762325fde83';
  
  // Try inserting with different fields
  console.log("1. Trying basic insert into conversations...");
  const { data, error } = await supabase.from('conversations').insert({
    id: convId,
    title: 'Test Housing Conv',
    type: 'housing'
  }).select();
  console.log("Insert result:", { data, error });

  // Let's check all conversations currently in DB
  const { data: allConvs, error: convErr } = await supabase.from('conversations').select('*');
  console.log("All conversations in DB:", { count: allConvs?.length, allConvs, convErr });
}

testConvInsert();
