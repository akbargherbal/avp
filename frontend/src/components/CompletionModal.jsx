import React from "react";
import { RotateCcw } from "lucide-react";

const CompletionModal = ({ trace, step, onReset }) => {
  if (step?.type !== "ALGORITHM_COMPLETE") {
    return null;
  }

  // Safe access with fallbacks
  const inputSize = trace?.metadata?.input_size || 0;
  const keptCount = step?.data?.kept_count || 0;
  const removedCount = step?.data?.removed_count || 0;
  const result = step?.data?.result || [];

  return (
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
                {inputSize}
              </div>
            </div>
            <div className="text-center">
              <div className="text-slate-400 text-sm mb-1">
                Kept Intervals
              </div>
              <div className="text-3xl font-bold text-emerald-400">
                {keptCount}
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-slate-700">
            <div className="text-slate-400 text-sm mb-1">Removed</div>
            <div className="text-2xl font-bold text-red-400">
              {removedCount} interval(s)
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-slate-300 font-semibold mb-2">
            Final Result:
          </div>
          {result.length === 0 ? (
            <div className="text-slate-500 text-sm italic">
              No intervals remaining
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {result.map((interval, idx) => {
                // Skip malformed intervals
                if (!interval || typeof interval.start !== 'number' || typeof interval.end !== 'number') {
                  return null;
                }

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
                    key={interval.id || idx}
                    className={`${colorClass} px-3 py-2 rounded-lg text-sm font-bold`}
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
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          Start Over
        </button>
      </div>
    </div>
  );
};

export default CompletionModal;