# Coding Companion Frontend — Structured MVP

This replaces the old dashboard-style frontend UI with a componentized implementation based on the locked frontend research.

## Structure

```text
src/
├── App.jsx
├── App.css
├── index.css
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

## Why this structure

- `CompanionShell` owns page-level composition.
- `useCompanionState` owns MVP conversation/UI state.
- Each major UI surface has its own component.
- `CodeView` is shared by the code stream, attached code, and editor.
- Visual rules remain centralized in `App.css` and `index.css`.
- Demo data is isolated from UI.
- This keeps the frontend easy to replace piece-by-piece when real backend/LLM services are connected.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deliberately not included yet

- Real LLM integration
- Authentication wiring
- Database persistence
- Production memory system
- Code execution
- Full IDE functionality
- Production syntax highlighting
- Real server-side progressive history
