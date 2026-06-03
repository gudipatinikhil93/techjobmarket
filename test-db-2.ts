import 'dotenv/config';
import { supabase } from './src/lib/supabase.js';

async function main() {
  const { data, error } = await supabase.from('role_intelligence').select('*');
  console.log('Error:', error);
  console.log('Role Intelligence count:', data?.length);
  if (data?.length) {
    console.log(data.slice(0, 2));
  }
}
main();
