import { supabase } from '../lib/supabase';
import type { RawLayoff } from '../scraper/layoffsFyi';

export async function processAndStoreLayoffs(layoffs: RawLayoff[]) {
  if (!layoffs.length) return 0;

  console.log(`[LayoffService] Storing ${layoffs.length} layoffs to database...`);
  
  // Clear existing layoffs data (full refresh)
  const { error: deleteError } = await supabase
    .from('layoffs')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
    
  if (deleteError) {
    console.error(`[LayoffService] Error clearing old layoffs:`, deleteError);
  } else {
    console.log(`[LayoffService] Cleared old layoffs data.`);
  }

  // To avoid extremely large payloads, batch the inserts
  const BATCH_SIZE = 500;
  let storedCount = 0;

  for (let i = 0; i < layoffs.length; i += BATCH_SIZE) {
    const batch = layoffs.slice(i, i + BATCH_SIZE);
    
    // Convert to DB format, specifically ensuring date is handled
    const dbBatch = batch.map(layoff => ({
      company: layoff.company,
      layoffs_count: layoff.layoffs_count,
      percentage_affected: layoff.percentage_affected,
      date: layoff.date.split('T')[0], // ensure DATE format
      sector: layoff.sector,
      reason: layoff.reason,
      source_url: layoff.source_url
    }));

    const { error } = await supabase
      .from('layoffs')
      .insert(dbBatch);
      
    if (error) {
      console.error(`[LayoffService] Error storing batch:`, error);
    } else {
      storedCount += batch.length;
    }
  }

  console.log(`[LayoffService] Successfully stored ${storedCount} layoffs.`);
  return storedCount;
}

export async function getRecentLayoffs(limit = 10) {
  const { data, error } = await supabase
    .from('layoffs')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[LayoffService] Error fetching recent layoffs:', error);
    return [];
  }
  return data;
}

export async function getTopAffectedSectors(limit = 5) {
  // Since we don't have an RPC, we can fetch all or do a rough aggregation
  const { data, error } = await supabase
    .from('layoffs')
    .select('sector, layoffs_count')
    .not('sector', 'is', null);

  if (error || !data) {
    return [];
  }

  const sectorCounts: Record<string, number> = {};
  data.forEach(row => {
    if (row.sector && row.layoffs_count) {
      sectorCounts[row.sector] = (sectorCounts[row.sector] || 0) + row.layoffs_count;
    }
  });

  return Object.entries(sectorCounts)
    .map(([sector, count]) => ({ sector, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
