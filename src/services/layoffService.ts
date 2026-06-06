import { supabase } from '../lib/supabase';
import type { RawLayoff } from '../scraper/layoffsFyi';

export async function processAndStoreLayoffs(layoffs: RawLayoff[], region: string = 'us') {
  if (!layoffs.length) return 0;

  console.log(`[LayoffService] Storing ${layoffs.length} layoffs for region ${region} to database...`);
  
  // Clear existing layoffs data for this region (full refresh)
  const { error: deleteError } = await supabase
    .from('layoffs')
    .delete()
    .eq('region', region);
    
  if (deleteError) {
    console.error(`[LayoffService] Error clearing old layoffs for ${region}:`, deleteError);
  } else {
    console.log(`[LayoffService] Cleared old layoffs data for ${region}.`);
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
      source_url: layoff.source_url,
      region: region
    }));

    const { error } = await supabase
      .from('layoffs')
      .insert(dbBatch);
    
    if (error) {
      console.error(`[LayoffService] Error storing batch for ${region}:`, error);
    } else {
      storedCount += batch.length;
    }
  }

  console.log(`[LayoffService] Successfully stored ${storedCount} layoffs for ${region}.`);
  return storedCount;
}

export async function getRecentLayoffs(limit = 10, region: string = 'us') {
  const { data, error } = await supabase
    .from('layoffs')
    .select('*')
    .eq('region', region)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error(`[LayoffService] Error fetching recent layoffs for ${region}:`, error);
    return [];
  }
  return data;
}

export async function getTopAffectedSectors(limit = 5, region: string = 'us') {
  // Since we don't have an RPC, we can fetch all or do a rough aggregation
  const { data, error } = await supabase
    .from('layoffs')
    .select('sector, layoffs_count')
    .eq('region', region)
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

