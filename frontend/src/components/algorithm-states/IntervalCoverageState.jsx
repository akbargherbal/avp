import React from "react";
import PropTypes from "prop-types";
import { getIntervalColor } from "../../constants/intervalColors";

/**
 * IntervalCoverageState - Unified Dashboard Implementation
 *
 * Migrated from architectural violation (entire call stack in RSP)
 * to unified dashboard pattern (current decision only in 5-zone layout).
 *
 * Pattern: Exact replica of MergeSortState.jsx dashboard structure
 *
 * Zones:
 * 1. Primary: Interval Being Examined (Hero Value)
 * 2. Goal: Max End Coverage Tracker
 * 3. Logic: Comparison Reasoning ("Does end > max_end?")
 * 4. Action: Decision ("KEEP" or "COVERED")
 * 5. Overlay: Context (Depth, Remaining, Call ID)
 *
 * Backend Contract:
 * - step.data.visualization.call_stack_state[] - Extract LAST element (current call)
 * - step.type - Handle non-recursive steps gracefully
 *
 * LSP Migration: Full call stack tree now lives in IntervalCoverageVisualization (LSP)
 * This component shows ONLY the current decision moment in dashboard format.
 */


const IntervalCoverageState = ({ step }) => {
  // Extract call stack - CRITICAL: We only show the CURRENT call (last in stack)
  const callStack = step?.data?.visualization?.call_stack_state || [];
  const currentCall = callStack[callStack.length - 1]; // Active call = last element

  // Early returns for non-recursive step types
  if (step?.type === "INITIAL_STATE") {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm italic text-slate-500">
        Sort intervals first to begin
      </div>
    );
  }

  if (step?.type === "SORT_BEGIN") {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm italic text-slate-500">
        Sorting intervals by (start ↑, end ↓)...
      </div>
    );
  }

  if (step?.type === "SORT_COMPLETE") {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm italic text-slate-500">
        Ready to start recursive filtering
      </div>
    );
  }

  if (step?.type === "ALGORITHM_COMPLETE") {
    const resultData = step?.data?.result || [];
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
        <div className="text-2xl font-bold text-emerald-400">
          🎉 Algorithm Complete!
        </div>
        <div className="text-slate-300">
          Kept {resultData.length} essential intervals
        </div>
      </div>
    );
  }

  // Graceful degradation: no current call
  if (!currentCall) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm italic text-slate-500">
        No active recursive call
      </div>
    );
  }

  // Extract current call data
  const interval = currentCall.current_interval;
  const maxEnd = currentCall.max_end;
  const decision = currentCall.decision;
  const depth = currentCall.depth;
  const remaining = currentCall.remaining_count;
  const callId = currentCall.id;

  // Graceful degradation: no interval data
  if (!interval) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm italic text-slate-500">
        No interval data available
      </div>
    );
  }

  // Get interval color styling
  const intervalColors = getIntervalColor(interval.color);

  // --- ZONE DATA MAPPING ---

  // Zone 1: PRIMARY - Interval Being Examined
  const primaryLabel = "Examining Interval";
  const primaryValue = `[${interval.start}, ${interval.end}]`;
  const primaryMeta = intervalColors.label;
  const Z1_LONG_TEXT = 4;


  // Zone 2: GOAL - Coverage Tracker
  const goalLabel = "Max End";
  const goalValue = maxEnd === null || maxEnd === -Infinity ? "-∞" : maxEnd;

  // Zone 3: LOGIC - Comparison
  let logicText = "COMPARING";
  let logicSub = "Checking coverage...";
  let logicColor = "text-white";

  const Z3_LONG_TEXT = 5
  const Z3_LONGSUBTEXT = 8

  if (decision) {
    const maxEndDisplay =
      maxEnd === null || maxEnd === -Infinity ? "-∞" : maxEnd;
    if (decision === "keep") {
      logicText = `${interval.end} > ${maxEndDisplay}`;
      logicSub = "Extends Coverage";
      logicColor = "text-emerald-300";
    } else {
      logicText = `${interval.end} ≤ ${maxEndDisplay}`;
      logicSub = "Already Covered";
      logicColor = "text-red-300";
    }
  }

  // Zone 4: ACTION - Decision
  let actionText = "EVALUATING...";
  let actionColor = "text-slate-300";

  if (decision === "keep") {
    actionText = "✅ KEEP INTERVAL";
    actionColor = "text-emerald-200";
  } else if (decision === "covered") {
    actionText = "❌ DISCARD (COVERED)";
    actionColor = "text-red-200";
  }

  // Zone 5: OVERLAY - Context (Depth, Remaining, Call ID)
  const overlay1Label = "Depth";
  const overlay1Value = depth ?? 0;
  const overlay2Label = "Remaining";
  const overlay2Value = remaining ?? 0;
  const overlay3Label = "Call";
  const overlay3Value = `#${callId}`;

  return (
    <div className="dashboard">
      {/* ZONE 1: PRIMARY FOCUS (Interval Being Examined) */}
      <div className="zone zone-primary">
        <div className="zone-label">{primaryLabel}</div>
        <div className="zone-meta">{primaryMeta}</div>
        <div
          className={`primary-value ${
            // Reduce font size for long text
            typeof primaryValue === "string" && primaryValue.length > Z1_LONG_TEXT
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

      {/* ZONE 2: GOAL (Coverage Tracker) */}
      <div className="zone zone-goal">
        <div className="zone-label">{goalLabel}</div>
        <div className="goal-value">{goalValue}</div>
      </div>

      {/* ZONE 3: LOGIC (Comparison Reasoning) */}
      <div className="zone zone-logic">
        <div className="zone-label">LOGIC</div>
        <div className="logic-content">
          <div className={`${logicColor} ${
            // Reduce font size for long text
            typeof logicText === "string" && logicText.length > Z3_LONG_TEXT
              ? "zone3-long-text"
              : ""
            } 
          `}>{logicText}</div>
          <div
            className={`mt-1 text-[12px] font-normal ${logicColor}`}
          >
            {logicSub}
          </div>
        </div>
      </div>

      {/* ZONE 4: ACTION (Decision) */}
      <div className="zone zone-action">
        <div className={`action-text ${actionColor}`}>{actionText}</div>
      </div>
    </div>
  );
};

IntervalCoverageState.propTypes = {
  step: PropTypes.shape({
    type: PropTypes.string,
    data: PropTypes.shape({
      result: PropTypes.array,
      visualization: PropTypes.shape({
        call_stack_state: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            depth: PropTypes.number,
            current_interval: PropTypes.shape({
              id: PropTypes.number,
              start: PropTypes.number,
              end: PropTypes.number,
              color: PropTypes.string,
            }),
            max_end: PropTypes.oneOfType([
              PropTypes.number,
              PropTypes.oneOf([null]),
            ]),
            remaining_count: PropTypes.number,
            decision: PropTypes.string,
          }),
        ),
      }),
    }),
  }).isRequired,
};

export default React.memo(IntervalCoverageState);
