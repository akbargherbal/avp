# backend/algorithms/sliding_window.py
"""
Sliding Window algorithm tracer for educational visualization.

Implements the "maximum sum subarray of size k" pattern. This demonstrates
an efficient technique for processing contiguous blocks of data.
"""

from typing import Any, List, Dict
from .base_tracer import AlgorithmTracer

class SlidingWindowTracer(AlgorithmTracer):
    """
    Tracer for the Sliding Window pattern (Maximum Sum Subarray).

    Visualization shows:
    - Array elements with states (in_window, next, unprocessed)
    - Pointers for window boundaries (window_start, window_end)
    - Metrics: current_sum and max_sum.

    Prediction points ask: "When the window slides, will the sum
    increase, decrease, or stay the same?"
    """

    def __init__(self):
        super().__init__()
        self.array: List[int] = []
        self.k: int = 0
        self.window_start: int = 0
        self.current_sum: int = 0
        self.max_sum: int = 0
        self.max_sum_start_index: int = 0
        self.is_complete: bool = False

    def _get_element_state(self, index: int) -> str:
        """Determine the visual state of an array element."""
        window_end = self.window_start + self.k - 1
        if self.window_start <= index <= window_end:
            return 'in_window'
        if index == window_end + 1 and not self.is_complete:
            return 'next'
        return 'unprocessed'

    def _get_visualization_state(self) -> dict:
        """Return current array state with element states, pointers, and metrics."""
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
                'window_start': self.window_start,
                'window_end': self.window_start + self.k - 1,
            },
            'metrics': {
                'k': self.k,
                'current_sum': self.current_sum,
                'max_sum': self.max_sum,
                'max_window_start': self.max_sum_start_index
            }
        }

    def execute(self, input_data: Any) -> dict:
        """Execute the Sliding Window (max sum subarray) algorithm."""
        # 1. Input Validation
        if not isinstance(input_data, dict) or 'array' not in input_data or 'k' not in input_data:
            raise ValueError("Input must be a dictionary with 'array' and 'k' keys.")

        self.array = input_data['array']
        self.k = input_data['k']

        if self.k <= 0 or self.k > len(self.array):
            raise ValueError(f"Window size k ({self.k}) must be between 1 and the array length ({len(self.array)}).")

        # 2. Metadata Setup
        self.metadata = {
            'algorithm': 'sliding-window',
            'display_name': 'Sliding Window Pattern',
            'visualization_type': 'array',
            'input_size': len(self.array),
            'input_data': {'array': self.array, 'k': self.k} # Store for narrative
        }

        # 3. Initial Window
        self.window_start = 0
        self.current_sum = sum(self.array[0:self.k])
        self.max_sum = self.current_sum
        self.max_sum_start_index = 0

        self._add_step(
            "INITIAL_WINDOW",
            {},
            f"🚀 Start: Initial window of size {self.k} has sum {self.current_sum}."
        )

        # 4. Main Loop - REFACTORED
        for i in range(self.k, len(self.array)):
            # --- REFACTOR: Consolidate logic before adding the step ---
            # A. Capture state before the slide
            old_sum = self.current_sum
            previous_max_sum = self.max_sum
            outgoing_element = {'index': i - self.k, 'value': self.array[i - self.k]}
            incoming_element = {'index': i, 'value': self.array[i]}

            # B. Perform the slide and update state
            self.current_sum = self.current_sum - outgoing_element['value'] + incoming_element['value']
            self.window_start += 1

            max_sum_updated = False
            if self.current_sum > self.max_sum:
                self.max_sum = self.current_sum
                self.max_sum_start_index = self.window_start
                max_sum_updated = True

            # C. Add a single, cohesive step with all transition data
            self._add_step(
                "SLIDE_WINDOW", # New, consolidated step type
                {
                    # Data required for the new narrative format
                    'old_sum': old_sum,
                    'new_sum': self.current_sum,
                    'outgoing_element': outgoing_element,
                    'incoming_element': incoming_element,
                    'max_sum_updated': max_sum_updated,
                    'previous_max_sum': previous_max_sum,
                    'window_indices': [self.window_start, self.window_start + self.k - 1],
                    'window_subarray': self.array[self.window_start : self.window_start + self.k]
                },
                f"Window slides right. Sum changes from {old_sum} to {self.current_sum}."
            )

        # 5. Final State
        self.is_complete = True
        self._add_step(
            "ALGORITHM_COMPLETE",
            {},
            f"✅ Complete! Maximum sum found is {self.max_sum}."
        )

        # 6. Return Result
        return self._build_trace_result({
            'max_sum': self.max_sum,
            'window': self.array[self.max_sum_start_index : self.max_sum_start_index + self.k]
        })

    def get_prediction_points(self) -> List[Dict[str, Any]]:
        """Identify prediction opportunities for each window slide."""
        predictions = []
        # REFACTOR: Trigger on the new 'SLIDE_WINDOW' step type
        for i, step in enumerate(self.trace):
            if step.type == "SLIDE_WINDOW":
                data = step.data
                outgoing = data['outgoing_element']['value']
                incoming = data['incoming_element']['value']

                correct_answer = ""
                if incoming > outgoing:
                    correct_answer = "increase"
                elif incoming < outgoing:
                    correct_answer = "decrease"
                else:
                    correct_answer = "stay_same"

                predictions.append({
                    'step_index': i,
                    'question': f"The window will slide. The outgoing element is {outgoing} and the incoming is {incoming}. How will the sum change?",
                    'choices': [
                        {'id': 'increase', 'label': 'Increase'},
                        {'id': 'decrease', 'label': 'Decrease'},
                        {'id': 'stay_same', 'label': 'Stay the Same'}
                    ],
                    'hint': "Compare the value of the element entering the window with the one leaving.",
                    'correct_answer': correct_answer,
                    'explanation': f"Correct. Since the incoming element ({incoming}) is {'greater than' if correct_answer == 'increase' else 'less than' if correct_answer == 'decrease' else 'equal to'} the outgoing element ({outgoing}), the sum will {correct_answer.replace('_', ' ')}."
                })
        return predictions

    def _render_array_state_narrative(self, viz_data: dict) -> str:
        """Helper to create a text visualization of the array state for the narrative."""
        array = viz_data.get('array', [])
        if not array: return "Array is empty.\n"

        s = "```\n"
        s += "Index: " + " ".join(f"{elem['index']:<4}" for elem in array) + "\n"
        s += "Value: " + " ".join(f"{elem['value']:<4}" for elem in array) + "\n"
        s += "State: " + " ".join(f"{elem['state'][:4]:<4}" for elem in array) + "\n"
        s += "```\n"
        return s

    def generate_narrative(self, trace_result: dict) -> str:
        """
        Generate a human-readable narrative from the Sliding Window trace.
        REFACTORED to implement the improved pedagogical format with:
        - Result field traceability (position tracking context)
        - Frontend visualization hints
        """
        steps = trace_result['trace']['steps']
        metadata = trace_result['metadata']
        result = trace_result['result']

        narrative = f"# Sliding Window: Maximum Sum Subarray\n\n"
        narrative += f"**Input Array:** `{metadata.get('input_data', {}).get('array')}`\n"
        narrative += f"**Window Size (k):** `{metadata.get('input_data', {}).get('k')}`\n"
        narrative += f"**Goal:** Find the contiguous subarray of size {self.k} with the maximum sum.\n"
        narrative += f"**Result:** Found a maximum sum of **{result['max_sum']}** with the subarray `{result['window']}`.\n\n"

        # Requirement 2: Define State Labels
        narrative += "**State Legend:** `in_w` = In Window, `next` = Next to Enter, `unpr` = Unprocessed\n\n---\n\n"

        step_counter = 0
        for step in steps:
            step_type = step['type']
            viz = step['data']['visualization']
            metrics = viz['metrics']

            if step_type == "INITIAL_WINDOW":
                narrative += f"## Step {step_counter}: {step['description']}\n\n"
                narrative += "**Initial State:**\n"
                narrative += self._render_array_state_narrative(viz)
                narrative += f"- **Current Sum:** {metrics['current_sum']}\n"
                narrative += f"- **Max Sum:** {metrics['max_sum']}\n"
                narrative += f"- **Best Window Position:** Index {metrics['max_window_start']} (initial window)\n\n---\n\n"
                step_counter += 1

            # REFACTOR: Handle the new, consolidated 'SLIDE_WINDOW' step
            elif step_type == "SLIDE_WINDOW":
                data = step['data']

                # Requirement 3: Remove Redundancy (No "State Before")
                narrative += f"## Step {step_counter}: Slide Window Right\n\n"

                # Requirement 1: Unified Cause-Effect Flow
                narrative += "**Slide Operation (FAA Verification):**\n"
                narrative += f"- Previous Sum: `{data['old_sum']}`\n"
                narrative += f"- Remove left element (`{data['outgoing_element']['value']}` at index {data['outgoing_element']['index']}): `{data['old_sum']} - {data['outgoing_element']['value']} = {data['old_sum'] - data['outgoing_element']['value']}`\n"
                narrative += f"- Add new right element (`{data['incoming_element']['value']}` at index {data['incoming_element']['index']}): `{data['old_sum'] - data['outgoing_element']['value']} + {data['incoming_element']['value']} = {data['new_sum']}`\n"
                narrative += f"- **New Sum:** `{data['new_sum']}`\n\n"

                # FIX 1: Add position tracking context when max_sum updates
                narrative += "**Max Sum Tracking:**\n"
                if data['max_sum_updated']:
                     narrative += f"- New sum (`{data['new_sum']}`) > Previous max sum (`{data['previous_max_sum']}`) → **Update Max Sum!** 🚀\n"
                     narrative += f"- **Remember this position (index {data['window_indices'][0]})** - it achieves our best result so far.\n\n"
                else:
                     narrative += f"- New sum (`{data['new_sum']}`) <= Previous max sum (`{data['previous_max_sum']}`) → Max sum remains unchanged.\n\n"

                # Requirement 4: Explicit Window Boundaries
                narrative += f"**Window now at indices {data['window_indices'][0]}-{data['window_indices'][1]}:** `{data['window_subarray']}`\n\n"

                narrative += "**Resulting State:**\n"
                narrative += self._render_array_state_narrative(viz)
                narrative += f"- **Current Sum:** {metrics['current_sum']}\n"
                narrative += f"- **Max Sum:** {metrics['max_sum']}\n"
                narrative += f"- **Best Window Position:** Index {metrics['max_window_start']}\n\n---\n\n"
                step_counter += 1

            elif step_type == "ALGORITHM_COMPLETE":
                narrative += f"## Step {step_counter}: {step['description']}\n\n"
                narrative += "The window has reached the end of the array. The algorithm is complete.\n"
                narrative += "**Final State:**\n"
                narrative += self._render_array_state_narrative(viz)
                narrative += f"**Final Max Sum:** `{result['max_sum']}`\n"
                narrative += f"**Winning Subarray (found at index {metrics['max_window_start']}):** `{result['window']}`\n"

        # FIX 2: Add Frontend Visualization Hints section
        narrative += "\n---\n\n## 🎨 Frontend Visualization Hints\n\n"
        
        narrative += "### Primary Metrics to Emphasize\n\n"
        narrative += "- **Current Sum** (`metrics.current_sum`) - Shows real-time window sum as it slides\n"
        narrative += "- **Max Sum** (`metrics.max_sum`) - Shows progress toward optimal solution\n"
        narrative += "- **Window Position** (`metrics.max_window_start`) - Tracks where the best window was found\n\n"
        
        narrative += "### Visualization Priorities\n\n"
        narrative += "1. **Highlight active window** - Elements with `state: 'in_window'` are the primary focus\n"
        narrative += "2. **Show sum transitions** - Emphasize when `max_sum` updates (celebratory moment)\n"
        narrative += "3. **Animate window movement** - Smooth slide from left to right, showing add/remove operations\n"
        narrative += "4. **Visual contrast for next element** - `state: 'next'` should be distinct but not distracting\n\n"
        
        narrative += "### Key JSON Paths\n\n"
        narrative += "```\n"
        narrative += "step.data.visualization.metrics.current_sum\n"
        narrative += "step.data.visualization.metrics.max_sum\n"
        narrative += "step.data.visualization.metrics.max_window_start\n"
        narrative += "step.data.visualization.array[*].state  // 'in_window' | 'next' | 'unprocessed'\n"
        narrative += "step.data.visualization.pointers.window_start\n"
        narrative += "step.data.visualization.pointers.window_end\n"
        narrative += "```\n\n"
        
        narrative += "### Algorithm-Specific Guidance\n\n"
        narrative += "This algorithm's efficiency comes from **reusing the previous sum** - we don't recalculate from scratch. "
        narrative += "Consider animating the \"add new, remove old\" operation to emphasize this optimization. "
        narrative += "The moment when `max_sum` updates is pedagogically significant - it's when the learner sees the algorithm "
        narrative += "\"remember\" a better solution. Visually celebrating these moments (e.g., with a brief highlight or animation) "
        narrative += "reinforces the pattern recognition that makes sliding window powerful.\n"

        return narrative
