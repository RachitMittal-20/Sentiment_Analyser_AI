import { useEffect, useState } from "react";
import { predictBatch } from "../api/sentimentApi";
import ResultCard from "./ResultCard";

function createRow(id) {
  return { id, text: "" };
}

function calculateSummary(results) {
  return results.reduce(
    (summary, result) => {
      if (result.label === "POSITIVE") {
        summary.positive += 1;
      } else {
        summary.negative += 1;
      }
      return summary;
    },
    { positive: 0, negative: 0 },
  );
}

export default function BatchPredict() {
  const [rows, setRows] = useState([createRow(1), createRow(2)]);
  const [nextRowId, setNextRowId] = useState(3);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animatedSummary, setAnimatedSummary] = useState({ positive: 0, negative: 0 });

  const summary = calculateSummary(results);
  const positiveCount = summary.positive;
  const negativeCount = summary.negative;
  const hasValidRows = rows.some((row) => row.text.trim());

  useEffect(() => {
    if (!results.length) {
      setAnimatedSummary({ positive: 0, negative: 0 });
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setAnimatedSummary({ positive: positiveCount, negative: negativeCount });
      return;
    }

    let animationFrameId = 0;
    const startTime = performance.now();
    const duration = 700;

    const tick = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setAnimatedSummary({
        positive: Math.round(positiveCount * progress),
        negative: Math.round(negativeCount * progress),
      });

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(tick);
      }
    };

    animationFrameId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [results, positiveCount, negativeCount]);

  function updateRow(id, nextValue) {
    setRows((currentRows) =>
      currentRows.map((row) => (row.id === id ? { ...row, text: nextValue } : row)),
    );
  }

  function addRow() {
    if (rows.length >= 10) {
      return;
    }

    setRows((currentRows) => [...currentRows, createRow(nextRowId)]);
    setNextRowId((currentId) => currentId + 1);
  }

  function removeRow(id) {
    setRows((currentRows) => {
      if (currentRows.length === 1) {
        return currentRows;
      }
      return currentRows.filter((row) => row.id !== id);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validTexts = rows.map((row) => row.text).filter((text) => text.trim());

    if (!validTexts.length) {
      setError("Add at least one non-empty text before running a batch prediction.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await predictBatch(validTexts);
      setResults(response.results || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to analyze the current batch.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(20rem,1.1fr)]">
      <article className="panel overflow-hidden">
        <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
          <div className="space-y-3">
            <p className="kicker">Batch Prediction</p>
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold uppercase tracking-[-0.05em] sm:text-4xl">
                Multiple texts. One sweep.
              </h2>
              <p className="max-w-2xl text-sm uppercase tracking-[0.16em] text-text-muted">
                Blank rows are ignored. Valid rows are sent in order and the
                results return as a compact batch.
              </p>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-negative/50 bg-negative/10 px-4 py-3 text-sm text-negative">
              {error}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              {rows.map((row, index) => (
                <div
                  key={row.id}
                  className="flex items-start gap-3 rounded-[1.75rem] border border-border bg-background/80 p-3"
                >
                  <div className="mt-3 flex h-8 w-8 items-center justify-center rounded-full border border-border text-xs uppercase tracking-[0.2em] text-text-muted">
                    {index + 1}
                  </div>
                  <textarea
                    className="focus-ring min-h-[7.25rem] flex-1 resize-none rounded-[1.25rem] border border-border bg-surface px-4 py-3 text-sm leading-6 text-text-primary placeholder:text-text-muted"
                    placeholder={`Example ${index + 1}: The pacing drags, but the ending lands.`}
                    value={row.text}
                    onChange={(event) => updateRow(row.id, event.target.value)}
                  />
                  <button
                    type="button"
                    className="focus-ring mt-1 rounded-full border border-border px-3 py-2 text-xs uppercase tracking-[0.22em] text-text-muted transition hover:border-negative hover:text-negative"
                    onClick={() => removeRow(row.id)}
                    aria-label={`Remove text input ${index + 1}`}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={addRow}
                disabled={rows.length >= 10}
                className="focus-ring rounded-full border border-border px-5 py-3 text-sm uppercase tracking-[0.22em] text-text-primary transition duration-200 hover:border-accent hover:text-accent active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Add Another
              </button>
              <button
                type="submit"
                disabled={isLoading || !hasValidRows}
                className="focus-ring flex flex-1 items-center justify-center gap-3 rounded-full bg-accent px-6 py-3 font-heading text-base font-bold uppercase tracking-[0.18em] text-background transition duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" />
                    Analyzing All
                  </>
                ) : (
                  "Analyze All"
                )}
              </button>
            </div>
          </form>
        </div>
      </article>

      <aside className="space-y-4">
        <div className="panel px-5 py-6 sm:px-6">
          <p className="kicker">Batch Summary</p>
          <div className="mt-3 space-y-2">
            <h3 className="text-2xl font-bold uppercase tracking-[-0.05em]">
              Portfolio-ready sentiment totals
            </h3>
            <p className="text-sm uppercase tracking-[0.16em] text-text-muted">
              {animatedSummary.positive} Positive / {animatedSummary.negative} Negative
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
              <ResultCard key={`loading-${index}`} isLoading />
            ))}
          </div>
        ) : null}

        {!isLoading && results.length ? (
          <div className="space-y-4">
            {results.map((result, index) => (
              <ResultCard key={`${result.text}-${index}`} delayIndex={index} result={result} />
            ))}
          </div>
        ) : null}

        {!isLoading && !results.length ? (
          <div className="panel border-dashed px-5 py-12 text-center sm:px-6">
            <p className="kicker">Awaiting Batch</p>
            <p className="mt-4 text-2xl font-bold uppercase tracking-[-0.05em] text-text-primary">
              Batch results will stack here after analysis.
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
