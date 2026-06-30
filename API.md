# API

All application data is scoped by `X-User-Id`. Firebase users send their UID; demo mode uses `demo-user`.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `GET` | `/tasks` | List tasks |
| `POST` | `/tasks` | Create task and generate AI plan |
| `GET` | `/tasks/{id}` | Retrieve task |
| `PUT` | `/tasks/{id}` | Update task and regenerate AI plan |
| `DELETE` | `/tasks/{id}` | Delete task |
| `POST` | `/generate-plan` | Regenerate execution plan |
| `GET` | `/dashboard` | Dashboard metrics |
| `GET` | `/analytics` | Live analytics |
| `GET` | `/agent/command-center` | Full task analysis and next best action |
| `GET` | `/agent/daily-plan` | Smart daily schedule |
| `GET` | `/agent/insights` | Daily and weekly productivity review |
| `POST` | `/agent/natural-language-tasks` | Extract tasks from natural language |
