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
