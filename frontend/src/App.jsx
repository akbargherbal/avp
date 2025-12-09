import React, { useState, useEffect, useRef } from "react";
import { Loader, AlertCircle, SkipBack, ChevronRight } from "lucide-react";

// Import the new components
import ControlBar from "./components/ControlBar";
import CompletionModal from "./components/CompletionModal";
import ErrorBoundary from "./components/ErrorBoundary";
import KeyboardHints from "./components/KeyboardHints";

// NOTE: TimelineView and CallStackView are kept in this file for now,
// but could be extracted into their own files in a future refactoring pass.

const TimelineView = ({ step }) => {
  // Safe access with fallbacks
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

  return (
    <div className="relative h-full flex flex-col">
      <div className="relative flex-1 bg-slate-900/50 rounded-lg p-4">
        {/* Timeline axis */}
        <div className="absolute bottom-6 left-4 right-4 h-0.5 bg-slate-600"></div>

        {/* Scale markers */}
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

        {/* Max end line */}
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

        {/* Interval bars */}
        {allIntervals.map((interval, idx) => {
          // Skip malformed intervals
          if (!interval || typeof interval.start !== 'number' || typeof interval.end !== 'number') {
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

          let additionalClasses = "transition-all duration-300";

          if (isExamining) {
            additionalClasses += " border-4 border-yellow-300 scale-105 shadow-[0_0_15px_5px_rgba(234,179,8,0.6)] z-20";
          }

          if (isCovered) {
            additionalClasses += " opacity-30 line-through";
          }

          if (isKept) {
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
            >
              {interval.start}-{interval.end}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 bg-cyan-400 rounded"></div>
          <span className="text-slate-400">max_end line</span>
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

const CallStackView = ({ step, activeCallRef }) => {
  // Safe access with fallback
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
        // Skip malformed call entries
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
          >
            {/* Call header */}
            <div className="flex items-center gap-2 mb-2">
              <div className="text-slate-400 text-xs font-mono">
                CALL #{call.call_id || idx}
              </div>
              <ChevronRight size={12} className="text-slate-500" />
              <div className="text-white text-xs font-mono">
                depth={call.depth || 0}, remaining={call.remaining_count || 0}
              </div>
            </div>

            {/* Current interval */}
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

            {/* Max end */}
            <div className="flex items-center gap-2 mb-2">
              <div className="text-slate-400 text-xs">max_end_so_far:</div>
              <div className="text-cyan-400 text-xs font-mono font-bold">
                {call.max_end === null || call.max_end === undefined
                  ? "-∞"
                  : call.max_end}
              </div>
            </div>

            {/* Decision */}
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
                  {currentInterval.end || 0} {call.decision === "keep" ? ">" : "≤"}{" "}
                  {call.max_end === null ? "-∞" : call.max_end}
                </div>
              </div>
            )}

            {/* Return value */}
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

// --- The main App component, now much smaller ---
const AlgorithmTracePlayer = () => {
  const [trace, setTrace] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const activeCallRef = useRef(null);

  const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    loadExampleTrace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to active call
  useEffect(() => {
    if (activeCallRef.current) {
      activeCallRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentStep]);

  // SESSION 3: Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ignore if user is typing in an input field
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      // Check if completion modal is open
      const isComplete = trace?.trace?.steps?.[currentStep]?.type === "ALGORITHM_COMPLETE";
      
      switch (event.key) {
        case 'ArrowRight':
        case ' ': // Space bar
          event.preventDefault(); // Prevent page scroll on Space
          if (!isComplete) {
            nextStep();
          }
          break;
        
        case 'ArrowLeft':
          event.preventDefault();
          if (!isComplete) {
            prevStep();
          }
          break;
        
        case 'r':
        case 'R':
        case 'Home':
          event.preventDefault();
          resetTrace();
          break;
        
        case 'End':
          event.preventDefault();
          if (trace?.trace?.steps) {
            setCurrentStep(trace.trace.steps.length - 1);
          }
          break;
        
        case 'Escape':
          // Close modal by going back one step if on completion
          if (isComplete && currentStep > 0) {
            prevStep();
          }
          break;
        
        default:
          break;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentStep, trace]); // Note: nextStep, prevStep, resetTrace are stable references

  const loadExampleTrace = async () => {
    setLoading(true);
    setError(null);
    setTrace(null);
    setCurrentStep(0);

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
        const errData = await response.json().catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(`Backend returned ${response.status}: ${errData.error || "Unknown error"}`);
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
  };

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

  // PHASE 5: Safe array access with optional chaining
  const step = trace?.trace?.steps?.[currentStep];

  // Show error state if step data is invalid
  if (!step) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={64} />
          <h2 className="text-xl font-bold text-white mb-4">
            Invalid Step Data
          </h2>
          <p className="text-gray-300 mb-6">
            Step {currentStep + 1} could not be loaded. The trace data may be malformed.
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

  return (
    <div className="w-full h-screen bg-slate-900 flex items-center justify-center p-4 overflow-hidden">
      <CompletionModal trace={trace} step={step} onReset={resetTrace} />
      
      {/* SESSION 3: Keyboard hints component */}
      <KeyboardHints />

      <div className="w-full h-full max-w-7xl flex flex-col">
        <ControlBar
          currentStep={currentStep}
          totalSteps={trace?.trace?.steps?.length || 0}
          onPrev={prevStep}
          onNext={nextStep}
          onReset={resetTrace}
          isComplete={isComplete}
        />

        <div className="flex-1 flex gap-4 overflow-hidden">
          <div className="flex-1 bg-slate-800 rounded-xl p-6 shadow-2xl flex flex-col">
            <h2 className="text-white font-bold mb-4">
              Timeline Visualization
            </h2>
            <div className="flex-1 overflow-hidden">
              <ErrorBoundary>
                <TimelineView step={step} />
              </ErrorBoundary>
            </div>
          </div>

          <div className="w-96 bg-slate-800 rounded-xl shadow-2xl flex flex-col">
            <div className="p-6 pb-4 border-b border-slate-700">
              <h2 className="text-white font-bold">Recursive Call Stack</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <ErrorBoundary>
                <CallStackView step={step} activeCallRef={activeCallRef} />
              </ErrorBoundary>
            </div>
            <div className="border-t border-slate-700 p-4 bg-slate-800">
              <div className="mb-3 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-white text-sm font-medium mb-1">
                  {step?.description || "No description available"}
                </p>
                <p className="text-slate-400 text-xs">
                  {step?.type ? step.type.replace(/_/g, " ") : "Unknown step type"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-900 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <SkipBack size={18} />
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep >= (trace?.trace?.steps?.length || 0) - 1}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-black px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-bold"
                >
                  Next Step
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmTracePlayer;