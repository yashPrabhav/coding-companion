# Coding Companion Backend

The backend powers the intelligence of Coding Companion.

It manages learner data, business logic, AI interactions, and persistent memory.

---

# Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

---

# Backend Architecture

```
Client

↓

Routes

↓

Controllers

↓

Services

↓

Models

↓

MongoDB
```

---

# Folder Structure

```
backend

├── src
│
├── config/
├── controllers/
├── models/
├── routes/
├── services/
│
├── app.js
└── server.js
```

---

# Core Learning Objects

## User Profile

Stores long-term learner information.

Examples:

- Goals
- Preferred learning style
- Experience level
- Preferred language

---

## Learner State

Stores the learner's current learning state.

Examples:

- Current topic
- Ready topics
- Blocked topics
- Current mastery

---

## Learning Events

Stores important learning events that update the learner state.

Examples:

- Topic mastered
- Misconception detected
- Learning preference observed

---

## Knowledge Graph

Shared programming knowledge used by the AI.

---

# API Architecture

```
HTTP Request

↓

Route

↓

Controller

↓

Service

↓

Model

↓

MongoDB
```

---

# Current Features

- MongoDB Connection
- User Profile Model
- User Creation API
- Service Layer Architecture

---

# Upcoming Features

- Learner State
- Learning Events
- Prompt Builder
- Teaching Engine
- AI Response Pipeline

---

# Run Locally

```bash
npm install
npm run dev
```

---

# Environment Variables

```
PORT=

MONGODB_URI=

OPENAI_API_KEY=
```

---

## Author

Developed by **Yash Prabhav Suman**