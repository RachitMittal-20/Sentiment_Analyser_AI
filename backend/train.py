"""Fine-tune DistilBERT on SST-2 and save the best model locally."""

from __future__ import annotations

import shutil
from pathlib import Path
from typing import Any

import numpy as np
from datasets import DatasetDict, load_dataset
from sklearn.metrics import accuracy_score
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    EvalPrediction,
    Trainer,
    TrainingArguments,
    set_seed,
)

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"
TRAINING_OUTPUT_DIR = BASE_DIR / "training_artifacts"
BASE_MODEL_NAME = "distilbert-base-uncased"
DATASET_REPOSITORY = "nyu-mll/glue"
DATASET_CONFIG = "sst2"
MAX_SEQUENCE_LENGTH = 128
SEED = 42
LABELS = {0: "NEGATIVE", 1: "POSITIVE"}


def prepare_output_directories() -> None:
    """Ensure training outputs can be overwritten cleanly."""
    for directory in (MODEL_DIR, TRAINING_OUTPUT_DIR):
        if directory.exists():
            shutil.rmtree(directory)
        directory.mkdir(parents=True, exist_ok=True)


def load_tokenizer():
    """Load the tokenizer for the base checkpoint."""
    return AutoTokenizer.from_pretrained(BASE_MODEL_NAME)


def tokenize_datasets(tokenizer) -> DatasetDict:
    """Load and tokenize SST-2 splits."""
    dataset = load_dataset(DATASET_REPOSITORY, DATASET_CONFIG)

    def tokenize_batch(batch: dict[str, list[Any]]) -> dict[str, Any]:
        return tokenizer(
            batch["sentence"],
            truncation=True,
            max_length=MAX_SEQUENCE_LENGTH,
        )

    tokenized_dataset = dataset.map(tokenize_batch, batched=True)
    tokenized_dataset = tokenized_dataset.rename_column("label", "labels")
    return tokenized_dataset.remove_columns(["sentence", "idx"])


def compute_metrics(eval_prediction: EvalPrediction) -> dict[str, float]:
    """Compute accuracy from raw logits."""
    logits, labels = eval_prediction
    if isinstance(logits, tuple):
        logits = logits[0]
    predictions = np.argmax(logits, axis=-1)
    accuracy = accuracy_score(labels, predictions)
    return {"accuracy": float(accuracy)}


def model_init():
    """Create a fresh model instance for reproducible fine-tuning."""
    return AutoModelForSequenceClassification.from_pretrained(
        BASE_MODEL_NAME,
        num_labels=2,
        id2label=LABELS,
        label2id={label: index for index, label in LABELS.items()},
    )


def build_trainer(tokenized_dataset: DatasetDict, tokenizer) -> Trainer:
    """Create the Hugging Face Trainer with the requested settings."""
    training_args = TrainingArguments(
        output_dir=str(TRAINING_OUTPUT_DIR),
        num_train_epochs=2,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        eval_strategy="epoch",
        save_strategy="best",
        load_best_model_at_end=True,
        metric_for_best_model="accuracy",
        greater_is_better=True,
        save_total_limit=1,
        seed=SEED,
        data_seed=SEED,
        dataloader_pin_memory=False,
        report_to="none",
        logging_strategy="no",
    )

    return Trainer(
        args=training_args,
        train_dataset=tokenized_dataset["train"],
        eval_dataset=tokenized_dataset["validation"],
        processing_class=tokenizer,
        model_init=model_init,
        compute_metrics=compute_metrics,
    )


def save_final_artifacts(trainer: Trainer, tokenizer) -> None:
    """Persist the best fine-tuned model and tokenizer to ./model."""
    trainer.save_model(str(MODEL_DIR))
    tokenizer.save_pretrained(str(MODEL_DIR))
    if TRAINING_OUTPUT_DIR.exists():
        shutil.rmtree(TRAINING_OUTPUT_DIR)


def main() -> None:
    """Run end-to-end fine-tuning and print final validation metrics."""
    set_seed(SEED)
    prepare_output_directories()
    tokenizer = load_tokenizer()
    tokenized_dataset = tokenize_datasets(tokenizer)
    trainer = build_trainer(tokenized_dataset, tokenizer)

    trainer.train()
    evaluation_metrics = trainer.evaluate()
    save_final_artifacts(trainer, tokenizer)

    final_accuracy = float(evaluation_metrics["eval_accuracy"])
    final_loss = float(evaluation_metrics["eval_loss"])

    print(f"Final accuracy: {final_accuracy:.4f}")
    print(f"Final loss: {final_loss:.4f}")


if __name__ == "__main__":
    main()
