# Coding Companion

> An AI-powered coding-learning companion designed to adapt to a learner's knowledge, progress, and recurring difficulties over time.

Coding Companion (CC) is an active work-in-progress project. Its goal is to go beyond a stateless coding chatbot by maintaining structured learner information and learning observations that can inform future teaching.

## Project status

The repository currently contains a React/Vite frontend prototype and an Express/MongoDB backend with learner data models, authentication routes, learning-event persistence, embedding generation, context assembly, and a structured Gemini-powered Teaching Brain.

**This is not yet a production-ready, end-to-end application.** The frontend currently uses demo conversations and simulated replies; it is not yet connected to the backend's learner-aware AI pipeline. Semantic vector retrieval is also not yet wired into context building: learning events currently enter context through the existing tag-based endpoint.

## Repository structure

```text
coding-companion/
├── frontend/     # React + Vite companion interface (currently demo-driven)
├── frontend_auth/ # Separate authentication UI prototype/experiment
├── backend/      # Express API, MongoDB models, and AI services
├── README.md
└── .gitignore
```

The main frontend work lives in `frontend/`. The `frontend_auth/` directory is a separate frontend prototype and is not currently the main app entry point.

## Architecture today

```text
Frontend prototype (React + Vite)
  └── demo conversations and simulated assistant responses

Backend (Express)
  ├── Authentication endpoints
  ├── User profile and learner state
  ├── Learning event persistence
  ├── Observation embeddings (Gemini)
  ├── Context builder
  ├── Teaching Brain (structured Gemini output)
  └── Update application service
          │
          ▼
       MongoDB
```

The backend has a context-building path that gathers a learner profile, learner state, learning events, conversation history, and the current message for the Teaching Brain. The Teaching Brain is designed to return a teaching response, learning observations, and proposed profile/state updates in a defined JSON structure. The surrounding pipeline is still under active development and should not be assumed to be fully integrated or production-hardened.

### Memory and retrieval status

- Learning events are stored separately from their embeddings.
- The backend generates a 768-dimensional embedding for each event's observation using `gemini-embedding-001` by default.
- The current context retrieval path still filters learning events using retrieval tags.
- Query embeddings and MongoDB vector-search retrieval have not yet been connected to the context builder.

## Technology stack

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Node.js, Express 5, Mongoose
- **Database:** MongoDB
- **AI:** Google Gemini API via `@google/genai`

## Run locally

Use two terminals.

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

The backend starts on port `3000` by default and connects to MongoDB before listening.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite typically serves the frontend at `http://localhost:5173`.

### Backend environment variables

Create `backend/.env` with the values required by the services you run:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
TEACHING_BRAIN_MODEL=gemini-3.7-flash
EMBEDDING_MODEL=gemini-embedding-001
```

The code defaults to port `3000`, Teaching Brain model `gemini-3.7-flash`, and embedding model `gemini-embedding-001` when the corresponding variables are omitted (the API key and database URI still need to be configured). Check the code and your provider's current model availability before relying on a model name.

**Never commit `.env` files, API keys, tokens, or real credentials.**

## Important limitations

- The frontend's conversations and replies are currently demo/local state, not persistent learner sessions.
- Frontend-to-backend integration for the complete teaching flow is not finished.
- Embeddings are generated and stored, but semantic vector search is not yet the active retrieval path.
- Authentication and password-reset routes exist, but their security and production readiness still need dedicated testing.
- APIs, data models, prompts, and UI may change as the project evolves.

## Roadmap direction

1. Complete and test semantic retrieval of learning events while preserving strict learner isolation.
2. Integrate the frontend with the backend's learner-aware teaching flow.
3. Test persistence, authentication, error handling, and failure cases.
4. Validate the experience with real learners before making production-readiness claims.

## Author

Developed by **Yash Prabhav Suman**.
