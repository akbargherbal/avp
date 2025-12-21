import React from "react";
import PropTypes from "prop-types";
import RecursiveCallStackView from "./RecursiveCallStackView";
import TimelineView from "./TimelineView";

/**
 * IntervalCoverageVisualization - Custom visualization for Interval Coverage algorithm
 *
 * Renders a 2-column layout:
 * - LEFT (25%): Recursive call stack tree showing recursion depth
 * - RIGHT (75%): Timeline view showing all intervals with coverage tracking
 *
 * Backend Contract:
 * - step.data.visualization.call_stack_state (for LSP tree)
 * - step.data.visualization.all_intervals (for LSP tree metadata + timeline)
 * - step.data.visualization.max_end (for coverage line on timeline)
 *
 * Pattern: Exact replica of MergeSortVisualization structure
 * Reuses: RecursiveCallStackView (generic) + TimelineView (interval-specific)
 *
 * Migration Note: This replaces the architectural violation where
 * IntervalCoverageState.jsx rendered the entire call stack in RSP.
 * Now LSP shows structure, RSP shows current decision dashboard.
 *
 * @param {Object} step - Current step data from backend
 * @param {number} highlightedIntervalId - ID of interval being hovered
 * @param {Function} onIntervalHover - Callback for hover interactions
 */
const IntervalCoverageVisualization = ({
  step,
  highlightedIntervalId,
  onIntervalHover,
}) => {
  // Extract backend visualization data
  const viz = step?.data?.visualization || {};

  return (
    <div className="flex h-full gap-0 overflow-hidden">
      {/* LEFT SIDE: Recursive Call Stack Tree (LSP) - 25% */}
      <RecursiveCallStackView
        callStackState={viz.call_stack_state}
        allIntervals={viz.all_intervals}
      />

      {/* RIGHT SIDE: Timeline View (Main Area) - 75% */}
      <div className="flex-1 overflow-auto bg-slate-900">
        <TimelineView
          step={step}
          highlightedIntervalId={highlightedIntervalId}
          onIntervalHover={onIntervalHover}
        />
      </div>
    </div>
  );
};

IntervalCoverageVisualization.propTypes = {
  step: PropTypes.object.isRequired,
  highlightedIntervalId: PropTypes.number,
  onIntervalHover: PropTypes.func.isRequired,
};

export default React.memo(IntervalCoverageVisualization);
