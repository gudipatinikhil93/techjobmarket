import type { RegionConfig } from '../types';

export const indiaConfig: RegionConfig = {
  id: 'india',
  name: 'India',
  currency: {
    code: 'INR',
    symbol: '₹',
    format: 'INR',
    label: 'LPA'
  },
  locale: 'en-IN',
  timezone: 'Asia/Kolkata',
  mainCities: [
    'Bangalore',
    'Hyderabad',
    'Pune',
    'Delhi NCR',
    'Mumbai',
    'Chennai',
    'Gurgaon',
    'Noida',
    'Ahmedabad'
  ],
  seo: {
    defaultTitle: 'India Tech Job Market Intelligence | Live Dashboard 2026',
    defaultDescription: 'Modern India-focused tech job market intelligence platform. Analyze trends, salaries, and hiring patterns in real-time.',
    ogImage: '/og-image-india.png' // Placeholder
  },
  labels: {
    marketStatus: 'India Tech Market',
    hiringTrends: 'India Hiring Trends',
    topCities: 'Top India Tech Hubs',
    salaryBenchmarks: 'India Salary Benchmarks'
  },
  public: true // Beta Mode
};
