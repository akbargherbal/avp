import React from "react";
import PropTypes from "prop-types";

/**
 * MergeSortState - Iterative Dashboard Implementation
 *
 * Adapts the recursive Merge Sort algorithm into the 5-zone dashboard layout.
 *
 * Zones:
 * 1. Primary: Active Value/Operation (Hero) - e.g., Comparison "5 vs 3" or Split Size
 * 2. Goal: Total Merges Completed
 * 3. Logic: The "Why" (e.g., "Left < Right", "Base Case Reached")
 * 4. Action: The "What" (e.g., "Take Left", "Split Array")
 * 5. Overlay: Context (Depth, Comparisons, Operation Type)
 */
const LONG_TEXT = 4
const MergeSortState = ({ step }) => {
  // Graceful degradation
  if (!step?.data) {
    return <div className="text-slate-400 p-4">No state data available</div>;
  }

  const { type, data } = step;
  const viz = data.visualization || {};

  // --- DEFAULT STATE ---
  let primaryLabel = "Status";
  let primaryValue = "-";
  let primaryMeta = "";

  let goalLabel = "Merges";
  let goalValue = viz.merge_count ?? 0;

  let logicText = "WAITING";
  let logicSub = "Initializing...";
  let logicColor = "text-white"; // Default white

  let actionText = "PREPARE SORT";
  let actionColor = "text-slate-300";

  // Overlay Context
  let overlay1Label = "Depth";
  let overlay1Value = data.depth ?? 0;
  let overlay2Label = "Comparisons";
  let overlay2Value = viz.comparison_count ?? 0;
  let overlay3Label = "Phase";
  let overlay3Value = "INIT";

  // --- LOGIC MAPPING ---
  switch (type) {
    case "INITIAL_STATE":
      primaryLabel = "Input Size";
      primaryValue = data.array?.length ?? 0;
      primaryMeta = "Unsorted";
      logicText = "START";
      logicSub = "Divide & Conquer";
      actionText = "BEGIN RECURSION";
      overlay3Value = "SETUP";
      break;

    case "SPLIT_ARRAY":
      primaryLabel = "Split Size";
      primaryValue = data.array?.length ?? 0;
      primaryMeta = `Mid: ${data.mid_index}`;
      logicText = "DIVIDE";
      logicSub = `n = ${data.array?.length} > 1`;
      actionText = `SPLIT INTO [${data.left_half?.length}] AND [${data.right_half?.length}]`;
      overlay3Value = "SPLIT";
      break;

    case "BASE_CASE":
      primaryLabel = "Value";
      primaryValue = data.array?.[0] ?? "-";
      primaryMeta = "Sorted";
      logicText = "BASE CASE";
      logicSub = "n = 1";
      logicColor = "text-emerald-300";
      actionText = "RETURN SINGLE ELEMENT";
      actionColor = "text-emerald-200";
      overlay3Value = "BASE";
      break;

    case "MERGE_START":
      primaryLabel = "Merging";
      primaryValue = `${data.left?.length ?? 0} + ${data.right?.length ?? 0}`;
      primaryMeta = "Elements";
      logicText = "COMBINE";
      logicSub = "Sorted Subarrays";
      actionText = "INITIALIZE POINTERS";
      overlay3Value = "MERGE";
      break;

    case "MERGE_COMPARE": {
      const leftVal = data.left_value;
      const rightVal = data.right_value;
      const choseLeft = data.chose === "left";

      primaryLabel = "Comparing";
      // Use a slightly smaller font class if values are large, but standard layout usually fits
      primaryValue = `${leftVal} vs ${rightVal}`;
      primaryMeta = choseLeft ? "Left Wins" : "Right Wins";

      if (choseLeft) {
        logicText = `${leftVal} ≤ ${rightVal}`;
        logicSub = "Left is smaller/equal";
        logicColor = "text-blue-300";
        actionText = `SELECT LEFT: ${leftVal}`;
      } else {
        logicText = `${leftVal} > ${rightVal}`;
        logicSub = "Right is smaller";
        logicColor = "text-amber-300";
        actionText = `SELECT RIGHT: ${rightVal}`;
      }
      overlay3Value = "COMPARE";
      break;
    }

    case "MERGE_TAKE_LEFT":
    case "MERGE_TAKE_RIGHT":
      primaryLabel = "Selected";
      primaryValue = data.value;
      primaryMeta = "Appended";
      logicText = "APPEND";
      logicSub = "To Result Array";
      logicColor = "text-emerald-300";
      actionText = "INCREMENT POINTER";
      actionColor = "text-emerald-200";
      overlay3Value = "BUILD";
      break;

    case "MERGE_REMAINDER":
      primaryLabel = "Remaining";
      primaryValue = `${data.values?.length ?? 0} Items`;
      primaryMeta = `From ${data.source}`;
      logicText = "FLUSH";
      logicSub = "One side empty";
      actionText = "APPEND ALL REMAINING";
      overlay3Value = "FLUSH";
      break;

    case "MERGE_COMPLETE":
      primaryLabel = "Merged Size";
      primaryValue = data.merged_array?.length ?? 0;
      primaryMeta = "Sorted";
      logicText = "COMPLETE";
      logicSub = "Subarray sorted";
      logicColor = "text-emerald-400";
      actionText = "RETURN TO PARENT";
      actionColor = "text-emerald-300";
      overlay3Value = "DONE";
      break;

    case "ALGORITHM_COMPLETE":
      primaryLabel = "Final Size";
      primaryValue = data.sorted_array?.length ?? 0;
      primaryMeta = "Sorted";
      logicText = "FINISHED";
      logicSub = "Array fully sorted";
      logicColor = "text-emerald-400";
      actionText = "ALGORITHM COMPLETE";
      actionColor = "text-emerald-300";
      overlay3Value = "END";
      break;

    default:
      break;
  }

  return (
    <div className="dashboard">
      {/* ZONE 1: PRIMARY FOCUS (Hero Metric) */}
      <div className="zone zone-primary">
        <div className="zone-label">{primaryLabel}</div>
        <div className="zone-meta">{primaryMeta}</div>

        {/* Adjust font size dynamically for comparison strings like "10 vs 5" */}
        <div
          className={`primary-value ${
            // typeof primaryValue === "string" && primaryValue.includes("vs")
            typeof primaryValue === "string" && (primaryValue.length > LONG_TEXT)
              ? "long-text"
              : ""
          }`}
        >
          {primaryValue}
        </div>

        {/* ZONE 5: OVERLAY (Context) */}
        <div className="zone-boundaries">
          <div className="boundary-cell">
            <div className="boundary-label">{overlay1Label}</div>
            <div className="boundary-value">{overlay1Value}</div>
          </div>
          <div className="boundary-cell">
            <div className="boundary-label">{overlay2Label}</div>
            <div className="boundary-value">{overlay2Value}</div>
          </div>
          <div className="boundary-cell">
            <div className="boundary-label">{overlay3Label}</div>
            <div className="boundary-value text-blue-300">{overlay3Value}</div>
          </div>
        </div>
      </div>

      {/* ZONE 2: GOAL (Progress) */}
      <div className="zone zone-goal">
        <div className="zone-label">{goalLabel}</div>
        <div className="goal-value">{goalValue}</div>
      </div>

      {/* ZONE 3: LOGIC (Reasoning) */}
      <div className="zone zone-logic">
        <div className="zone-label">LOGIC</div>
        <div className="logic-content">
          <div className={logicColor}>{logicText}</div>
          <div
            className={`text-[0.8em] opacity-70 font-normal mt-1 ${logicColor}`}
          >
            {logicSub}
          </div>
        </div>
      </div>

      {/* ZONE 4: ACTION (Next Step) */}
      <div className="zone zone-action">
        <div className={`action-text ${actionColor}`}>{actionText}</div>
      </div>
    </div>
  );
};

MergeSortState.propTypes = {
  step: PropTypes.shape({
    type: PropTypes.string,
    data: PropTypes.shape({
      array: PropTypes.array,
      left: PropTypes.array,
      right: PropTypes.array,
      left_half: PropTypes.array,
      right_half: PropTypes.array,
      merged_array: PropTypes.array,
      sorted_array: PropTypes.array,
      values: PropTypes.array,
      depth: PropTypes.number,
      mid_index: PropTypes.number,
      left_value: PropTypes.number,
      right_value: PropTypes.number,
      value: PropTypes.number,
      chose: PropTypes.string,
      source: PropTypes.string,
      visualization: PropTypes.shape({
        merge_count: PropTypes.number,
        comparison_count: PropTypes.number,
      }),
    }),
  }).isRequired,
};

export default MergeSortState;
