from fastapi import APIRouter, Depends, Header, HTTPException
from app.schemas.task import Task, TaskCreate, TaskUpdate
from app.services.ai import generate_plan
from app.services.store import store

router = APIRouter(prefix="/tasks", tags=["tasks"])


def current_user(x_user_id: str | None = Header(default="demo-user")) -> str:
    return x_user_id or "demo-user"


@router.get("", response_model=list[Task])
def list_tasks(user_id: str = Depends(current_user)):
    return store.list(user_id)


@router.post("", response_model=Task, status_code=201)
def create_task(payload: TaskCreate, user_id: str = Depends(current_user)):
    task = store.create(user_id, payload)
    task.ai_plan = generate_plan(task, store.list(user_id))
    return store.save(task)


@router.get("/{task_id}", response_model=Task)
def get_task(task_id: str, user_id: str = Depends(current_user)):
    task = store.get(user_id, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=Task)
def update_task(task_id: str, payload: TaskUpdate, user_id: str = Depends(current_user)):
    task = store.update(user_id, task_id, payload)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.ai_plan = generate_plan(task, store.list(user_id))
    return store.save(task)


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: str, user_id: str = Depends(current_user)):
    if not store.delete(user_id, task_id):
        raise HTTPException(status_code=404, detail="Task not found")
