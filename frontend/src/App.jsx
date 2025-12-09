import React, { useState, useEffect, useRef } from "react";
import {
  SkipForward,
  SkipBack,
  Loader,
  AlertCircle,
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
} from "lucide-react";

const AlgorithmTracePlayer = () => {
  const [trace, setTrace] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const activeCallRef = useRef(null);

  const BACKEND_URL = "http://localhost:5000/api";

  useEffect(() => {
    loadExampleTrace();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !trace) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= trace.trace.steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [isPlaying, trace]);

  // Auto-scroll to active call
  useEffect(() => {
    if (activeCallRef.current) {
      activeCallRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentStep]);

  const loadExampleTrace = async () => {
    setLoading(true);
    setError(null);

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
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = await response.json();
      setTrace(data);
      setCurrentStep(0);
      setError(null);
    } catch (err) {
      setError(
        `Backend error: ${err.message}. Please start the Flask backend on port 5000.`
      );
      console.error("Failed to load trace:", err);
    }

    setLoading(false);
  };

  const nextStep = () => {
    if (trace && currentStep < trace.trace.steps.length - 1) {
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
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (currentStep >= trace.trace.steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
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
          <p className="text-gray-400 text-sm mt-2">
            Make sure Flask is running on port 5000
          </p>
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
          <div className="bg-slate-800 rounded-lg p-4 text-left mb-6">
            <p className="text-gray-400 text-sm mb-2">Start the backend:</p>
            <code className="text-emerald-400 text-xs">
              cd backend
              <br />
              python app.py
            </code>
          </div>
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
        <div className="text-center">
          <p className="text-white mb-4">No trace loaded</p>
          <button
            onClick={loadExampleTrace}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-2 rounded-lg"
          >
            Load Example
          </button>
        </div>
      </div>
    );
  }

  const step = trace.trace.steps[currentStep];
  const isComplete = step.type === "ALGORITHM_COMPLETE";

  return (
    <div className="w-full h-screen bg-slate-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Completion Modal */}
      {isComplete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl shadow-2xl border-2 border-emerald-500 max-w-lg w-full p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Algorithm Complete!
              </h2>
              <p className="text-slate-400">
                Successfully removed covered intervals
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-slate-400 text-sm mb-1">
                    Initial Intervals
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {trace.metadata.input_size}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-400 text-sm mb-1">
                    Kept Intervals
                  </div>
                  <div className="text-3xl font-bold text-emerald-400">
                    {step.data.kept_count}
                  </div>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-slate-700">
                <div className="text-slate-400 text-sm mb-1">Removed</div>
                <div className="text-2xl font-bold text-red-400">
                  {step.data.removed_count} interval(s)
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-slate-300 font-semibold mb-2">
                Final Result:
              </div>
              <div className="flex flex-wrap gap-2">
                {step.data.result.map((interval, idx) => {
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
                      className={`${colorClass} px-3 py-2 rounded-lg text-sm font-bold`}
                    >
                      ({interval.start}, {interval.end})
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={resetTrace}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Start Over
            </button>
          </div>
        </div>
      )}

      <div className="w-full h-full max-w-7xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Remove Covered Intervals
            </h1>
            <p className="text-slate-400 text-sm">
              Step {currentStep + 1} of {trace.trace.steps.length}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={resetTrace}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RotateCcw size={20} />
              Reset
            </button>

            <button
              onClick={togglePlay}
              disabled={isComplete}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause size={20} />
                  Pause
                </>
              ) : (
                <>
                  <Play size={20} />
                  Play
                </>
              )}
            </button>

            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <SkipBack size={20} />
              Previous
            </button>

            <button
              onClick={nextStep}
              disabled={currentStep === trace.trace.steps.length - 1}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-black px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-bold"
            >
              Next Step
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Left: Timeline */}
          <div className="flex-1 bg-slate-800 rounded-xl p-6 shadow-2xl flex flex-col">
            <h2 className="text-white font-bold mb-4">
              Timeline Visualization
            </h2>
            <div className="flex-1 overflow-hidden">
              <TimelineView step={step} />
            </div>
          </div>

          {/* Right: Call Stack with STICKY controls at bottom */}
          <div className="w-96 bg-slate-800 rounded-xl shadow-2xl flex flex-col">
            {/* Stack header */}
            <div className="p-6 pb-4 border-b border-slate-700">
              <h2 className="text-white font-bold flex items-center gap-2">
                Recursive Call Stack
                {step.data.call_stack_state &&
                  step.data.call_stack_state.length > 0 && (
                    <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">
                      {step.data.call_stack_state.length} calls
                    </span>
                  )}
              </h2>
            </div>

            {/* Scrollable call stack */}
            <div className="flex-1 overflow-y-auto p-6">
              <CallStackView step={step} activeCallRef={activeCallRef} />
            </div>

            {/* STICKY Controls at bottom */}
            <div className="border-t border-slate-700 p-4 bg-slate-800">
              <div className="mb-3 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-white text-sm font-medium mb-1">
                  {step.description}
                </p>
                <p className="text-slate-400 text-xs">
                  {step.type.replace(/_/g, " ")}
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
                  disabled={currentStep === trace.trace.steps.length - 1}
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

const TimelineView = ({ step }) => {
  const allIntervals = step.data.all_intervals || [];
  const maxEnd = step.data.max_end;

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
            <div className="absolute -top-6 -left-12 bg-cyan-400 text-slate-900 text-xs px-2 py-1 rounded font-bold whitespace-nowrap">
              max_end: {maxEnd}
            </div>
          </div>
        )}

        {/* Interval bars */}
        {allIntervals.map((interval, idx) => {
          const left = toPercent(interval.start);
          const width = toPercent(interval.end) - toPercent(interval.start);
          const colors = colorMap[interval.color] || {
            bg: "bg-gray-500",
            text: "text-white",
            border: "border-gray-400",
          };

          const visualState = interval.visual_state || {};
          const isExamining = visualState.is_examining;
          const isCovered = visualState.is_covered;
          const isKept = visualState.is_kept;

          let additionalClasses = "transition-all duration-300";

          if (isExamining) {
            additionalClasses += " ring-4 ring-yellow-400 scale-105";
          }

          if (isCovered) {
            additionalClasses += " opacity-30 line-through";
          }

          if (isKept) {
            additionalClasses += " shadow-lg shadow-emerald-500/50";
          }

          return (
            <div
              key={interval.id}
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
          <div className="w-8 h-3 bg-yellow-400 rounded ring-2 ring-yellow-400"></div>
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
  const callStack = step.data.call_stack_state || [];

  if (callStack.length === 0) {
    return (
      <div className="text-slate-500 text-sm italic">
        {step.type === "INITIAL_STATE" && "Sort intervals first to begin"}
        {step.type === "SORT_BEGIN" && "Sorting intervals..."}
        {step.type === "SORT_COMPLETE" && "Ready to start recursion"}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {callStack.map((call, idx) => {
        const isActive = idx === callStack.length - 1;
        const currentInterval = call.current_interval;

        if (!currentInterval) return null;

        return (
          <div
            key={call.call_id}
            ref={isActive ? activeCallRef : null}
            className={`p-3 rounded-lg border-2 transition-all ${
              isActive
                ? "border-yellow-400 bg-yellow-900/20 shadow-lg"
                : call.status === "returning"
                ? "border-emerald-400 bg-emerald-900/20"
                : "border-slate-600 bg-slate-800/50"
            }`}
            style={{ marginLeft: `${call.depth * 24}px` }}
          >
            {/* Call header */}
            <div className="flex items-center gap-2 mb-2">
              <div className="text-slate-400 text-xs font-mono">
                CALL #{call.call_id}
              </div>
              <ChevronRight size={12} className="text-slate-500" />
              <div className="text-white text-xs font-mono">
                depth={call.depth}, remaining={call.remaining_count}
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
                ({currentInterval.start}, {currentInterval.end})
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
                  {currentInterval.end} {call.decision === "keep" ? ">" : "≤"}{" "}
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
                          ({interval.start},{interval.end})
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

export default AlgorithmTracePlayer;
