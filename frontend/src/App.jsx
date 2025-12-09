import React, { useState, useEffect, useRef } from "react";
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
import { isPredictionPoint } from "./utils/predictionUtils";
import { getStepTypeBadge } from "./utils/stepBadges";

const AlgorithmTracePlayer = () => {
  const [trace, setTrace] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const activeCallRef = useRef(null);

  // Prediction mode state
  const [predictionMode, setPredictionMode] = useState(true);
  const [showPrediction, setShowPrediction] = useState(false);
  const [predictionStats, setPredictionStats] = useState({
    total: 0,
    correct: 0,
  });

  // Phase 2: Highlight state for visual bridge
  const [highlightedIntervalId, setHighlightedIntervalId] = useState(null);
  const [hoverIntervalId, setHoverIntervalId] = useState(null);

  const BACKEND_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    loadExampleTrace();
  }, []);

  useEffect(() => {
    if (activeCallRef.current) {
      activeCallRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentStep]);

  // Phase 2: Extract highlighted interval from active call stack entry
  useEffect(() => {
    if (!trace) return;

    const step = trace?.trace?.steps?.[currentStep];
    const callStack = step?.data?.call_stack_state || [];

    // Get the active call (last in stack)
    const activeCall = callStack[callStack.length - 1];

    if (activeCall?.current_interval?.id !== undefined) {
      setHighlightedIntervalId(activeCall.current_interval.id);
    } else {
      setHighlightedIntervalId(null);
    }
  }, [currentStep, trace]);

  // Detect prediction points
  useEffect(() => {
    if (!trace || !predictionMode) return;

    const step = trace?.trace?.steps?.[currentStep];
    const nextStep = trace?.trace?.steps?.[currentStep + 1];

    if (isPredictionPoint(step) && nextStep?.type === "DECISION_MADE") {
      setShowPrediction(true);
    } else {
      setShowPrediction(false);
    }
  }, [currentStep, trace, predictionMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      // Don't handle keys if prediction modal is open
      if (showPrediction) return;

      const isComplete =
        trace?.trace?.steps?.[currentStep]?.type === "ALGORITHM_COMPLETE";

      switch (event.key) {
        case "ArrowRight":
        case " ":
          event.preventDefault();
          if (!isComplete) {
            nextStep();
          }
          break;

        case "ArrowLeft":
          event.preventDefault();
          if (!isComplete) {
            prevStep();
          }
          break;

        case "r":
        case "R":
        case "Home":
          event.preventDefault();
          resetTrace();
          break;

        case "End":
          event.preventDefault();
          if (trace?.trace?.steps) {
            setCurrentStep(trace.trace.steps.length - 1);
          }
          break;

        case "Escape":
          if (isComplete && currentStep > 0) {
            prevStep();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentStep, trace, showPrediction]);

  const loadExampleTrace = async () => {
    setLoading(true);
    setError(null);
    setTrace(null);
    setCurrentStep(0);
    setPredictionStats({ total: 0, correct: 0 });

    try {
      const response = await fetch(`${BACKEND_URL}/trace`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intervals: [
            { id: 1, start: 540, end: 660, color: "blue" },
            { id: 2, start: 600, end: 720, color: "green" },
            { id: 3, start: 540, end: 720, color: "amber" },
            { id: 4, start: 900, end: 960, color: "purple" },
          ],
        }),
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(
          `Backend returned ${response.status}: ${
            errData.error || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      setTrace(data);
    } catch (err) {
      setError(
        `Backend error: ${err.message}. Please ensure the Flask backend is running on port 5000.`
      );
      console.error("Failed to load trace:", err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (showPrediction) return; // Block during prediction

    if (trace?.trace?.steps && currentStep < trace.trace.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetTrace = () => {
    setCurrentStep(0);
    setPredictionStats({ total: 0, correct: 0 });
  };

  const handlePredictionAnswer = (isCorrect) => {
    setPredictionStats((prev) => ({
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
    }));

    setShowPrediction(false);
    nextStep();
  };

  const handlePredictionSkip = () => {
    setShowPrediction(false);
    nextStep();
  };

  const togglePredictionMode = () => {
    setPredictionMode(!predictionMode);
    setShowPrediction(false);
  };

  // Phase 2: Handle hover interactions
  const handleIntervalHover = (intervalId) => {
    setHoverIntervalId(intervalId);
  };

  // Phase 2: Use hover ID if available, otherwise use step-based highlight
  const effectiveHighlight =
    hoverIntervalId !== null ? hoverIntervalId : highlightedIntervalId;

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

  const step = trace?.trace?.steps?.[currentStep];

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

  const isComplete = step.type === "ALGORITHM_COMPLETE";
  const badge = getStepTypeBadge(step?.type);

  return (
    <div className="w-full h-screen bg-slate-900 flex items-center justify-center p-4 overflow-hidden">
      {showPrediction && (
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
        predictionStats={predictionStats}
      />

      <KeyboardHints />

      <div className="w-full h-full max-w-7xl flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Remove Covered Intervals
            </h1>
            <p className="text-slate-400 text-sm">
              Step {currentStep + 1} of {trace?.trace?.steps?.length || 0}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePredictionMode}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-semibold ${
                predictionMode
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-slate-700 hover:bg-slate-600 text-slate-300"
              }`}
            >
              {predictionMode ? "⏳ Predict" : "⚡ Watch"}
            </button>

            <ControlBar
              currentStep={currentStep}
              totalSteps={trace?.trace?.steps?.length || 0}
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
                  highlightedIntervalId={effectiveHighlight}
                  onIntervalHover={handleIntervalHover}
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
                  onIntervalHover={handleIntervalHover}
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
