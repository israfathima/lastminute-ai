from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routers import agent, planner, tasks

app = FastAPI(title="LastMinute AI API", version="1.0.0")
settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)
app.include_router(planner.router)
app.include_router(agent.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "lastminute-ai"}
