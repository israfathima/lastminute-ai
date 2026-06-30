import json
import re
import time as sleep_time
from datetime import datetime, time, timedelta, timezone
import google.generativeai as genai
from app.config import get_settings
from app.schemas.task import Task
from app.services.risk import deadline_risk


def _json_from_text(text: str, fallback):
    cleaned = text.strip().removeprefix("```json").removesuffix("```").strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return fallback


def _model():
    settings = get_settings()
    if not settings.gemini_api_key:
        return None
    genai.configure(api_key=settings.gemini_api_key)
    return genai.GenerativeModel("gemini-1.5-flash")


def _generate_json(prompt: str, fallback):
    model = _model()
    if not model:
        return {**fallback, "agent_mode": "documented_fallback"}
    for attempt in range(3):
        try:
            result = _json_from_text(model.generate_content(prompt).text, fallback)
            if isinstance(result, dict):
                return {**result, "agent_mode": "gemini"}
            return result
        except Exception:
            if attempt == 2:
                return {**fallback, "agent_mode": "documented_fallback"}
            sleep_time.sleep(0.35 * (attempt + 1))


def _aware_deadline(task: Task) -> datetime:
    return task.deadline if task.deadline.tzinfo else task.deadline.replace(tzinfo=timezone.utc)


def analyze_task(task: Task, workload: list[Task]) -> dict:
    risk = deadline_risk(task, sum(t.estimated_hours for t in workload if t.status != "Completed"))
    hours_left = max((_aware_deadline(task) - datetime.now(timezone.utc)).total_seconds() / 3600, 0.1)
    urgency = min(100, round((task.estimated_hours / hours_left) * 120))
    priority_value = getattr(task.priority, "value", task.priority)
    importance = {"Low": 35, "Medium": 60, "High": 82, "Urgent": 96}.get(priority_value, 60)
    priority_score = min(100, round((urgency * 0.55) + (importance * 0.45)))
    success_probability = max(18, min(98, 104 - priority_score + (12 if risk in ["Low", "Medium"] else -8)))
    start = datetime.now(timezone.utc) + timedelta(minutes=15 if risk in ["High", "Critical"] else 90)
    finish = start + timedelta(hours=task.estimated_hours)
    return {
        "priority_score": priority_score,
        "urgency": urgency,
        "importance": importance,
        "difficulty": min(100, max(20, round(task.estimated_hours * 18))),
        "estimated_duration": f"{task.estimated_hours:g} hours",
        "risk": risk,
        "confidence": 88 if task.description else 74,
        "recommended_start_time": start.isoformat(),
        "estimated_finish_time": finish.isoformat(),
        "success_probability": success_probability,
        "dependencies": ["Clear requirements", "Required files or links", "Submission destination"],
        "reasoning": f"{risk} risk is based on {task.estimated_hours:g} hours of work and {hours_left:.1f} hours remaining.",
        "gemini_summary": f"{task.title} should be handled {'immediately' if risk in ['High', 'Critical'] else 'with a protected focus block'} because effort and deadline pressure are converging.",
        "ai_summary": f"{task.title} should be handled {'immediately' if risk in ['High', 'Critical'] else 'with a protected focus block'} because effort and deadline pressure are converging.",
        "recommendation": "Begin within the next 30 minutes." if risk in ["High", "Critical"] else "Schedule this before lower-value work.",
    }


def fallback_plan(task: Task, workload: list[Task]) -> dict:
    analysis = analyze_task(task, workload)
    risk = analysis["risk"]
    return {
        "priority": task.priority,
        "analysis": analysis,
        "risk": risk,
        "execution_plan": [
            {"phase": "Research", "time": "Next 25 min", "action": f"Open {task.title} and define the first deliverable."},
            {"phase": "Execution", "time": "Focus block", "action": "Complete the highest-impact work with notifications off."},
            {"phase": "Testing", "time": "Review block", "action": "Validate quality, edge cases, and submission requirements."},
            {"phase": "Submission", "time": "Final 20 min", "action": "Package, submit, and record completion notes."},
        ],
        "subtasks": [
            "Clarify the expected outcome",
            "Gather required resources",
            "Complete the core work",
            "Review and submit before the deadline",
        ],
        "milestones": ["Start now", "Reach 50% completion", "Final review", "Submit"],
        "timeline": f"Reserve {task.estimated_hours:g} focused hours before {task.deadline.strftime('%b %d, %Y %H:%M')}.",
        "today_schedule": ["Start with this task", "Defer low-priority work", "Protect one review window"],
        "recommendation": "Start immediately." if risk in ["High", "Critical"] else "Schedule a focused work block today.",
        "reasoning": "Risk is based on remaining time, estimated effort, and active workload.",
        "motivation": "Small, visible progress now beats a stressful rescue later.",
        "estimated_completion_time": f"{task.estimated_hours:g} focused hours",
        "breaks": ["5 minute reset after every 50 minutes", "One longer break before final review"],
        "dependencies": ["Clear requirements", "Required files or links", "Submission destination"],
    }


def generate_plan(task: Task, workload: list[Task]) -> dict:
    fallback = fallback_plan(task, workload)
    prompt = f"""
Act as a proactive productivity coach. Analyze this task and return JSON only.
Task: {task.model_dump(mode="json")}
Current workload: {[t.model_dump(mode="json") for t in workload if t.status != "Completed"]}
Include keys: priority, risk, execution_plan, subtasks, milestones, timeline,
today_schedule, recommendation, reasoning, motivation, estimated_completion_time,
analysis, breaks, dependencies. The analysis object must include priority_score,
urgency, importance, estimated_duration, risk, confidence, recommended_start_time,
estimated_finish_time, success_probability, ai_summary, recommendation.
Current time: {datetime.utcnow().isoformat()}Z
"""
    return _generate_json(prompt, fallback)


def command_center(tasks: list[Task], user_name: str = "there") -> dict:
    active = [task for task in tasks if task.status != "Completed"]
    analyses = [task.ai_plan.get("analysis", analyze_task(task, tasks)) if task.ai_plan else analyze_task(task, tasks) for task in active]
    high_risk = [task for task, analysis in zip(active, analyses) if analysis["risk"] in ["High", "Critical"]]
    medium_risk = [task for task, analysis in zip(active, analyses) if analysis["risk"] == "Medium"]
    safe = [task for task, analysis in zip(active, analyses) if analysis["risk"] == "Low"]
    productive_hours = min(8, max(2, round(sum(task.estimated_hours for task in active[:5]), 1)))
    next_task = sorted(active, key=lambda task: task.ai_plan.get("analysis", {}).get("priority_score", 50) if task.ai_plan else 50, reverse=True)[:1]
    fallback = {
        "greeting": f"Good Morning {user_name}",
        "summary": f"Today looks {'busy' if len(active) > 3 else 'manageable'}. You have {len(active)} active tasks.",
        "productivity_score": max(40, min(97, 92 - len(high_risk) * 9 + len(safe) * 2)),
        "todays_focus": next_task[0].title if next_task else "Add one meaningful task",
        "estimated_workload": f"{sum(task.estimated_hours for task in active):g} hours",
        "remaining_hours": productive_hours,
        "productive_hours": productive_hours,
        "high_risk_tasks": [task.title for task in high_risk],
        "medium_risk_tasks": [task.title for task in medium_risk],
        "safe_tasks": [task.title for task in safe],
        "deadline_health": "At Risk" if high_risk else "Healthy",
        "energy_recommendation": "Use your first deep-work block for the riskiest task.",
        "next_best_action": f"Complete {next_task[0].title} first." if next_task else "Capture the next deadline.",
        "recommendation": "Delay flexible low-priority work until the main deadline is under control.",
        "success_probability": max(30, min(96, 91 - len(high_risk) * 8)),
        "ai_summary": f"{len(high_risk)} high-risk tasks, {len(medium_risk)} medium-risk tasks, and {len(safe)} safe tasks are active.",
    }
    prompt = f"Return JSON only. Create an AI command center for user {user_name}. Tasks: {[t.model_dump(mode='json') for t in tasks]}. Required keys: {list(fallback.keys())}"
    return _generate_json(prompt, fallback)


def daily_planner(tasks: list[Task]) -> dict:
    active = sorted([task for task in tasks if task.status != "Completed"], key=lambda task: _aware_deadline(task))
    start = datetime.combine(datetime.now().date(), time(9, 0))
    schedule = []
    for task in active[:6]:
        end = start + timedelta(hours=min(task.estimated_hours, 2.5))
        schedule.append({"start": start.strftime("%H:%M"), "end": end.strftime("%H:%M"), "title": task.title, "type": "Focus", "risk": task.ai_plan.get("risk", "Medium") if task.ai_plan else "Medium"})
        start = end + timedelta(minutes=30)
    fallback = {
        "schedule": schedule or [{"start": "09:00", "end": "10:00", "title": "Plan your next deadline", "type": "Planning", "risk": "Low"}],
        "strategy": "Front-load risky work, batch admin tasks, and leave a final review buffer.",
        "conflicts": [],
        "balance_score": 86 if len(active) < 5 else 72,
    }
    prompt = f"Return JSON only. Build a conflict-aware daily schedule with keys schedule, strategy, conflicts, balance_score. Tasks: {[t.model_dump(mode='json') for t in active]}"
    return _generate_json(prompt, fallback)


def weekly_insights(tasks: list[Task]) -> dict:
    completed = [task for task in tasks if task.status == "Completed"]
    overdue = [task for task in tasks if task.status != "Completed" and _aware_deadline(task) < datetime.now(timezone.utc)]
    fallback = {
        "daily_summary": f"{len([task for task in tasks if task.status != 'Completed'])} active tasks need attention today.",
        "weekly_review": f"You completed {len(completed)} tasks and have {len(overdue)} overdue risks to address.",
        "strengths": ["Clear prioritization", "Good visibility into upcoming work"],
        "weaknesses": ["Some work is still scheduled too close to deadlines"],
        "suggestions": ["Start high-risk tasks earlier", "Use two protected focus blocks before noon", "Batch low-value admin work"],
        "productivity_trend": "Improving" if completed else "Needs momentum",
        "burnout_detection": "Medium" if sum(t.estimated_hours for t in tasks if t.status != "Completed") > 10 else "Low",
        "time_waste_analysis": "Context switching is the largest likely productivity leak.",
        "most_productive_hours": ["09:00-11:00", "14:00-16:00"],
    }
    prompt = f"Return JSON only. Generate productivity insights with keys {list(fallback.keys())}. Tasks: {[t.model_dump(mode='json') for t in tasks]}"
    return _generate_json(prompt, fallback)


def parse_natural_language(text: str) -> list[dict]:
    model = _model()
    now = datetime.now(timezone.utc)
    fallback_items = []
    chunks = [chunk.strip(" .") for chunk in re.split(r"[\n.]+", text) if chunk.strip()]
    for chunk in chunks:
        lower = chunk.lower()
        deadline = now + timedelta(days=1)
        if "friday" in lower:
            days = (4 - now.weekday()) % 7 or 7
            deadline = now + timedelta(days=days)
            if "3" in lower:
                deadline = deadline.replace(hour=15, minute=0)
        elif "tomorrow" in lower:
            deadline = (now + timedelta(days=1)).replace(hour=18, minute=0)
        elif "monday" in lower:
            days = (0 - now.weekday()) % 7 or 7
            deadline = (now + timedelta(days=days)).replace(hour=18, minute=0)
        category = "Health" if "gym" in lower else "Finance" if "bill" in lower or "pay" in lower else "Interview" if "interview" in lower else "Work"
        fallback_items.append({
            "title": chunk[:120],
            "description": f"Created from: {chunk}",
            "category": category,
            "deadline": deadline.isoformat(),
            "estimated_hours": 1 if category in ["Finance", "Health"] else 2,
            "priority": "High" if category in ["Interview", "Work"] else "Medium",
            "status": "To Do",
            "recurrence": "Daily" if "every" in lower else None,
        })
    if not model:
        return fallback_items
    prompt = f"Extract tasks from this text into a JSON array only. Use fields title, description, category, deadline ISO, estimated_hours, priority, status, recurrence. Current time {now.isoformat()}. Text: {text}"
    for attempt in range(3):
        try:
            result = _json_from_text(model.generate_content(prompt).text, fallback_items)
            return result if isinstance(result, list) else fallback_items
        except Exception:
            if attempt == 2:
                return fallback_items
            sleep_time.sleep(0.35 * (attempt + 1))
