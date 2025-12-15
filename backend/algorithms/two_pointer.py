# backend/algorithms/two_pointer.py
"""
Two Pointer algorithm tracer for educational visualization.

Implements the "remove duplicates from a sorted array" pattern using
slow and fast pointers. This demonstrates an in-place array modification
technique.

VERSION: 2.2 - QA Feedback Fix for Narrative Visualization
- Addressed minor QA feedback to visualize the fast pointer after it
  moves past the end of the array in the final narrative step.
"""

from typing import Any, List, Dict
from .base_tracer import AlgorithmTracer


class TwoPointerTracer(AlgorithmTracer):
    """
    Tracer for the Two Pointer pattern (Array Deduplication).

    Visualization shows:
    - Array elements with states (unique, duplicate, pending, stale)
    - Pointers (slow for writing, fast for reading)
    - The count of unique elements found so far.

    Prediction points ask: "When the fast pointer finds a new value,
    should it be kept or skipped?"
    """

    def __init__(self):
        super().__init__()
        self.array: List[int] = []
        self.original_array: List[int] = []
        self.slow: int = 0
        self.fast: int = 1
        self.is_complete: bool = False

    def _get_element_state(self, index: int) -> str:
        """Determine the visual state of an array element."""
        if self.is_complete:
            return 'unique' if index < (self.slow + 1) else 'stale'

        if index <= self.slow:
            return 'unique'
        if index < self.fast:
            return 'duplicate'
        if index == self.fast:
            return 'examining'
        return 'pending'

    def _get_visualization_state(self) -> dict:
        """Return current array state with element states and pointers."""
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
                'slow': self.slow,
                'fast': self.fast if self.fast < len(self.array) and not self.is_complete else None,
            },
            'metrics': {
                'unique_count': self.slow + 1
            }
        }

    def execute(self, input_data: Any) -> dict:
        """
        Execute the Two Pointer (deduplication) algorithm with trace generation.
        Refactored to fix temporal incoherence based on QA feedback.
        """
        # 1. Input Validation
        if not isinstance(input_data, dict) or 'array' not in input_data:
            raise ValueError("Input must be a dictionary with an 'array' key.")

        self.original_array = input_data['array']
        self.array = self.original_array.copy()

        if len(self.array) > 1 and not all(self.array[i] <= self.array[i+1] for i in range(len(self.array)-1)):
            raise ValueError("Array must be sorted in ascending order.")

        # 2. Metadata Setup
        self.metadata = {
            'algorithm': 'two-pointer',
            'display_name': 'Two Pointer Pattern',
            'visualization_type': 'array',
            'input_size': len(self.array),
            'visualization_config': { 'pointer_colors': { 'slow': 'blue', 'fast': 'red' } }
        }

        # 3. Edge Case Handling
        if not self.array:
            self._add_step("INITIAL_STATE", {}, "🏁 Array is empty, 0 unique elements.")
            return self._build_trace_result({'unique_count': 0, 'final_array': []})

        if len(self.array) == 1:
            self.is_complete = True
            self.slow = 0
            self._add_step("INITIAL_STATE", {}, "🏁 Array has one element, which is unique.")
            return self._build_trace_result({'unique_count': 1, 'final_array': self.array})

        # 4. Initial State
        self.slow = 0
        self.fast = 1
        self._add_step(
            "INITIAL_STATE",
            {},
            "🚀 Start: slow pointer at index 0, fast pointer at index 1."
        )

        # 5. Main Loop (Refactored Logic)
        while self.fast < len(self.array):
            slow_val = self.array[self.slow]
            fast_val = self.array[self.fast]

            # Step 1: The Decision. This step shows the state BEFORE the action.
            self._add_step(
                "COMPARE",
                {
                    'slow_index': self.slow, 'slow_value': slow_val,
                    'fast_index': self.fast, 'fast_value': fast_val,
                },
                f"⚖️ Compare arr[fast] ({fast_val}) with arr[slow] ({slow_val})."
            )

            # Step 2: The Consequence. This step shows the state AFTER the action.
            if fast_val == slow_val:
                # Duplicate found: Perform action, then add step.
                old_fast = self.fast
                self.fast += 1
                self._add_step(
                    "HANDLE_DUPLICATE",
                    {
                        'comparison': f"{fast_val} == {slow_val}",
                        'action': f"Increment fast pointer from {old_fast} to {self.fast}"
                    },
                    "⏭️ Duplicate found. Moving fast pointer."
                )
            else:
                # New unique element found: Perform all actions, then add step.
                old_slow = self.slow
                old_fast = self.fast

                self.slow += 1
                self.array[self.slow] = fast_val
                self.fast += 1

                self._add_step(
                    "HANDLE_UNIQUE",
                    {
                        'comparison': f"{fast_val} != {slow_val}",
                        'source_index': old_fast, 'dest_index': self.slow, 'value': fast_val,
                        'action': f"Increment slow to {self.slow}, copy value, increment fast to {self.fast}"
                    },
                    f"✨ New unique element found. Placed {fast_val} at index {self.slow}."
                )

        # 6. Final State
        self.is_complete = True
        unique_count = self.slow + 1
        final_array = self.array[:unique_count]

        self._add_step(
            "ALGORITHM_COMPLETE",
            { 'unique_count': unique_count, 'final_array_slice': final_array },
            f"✅ Complete! Found {unique_count} unique elements."
        )

        # 7. Return Result
        return self._build_trace_result({
            'unique_count': unique_count,
            'final_array': final_array
        })

    def get_prediction_points(self) -> List[Dict[str, Any]]:
        """Identify prediction opportunities at each comparison step."""
        predictions = []
        for i, step in enumerate(self.trace):
            if step.type == "COMPARE" and i + 1 < len(self.trace):
                next_step = self.trace[i + 1]
                compare_data = step.data
                slow_val = compare_data['slow_value']
                fast_val = compare_data['fast_value']

                correct_answer = ""
                if next_step.type == "HANDLE_DUPLICATE":
                    correct_answer = "skip"
                elif next_step.type == "HANDLE_UNIQUE":
                    correct_answer = "keep"
                else:
                    continue

                predictions.append({
                    'step_index': i,
                    'question': f"The fast pointer sees value ({fast_val}) and the last unique value is ({slow_val}). What happens next?",
                    'choices': [
                        {'id': 'keep', 'label': 'Keep: New unique element found.'},
                        {'id': 'skip', 'label': 'Skip: Duplicate element found.'}
                    ],
                    'hint': f"Compare {fast_val} and {slow_val}. Are they equal?",
                    'correct_answer': correct_answer,
                    'explanation': self._get_prediction_explanation(slow_val, fast_val, correct_answer)
                })
        return predictions

    def _get_prediction_explanation(self, slow_val: int, fast_val: int, answer: str) -> str:
        """Generate a clear explanation for the prediction outcome."""
        if answer == "skip":
            return f"Correct. Since {fast_val} == {slow_val}, it's a duplicate. We only move the fast pointer to check the next element."
        elif answer == "keep":
            return f"Correct. Since {fast_val} != {slow_val}, it's a new unique element. We move the slow pointer, copy the value, and then move the fast pointer."
        return ""

    def _render_array_state_narrative(self, viz_data: dict) -> str:
        """
        Helper to create a text visualization of the array state for the narrative.
        Uses full state names and correctly shows the fast pointer moving off the array.
        """
        array = viz_data.get('array', [])
        pointers = viz_data.get('pointers', {})
        if not array:
            return "Array is empty.\n"

        state_map = {
            'unique': 'Unique', 'duplicate': 'Duplicate', 'examining': 'Examining',
            'pending': 'Pending', 'stale': 'Stale'
        }
        max_val_len = max(len(str(e['value'])) for e in array) if array else 2
        max_idx_len = len(str(len(array) - 1)) if array else 2
        col_width = max(max_val_len, max_idx_len, 4)

        s = f"{'Index:':<10}" + " ".join(f"{elem['index']:<{col_width}}" for elem in array) + "\n"
        s += f"{'Value:':<10}" + " ".join(f"{elem['value']:<{col_width}}" for elem in array) + "\n"
        s += f"{'State:':<10}" + " ".join(f"{state_map.get(elem['state'], elem['state']):<{col_width}}" for elem in array) + "\n"
        
        pointer_line = " " * 10
        for i in range(len(array)):
            p_str = ""
            if pointers.get('slow') == i: p_str += "S"
            if pointers.get('fast') == i: p_str += "F"
            pointer_line += f"{p_str:<{col_width+1}}"
        
        # QA FEEDBACK FIX: Show the fast pointer after it moves past the last element.
        # The trace step's visualization data for this state will have fast = len(array).
        if pointers.get('fast') == len(array):
            pointer_line += " F"

        s += pointer_line.rstrip() + "\n"
        return s

    def generate_narrative(self, trace_result: dict) -> str:
        """
        Generate a human-readable narrative from the Two Pointer trace,
        consolidating logical steps for pedagogical clarity.
        """
        steps = trace_result['trace']['steps']
        result = trace_result['result']

        narrative = f"# Two Pointer Pattern: Array Deduplication\n\n"
        narrative += f"**Input Array:** `{self.original_array}`\n"
        narrative += f"**Goal:** Remove duplicates in-place and find the count of unique elements.\n"
        narrative += f"**Result:** Found **{result['unique_count']}** unique elements. Final unique array: `{result['final_array']}`\n\n---\n\n"

        i = 0
        step_counter = 0
        while i < len(steps):
            step = steps[i]
            step_type = step['type']

            if step_type == "INITIAL_STATE":
                narrative += f"## Step {step_counter}: {step['description']}\n\n"
                narrative += "**Initial Array State:**\n```\n" + self._render_array_state_narrative(step['data']['visualization']) + "```\n"
                narrative += "---\n\n"
                i += 1
                step_counter += 1
                continue

            if step_type == "COMPARE":
                compare_step = step
                action_step = steps[i + 1]
                
                slow_val = compare_step['data']['slow_value']
                fast_val = compare_step['data']['fast_value']
                
                narrative += f"## Step {step_counter}: Compare `arr[{compare_step['data']['fast_index']}]` and `arr[{compare_step['data']['slow_index']}]`\n\n"
                narrative += "**State Before Comparison:**\n```\n" + self._render_array_state_narrative(compare_step['data']['visualization']) + "```\n"
                narrative += f"**Decision:** Compare value at `fast` pointer (`{fast_val}`) with value at `slow` pointer (`{slow_val}`).\n"

                if action_step['type'] == "HANDLE_DUPLICATE":
                    narrative += f"**Result:** `{fast_val} == {slow_val}`. This is a **duplicate**.\n"
                    narrative += "**Action:** Increment the `fast` pointer to scan the next element.\n\n"
                    narrative += "**State After Action:**\n```\n" + self._render_array_state_narrative(action_step['data']['visualization']) + "```\n"
                
                elif action_step['type'] == "HANDLE_UNIQUE":
                    dest_index = action_step['data']['dest_index']
                    old_val_at_dest = compare_step['data']['visualization']['array'][dest_index]['value']

                    narrative += f"**Result:** `{fast_val} != {slow_val}`. This is a **new unique element**.\n"
                    narrative += "**Action:**\n"
                    narrative += f"1. Increment `slow` pointer to index `{dest_index}`.\n"
                    narrative += f"2. **Copy value `{fast_val}` from index `{action_step['data']['source_index']}` to index `{dest_index}`, overwriting `{old_val_at_dest}`.**\n"
                    narrative += f"3. Increment `fast` pointer to continue scanning.\n\n"
                    narrative += "**State After Action:**\n```\n" + self._render_array_state_narrative(action_step['data']['visualization']) + "```\n"

                narrative += "---\n\n"
                i += 2
                step_counter += 1
                continue

            if step_type == "ALGORITHM_COMPLETE":
                narrative += f"## Step {step_counter}: {step['description']}\n\n"
                narrative += f"The `fast` pointer has reached the end of the array. The algorithm is complete.\n"
                narrative += f"The unique elements are from index 0 to the final `slow` pointer position ({self.slow}).\n\n"
                narrative += "**Final Array State:**\n```\n" + self._render_array_state_narrative(step['data']['visualization']) + "```\n"
                narrative += f"**Final Unique Array Slice:** `{step['data']['final_array_slice']}`\n"
                narrative += f"**Total Unique Elements:** `{step['data']['unique_count']}`\n\n"
                i += 1
                step_counter += 1
                continue
            
            i += 1

        return narrative
