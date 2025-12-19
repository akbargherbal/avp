import React from "react";
import PropTypes from "prop-types";

/**
 * TwoPointerState - Iterative Dashboard Implementation
 *
 * Strictly follows the 5-zone dashboard layout defined in index.css.
 *
 * Zones:
 * 1. Primary: Fast Pointer Value (Read Head)
 * 2. Goal: Slow Pointer Value (Write Head)
 * 3. Logic: Comparison (Unique vs Duplicate)
 * 4. Action: Operation (Copy vs Skip)
 * 5. Overlay: Indices & Unique Count
 */
const TwoPointerState = ({ step }) => {
  // Graceful degradation
  if (!step?.data?.visualization) {
    return <div className="text-slate-400 p-4">No state data available</div>;
  }

  const { pointers, metrics, array } = step.data.visualization;

  // Safe data extraction
  const slow = pointers?.slow ?? 0;
  const fast = pointers?.fast ?? 0;
  const uniqueCount = metrics?.unique_count ?? 0;

  // Get values safely
  const slowValue = array?.[slow]?.value ?? "-";
  // Handle fast pointer out of bounds (end of array)
  const fastValue = array?.[fast]?.value ?? "-";

  const isComplete = step.type === "ALGORITHM_COMPLETE";
  const isInitial = step.type === "INITIAL_STATE";

  // Logic Derivation
  let logicText = "START";
  let logicSub = "Initialize";
  let logicColor = "text-white";
  let actionText = "INITIALIZE POINTERS";
  let actionColor = "text-slate-300";

  if (isComplete) {
    logicText = "DONE";
    logicSub = "Complete";
    logicColor = "text-emerald-400";
    actionText = `FOUND ${uniqueCount} UNIQUE ITEMS`;
    actionColor = "text-emerald-300";
  } else if (!isInitial) {
    // Determine if unique or duplicate based on values
    // Note: In a real trace, we might want to use step.type or explicit state
    // But comparing values is robust enough for visualization logic here
    const isUnique = fastValue !== slowValue;

    if (fast >= array?.length) {
      logicText = "END";
      logicSub = "Of Array";
      actionText = "FINISH ALGORITHM";
    } else if (isUnique) {
      logicText = `${fastValue} != ${slowValue}`;
      logicSub = "UNIQUE";
      logicColor = "text-emerald-300";
      actionText = `COPY ${fastValue} TO IDX ${slow + 1}`;
      actionColor = "text-emerald-200";
    } else {
      logicText = `${fastValue} == ${slowValue}`;
      logicSub = "DUPLICATE";
      logicColor = "text-amber-300";
      actionText = "SKIP DUPLICATE";
      actionColor = "text-amber-200";
    }
  }

  return (
    <div className="dashboard">
      {/* ZONE 1: PRIMARY FOCUS (Fast Pointer / Read) */}
      <div className="zone zone-primary">
        <div className="zone-label">Fast (Read)</div>
        <div className="zone-meta">IDX {fast}</div>
        <div className="primary-value">{fastValue}</div>

        {/* ZONE 5: OVERLAY (Context) */}
        <div className="zone-boundaries">
          <div className="boundary-cell">
            <div className="boundary-label">Fast Idx</div>
            <div className="boundary-value">{fast}</div>
          </div>
          <div className="boundary-cell">
            <div className="boundary-label">Slow Idx</div>
            <div className="boundary-value">{slow}</div>
          </div>
          <div className="boundary-cell">
            <div className="boundary-label">Unique</div>
            <div className="boundary-value text-emerald-400">{uniqueCount}</div>
          </div>
        </div>
      </div>

      {/* ZONE 2: GOAL (Slow Pointer / Write) */}
      <div className="zone zone-goal">
        <div className="zone-label">Slow (Write)</div>
        <div className="goal-value">{slowValue}</div>
      </div>

      {/* ZONE 3: LOGIC (Comparison) */}
      <div className="zone zone-logic">
        <div className="zone-label">LOGIC</div>
        <div className="logic-content">
          <div className={logicColor}>{logicText}</div>
          <div
            className={`text-[0.6em] opacity-70 font-normal mt-1 ${logicColor}`}
          >
            {logicSub}
          </div>
        </div>
      </div>

      {/* ZONE 4: ACTION */}
      <div className="zone zone-action">
        <div className={`action-text ${actionColor}`}>{actionText}</div>
      </div>
    </div>
  );
};

TwoPointerState.propTypes = {
  step: PropTypes.shape({
    type: PropTypes.string,
    data: PropTypes.shape({
      visualization: PropTypes.shape({
        pointers: PropTypes.shape({
          slow: PropTypes.number,
          fast: PropTypes.number,
        }),
        metrics: PropTypes.shape({
          unique_count: PropTypes.number,
        }),
        array: PropTypes.arrayOf(
          PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
          })
        ),
      }),
    }),
  }).isRequired,
};

export default TwoPointerState;
