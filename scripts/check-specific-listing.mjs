import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mmzchrpwefipnmodpwor.supabase.co';
const supabaseKey = 'sb_publishable_x1TZRUmggwOAgT4xTiBrbg__5Ps0w__';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkListingDetails() {
  const listingId = 'b9060c21-f32c-4b64-82b4-535c8a947c36';
  const { data: listing } = await supabase.from('room_listings').select('*').eq('id', listingId).single();
  console.log("Listing:", listing);

  const { data: imgs } = await supabase.from('room_listing_images').select('*').eq('room_listing_id', listingId);
  console.log("Images:", imgs);

  const { data: owner } = await supabase.from('users').select('*').eq('id', listing.owner_id).single();
  console.log("Owner:", owner);
}

checkListingDetails();
