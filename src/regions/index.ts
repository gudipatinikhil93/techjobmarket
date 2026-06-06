import { usConfig } from './us/config';
import { indiaConfig } from './india/config';
import type { RegionConfig } from './types';

export const regions: Record<string, RegionConfig> = {
  us: usConfig,
  india: indiaConfig
};

export const DEFAULT_REGION = 'us';

export function getRegionConfig(id?: string): RegionConfig {
  if (!id || !regions[id]) {
    return regions[DEFAULT_REGION];
  }
  return regions[id];
}

export function isValidRegion(id: string): id is keyof typeof regions {
  return id in regions;
}

export function getRegion(params: Record<string, string | undefined>): string {
  const { region } = params;
  if (region && isValidRegion(region)) {
    return region;
  }
  return DEFAULT_REGION;
}

export type { RegionConfig };
