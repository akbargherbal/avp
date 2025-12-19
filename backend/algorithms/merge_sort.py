"""
Merge Sort Algorithm Tracer for Educational Visualization.

Implements recursive divide-and-conquer sorting with complete trace generation
for step-by-step visualization showing splits, comparisons, and merges.

VERSION: 1.0 - Backend Checklist v2.2 Compliance
- Timeline visualization for recursive structure
- Complete narrative generation with arithmetic verification
- Frontend visualization hints included
- Algorithm info file integration
"""

from typing import Any, List, Dict
from .base_tracer import AlgorithmTracer


class MergeSortTracer(AlgorithmTracer):
    """
    Tracer for Merge Sort algorithm using divide-and-conquer strategy.

    Visualization shows:
    - Timeline structure displaying recursion tree
    - Array splits at each recursion level
    - Merge operations with comparison decisions
    - Depth tracking for visual hierarchy

    Prediction points ask: "Which element will be selected first in this merge?"
    """

    def __init__(self):
        super().__init__()
        self.original_array = []
        self.call_stack = []
        self.next_call_id = 0
        self.comparison_count = 0
        self.merge_count = 0

    def _get_visualization_state(self) -> dict:
        """
        Return current visualization state for timeline rendering.

        Timeline structure shows:
        - all_intervals: Array segments being processed (colored by depth)
        - call_stack_state: Active recursive calls with depth info
        """
        # Build intervals representing array segments at each recursion level
        intervals = []
        for call in self.call_stack:
            if call['array']:
                intervals.append({
                    'id': f"call_{call['id']}",
                    'start': call['start_index'],
                    'end': call['end_index'],
                    'color': self._get_depth_color(call['depth']),
                    'state': call['status'],
                    'label': f"[{call['start_index']}:{call['end_index']}]"
                })

        # Build call stack state
        call_stack_state = [
            {
                'id': f"call_{call['id']}",
                'is_active': call['status'] in ['splitting', 'merging'],
                'depth': call['depth'],
                'operation': call['operation'],
                'array': call['array']
            }
            for call in self.call_stack
        ]

        return {
            'all_intervals': intervals,
            'call_stack_state': call_stack_state,
            'comparison_count': self.comparison_count,
            'merge_count': self.merge_count
        }

    def _get_depth_color(self, depth: int) -> str:
        """Assign colors to recursion depths for visualization."""
        colors = ['blue', 'green', 'amber', 'purple', 'red', 'orange', 'pink', 'cyan']
        return colors[depth % len(colors)]

    def generate_narrative(self, trace_result: dict) -> str:
        """
        Generate human-readable narrative from Merge Sort trace.

        Shows complete divide-and-conquer execution with all decisions visible:
        - How array is divided at each recursion level
        - Merge comparison decisions with actual values
        - Recursion depth and call structure
        - Complete result traceability

        Args:
            trace_result: Complete trace result from execute() method

        Returns:
            Markdown-formatted narrative with Frontend Visualization Hints
        """
        metadata = trace_result['metadata']
        steps = trace_result['trace']['steps']
        result = trace_result['result']

        # Header
        narrative = "# Merge Sort Execution Narrative\n\n"
        narrative += f"**Algorithm:** {metadata['display_name']}\n"
        narrative += f"**Input Array:** {self.original_array}\n"
        narrative += f"**Array Size:** {metadata['input_size']} elements\n"
        narrative += f"**Result:** {result['sorted_array']}\n"
        narrative += f"**Total Comparisons:** {result['comparisons']}\n"
        narrative += f"**Total Merges:** {result['merges']}\n\n"
        narrative += "---\n\n"

        # Track current recursion depth for formatting
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

            narrative += f"{indent}## Step {step_num}: {description}\n\n"

            # Type-specific details
            if step_type == "INITIAL_STATE":
                narrative += f"**Configuration:**\n"
                narrative += f"- Input: {data['array']}\n"
                narrative += f"- Size: {data['size']} elements\n"
                narrative += f"- Strategy: Recursive divide-and-conquer\n"
                narrative += f"- Time Complexity: O(n log n)\n\n"

            elif step_type == "SPLIT_ARRAY":
                array = data['array']
                left = data['left_half']
                right = data['right_half']
                mid = data['mid_index']

                narrative += f"{indent}**Split Decision:**\n"
                narrative += f"{indent}- Array: {array}\n"
                narrative += f"{indent}- Mid-point calculation: `mid = {len(array)} // 2 = {mid}`\n"
                narrative += f"{indent}- Left half: {left} (indices [0:{mid}])\n"
                narrative += f"{indent}- Right half: {right} (indices [{mid}:{len(array)}])\n\n"

                narrative += f"{indent}**Why split here?** Divide-and-conquer strategy: "
                narrative += f"split roughly in half until we reach single elements (base case).\n\n"

            elif step_type == "BASE_CASE":
                array = data['array']
                depth = data['depth']

                narrative += f"{indent}**Base Case Reached** (Depth {depth})\n\n"
                narrative += f"{indent}- Array: {array}\n"
                narrative += f"{indent}- Size: {len(array)} element(s)\n"
                narrative += f"{indent}- Decision: Single element is already sorted, return as-is\n\n"

            elif step_type == "MERGE_START":
                left = data['left']
                right = data['right']
                depth = data['depth']

                narrative += f"{indent}**Merge Operation Begins** (Depth {depth})\n\n"
                narrative += f"{indent}- Left sorted array: {left}\n"
                narrative += f"{indent}- Right sorted array: {right}\n"
                narrative += f"{indent}- Goal: Combine into single sorted array\n"
                narrative += f"{indent}- Method: Compare elements from front of each array\n\n"

            elif step_type == "MERGE_COMPARE":
                left_val = data['left_value']
                right_val = data['right_value']
                chose = data['chose']
                left_idx = data['left_index']
                right_idx = data['right_index']

                narrative += f"{indent}**Comparison:**\n"
                narrative += f"{indent}- Left[{left_idx}] = {left_val}\n"
                narrative += f"{indent}- Right[{right_idx}] = {right_val}\n"
                narrative += f"{indent}- Decision: {left_val} {'<' if chose == 'left' else '>'} {right_val}\n"
                narrative += f"{indent}- Action: Take **{left_val if chose == 'left' else right_val}** from {'left' if chose == 'left' else 'right'} array\n\n"

            elif step_type == "MERGE_TAKE_LEFT":
                value = data['value']
                remaining_left = data['remaining_left']
                remaining_right = data['remaining_right']

                narrative += f"{indent}**Take from Left:**\n"
                narrative += f"{indent}- Value taken: {value}\n"
                narrative += f"{indent}- Left remaining: {remaining_left}\n"
                narrative += f"{indent}- Right remaining: {remaining_right}\n\n"

            elif step_type == "MERGE_TAKE_RIGHT":
                value = data['value']
                remaining_left = data['remaining_left']
                remaining_right = data['remaining_right']

                narrative += f"{indent}**Take from Right:**\n"
                narrative += f"{indent}- Value taken: {value}\n"
                narrative += f"{indent}- Left remaining: {remaining_left}\n"
                narrative += f"{indent}- Right remaining: {remaining_right}\n\n"

            elif step_type == "MERGE_REMAINDER":
                source = data['source']
                values = data['values']

                narrative += f"{indent}**Append Remainder:**\n"
                narrative += f"{indent}- Source: {source} array\n"
                narrative += f"{indent}- Values: {values}\n"
                narrative += f"{indent}- Reason: Other array exhausted, copy rest directly\n\n"

            elif step_type == "MERGE_COMPLETE":
                merged = data['merged_array']
                depth = data['depth']

                narrative += f"{indent}**Merge Complete** (Depth {depth})\n\n"
                narrative += f"{indent}- Result: {merged}\n"
                narrative += f"{indent}- Size: {len(merged)} elements\n"
                narrative += f"{indent}- Status: Sorted subarray ready for parent merge\n\n"

            elif step_type == "ALGORITHM_COMPLETE":
                sorted_arr = data['sorted_array']
                comparisons = data['comparisons']
                merges = data['merges']

                narrative += f"🎉 **Sorting Complete!**\n\n"
                narrative += f"**Final Result:** {sorted_arr}\n"
                narrative += f"**Statistics:**\n"
                narrative += f"- Total comparisons: {comparisons}\n"
                narrative += f"- Total merge operations: {merges}\n"
                narrative += f"- Original array: {self.original_array}\n"
                narrative += f"- Array is now sorted in ascending order\n\n"

            narrative += "---\n\n"

        # Execution Summary
        narrative += "## Execution Summary\n\n"

        narrative += f"**Algorithm Strategy:**\n"
        narrative += f"1. **Divide:** Recursively split array in half until single elements\n"
        narrative += f"2. **Conquer:** Single elements are trivially sorted\n"
        narrative += f"3. **Combine:** Merge sorted subarrays by comparing front elements\n\n"

        narrative += f"**Performance:**\n"
        narrative += f"- Input size: {metadata['input_size']} elements\n"
        narrative += f"- Comparisons: {result['comparisons']}\n"
        narrative += f"- Merge operations: {result['merges']}\n"
        narrative += f"- Time Complexity: O(n log n) - guaranteed, even for worst case\n"
        narrative += f"- Space Complexity: O(n) - requires auxiliary arrays for merging\n\n"

        narrative += f"**Key Insight:**\n"
        narrative += f"Merge sort's power comes from breaking down the sorting problem into "
        narrative += f"smaller subproblems (single elements are already sorted), then building "
        narrative += f"the solution back up through systematic merging. The merge step is where "
        narrative += f"the actual sorting happens - by always taking the smaller front element "
        narrative += f"from two sorted arrays, we maintain sorted order in the combined result.\n\n"

        # Add Frontend Visualization Hints (Backend Checklist v2.2)
        narrative += "---\n\n## 🎨 Frontend Visualization Hints\n\n"

        narrative += "### Primary Metrics to Emphasize\n\n"
        narrative += "- **Recursion Depth** (`depth`) - Shows the tree structure of divide-and-conquer\n"
        narrative += "- **Comparison Count** (`comparisons`) - Demonstrates O(n log n) efficiency accumulating\n"
        narrative += "- **Array Segments** (`all_intervals`) - Visual representation of splits and merges\n\n"

        narrative += "### Visualization Priorities\n\n"
        narrative += "1. **Show recursion tree structure** - Use vertical depth levels to display parent-child relationships\n"
        narrative += "2. **Highlight active comparisons** - When merging, emphasize the two elements being compared\n"
        narrative += "3. **Animate the merge process** - Show elements moving from left/right into merged result\n"
        narrative += "4. **Color-code by depth** - Use distinct colors for different recursion levels\n"
        narrative += "5. **Display call stack state** - Show which recursive calls are active vs. completed\n\n"

        narrative += "### Key JSON Paths\n\n"
        narrative += "```\n"
        narrative += "step.data.visualization.all_intervals[*].start\n"
        narrative += "step.data.visualization.all_intervals[*].end\n"
        narrative += "step.data.visualization.all_intervals[*].state  // 'splitting' | 'merging' | 'complete'\n"
        narrative += "step.data.visualization.call_stack_state[*].depth\n"
        narrative += "step.data.visualization.call_stack_state[*].is_active\n"
        narrative += "step.data.visualization.call_stack_state[*].operation\n"
        narrative += "step.data.visualization.comparison_count\n"
        narrative += "step.data.visualization.merge_count\n"
        narrative += "```\n\n"

        narrative += "### Algorithm-Specific Guidance\n\n"
        narrative += "Merge sort is fundamentally about **recursion and merging**. The visualization should "
        narrative += "emphasize the tree structure - show how the array splits down to single elements, then "
        narrative += "merges back up. The most important pedagogical moments are: (1) the base case (single "
        narrative += "elements are sorted), and (2) the merge comparison (always take the smaller front element). "
        narrative += "Use vertical space to show depth levels, and animate the merge process element-by-element "
        narrative += "to make the sorting logic transparent. The call stack state helps users understand which "
        narrative += "recursive calls are in progress vs. complete. Consider showing both the 'top-down' split "
        narrative += "phase and 'bottom-up' merge phase distinctly.\n"

        return narrative

    def execute(self, input_data: Any) -> dict:
        """
        Execute merge sort algorithm with complete trace generation.

        Args:
            input_data: dict with key:
                - 'array': List of integers to sort

        Returns:
            Standardized trace result with:
                - result: {'sorted_array': list, 'comparisons': int, 'merges': int}
                - trace: Complete step-by-step execution
                - metadata: Includes visualization_type='timeline'

        Raises:
            ValueError: If input is invalid
        """
        # Validate input
        if not isinstance(input_data, dict):
            raise ValueError("Input must be a dictionary")
        if 'array' not in input_data:
            raise ValueError("Input must contain 'array' key")

        self.original_array = input_data['array']

        if not self.original_array:
            raise ValueError("Array cannot be empty")

        if not isinstance(self.original_array, list):
            raise ValueError("Array must be a list")

        # Validate all elements are integers (or at least comparable)
        try:
            _ = all(isinstance(x, (int, float)) for x in self.original_array)
        except:
            raise ValueError("Array elements must be numbers")

        # Initialize state
        self.call_stack = []
        self.next_call_id = 0
        self.comparison_count = 0
        self.merge_count = 0

        # Set metadata for frontend
        self.metadata = {
            'algorithm': 'merge-sort',
            'display_name': 'Merge Sort',
            'visualization_type': 'timeline',  # Uses timeline for recursion tree
            'visualization_config': {
                'show_call_stack': True,
                'show_depth_levels': True,
                'color_by_depth': True
            },
            'input_size': len(self.original_array)
        }

        # Initial state
        self._add_step(
            "INITIAL_STATE",
            {
                'array': self.original_array.copy(),
                'size': len(self.original_array)
            },
            f"🔄 Starting Merge Sort on array of {len(self.original_array)} elements"
        )

        # Execute merge sort recursively
        sorted_array = self._merge_sort_recursive(self.original_array, 0, 0)

        # Final step
        self._add_step(
            "ALGORITHM_COMPLETE",
            {
                'sorted_array': sorted_array,
                'comparisons': self.comparison_count,
                'merges': self.merge_count
            },
            f"✅ Merge Sort complete: {len(self.original_array)} elements sorted"
        )

        # Build result
        return self._build_trace_result({
            'sorted_array': sorted_array,
            'comparisons': self.comparison_count,
            'merges': self.merge_count
        })

    def _merge_sort_recursive(self, array: List[int], start_index: int, depth: int) -> List[int]:
        """
        Recursive merge sort with trace generation.

        Args:
            array: Array segment to sort
            start_index: Starting index in original array (for visualization)
            depth: Current recursion depth

        Returns:
            Sorted array
        """
        # Base case: single element or empty
        if len(array) <= 1:
            call_id = self.next_call_id
            self.next_call_id += 1

            call_info = {
                'id': call_id,
                'depth': depth,
                'array': array,
                'start_index': start_index,
                'end_index': start_index + len(array) - 1 if array else start_index,
                'status': 'complete',
                'operation': 'base_case'
            }
            self.call_stack.append(call_info)

            self._add_step(
                "BASE_CASE",
                {
                    'array': array.copy() if array else [],
                    'depth': depth,
                    'call_id': call_id
                },
                f"Base case: array {array} has {len(array)} element(s), already sorted"
            )

            self.call_stack.pop()
            return array

        # Recursive case: split and merge
        call_id = self.next_call_id
        self.next_call_id += 1

        # Calculate mid-point
        mid = len(array) // 2
        left_half = array[:mid]
        right_half = array[mid:]

        # Record split
        call_info = {
            'id': call_id,
            'depth': depth,
            'array': array,
            'start_index': start_index,
            'end_index': start_index + len(array) - 1,
            'status': 'splitting',
            'operation': 'split'
        }
        self.call_stack.append(call_info)

        self._add_step(
            "SPLIT_ARRAY",
            {
                'array': array.copy(),
                'left_half': left_half.copy(),
                'right_half': right_half.copy(),
                'mid_index': mid,
                'depth': depth,
                'call_id': call_id
            },
            f"Split array {array} into {left_half} and {right_half}"
        )

        # Recursively sort left half
        sorted_left = self._merge_sort_recursive(left_half, start_index, depth + 1)

        # Recursively sort right half
        sorted_right = self._merge_sort_recursive(right_half, start_index + mid, depth + 1)

        # Merge sorted halves
        call_info['status'] = 'merging'
        call_info['operation'] = 'merge'

        self._add_step(
            "MERGE_START",
            {
                'left': sorted_left.copy(),
                'right': sorted_right.copy(),
                'depth': depth,
                'call_id': call_id
            },
            f"Merge sorted arrays {sorted_left} and {sorted_right}"
        )

        merged = self._merge(sorted_left, sorted_right, depth)
        self.merge_count += 1

        self._add_step(
            "MERGE_COMPLETE",
            {
                'merged_array': merged.copy(),
                'depth': depth,
                'call_id': call_id
            },
            f"Merged result: {merged}"
        )

        call_info['status'] = 'complete'
        self.call_stack.pop()

        return merged

    def _merge(self, left: List[int], right: List[int], depth: int) -> List[int]:
        """
        Merge two sorted arrays with trace generation.

        Args:
            left: Sorted left array
            right: Sorted right array
            depth: Current recursion depth

        Returns:
            Merged sorted array
        """
        result = []
        i = j = 0

        # Merge by comparing front elements
        while i < len(left) and j < len(right):
            self.comparison_count += 1

            left_val = left[i]
            right_val = right[j]

            if left_val <= right_val:
                self._add_step(
                    "MERGE_COMPARE",
                    {
                        'left_value': left_val,
                        'right_value': right_val,
                        'chose': 'left',
                        'left_index': i,
                        'right_index': j,
                        'depth': depth
                    },
                    f"Compare {left_val} ≤ {right_val}: take {left_val} from left"
                )

                result.append(left_val)
                i += 1

                self._add_step(
                    "MERGE_TAKE_LEFT",
                    {
                        'value': left_val,
                        'remaining_left': left[i:],
                        'remaining_right': right[j:],
                        'depth': depth
                    },
                    f"Added {left_val} to result from left array"
                )
            else:
                self._add_step(
                    "MERGE_COMPARE",
                    {
                        'left_value': left_val,
                        'right_value': right_val,
                        'chose': 'right',
                        'left_index': i,
                        'right_index': j,
                        'depth': depth
                    },
                    f"Compare {left_val} > {right_val}: take {right_val} from right"
                )

                result.append(right_val)
                j += 1

                self._add_step(
                    "MERGE_TAKE_RIGHT",
                    {
                        'value': right_val,
                        'remaining_left': left[i:],
                        'remaining_right': right[j:],
                        'depth': depth
                    },
                    f"Added {right_val} to result from right array"
                )

        # Append remaining elements from left (if any)
        if i < len(left):
            remainder = left[i:]
            self._add_step(
                "MERGE_REMAINDER",
                {
                    'source': 'left',
                    'values': remainder.copy(),
                    'depth': depth
                },
                f"Right exhausted: append remaining left elements {remainder}"
            )
            result.extend(remainder)

        # Append remaining elements from right (if any)
        if j < len(right):
            remainder = right[j:]
            self._add_step(
                "MERGE_REMAINDER",
                {
                    'source': 'right',
                    'values': remainder.copy(),
                    'depth': depth
                },
                f"Left exhausted: append remaining right elements {remainder}"
            )
            result.extend(remainder)

        return result

    def get_prediction_points(self) -> List[Dict[str, Any]]:
        """
        Identify prediction opportunities for active learning.

        Students predict: "In this merge, which element will be selected first?"

        Returns:
            List of prediction points with question, choices, and correct answer
        """
        predictions = []

        for i, step in enumerate(self.trace):
            # Prediction opportunity: Right before merge comparison
            if step.type == "MERGE_START" and i + 1 < len(self.trace):
                left = step.data['left']
                right = step.data['right']

                if not left or not right:
                    continue  # Skip if either array is empty

                # Next step should be MERGE_COMPARE
                if i + 1 < len(self.trace) and self.trace[i + 1].type == "MERGE_COMPARE":
                    next_step = self.trace[i + 1]
                    correct_answer = next_step.data['chose']

                    left_val = left[0]
                    right_val = right[0]

                    predictions.append({
                        'step_index': i,
                        'question': f"Merging {left} and {right}. Which element is selected first?",
                        'choices': [
                            {'id': 'left', 'label': f'{left_val} (from left array)'},
                            {'id': 'right', 'label': f'{right_val} (from right array)'}
                        ],
                        'hint': f"Compare front elements: {left_val} vs {right_val}. Take the smaller one.",
                        'correct_answer': correct_answer,
                        'explanation': self._get_merge_explanation(left_val, right_val, correct_answer)
                    })

                # Limit predictions to avoid overwhelming user (max 3 as per requirements)
                if len(predictions) >= 3:
                    break

        return predictions

    def _get_merge_explanation(self, left_val: int, right_val: int, answer: str) -> str:
        """Generate explanation for merge prediction."""
        if answer == 'left':
            return f"{left_val} ≤ {right_val}, so we take {left_val} from the left array. The merge always takes the smaller front element."
        else:
            return f"{left_val} > {right_val}, so we take {right_val} from the right array. The merge always takes the smaller front element."
