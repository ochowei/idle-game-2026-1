任務 ID,關聯目標,關聯設計任務,任務描述 (Commit Scope),執行者,狀態
T-001,G-001,—,新增 src/types/game.ts 定義五大境界的資料結構,Coder-Bot,done
T-002,G-001,—,在 src/types/ending.ts 定義 Ending 相關資料結構 (interface: Ending)，需包含 id: string、name: string、description: string 與 triggerCondition 條件判斷，以支援 64 種結局,Coder-Bot,done
T-003,G-001,T-080,在 src/types/game.ts 新增 SaveVersion 欄位（number 型別）並在 App.tsx 的 INITIAL_STATE 加入預設值 1,Coder-Bot,done
T-004,G-001,T-080,新增 src/utils/save.ts 檔案，並實作 migrateSaveData(data: any) 與 migrateV1toV2 函式以進行存檔版本遷移（確保舊存檔可升級），並設定為匯出,Coder-Bot,done
T-005,G-001,T-080,在 src/App.tsx 引入 migrateSaveData 函式，並於 useState 初始化讀取 localStorage 存檔時，對解析出的 JSON 資料套用 migrateSaveData 進行舊格式遷移,Coder-Bot,done
T-006,G-001,T-080,在 src/utils/save.ts 新增 isValidSaveData 函式，並實作存檔完整性驗證（檢查必填欄位如 qi、realm、buildings 等），並將其匯出,Coder-Bot,done
T-007,G-001,T-080,在 src/App.tsx 的存檔讀取初始化流程中串接 isValidSaveData 驗證；當驗證失敗時套用 INITIAL_STATE 作為 fallback 並避免使用損壞存檔，維持既有命名與狀態欄位風格,Coder-Bot,done
