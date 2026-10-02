const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mmzchrpwefipnmodpwor.supabase.co';
const supabaseKey = 'sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMatchesTables() {
  console.log("Checking connect_matches and connect_swipes tables...");
  
  const { data: cm, error: cme } = await supabase.from('connect_matches').select('*').limit(1);
  console.log("connect_matches:", cme ? cme.message : "Exists! Rows: " + cm.length);

  const { data: cs, error: cse } = await supabase.from('connect_swipes').select('*').limit(1);
  console.log("connect_swipes:", cse ? cse.message : "Exists! Rows: " + cs.length);
}

checkMatchesTables();
