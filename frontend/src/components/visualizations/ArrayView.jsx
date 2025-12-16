import React from "react";
import ArrayItem from "./ArrayItem";

// EXTRACTED CONSTANTS (Phase 3.2)
const POINTER_STYLES = {
  left: { label: "L", color: "text-blue-400", bgColor: "bg-blue-900/50" },
  right: { label: "R", color: "text-red-400", bgColor: "bg-red-900/50" },
  mid: { label: "M", color: "text-yellow-400", bgColor: "bg-yellow-900/50" },
  slow: { label: "S", color: "text-cyan-400", bgColor: "bg-cyan-900/50" },
  fast: { label: "F", color: "text-orange-400", bgColor: "bg-orange-900/50" },
  window_start: {
    label: "Start",
    color: "text-purple-400",
    bgColor: "bg-purple-900/50",
  },
  window_end: {
    label: "End",
    color: "text-purple-400",
    bgColor: "bg-purple-900/50",
  },
  default: { label: "P", color: "text-gray-400", bgColor: "bg-gray-900/50" },
};

// EXTRACTED HELPER FUNCTION (Phase 3.2)
const getElementClasses = (element) => {
  const baseClasses =
    "w-12 h-12 flex items-center justify-center rounded-md font-bold text-base transition-all duration-300 border-2 flex-shrink-0";

  switch (element.state) {
    case "examining":
      return `${baseClasses} bg-yellow-500 border-yellow-400 text-black scale-110 shadow-lg animate-pulse`;
    case "found":
      return `${baseClasses} bg-green-500 border-green-400 text-white scale-110 shadow-lg`;
    case "active_range":
      return `${baseClasses} bg-blue-600 border-blue-500 text-white shadow-md`;
    case "in_window":
      return `${baseClasses} bg-purple-600 border-purple-500 text-white shadow-md`;
    case "excluded":
      return `${baseClasses} bg-gray-700 border-gray-600 text-gray-500 opacity-50`;
    case "unique":
      return `${baseClasses} bg-green-600 border-green-500 text-white shadow-md`;
    case "duplicate":
      return `${baseClasses} bg-gray-700 border-gray-600 text-gray-500 opacity-50`;
    case "unprocessed":
      return `${baseClasses} bg-slate-600 border-slate-500 text-white`;
    default:
      return `${baseClasses} bg-slate-800 border-slate-700 text-white`;
  }
};

// EXTRACTED HELPER FUNCTION (Phase 3.2)
const getPointerForIndex = (pointers, index) => {
  if (!pointers) return null;

  for (const [key, value] of Object.entries(pointers)) {
    if (value === index) {
      return (
        POINTER_STYLES[key] || {
          ...POINTER_STYLES.default,
          label: key.charAt(0).toUpperCase(),
        }
      );
    }
  }
  return null;
};

const ArrayView = ({ step, config = {} }) => {
  const visualization = step?.data?.visualization;

  if (!visualization || !visualization.array) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No array data available
      </div>
    );
  }

  const { array, pointers = {} } = visualization;
  // config prop can be used here if needed

  return (
    // PERMANENT FIX: Use items-start + mx-auto pattern
    <div className="h-full flex flex-col items-start overflow-auto py-4 px-6">
      <div className="mx-auto flex flex-col items-center gap-4 min-h-0 w-full">
        {/* CONDITIONAL: Target indicator */}
        {pointers.target !== null && pointers.target !== undefined && (
          <div className="px-4 py-1.5 bg-green-900/30 border border-green-600/50 rounded-lg flex-shrink-0">
            <span className="text-green-400 font-semibold text-sm">
              🎯 Target:{" "}
              <span className="text-white text-base font-bold">
                {pointers.target}
              </span>
            </span>
          </div>
        )}

        {/* Array visualization - Wrapping Grid Layout */}
        <div className="flex flex-wrap justify-center gap-2 w-full max-w-4xl">
          {array.map((element) => (
            <ArrayItem
              key={element.index}
              element={element}
              pointer={getPointerForIndex(pointers, element.index)}
              getElementClasses={getElementClasses}
            />
          ))}
        </div>

        {/* CONDITIONAL: Search space info */}
        {visualization.search_space_size !== undefined && (
          <div className="text-xs text-gray-400 flex-shrink-0">
            Search space:{" "}
            <span className="text-white font-semibold">
              {visualization.search_space_size}
            </span>{" "}
            elements
          </div>
        )}

        {/* State legend */}
        <div className="flex flex-wrap gap-3 text-[10px] justify-center flex-shrink-0">
          {/* Legend items could be dynamic based on algorithm type */}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ArrayView);
