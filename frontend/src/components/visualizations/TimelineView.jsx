import React from "react";
import PropTypes from "prop-types";
import { getIntervalColor } from "../../constants/intervalColors";

const TimelineView = ({ step, highlightedIntervalId, onIntervalHover }) => {
  const allIntervals = step?.data?.all_intervals || [];
  const maxEnd = step?.data?.max_end;

  const minVal = 500;
  const maxVal = 1000;
  const toPercent = (val) => ((val - minVal) / (maxVal - minVal)) * 100;

  // Check if any interval is highlighted
  const hasHighlight = highlightedIntervalId !== null;

  return (
    <div className="relative h-full flex flex-col">
      <div className="relative flex-1 bg-slate-900/50 rounded-lg p-4">
        <div className="absolute bottom-6 left-4 right-4 h-0.5 bg-slate-600"></div>

        <div className="absolute bottom-1 left-4 text-slate-400 text-xs">
          {minVal}
        </div>
        <div className="absolute bottom-1 left-1/3 text-slate-400 text-xs">
          700
        </div>
        <div className="absolute bottom-1 left-2/3 text-slate-400 text-xs">
          850
        </div>
        <div className="absolute bottom-1 right-4 text-slate-400 text-xs">
          {maxVal}
        </div>

        {maxEnd !== undefined && maxEnd !== null && (
          <div
            className="absolute top-4 bottom-6 w-0.5 bg-cyan-400 z-10"
            style={{ left: `${4 + toPercent(maxEnd) * 0.92}%` }}
          >
            <div className="absolute -top-3 -left-10 bg-teal-400 text-black text-xs px-2 py-1 rounded font-bold whitespace-nowrap drop-shadow-sm">
              max_end: {maxEnd}
            </div>
          </div>
        )}

        {allIntervals.map((interval, idx) => {
          if (
            !interval ||
            typeof interval.start !== "number" ||
            typeof interval.end !== "number"
          ) {
            return null;
          }

          const left = toPercent(interval.start);
          const width = toPercent(interval.end) - toPercent(interval.start);
          const colors = getIntervalColor(interval.color);

          const visualState = interval.visual_state || {};
          const isExamining = visualState.is_examining || false;
          const isCovered = visualState.is_covered || false;
          const isKept = visualState.is_kept || false;

          // Check if this interval is currently highlighted
          const isHighlighted = interval.id === highlightedIntervalId;
          const isDimmed = hasHighlight && !isHighlighted;

          let additionalClasses = "transition-all duration-300";

          // Highlighting takes precedence over examining state
          if (isHighlighted) {
            additionalClasses +=
              " ring-4 ring-yellow-400 scale-110 z-30 shadow-[0_0_20px_8px_rgba(250,204,21,0.5)]";
          } else if (isDimmed) {
            additionalClasses += " opacity-40";
          } else if (isExamining) {
            additionalClasses +=
              " border-4 border-yellow-300 scale-105 shadow-[0_0_15px_5px_rgba(234,179,8,0.6)] z-20";
          }

          if (isCovered) {
            additionalClasses += " line-through";
          }

          if (isKept && !isHighlighted) {
            additionalClasses += " shadow-lg shadow-emerald-500/50";
          }

          return (
            <div
              key={interval.id || idx}
              className={`absolute h-10 ${colors.bg} rounded border-2 ${colors.border} flex items-center justify-center text-white text-sm font-bold ${additionalClasses}`}
              style={{
                left: `${4 + left * 0.92}%`,
                width: `${width * 0.92}%`,
                top: `${4 + idx * 48}px`,
              }}
              onMouseEnter={() => onIntervalHover?.(interval.id)}
              onMouseLeave={() => onIntervalHover?.(null)}
            >
              {interval.start}-{interval.end}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 bg-cyan-400 rounded"></div>
          <span className="text-slate-400">max_end line</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 bg-yellow-400 rounded ring-2 ring-yellow-400"></div>
          <span className="text-slate-400">highlighted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 bg-yellow-400 rounded border-2 border-yellow-300"></div>
          <span className="text-slate-400">examining</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 bg-slate-500 opacity-30 rounded line-through"></div>
          <span className="text-slate-400">covered (skipped)</span>
        </div>
      </div>
    </div>
  );
};

TimelineView.propTypes = {
  step: PropTypes.shape({
    data: PropTypes.shape({
      all_intervals: PropTypes.arrayOf(PropTypes.object),
      max_end: PropTypes.number,
    }),
  }),
  highlightedIntervalId: PropTypes.number,
  onIntervalHover: PropTypes.func.isRequired,
};

export default React.memo(TimelineView);
