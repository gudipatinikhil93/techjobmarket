import type { RegionConfig } from '../types';

export const usConfig: RegionConfig = {
  id: 'us',
  name: 'United States',
  currency: {
    code: 'USD',
    symbol: '$',
    format: 'USD',
    label: 'USD'
  },
  locale: 'en-US',
  timezone: 'America/New_York',
  mainCities: [
    'San Francisco',
    'New York',
    'Austin',
    'Seattle',
    'Boston',
    'Chicago',
    'Los Angeles',
    'Denver',
    'Miami',
    'Atlanta'
  ],
  seo: {
    defaultTitle: 'US Tech Job Market Intelligence | Live Dashboard 2026',
    defaultDescription: 'Modern US-focused tech job market intelligence platform. Analyze trends, salaries, and hiring patterns in real-time.',
    ogImage: '/og-image.png'
  },
  labels: {
    marketStatus: 'US Tech Market',
    hiringTrends: 'US Hiring Trends',
    topCities: 'Top US Tech Hubs',
    salaryBenchmarks: 'US Salary Benchmarks'
  },
  public: true
};
