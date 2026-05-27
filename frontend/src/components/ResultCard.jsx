import { useEffect, useState } from "react";

const DELAY_CLASSES = [
  "[animation-delay:0ms]",
  "[animation-delay:100ms]",
  "[animation-delay:200ms]",
  "[animation-delay:300ms]",
  "[animation-delay:400ms]",
  "[animation-delay:500ms]",
  "[animation-delay:600ms]",
  "[animation-delay:700ms]",
  "[animation-delay:800ms]",
  "[animation-delay:900ms]",
];

function getWidthClass(percent) {
  return `w-[${percent}%]`;
}

export default function ResultCard({ delayIndex = 0, isLoading = false, result }) {
  const [expanded, setExpanded] = useState(false);
  const [animateBar, setAnimateBar] = useState(false);

  useEffect(() => {
    if (isLoading) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setAnimateBar(true);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setAnimateBar(true);
    }, 80);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isLoading, result]);

  if (isLoading) {
    return (
      <article className="panel overflow-hidden px-5 py-5 sm:px-6">
        <div className="space-y-4">
          <div className="h-4 w-28 rounded-full shimmer" />
          <div className="h-10 w-full rounded-[1.25rem] shimmer" />
          <div className="h-3 w-2/3 rounded-full shimmer" />
          <div className="h-16 w-full rounded-[1.25rem] shimmer" />
        </div>
      </article>
    );
  }

  const isPositive = result.label === "POSITIVE";
  const glowClass = isPositive
    ? "border-positive/45 shadow-[0_0_0_1px_rgba(34,197,94,0.35),0_0_28px_rgba(34,197,94,0.14)]"
    : "border-negative/45 shadow-[0_0_0_1px_rgba(239,68,68,0.35),0_0_28px_rgba(239,68,68,0.14)]";
  const labelClass = isPositive ? "text-positive" : "text-negative";
  const progressClass = isPositive ? "bg-positive" : "bg-negative";
  const percent = Math.max(0, Math.min(100, Math.round(result.confidence * 100)));
  const widthClass = animateBar ? getWidthClass(percent) : "w-[0%]";
  const percentageLabel = `${(result.confidence * 100).toFixed(2)}%`;
  const canExpand = result.text.length > 180;
  const delayClass = DELAY_CLASSES[delayIndex] || DELAY_CLASSES[DELAY_CLASSES.length - 1];

  return (
    <article
      className={`panel animate-card-in overflow-hidden border ${glowClass} px-5 py-5 motion-reduce:animate-none sm:px-6 ${delayClass}`}
    >
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="kicker">Prediction</p>
            <h3 className={`mt-2 text-3xl font-extrabold uppercase tracking-[-0.05em] ${labelClass}`}>
              {result.label} {isPositive ? "✓" : "✗"}
            </h3>
          </div>
          <p className="rounded-full border border-border bg-background/70 px-3 py-2 text-xs uppercase tracking-[0.22em] text-text-muted">
            Confidence
          </p>
        </div>

        <div className="space-y-2">
          <div className="h-3 w-full overflow-hidden rounded-full bg-border">
            <div
              className={`h-full rounded-full ${progressClass} ${widthClass} transition-[width] duration-700 ease-out motion-reduce:transition-none`}
              role="progressbar"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={percent}
              aria-label={`Confidence ${percentageLabel}`}
            />
          </div>
          <p className="text-sm uppercase tracking-[0.22em] text-text-muted">
            {percentageLabel}
          </p>
        </div>

        <div className="space-y-3">
          <p className="kicker">Input Text</p>
          <div
            className={`overflow-hidden rounded-[1.25rem] border border-border bg-background/75 px-4 py-4 text-sm leading-7 text-text-muted transition-[max-height] duration-300 motion-reduce:transition-none ${
              expanded ? "max-h-72" : "max-h-24"
            }`}
          >
            {result.text}
          </div>
          {canExpand ? (
            <button
              type="button"
              className="focus-ring text-xs uppercase tracking-[0.22em] text-accent transition hover:text-text-primary"
              onClick={() => setExpanded((current) => !current)}
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
