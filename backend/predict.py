"""Inference utilities for the fine-tuned SentimentAPI model."""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Sequence

from transformers import (
    AutoConfig,
    AutoModelForSequenceClassification,
    AutoTokenizer,
    TextClassificationPipeline,
    pipeline,
)

MODEL_DIR = Path(__file__).resolve().parent / "model"
MODEL_DESCRIPTION = (
    "Fine-tuned DistilBERT model trained on GLUE SST-2 for binary "
    "sentiment classification."
)
MODEL_NAME = "distilbert-base-uncased"
MODEL_TASK = "sentiment-analysis"
MAX_SEQUENCE_LENGTH = 128


@dataclass(slots=True)
class SentimentPredictor:
    """Wrapper around a Hugging Face text-classification pipeline."""

    classifier: TextClassificationPipeline
    config: Any

    @property
    def model_name(self) -> str:
        """Expose the base checkpoint name stored in model config."""
        return MODEL_NAME

    @property
    def model_info(self) -> dict[str, Any]:
        """Return model metadata for the API."""
        labels = [
            label
            for _, label in sorted(
                getattr(self.config, "id2label", {0: "NEGATIVE", 1: "POSITIVE"}).items()
            )
        ]
        return {
            "model_name": self.model_name,
            "task": MODEL_TASK,
            "labels": labels,
            "description": MODEL_DESCRIPTION,
        }

    def predict(self, text: str) -> dict[str, Any]:
        """Run sentiment inference on a single input string."""
        normalized_text = text.strip()
        if not normalized_text:
            raise ValueError("Text must not be empty.")

        result = self.classifier(
            normalized_text,
            truncation=True,
            max_length=MAX_SEQUENCE_LENGTH,
        )[0]
        return {
            "label": str(result["label"]),
            "confidence": round(float(result["score"]), 4),
            "text": text,
        }

    def predict_many(self, texts: Sequence[str]) -> list[dict[str, Any]]:
        """Run sentiment inference for multiple validated inputs."""
        normalized_texts = [text.strip() for text in texts]
        if not normalized_texts:
            return []

        results = self.classifier(
            normalized_texts,
            truncation=True,
            max_length=MAX_SEQUENCE_LENGTH,
            batch_size=min(8, len(normalized_texts)),
        )
        return [
            {
                "label": str(result["label"]),
                "confidence": round(float(result["score"]), 4),
                "text": original_text,
            }
            for original_text, result in zip(texts, results, strict=True)
        ]


def _validate_model_directory(model_dir: Path) -> None:
    """Raise a clear error if the fine-tuned model has not been created yet."""
    if not model_dir.exists():
        raise FileNotFoundError(
            "Model directory not found. Run `python train.py` in backend/ before "
            "starting the API."
        )

    required_files = [
        model_dir / "config.json",
        model_dir / "tokenizer_config.json",
    ]
    missing_files = [path.name for path in required_files if not path.exists()]

    model_weights_exist = any(
        (model_dir / filename).exists()
        for filename in ("model.safetensors", "pytorch_model.bin")
    )
    if not model_weights_exist:
        missing_files.append("model.safetensors or pytorch_model.bin")

    if missing_files:
        joined = ", ".join(missing_files)
        raise FileNotFoundError(
            "Model artifacts are incomplete in ./model. Missing: "
            f"{joined}. Run `python train.py` to regenerate them."
        )


def load_predictor(model_dir: Path = MODEL_DIR) -> SentimentPredictor:
    """Load the fine-tuned sentiment model from disk or the Hub."""
    model_id = os.getenv("HF_MODEL_ID")
    if model_id:
        config = AutoConfig.from_pretrained(model_id)
        tokenizer = AutoTokenizer.from_pretrained(model_id)
        model = AutoModelForSequenceClassification.from_pretrained(model_id)
    else:
        _validate_model_directory(model_dir)
        config = AutoConfig.from_pretrained(model_dir)
        tokenizer = AutoTokenizer.from_pretrained(model_dir)
        model = AutoModelForSequenceClassification.from_pretrained(model_dir)
    classifier = pipeline(
        task=MODEL_TASK,
        model=model,
        tokenizer=tokenizer,
    )
    return SentimentPredictor(classifier=classifier, config=config)
