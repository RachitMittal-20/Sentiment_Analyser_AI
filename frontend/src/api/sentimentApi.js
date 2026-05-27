const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(
  /\/$/,
  "",
);

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "detail" in payload
        ? payload.detail
        : `Request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return payload;
}

export function predictSingle(text) {
  return request("/predict", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export function predictBatch(texts) {
  return request("/batch", {
    method: "POST",
    body: JSON.stringify({ texts }),
  });
}

export function getModelInfo() {
  return request("/model-info");
}
