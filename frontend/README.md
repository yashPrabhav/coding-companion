# Coding Companion Frontend

The main Coding Companion frontend is a React + Vite application. It provides the visual companion workspace, conversation list and pane, message composer, Code Stream, code workspace/editor surfaces, and supporting UI interactions.

**Current status:** this is a frontend prototype, not yet a fully integrated AI product. The current conversation data is initialized from local demo data, and the assistant response is simulated in the frontend state hook. The interface is not yet using the backend's learner-aware Teaching Brain flow.

## Tech stack

- React 19
- Vite
- JavaScript (ES modules)
- CSS
- React Icons

## Source structure

```text
src/
├── App.jsx
├── App.css
├── index.css
├── main.jsx
├── data/
│   └── demoConversations.js
├── hooks/
│   └── useCompanionState.js
└── components/
    └── companion/
        ├── CompanionShell.jsx
        ├── TopBar.jsx
        ├── ConversationList.jsx
        ├── ConversationPane.jsx
        ├── Composer.jsx
        ├── CodeStream.jsx
        ├── CodeWorkspace.jsx
        ├── CodeView.jsx
        ├── SettingsModal.jsx
        ├── UndoToast.jsx
        └── Icons.jsx
```

## How it is organized

- **`CompanionShell`:** composes the main workspace UI.
- **`useCompanionState`:** owns local conversation state, selection/search, composer input, code entries, workspace state, simulated response state, and conversation actions.
- **`ConversationList` and `ConversationPane`:** present conversation navigation and the active thread.
- **`Composer`:** collects learner messages and optional code.
- **`CodeStream`, `CodeWorkspace`, and `CodeView`:** display code shared in the conversation and support a separate workspace surface.
- **`demoConversations.js`:** supplies local demo conversation data.

Conversation state currently lives in React state; it is not persisted to the backend or a database. Switching conversations clears the independent workspace/attached-code state by design in the current hook.

## Run locally

From this directory:

```bash
npm install
npm run dev
```

Vite will print the local URL, usually `http://localhost:5173`.

## Build and lint

```bash
npm run build
npm run lint
```

## Current scope and limitations

- The interface and code-workspace interactions are under active development.
- Conversation history is demo/local state and does not survive a full page reload.
- Assistant replies are simulated with a frontend timer; they are not responses from Gemini or the backend.
- Authentication screens/experiments live separately in the repository's `frontend_auth/` directory; they are not wired into this main frontend flow.
- The backend already has learner models and AI services, but full frontend integration, persistent sessions, and the end-to-end learner-aware teaching pipeline remain future work.
- The UI and component boundaries may change as the product is tested with users.

## Development direction

1. Connect the frontend to backend endpoints with clear loading and error states.
2. Replace simulated replies with the real teaching flow once its backend orchestration is ready.
3. Add authenticated, persistent learner sessions.
4. Test core conversation and code-workspace interactions across screen sizes and failure cases.

## Author

Developed by **Yash Prabhav Suman**.
