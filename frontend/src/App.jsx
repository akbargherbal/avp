// frontend/src/App.jsx
import React, { useCallback } from "react";
import { Loader, AlertCircle } from "lucide-react";

// Import the components
import AlgorithmSwitcher from "./components/AlgorithmSwitcher";
import ControlBar from "./components/ControlBar";
import CompletionModal from "./components/CompletionModal";
import { KeyboardHintsProvider } from "./components/KeyboardHints";
import PredictionModal from "./components/PredictionModal";
import VisualizationPanel from "./components/panels/VisualizationPanel";
import StatePanel from "./components/panels/StatePanel";
import ErrorBoundary from "./components/ErrorBoundary";

// Import contexts directly (no more deprecated wrapper hooks)
import { useTrace } from "./contexts/TraceContext";
import { useNavigation } from "./contexts/NavigationContext";
import { usePrediction } from "./contexts/PredictionContext";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

const AlgorithmTracePlayer = () => {
  // 1. Data Loading (Direct Context)
  const { trace, loading, error, currentAlgorithm, switchAlgorithm } =
    useTrace();

  // 2. Navigation (Direct Context)
  const {
    currentStep,
    currentStepData,
    totalSteps,
    nextStep: navNextStep,
    prevStep,
    resetTrace: navResetTrace,
    jumpToEnd,
    showCompletionModal,
    closeCompletionModal,
  } = useNavigation();

  // 3. Prediction (Direct Context)
  const {
    predictionMode,
    showPrediction,
    activePrediction,
    predictionStats,
    togglePredictionMode,
    handlePredictionSkip,
    resetPredictionStats,
    activatePredictionForStep,
  } = usePrediction();

  // --- HANDLERS ---

  const nextStep = () => {
    if (showPrediction) return;

    const nextStepIndex = currentStep + 1;
    if (nextStepIndex >= totalSteps) {
      navNextStep();
      return;
    }

    const wasPredictionActivated = activatePredictionForStep(nextStepIndex);
    if (!wasPredictionActivated) {
      navNextStep();
    }
  };

  const resetTrace = () => {
    navResetTrace();
    resetPredictionStats();
  };

  // Unified Modal Close Handler for Keyboard Shortcuts
  const handleCloseModals = useCallback(() => {
    if (showPrediction) {
      handlePredictionSkip();
      return;
    }
    if (showCompletionModal) {
      closeCompletionModal();
      return;
    }
  }, [
    showPrediction,
    showCompletionModal,
    closeCompletionModal,
    handlePredictionSkip,
  ]);

  // 4. Keyboard Shortcuts Hook
  useKeyboardShortcuts({
    onNext: nextStep,
    onPrev: prevStep,
    onReset: resetTrace,
    onJumpToEnd: jumpToEnd,
    isComplete: showCompletionModal,
    modalOpen: showPrediction || showCompletionModal,
    onCloseModal: handleCloseModals,
  });

  // --- RENDER LOGIC ---

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <Loader
            className="mx-auto mb-4 animate-spin text-emerald-500"
            size={48}
          />
          <p className="text-white">Loading trace from backend...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-8">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={64} />
          <h2 className="mb-4 text-xl font-bold text-white">
            Backend Not Available
          </h2>
          <p className="mb-6 text-gray-300">{error}</p>
          <button
            onClick={() => switchAlgorithm("interval-coverage")}
            className="rounded-lg bg-emerald-500 px-6 py-2 font-semibold text-black transition hover:bg-emerald-400"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!trace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <p className="text-white">No trace loaded.</p>
      </div>
    );
  }

  const step = currentStepData;

  if (!step) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-8">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={64} />
          <h2 className="mb-4 text-xl font-bold text-white">
            Invalid Step Data
          </h2>
          <p className="mb-6 text-gray-300">
            Step {currentStep + 1} could not be loaded. The trace data may be
            malformed.
          </p>
          <button
            onClick={resetTrace}
            className="rounded-lg bg-emerald-500 px-6 py-2 font-semibold text-black transition hover:bg-emerald-400"
          >
            Reset to Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <KeyboardHintsProvider>
      <div
        id="app-root"
        className="flex h-screen w-full flex-col overflow-hidden bg-slate-900"
      >
        <div
          id="app-header"
          className="border-b border-slate-700 bg-slate-800 px-4 py-3"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-white">
                  {trace?.metadata?.display_name || currentAlgorithm}
                </h1>
                <p id="step-current" className="text-xs text-slate-400">
                  Step {currentStep + 1} / {totalSteps || 0}
                </p>
              </div>
              <div className="border-l border-slate-600 pl-4">
                <AlgorithmSwitcher />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={togglePredictionMode}
                className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-semibold transition-colors ${
                  predictionMode
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {predictionMode ? "⏳ Predict" : "⚡ Watch"}
              </button>
              <ControlBar
                onPrev={prevStep}
                onNext={nextStep}
                onReset={resetTrace}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
          <ErrorBoundary>
            {showPrediction && activePrediction && <PredictionModal />}
          </ErrorBoundary>
          <ErrorBoundary>
            <CompletionModal
              isOpen={showCompletionModal}
              step={step}
              onReset={resetTrace}
              onClose={closeCompletionModal}
              predictionStats={predictionStats}
            />
          </ErrorBoundary>
          {/* REMOVED: <KeyboardHints /> - Now handled by KeyboardHintsProvider wrapper */}
          <div className="flex h-full w-full max-w-7xl gap-4 overflow-hidden">
            <VisualizationPanel />
            <StatePanel />
          </div>
        </div>
      </div>
    </KeyboardHintsProvider>
  );
};

export default AlgorithmTracePlayer;