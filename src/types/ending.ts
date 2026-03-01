export interface Ending {
  /** 結局的唯一識別碼，支援 64 種結局的分類 */
  id: string;

  /** 結局名稱，例如「飛升仙界」、「走火入魔」 */
  name: string;

  /** 結局的詳細描述，解釋達成此結局的背景與結果 */
  description: string;

  /**
   * 觸發條件判斷函式
   * 用於在遊戲結束或特定事件時，動態判斷玩家是否滿足該結局條件。
   *
   * @param gameState 傳入目前的遊戲狀態（例如屬性、境界、事件標記等）
   * @returns boolean 若滿足條件則回傳 true，否則回傳 false
   */
  triggerCondition: (gameState: any) => boolean;
}
