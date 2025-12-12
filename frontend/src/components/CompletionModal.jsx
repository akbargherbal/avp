import React from "react";
import { RotateCcw } from "lucide-react";
import { getAccuracyFeedback } from "../utils/predictionUtils";
import { getIntervalColor } from "../constants/intervalColors";

/**
 * Get outcome-driven modal theme based on algorithm result
 * Matches static mockup outcome-driven theming
 */
const getOutcomeTheme = (trace) => {
  const result = trace?.result || {};
  const algorithm = trace?.metadata?.algorithm || "unknown";

  // Binary Search: Check if target was found
  if (algorithm === "binary-search") {
    if (result.found === true) {
      return {
        border: "border-emerald-500",
        icon: "bg-emerald-500",
        iconPath: "M5 13l4 4L19 7", // Checkmark
        title: "Target Found!",
        subtitle: "Binary search completed successfully."
      };
    } else if (result.found === false) {
      return {
        border: "border-red-500",
        icon: "bg-red-500",
        iconPath: "M6 18L18 6M6 6l12 12", // X
        title: "Target Not Found",
        subtitle: "Binary search completed."
      };
    }
  }

  // Interval Coverage or other algorithms: Neutral/Complete
  return {
    border: "border-blue-500",
    icon: "bg-blue-500",
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", // Circle check
    title: "Algorithm Complete!",
    subtitle: algorithm === "interval-coverage"
      ? "Successfully removed covered intervals"
      : "Execution finished."
  };
};

/**
 * Completion Modal - Mockup Compliant
 *
 * VISUAL STANDARD: Matches static_mockup/completion_modal_mockup.html
 * - max-w-lg (512px) - NOT max-w-2xl
 * - p-6 padding - NOT p-5
 * - NO max-h-[85vh] constraint per mockup
 * - Outcome-driven theming (border/icon color)
 * - Two-button layout: Close (secondary) + Start Over (primary)
 * - Both buttons reset the trace to prevent state inconsistencies
 */
const CompletionModal = ({ trace, step, onReset, predictionStats }) => {
  // Check if we're on the last step (algorithm-agnostic)
  const isLastStep = trace?.trace?.steps &&
    step?.step === trace.trace.steps.length - 1;

  if (!isLastStep) {
    return null;
  }

  // Get outcome-driven theme
  const theme = getOutcomeTheme(trace);

  // Detect algorithm type from metadata
  const algorithm = trace?.metadata?.algorithm || "unknown";
  const isIntervalCoverage = algorithm === "interval-coverage";
  const isBinarySearch = algorithm === "binary-search";

  // Calculate accuracy (works for all algorithms)
  const accuracy =
    predictionStats?.total > 0
      ? Math.round((predictionStats.correct / predictionStats.total) * 100)
      : null;
  const feedback = accuracy !== null ? getAccuracyFeedback(accuracy) : null;

  // Render algorithm-specific completion content
  const renderAlgorithmResults = () => {
    if (isIntervalCoverage) {
      return renderIntervalCoverageResults();
    } else if (isBinarySearch) {
      return renderBinarySearchResults();
    } else {
      return renderGenericResults();
    }
  };

  const renderIntervalCoverageResults = () => {
    const inputSize = trace?.metadata?.input_size || 0;
    const keptCount = step?.data?.kept_count || 0;
    const removedCount = step?.data?.removed_count || 0;
    const result = step?.data?.result || [];

    return (
      <>
        {/* Stats Section */}
        <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-slate-400 text-xs">Initial</div>
              <div className="text-xl font-bold text-white">{inputSize}</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs">Kept</div>
              <div className="text-xl font-bold text-emerald-400">
                {keptCount}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-xs">Removed</div>
              <div className="text-xl font-bold text-red-400">
                {removedCount}
              </div>
            </div>
          </div>
        </div>

        {/* Final Result - NO SCROLLING per mockup */}
        <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
          <div className="text-slate-300 font-semibold mb-2 text-xs">
            Final Result:
          </div>
          {result.length === 0 ? (
            <div className="text-slate-500 text-xs italic text-center py-2">
              No intervals remaining
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {result.slice(0, 7).map((interval, idx) => {
                if (
                  !interval ||
                  typeof interval.start !== "number" ||
                  typeof interval.end !== "number"
                ) {
                  return null;
                }

                const colors = getIntervalColor(interval.color);

                return (
                  <div
                    key={interval.id || idx}
                    className={`${colors.bg} ${colors.text} px-1.5 py-0.5 rounded text-xs font-bold whitespace-nowrap`}
                  >
                    ({interval.start}, {interval.end})
                  </div>
                );
              })}
              {result.length > 7 && (
                <div className="bg-gray-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                  +{result.length - 7} more
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  };

  const renderBinarySearchResults = () => {
    const result = trace?.result || {};
    const found = result.found;
    const index = result.index;
    const comparisons = result.comparisons || 0;
    const target = trace?.metadata?.target_value;
    const arraySize = trace?.metadata?.input_size || 0;

    return (
      <>
        {/* Stats Section */}
        <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-slate-400 text-xs">Array Size</div>
              <div className="text-xl font-bold text-white">{arraySize}</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs">Comparisons</div>
              <div className="text-xl font-bold text-blue-400">
                {comparisons}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-xs">Result</div>
              <div className={`text-xl font-bold ${found ? "text-emerald-400" : "text-red-400"}`}>
                {found ? "✓ Found" : "✗ Not Found"}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderGenericResults = () => {
    return (
      <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
        <div className="text-slate-300 text-sm text-center py-4">
          Execution finished.
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none">
      <div className={`bg-slate-800 rounded-2xl shadow-2xl border-2 ${theme.border} max-w-lg w-full p-6`}>
        {/* Header Section with Outcome-Driven Theming */}
        <div className="text-center mb-4">
          <div className={`inline-flex items-center justify-center w-12 h-12 ${theme.icon} rounded-full mb-3`}>
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={theme.iconPath}
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">{theme.title}</h2>
          <p className="text-slate-400 text-sm mt-1">
            {theme.subtitle}
          </p>
        </div>

        {/* Algorithm-Specific Results */}
        {renderAlgorithmResults()}

        {/* Prediction Accuracy Section (works for all algorithms) */}
        {predictionStats?.total > 0 && (
          <div className="bg-slate-900/50 rounded-lg p-3 mb-4 border-2 border-blue-500/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold text-sm">
                Prediction Accuracy
              </h3>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-2xl font-bold ${
                    feedback.color === "emerald"
                      ? "text-emerald-400"
                      : feedback.color === "amber"
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {accuracy}%
                </span>
                <span className="text-slate-400 text-xs">
                  ({predictionStats.correct}/{predictionStats.total})
                </span>
              </div>
            </div>

            {/* Feedback Message */}
            <div
              className={`rounded p-2 ${
                feedback.color === "emerald"
                  ? "bg-emerald-900/30"
                  : feedback.color === "amber"
                  ? "bg-amber-900/30"
                  : "bg-red-900/30"
              }`}
            >
              <p
                className={`text-xs text-center ${
                  feedback.color === "emerald"
                    ? "text-emerald-300"
                    : feedback.color === "amber"
                    ? "text-amber-300"
                    : "text-red-300"
                }`}
              >
                {feedback.message}
              </p>
            </div>
          </div>
        )}

        {/* No Prediction Data Message */}
        {predictionStats?.total === 0 && (
          <div className="text-center text-slate-500 text-xs italic py-4">
            Prediction mode was not used.
          </div>
        )}

        {/* Actions - Two-Button Layout per Mockup */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-700">
          <button
            onClick={onReset}
            className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={onReset}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;
