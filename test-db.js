const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://mmzchrpwefipnmodpwor.supabase.co";
const supabaseAnonKey = "sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log("=== SUPABASE LIVE DATABASE TEST ===");

  // 1. Users Table
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, name, email, school, role")
    .limit(5);

  if (usersError) {
    console.log("Users Query Notice:", usersError.message);
  } else {
    console.log("Users Count Found:", users ? users.length : 0);
    console.log("Sample Users:", users);
  }

  // 2. Room Listings
  const { data: listings, error: listingsError } = await supabase
    .from("room_listings")
    .select("id, title, price, location, status")
    .limit(5);

  if (listingsError) {
    console.log("Room Listings Notice:", listingsError.message);
  } else {
    console.log("Listings Count Found:", listings ? listings.length : 0);
    console.log("Sample Listings:", listings);
  }

  // 3. Questionnaire Questions
  const { data: questions, error: qError } = await supabase
    .from("questionnaire_questions")
    .select("id, question_text")
    .limit(5);

  if (qError) {
    console.log("Questionnaire Notice:", qError.message);
  } else {
    console.log("Questions Count Found:", questions ? questions.length : 0);
    console.log("Sample Questions:", questions);
  }
}

testConnection();
