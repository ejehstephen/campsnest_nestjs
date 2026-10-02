const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mmzchrpwefipnmodpwor.supabase.co';
const supabaseKey = 'sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAnswerInsert() {
  console.log("Checking questionnaire_answers schema...");
  
  // Select first user
  const { data: users } = await supabase.from('users').select('id, name').limit(1);
  if (!users || users.length === 0) {
    console.log("No users found");
    return;
  }
  const user = users[0];
  console.log("Testing with user:", user.id, user.name);

  const { data, error } = await supabase.from('questionnaire_answers').insert({
    user_id: user.id,
    question_id: '33333333-3333-3333-3333-333333333333',
    text: 'night_owl'
  });

  if (error) {
    console.log("Insert result error (RLS):", error.message);
  } else {
    console.log("Insert success!", data);
  }
}

testAnswerInsert();
