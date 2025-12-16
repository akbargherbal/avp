import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * TwoPointerState - Displays algorithm-specific state for Two Pointer
 * 
 * FIXED: Now adaptively reads whatever the backend sends, following the 
 * BinarySearchState pattern of flexibility.
 * 
 * Shows:
 * - Pointers (whatever names backend uses: slow/fast OR left/right)
 * - Unique count metric
 */
const TwoPointerState = ({ step, trace }) => {
  console.log("TwoPointerState re-rendered", { step: step?.id });
  // Action handler (kept from original)
  const handlePointerAction = () => {
    console.log("Pointer action triggered!");
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }
      if (event.key.toLowerCase() === 'p') {
        handlePointerAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
  const metrics = viz.metrics || viz;
  const uniqueCount = metrics.unique_count ?? 'N/A';

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

      {/* Metrics Section */}
      {uniqueCount !== 'N/A' && (
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Progress</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Unique Elements:</span>
              <span className="text-emerald-300 font-bold text-lg font-mono">
                {uniqueCount}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Hint */}
      <div className="text-xs text-slate-500 pt-2 border-t border-slate-700">
        Hint: Press [P] to trigger the pointer action.
      </div>
    </div>
  );
};

TwoPointerState.propTypes = {
  step: PropTypes.shape({
    data: PropTypes.shape({
      visualization: PropTypes.object,
    }),
  }).isRequired,
  trace: PropTypes.object,
};

export default TwoPointerState;