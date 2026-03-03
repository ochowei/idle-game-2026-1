import { GameState, Facility } from '../types/game';

export function migrateV1toV2(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) return data;
  return {
    ...data,
    saveVersion: 2,
  };
}

export function migrateSaveData(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) return data;

  let migratedData = { ...data } as Record<string, unknown>;

  if (typeof migratedData.saveVersion !== 'number' || migratedData.saveVersion < 2) {
    migratedData = migrateV1toV2(migratedData) as Record<string, unknown>;
  }

  return migratedData;
}

export function isValidSaveData(data: unknown): data is GameState {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const state = data as Record<string, unknown>;

  if (typeof state.saveVersion !== 'number') return false;
  if (typeof state.qi !== 'number') return false;
  if (typeof state.realmIndex !== 'number') return false;
  if (!Array.isArray(state.facilities)) return false;
  if (!Array.isArray(state.logs)) return false;

  for (const facility of state.facilities) {
    if (typeof facility !== 'object' || facility === null) return false;
    const f = facility as Record<string, unknown>;
    if (typeof f.id !== 'string') return false;
    if (typeof f.name !== 'string') return false;
    if (typeof f.baseCost !== 'number') return false;
    if (typeof f.baseProduction !== 'number') return false;
    if (typeof f.level !== 'number') return false;
  }

  for (const log of state.logs) {
    if (typeof log !== 'string') return false;
  }

  return true;
}

export const SAVE_FILENAME = 'xianxia-save.json';

export function exportSaveData(data: GameState): void {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = SAVE_FILENAME;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export save data:', error);
  }
}
