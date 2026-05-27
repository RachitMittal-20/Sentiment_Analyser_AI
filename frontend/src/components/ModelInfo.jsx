function LoadingSkeleton() {
  return (
    <div className="panel px-5 py-6 sm:px-8 sm:py-8">
      <div className="space-y-5">
        <div className="h-3 w-32 rounded-full shimmer" />
        <div className="h-14 w-full rounded-[1.75rem] shimmer" />
        <div className="grid gap-3 md:grid-cols-2">
          <div className="h-28 rounded-[1.75rem] shimmer" />
          <div className="h-28 rounded-[1.75rem] shimmer" />
        </div>
      </div>
    </div>
  );
}

export default function ModelInfo({
  apiStatus,
  error,
  isLoading,
  isRefreshing,
  modelInfo,
  onRefresh,
}) {
  const isUp = apiStatus === "up";

  if (isLoading && !modelInfo) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <article className="panel overflow-hidden">
        <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
          <div className="space-y-3">
            <p className="kicker">Model Information</p>
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold uppercase tracking-[-0.05em] sm:text-4xl">
                Runtime metadata and health.
              </h2>
              <p className="max-w-3xl text-sm uppercase tracking-[0.16em] text-text-muted">
                The card below mirrors the live backend model metadata exposed by
                FastAPI.
              </p>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-negative/50 bg-negative/10 px-4 py-3 text-sm text-negative">
              {error}
            </div>
          ) : null}

          {modelInfo ? (
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="rounded-[1.75rem] border border-border bg-background/80 p-5">
                <p className="kicker">Model Name</p>
                <h3 className="mt-3 text-3xl font-extrabold uppercase tracking-[-0.06em]">
                  {modelInfo.model_name}
                </h3>
                <p className="mt-4 text-sm uppercase tracking-[0.16em] text-text-muted">
                  {modelInfo.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.75rem] border border-border bg-background/80 p-5">
                  <p className="kicker">Task</p>
                  <p className="mt-3 text-xl font-bold uppercase tracking-[0.14em]">
                    {modelInfo.task}
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-border bg-background/80 p-5">
                  <p className="kicker">Labels</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {modelInfo.labels.map((label) => (
                      <span
                        key={label}
                        className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.22em] ${
                          label === "POSITIVE"
                            ? "border-positive/40 bg-positive/10 text-positive"
                            : "border-negative/40 bg-negative/10 text-negative"
                        }`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-border bg-background/70 px-5 py-10 text-center">
              <p className="text-xl font-bold uppercase tracking-[0.14em]">
                Model metadata is unavailable right now.
              </p>
            </div>
          )}
        </div>
      </article>

      <aside className="panel px-5 py-6 sm:px-6">
        <p className="kicker">API Ping</p>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3 rounded-[1.75rem] border border-border bg-background/80 px-4 py-4">
            <span
              className={`h-3 w-3 rounded-full ${isUp ? "bg-positive" : "bg-negative"}`}
              aria-hidden="true"
            />
            <div>
              <p className="font-heading text-lg font-bold uppercase tracking-[0.18em]">
                {isUp ? "API Up" : "API Down"}
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
                Refresh every 30 seconds
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="focus-ring flex w-full items-center justify-center gap-3 rounded-full border border-border px-5 py-3 text-sm uppercase tracking-[0.22em] text-text-primary transition duration-200 hover:border-accent hover:text-accent active:scale-[0.97]"
          >
            {isRefreshing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent/35 border-t-accent" />
                Refreshing
              </>
            ) : (
              "Refresh Status"
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}
