import 'dotenv/config';
import { supabase } from './src/lib/supabase.js';

async function main() {
  const { data: trending } = await supabase.from('trending_roles').select('*').limit(10);
  console.log('Trending roles sample:', trending);
}
main();
