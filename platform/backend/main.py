from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routes import auth, session, webhook, hint

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pwnchain Platform API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"], # Default Vite ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(session.router, prefix="/api/session", tags=["session"])
app.include_router(webhook.router, prefix="/api/webhook", tags=["webhook"])
app.include_router(hint.router, prefix="/api/hint", tags=["hint"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Pwnchain API"}
