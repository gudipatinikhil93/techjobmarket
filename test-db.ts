import 'dotenv/config';
import { supabase } from './src/lib/supabase.js';

async function main() {
  const { data: jobs } = await supabase.from('jobs').select('count');
  console.log('Total Jobs:', jobs);
  
  const { data: role_intelligence } = await supabase.from('role_intelligence').select('*');
  console.log('Role Intelligence count:', role_intelligence?.length);

  const { data: trending_roles } = await supabase.from('trending_roles').select('*');
  console.log('Trending roles:', trending_roles?.length);
  
  const { data: snapshots } = await supabase.from('role_snapshots').select('count');
  console.log('Snapshots:', snapshots);
  
  const { data: insights } = await supabase.from('ai_insights').select('*');
  console.log('Insights:', insights?.length);
}
main();
