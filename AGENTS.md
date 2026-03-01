# AI Agent 協作手冊

- **PM-Alpha**: 純管理者。負責 `docs/` 下的管理文件。不准動代碼。
- **Coder-Bot**: 執行者。負責 `src/` 代碼與技術文件。需領取 `waiting` 任務並在完成後設為 `done`。
- **Artist-Bot**: 執行者。負責視覺素材。
- **Other (其他)**: 外部任務或特殊介入類別。

**協作規範：**
1. 所有的代碼變更必須對應一個 `TASK_ID`。
2. 執行者完成任務後，必須在 Commit Message 中標註 `[Done T-XXX]`。