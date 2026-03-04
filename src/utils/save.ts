import { GameState, Facility } from '../types/game';
import { generateInitialAttributes } from './attributes';

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

  if (typeof migratedData.attributes !== 'object' || migratedData.attributes === null) {
    migratedData = { ...migratedData, attributes: generateInitialAttributes() };
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
  if (typeof state.attributes !== 'object' || state.attributes === null) return false;
  const attrs = state.attributes as Record<string, unknown>;
  if (typeof attrs.aptitude !== 'number') return false;
  if (typeof attrs.fortune !== 'number') return false;
  if (typeof attrs.opportunity !== 'number') return false;
  if (typeof attrs.nature !== 'number') return false;
  if (typeof attrs.darkness !== 'number') return false;
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

export function importSaveData(json: string): GameState | null {
  try {
    const parsed: unknown = JSON.parse(json);
    const migrated = migrateSaveData(parsed);
    if (!isValidSaveData(migrated)) return null;
    return migrated;
  } catch {
    return null;
  }
}

export function verifySaveSystem(): boolean {
  let allPassed = true;

  // (1) 缺少 saveVersion 的舊格式物件，套用 migrateSaveData 後 saveVersion 應等於 1
  const oldFormatData: Record<string, unknown> = { qi: 0, realmIndex: 0, facilities: [], logs: [] };
  const migratedResult = migrateSaveData(oldFormatData) as Record<string, unknown>;
  const a1 = (migratedResult.saveVersion as number) === 1;
  console.assert(a1, '[verifySaveSystem] (1): migrateSaveData 應將 saveVersion 設為 1');
  allPassed = allPassed && a1;

  // (2) 缺少 facilities 欄位的不完整存檔，isValidSaveData 應回傳 false
  const incompleteData: Record<string, unknown> = { saveVersion: 1, qi: 0, realmIndex: 0, logs: [] };
  const a2 = !isValidSaveData(incompleteData);
  console.assert(a2, '[verifySaveSystem] (2): isValidSaveData 應對缺少 facilities 的存檔回傳 false');
  allPassed = allPassed && a2;

  // (3) 最小合法 GameState 序列化後可被 JSON.parse 解析且含 saveVersion 欄位
  const minimalState: GameState = {
    saveVersion: 1,
    lastSaveTime: 0,
    qi: 0,
    realmIndex: 0,
    attributes: generateInitialAttributes(),
    facilities: [],
    logs: [],
  };
  const exportedJson = JSON.stringify(minimalState);
  let a3 = false;
  try {
    const parsed = JSON.parse(exportedJson) as Record<string, unknown>;
    a3 = typeof parsed.saveVersion === 'number';
  } catch {
    a3 = false;
  }
  console.assert(a3, '[verifySaveSystem] (3): 序列化的 GameState 應可被解析且含 saveVersion 欄位');
  allPassed = allPassed && a3;

  // (4) importSaveData 解析步驟 (3) 的輸出字串，應回傳非 null 值
  const a4 = importSaveData(exportedJson) !== null;
  console.assert(a4, '[verifySaveSystem] (4): importSaveData 應成功解析合法存檔字串');
  allPassed = allPassed && a4;

  return allPassed;
}

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
