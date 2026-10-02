const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mmzchrpwefipnmodpwor.supabase.co';
const supabaseKey = 'sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserUpdate() {
  console.log("Checking user preferences and updates...");
  const { data: users, error: fetchErr } = await supabase.from('users').select('id, name, preferences, gender, school').limit(5);
  console.log("Current users:", users);

  if (users && users.length > 0) {
    const u = users[0];
    const { data: updated, error: updateErr } = await supabase
      .from('users')
      .update({
        preferences: ['intent:both', 'sleep_schedule:night_owl', 'cleanliness:neat_freak', 'music_vibe:afrobeats']
      })
      .eq('id', u.id)
      .select();

    if (updateErr) {
      console.log("Update error (due to RLS):", updateErr.message);
    } else {
      console.log("Update success:", updated);
    }
  }
}

testUserUpdate();
