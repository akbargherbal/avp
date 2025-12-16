// src/App.jsx

import React, { useEffect, useCallback } from "react";
import { Loader, AlertCircle } from "lucide-react";

// Import the components
import AlgorithmSwitcher from "./components/AlgorithmSwitcher";
import ControlBar from "./components/ControlBar";
import CompletionModal from "./components/CompletionModal";
import KeyboardHints from "./components/KeyboardHints";
import PredictionModal from "./components/PredictionModal";
import VisualizationPanel from "./components/panels/VisualizationPanel";
import StatePanel from "./components/panels/StatePanel";

// Import hooks (now wrappers around context)
import { useTraceLoader } from "./hooks/useTraceLoader";
import { useTraceNavigation } from "./hooks/useTraceNavigation";
import { usePredictionMode } from "./hooks/usePredictionMode";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

const AlgorithmTracePlayer = () => {
  // 1. Data Loading Hook (Context)
  const { trace, loading, error, currentAlgorithm, switchAlgorithm } =
    useTraceLoader();

  // 2. Navigation Hook (Context)
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
  } = useTraceNavigation();

  // 3. Prediction Hook (Context)
  const {
    predictionMode,
    showPrediction,
    activePrediction,
    predictionStats,
    togglePredictionMode,
    handlePredictionSkip,
    resetPredictionStats,
    activatePredictionForStep,
  } = usePredictionMode();

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
    // Note: AlgorithmInfoModal state is now local to VisualizationPanel,
    // so we can't close it from here via keyboard shortcut easily without
    // lifting state back up or using a global modal context.
    // For now, we focus on the critical modals managed here.

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

  // 5. Keyboard Shortcuts Hook
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
              <p id="step-current" className="text-slate-400 text-xs">
                Step {currentStep + 1} / {totalSteps || 0}
              </p>
            </div>
            <div className="pl-4 border-l border-slate-600">
              <AlgorithmSwitcher />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={togglePredictionMode}
              className={`px-3 py-1.5 rounded text-sm flex items-center gap-2 transition-colors font-semibold ${
                predictionMode
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-slate-700 hover:bg-slate-600 text-slate-300"
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

      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        {showPrediction && activePrediction && <PredictionModal />}
        <CompletionModal
          isOpen={showCompletionModal}
          step={step}
          onReset={resetTrace}
          onClose={closeCompletionModal}
          predictionStats={predictionStats}
        />
        <KeyboardHints />
        <div className="w-full h-full max-w-7xl flex gap-4 overflow-hidden">
          <VisualizationPanel />
          <StatePanel />
        </div>
      </div>
    </div>
  );
};

export default AlgorithmTracePlayer;
