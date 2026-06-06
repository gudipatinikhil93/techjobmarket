export interface RegionConfig {
  id: string;
  name: string;
  currency: {
    code: string;
    symbol: string;
    format: 'USD' | 'INR';
    label: string; // e.g., 'USD' or 'LPA'
  };
  locale: string;
  timezone: string;
  mainCities: string[];
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    ogImage: string;
  };
  labels: {
    marketStatus: string;
    hiringTrends: string;
    topCities: string;
    salaryBenchmarks: string;
  };
  public: boolean;
}

export const regions: Record<string, RegionConfig> = {};
