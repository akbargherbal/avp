import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronRight } from "lucide-react";
import { getIntervalColor } from "../../constants/intervalColors";

const IntervalCoverageState = ({ step, activeCallRef, onIntervalHover, currentStep }) => {
  // FIXED: Updated to use new standardized path (step.data.visualization.call_stack_state)
  const callStack = step?.data?.visualization?.call_stack_state || [];

  // FIXED (Session 21): Use currentStep as dependency instead of callStack
  useEffect(() => {
    if (activeCallRef?.current) {
      activeCallRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentStep, activeCallRef]);

  if (callStack.length === 0) {
    return (
      <div className="text-slate-500 text-sm italic">
        {step?.type === "INITIAL_STATE" && "Sort intervals first to begin"}
        {step?.type === "SORT_BEGIN" && "Sorting intervals..."}
        {step?.type === "SORT_COMPLETE" && "Ready to start recursion"}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {callStack.map((call, idx) => {
        if (!call) return null;

        const isActive = idx === callStack.length - 1;
        const currentInterval = call.current_interval;

        if (!currentInterval) return null;

        // Use the utility function for color mapping
        const intervalColors = getIntervalColor(currentInterval.color);

        return (
          <div
            key={call.call_id || idx}
            // FIXED: Add id="step-current" for the active call
            id={isActive ? "step-current" : undefined}
            ref={isActive ? activeCallRef : null}
            className={`p-3 rounded-lg border-2 transition-all ${
              isActive
                ? "border-yellow-400 bg-yellow-900/20 shadow-lg"
                : call.status === "returning"
                ? "border-emerald-400 bg-emerald-900/20"
                : "border-slate-600 bg-slate-800/50"
            }`}
            style={{ marginLeft: `${(call.depth || 0) * 24}px` }}
            onMouseEnter={() => onIntervalHover?.(currentInterval.id)}
            onMouseLeave={() => onIntervalHover?.(null)}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="text-slate-400 text-xs font-mono">
                CALL #{call.call_id || idx}
              </div>
              <ChevronRight size={12} className="text-slate-500" />
              <div className="text-white text-xs font-mono">
                depth={call.depth || 0}, remaining={call.remaining_count || 0}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="text-slate-400 text-xs">Examining:</div>
              <div
                className={`px-2 py-1 rounded text-xs font-bold ${intervalColors.bg} ${intervalColors.text}`}
              >
                ({currentInterval.start || 0}, {currentInterval.end || 0})
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="text-slate-400 text-xs">max_end_so_far:</div>
              <div className="text-cyan-400 text-xs font-mono font-bold">
                {call.max_end === null || call.max_end === undefined
                  ? "-∞"
                  : call.max_end}
              </div>
            </div>

            {call.decision && (
              <div
                className={`flex items-center gap-2 p-2 rounded ${
                  call.decision === "keep"
                    ? "bg-emerald-900/30 border border-emerald-500"
                    : "bg-red-900/30 border border-red-500"
                }`}
              >
                <div className="text-xs font-bold">
                  {call.decision === "keep" ? "✅ KEEP" : "❌ COVERED"}
                </div>
                <div className="text-xs text-slate-300">
                  {currentInterval.end || 0}{" "}
                  {call.decision === "keep" ? ">" : "≤"}{" "}
                  {call.max_end === null ? "-∞" : call.max_end}
                </div>
              </div>
            )}

            {call.return_value && call.return_value.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-600">
                <div className="text-slate-400 text-xs mb-1">↩️ RETURN:</div>
                <div className="flex flex-wrap gap-1">
                  {call.return_value.length === 0 ? (
                    <div className="text-slate-500 text-xs italic">[]</div>
                  ) : (
                    call.return_value.map((interval, idx) => {
                      if (!interval) return null;

                      const returnIntervalColors = getIntervalColor(
                        interval.color
                      );

                      return (
                        <div
                          key={idx}
                          className={`${returnIntervalColors.bg} ${returnIntervalColors.text} px-2 py-1 rounded text-xs`}
                        >
                          ({interval.start || 0},{interval.end || 0})
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

IntervalCoverageState.propTypes = {
  step: PropTypes.object,
  activeCallRef: PropTypes.object,
  onIntervalHover: PropTypes.func.isRequired,
  currentStep: PropTypes.number,
};

export default React.memo(IntervalCoverageState);