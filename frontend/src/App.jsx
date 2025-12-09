import React, { useState, useEffect, useRef } from "react";
import { Loader, AlertCircle, SkipBack, ChevronRight } from "lucide-react";

// Import the components
import ControlBar from "./components/ControlBar";
import CompletionModal from "./components/CompletionModal";
import ErrorBoundary from "./components/ErrorBoundary";
import KeyboardHints from "./components/KeyboardHints";
import PredictionModal from "./components/PredictionModal";

// Import prediction utilities
import { isPredictionPoint } from "./utils/predictionUtils";

// Helper function to get badge styling based on step type
const getStepTypeBadge = (stepType) => {
  if (!stepType)
    return { color: "bg-slate-600 text-slate-200", label: "UNKNOWN" };

  const type = stepType.toUpperCase();

  // Decision points (most important)
  if (type.includes("DECISION")) {
    return {
      color: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50",
      label: "⚖️ DECISION",
    };
  }

  // Coverage tracking
  if (type.includes("MAX_END")) {
    return {
      color: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50",
      label: "📏 COVERAGE",
    };
  }

  // Examining intervals
  if (type.includes("EXAMINING")) {
    return {
      color: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50",
      label: "🔍 EXAMINE",
    };
  }

  // Recursion (calls and returns)
  if (type.includes("CALL_START") || type.includes("CALL_RETURN")) {
    return {
      color: "bg-blue-500/20 text-blue-300 border border-blue-500/50",
      label: "🔄 RECURSION",
    };
  }

  // Base case
  if (type.includes("BASE_CASE")) {
    return {
      color: "bg-purple-500/20 text-purple-300 border border-purple-500/50",
      label: "🎯 BASE CASE",
    };
  }

  // Sorting
  if (type.includes("SORT")) {
    return {
      color: "bg-orange-500/20 text-orange-300 border border-orange-500/50",
      label: "📊 SORT",
    };
  }

  // Algorithm states
  if (type.includes("INITIAL") || type.includes("COMPLETE")) {
    return {
      color: "bg-pink-500/20 text-pink-300 border border-pink-500/50",
      label: "🎬 STATE",
    };
  }

  // Default
  return {
    color: "bg-slate-600/50 text-slate-300",
    label: type.replace(/_/g, " "),
  };
};

const TimelineView = ({ step, highlightedIntervalId, onIntervalHover }) => {
  const allIntervals = step?.data?.all_intervals || [];
  const maxEnd = step?.data?.max_end;

  const minVal = 500;
  const maxVal = 1000;
  const toPercent = (val) => ((val - minVal) / (maxVal - minVal)) * 100;

  const colorMap = {
    blue: { bg: "bg-blue-800", text: "text-white", border: "border-blue-600" },
    green: {
      bg: "bg-green-600",
      text: "text-white",
      border: "border-green-500",
    },
    amber: {
      bg: "bg-amber-500",
      text: "text-black",
      border: "border-amber-400",
    },
    purple: {
      bg: "bg-purple-600",
      text: "text-white",
      border: "border-purple-500",
    },
  };

  // Check if any interval is highlighted
  const hasHighlight = highlightedIntervalId !== null;

  return (
    <div className="relative h-full flex flex-col">
      <div className="relative flex-1 bg-slate-900/50 rounded-lg p-4">
        <div className="absolute bottom-6 left-4 right-4 h-0.5 bg-slate-600"></div>

        <div className="absolute bottom-1 left-4 text-slate-400 text-xs">
          {minVal}
        </div>
        <div className="absolute bottom-1 left-1/3 text-slate-400 text-xs">
          700
        </div>
        <div className="absolute bottom-1 left-2/3 text-slate-400 text-xs">
          850
        </div>
        <div className="absolute bottom-1 right-4 text-slate-400 text-xs">
          {maxVal}
        </div>

        {maxEnd !== undefined && maxEnd !== null && (
          <div
            className="absolute top-4 bottom-6 w-0.5 bg-cyan-400 z-10"
            style={{ left: `${4 + toPercent(maxEnd) * 0.92}%` }}
          >
            <div className="absolute -top-3 -left-10 bg-teal-400 text-black text-xs px-2 py-1 rounded font-bold whitespace-nowrap drop-shadow-sm">
              max_end: {maxEnd}
            </div>
          </div>
        )}

        {allIntervals.map((interval, idx) => {
          if (
            !interval ||
            typeof interval.start !== "number" ||
            typeof interval.end !== "number"
          ) {
            return null;
          }

          const left = toPercent(interval.start);
          const width = toPercent(interval.end) - toPercent(interval.start);
          const colors = colorMap[interval.color] || {
            bg: "bg-gray-500",
            text: "text-white",
            border: "border-gray-400",
          };

          const visualState = interval.visual_state || {};
          const isExamining = visualState.is_examining || false;
          const isCovered = visualState.is_covered || false;
          const isKept = visualState.is_kept || false;

          // Check if this interval is currently highlighted
          const isHighlighted = interval.id === highlightedIntervalId;
          const isDimmed = hasHighlight && !isHighlighted;

          let additionalClasses = "transition-all duration-300";

          // Highlighting takes precedence over examining state
          if (isHighlighted) {
            additionalClasses +=
              " ring-4 ring-yellow-400 scale-110 z-30 shadow-[0_0_20px_8px_rgba(250,204,21,0.5)]";
          } else if (isDimmed) {
            additionalClasses += " opacity-40";
          } else if (isExamining) {
            additionalClasses +=
              " border-4 border-yellow-300 scale-105 shadow-[0_0_15px_5px_rgba(234,179,8,0.6)] z-20";
          }

          if (isCovered) {
            additionalClasses += " line-through";
          }

          if (isKept && !isHighlighted) {
            additionalClasses += " shadow-lg shadow-emerald-500/50";
          }

          return (
            <div
              key={interval.id || idx}
              className={`absolute h-10 ${colors.bg} rounded border-2 ${colors.border} flex items-center justify-center text-white text-sm font-bold ${additionalClasses}`}
              style={{
                left: `${4 + left * 0.92}%`,
                width: `${width * 0.92}%`,
                top: `${4 + idx * 48}px`,
              }}
              onMouseEnter={() => onIntervalHover?.(interval.id)}
              onMouseLeave={() => onIntervalHover?.(null)}
            >
              {interval.start}-{interval.end}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 bg-cyan-400 rounded"></div>
          <span className="text-slate-400">max_end line</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 bg-yellow-400 rounded ring-2 ring-yellow-400"></div>
          <span className="text-slate-400">highlighted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 bg-yellow-400 rounded border-2 border-yellow-300"></div>
          <span className="text-slate-400">examining</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 bg-slate-500 opacity-30 rounded line-through"></div>
          <span className="text-slate-400">covered (skipped)</span>
        </div>
      </div>
    </div>
  );
};

const CallStackView = ({ step, activeCallRef, onIntervalHover }) => {
  const callStack = step?.data?.call_stack_state || [];

  if (callStack.length === 0) {
    return (
      <div className="text-slate-500 text-sm italic">
        {step?.type === "INITIAL_STATE" && "Sort intervals first to begin"}
        {step?.type === "SORT_BEGIN" && "Sorting intervals..."}
        {step?.type === "SORT_COMPLETE" && "Ready to start recursion"}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {callStack.map((call, idx) => {
        if (!call) return null;

        const isActive = idx === callStack.length - 1;
        const currentInterval = call.current_interval;

        if (!currentInterval) return null;

        return (
          <div
            key={call.call_id || idx}
            ref={isActive ? activeCallRef : null}
            className={`p-3 rounded-lg border-2 transition-all ${
              isActive
                ? "border-yellow-400 bg-yellow-900/20 shadow-lg"
                : call.status === "returning"
                ? "border-emerald-400 bg-emerald-900/20"
                : "border-slate-600 bg-slate-800/50"
            }`}
            style={{ marginLeft: `${(call.depth || 0) * 24}px` }}
            onMouseEnter={() => onIntervalHover?.(currentInterval.id)}
            onMouseLeave={() => onIntervalHover?.(null)}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="text-slate-400 text-xs font-mono">
                CALL #{call.call_id || idx}
              </div>
              <ChevronRight size={12} className="text-slate-500" />
              <div className="text-white text-xs font-mono">
                depth={call.depth || 0}, remaining={call.remaining_count || 0}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="text-slate-400 text-xs">Examining:</div>
              <div
                className={`px-2 py-1 rounded text-xs font-bold ${
                  currentInterval.color === "amber"
                    ? "bg-amber-500 text-black"
                    : currentInterval.color === "blue"
                    ? "bg-blue-600 text-white"
                    : currentInterval.color === "green"
                    ? "bg-green-600 text-white"
                    : "bg-purple-600 text-white"
                }`}
              >
                ({currentInterval.start || 0}, {currentInterval.end || 0})
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="text-slate-400 text-xs">max_end_so_far:</div>
              <div className="text-cyan-400 text-xs font-mono font-bold">
                {call.max_end === null || call.max_end === undefined
                  ? "-∞"
                  : call.max_end}
              </div>
            </div>

            {call.decision && (
              <div
                className={`flex items-center gap-2 p-2 rounded ${
                  call.decision === "keep"
                    ? "bg-emerald-900/30 border border-emerald-500"
                    : "bg-red-900/30 border border-red-500"
                }`}
              >
                <div className="text-xs font-bold">
                  {call.decision === "keep" ? "✅ KEEP" : "❌ COVERED"}
                </div>
                <div className="text-xs text-slate-300">
                  {currentInterval.end || 0}{" "}
                  {call.decision === "keep" ? ">" : "≤"}{" "}
                  {call.max_end === null ? "-∞" : call.max_end}
                </div>
              </div>
            )}

            {call.return_value && call.return_value.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-600">
                <div className="text-slate-400 text-xs mb-1">↩️ RETURN:</div>
                <div className="flex flex-wrap gap-1">
                  {call.return_value.length === 0 ? (
                    <div className="text-slate-500 text-xs italic">[]</div>
                  ) : (
                    call.return_value.map((interval, idx) => {
                      if (!interval) return null;

                      const colorClass =
                        interval.color === "amber"
                          ? "bg-amber-500 text-black"
                          : interval.color === "blue"
                          ? "bg-blue-600 text-white"
                          : interval.color === "green"
                          ? "bg-green-600 text-white"
                          : "bg-purple-600 text-white";
                      return (
                        <div
                          key={idx}
                          className={`${colorClass} px-2 py-1 rounded text-xs`}
                        >
                          ({interval.start || 0},{interval.end || 0})
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

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
