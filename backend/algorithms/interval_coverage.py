# backend/algorithms/interval_coverage.py
"""
Remove Covered Intervals Algorithm with Complete Trace Generation.

This module generates a complete execution trace of the interval coverage
algorithm, allowing the frontend to visualize every step without any
algorithmic logic on its side.

Phase 3 Enhancement: Educational descriptions that explain strategy, not just mechanics.
"""

from typing import List
from dataclasses import dataclass, asdict
import time


@dataclass
class Interval:
    """Represents a time interval with visual properties."""
    id: int
    start: int
    end: int
    color: str


@dataclass
class TraceStep:
    """A single step in the algorithm execution trace."""
    step: int
    type: str
    timestamp: float
    data: dict
    description: str


class IntervalCoverageTracer:
    """
    Remove covered intervals algorithm with complete trace generation.

    Philosophy: Backend does ALL computation, frontend just displays.
    Every decision, comparison, and state change is recorded.
    """
    MAX_INTERVALS = 100
    MAX_STEPS = 10000

    def __init__(self):
        self.trace = []
        self.step_count = 0
        self.start_time = time.time()
        self.call_stack = []
        self.next_call_id = 0
        self.original_intervals = []
        self.interval_states = {}

    def _add_step(self, step_type: str, data: dict, description: str):
        """Record a step in the algorithm execution with complete visual state."""
        if self.step_count >= self.MAX_STEPS:
            raise RuntimeError(
                f"Trace generation aborted: Exceeded maximum of {self.MAX_STEPS} steps. "
                "The input may be too complex or causing an infinite loop."
            )

        enriched_data = {
            **data,
            'all_intervals': self._get_all_intervals_with_state(),
            'call_stack_state': self._get_call_stack_state()
        }

        self.trace.append(TraceStep(
            step=self.step_count,
            type=step_type,
            timestamp=time.time() - self.start_time,
            data=enriched_data,
            description=description
        ))
        self.step_count += 1

    def _serialize_value(self, value):
        """Convert Python values to JSON-safe values."""
        if value == float('-inf'):
            return None
        if value == float('inf'):
            return None
        return value

    def _get_all_intervals_with_state(self):
        """Get all original intervals with their current visual state."""
        return [
            {
                **asdict(interval),
                'visual_state': self.interval_states.get(interval.id, {
                    'is_examining': False,
                    'is_covered': False,
                    'is_kept': False,
                    'in_current_subset': True
                })
            }
            for interval in self.original_intervals
        ]

    def _get_call_stack_state(self):
        """Get complete call stack state for visualization."""
        return [
            {
                'call_id': call['id'],
                'depth': call['depth'],
                'current_interval': asdict(call['current']) if call.get('current') else None,
                'max_end': self._serialize_value(call['max_end']),
                'remaining_count': len(call['remaining']),
                'status': call['status'],
                'decision': call.get('decision'),
                'return_value': [asdict(i) for i in call.get('return_value', [])]
            }
            for call in self.call_stack
        ]

    def _reset_all_visual_states(self):
        """Reset all interval visual states."""
        for interval_id in self.interval_states:
            self.interval_states[interval_id] = {
                'is_examining': False,
                'is_covered': False,
                'is_kept': False,
                'in_current_subset': True
            }

    def _set_visual_state(self, interval_id, **kwargs):
        """Update visual state for a specific interval."""
        if interval_id not in self.interval_states:
            self.interval_states[interval_id] = {
                'is_examining': False,
                'is_covered': False,
                'is_kept': False,
                'in_current_subset': True
            }
        self.interval_states[interval_id].update(kwargs)

    def remove_covered_intervals(self, intervals: List[Interval]) -> dict:
        """
        Main algorithm with complete trace generation.
        """
        if len(intervals) > self.MAX_INTERVALS:
            raise ValueError(
                f"Input validation failed: Too many intervals provided ({len(intervals)}). "
                f"The maximum allowed is {self.MAX_INTERVALS}."
            )

        self.original_intervals = intervals

        for interval in intervals:
            self.interval_states[interval.id] = {
                'is_examining': False,
                'is_covered': False,
                'is_kept': False,
                'in_current_subset': True
            }

        self._add_step(
            "INITIAL_STATE",
            {"intervals": [asdict(i) for i in intervals], "count": len(intervals)},
            "Original unsorted intervals"
        )

        self._add_step(
            "SORT_BEGIN",
            {"description": "Sorting by (start ↑, end ↓)"},
            "Sorting intervals by start time (ascending) breaks ties by preferring longer intervals"
        )

        sorted_intervals = sorted(intervals, key=lambda x: (x.start, -x.end))

        self._add_step(
            "SORT_COMPLETE",
            {"intervals": [asdict(i) for i in sorted_intervals]},
            "✓ Sorted! Now we can use a greedy strategy: process intervals left-to-right, keeping only those that extend our coverage."
        )

        result = self._filter_recursive(sorted_intervals, float('-inf'))

        for interval in result:
            self._set_visual_state(interval.id, is_kept=True)

        self._add_step(
            "ALGORITHM_COMPLETE",
            {
                "result": [asdict(i) for i in result],
                "kept_count": len(result),
                "removed_count": len(intervals) - len(result)
            },
            f"🎉 Algorithm complete! Kept {len(result)} essential intervals, removed {len(intervals) - len(result)} covered intervals."
        )

        return {
            "result": [asdict(i) for i in result],
            "trace": {
                "steps": [asdict(s) for s in self.trace],
                "total_steps": len(self.trace),
                "duration": time.time() - self.start_time
            },
            "metadata": {
                "algorithm": "remove-covered-intervals",
                "input_size": len(intervals),
                "output_size": len(result)
            }
        }

    def _filter_recursive(self, intervals: List[Interval], max_end: float) -> List[Interval]:
        """
        Recursive filtering with complete trace generation.
        """
        if not intervals:
            call_id = self.next_call_id
            self.next_call_id += 1

            self._add_step(
                "BASE_CASE",
                {
                    "call_id": call_id,
                    "max_end": self._serialize_value(max_end),
                    "description": "No intervals remaining - return empty list"
                },
                "Base case: no more intervals to process, return empty result"
            )
            return []

        call_id = self.next_call_id
        self.next_call_id += 1
        depth = len(self.call_stack)

        current = intervals[0]
        remaining = intervals[1:]

        call_info = {
            'id': call_id,
            'depth': depth,
            'current': current,
            'remaining': remaining,
            'max_end': max_end,
            'status': 'examining',
            'decision': None,
            'return_value': []
        }
        self.call_stack.append(call_info)

        self._reset_all_visual_states()
        self._set_visual_state(current.id, is_examining=True, in_current_subset=True)

        for interval in remaining:
            self._set_visual_state(interval.id, in_current_subset=True)

        self._add_step(
            "CALL_START",
            {
                "call_id": call_id,
                "depth": depth,
                "examining": asdict(current),
                "max_end": self._serialize_value(max_end),
                "remaining_count": len(remaining),
                "intervals": [asdict(i) for i in intervals]
            },
            f"New recursive call (depth {depth}): examining interval ({current.start}, {current.end}) with {len(remaining)} remaining"
        )

        max_end_display = f"{max_end}" if max_end != float('-inf') else "-∞ (no coverage yet)"
        self._add_step(
            "EXAMINING_INTERVAL",
            {
                "call_id": call_id,
                "interval": asdict(current),
                "max_end": self._serialize_value(max_end),
                "comparison": f"{current.end} vs {max_end if max_end != float('-inf') else 'None'}"
            },
            f"Does interval ({current.start}, {current.end}) extend beyond max_end={max_end_display}? If yes, we KEEP it; if no, it's COVERED."
        )

        is_covered = current.end <= max_end
        decision = "covered" if is_covered else "keep"

        call_info['status'] = 'decided'
        call_info['decision'] = decision

        if is_covered:
            self._set_visual_state(current.id, is_covered=True, is_examining=False)
        else:
            self._set_visual_state(current.id, is_examining=False)

        # PHASE 3: Enhanced decision explanation
        if is_covered:
            explanation = (
                f"❌ COVERED: end={current.end} ≤ max_end={max_end if max_end != float('-inf') else '-∞'} "
                f"— an earlier interval already covers this range, so we can skip it safely."
            )
        else:
            explanation = (
                f"✅ KEEP: end={current.end} > max_end={max_end if max_end != float('-inf') else '-∞'} "
                f"— this interval extends our coverage, so we must keep it."
            )

        self._add_step(
            "DECISION_MADE",
            {
                "call_id": call_id,
                "interval": asdict(current),
                "decision": decision,
                "reason": f"end={current.end} {'<=' if is_covered else '>'} max_end={max_end if max_end != float('-inf') else 'None'}",
                "will_keep": not is_covered
            },
            explanation
        )

        if not is_covered:
            new_max_end = max(max_end, current.end)
            old_display = f"{max_end}" if max_end != float('-inf') else "-∞"

            self._add_step(
                "MAX_END_UPDATE",
                {
                    "call_id": call_id,
                    "interval": asdict(current),
                    "old_max_end": self._serialize_value(max_end),
                    "new_max_end": new_max_end
                },
                f"Coverage extended: max_end updated from {old_display} → {new_max_end} (now we can skip intervals ending ≤ {new_max_end})"
            )

            rest = self._filter_recursive(remaining, new_max_end)
            result = [current] + rest
        else:
            result = self._filter_recursive(remaining, max_end)

        call_info['status'] = 'returning'
        call_info['return_value'] = result

        self._add_step(
            "CALL_RETURN",
            {
                "call_id": call_id,
                "depth": depth,
                "return_value": [asdict(i) for i in result],
                "kept_count": len(result)
            },
            f"↩️ Returning from call #{call_id}: kept {len(result)} interval(s) from this branch"
        )

        self.call_stack.pop()
        return result


# Standalone test/demo
if __name__ == "__main__":
    print("=" * 60)
    print("Testing Interval Coverage Tracer")
    print("=" * 60)

    test_intervals = [
        Interval(1, 540, 660, "blue"),
        Interval(2, 600, 720, "green"),
        Interval(3, 540, 720, "amber"),
        Interval(4, 900, 960, "purple")
    ]

    print(f"\nInput: {len(test_intervals)} intervals")
    for interval in test_intervals:
        print(f"  [{interval.start}, {interval.end}] (id={interval.id})")

    tracer = IntervalCoverageTracer()
    result = tracer.remove_covered_intervals(test_intervals)

    print(f"\n✓ Result: {len(result['result'])} intervals kept")
    print(f"✓ Trace: {result['trace']['total_steps']} steps recorded")
    print(f"✓ Duration: {result['trace']['duration']:.4f}s")

    print("\nFirst 5 steps:")
    for step in result['trace']['steps'][:5]:
        print(f"  {step['step']}: {step['type']}")
        print(f"     {step['description']}")

    print("\nKept intervals:")
    for interval in result['result']:
        print(f"  [{interval['start']}, {interval['end']}] (id={interval['id']})")

    print("\n" + "=" * 60)