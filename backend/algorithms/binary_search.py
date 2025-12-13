# backend/algorithms/binary_search.py
"""
Binary Search algorithm tracer for educational visualization.

Implements iterative binary search on a sorted array with complete
trace generation for step-by-step visualization and prediction mode.
"""

from typing import Any, List, Dict
from .base_tracer import AlgorithmTracer


class BinarySearchTracer(AlgorithmTracer):
    """
    Tracer for Binary Search algorithm on sorted arrays.

    Visualization shows:
    - Array elements with states (excluded, active_range, examining, found)
    - Pointers (left, right, mid, target)
    - Search space reduction at each step

    Prediction points ask: "Will we search left, right, or is target found?"
    """

    def __init__(self):
        super().__init__()
        self.array = []
        self.target = None
        self.left = 0
        self.right = 0
        self.mid = None
        self.found_index = None
        self.search_complete = False

    def _get_visualization_state(self) -> dict:
        """
        Return current array state with element states and pointers.

        Element states:
        - 'examining': Current mid element being compared
        - 'excluded': Outside current search range
        - 'active_range': Within current [left, right] range
        - 'found': Target element (when found)
        """
        if not self.array:
            return {}

        return {
            'array': [
                {
                    'index': i,
                    'value': v,
                    'state': self._get_element_state(i)
                }
                for i, v in enumerate(self.array)
            ],
            'pointers': {
                'left': self.left,
                'right': self.right,
                'mid': self.mid,
                'target': self.target
            },
            'search_space_size': self.right - self.left + 1 if not self.search_complete else 0
        }

    def _get_element_state(self, index: int) -> str:
        """Determine visual state of array element at given index."""
        if self.found_index is not None and index == self.found_index:
            return 'found'
        if self.mid is not None and index == self.mid:
            return 'examining'
        if self.search_complete:
            return 'excluded'
        if index < self.left or index > self.right:
            return 'excluded'
        return 'active_range'

    def generate_narrative(self, trace_result: dict) -> str:
        """
        Generate human-readable narrative from Binary Search trace.
        
        Shows complete execution flow with all decision data visible.
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
        narrative = "# Binary Search Execution Narrative\n\n"
        narrative += f"**Algorithm:** {metadata['display_name']}\n"
        narrative += f"**Input Array:** {self.array}\n"
        narrative += f"**Target Value:** {self.target}\n"
        narrative += f"**Array Size:** {metadata['input_size']} elements\n"
        narrative += f"**Result:** {'✅ FOUND' if result['found'] else '❌ NOT FOUND'}"
        
        if result['found']:
            narrative += f" at index {result['index']}\n"
        else:
            narrative += "\n"
        
        narrative += f"**Total Comparisons:** {result['comparisons']}\n\n"
        narrative += "---\n\n"
        
        # Step-by-step narrative
        for step in steps:
            step_num = step['step']
            step_type = step['type']
            description = step['description']
            data = step['data']
            viz = data['visualization']
            
            narrative += f"## Step {step_num}: {description}\n\n"
            
            # Type-specific details
            if step_type == "INITIAL_STATE":
                narrative += f"**Search Configuration:**\n"
                narrative += f"- Target: `{data['target']}`\n"
                narrative += f"- Array size: {data['array_size']} elements\n"
                narrative += f"- Initial range: indices {data['search_range']}\n\n"
                
                narrative += "**Array Visualization:**\n```\n"
                narrative += "Index: " + " ".join(f"{elem['index']:3d}" for elem in viz['array']) + "\n"
                narrative += "Value: " + " ".join(f"{elem['value']:3d}" for elem in viz['array']) + "\n"
                narrative += "       " + " ".join("  ^" if i == 0 or i == len(viz['array'])-1 else "   " for i in range(len(viz['array']))) + "\n"
                narrative += "       " + " ".join("  L" if i == 0 else ("  R" if i == len(viz['array'])-1 else "   ") for i in range(len(viz['array']))) + "\n"
                narrative += "```\n"
                narrative += f"*Search space: **{viz['search_space_size']} elements** (entire array)*\n\n"
            
            elif step_type == "CALCULATE_MID":
                left = data['left']
                right = data['right']
                mid_index = data['mid_index']
                mid_value = data['mid_value']
                
                narrative += f"**Calculation:**\n"
                narrative += f"```\n"
                narrative += f"{data['calculation']}\n"
                narrative += f"```\n\n"
                
                narrative += f"**Pointers:**\n"
                narrative += f"- Left pointer: index {left} (value = {self.array[left]})\n"
                narrative += f"- Right pointer: index {right} (value = {self.array[right]})\n"
                narrative += f"- Mid pointer: index **{mid_index}** (value = **{mid_value}**)\n\n"
                
                narrative += "**Current Search Space:**\n```\n"
                active_elements = [elem for elem in viz['array'] if elem['state'] in ['active_range', 'examining']]
                narrative += "Index: " + " ".join(f"{elem['index']:3d}" for elem in active_elements) + "\n"
                narrative += "Value: " + " ".join(f"{elem['value']:3d}" for elem in active_elements) + "\n"
                
                # Show pointer positions
                pointer_line = "       "
                for elem in active_elements:
                    if elem['index'] == left and elem['index'] == mid_index:
                        pointer_line += " LM"
                    elif elem['index'] == right and elem['index'] == mid_index:
                        pointer_line += " MR"
                    elif elem['index'] == left:
                        pointer_line += "  L"
                    elif elem['index'] == mid_index:
                        pointer_line += "  M"
                    elif elem['index'] == right:
                        pointer_line += "  R"
                    else:
                        pointer_line += "   "
                narrative += pointer_line + "\n"
                narrative += "```\n"
                narrative += f"*Search space: **{viz['search_space_size']} elements***\n\n"
            
            elif step_type == "TARGET_FOUND":
                index = data['index']
                value = data['value']
                comparisons = data['comparisons']
                
                narrative += f"🎯 **Match Found!**\n\n"
                narrative += f"**Comparison:** `target ({self.target}) == mid_value ({value})`\n\n"
                narrative += f"**Result:**\n"
                narrative += f"- Target value **{self.target}** found at index **{index}**\n"
                narrative += f"- Total comparisons: {comparisons}\n"
                narrative += f"- Time complexity: O(log n) = O(log {len(self.array)}) ≈ {comparisons} comparisons\n\n"
            
            elif step_type == "SEARCH_RIGHT":
                comparison = data['comparison']
                old_left = data['old_left']
                new_left = data['new_left']
                eliminated = data['eliminated_elements']
                
                narrative += f"**Comparison:** `{comparison}`\n\n"
                narrative += f"**Decision:** Mid value is **less than** target\n"
                narrative += f"- Target must be in the **right half** (larger values)\n"
                narrative += f"- Eliminate left half: indices [{old_left}, {new_left - 1}]\n"
                narrative += f"- Eliminated **{eliminated}** elements from search\n\n"
                
                narrative += f"**Updated Pointers:**\n"
                narrative += f"- New left pointer: {new_left} (was {old_left})\n"
                narrative += f"- Right pointer: {viz['pointers']['right']} (unchanged)\n\n"
                
                if viz['search_space_size'] > 0:
                    remaining = [elem for elem in viz['array'] if elem['state'] == 'active_range']
                    narrative += f"**Remaining Search Space:**\n```\n"
                    narrative += "Index: " + " ".join(f"{elem['index']:3d}" for elem in remaining) + "\n"
                    narrative += "Value: " + " ".join(f"{elem['value']:3d}" for elem in remaining) + "\n"
                    narrative += "```\n"
                    narrative += f"*Search space reduced to **{viz['search_space_size']} elements***\n\n"
            
            elif step_type == "SEARCH_LEFT":
                comparison = data['comparison']
                old_right = data['old_right']
                new_right = data['new_right']
                eliminated = data['eliminated_elements']
                
                narrative += f"**Comparison:** `{comparison}`\n\n"
                narrative += f"**Decision:** Mid value is **greater than** target\n"
                narrative += f"- Target must be in the **left half** (smaller values)\n"
                narrative += f"- Eliminate right half: indices [{new_right + 1}, {old_right}]\n"
                narrative += f"- Eliminated **{eliminated}** elements from search\n\n"
                
                narrative += f"**Updated Pointers:**\n"
                narrative += f"- Left pointer: {viz['pointers']['left']} (unchanged)\n"
                narrative += f"- New right pointer: {new_right} (was {old_right})\n\n"
                
                if viz['search_space_size'] > 0:
                    remaining = [elem for elem in viz['array'] if elem['state'] == 'active_range']
                    narrative += f"**Remaining Search Space:**\n```\n"
                    narrative += "Index: " + " ".join(f"{elem['index']:3d}" for elem in remaining) + "\n"
                    narrative += "Value: " + " ".join(f"{elem['value']:3d}" for elem in remaining) + "\n"
                    narrative += "```\n"
                    narrative += f"*Search space reduced to **{viz['search_space_size']} elements***\n\n"
            
            elif step_type == "TARGET_NOT_FOUND":
                comparisons = data['comparisons']
                
                narrative += f"❌ **Search Exhausted**\n\n"
                narrative += f"**Final State:**\n"
                narrative += f"- Search space is empty (left > right)\n"
                narrative += f"- Target value **{self.target}** does not exist in array\n"
                narrative += f"- Total comparisons: {comparisons}\n\n"
                
                narrative += "**All elements excluded:**\n```\n"
                narrative += "Index: " + " ".join(f"{elem['index']:3d}" for elem in viz['array']) + "\n"
                narrative += "Value: " + " ".join(f"{elem['value']:3d}" for elem in viz['array']) + "\n"
                narrative += "State: " + " ".join("  X" for _ in viz['array']) + "\n"
                narrative += "```\n\n"
            
            narrative += "---\n\n"
        
        # Summary
        narrative += "## Execution Summary\n\n"
        narrative += f"**Final Result:** "
        if result['found']:
            narrative += f"Target **{self.target}** found at index **{result['index']}**\n"
        else:
            narrative += f"Target **{self.target}** not found in array\n"
        
        narrative += f"**Performance:**\n"
        narrative += f"- Comparisons: {result['comparisons']}\n"
        narrative += f"- Theoretical maximum: {len(self.array).bit_length()} comparisons for array of size {len(self.array)}\n"
        narrative += f"- Time Complexity: O(log n)\n"
        narrative += f"- Space Complexity: O(1) (iterative implementation)\n\n"
        
        return narrative

    def execute(self, input_data: Any) -> dict:
            """
            Execute binary search algorithm with trace generation.

            Args:
                input_data: dict with keys:
                    - 'array': List of integers (must be sorted)
                    - 'target': Integer to search for

            Returns:
                Standardized trace result with:
                    - result: {'found': bool, 'index': int or None, 'comparisons': int}
                    - trace: Complete step-by-step execution
                    - metadata: Includes visualization_type='array'

            Raises:
                ValueError: If array is not sorted or input is invalid
            """
            # Validate input
            if not isinstance(input_data, dict):
                raise ValueError("Input must be a dictionary")
            if 'array' not in input_data or 'target' not in input_data:
                raise ValueError("Input must contain 'array' and 'target' keys")

            self.array = input_data['array']
            self.target = input_data['target']

            if not self.array:
                raise ValueError("Array cannot be empty")

            # Validate array is sorted
            if not all(self.array[i] <= self.array[i+1] for i in range(len(self.array)-1)):
                raise ValueError("Array must be sorted in ascending order")

            # Initialize search
            self.left = 0
            self.right = len(self.array) - 1
            self.mid = None
            self.found_index = None
            self.search_complete = False
            comparisons = 0

            # Set metadata for frontend
            self.metadata = {
                'algorithm': 'binary-search',
                'display_name': 'Binary Search',
                'visualization_type': 'array',
                'visualization_config': {
                    'element_renderer': 'number',
                    'show_indices': True,
                    'pointer_colors': {
                        'left': 'blue',
                        'right': 'red',
                        'mid': 'yellow',
                        'target': 'green'
                    }
                },
                'input_size': len(self.array),
                'target_value': self.target
            }

            # Initial state
            self._add_step(
                "INITIAL_STATE",
                {
                    'target': self.target,
                    'array_size': len(self.array),
                    'search_range': f"[{self.left}, {self.right}]"
                },
                f"🔍 Searching for {self.target} in sorted array of {len(self.array)} elements"
            )

            # Binary search loop
            while self.left <= self.right:
                # Calculate mid
                self.mid = (self.left + self.right) // 2
                mid_value = self.array[self.mid]

                self._add_step(
                    "CALCULATE_MID",
                    {
                        'mid_index': self.mid,
                        'mid_value': mid_value,
                        'left': self.left,
                        'right': self.right,
                        'calculation': f"mid = ({self.left} + {self.right}) // 2 = {self.mid}"
                    },
                    f"📍 Calculate middle: index {self.mid} (value = {mid_value})"
                )

                # Compare mid with target
                comparisons += 1

                if mid_value == self.target:
                    # Target found!
                    self.found_index = self.mid
                    self.search_complete = True

                    self._add_step(
                        "TARGET_FOUND",
                        {
                            'index': self.mid,
                            'value': mid_value,
                            'comparisons': comparisons
                        },
                        f"✅ Found target {self.target} at index {self.mid} (after {comparisons} comparisons)"
                    )

                    return self._build_trace_result({
                        'found': True,
                        'index': self.mid,
                        'comparisons': comparisons
                    })

                elif mid_value < self.target:
                    # Target is in right half
                    self._add_step(
                        "SEARCH_RIGHT",
                        {
                            'comparison': f"{mid_value} < {self.target}",
                            'action': 'eliminate_left_half',
                            'old_left': self.left,
                            'new_left': self.mid + 1,
                            'eliminated_elements': self.mid - self.left + 1
                        },
                        f"➡️ {mid_value} < {self.target}, search right half (eliminate {self.mid - self.left + 1} elements)"
                    )
                    self.left = self.mid + 1

                else:  # mid_value > self.target
                    # Target is in left half
                    self._add_step(
                        "SEARCH_LEFT",
                        {
                            'comparison': f"{mid_value} > {self.target}",
                            'action': 'eliminate_right_half',
                            'old_right': self.right,
                            'new_right': self.mid - 1,
                            'eliminated_elements': self.right - self.mid + 1
                        },
                        f"⬅️ {mid_value} > {self.target}, search left half (eliminate {self.right - self.mid + 1} elements)"
                    )
                    self.right = self.mid - 1

            # Target not found
            self.search_complete = True
            self.mid = None  # Reset mid so final visualization shows all excluded

            self._add_step(
                "TARGET_NOT_FOUND",
                {
                    'comparisons': comparisons,
                    'final_state': 'search_space_empty'
                },
                f"❌ Target {self.target} not found in array (after {comparisons} comparisons)"
            )

            return self._build_trace_result({
                'found': False,
                'index': None,
                'comparisons': comparisons
            })

    def get_prediction_points(self) -> List[Dict[str, Any]]:
        """
        Identify prediction opportunities for active learning.

        Students predict: "After comparing mid with target, will we search
        left, search right, or have we found the target?"

        Returns:
            List of prediction points with question, choices, and correct answer
        """
        predictions = []

        for i, step in enumerate(self.trace):
            # Prediction opportunity: Right after calculating mid, before decision
            if step.type == "CALCULATE_MID" and i + 1 < len(self.trace):
                next_step = self.trace[i + 1]
                mid_value = step.data['mid_value']

                # Determine correct answer from next step type
                if next_step.type == "TARGET_FOUND":
                    correct_answer = "found"
                elif next_step.type == "SEARCH_LEFT":
                    correct_answer = "search-left"
                elif next_step.type == "SEARCH_RIGHT":
                    correct_answer = "search-right"
                else:
                    continue  # Skip if unexpected step type

                predictions.append({
                    'step_index': i,
                    'question': f"Compare mid value ({mid_value}) with target ({self.target}). What's next?",
                    'choices': [
                        {'id': 'found', 'label': f'Found! ({mid_value} == {self.target})'},
                        {'id': 'search-left', 'label': f'Search Left ({mid_value} > {self.target})'},
                        {'id': 'search-right', 'label': f'Search Right ({mid_value} < {self.target})'}
                    ],
                    'hint': f"Compare {mid_value} with {self.target}",
                    'correct_answer': correct_answer,
                    'explanation': self._get_prediction_explanation(mid_value, self.target, correct_answer)
                })

        return predictions

    def _get_prediction_explanation(self, mid_value: int, target: int, answer: str) -> str:
        """Generate explanation for prediction answer."""
        if answer == "found":
            return f"{mid_value} == {target}, so the target is found at this index!"
        elif answer == "search-left":
            return f"{mid_value} > {target}, so the target must be in the left half (smaller values)"
        elif answer == "search-right":
            return f"{mid_value} < {target}, so the target must be in the right half (larger values)"
        return ""
