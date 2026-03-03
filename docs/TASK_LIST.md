任務 ID,關聯目標,關聯設計任務,任務描述 (Commit Scope),執行者,狀態
T-001,G-001,—,新增 src/types/game.ts 定義五大境界的資料結構,Coder-Bot,done
T-002,G-001,—,在 src/types/ending.ts 定義 Ending 相關資料結構 (interface: Ending)，需包含 id: string、name: string、description: string 與 triggerCondition 條件判斷，以支援 64 種結局,Coder-Bot,done
T-003,G-001,T-080,在 src/types/game.ts 新增 SaveVersion 欄位（number 型別）並在 App.tsx 的 INITIAL_STATE 加入預設值 1,Coder-Bot,done
T-004,G-001,T-080,新增 src/utils/save.ts 檔案，並實作 migrateSaveData(data: any) 與 migrateV1toV2 函式以進行存檔版本遷移（確保舊存檔可升級），並設定為匯出,Coder-Bot,done
T-005,G-001,T-080,在 src/App.tsx 引入 migrateSaveData 函式，並於 useState 初始化讀取 localStorage 存檔時，對解析出的 JSON 資料套用 migrateSaveData 進行舊格式遷移,Coder-Bot,done
T-006,G-001,T-080,在 src/utils/save.ts 新增 isValidSaveData 函式，並實作存檔完整性驗證（檢查必填欄位如 qi、realm、buildings 等），並將其匯出,Coder-Bot,done
T-007,G-001,T-080,在 src/App.tsx 的存檔讀取初始化流程中串接 isValidSaveData 驗證；當驗證失敗時套用 INITIAL_STATE 作為 fallback 並避免使用損壞存檔，維持既有命名與狀態欄位風格,Coder-Bot,done
T-008,G-001,T-080,「手動存檔按鈕 UI」：(1) 在 src/types/game.ts 的 GameState interface 新增 lastSaveTime: number 欄位；(2) 在 src/App.tsx 的 INITIAL_STATE 加入 lastSaveTime: 0 預設值；(3) 在 src/App.tsx UI 適當位置（參考現有 Header 區塊與 lucide-react 圖示用法）新增一個手動存檔按鈕，點擊時將當前 gameState 序列化後寫入 localStorage key 'xianxia_save' 並更新 lastSaveTime 為 Date.now()；(4) 按鈕下方顯示上次存檔時間（格式：「上次存檔：剛剛」或「上次存檔：N 分鐘前」，使用與現有 formatNumber 相同的 helper 風格實作 formatSaveTime 函式）,Coder-Bot,done
T-009,G-001,T-080,在 src/App.tsx 新增手動存檔成功提示動畫：點擊手動存檔按鈕後以現有 Header 區塊風格顯示短暫成功訊息（例如「存檔成功」），需於固定時間自動淡出並避免影響既有自動存檔流程與 lastSaveTime 顯示,Coder-Bot,done
