# ---- build frontend ----
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
ARG VITE_API_URL=/
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# ---- backend ----
FROM python:3.10-slim
WORKDIR /app/backend
COPY backend/ /app/backend
RUN pip install --no-cache-dir -r /app/backend/requirements.txt
COPY --from=frontend-build /app/frontend/dist /app/backend/public

ENV PORT=7860
EXPOSE 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
