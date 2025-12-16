import React from "react";
import { RotateCcw } from "lucide-react";
import { getAccuracyFeedback } from "../utils/predictionUtils";
import { getIntervalColor } from "../constants/intervalColors";
import { useTrace } from "../contexts/TraceContext";

/**
 * Get outcome-driven modal theme based on algorithm result
 */
const getOutcomeTheme = (trace) => {
  const result = trace?.result || {};
  const algorithm = trace?.metadata?.algorithm || "unknown";

  if (algorithm === "binary-search") {
    if (result.found === true) {
      return {
        border: "border-emerald-500",
        icon: "bg-emerald-500",
        iconPath: "M5 13l4 4L19 7",
        title: "Target Found!",
        subtitle: "Binary search completed successfully."
      };
    } else if (result.found === false) {
      return {
        border: "border-red-500",
        icon: "bg-red-500",
        iconPath: "M6 18L18 6M6 6l12 12",
        title: "Target Not Found",
        subtitle: "Binary search completed."
      };
    }
  }

  return {
    border: "border-blue-500",
    icon: "bg-blue-500",
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Algorithm Complete!",
    subtitle: algorithm === "interval-coverage"
      ? "Interval coverage finished."
      : "Execution finished."
  };
};

const CompletionModal = ({ isOpen, step, onReset, onClose, predictionStats }) => {
  const { trace } = useTrace();
  
  console.log("CompletionModal re-rendered", { isOpen });
  
  if (!isOpen) {
    return null;
  }

  const theme = getOutcomeTheme(trace);
  const algorithm = trace?.metadata?.algorithm || "unknown";
  const isIntervalCoverage = algorithm === "interval-coverage";
  const isBinarySearch = algorithm === "binary-search";

  const accuracy =
    predictionStats?.total > 0
      ? Math.round((predictionStats.correct / predictionStats.total) * 100)
      : null;
  const feedback = accuracy !== null ? getAccuracyFeedback(accuracy) : null;

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
        <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-slate-400 text-xs uppercase tracking-wide">Initial</div>
              <div className="text-xl font-bold text-white">{inputSize}</div>
            </div>
            <div className="border-l border-slate-700">
              <div className="text-slate-400 text-xs uppercase tracking-wide">Kept</div>
              <div className="text-xl font-bold text-emerald-400">{keptCount}</div>
            </div>
            <div className="border-l border-slate-700">
              <div className="text-slate-400 text-xs uppercase tracking-wide">Removed</div>
              <div className="text-xl font-bold text-red-400">{removedCount}</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-slate-300 font-semibold text-xs uppercase tracking-wide">Final Result:</span>
          </div>
          {result.length === 0 ? (
            <div className="text-slate-500 text-xs italic text-center py-2">No intervals remaining</div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {result.slice(0, 7).map((interval, idx) => {
                if (!interval || typeof interval.start !== "number" || typeof interval.end !== "number") return null;
                const colors = getIntervalColor(interval.color);
                return (
                  <div key={interval.id || idx} className={`${colors.bg} ${colors.text} px-1.5 py-0.5 rounded text-xs font-bold whitespace-nowrap`}>
                    ({interval.start}, {interval.end})
                  </div>
                );
              })}
              {result.length > 7 && <div className="bg-gray-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">+{result.length - 7} more</div>}
            </div>
          )}
        </div>
      </>
    );
  };

  const renderBinarySearchResults = () => {
    const result = trace?.result || {};
    const comparisons = result.comparisons || 0;
    const arraySize = trace?.metadata?.input_size || 0;

    return (
      <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-slate-400 text-xs uppercase tracking-wide">Array Size</div>
            <div className="text-xl font-bold text-white">{arraySize}</div>
          </div>
          <div className="border-l border-slate-700">
            <div className="text-slate-400 text-xs uppercase tracking-wide">Comparisons</div>
            <div className="text-xl font-bold text-blue-400">{comparisons}</div>
          </div>
          <div className="border-l border-slate-700">
            <div className="text-slate-400 text-xs uppercase tracking-wide">Result</div>
            <div className={`text-xl font-bold ${result.found ? "text-emerald-400" : "text-red-400"}`}>
              {result.found ? "✓ Found" : "✗ Missing"}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGenericResults = () => (
    <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
      <div className="text-slate-300 text-sm text-center py-2">Execution finished successfully.</div>
    </div>
  );

  return (
    <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-slate-800 rounded-2xl shadow-2xl border-2 ${theme.border} max-w-lg w-full p-5 transition-all duration-500 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 ${theme.icon} rounded-full`}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={theme.iconPath} />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white leading-tight">{theme.title}</h2>
            <p className="text-slate-400 text-sm">{theme.subtitle}</p>
          </div>
        </div>
        {renderAlgorithmResults()}
        {predictionStats?.total > 0 && (
          <div className="bg-slate-900/50 rounded-lg p-3 mb-4 border border-blue-500/30 flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-sm">Prediction Accuracy</h3>
              <div className={`text-xs mt-0.5 ${feedback.color === "emerald" ? "text-emerald-300" : feedback.color === "amber" ? "text-amber-300" : "text-red-300"}`}>{feedback.message}</div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold leading-none ${feedback.color === "emerald" ? "text-emerald-400" : feedback.color === "amber" ? "text-amber-400" : "text-red-400"}`}>{accuracy}%</div>
              <div className="text-slate-400 text-xs">({predictionStats.correct}/{predictionStats.total})</div>
            </div>
          </div>
        )}
        {predictionStats?.total === 0 && <div className="text-center text-slate-500 text-xs italic py-2 mb-2">Prediction mode was not used.</div>}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700">
          <button onClick={onClose} className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            Close
          </button>
          <button onClick={onReset} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            <RotateCcw size={16} />
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;

