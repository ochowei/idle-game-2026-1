- [2024-03-01] (PM-Alpha) 分配新任務 T-002: 定義 Ending 相關資料結構 (src/types/ending.ts) 以支援 64 種結局的目標 (G-001)。
- [2024-03-01] (Coder-Bot) 開始執行 T-003：在 src/types/game.ts 新增 SaveVersion 欄位（number 型別）並在 App.tsx 的 INITIAL_STATE 加入預設值 1
- [2024-03-01] (Coder-Bot) 完成 T-003 [Done]：在 GameState 加入 saveVersion 欄位並更新 INITIAL_STATE 的型別
[2024-03-01] (Coder-Bot) 開始執行 T-004：新增 src/utils/save.ts 檔案，並實作 migrateSaveData(data: any) 與 migrateV1toV2 函式以進行存檔版本遷移（確保舊存檔可升級），並設定為匯出
[2024-03-01] (Coder-Bot) 完成 T-004 [Done]：新增 migrateSaveData 存檔遷移函式
- [2026-03-02] (PM-Alpha) 指派 T-005（關聯 設計任務T-080 的第 3 步）給 Coder-Bot。
[2026-03-02] (Coder-Bot) 開始執行 T-005：在 src/App.tsx 引入 migrateSaveData 函式，並於 useState 初始化讀取 localStorage 存檔時，對解析出的 JSON 資料套用 migrateSaveData 進行舊格式遷移
[2026-03-02] (Coder-Bot) 完成 T-005 [Done]：在 App.tsx 引入並套用 migrateSaveData 進行舊格式遷移
- [2026-03-02] (PM-Alpha) 指派 T-006（關聯 設計任務T-080 的第 4 步）給 Coder-Bot。
- [2026-03-02] (PM-Alpha) 紀錄等待狀態，不新增任務。
- [2026-03-02] (Coder-Bot) 開始執行 T-006：在 src/utils/save.ts 新增 isValidSaveData 函式，並實作存檔完整性驗證（檢查必填欄位如 qi、realmIndex、facilities 等），並將其匯出
- [2026-03-02] (Coder-Bot) 完成 T-006 [Done]：在 src/utils/save.ts 新增 isValidSaveData 函式實作存檔完整性驗證
- [2026-03-02] (Coder-Bot) blocked: 找不到狀態為 waiting 的任務，停止執行。
- [2026-03-02] (Coder-Bot) blocked: 找不到狀態為 waiting 的任務，停止執行。
- [2026-03-02] (Coder-Bot) blocked: 找不到狀態為 waiting 的任務，停止執行。
- [2026-03-03] (Coder-Bot) blocked: 找不到狀態為 waiting 的任務，停止執行。
- [2026-03-03] (PM-Alpha) 指派 T-007（關聯 設計任務T-080 的第 5 步）給 Coder-Bot。

- [2026-03-03] (Coder-Bot) 開始執行 T-007：在 src/App.tsx 的存檔讀取初始化流程中串接 isValidSaveData 驗證；當驗證失敗時套用 INITIAL_STATE 作為 fallback 並避免使用損壞存檔，維持既有命名與狀態欄位風格
- [2026-03-03] (Coder-Bot) 完成 T-007 [Done]：在 App.tsx 串接 isValidSaveData 並於驗證失敗時回退 INITIAL_STATE
- [2026-03-03] (Coder-Bot) blocked: 找不到狀態為 waiting 的任務，停止執行。
- [2026-03-03] (PM-Alpha) 指派 T-008（關聯 設計任務T-080 的第 6 步）給 Coder-Bot。
- [2026-03-03] (Coder-Bot) 開始執行 T-008：在 GameState 與 App.tsx 新增手動存檔按鈕、lastSaveTime 與上次存檔時間顯示
- [2026-03-03] (Coder-Bot) 完成 T-008 [Done]：於 Header 新增手動存檔按鈕並顯示上次存檔時間
- [2026-03-03] (PM-Alpha) 指派 T-009（關聯 設計任務T-080 的第 7 步）給 Coder-Bot。
- [2026-03-03] (Coder-Bot) 開始執行 T-009：在 App.tsx 新增手動存檔成功提示動畫並自動淡出
- [2026-03-03] (Coder-Bot) 完成 T-009 [Done]：在 Header 新增手動存檔成功提示並於固定時間自動淡出
- [2026-03-03] (PM-Alpha) 指派 T-010（關聯 設計任務T-080 的第 8 步）給 Coder-Bot。
