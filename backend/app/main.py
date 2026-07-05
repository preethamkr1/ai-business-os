from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth import router as auth_router
from app.routes.business import router as business_router
from app.routes.dashboard import router as dashboard_router
from app.routes.copilot import router as copilot_router
from app.routes.upload import router as upload_router
from app.routes.agents import router as agents_router
from app.routes.feedback import router as feedback_router
from app.routes.marketing_data import router as marketing_data_router

app = FastAPI(
    title="Business Growth OS",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    business_router,
    prefix="/business",
    tags=["Business"]
)

app.include_router(
    dashboard_router,
    prefix="/dashboard",
    tags=["Dashboard"]
)

app.include_router(
    copilot_router,
    prefix="/copilot",
    tags=["Copilot"]
)

app.include_router(
    upload_router,
    prefix="/upload",
    tags=["Upload"]
)

app.include_router(
    agents_router,
    prefix="/agents",
    tags=["Agents"]
)

app.include_router(
    feedback_router,
    prefix="/feedback",
    tags=["Feedback"]
)

app.include_router(
    marketing_data_router,
    prefix="/marketing-data",
    tags=["Marketing Data"]
)


@app.get("/")
def root():
    return {
        "project": "Business Growth OS",
        "status": "running",
        "agents": [
            "Orion",
            "Athena",
            "Hermes",
            "Apollo",
            "Argus"
        ]
    }