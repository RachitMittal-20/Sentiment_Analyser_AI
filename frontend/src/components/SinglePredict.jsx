import { useState } from "react";
import { predictSingle } from "../api/sentimentApi";
import ResultCard from "./ResultCard";

export default function SinglePredict() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const characterCount = text.length;
  const isDisabled = isLoading || !text.trim();

  async function handleSubmit(event) {
    event.preventDefault();
    if (isDisabled) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await predictSingle(text);
      setResult(response);
    } catch (requestError) {
      setError(requestError.message || "Unable to analyze sentiment.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
      <article className="panel overflow-hidden">
        <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
          <div className="space-y-3">
            <p className="kicker">Single Prediction</p>
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold uppercase tracking-[-0.05em] sm:text-4xl">
                One text. One verdict.
              </h2>
              <p className="max-w-2xl text-sm uppercase tracking-[0.16em] text-text-muted">
                Paste a sentence, review the confidence, and inspect the exact
                text returned by the API.
              </p>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-negative/50 bg-negative/10 px-4 py-3 text-sm text-negative">
              {error}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-3">
              <span className="text-xs uppercase tracking-[0.22em] text-text-muted">
                Review Text
              </span>
              <textarea
                className="focus-ring min-h-[18rem] w-full resize-none rounded-[1.75rem] border border-border bg-background/80 px-5 py-5 text-sm leading-7 text-text-primary placeholder:text-text-muted"
                placeholder="This movie is surprisingly tender, funny, and sharp."
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
            </label>

            <div className="flex items-center justify-between gap-4">
              <p
                className={`text-xs uppercase tracking-[0.22em] ${
                  characterCount > 512 ? "text-negative" : "text-text-muted"
                }`}
              >
                {characterCount} / 512
              </p>
              <p className="hidden text-xs uppercase tracking-[0.18em] text-text-muted sm:block">
                Long inputs are truncated by the backend before inference.
              </p>
            </div>

            <button
              type="submit"
              disabled={isDisabled}
              className="focus-ring flex w-full items-center justify-center gap-3 rounded-full bg-accent px-6 py-4 font-heading text-base font-bold uppercase tracking-[0.18em] text-background transition duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/40 border-t-background" />
                  Analyzing
                </>
              ) : (
                "Analyze"
              )}
            </button>
          </form>
        </div>
      </article>

      <aside className="space-y-4">
        <div className="panel px-5 py-6 sm:px-6">
          <p className="kicker">Live Output</p>
          <div className="mt-3 space-y-2">
            <h3 className="text-2xl font-bold uppercase tracking-[-0.05em]">
              Prediction Result
            </h3>
            <p className="text-sm uppercase tracking-[0.16em] text-text-muted">
              Confidence is returned as a raw float and presented here as a
              percentage.
            </p>
          </div>
        </div>

        {isLoading ? <ResultCard isLoading /> : null}
        {!isLoading && result ? <ResultCard key={JSON.stringify(result)} result={result} /> : null}

        {!isLoading && !result ? (
          <div className="panel border-dashed px-5 py-12 text-center sm:px-6">
            <p className="kicker">Awaiting Input</p>
            <p className="mt-4 text-2xl font-bold uppercase tracking-[-0.05em] text-text-primary">
              Your sentiment readout appears here.
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
