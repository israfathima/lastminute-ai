from fastapi import APIRouter, Depends, Header
from pydantic import BaseModel
from app.schemas.task import TaskCreate
from app.services.ai import command_center, daily_planner, generate_plan, parse_natural_language, weekly_insights
from app.services.store import store

router = APIRouter(prefix="/agent", tags=["agent"])


class NaturalLanguageRequest(BaseModel):
    text: str


def current_user(x_user_id: str | None = Header(default="demo-user")) -> str:
    return x_user_id or "demo-user"


@router.get("/command-center")
def get_command_center(user_name: str = "there", user_id: str = Depends(current_user)):
    tasks = store.list(user_id)
    return command_center(tasks, user_name)


@router.get("/daily-plan")
def get_daily_plan(user_id: str = Depends(current_user)):
    return daily_planner(store.list(user_id))


@router.get("/insights")
def get_insights(user_id: str = Depends(current_user)):
    return weekly_insights(store.list(user_id))


@router.post("/natural-language-tasks")
def create_from_natural_language(payload: NaturalLanguageRequest, user_id: str = Depends(current_user)):
    created = []
    for item in parse_natural_language(payload.text):
        task = store.create(user_id, TaskCreate(**item))
        task.ai_plan = generate_plan(task, store.list(user_id))
        created.append(store.save(task))
    return created
