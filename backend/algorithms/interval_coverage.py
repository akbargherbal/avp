# backend/algorithms/interval_coverage.py
"""
Remove Covered Intervals Algorithm with Complete Trace Generation.

This module generates a complete execution trace of the interval coverage
algorithm, allowing the frontend to visualize every step without any
algorithmic logic on its side.
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
    
    def __init__(self):
        self.trace = []
        self.step_count = 0
        self.start_time = time.time()
        self.call_stack = []
        self.next_call_id = 0
        self.original_intervals = []  # Keep reference to ALL intervals
        self.interval_states = {}  # Track visual state of each interval
        
    def _add_step(self, step_type: str, data: dict, description: str):
        """Record a step in the algorithm execution with complete visual state."""
        # Enrich data with full visual state for ALL intervals
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
        
        Args:
            intervals: List of Interval objects to process
            
        Returns:
            dict containing:
                - result: List of kept intervals
                - trace: Complete execution trace with all steps
                - metadata: Algorithm metadata
        """
        # Store original intervals
        self.original_intervals = intervals
        
        # Initialize visual states
        for interval in intervals:
            self.interval_states[interval.id] = {
                'is_examining': False,
                'is_covered': False,
                'is_kept': False,
                'in_current_subset': True
            }
        
        # Step 0: Initial state
        self._add_step(
            "INITIAL_STATE",
            {
                "intervals": [asdict(i) for i in intervals],
                "count": len(intervals)
            },
            "Original unsorted intervals"
        )
        
        # Step 1: Sort
        self._add_step(
            "SORT_BEGIN",
            {"description": "Sorting by (start ↑, end ↓)"},
            "Preparing to sort intervals"
        )
        
        sorted_intervals = sorted(intervals, key=lambda x: (x.start, -x.end))
        
        self._add_step(
            "SORT_COMPLETE",
            {"intervals": [asdict(i) for i in sorted_intervals]},
            "Intervals sorted - ready for recursion"
        )
        
        # Step 2: Recursive filtering
        result = self._filter_recursive(sorted_intervals, float('-inf'))
        
        # Mark all kept intervals
        for interval in result:
            self._set_visual_state(interval.id, is_kept=True)
        
        # Final step
        self._add_step(
            "ALGORITHM_COMPLETE",
            {
                "result": [asdict(i) for i in result],
                "kept_count": len(result),
                "removed_count": len(intervals) - len(result)
            },
            f"Algorithm complete: kept {len(result)}/{len(intervals)} intervals"
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
        
        Every recursive call, comparison, and decision is traced.
        """
        # Base case
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
                "Base case reached"
            )
            return []
        
        # Start new recursive call
        call_id = self.next_call_id
        self.next_call_id += 1
        depth = len(self.call_stack)
        
        current = intervals[0]
        remaining = intervals[1:]
        
        # Add to call stack
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
        
        # Mark current interval as examining
        self._reset_all_visual_states()
        self._set_visual_state(current.id, is_examining=True, in_current_subset=True)
        
        # Mark remaining intervals as in current subset
        for interval in remaining:
            self._set_visual_state(interval.id, in_current_subset=True)
        
        # Trace: Call start
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
            f"Call #{call_id}: examining interval ({current.start}, {current.end})"
        )
        
        # Trace: Examining interval
        self._add_step(
            "EXAMINING_INTERVAL",
            {
                "call_id": call_id,
                "interval": asdict(current),
                "max_end": self._serialize_value(max_end),
                "comparison": f"{current.end} vs {max_end if max_end != float('-inf') else 'None'}"
            },
            f"Comparing interval end ({current.end}) with max_end"
        )
        
        # Make decision: Keep or covered?
        is_covered = current.end <= max_end
        decision = "covered" if is_covered else "keep"
        
        # Update call info
        call_info['status'] = 'decided'
        call_info['decision'] = decision
        
        # Update visual state based on decision
        if is_covered:
            self._set_visual_state(current.id, is_covered=True, is_examining=False)
        else:
            self._set_visual_state(current.id, is_examining=False)
        
        # Trace: Decision made
        self._add_step(
            "DECISION_MADE",
            {
                "call_id": call_id,
                "interval": asdict(current),
                "decision": decision,
                "reason": f"end={current.end} {'<=' if is_covered else '>'} max_end={max_end if max_end != float('-inf') else 'None'}",
                "will_keep": not is_covered
            },
            f"Decision: {decision.upper()}"
        )
        
        if not is_covered:
            # Keep this interval - update max_end
            new_max_end = max(max_end, current.end)
            
            self._add_step(
                "MAX_END_UPDATE",
                {
                    "call_id": call_id,
                    "interval": asdict(current),
                    "old_max_end": self._serialize_value(max_end),
                    "new_max_end": new_max_end
                },
                f"Updating max_end: {max_end if max_end != float('-inf') else '-∞'} → {new_max_end}"
            )
            
            # Recurse with updated max_end
            rest = self._filter_recursive(remaining, new_max_end)
            result = [current] + rest
        else:
            # Skip this interval (it's covered)
            result = self._filter_recursive(remaining, max_end)
        
        # Update return value in call info
        call_info['status'] = 'returning'
        call_info['return_value'] = result
        
        # Trace: Return from call
        self._add_step(
            "CALL_RETURN",
            {
                "call_id": call_id,
                "depth": depth,
                "return_value": [asdict(i) for i in result],
                "kept_count": len(result)
            },
            f"Call #{call_id} returning {len(result)} interval(s)"
        )
        
        self.call_stack.pop()
        return result


# Standalone test/demo
if __name__ == "__main__":
    print("=" * 60)
    print("Testing Interval Coverage Tracer")
    print("=" * 60)
    
    # Test the tracer
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
        print(f"  {step['step']}: {step['type']} - {step['description']}")
    
    print("\nSample step with visual state (step 5):")
    step_5 = result['trace']['steps'][5]
    print(f"  Type: {step_5['type']}")
    print(f"  All intervals with visual state:")
    for interval in step_5['data']['all_intervals'][:2]:  # Show first 2
        print(f"    ID {interval['id']}: examining={interval['visual_state']['is_examining']}, covered={interval['visual_state']['is_covered']}")
    
    print("\nKept intervals:")
    for interval in result['result']:
        print(f"  [{interval['start']}, {interval['end']}] (id={interval['id']})")
    
    print("\n" + "=" * 60)