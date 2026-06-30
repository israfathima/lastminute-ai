import json
import uuid
from datetime import datetime, timezone
from firebase_admin import credentials, firestore, initialize_app, get_app
from app.config import get_settings
from app.schemas.task import Task, TaskCreate, TaskUpdate


class TaskStore:
    def __init__(self):
        self._memory: dict[str, Task] = {}
        self._db = self._init_firestore()

    def _init_firestore(self):
        settings = get_settings()
        if not settings.firebase_project_id:
            return None
        try:
            try:
                get_app()
            except ValueError:
                if settings.firebase_service_account_json:
                    cred = credentials.Certificate(json.loads(settings.firebase_service_account_json))
                    initialize_app(cred, {"projectId": settings.firebase_project_id})
                else:
                    initialize_app(options={"projectId": settings.firebase_project_id})
            return firestore.client()
        except Exception:
            return None

    def _collection(self, user_id: str):
        return self._db.collection("users").document(user_id).collection("tasks")

    def list(self, user_id: str) -> list[Task]:
        if not self._db:
            return [task for task in self._memory.values() if task.user_id == user_id]
        return [Task(**doc.to_dict(), id=doc.id) for doc in self._collection(user_id).stream()]

    def create(self, user_id: str, payload: TaskCreate) -> Task:
        task = Task(
            id=str(uuid.uuid4()),
            user_id=user_id,
            created_at=datetime.now(timezone.utc),
            completed_at=None,
            ai_plan=None,
            **payload.model_dump(),
        )
        self.save(task)
        return task

    def save(self, task: Task) -> Task:
        if task.status == "Completed" and task.completed_at is None:
            task.completed_at = datetime.now(timezone.utc)
        if not self._db:
            self._memory[task.id] = task
        else:
            data = task.model_dump()
            data.pop("id", None)
            self._collection(task.user_id).document(task.id).set(data)
        return task

    def get(self, user_id: str, task_id: str) -> Task | None:
        if not self._db:
            task = self._memory.get(task_id)
            return task if task and task.user_id == user_id else None
        doc = self._collection(user_id).document(task_id).get()
        return Task(**doc.to_dict(), id=doc.id) if doc.exists else None

    def update(self, user_id: str, task_id: str, payload: TaskUpdate) -> Task | None:
        task = self.get(user_id, task_id)
        if not task:
            return None
        data = task.model_dump()
        data.update(payload.model_dump(exclude_unset=True))
        return self.save(Task(**data))

    def delete(self, user_id: str, task_id: str) -> bool:
        if not self.get(user_id, task_id):
            return False
        if not self._db:
            del self._memory[task_id]
        else:
            self._collection(user_id).document(task_id).delete()
        return True


store = TaskStore()
