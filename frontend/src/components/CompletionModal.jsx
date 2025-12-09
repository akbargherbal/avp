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
                    <div className="text-slate-400 text-xs mb-1">
                      Initial
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {inputSize}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs mb-1">
                      Kept
                    </div>
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
      
              <div className="flex-grow mb-4 min-h-0">
                <div className="text-slate-300 font-semibold mb-2 text-sm">
                  Final Result:
                </div>
                {result.length === 0 ? (
                  <div className="text-slate-500 text-sm italic text-center py-4">
                    No intervals remaining
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-900/50 rounded-lg">
                    {result.map((interval, idx) => {
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
                          className={`${colorClass} px-2 py-1 rounded-md text-xs font-bold`}
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
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                Start Over
              </button>
            </div>
    </div>
  );
};

export default CompletionModal;