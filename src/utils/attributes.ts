import { PlayerAttributes, ATTRIBUTE_LIMITS } from '../types/game';

export function generateInitialAttributes(): PlayerAttributes {
  const keys = Object.keys(ATTRIBUTE_LIMITS) as (keyof PlayerAttributes)[];
  const result = {} as PlayerAttributes;

  for (const key of keys) {
    const raw = 50 + Math.floor(Math.random() * 11) - 5;
    result[key] = Math.min(ATTRIBUTE_LIMITS[key].max, Math.max(ATTRIBUTE_LIMITS[key].min, raw));
  }

  return result;
}
