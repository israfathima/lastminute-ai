# API Documentation

Base URL: `http://localhost:8000`

Pass `X-User-Id` to scope data to a user. The frontend sets this from Firebase Auth and uses `demo-user` in local demo mode.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Service health check |
| `POST` | `/tasks` | Create a task and automatically generate an AI plan |
| `GET` | `/tasks` | List user tasks |
| `GET` | `/tasks/{id}` | Get a single task |
| `PUT` | `/tasks/{id}` | Update a task |
| `DELETE` | `/tasks/{id}` | Delete a task |
| `POST` | `/generate-plan` | Regenerate an AI plan for a task |
| `GET` | `/dashboard` | Dashboard metrics and suggestions |
| `GET` | `/analytics` | Chart-ready analytics |
| `GET` | `/agent/command-center` | Agentic daily overview, focus, risk, workload, and next action |
| `GET` | `/agent/daily-plan` | Optimized smart daily schedule |
| `GET` | `/agent/insights` | Weekly review, strengths, weaknesses, burnout, and time waste analysis |
| `POST` | `/agent/natural-language-tasks` | Extract structured tasks from natural language and generate plans |

## Task Payload

```json
{
  "title": "Submit economics assignment",
  "description": "Finalize analysis and upload PDF.",
  "category": "School",
  "deadline": "2026-07-01T18:00:00Z",
  "estimated_hours": 3,
  "priority": "High",
  "status": "To Do"
}
```

## Natural Language Task Creation

```json
{
  "text": "I have an interview Friday at 3. Finish AI assignment tomorrow. Gym every evening."
}
```

Returns an array of created tasks with generated AI plans.

## AI Plan Shape

```json
{
  "priority": "High",
  "risk": "Medium",
  "execution_plan": [{"time": "Next 25 min", "action": "Define first deliverable."}],
  "subtasks": ["Clarify the expected outcome"],
  "milestones": ["Start now"],
  "timeline": "Reserve 3 focused hours before the deadline.",
  "today_schedule": ["Start with this task"],
  "recommendation": "Schedule a focused work block today.",
  "reasoning": "Risk is based on remaining time, effort, and workload.",
  "motivation": "Small progress now beats a stressful rescue later.",
  "estimated_completion_time": "3 focused hours"
}
```
