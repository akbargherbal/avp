import React, { useEffect, useRef } from "react";
import { Loader, AlertCircle } from "lucide-react";

// Import the components
import ControlBar from "./components/ControlBar";
import CompletionModal from "./components/CompletionModal";
import ErrorBoundary from "./components/ErrorBoundary";
import KeyboardHints from "./components/KeyboardHints";
import PredictionModal from "./components/PredictionModal";

// Import extracted visualization components
import { TimelineView, CallStackView } from "./components/visualizations";

// Import extracted utilities
import { getStepTypeBadge } from "./utils/stepBadges";

// Import new hooks
import { useTraceLoader } from "./hooks/useTraceLoader";
import { useTraceNavigation } from "./hooks/useTraceNavigation";
import { usePredictionMode } from "./hooks/usePredictionMode";
import { useVisualHighlight } from "./hooks/useVisualHighlight";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts"; // NEW

const AlgorithmTracePlayer = () => {
  // 1. Data Loading Hook
  const { trace, loading, error, loadExampleTrace } = useTraceLoader();

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
    isComplete,
  } = useTraceNavigation(trace, resetPredictionStatsRef.current);

  const activeCallRef = useRef(null);

  // 3. Prediction Hook
  const prediction = usePredictionMode(trace, currentStep, navNextStep);

  // Update the navigation hook's reset function reference
  useEffect(() => {
    resetPredictionStatsRef.current = prediction.resetPredictionStats;
  }, [prediction.resetPredictionStats]);

  // 4. Visual Highlight Hook
  const highlight = useVisualHighlight(trace, currentStep);

  // --- HANDLERS ---

  // Handler: Next step wrapper (handles prediction blocking)
  const nextStep = () => {
    if (prediction.showPrediction) return; // Block during prediction
    navNextStep();
  };

  // Handler: Prediction Answer
  const handlePredictionAnswer = (isCorrect) => {
    prediction.handlePredictionAnswer(isCorrect);
  };

  // Handler: Prediction Skip
  const handlePredictionSkip = () => {
    prediction.handlePredictionSkip();
  };

  // --- EFFECTS ---

  // Effect 1: Scroll active call into view (kept here for now)
  useEffect(() => {
    if (activeCallRef.current) {
      activeCallRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentStep]);

  // 5. Keyboard Shortcuts Hook (replaces final useEffect)
  useKeyboardShortcuts({
    onNext: nextStep,
    onPrev: prevStep,
    onReset: resetTrace,
    onJumpToEnd: jumpToEnd,
    isComplete,
    modalOpen: prediction.showPrediction,
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
            onClick={loadExampleTrace}
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

  return (
    <div className="w-full h-screen bg-slate-900 flex items-center justify-center p-4 overflow-hidden">
      {prediction.showPrediction && (
        <PredictionModal
          step={trace?.trace?.steps?.[currentStep]}
          nextStep={trace?.trace?.steps?.[currentStep + 1]}
          onAnswer={handlePredictionAnswer}
          onSkip={handlePredictionSkip}
        />
      )}

      <CompletionModal
        trace={trace}
        step={step}
        onReset={resetTrace}
        predictionStats={prediction.predictionStats}
      />

      <KeyboardHints />

      <div className="w-full h-full max-w-7xl flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Remove Covered Intervals
            </h1>
            <p className="text-slate-400 text-sm">
              Step {currentStep + 1} of {totalSteps || 0}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prediction.togglePredictionMode}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-semibold ${
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

        <div className="flex-1 flex gap-4 overflow-hidden">
          <div className="flex-1 bg-slate-800 rounded-xl p-6 shadow-2xl flex flex-col">
            <h2 className="text-white font-bold mb-4">
              Timeline Visualization
            </h2>
            <div className="flex-1 overflow-hidden">
              <ErrorBoundary>
                <TimelineView
                  step={step}
                  highlightedIntervalId={highlight.effectiveHighlight}
                  onIntervalHover={highlight.handleIntervalHover}
                />
              </ErrorBoundary>
            </div>
          </div>

          <div className="w-96 bg-slate-800 rounded-xl shadow-2xl flex flex-col">
            <div className="p-6 pb-4 border-b border-slate-700">
              <h2 className="text-white font-bold">Recursive Call Stack</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <ErrorBoundary>
                <CallStackView
                  step={step}
                  activeCallRef={activeCallRef}
                  onIntervalHover={highlight.handleIntervalHover}
                />
              </ErrorBoundary>
            </div>

            {/* PHASE 3: Enhanced Description Section */}
            <div className="border-t border-slate-700 p-4 bg-slate-800">
              <div className="p-4 bg-gradient-to-br from-slate-700/60 to-slate-800/60 rounded-lg border border-slate-600/50 shadow-lg">
                {/* Step type badge at the top */}
                <div className="mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Description text - larger and more prominent */}
                <p className="text-white text-base font-medium leading-relaxed">
                  {step?.description || "No description available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmTracePlayer;
