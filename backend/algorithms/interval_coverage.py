# backend/algorithms/interval_coverage.py
"""
Remove Covered Intervals Algorithm with Complete Trace Generation.

This module generates a complete execution trace of the interval coverage
algorithm, allowing the frontend to visualize every step without any
algorithmic logic on its side.

Phase 2 Refactor: Now inherits from AlgorithmTracer for consistency.
Phase 3 Enhancement: Educational descriptions that explain strategy, not just mechanics.
Session 18 Refactor: Backend Compliance Checklist fixes applied.
Session 35: Added stub generate_narrative implementation.
Session 37: Complete narrative generation implementation.
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
        self.current_max_end = float('-inf')

    def generate_narrative(self, trace_result: dict) -> str:
        """
        Generate human-readable narrative from Interval Coverage trace.
        
        Shows complete execution flow with recursive call structure,
        decision points, and all comparison data visible.
        Follows BACKEND_CHECKLIST.md v2.0 requirements.
        
        Args:
            trace_result: Complete trace result from execute() method
            
        Returns:
            Markdown-formatted narrative showing step-by-step execution
        """
        metadata = trace_result['metadata']
        steps = trace_result['trace']['steps']
        result = trace_result['result']
        
        # Header
        narrative = "# Interval Coverage Execution Narrative\n\n"
        narrative += f"**Algorithm:** {metadata['display_name']}\n"
        narrative += f"**Input Size:** {metadata['input_size']} intervals\n"
        narrative += f"**Output Size:** {metadata['output_size']} intervals kept\n"
        narrative += f"**Removed:** {metadata['input_size'] - metadata['output_size']} intervals (covered)\n\n"
        
        # Show input intervals
        narrative += "**Input Intervals:**\n```\n"
        if steps and steps[0]['type'] == 'INITIAL_STATE':
            intervals = steps[0]['data']['intervals']
            for interval in intervals:
                narrative += f"Interval {interval['id']}: [{interval['start']:4d}, {interval['end']:4d}] ({interval['color']})\n"
        narrative += "```\n\n"
        
        # Show final result
        narrative += "**Final Result:**\n```\n"
        for interval in result:
            narrative += f"Interval {interval['id']}: [{interval['start']:4d}, {interval['end']:4d}] (KEPT)\n"
        narrative += "```\n\n"
        narrative += "---\n\n"
        
        # Track recursion depth for formatting
        current_depth = 0
        
        # Step-by-step narrative
        for step in steps:
            step_num = step['step']
            step_type = step['type']
            description = step['description']
            data = step['data']
            
            # Adjust indentation based on depth
            indent = ""
            if 'depth' in data:
                current_depth = data['depth']
                indent = "  " * current_depth
            elif 'call_id' in data and step_type not in ['INITIAL_STATE', 'SORT_BEGIN', 'SORT_COMPLETE', 'ALGORITHM_COMPLETE']:
                indent = "  " * current_depth
            
            narrative += f"{indent}## Step {step_num}: {description}\n\n"
            
            # Type-specific details
            if step_type == "INITIAL_STATE":
                count = data['count']
                narrative += f"**Configuration:**\n"
                narrative += f"- Total intervals: {count}\n"
                narrative += f"- Strategy: Greedy recursive filtering\n"
                narrative += f"- Sort order: By start time (ascending), then by end time (descending)\n\n"
            
            elif step_type == "SORT_BEGIN":
                narrative += f"**Sorting Strategy:**\n"
                narrative += f"- Primary key: `start` (ascending) - process left to right\n"
                narrative += f"- Secondary key: `end` (descending) - prefer longer intervals when tied\n\n"
                narrative += f"*Why this order?* Processing left-to-right lets us track coverage with a single `max_end` variable.\n\n"
            
            elif step_type == "SORT_COMPLETE":
                sorted_intervals = data['intervals']
                narrative += f"**Sorted Intervals:**\n```\n"
                for interval in sorted_intervals:
                    narrative += f"Interval {interval['id']}: [{interval['start']:4d}, {interval['end']:4d}]\n"
                narrative += "```\n\n"
                narrative += f"*Now we process these left-to-right, keeping track of how far our coverage extends.*\n\n"
            
            elif step_type == "CALL_START":
                call_id = data['call_id']
                depth = data['depth']
                examining = data['examining']
                max_end_val = data['max_end']
                remaining_count = data['remaining_count']
                
                max_end_display = f"{max_end_val}" if max_end_val != float('-inf') and max_end_val is not None else "-∞"
                
                narrative += f"{indent}**Recursive Call #{call_id}** (Depth {depth})\n\n"
                narrative += f"{indent}**Current State:**\n"
                narrative += f"{indent}- Examining: Interval {examining['id']} [{examining['start']}, {examining['end']}]\n"
                narrative += f"{indent}- Current coverage (max_end): {max_end_display}\n"
                narrative += f"{indent}- Remaining intervals: {remaining_count}\n\n"
            
            elif step_type == "EXAMINING_INTERVAL":
                interval = data['interval']
                max_end_val = data['max_end']
                comparison = data['comparison']
                
                max_end_display = f"{max_end_val}" if max_end_val != float('-inf') and max_end_val is not None else "-∞ (no coverage yet)"
                
                narrative += f"{indent}**Comparison:**\n"
                narrative += f"{indent}- Interval end: `{interval['end']}`\n"
                narrative += f"{indent}- Current max_end: `{max_end_display}`\n"
                narrative += f"{indent}- Question: Does `{interval['end']} > {max_end_display}`?\n\n"
                
                narrative += f"{indent}**Decision Logic:**\n"
                narrative += f"{indent}- If YES: This interval **extends coverage** → KEEP it\n"
                narrative += f"{indent}- If NO: This interval is **already covered** → Skip it\n\n"
            
            elif step_type == "DECISION_MADE":
                interval = data['interval']
                decision = data['decision']
                reason = data['reason']
                will_keep = data['will_keep']
                
                if decision == "covered":
                    narrative += f"{indent}❌ **DECISION: COVERED**\n\n"
                    narrative += f"{indent}**Reason:** `{reason}`\n"
                    narrative += f"{indent}- Interval {interval['id']} [{interval['start']}, {interval['end']}] is completely covered\n"
                    narrative += f"{indent}- An earlier interval already extends to {interval['end']} or beyond\n"
                    narrative += f"{indent}- Action: Skip this interval, continue with same max_end\n\n"
                else:
                    narrative += f"{indent}✅ **DECISION: KEEP**\n\n"
                    narrative += f"{indent}**Reason:** `{reason}`\n"
                    narrative += f"{indent}- Interval {interval['id']} [{interval['start']}, {interval['end']}] extends our coverage\n"
                    narrative += f"{indent}- It reaches beyond our current max_end\n"
                    narrative += f"{indent}- Action: Keep this interval, update max_end\n\n"
            
            elif step_type == "MAX_END_UPDATE":
                interval = data['interval']
                old_max_end = data['old_max_end']
                new_max_end = data['new_max_end']
                
                old_display = f"{old_max_end}" if old_max_end != float('-inf') and old_max_end is not None else "-∞"
                
                narrative += f"{indent}📊 **Coverage Extended**\n\n"
                narrative += f"{indent}**Update:**\n"
                narrative += f"{indent}- Previous max_end: `{old_display}`\n"
                narrative += f"{indent}- New max_end: `{new_max_end}` (from interval {interval['id']})\n"
                narrative += f"{indent}- Impact: Any interval ending ≤ {new_max_end} will now be considered covered\n\n"
            
            elif step_type == "BASE_CASE":
                call_id = data['call_id']
                max_end_val = data['max_end']
                
                max_end_display = f"{max_end_val}" if max_end_val != float('-inf') and max_end_val is not None else "-∞"
                
                narrative += f"{indent}**Base Case Reached** (Call #{call_id})\n\n"
                narrative += f"{indent}- No more intervals to process\n"
                narrative += f"{indent}- Final max_end for this branch: {max_end_display}\n"
                narrative += f"{indent}- Return: Empty list `[]`\n\n"
            
            elif step_type == "CALL_RETURN":
                call_id = data['call_id']
                depth = data['depth']
                return_value = data['return_value']
                kept_count = data['kept_count']
                
                narrative += f"{indent}↩️ **Return from Call #{call_id}**\n\n"
                narrative += f"{indent}**Results:**\n"
                narrative += f"{indent}- Depth: {depth}\n"
                narrative += f"{indent}- Intervals kept: {kept_count}\n"
                
                if return_value:
                    narrative += f"{indent}- Kept intervals: "
                    interval_ids = [str(iv['id']) for iv in return_value]
                    narrative += ", ".join(f"#{id}" for id in interval_ids) + "\n\n"
                else:
                    narrative += f"{indent}- Kept intervals: (none)\n\n"
            
            elif step_type == "ALGORITHM_COMPLETE":
                result_data = data['result']
                kept_count = data['kept_count']
                removed_count = data['removed_count']
                
                narrative += f"🎉 **Algorithm Complete!**\n\n"
                narrative += f"**Summary:**\n"
                narrative += f"- Total intervals processed: {kept_count + removed_count}\n"
                narrative += f"- Intervals kept: **{kept_count}**\n"
                narrative += f"- Intervals removed (covered): {removed_count}\n\n"
                
                narrative += f"**Final Kept Intervals:**\n```\n"
                for interval in result_data:
                    narrative += f"Interval {interval['id']}: [{interval['start']:4d}, {interval['end']:4d}]\n"
                narrative += "```\n\n"
            
            narrative += "---\n\n"
        
        # Execution Summary
        narrative += "## Execution Summary\n\n"
        
        narrative += f"**Algorithm Strategy:**\n"
        narrative += f"1. Sort intervals by start time (ascending), breaking ties by end time (descending)\n"
        narrative += f"2. Process intervals left-to-right using recursive filtering\n"
        narrative += f"3. Track coverage with `max_end` variable\n"
        narrative += f"4. Keep intervals that extend coverage, skip those already covered\n\n"
        
        narrative += f"**Performance:**\n"
        narrative += f"- Input: {metadata['input_size']} intervals\n"
        narrative += f"- Output: {metadata['output_size']} intervals\n"
        narrative += f"- Reduction: {metadata['input_size'] - metadata['output_size']} intervals removed\n"
        narrative += f"- Time Complexity: O(n log n) for sorting + O(n) for filtering = **O(n log n)**\n"
        narrative += f"- Space Complexity: O(n) for recursion stack\n\n"
        
        narrative += f"**Key Insight:**\n"
        narrative += f"By processing sorted intervals left-to-right and tracking the rightmost coverage point (max_end), "
        narrative += f"we can identify covered intervals in a single pass. An interval is covered if its end point "
        narrative += f"doesn't extend beyond the current coverage (interval.end ≤ max_end).\n\n"
        
        return narrative

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
        """
        return {
            'all_intervals': self._get_all_intervals_with_state(),
            'call_stack_state': self._get_call_stack_state(),
            'max_end': self._serialize_value(self.current_max_end)  # ✅ ADD THIS LINE
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
        self.current_max_end = max_end
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

            self.current_max_end = new_max_end
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