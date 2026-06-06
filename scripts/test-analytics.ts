import 'dotenv/config';
import { captureSnapshots } from '../src/services/jobService';

async function testAnalytics() {
  const region = process.argv[2] || 'india';
  console.log(`Manual Analytics Trigger for region: ${region}`);
  
  try {
    const result = await captureSnapshots(region);
    console.log('Analytics capture result:', result);
  } catch (error) {
    console.error('Analytics capture failed:', error);
  }
}

testAnalytics();
