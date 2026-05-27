# SentimentAPI Backend

FastAPI service for a fine-tuned DistilBERT sentiment model.

## Local setup

```bash
pip install -r requirements.txt
python train.py
uvicorn main:app --reload
```

The API fails fast on startup until `./model/` exists with trained artifacts. You
can also load from the Hugging Face Hub by setting `HF_MODEL_ID`.

## Routes

- `GET /` — API status and model name
- `POST /predict` — single-text sentiment prediction
- `POST /batch` — batch prediction for up to 10 non-empty texts
- `GET /model-info` — model metadata

See the root [`README.md`](/Users/rachitmittal20/Sentiment_classifier/README.md) for the full project guide and deployment steps.
