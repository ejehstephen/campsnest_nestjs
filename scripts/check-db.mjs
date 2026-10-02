import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mmzchrpwefipnmodpwor.supabase.co';
const supabaseKey = 'sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTables() {
  console.log("=== CHECKING MESSAGING & NOTIFICATIONS TABLES ===");

  const tables = [
    'notifications',
    'messages',
    'conversations',
    'conversation_participants',
    'room_listings',
    'room_listing_images',
    'marketplace_items',
    'users'
  ];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(5);
    console.log(`\n--- TABLE: ${table} ---`);
    if (error) {
      console.log(`❌ Error: ${error.message} (Code: ${error.code})`);
    } else {
      console.log(`✅ Success: Found ${data.length} rows`);
      if (data.length > 0) {
        console.log("Sample:", JSON.stringify(data[0], null, 2));
      }
    }
  }
}

inspectTables();
