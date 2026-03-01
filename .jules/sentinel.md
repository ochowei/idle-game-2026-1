## 2026-03-01 - [Remove dangerouslySetInnerHTML]
**Vulnerability:** Found `dangerouslySetInnerHTML` injecting raw CSS into the App component.
**Learning:** Even if the input is hardcoded CSS and not immediately exploitable for XSS, using `dangerouslySetInnerHTML` creates a poor security pattern. It opens the door for future developers to inadvertently inject dynamic, un-sanitized variables.
**Prevention:** Avoid `dangerouslySetInnerHTML` unless absolutely necessary (e.g. rendering trusted rich text). Extract CSS to global stylesheet (`index.css`) for better maintainability and security.
