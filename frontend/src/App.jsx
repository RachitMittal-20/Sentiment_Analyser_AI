import { useEffect, useState } from "react";
import { getModelInfo } from "./api/sentimentApi";
import BatchPredict from "./components/BatchPredict";
import Header from "./components/Header";
import ModelInfo from "./components/ModelInfo";
import SinglePredict from "./components/SinglePredict";

const TABS = [
  { key: "single", label: "Single" },
  { key: "batch", label: "Batch" },
  { key: "model-info", label: "Model Info" },
];

function getTabFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const requestedTab = params.get("tab");
  return TABS.some((tab) => tab.key === requestedTab) ? requestedTab : "single";
}

function updateUrlForTab(nextTab, mode) {
  const params = new URLSearchParams(window.location.search);
  params.set("tab", nextTab);
  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history[mode]({}, "", nextUrl);
}

export default function App() {
  const [activeTab, setActiveTab] = useState(() => getTabFromLocation());
  const [modelInfo, setModelInfo] = useState(null);
  const [apiStatus, setApiStatus] = useState("loading");
  const [modelInfoError, setModelInfoError] = useState("");
  const [isModelInfoLoading, setIsModelInfoLoading] = useState(true);
  const [isModelInfoRefreshing, setIsModelInfoRefreshing] = useState(false);

  async function refreshModelInfo(backgroundRefresh = false) {
    if (backgroundRefresh) {
      setIsModelInfoRefreshing(true);
    } else {
      setIsModelInfoLoading(true);
    }

    try {
      const response = await getModelInfo();
      setModelInfo(response);
      setApiStatus("up");
      setModelInfoError("");
    } catch (error) {
      setApiStatus("down");
      setModelInfoError(error.message || "Unable to reach the API.");
    } finally {
      if (backgroundRefresh) {
        setIsModelInfoRefreshing(false);
      } else {
        setIsModelInfoLoading(false);
      }
    }
  }

  useEffect(() => {
    const normalizedTab = getTabFromLocation();
    setActiveTab(normalizedTab);
    updateUrlForTab(normalizedTab, "replaceState");

    const handlePopState = () => {
      setActiveTab(getTabFromLocation());
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    refreshModelInfo();
    const refreshInterval = window.setInterval(() => {
      refreshModelInfo(true);
    }, 30000);

    return () => {
      window.clearInterval(refreshInterval);
    };
  }, []);

  function handleTabChange(nextTab) {
    if (nextTab === activeTab) {
      return;
    }

    setActiveTab(nextTab);
    updateUrlForTab(nextTab, "pushState");
  }

  const modelName = modelInfo?.model_name || "Model unavailable";

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(90deg,transparent_0,transparent_calc(100%-1px),rgba(30,30,46,0.35)_calc(100%-1px)),linear-gradient(180deg,transparent_0,transparent_calc(100%-1px),rgba(30,30,46,0.2)_calc(100%-1px))] [background-size:100%_100%,3.5rem_3.5rem] opacity-25" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <Header
          activeTab={activeTab}
          apiStatus={apiStatus}
          modelName={modelName}
          onTabChange={handleTabChange}
          tabs={TABS}
        />

        <main className="mt-8 flex-1 space-y-6">
          <section hidden={activeTab !== "single"} aria-hidden={activeTab !== "single"}>
            <SinglePredict />
          </section>

          <section hidden={activeTab !== "batch"} aria-hidden={activeTab !== "batch"}>
            <BatchPredict />
          </section>

          <section
            hidden={activeTab !== "model-info"}
            aria-hidden={activeTab !== "model-info"}
          >
            <ModelInfo
              apiStatus={apiStatus}
              error={modelInfoError}
              isLoading={isModelInfoLoading}
              isRefreshing={isModelInfoRefreshing}
              modelInfo={modelInfo}
              onRefresh={() => refreshModelInfo(Boolean(modelInfo))}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
