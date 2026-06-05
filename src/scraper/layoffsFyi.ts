import { chromium } from 'playwright';

export interface RawLayoff {
  company: string;
  layoffs_count: number | null;
  percentage_affected: number | null;
  date: string; // ISO string
  sector: string | null;
  reason: string | null;
  source_url: string | null;
}

export class LayoffsFyiAdapter {
  async scrape(): Promise<RawLayoff[]> {
    console.log(`[Layoffs.fyi] Starting scrape using Playwright interception...`);
    const allLayoffs: RawLayoff[] = [];
    const browser = await chromium.launch({ headless: true });
    
    try {
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      });
      const page = await context.newPage();
      
      let airtableData: any = null;

      // Intercept the Airtable data request and force JSON response
      await page.route('**/*readSharedViewData*', async route => {
        const request = route.request();
        let url = request.url();
        if (url.includes('allowMsgpackOfResult')) {
          url = url.replace('%22allowMsgpackOfResult%22%3Atrue%2C', '');
          url = url.replace('%2C%22allowMsgpackOfResult%22%3Atrue', '');
          url = url.replace('allowMsgpackOfResult=true', '');
        }
        
        try {
          const response = await route.fetch({ url });
          const contentType = response.headers()['content-type'] || '';
          
          if (contentType.includes('application/json')) {
            airtableData = await response.json();
            console.log('[Layoffs.fyi] Intercepted Airtable JSON response!');
          } else {
            const text = await response.text();
            if (text.startsWith('{')) {
               airtableData = JSON.parse(text);
               console.log('[Layoffs.fyi] Intercepted text as JSON response!');
            }
          }
          await route.fulfill({ response });
        } catch (e) {
           console.error('[Layoffs.fyi] Error fetching or parsing intercepted route', e);
           await route.continue();
        }
      });

      console.log(`[Layoffs.fyi] Navigating to https://layoffs.fyi/ ...`);
      await page.goto('https://layoffs.fyi/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      // Wait for Airtable iframe and data interception
      console.log('[Layoffs.fyi] Waiting for Airtable data...');
      await page.waitForTimeout(8000); 

      if (!airtableData || !airtableData.data || !airtableData.data.table) {
         console.warn('[Layoffs.fyi] Failed to capture Airtable data.');
         return [];
      }

      const table = airtableData.data.table;
      const rows = table.rows || [];
      const columns = table.columns || [];

      // Find Column IDs
      const colIdMap: Record<string, string> = {};
      const choicesMap: Record<string, Record<string, any>> = {};

      for (const col of columns) {
        colIdMap[col.name] = col.id;
        if (col.typeOptions && col.typeOptions.choices) {
            choicesMap[col.id] = col.typeOptions.choices;
        }
      }

      console.log(`[Layoffs.fyi] Parsing ${rows.length} rows...`);

      for (const row of rows) {
        const cells = row.cellValuesByColumnId || {};
        
        const company = cells[colIdMap['Company']] as string;
        if (!company) continue;

        const layoffs_count_val = cells[colIdMap['# Laid Off']];
        const layoffs_count = typeof layoffs_count_val === 'number' ? layoffs_count_val : null;

        const percentage_affected_val = cells[colIdMap['%']];
        const percentage_affected = typeof percentage_affected_val === 'number' ? percentage_affected_val : null;

        const date_val = cells[colIdMap['Date']] as string;
        const date = date_val ? new Date(date_val).toISOString() : new Date().toISOString();

        // Industry is often a select field, it returns the choice ID like 'sellei4bVXrR2MBVT'
        let sector = null;
        const indColId = colIdMap['Industry'];
        const indVal = cells[indColId];
        if (indVal && choicesMap[indColId] && choicesMap[indColId][indVal]) {
           sector = choicesMap[indColId][indVal].name;
        } else if (typeof indVal === 'string') {
           sector = indVal; // fallback
        }

        const source_url = cells[colIdMap['Source']] as string || null;

        allLayoffs.push({
          company,
          layoffs_count,
          percentage_affected,
          date,
          sector,
          reason: null, // Layoffs.fyi usually doesn't have a specific reason column in this main table
          source_url
        });
      }

    } catch (error) {
      console.error(`[Layoffs.fyi] Scraping failed:`, error);
    } finally {
      await browser.close();
    }

    console.log(`[Layoffs.fyi] Successfully parsed ${allLayoffs.length} layoff entries.`);
    return allLayoffs;
  }
}
