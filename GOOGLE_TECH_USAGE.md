# Google Technology Usage

## Gemini API

Gemini is used as a structured JSON agent for task analysis, execution planning, command-center summaries, daily schedules, natural-language extraction, and productivity insights. When unavailable, the app labels and uses a deterministic fallback.

## Firebase Authentication

The frontend integrates Firebase Google Authentication. If Firebase config is absent, a demo user is used to keep hackathon evaluation frictionless.

## Firestore

Tasks are stored under `users/{userId}/tasks/{taskId}` when Firebase credentials are configured. Without credentials, the backend uses in-memory storage.

## Cloud Run

The backend and frontend each include Dockerfiles ready for Cloud Run. Cloud Build YAML files build, push, and deploy both services.

## Cloud Build

`cloudbuild.backend.yaml` and `cloudbuild.frontend.yaml` provide repeatable deployment pipelines.
