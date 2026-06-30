# Project Documentation

LastMinute AI is an AI employee for deadline management. It continuously analyzes tasks, predicts risk, creates execution plans, and guides the user toward the next highest-leverage action.

## Core Workflow

1. User signs in with Google or enters demo mode.
2. Tasks are created through forms or natural language.
3. The backend generates a structured AI plan with Gemini or the documented fallback engine.
4. The dashboard updates command-center insights, risk, schedule, analytics, and coach recommendations.
5. Focus Mode helps the user complete the highest-priority task.

## Agentic Behavior

- Runs on task creation.
- Runs on task update and completion.
- Runs when dashboard and coach request command-center state.
- Rebuilds daily plan and insights from current task state.

## Production Safeguards

- Environment-variable configuration.
- CORS allowlist.
- Pydantic request validation.
- Gemini retry handling.
- Firebase/Firestore graceful fallback.
- Cloud Run Dockerfiles and Cloud Build configs.
- Docker Compose for local container validation.
- Lazy-loaded frontend routes and API retry handling.
