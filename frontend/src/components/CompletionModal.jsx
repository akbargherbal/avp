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
      <div className="bg-slate-800 rounded-2xl shadow-2xl border-2 border-emerald-500 max-w-lg w-full p-6 max-h-[90vh] flex flex-col">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-full mb-3">
            <svg
              className="w-8 h-8 text-white"
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
          <h2 className="text-2xl font-bold text-white mb-1">
            Algorithm Complete!
          </h2>
          <p className="text-slate-400 text-sm">
            Successfully removed covered intervals
          </p>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-slate-400 text-xs mb-1">Initial</div>
              <div className="text-2xl font-bold text-white">{inputSize}</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-1">Kept</div>
              <div className="text-2xl font-bold text-emerald-400">
                {keptCount}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-xs mb-1">Removed</div>
              <div className="text-2xl font-bold text-red-400">
                {removedCount}
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Accuracy Section */}
        {predictionStats?.total > 0 && (
          <div className="bg-slate-900/50 rounded-lg p-4 mb-4 border-2 border-blue-500">
            <div className="text-center mb-3">
              <h3 className="text-white font-bold text-lg mb-1">
                Prediction Accuracy
              </h3>
              <div className="text-4xl font-bold mb-2">
                <span
                  className={`${
                    feedback.color === "emerald"
                      ? "text-emerald-400"
                      : feedback.color === "amber"
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {accuracy}%
                </span>
              </div>
              <div className="text-slate-400 text-sm">
                {predictionStats.correct} / {predictionStats.total} correct
              </div>
            </div>

            {/* Feedback Message */}
            <div
              className={`rounded-lg p-3 ${
                feedback.color === "emerald"
                  ? "bg-emerald-900/30 border border-emerald-500/50"
                  : feedback.color === "amber"
                  ? "bg-amber-900/30 border border-amber-500/50"
                  : "bg-red-900/30 border border-red-500/50"
              }`}
            >
              <p
                className={`text-sm text-center ${
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

        {/* Final Result Section */}
        <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
          <div className="text-slate-300 font-semibold mb-2 text-sm">
            Final Result:
          </div>
          {result.length === 0 ? (
            <div className="text-slate-500 text-sm italic text-center py-4">
              No intervals remaining
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
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
                    className={`${colors.bg} ${colors.text} px-2 py-1 rounded-md text-xs font-bold`}
                  >
                    ({interval.start}, {interval.end})
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={onReset}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto"
        >
          <RotateCcw size={18} />
          Start Over
        </button>
      </div>
    </div>
  );
};

export default CompletionModal;
