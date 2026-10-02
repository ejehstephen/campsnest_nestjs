import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mmzchrpwefipnmodpwor.supabase.co';
const supabaseKey = 'sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testListing() {
  const { data: listings } = await supabase.from('room_listings').select('*').limit(3);
  console.log("Listings:", listings);

  if (listings && listings.length > 0) {
    const listingId = listings[0].id;
    const { data: imgs } = await supabase.from('room_listing_images').select('*').eq('room_listing_id', listingId);
    console.log(`Images for ${listingId}:`, imgs);
  }
}

testListing();
