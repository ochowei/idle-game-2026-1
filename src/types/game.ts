export interface Realm {
  name: string;
  threshold: number;
  multiplier: number;
}

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
