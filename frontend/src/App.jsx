import React, { useEffect, useRef, useState } from "react";
import { Loader, AlertCircle } from "lucide-react";

// Import the components
import AlgorithmSwitcher from "./components/AlgorithmSwitcher";
import ControlBar from "./components/ControlBar";
import CompletionModal from "./components/CompletionModal";
import ErrorBoundary from "./components/ErrorBoundary";
import KeyboardHints from "./components/KeyboardHints";
import PredictionModal from "./components/PredictionModal";
import AlgorithmInfoModal from './components/AlgorithmInfoModal'; // <-- Import new modal

// PHASE 3: Import visualization registry
import { getVisualizationComponent } from "./utils/visualizationRegistry";

// PHASE 4: Import state registry (replaces direct component imports)
import { getStateComponent } from "./utils/stateRegistry";

// Import extracted utilities
import { getStepTypeBadge } from "./utils/stepBadges";

// Import new hooks
import { useTraceLoader } from "./hooks/useTraceLoader";
import { useTraceNavigation } from "./hooks/useTraceNavigation";
import { usePredictionMode } from "./hooks/usePredictionMode";
import { useVisualHighlight } from "./hooks/useVisualHighlight";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

const AlgorithmTracePlayer = () => {
  // Add state for the new modal
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(false);

  // 1. Data Loading Hook
  const {
    trace,
    loading,
    error,
    currentAlgorithm,
    availableAlgorithms,
    switchAlgorithm,
  } = useTraceLoader();

  // 2. Navigation Hook (requires prediction reset function)
  const resetPredictionStatsRef = useRef(() => {});

  const {
    currentStep,
    currentStepData,
    totalSteps,
    nextStep: navNextStep,
    prevStep,
    resetTrace,
    jumpToEnd,
    showCompletionModal, // <-- Use the new state
    closeCompletionModal, // <-- Use the new handler
  } = useTraceNavigation(trace, resetPredictionStatsRef.current);

  const activeCallRef = useRef(null);

  // 3. Prediction Hook (PHASE 4: Now returns activePrediction)
  const prediction = usePredictionMode(trace, currentStep, navNextStep);

  // Update the navigation hook's reset function reference
  useEffect(() => {
    resetPredictionStatsRef.current = prediction.resetPredictionStats;
  }, [prediction.resetPredictionStats]);

  // 4. Visual Highlight Hook (for Interval Coverage)
  const highlight = useVisualHighlight(trace, currentStep);

  // PHASE 3: Dynamically select visualization component
  const visualizationType = trace?.metadata?.visualization_type || "timeline";
  const visualizationConfig = trace?.metadata?.visualization_config || {};
  const MainVisualizationComponent =
    getVisualizationComponent(visualizationType);

  // --- HANDLERS ---

  // Handler: Next step wrapper (handles prediction blocking)
  const nextStep = () => {
    if (prediction.showPrediction) return; // Block during prediction
    navNextStep();
  };

  // PHASE 4: Updated handler - now receives userAnswer instead of isCorrect
  const handlePredictionAnswer = (userAnswer) => {
    prediction.handlePredictionAnswer(userAnswer);
  };

  // Handler: Prediction Skip
  const handlePredictionSkip = () => {
    prediction.handlePredictionSkip();
  };

  // 5. Keyboard Shortcuts Hook
  useKeyboardShortcuts({
    onNext: nextStep,
    onPrev: prevStep,
    onReset: resetTrace,
    onJumpToEnd: jumpToEnd,
    isComplete: showCompletionModal, // Use new state to manage shortcuts context
    modalOpen: prediction.showPrediction || showAlgorithmInfo, // <-- Also disable nav shortcuts when info modal is open
  });

  // --- RENDER LOGIC ---

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader
            className="animate-spin text-emerald-500 mx-auto mb-4"
            size={48}
          />
          <p className="text-white">Loading trace from backend...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={64} />
          <h2 className="text-xl font-bold text-white mb-4">
            Backend Not Available
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => switchAlgorithm("interval-coverage")}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-2 rounded-lg transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!trace) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">No trace loaded.</p>
      </div>
    );
  }

  const step = currentStepData;

  if (!step) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={64} />
          <h2 className="text-xl font-bold text-white mb-4">
            Invalid Step Data
          </h2>
          <p className="text-gray-300 mb-6">
            Step {currentStep + 1} could not be loaded. The trace data may be
            malformed.
          </p>
          <button
            onClick={resetTrace}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-2 rounded-lg transition"
          >
            Reset to Start
          </button>
        </div>
      </div>
    );
  }

  const badge = getStepTypeBadge(step?.type);

  // PHASE 4: Dynamically select state component based on algorithm
  // Only call after trace validation - currentAlgorithm is guaranteed to be set here
  const StateComponent = getStateComponent(currentAlgorithm);

  // Create a generic props object and conditionally add algorithm-specific props
  const mainVisualizationProps = {
    step: step,
    config: visualizationConfig,
  };

  // PHASE 4: Conditional props for interval coverage visualization
  if (currentAlgorithm === "interval-coverage") {
    mainVisualizationProps.highlightedIntervalId = highlight.effectiveHighlight;
    mainVisualizationProps.onIntervalHover = highlight.handleIntervalHover;
  }

  return (
    <div
      id="app-root"
      className="w-full h-screen bg-slate-900 flex flex-col overflow-hidden"
    >
      <div
        id="app-header"
        className="bg-slate-800 border-b border-slate-700 px-4 py-3"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">
                {trace?.metadata?.display_name || currentAlgorithm}
              </h1>
              <p className="text-slate-400 text-xs">
                Step {currentStep + 1} of {totalSteps || 0}
              </p>
            </div>
            {/* PHASE 2: Algorithm Switcher Dropdown */}
            <div className="pl-4 border-l border-slate-600">
              <AlgorithmSwitcher
                currentAlgorithm={currentAlgorithm}
                availableAlgorithms={availableAlgorithms}
                onAlgorithmSwitch={switchAlgorithm}
                loading={loading}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prediction.togglePredictionMode}
              className={`px-3 py-1.5 rounded text-sm flex items-center gap-2 transition-colors font-semibold ${
                prediction.predictionMode
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-slate-700 hover:bg-slate-600 text-slate-300"
              }`}
            >
              {prediction.predictionMode ? "⏳ Predict" : "⚡ Watch"}
            </button>
            <ControlBar
              currentStep={currentStep}
              totalSteps={totalSteps || 0}
              onPrev={prevStep}
              onNext={nextStep}
              onReset={resetTrace}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        {/* PHASE 4: Pass activePrediction instead of step/nextStep */}
        {prediction.showPrediction && prediction.activePrediction && (
          <PredictionModal
            predictionData={prediction.activePrediction}
            onAnswer={handlePredictionAnswer}
            onSkip={handlePredictionSkip}
          />
        )}
        <CompletionModal
          isOpen={showCompletionModal} // <-- Control visibility with the new prop
          trace={trace}
          step={step}
          onReset={resetTrace}
          onClose={closeCompletionModal} // <-- Pass the new close handler
          predictionStats={prediction.predictionStats}
        />
        <KeyboardHints />
        <div className="w-full h-full max-w-7xl flex gap-4 overflow-hidden">
          <div
            id="panel-visualization"
            className="flex-[3] bg-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* MODIFIED: Replaced header with new version including info trigger */}
            <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
              <h2 className="text-lg font-semibold text-white">
                {trace?.metadata?.visualization_type === 'array' && 'Array Visualization'}
                {trace?.metadata?.visualization_type === 'timeline' && 'Timeline Visualization'}
              </h2>
              <button
                id="algorithm-info-trigger"
                onClick={() => setShowAlgorithmInfo(true)}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors group"
                title="Algorithm Details"
                aria-label="Show algorithm information"
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
            {/* FIX 13: Apply overflow pattern - items-start on outer container, mx-auto on inner wrapper */}
            <div className="flex-1 flex flex-col items-start overflow-auto p-6">
              <div className="mx-auto h-full w-full">
                <ErrorBoundary>
                  <MainVisualizationComponent {...mainVisualizationProps} />
                </ErrorBoundary>
              </div>
            </div>
          </div>
          <div
            id="panel-steps"
            className="w-96 bg-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-700">
              <h2 className="text-white font-bold">Algorithm State</h2>
            </div>
            <div
              id="panel-steps-list"
              className="flex-1 overflow-y-auto px-6 py-4"
            >
              <ErrorBoundary>
                {/* PHASE 4: Registry-based component rendering - zero algorithm-specific conditionals */}
                <StateComponent
                  step={step}
                  trace={trace}
                  activeCallRef={activeCallRef}
                  onIntervalHover={highlight.handleIntervalHover}
                  currentStep={currentStep}
                />
              </ErrorBoundary>
            </div>
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
                  {step?.description || "No description available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ADDED: Render the new AlgorithmInfoModal */}
      <AlgorithmInfoModal
        isOpen={showAlgorithmInfo}
        onClose={() => setShowAlgorithmInfo(false)}
        algorithmName={currentAlgorithm}
      />
    </div>
  );
};

export default AlgorithmTracePlayer;
