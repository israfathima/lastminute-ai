from datetime import datetime, timezone
from app.schemas.task import Task


def deadline_risk(task: Task, workload_hours: float = 0) -> str:
    if task.status == "Completed":
        return "Low"
    now = datetime.now(timezone.utc)
    deadline = task.deadline if task.deadline.tzinfo else task.deadline.replace(tzinfo=timezone.utc)
    hours_left = max((deadline - now).total_seconds() / 3600, 0)
    pressure = task.estimated_hours + (workload_hours * 0.25)
    if hours_left <= 0 or pressure > hours_left * 1.25:
        return "Critical"
    if pressure > hours_left * 0.8:
        return "High"
    if pressure > hours_left * 0.45:
        return "Medium"
    return "Low"


def productivity_score(tasks: list[Task]) -> int:
    if not tasks:
        return 76
    completed = len([task for task in tasks if task.status == "Completed"])
    overdue = len([
        task for task in tasks
        if task.status != "Completed" and task.deadline.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc)
    ])
    progress = completed / len(tasks)
    score = 55 + progress * 45 - overdue * 8
    return max(0, min(100, round(score)))
