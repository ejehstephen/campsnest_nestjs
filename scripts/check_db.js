const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mmzchrpwefipnmodpwor.supabase.co';
const supabaseKey = 'sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  console.log("=== CHECKING SUPABASE TABLES ===");
  
  // 1. questionnaire_questions
  const { data: qData, error: qErr } = await supabase.from('questionnaire_questions').select('*');
  console.log("\n--- questionnaire_questions ---");
  if (qErr) console.error("Error:", qErr.message);
  else console.log(`Found ${qData.length} questions:`, JSON.stringify(qData, null, 2));

  // 2. question_options
  const { data: optData, error: optErr } = await supabase.from('question_options').select('*');
  console.log("\n--- question_options ---");
  if (optErr) console.error("Error:", optErr.message);
  else console.log(`Found ${optData.length} options:`, JSON.stringify(optData, null, 2));

  // 3. questionnaire_answers
  const { data: ansData, error: ansErr } = await supabase.from('questionnaire_answers').select('*');
  console.log("\n--- questionnaire_answers ---");
  if (ansErr) console.error("Error:", ansErr.message);
  else console.log(`Found ${ansData.length} answers:`, JSON.stringify(ansData, null, 2));

  // 4. users count and preferences
  const { data: usersData, error: usersErr } = await supabase.from('users').select('id, name, email, preferences, school, department, gender').limit(10);
  console.log("\n--- users sample ---");
  if (usersErr) console.error("Error:", usersErr.message);
  else console.log(`Found sample users:`, JSON.stringify(usersData, null, 2));
}

inspect();
