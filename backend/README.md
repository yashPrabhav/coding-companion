# Coding Companion Backend

The backend is the API and AI-service layer for Coding Companion. It is built with Node.js, Express, Mongoose, MongoDB, and Google's Gemini API.

The backend contains working implementation pieces for authentication, learner data, learning-event persistence, event-observation embeddings, context assembly, structured Teaching Brain output, and applying model-proposed updates. These pieces are still being integrated and tested; the backend should not yet be treated as production-ready.

## Tech stack

- Node.js (CommonJS)
- Express 5
- MongoDB and Mongoose
- Google Gemini API through `@google/genai`
- dotenv for local environment configuration

## Request architecture

```text
HTTP request
  ↓
Express route
  ↓
Controller
  ↓
Service
  ↓
Mongoose model
  ↓
MongoDB
```

AI-related flow components include:

- **Context Builder:** loads user profile, learner state, learning events, conversation history, and the current learner message.
- **Teaching Brain:** sends structured context to Gemini and expects JSON containing a teaching response, learning events, and proposed profile/state updates.
- **Learning-event persistence:** saves a learning event and generates a separate embedding for its observation.
- **Update service:** applies supported update recommendations to learner data.

## Relevant source structure

```text
backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   │   ├── User.js
│   │   ├── UserProfile.js
│   │   ├── LearnerState.js
│   │   ├── LearningEvent.js
│   │   └── LearningEventEmbedding.js
│   ├── prompt/
│   │   └── teachingBrainV2.js
│   ├── routes/
│   └── services/
│       ├── contextBuilderService.js
│       ├── embeddingService.js
│       ├── learningEventService.js
│       ├── learnerService.js
│       ├── teachingBrainService.js
│       ├── teachingBrainPersistenceService.js
│       ├── updateService.js
│       ├── authService.js
│       └── userService.js
└── tests/
```

## Current API route groups

The Express app mounts these route groups:

| Prefix | Purpose |
|---|---|
| `/auth` | Signup, login, forgot-password, reset-password, and an authenticated test route |
| `/users` | Create a user and retrieve a user profile |
| `/learner-state` | Create and retrieve learner state |
| `/learning-events` | Create events and retrieve them by ID, learner, tags, or context |
| `/updates` | Apply a Teaching Brain update recommendation |

The root route `/` returns a simple backend-running message. See the route and controller files for request/response details; endpoints and schemas may change during development.

## Learning memory and semantic retrieval

Learning events and embeddings are stored separately.

- The event's `data.observation` is embedded using `gemini-embedding-001` by default.
- Embeddings are configured for `RETRIEVAL_DOCUMENT` with an output dimensionality of 768.
- The embedding record includes the event ID, learner ID, model name, dimensions, vector, and creation time.
- If embedding creation fails while creating an event, the service attempts to delete the just-saved event rather than leaving an event without its expected embedding.

**Current limitation:** the active context endpoint still retrieves events through the existing tag-based logic. Query embedding and MongoDB vector-search retrieval are planned but are not yet connected to the Context Builder. Keep all future retrieval scoped to the requesting learner.

## Run locally

From this directory:

```bash
npm install
npm run dev
```

This runs `nodemon src/server.js`. To run without auto-reload:

```bash
npm start
```

The server defaults to port `3000` and waits for the database connection before listening.

## Environment variables

Create a local `.env` file in `backend/`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
TEACHING_BRAIN_MODEL=gemini-3.7-flash
EMBEDDING_MODEL=gemini-embedding-001
```

- `PORT` defaults to `3000`.
- `TEACHING_BRAIN_MODEL` defaults to `gemini-3.7-flash`.
- `EMBEDDING_MODEL` defaults to `gemini-embedding-001`.
- MongoDB and a valid Gemini API key are required for the corresponding services.

Model availability and names can change; confirm them with Google's current documentation before deployment.

**Never commit `.env` files or credentials.**

## Tests

The repository includes tests under `tests/` for Gemini/model behavior and Teaching Brain/persistence flows. Review each test before relying on it: external API tests may require credentials, network access, and a configured database. There is currently no dedicated `test` script declared in `package.json`.

## Known limitations / next steps

- Finish and test semantic retrieval with MongoDB vector search.
- Integrate context retrieval, Teaching Brain generation, event persistence, and update application into a complete request flow.
- Add repeatable automated tests for services, routes, authentication, error handling, and learner isolation.
- Review authentication and password-reset security before real-user or production use.
- Document request/response schemas and setup troubleshooting as the API stabilizes.

## Author

Developed by **Yash Prabhav Suman**.
