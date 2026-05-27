# Hugging Face Space Deployment (Docker)

This project can be deployed as a single Docker Space that serves both the
FastAPI backend and the React frontend.

## Prereqs

- A Hugging Face account with a Docker Space: `rachitmittal20/sentimentapi-space`
- A model repo uploaded to the Hub: `rachitmittal20/sentimentapi-distilbert-sst2`

## Environment Variables (Space Settings)

- `HF_MODEL_ID=rachitmittal20/sentimentapi-distilbert-sst2`
- `PORT=7860`

## How it works

- Docker builds the React app and copies it to `backend/public`.
- FastAPI serves the built assets and the API from the same server.

## Local Docker Run

```bash
docker build -t sentimentapi .
docker run -p 7860:7860 -e HF_MODEL_ID=rachitmittal20/sentimentapi-distilbert-sst2 sentimentapi
```

## Deploy

Push this repo to GitHub and link it to the Space. The Space should build and
serve on port 7860 automatically.
