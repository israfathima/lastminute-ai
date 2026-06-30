# Database Schema

Firestore stores tasks under each authenticated user.

```text
users/{userId}/tasks/{taskId}
```

## Task Document

| Field | Type | Notes |
| --- | --- | --- |
| `user_id` | string | Owner id |
| `title` | string | Task title |
| `description` | string | Longer task context |
| `category` | string | School, Work, Finance, Interview, etc. |
| `deadline` | timestamp | Due date and time |
| `estimated_hours` | number | Estimated focused work |
| `priority` | string | Low, Medium, High, Urgent |
| `status` | string | To Do, In Progress, Completed |
| `recurrence` | string/null | Optional recurrence from natural language capture |
| `created_at` | timestamp | Creation date |
| `completed_at` | timestamp/null | Completion date |
| `ai_plan` | map/null | Gemini plan JSON |
