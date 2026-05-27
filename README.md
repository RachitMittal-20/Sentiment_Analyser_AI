# SentimentAPI

Fine-tuned DistilBERT sentiment analysis with a FastAPI backend and an editorial React dashboard.

## Live Demo

- Frontend: https://sentimentapi-frontend.onrender.com
- API Docs: https://sentimentapi-backend.onrender.com/docs

## Tech Stack

- Model: DistilBERT fine-tuned on GLUE SST-2 with Hugging Face Transformers
- Backend: Python 3.10, FastAPI, Uvicorn
- Frontend: React, Vite, Tailwind CSS
- Deploy: Render Web Service + Render Static Site

## Project Structure

```text
.
├── backend
│   ├── main.py
│   ├── predict.py
│   ├── train.py
│   └── requirements.txt
├── frontend
│   ├── src
│   └── package.json
├── render.yaml
└── README.md
```

## Run Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
python train.py
uvicorn main:app --reload
```

Visit `http://localhost:8000/docs` after the model finishes training.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend uses `VITE_API_URL` from `.env` and falls back to `http://localhost:8000`.

## API Routes

- `GET /` returns API status and model name
- `POST /predict` accepts `{ "text": "..." }`
- `POST /batch` accepts `{ "texts": ["...", "..."] }`
- `GET /model-info` returns model metadata

## Model Details

- Base checkpoint: `distilbert-base-uncased`
- Dataset: `glue/sst2`
- Training: 2 epochs, batch size 16, validation each epoch
- Best model selection: validation accuracy
- Sequence length: 128 tokens
- Output labels: `POSITIVE` / `NEGATIVE`

## Render Deployment

### Backend Web Service

- Name: `sentimentapi-backend`
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment Variables: `PYTHON_VERSION=3.10.0`

### Frontend Static Site

- Name: `sentimentapi-frontend`
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment Variables: `VITE_API_URL=https://sentimentapi-backend.onrender.com`

`render.yaml` is included for Blueprint-based deployment of both services.

## Portfolio Highlights

- `train.py` demonstrates reproducible Hugging Face fine-tuning
- `predict.py` handles inference and confidence scoring
- `main.py` exposes four production-style FastAPI routes
- `frontend/src/components/*` delivers the React dashboard and UX states
