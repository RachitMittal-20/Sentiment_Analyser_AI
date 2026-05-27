const STATUS_STYLES = {
  down: {
    dot: "bg-negative",
    label: "DOWN",
  },
  loading: {
    dot: "bg-accent animate-pulse",
    label: "CHECKING",
  },
  up: {
    dot: "bg-positive",
    label: "LIVE",
  },
};

const INDICATOR_STYLES = {
  single: "translate-x-0",
  batch: "translate-x-full",
  "model-info": "translate-x-[200%]",
};

export default function Header({
  activeTab,
  apiStatus,
  modelName,
  onTabChange,
  tabs,
}) {
  const statusStyle = STATUS_STYLES[apiStatus] || STATUS_STYLES.loading;

  return (
    <header className="panel overflow-hidden">
      <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
        <div className="space-y-5">
          <p className="kicker">Techsolv AI Internship Portfolio Build</p>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-4xl font-extrabold uppercase leading-none tracking-[-0.06em] sm:text-5xl lg:text-7xl">
              Sentiment
              <span className="block text-accent">API</span>
            </h1>
            <p className="max-w-2xl text-sm uppercase tracking-[0.22em] text-text-muted sm:text-base">
              Fine-tuned DistilBERT sentiment analysis with a FastAPI backend and
              editorial React dashboard.
            </p>
          </div>
        </div>

        <div className="space-y-4 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="kicker">Runtime Status</p>
          <div className="flex items-center gap-3 rounded-full border border-border bg-background/70 px-4 py-3">
            <span className={`h-3 w-3 rounded-full ${statusStyle.dot}`} aria-hidden="true" />
            <div className="min-w-0">
              <p className="font-heading text-lg font-bold uppercase tracking-[0.18em] text-text-primary">
                {statusStyle.label}
              </p>
              <p className="truncate text-xs uppercase tracking-[0.14em] text-text-muted">
                {modelName}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-5 pb-4 pt-4 sm:px-8 sm:pb-6">
        <div className="scrollbar-none overflow-x-auto">
          <div className="relative min-w-[33rem]">
            <div className="grid grid-cols-3 border-b border-border">
              {tabs.map((tab) => {
                const isActive = tab.key === activeTab;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    className={`focus-ring relative px-4 py-4 text-left text-sm uppercase tracking-[0.22em] transition-colors duration-300 ${
                      isActive ? "text-text-primary" : "text-text-muted hover:text-text-primary"
                    }`}
                    onClick={() => onTabChange(tab.key)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <span
              className={`pointer-events-none absolute bottom-0 left-0 h-0.5 w-1/3 rounded-full bg-accent transition-transform duration-300 ease-out motion-reduce:transition-none ${INDICATOR_STYLES[activeTab]}`}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
