import React from "react";
import { useTrace } from "../../contexts/TraceContext";
import { useNavigation } from "../../contexts/NavigationContext";
import { useVisualHighlight } from "../../contexts/HighlightContext";
import { getStateComponent } from "../../utils/stateRegistry";
import { getStepTypeBadge } from "../../utils/stepBadges";
import ErrorBoundary from "../ErrorBoundary";

const StatePanel = () => {
  // 1. Consume Contexts
  const { trace, currentAlgorithm } = useTrace();
  const { currentStepData, currentStep } = useNavigation();
  const { handleIntervalHover } = useVisualHighlight();

  // 2. Determine Component
  const StateComponent = getStateComponent(currentAlgorithm);
  const badge = getStepTypeBadge(currentStepData?.type);

  return (
    <div
      id="panel-steps"
      className="w-96 bg-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700">
        <h2 className="text-white font-bold">Algorithm State</h2>
      </div>

      {/* Registry Component Render */}
      <div id="panel-steps-list" className="flex-1 overflow-y-auto px-6 py-4">
        <ErrorBoundary>
          <StateComponent
            step={currentStepData}
            trace={trace}
            currentStep={currentStep}
            onIntervalHover={handleIntervalHover}
          />
        </ErrorBoundary>
      </div>

      {/* Description Footer */}
      <div
        id="panel-step-description"
        className="border-t border-slate-700 p-4 bg-slate-800"
      >
        <div className="p-4 bg-gradient-to-br from-slate-700/60 to-slate-800/60 rounded-lg border border-slate-600/50 shadow-lg">
          <div className="mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold ${badge.color}`}
            >
              {badge.label}
            </span>
          </div>
          <p className="text-white text-base font-medium leading-relaxed">
            {currentStepData?.description || "No description available"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatePanel;
