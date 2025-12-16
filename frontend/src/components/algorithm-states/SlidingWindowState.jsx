import React from 'react';
import PropTypes from 'prop-types';

/**
 * SlidingWindowState - Displays algorithm-specific state for Sliding Window
 * 
 * FIXED: Now adaptively reads whatever the backend sends, following the 
 * BinarySearchState pattern of flexibility.
 * 
 * Shows:
 * - Pointers (whatever names backend uses: window_start/window_end OR left/right)
 * - Window metrics (current_sum, max_sum, etc.)
 */
const SlidingWindowState = ({ step, trace }) => {
  console.log("SlidingWindowState re-rendered", { step: step?.id });
  // Early return if no step data
  if (!step?.data?.visualization) {
    return (
      <div className="text-slate-400 text-sm">
        No state data available for this step.
      </div>
    );
  }

  const viz = step.data.visualization;
  const pointers = viz.pointers || {};
  
  // Extract metrics - support both nested and top-level structures
  const metrics = viz.metrics || viz; // Fallback to viz if metrics not nested
  
  // Common metric names to look for (in priority order)
  const currentSum = metrics.window_sum ?? metrics.current_sum ?? 'N/A';
  const maxSum = metrics.max_sum ?? 'N/A';
  const windowSize = metrics.k ?? 'N/A';

  return (
    <div className="space-y-4">
      {/* Pointers Section - Adaptive like BinarySearchState */}
      {Object.keys(pointers).length > 0 && (
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Pointers</h3>
          <div className="space-y-2 text-sm">
            {Object.entries(pointers).map(
              ([key, value]) =>
                value !== null &&
                value !== undefined && (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-400 capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="text-white font-mono">{value}</span>
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {/* Window Metrics Section */}
      <div className="bg-slate-700/50 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2">Window Metrics</h3>
        <div className="space-y-2 text-sm">
          {windowSize !== 'N/A' && (
            <div className="flex justify-between">
              <span className="text-gray-400">Window Size (k):</span>
              <span className="text-white font-mono">{windowSize}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-600">
            <span className="text-gray-400">Current Sum:</span>
            <span className="text-cyan-300 font-bold text-lg font-mono">
              {currentSum}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Max Sum Found:</span>
            <span className="text-emerald-300 font-bold text-lg font-mono">
              {maxSum}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

SlidingWindowState.propTypes = {
  step: PropTypes.shape({
    data: PropTypes.shape({
      visualization: PropTypes.object,
    }),
  }).isRequired,
  trace: PropTypes.object,
};

export default SlidingWindowState;