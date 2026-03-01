任務 ID,關聯目標,任務描述 (Commit Scope),執行者,狀態
T-001,G-001,新增 src/types/game.ts 定義五大境界的資料結構,Coder-Bot,done
T-002,G-001,在 src/types/ending.ts 定義 Ending 相關資料結構 (interface: Ending)，需包含 id: string、name: string、description: string 與 triggerCondition 條件判斷，以支援 64 種結局,Coder-Bot,done
T-003,G-001,在 src/types/game.ts 定義 Facility 與 GameState Interface，需包含 id、name、baseCost、baseProduction 與 level 欄位(參考 INITIAL_FACILITIES)，以及 qi、realmIndex、facilities 與 logs 欄位(參考 INITIAL_STATE)，並於 App.tsx 中導入替換目前的 any 類型,Coder-Bot,waiting
