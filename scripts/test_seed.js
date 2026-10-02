const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mmzchrpwefipnmodpwor.supabase.co';
const supabaseKey = 'sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log("Testing insert into questionnaire_questions...");
  const testQ = {
    id: "10101010-1010-1010-1010-101010101010",
    question: "What are you primarily looking for on CampsNest?",
    type: "single"
  };
  const { data, error } = await supabase.from('questionnaire_questions').upsert(testQ);
  if (error) {
    console.error("Insert error:", error.message);
  } else {
    console.log("Insert success!");
  }
}

testInsert();
