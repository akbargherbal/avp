import React from "react";
import PropTypes from "prop-types";

/**
 * BinarySearchState - Iterative Dashboard Implementation
 * 
 * Uses the 5-zone dashboard layout defined in index.css (from iterative_metrics_algorithm_mockup.html).
 * 
 * Zones:
 * 1. Primary: Mid Value (Hero)
 * 2. Goal: Target Value
 * 3. Logic: Comparison (Mid vs Target)
 * 4. Action: Next Step Description
 * 5. Overlay: Pointers (L, R) & Search Space
 */
const BinarySearchState = ({ step }) => {
  // Graceful degradation
  if (!step?.data?.visualization) {
    return <div className="text-slate-400 p-4">No state data available</div>;
  }

  const { pointers, array, search_space_size } = step.data.visualization;
  
  // Safe data extraction
  const leftIdx = pointers?.left ?? "-";
  const rightIdx = pointers?.right ?? "-";
  const midIdx = pointers?.mid; // Can be null/undefined initially
  const target = pointers?.target ?? "?";
  
  // Resolve Mid Value
  let midValue = "-";
  if (midIdx !== null && midIdx !== undefined && Array.isArray(array)) {
    const midElement = array.find(item => item.index === midIdx);
    if (midElement) midValue = midElement.value;
  }

  // Logic & Action Derivation
  let logicText = "INITIALIZE";
  let logicSubtext = "Waiting to start";
  let actionText = "PREPARE SEARCH";

  if (step.type === "CALCULATE_MID") {
    logicText = "CALC MID";
    logicSubtext = `(${leftIdx} + ${rightIdx}) / 2 = ${midIdx}`;
    actionText = "COMPARE MID WITH TARGET";
  } else if (midValue !== "-" && target !== "?") {
    if (midValue < target) {
      logicText = `${midValue} < ${target}`;
      logicSubtext = "Mid is smaller";
      actionText = "SEARCH RIGHT →";
    } else if (midValue > target) {
      logicText = `${midValue} > ${target}`;
      logicSubtext = "Mid is larger";
      actionText = "← SEARCH LEFT";
    } else {
      logicText = `${midValue} == ${target}`;
      logicSubtext = "Match found!";
      actionText = "RETURN INDEX";
    }
  }

  // Override action text based on specific step types if needed
  if (step.type === "SEARCH_RIGHT") actionText = "ELIMINATE LEFT HALF";
  if (step.type === "SEARCH_LEFT") actionText = "ELIMINATE RIGHT HALF";
  if (step.type === "FOUND") actionText = "TARGET FOUND";

  return (
    <div className="dashboard">
      {/* ZONE 1: PRIMARY FOCUS (Mid Value) */}
      <div className="zone zone-primary">
        <div className="zone-label">Mid</div>
        <div className="zone-meta">IDX {midIdx ?? "-"}</div>
        <div className="primary-value">{midValue}</div>

        {/* ZONE 5: OVERLAY (Boundaries) */}
        <div className="zone-boundaries">
          <div className="boundary-cell">
            <div className="boundary-label">Left</div>
            <div className="boundary-value">{leftIdx}</div>
          </div>
          <div className="boundary-cell">
            <div className="boundary-label">Right</div>
            <div className="boundary-value">{rightIdx}</div>
          </div>
          <div className="boundary-cell">
            <div className="boundary-label">Space</div>
            <div className="boundary-value">{search_space_size ?? "-"}</div>
          </div>
        </div>
      </div>

      {/* ZONE 2: GOAL (Target) */}
      <div className="zone zone-goal">
        <div className="zone-label">Target</div>
        <div className="goal-value">{target}</div>
      </div>

      {/* ZONE 3: LOGIC (Comparison) */}
      <div className="zone zone-logic">
        <div className="zone-label">LOGIC</div>
        <div className="logic-content">
          <div>{logicText}</div>
          <div className="text-[0.6em] opacity-70 font-normal mt-1">{logicSubtext}</div>
        </div>
      </div>

      {/* ZONE 4: ACTION */}
      <div className="zone zone-action">
        <div className="action-text">
          {actionText}
        </div>
      </div>
    </div>
  );
};

BinarySearchState.propTypes = {
  step: PropTypes.shape({
    type: PropTypes.string,
    data: PropTypes.shape({
      visualization: PropTypes.shape({
        pointers: PropTypes.object,
        array: PropTypes.arrayOf(PropTypes.object),
        search_space_size: PropTypes.number,
      }),
    }),
  }).isRequired,
};

export default BinarySearchState;
