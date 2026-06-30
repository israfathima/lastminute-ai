# Architecture

```mermaid
flowchart LR
  User["User"] --> Web["React + Vite + Tailwind"]
  Web --> Auth["Firebase Google Authentication"]
  Web --> API["FastAPI Agent API"]
  API --> Gemini["Gemini Structured JSON Agent"]
  API --> Risk["Deadline Risk Engine"]
  API --> Store["Task Store"]
  Store --> Firestore["Firestore"]
  API --> Memory["Demo In-Memory Store"]
  Web --> Coach["Floating AI Coach"]
```

The backend keeps task orchestration, Gemini prompting, risk scoring, analytics, and fallback behavior behind a clean API. The frontend remains a single-page SaaS dashboard with protected routes, AI planning, focus mode, insights, and hackathon story pages.
