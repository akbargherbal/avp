# backend/algorithms/interval_coverage.py
"""
Remove Covered Intervals Algorithm with Complete Trace Generation.

This module generates a complete execution trace of the interval coverage
algorithm, allowing the frontend to visualize every step without any
algorithmic logic on its side.

Phase 2 Refactor: Now inherits from AlgorithmTracer for consistency.
Phase 3 Enhancement: Educational descriptions that explain strategy, not just mechanics.
Session 18 Refactor: Backend Compliance Checklist fixes applied.
"""

from typing import List, Dict, Any
from dataclasses import dataclass, asdict
from .base_tracer import AlgorithmTracer


@dataclass
class Interval:
    """Represents a time interval with visual properties."""
    id: int
    start: int
    end: int
    color: str


class IntervalCoverageTracer(AlgorithmTracer):
    """
    Remove covered intervals algorithm with complete trace generation.

    Philosophy: Backend does ALL computation, frontend just displays.
    Every decision, comparison, and state change is recorded.
    """
    MAX_INTERVALS = 100

    def __init__(self):
        super().__init__()
        self.call_stack = []
        self.next_call_id = 0
        self.original_intervals = []
        self.interval_states = {}

    def execute(self, input_data: dict) -> dict:
        """
        Main algorithm entry point - removes covered intervals from input.

        Args:
            input_data: {
                "intervals": [
                    {"id": int, "start": int, "end": int, "color": str},
                    ...
                ]
            }

        Returns:
            Standardized trace result with kept intervals
        """
        # Parse input
        intervals_data = input_data.get('intervals', [])

        if len(intervals_data) > self.MAX_INTERVALS:
            raise ValueError(
                f"Input validation failed: Too many intervals provided ({len(intervals_data)}). "
                f"The maximum allowed is {self.MAX_INTERVALS}."
            )

        # Convert to Interval objects
        intervals = [
            Interval(
                id=i['id'],
                start=i['start'],
                end=i['end'],
                color=i['color']
            )
            for i in intervals_data
        ]

        self.original_intervals = intervals

        # Initialize visual states
        for interval in intervals:
            self.interval_states[interval.id] = {
                'is_examining': False,
                'is_covered': False,
                'is_kept': False,
                'in_current_subset': True
            }

        # Set metadata for frontend (COMPLIANCE FIX: Added display_name)
        self.metadata = {
            'algorithm': 'interval-coverage',
            'display_name': 'Interval Coverage',  # ✅ FIXED: Added required field
            'visualization_type': 'timeline',
            'input_size': len(intervals),
            'visualization_config': {
                'show_call_stack': True,
                'highlight_examining': True,
                'color_by_state': True
            }
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

        # Mark kept intervals
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

        # Update metadata with final stats
        self.metadata['output_size'] = len(result)

        # Use base class helper to build standardized result
        return self._build_trace_result([asdict(i) for i in result])

    def _get_visualization_state(self) -> dict:
        """
        Hook: Return current visualization state for automatic enrichment.

        This is called by _add_step() to enrich each step with the current
        visual state of all intervals and the call stack.
        """
        return {
            'all_intervals': self._get_all_intervals_with_state(),
            'call_stack_state': self._get_call_stack_state()
        }

    def get_prediction_points(self) -> List[Dict[str, Any]]:
        """
        Identify prediction moments in the trace.
        Finds all EXAMINING_INTERVAL steps and creates prediction questions
        about whether the interval will be kept or covered.

        Returns predictions in standardized format matching binary_search.py:
        {
            'step_index': int,
            'question': str,
            'choices': [{'id': str, 'label': str}, ...],
            'hint': str,
            'correct_answer': str,
            'explanation': str (optional)
        }
        """
        predictions = []
        for i, step in enumerate(self.trace):
            if step.type == "EXAMINING_INTERVAL":
                # Look ahead to find the decision
                if i + 1 < len(self.trace):
                    decision_step = self.trace[i + 1]
                    if decision_step.type == "DECISION_MADE":
                        interval_data = step.data.get('interval', {})
                        decision = decision_step.data.get('decision')
                        start = interval_data.get('start')
                        end = interval_data.get('end')

                        predictions.append({
                            'step_index': i,
                            'question': f"Will interval ({start}, {end}) be kept or covered?",
                            'choices': [
                                {
                                    'id': 'keep',
                                    'label': 'Keep this interval'
                                },
                                {
                                    'id': 'covered',
                                    'label': 'Covered by previous'
                                }
                            ],
                            'hint': f"Compare interval.end ({end}) with max_end",
                            'correct_answer': decision,
                            'explanation': (
                                f"Interval ({start}, {end}) was {decision}." if decision == 'keep'
                                else f"Interval ({start}, {end}) is covered by a previous interval."
                            )
                        })
        return predictions

    def _get_interval_state_string(self, interval_id: int) -> str:
        """
        Convert internal visual state dict to single state string for frontend.
        
        COMPLIANCE FIX: Frontend expects 'state' as string, not nested dict.
        
        Args:
            interval_id: Interval ID to get state for
            
        Returns:
            State string: "examining" | "covered" | "kept" | "active"
        """
        state = self.interval_states.get(interval_id, {})
        
        # Priority order: examining > covered > kept > active
        if state.get('is_examining'):
            return 'examining'
        elif state.get('is_covered'):
            return 'covered'
        elif state.get('is_kept'):
            return 'kept'
        else:
            return 'active'

    def _get_all_intervals_with_state(self):
        """
        Get all original intervals with their current visual state.
        
        COMPLIANCE FIX: Returns 'state' (string) instead of 'visual_state' (dict).
        """
        return [
            {
                **asdict(interval),
                'state': self._get_interval_state_string(interval.id)  # ✅ FIXED: state string
            }
            for interval in self.original_intervals
        ]

    def _get_call_stack_state(self):
        """
        Get complete call stack state for visualization.
        
        COMPLIANCE FIXES:
        - Renamed 'call_id' to 'id'
        - Added 'is_active' boolean field
        """
        return [
            {
                'id': call['id'],  # ✅ FIXED: Renamed from 'call_id'
                'is_active': call['status'] == 'examining',  # ✅ FIXED: Added required field
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
        """
        Reset transient visual states (examining, in_current_subset).
        
        IMPORTANT: DO NOT reset is_covered or is_kept - these are permanent decisions
        that must persist for the rest of the algorithm execution.
        
        BUG FIX (Session 23): Previously reset ALL states including is_covered,
        causing covered intervals to flash gray then revert to original color.
        """
        for interval_id in self.interval_states:
            # Only reset transient states
            self.interval_states[interval_id]['is_examining'] = False
            self.interval_states[interval_id]['in_current_subset'] = True
            # Keep is_covered and is_kept intact - they represent final decisions


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

    def _filter_recursive(self, intervals: List[Interval], max_end: float) -> List[Interval]:
        """
        Recursive filtering with complete trace generation.

        Note: No longer manually enriches data in _add_step() calls because
        _get_visualization_state() handles it automatically.
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
    import sys
    from pathlib import Path

    # Add parent directory to path for imports when running standalone
    sys.path.insert(0, str(Path(__file__).parent.parent))
    
    # Import with absolute path when running as script
    from algorithms.base_tracer import AlgorithmTracer

    print("=" * 60)
    print("Testing Interval Coverage Tracer (Compliance Refactor)")
    print("=" * 60)

    test_input = {
        "intervals": [
            {"id": 1, "start": 540, "end": 660, "color": "blue"},
            {"id": 2, "start": 600, "end": 720, "color": "green"},
            {"id": 3, "start": 540, "end": 720, "color": "amber"},
            {"id": 4, "start": 900, "end": 960, "color": "purple"}
        ]
    }

    print(f"\nInput: {len(test_input['intervals'])} intervals")
    for interval in test_input['intervals']:
        print(f"  [{interval['start']}, {interval['end']}] (id={interval['id']})")

    tracer = IntervalCoverageTracer()
    result = tracer.execute(test_input)

    print(f"\n✓ Result: {len(result['result'])} intervals kept")
    print(f"✓ Trace: {result['trace']['total_steps']} steps recorded")
    print(f"✓ Duration: {result['trace']['duration']:.4f}s")
    print(f"✓ Predictions: {len(result['metadata']['prediction_points'])} points identified")

    print("\nFirst 5 steps:")
    for step in result['trace']['steps'][:5]:
        print(f"  {step['step']}: {step['type']}")
        print(f"     {step['description']}")

    print("\nKept intervals:")
    for interval in result['result']:
        print(f"  [{interval['start']}, {interval['end']}] (id={interval['id']})")

    print("\nPrediction points:")
    for pred in result['metadata']['prediction_points'][:3]:
        print(f"  Step {pred['step_index']}: {pred['question']}")
        print(f"    Answer: {pred['correct_answer']}")
    
    # COMPLIANCE VERIFICATION
    print("\n" + "=" * 60)
    print("COMPLIANCE VERIFICATION")
    print("=" * 60)
    
    # Check metadata
    print("\n✓ Metadata compliance:")
    print(f"  algorithm: {result['metadata']['algorithm']}")
    print(f"  display_name: {result['metadata']['display_name']}")  # NEW
    print(f"  visualization_type: {result['metadata']['visualization_type']}")
    print(f"  input_size: {result['metadata']['input_size']}")
    
    # Check visualization state structure
    print("\n✓ Visualization state compliance:")
    first_step = result['trace']['steps'][0]
    if 'visualization' in first_step['data']:
        viz = first_step['data']['visualization']
        if 'all_intervals' in viz and len(viz['all_intervals']) > 0:
            sample_interval = viz['all_intervals'][0]
            print(f"  Interval has 'state' field: {'state' in sample_interval}")
            print(f"  Sample state value: {sample_interval.get('state', 'MISSING')}")
        
        if 'call_stack_state' in viz and len(viz['call_stack_state']) > 0:
            sample_frame = viz['call_stack_state'][0]
            print(f"  Frame has 'id' field: {'id' in sample_frame}")
            print(f"  Frame has 'is_active' field: {'is_active' in sample_frame}")

    print("\n" + "=" * 60)