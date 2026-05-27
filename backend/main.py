"""FastAPI application for SentimentAPI."""

from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from predict import load_predictor

PUBLIC_DIR = Path(__file__).resolve().parent / "public"


class PredictionRequest(BaseModel):
    """Request body for single prediction."""

    text: str = Field(..., description="The text to analyze.")


class BatchPredictionRequest(BaseModel):
    """Request body for batch prediction."""

    texts: list[str] = Field(..., description="A list of texts to analyze.")


class PredictionResponse(BaseModel):
    """Single prediction payload."""

    label: str
    confidence: float
    text: str


class BatchPredictionResponse(BaseModel):
    """Batch prediction payload."""

    results: list[PredictionResponse]


class RootResponse(BaseModel):
    """Health response payload."""

    status: str
    model_name: str


class ModelInfoResponse(BaseModel):
    """Metadata response payload."""

    model_name: str
    task: str
    labels: list[str]
    description: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the fine-tuned model once at startup."""
    app.state.predictor = load_predictor()
    yield


app = FastAPI(
    title="SentimentAPI",
    description="Fine-tuned DistilBERT sentiment analysis served with FastAPI.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_predictor(request: Request):
    """Fetch the shared predictor instance from application state."""
    return request.app.state.predictor


@app.get("/", response_model=RootResponse)
async def read_root(request: Request) -> dict[str, Any]:
    """Return API status and the loaded model name."""
    predictor = get_predictor(request)
    return {"status": "ok", "model_name": predictor.model_name}


@app.post("/predict", response_model=PredictionResponse)
async def predict_sentiment(
    payload: PredictionRequest,
    request: Request,
) -> dict[str, Any]:
    """Predict sentiment for a single input."""
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text must not be empty.")

    predictor = get_predictor(request)
    return predictor.predict(payload.text)


@app.post("/batch", response_model=BatchPredictionResponse)
async def batch_predict_sentiment(
    payload: BatchPredictionRequest,
    request: Request,
) -> dict[str, Any]:
    """Predict sentiment for up to 10 non-empty inputs."""
    valid_texts = [text for text in payload.texts if text.strip()]

    if not valid_texts:
        raise HTTPException(
            status_code=400,
            detail="Batch requests must include at least one non-empty text.",
        )
    if len(valid_texts) > 10:
        raise HTTPException(
            status_code=400,
            detail="Batch requests support a maximum of 10 non-empty texts.",
        )

    predictor = get_predictor(request)
    return {"results": predictor.predict_many(valid_texts)}


@app.get("/model-info", response_model=ModelInfoResponse)
async def read_model_info(request: Request) -> dict[str, Any]:
    """Return metadata about the loaded model."""
    predictor = get_predictor(request)
    return predictor.model_info


if PUBLIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(PUBLIC_DIR), html=True), name="static")
