export interface Realm {
  name: string;
  threshold: number;
  multiplier: number;
}

export interface PlayerAttributes {
  aptitude: number;
  fortune: number;
  opportunity: number;
  nature: number;
  darkness: number;
}

export const ATTRIBUTE_LIMITS: Record<keyof PlayerAttributes, { min: number; max: number }> = {
  aptitude: { min: 0, max: 100 },
  fortune: { min: 0, max: 100 },
  opportunity: { min: 0, max: 100 },
  nature: { min: 0, max: 100 },
  darkness: { min: 0, max: 100 },
};

export interface Facility {
  id: string;
  name: string;
  baseCost: number;
  baseProduction: number;
  level: number;
}

export interface GameState {
  saveVersion: number;
  lastSaveTime: number;
  qi: number;
  realmIndex: number;
  facilities: Facility[];
  logs: string[];
}
