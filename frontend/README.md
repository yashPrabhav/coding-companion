# Coding Companion Frontend

The frontend is the user-facing interface for Coding Companion.

It provides the companion workspace, conversation interface, code stream, code workspace, and related UI components.

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

## Architecture

- `CompanionShell` handles page-level composition.
- `useCompanionState` manages frontend conversation and UI state.
- Major UI surfaces are separated into reusable components.
- `CodeView` is shared by code-related surfaces.
- Visual rules are centralized in `App.css` and `index.css`.
- Demo data is isolated from the UI components.

The frontend is currently being developed alongside the backend and is not yet a production-ready application.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Current Scope

The frontend currently focuses on the companion interface and its core coding workspace experience.

Backend integration, authentication, persistent learner data, and AI-powered behavior are being developed separately.

## Project Status

This is an active work-in-progress project. The frontend structure and UI may change as Coding Companion is tested and connected to the backend.

## Author

Developed by **Yash Prabhav Suman**