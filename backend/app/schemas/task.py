from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class Priority(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"
    urgent = "Urgent"


class Status(str, Enum):
    todo = "To Do"
    in_progress = "In Progress"
    completed = "Completed"


class TaskBase(BaseModel):
    title: str = Field(min_length=2, max_length=140)
    description: str = ""
    category: str = "General"
    deadline: datetime
    estimated_hours: float = Field(gt=0, le=200)
    priority: Priority = Priority.medium
    status: Status = Status.todo
    recurrence: str | None = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=140)
    description: str | None = None
    category: str | None = None
    deadline: datetime | None = None
    estimated_hours: float | None = Field(default=None, gt=0, le=200)
    priority: Priority | None = None
    status: Status | None = None
    recurrence: str | None = None


class Task(TaskBase):
    id: str
    user_id: str
    created_at: datetime
    completed_at: datetime | None = None
    ai_plan: dict | None = None
