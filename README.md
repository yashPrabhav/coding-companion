# Coding Companion

> An AI-powered programming learning companion built to maintain learner context and personalize teaching over time.

Coding Companion is a work-in-progress project exploring how an AI coding companion can use a learner's profile, current state, learning events, and conversation context to provide more consistent guidance than a stateless chatbot.

## Repository Structure

```text
coding-companion/
├── frontend/    # React + Vite application
├── backend/     # Express REST API, MongoDB, AI services
└── README.md
```

## Architecture

```text
Frontend (React)
        │
        ▼
Backend (Express)
        │
        ├── User Profile
        ├── Learner State
        ├── Learning Events
        └── Teaching Brain
        │
        ▼
MongoDB
```

The repository contains the implementation and experiments behind the project. Some parts are still under development and should not be considered production-ready.

## Technology Stack

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB Atlas
- **AI:** Google Gemini API

## Current Work

- Frontend companion interface
- User and learner data models
- Learner-state and learning-event services
- Context building for AI teaching
- Structured Teaching Brain output
- Persistence of learning observations and learner-state updates

## Running Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The backend requires environment variables for the database and AI service.

**Do not commit your `.env` file or real credentials.**

## Project Status

Coding Companion is an active personal project. APIs, architecture, and the learning experience may change as the project is tested with real users.

## Author

Developed by **Yash Prabhav Suman**