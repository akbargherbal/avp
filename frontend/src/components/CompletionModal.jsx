import React from "react";
import { RotateCcw } from "lucide-react";
import { getAccuracyFeedback } from "../utils/predictionUtils";
import { getIntervalColor } from "../constants/intervalColors";

const CompletionModal = ({ trace, step, onReset, predictionStats }) => {
  if (step?.type !== "ALGORITHM_COMPLETE") {
    return null;
  }

  const inputSize = trace?.metadata?.input_size || 0;
  const keptCount = step?.data?.kept_count || 0;
  const removedCount = step?.data?.removed_count || 0;
  const result = step?.data?.result || [];

  // Calculate accuracy
  const accuracy =
    predictionStats?.total > 0
      ? Math.round((predictionStats.correct / predictionStats.total) * 100)
      : null;
  const feedback = accuracy !== null ? getAccuracyFeedback(accuracy) : null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl border-2 border-emerald-500 max-w-lg w-full p-5">
        {/* Header Section - Compact */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-500 rounded-full mb-2">
            <svg
              className="w-6 h-6 text-white"
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
          <h2 className="text-xl font-bold text-white">Algorithm Complete!</h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Successfully removed covered intervals
          </p>
        </div>

        {/* Stats Section - Compact */}
        <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-slate-400 text-xs mb-0.5">Initial</div>
              <div className="text-xl font-bold text-white">{inputSize}</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-0.5">Kept</div>
              <div className="text-xl font-bold text-emerald-400">
                {keptCount}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-0.5">Removed</div>
              <div className="text-xl font-bold text-red-400">
                {removedCount}
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Accuracy Section - Compact */}
        {predictionStats?.total > 0 && (
          <div className="bg-slate-900/50 rounded-lg p-3 mb-3 border-2 border-blue-500">
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

            {/* Feedback Message - Inline */}
            <div
              className={`rounded px-2 py-1.5 ${
                feedback.color === "emerald"
                  ? "bg-emerald-900/30 border border-emerald-500/50"
                  : feedback.color === "amber"
                  ? "bg-amber-900/30 border border-amber-500/50"
                  : "bg-red-900/30 border border-red-500/50"
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
                {feedback.emoji} {feedback.message}
              </p>
            </div>
          </div>
        )}

        {/* Final Result Section - Compact with max height */}
        <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
          <div className="text-slate-300 font-semibold mb-2 text-xs">
            Final Result:
          </div>
          {result.length === 0 ? (
            <div className="text-slate-500 text-xs italic text-center py-2">
              No intervals remaining
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {result.map((interval, idx) => {
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
            </div>
          )}
        </div>

        {/* Button - Compact */}
        <button
          onClick={onReset}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          Start Over
        </button>
      </div>
    </div>
  );
};

export default CompletionModal;
