import React from "react";
import PropTypes from "prop-types";

/**
 * SlidingWindowState - Iterative Dashboard Implementation
 *
 * Strictly follows the 5-zone dashboard layout defined in index.css.
 *
 * Zones:
 * 1. Primary: Current Sum (Hero)
 * 2. Goal: Max Sum
 * 3. Logic: Status (Record vs Below)
 * 4. Action: Slide Math (Prev - Out + In)
 * 5. Overlay: Window Context (k, Best Start, Indices)
 */
const SlidingWindowState = ({ step }) => {
  // Graceful degradation
  if (!step?.data?.visualization) {
    return <div className="text-slate-400 p-4">No state data available</div>;
  }

  const { metrics, pointers } = step.data.visualization;
  const { incoming_element, outgoing_element } = step.data;

  // Safe data extraction
  const currentSum = metrics?.current_sum ?? 0;
  const maxSum = metrics?.max_sum ?? 0;
  const k = metrics?.k ?? "-";
  const bestStart = metrics?.max_window_start ?? "-";

  const winStart = pointers?.window_start ?? "-";
  const winEnd = pointers?.window_end ?? "-";

  // Logic Derivation
  // Since max_sum updates instantly in the backend, current_sum will never be > max_sum.
  // It is either == max_sum (At Record) or < max_sum (Below Record).
  let logicText = "START";
  let logicSubtext = "Initial Window";

  if (step.type !== "INITIAL_STATE") {
    if (currentSum === maxSum) {
      logicText = "MAX REACHED";
      logicSubtext = "Current == Max";
    } else {
      logicText = "BELOW MAX";
      logicSubtext = `Deficit: ${maxSum - currentSum}`;
    }
  }

  // Action Text (The Math)
  let actionText = "INITIALIZE WINDOW";
  if (step.type === "SLIDE_WINDOW" && outgoing_element && incoming_element) {
    // Format: "Prev - Out + In = New"
    // We need previous sum. Current sum is the result.
    // Prev = Current - In + Out
    const prevSum =
      currentSum - incoming_element.value + outgoing_element.value;
    actionText = `${prevSum} - ${outgoing_element.value} + ${incoming_element.value} = ${currentSum}`;
  } else if (step.type === "SLIDE_WINDOW") {
    actionText = "SLIDE WINDOW RIGHT";
  }

  return (
    <div className="dashboard">
      {/* ZONE 1: PRIMARY FOCUS (Current Sum) */}
      <div className="zone zone-primary">
        <div className="zone-label">Current Sum</div>
        <div className="zone-meta">
          WIN [{winStart}-{winEnd}]
        </div>
        <div className="primary-value">{currentSum}</div>

        {/* ZONE 5: OVERLAY (Context) */}
        <div className="zone-boundaries">
          <div className="boundary-cell">
            <div className="boundary-label">Size (k)</div>
            <div className="boundary-value">{k}</div>
          </div>
          <div className="boundary-cell">
            <div className="boundary-label">Best Start</div>
            <div className="boundary-value">IDX {bestStart}</div>
          </div>
          <div className="boundary-cell">
            <div className="boundary-label">Status</div>
            <div className="boundary-value">
              {currentSum === maxSum ? (
                <span className="text-emerald-400">BEST</span>
              ) : (
                <span className="text-slate-400">LOWER</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 2: GOAL (Max Sum) */}
      <div className="zone zone-goal">
        <div className="zone-label">Max Sum</div>
        <div className="goal-value">{maxSum}</div>
      </div>

      {/* ZONE 3: LOGIC (Comparison) */}
      <div className="zone zone-logic">
        <div className="zone-label">LOGIC</div>
        <div className="logic-content">
          <div className="text-sm">{logicText}</div>
          <div className="text-[0.6em] opacity-70 font-normal mt-1">
            {logicSubtext}
          </div>
        </div>
      </div>

      {/* ZONE 4: ACTION */}
      <div className="zone zone-action">
        <div className="action-text">{actionText}</div>
      </div>
    </div>
  );
};

SlidingWindowState.propTypes = {
  step: PropTypes.shape({
    type: PropTypes.string,
    data: PropTypes.shape({
      visualization: PropTypes.shape({
        metrics: PropTypes.object,
        pointers: PropTypes.object,
      }),
      incoming_element: PropTypes.object,
      outgoing_element: PropTypes.object,
    }),
  }).isRequired,
};

export default SlidingWindowState;
