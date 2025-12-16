import React, { useState } from "react";
import { useTrace } from "../../contexts/TraceContext";
import { useNavigation } from "../../contexts/NavigationContext";
import { useVisualHighlight } from "../../contexts/HighlightContext";
import { getVisualizationComponent } from "../../utils/visualizationRegistry";
import ErrorBoundary from "../ErrorBoundary";
import AlgorithmInfoModal from "../AlgorithmInfoModal";

const VisualizationPanel = () => {
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(false);

  // 1. Consume Contexts
  const { trace } = useTrace();
  const { currentStepData } = useNavigation();
  const { effectiveHighlight, handleIntervalHover } = useVisualHighlight();

  // 2. Determine Component
  const visualizationType = trace?.metadata?.visualization_type || "timeline";
  const visualizationConfig = trace?.metadata?.visualization_config || {};
  const VisualizationComponent = getVisualizationComponent(visualizationType);

  // 3. Prepare Props (The Contract)
  const componentProps = {
    step: currentStepData,
    config: visualizationConfig,
    // Add highlight props only if needed (or pass generic handlers)
    highlightedIntervalId: effectiveHighlight,
    onIntervalHover: handleIntervalHover,
  };

  return (
    <div
      id="panel-visualization"
      className="flex-[3] bg-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden select-none"
    >
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">
          {visualizationType.charAt(0).toUpperCase() +
            visualizationType.slice(1)}{" "}
          Visualization
        </h2>
        <button
          id="algorithm-info-trigger"
          onClick={() => setShowAlgorithmInfo(true)}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors group"
          title="Algorithm Details"
        >
          <svg
            className="w-5 h-5 text-blue-400 group-hover:text-blue-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="8" />
          </svg>
        </button>
      </div>
      <div className="flex-1 flex flex-col items-start overflow-auto p-6">
        <div className="mx-auto h-full w-full">
          <ErrorBoundary>
            <VisualizationComponent {...componentProps} />
          </ErrorBoundary>
        </div>
      </div>
      <AlgorithmInfoModal
        isOpen={showAlgorithmInfo}
        onClose={() => setShowAlgorithmInfo(false)}
      />
    </div>
  );
};

export default VisualizationPanel;
