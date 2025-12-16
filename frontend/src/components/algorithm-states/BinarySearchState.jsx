import React from "react";
import PropTypes from "prop-types";

/**
 * BinarySearchState - Displays algorithm-specific state for Binary Search
 * 
 * Shows:
 * - Pointers (left, right, mid)
 * - Search space size with progress bar
 * 
 * @param {Object} step - Current step data from trace
 * @param {Object} trace - Full trace data (for metadata like input_size)
 */
const BinarySearchState = ({ step, trace }) => {
  console.log("BinarySearchState re-rendered", { step: step?.id });
  // Early return if no step data
  if (!step?.data?.visualization) {
    return (
      <div className="text-gray-400 text-sm">
        No state data available for this step
      </div>
    );
  }

  const { pointers, search_space_size } = step.data.visualization;

  return (
    <div className="space-y-4">
      {/* Pointers Section */}
      {pointers && (
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Pointers</h3>
          <div className="space-y-2 text-sm">
            {Object.entries(pointers).map(
              ([key, value]) =>
                value !== null &&
                value !== undefined && (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-400 capitalize">{key}:</span>
                    <span className="text-white font-mono">{value}</span>
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {/* Search Progress Section */}
      {search_space_size !== undefined && (
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Search Progress</h3>
          <div className="text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Space Size:</span>
              <span className="text-white font-mono">{search_space_size}</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.max(
                    0,
                    100 -
                      (search_space_size / (trace?.metadata?.input_size || 1)) *
                        100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

BinarySearchState.propTypes = {
  step: PropTypes.shape({
    data: PropTypes.shape({
      visualization: PropTypes.shape({
        pointers: PropTypes.object,
        search_space_size: PropTypes.number,
      }),
    }),
  }).isRequired,
  trace: PropTypes.shape({
    metadata: PropTypes.shape({
      input_size: PropTypes.number,
    }),
  }),
};

export default BinarySearchState;
