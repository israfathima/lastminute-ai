from collections import Counter
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Body, Depends, Header, HTTPException
from app.services.ai import generate_plan
from app.services.risk import deadline_risk, productivity_score
from app.services.store import store

router = APIRouter(tags=["productivity"])


def current_user(x_user_id: str | None = Header(default="demo-user")) -> str:
    return x_user_id or "demo-user"


@router.post("/generate-plan")
def generate_ai_plan(task_id: str = Body(embed=True), user_id: str = Depends(current_user)):
    task = store.get(user_id, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.ai_plan = generate_plan(task, store.list(user_id))
    return store.save(task).ai_plan


@router.get("/dashboard")
def dashboard(user_id: str = Depends(current_user)):
    tasks = store.list(user_id)
    now = datetime.now(timezone.utc)
    today_end = now + timedelta(days=1)
    active = [task for task in tasks if task.status != "Completed"]
    risks = Counter(deadline_risk(task, sum(t.estimated_hours for t in active)) for task in active)
    next_task = sorted(active, key=lambda task: (task.deadline, -task.estimated_hours), reverse=False)[:1]
    return {
        "today_tasks": len([task for task in active if task.deadline.replace(tzinfo=timezone.utc) <= today_end]),
        "upcoming_deadlines": len(active),
        "completed_tasks": len([task for task in tasks if task.status == "Completed"]),
        "productivity_score": productivity_score(tasks),
        "deadline_risk": risks,
        "ai_suggestions": [
            f"Next best action: {next_task[0].title}" if next_task else "Add your next deadline to unlock an AI plan.",
            "Protect one uninterrupted focus block today.",
            "Move low-value tasks after urgent deliverables.",
        ],
        "recent_activity": sorted(tasks, key=lambda task: task.created_at, reverse=True)[:5],
    }


@router.get("/analytics")
def analytics(user_id: str = Depends(current_user)):
    tasks = store.list(user_id)
    now = datetime.now(timezone.utc)
    categories = Counter(task.category for task in tasks)
    statuses = Counter(task.status for task in tasks)
    risks = Counter(deadline_risk(task) for task in tasks)
    weekly = []
    for offset in range(6, -1, -1):
        day = now - timedelta(days=offset)
        completed = len([
            task for task in tasks
            if task.completed_at and task.completed_at.date() == day.date()
        ])
        focus = round(sum(task.estimated_hours for task in tasks if task.created_at.date() == day.date()), 1)
        weekly.append({"day": day.strftime("%a"), "completed": completed, "focus": focus})
    monthly = []
    for index in range(1, 5):
        bucket = tasks[max(0, len(tasks) - index * 5):len(tasks) - (index - 1) * 5 or None]
        monthly.append({"week": f"W{5 - index}", "done": len([task for task in bucket if task.status == "Completed"])})
    overdue = len([task for task in tasks if task.status != "Completed" and task.deadline.replace(tzinfo=timezone.utc) < now])
    focus_time = round(sum(task.estimated_hours for task in tasks if task.status != "Completed"), 1)
    completion_rate = round((statuses.get("Completed", 0) / len(tasks)) * 100, 1) if tasks else 0
    predicted_completion = max(20, min(98, round(completion_rate + (100 - overdue * 15 - len(risks) * 2) * 0.25)))
    completed_durations = [
        max((task.completed_at - task.created_at).total_seconds() / 86400, 0)
        for task in tasks
        if task.completed_at
    ]
    average_completion_days = round(sum(completed_durations) / len(completed_durations), 1) if completed_durations else 0
    upcoming = len([task for task in tasks if task.status != "Completed" and task.deadline.replace(tzinfo=timezone.utc) >= now])
    return {
        "weekly_progress": weekly,
        "monthly_progress": list(reversed(monthly)),
        "categories": [{"name": name, "value": value} for name, value in categories.items()] or [{"name": "No tasks yet", "value": 1}],
        "completion_rate": completion_rate,
        "deadline_distribution": [{"name": name, "value": value} for name, value in risks.items()] or [{"name": "No risk yet", "value": 1}],
        "missed_deadlines": overdue,
        "focus_time": focus_time,
        "predicted_completion": predicted_completion,
        "upcoming_deadlines": upcoming,
        "prediction_trends": weekly,
        "average_completion_time": f"{average_completion_days:g} days" if average_completion_days else "No completions yet",
    }
