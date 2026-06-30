# Demo Script

## 2-Minute Pitch

Students and professionals do not miss deadlines because they lack reminders. They miss deadlines because they do not know what to do next when everything is urgent. LastMinute AI acts like an AI employee that continuously analyzes work, predicts deadline risk, builds execution plans, and guides the user toward the next best action.

## Problem

Traditional productivity tools are passive. They store tasks and send reminders, but they do not actively help users finish the work before the deadline.

## Solution

LastMinute AI uses Gemini, Firebase, Firestore, FastAPI, and React to turn messy commitments into structured tasks, risk scores, schedules, focus sessions, analytics, and proactive coaching.

## Live Demo Walkthrough

1. Open the dashboard and point out the AI Command Center.
2. Go to Add Task and paste: `I have an interview Friday at 3. Finish AI assignment tomorrow. Pay electricity bill Monday. Gym every evening.`
3. Submit natural-language capture.
4. Return to Dashboard and show updated workload, risk, daily plan, AI suggestions, and activity feed.
5. Open AI Planner and show the execution plan, milestones, recommendation, and motivation.
6. Open Focus Mode and show the single-task timer.
7. Open Analytics and AI Insights to show productivity trends and weekly review.

## Architecture Talking Points

- React + Vite frontend for a premium SaaS interface.
- FastAPI backend for orchestration and validation.
- Gemini structured JSON agent for planning, summarization, scheduling, and recommendations.
- Firebase Authentication for Google sign-in.
- Firestore for user-scoped task storage.
- Cloud Run and Cloud Build for deployment.

## Innovation Points

- AI runs proactively on task creation, task update, dashboard load, and planner load.
- Natural language capture turns real-life chaos into structured work.
- Deadline risk is calculated from remaining time, workload, and effort.
- Demo mode keeps judging friction low when credentials are unavailable.

## Judge Talking Points

- The product solves completion, not just reminders.
- Gemini acts as an agent with structured outputs and fallback behavior.
- Google technologies are central to authentication, storage, AI, and deployment.
- The app is buildable, deployable, and documented for Cloud Run.
