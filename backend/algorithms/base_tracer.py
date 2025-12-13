# backend/algorithms/base_tracer.py
"""
Base class for algorithm tracers in the educational visualization platform.

This abstract base class defines the common interface and utilities that all
algorithm implementations must follow to generate traces compatible with the
frontend visualization system.

Philosophy: Backend does ALL the thinking, frontend does ALL the reacting.

Version: 2.0 - Added narrative generation requirement (WORKFLOW.md v2.0)
"""

from abc import ABC, abstractmethod
from typing import Any, List, Dict
from dataclasses import dataclass, asdict
import time


@dataclass
class TraceStep:
    """
    A single step in the algorithm execution trace.

    This structure is shared across all algorithms to ensure consistent
    visualization on the frontend.
    """
    step: int
    type: str
    timestamp: float
    data: dict
    description: str


class AlgorithmTracer(ABC):
    """
    Abstract base class for algorithm trace generation.

    All algorithm implementations inherit from this class and implement:
    - execute(): Main algorithm entry point
    - get_prediction_points(): Educational prediction moments
    - generate_narrative(): Convert trace to human-readable markdown (NEW in v2.0)
    - _get_visualization_state(): Optional hook for automatic state enrichment

    The base class provides:
    - Trace step recording with _add_step()
    - Automatic visualization state enrichment
    - Safety limits (MAX_STEPS to prevent infinite loops)
    - Common serialization utilities
    - Consistent metadata structure
    """

    MAX_STEPS = 10000

    def __init__(self):
        """Initialize tracer with empty trace and reset counters."""
        self.trace = []
        self.step_count = 0
        self.start_time = time.time()
        self.metadata = {}

    @abstractmethod
    def execute(self, input_data: Any) -> dict:
        """
        Execute the algorithm and generate complete trace.

        This method must be implemented by each algorithm to:
        1. Validate input
        2. Execute algorithm with trace generation
        3. Return standardized result structure

        Args:
            input_data: Algorithm-specific input (intervals, arrays, graphs, etc.)

        Returns:
            dict: {
                "result": <algorithm output>,
                "trace": {
                    "steps": [list of TraceStep dicts],
                    "total_steps": int,
                    "duration": float
                },
                "metadata": {
                    "algorithm": str,
                    "visualization_type": str,  # For frontend visualization registry
                    "prediction_points": [...],  # For prediction mode
                    "visualization_config": {...},  # Optional rendering hints
                    ... other algorithm-specific metadata
                }
            }
        """
        pass

    @abstractmethod
    def get_prediction_points(self) -> List[Dict[str, Any]]:
        """
        Identify prediction moments in the trace for active learning.

        Returns a list of prediction opportunities where students should
        pause and predict the algorithm's next decision.

        Returns:
            list: [
                {
                    "step_index": int,           # Which step to pause at
                    "question": str,             # Question to ask student
                    "choices": [str, ...],       # Possible answers
                    "hint": str,                 # Optional hint
                    "correct_answer": str        # For validation
                },
                ...
            ]

        Example for interval coverage:
            {
                "step_index": 5,
                "question": "Will this interval be kept or covered?",
                "choices": ["keep", "covered"],
                "hint": "Compare interval.end with max_end",
                "correct_answer": "keep"
            }

        Example for binary search:
            {
                "step_index": 3,
                "question": "Will we search left or right of mid?",
                "choices": ["search-left", "search-right", "found"],
                "hint": "Compare mid value with target",
                "correct_answer": "search-right"
            }
        """
        pass

    @abstractmethod
    def generate_narrative(self, trace_result: dict) -> str:
        """
        Convert trace JSON to human-readable markdown narrative.

        This method transforms the algorithm's execution trace into a narrative
        that allows QA reviewers and students to understand the algorithm's
        logic WITHOUT needing to reference code or raw JSON.

        CRITICAL REQUIREMENTS (from BACKEND_CHECKLIST.md v2.0):
        1. Show ALL decision data - if you reference a variable, SHOW its value
        2. Make comparisons explicit with actual values
        3. Explain decision outcomes clearly
        4. Fail loudly (KeyError) if visualization data is incomplete
        5. Narrative must be self-contained and logically complete

        Args:
            trace_result: Complete trace dictionary returned by execute()
                         Contains: result, trace, metadata

        Returns:
            str: Markdown-formatted narrative of the algorithm execution

        Raises:
            KeyError: If required visualization data is missing (this is GOOD - catches bugs!)
            NotImplementedError: If subclass doesn't implement this method

        Example Structure:
            # [Algorithm Name] Execution Narrative

            **Input:** [Describe input with key parameters]
            **Goal:** [What we're trying to achieve]

            ## Step 0: [Description]
            **State:** [Show relevant visualization state]
            **Decision:** [If applicable, show comparison with actual values]
            **Result:** [Outcome of decision]

            ## Step 1: ...

            ## Final Result
            **Output:** [Algorithm result]
            **Performance:** [Key metrics if applicable]

        Anti-Patterns to AVOID:
        - ❌ Referencing undefined variables: "Compare with max_end" (but max_end not shown)
        - ❌ Skipping decision outcomes: "Examining interval... [next step unrelated]"
        - ❌ Narratives requiring code to understand
        - ❌ Missing visualization data references

        Good Patterns:
        - ✅ "Compare interval.start (600) with max_end (660) → 600 < 660"
        - ✅ "Decision: Keep interval [600, 720] because it extends coverage"
        - ✅ Show array/graph state at each decision point
        - ✅ Temporal coherence: step N clearly leads to step N+1

        Note:
            This narrative is reviewed by QA BEFORE frontend integration.
            Missing data caught here prevents bugs in production.
        """
        raise NotImplementedError(
            f"{self.__class__.__name__} must implement generate_narrative(). "
            "See BACKEND_CHECKLIST.md v2.0 for implementation pattern and examples."
        )

    def _get_visualization_state(self) -> dict:
        """
        Optional hook: Return current visualization state for enrichment.

        This method is called automatically by _add_step() to enrich each
        trace step with visualization data. Subclasses override this to
        provide algorithm-specific state that the frontend needs for rendering.

        The default implementation returns an empty dict (no-op), ensuring
        backward compatibility with existing algorithms that manually include
        visualization data in their _add_step() calls.

        Returns:
            dict: Visualization state to merge into step data under 'visualization' key.
                  Empty dict if no automatic enrichment needed.

        Examples:
            # Interval Coverage
            return {
                'all_intervals': [
                    {'id': 1, 'start': 540, 'end': 660, 'state': 'examining'},
                    ...
                ],
                'call_stack_state': [
                    {'interval_id': 1, 'type': 'EXAMINING'},
                    ...
                ]
            }

            # Binary Search
            return {
                'array': [
                    {'index': 0, 'value': 1, 'state': 'excluded'},
                    {'index': 1, 'value': 3, 'state': 'active_range'},
                    ...
                ],
                'pointers': {
                    'left': 0,
                    'right': 9,
                    'mid': 4,
                    'target': 7
                }
            }

            # Depth-First Search
            return {
                'graph': {
                    'nodes': [
                        {'id': 'A', 'state': 'visited'},
                        {'id': 'B', 'state': 'examining'},
                        ...
                    ],
                    'edges': [
                        {'from': 'A', 'to': 'B', 'state': 'traversed'},
                        ...
                    ]
                },
                'search_state': {
                    'current': 'B',
                    'visited': ['A'],
                    'stack': ['C', 'D']
                }
            }
        """
        return {}

    def _add_step(self, step_type: str, data: dict, description: str):
        """
        Record a step in the algorithm execution.

        This is the core trace generation method used by algorithm implementations.
        It enforces the MAX_STEPS limit, creates a standardized TraceStep, and
        automatically enriches the step data with visualization state from
        _get_visualization_state().

        Args:
            step_type: Category of step (e.g., "EXAMINING_INTERVAL", "CALCULATE_MID")
            data: Step-specific data (must be JSON-serializable)
            description: Human-readable explanation of what's happening

        Raises:
            RuntimeError: If MAX_STEPS exceeded (prevents infinite loops)

        Note:
            If _get_visualization_state() returns a non-empty dict, it will be
            merged into the step data under the 'visualization' key. This allows
            the frontend to access consistent visualization state without requiring
            algorithms to manually include it in every _add_step() call.
        """
        if self.step_count >= self.MAX_STEPS:
            raise RuntimeError(
                f"Trace generation aborted: Exceeded maximum of {self.MAX_STEPS} steps. "
                "The input may be too complex or causing an infinite loop."
            )

        # Automatically enrich step data with visualization state
        viz_state = self._get_visualization_state()
        if viz_state:
            enriched_data = {**data, 'visualization': viz_state}
        else:
            enriched_data = data

        self.trace.append(TraceStep(
            step=self.step_count,
            type=step_type,
            timestamp=time.time() - self.start_time,
            data=enriched_data,
            description=description
        ))
        self.step_count += 1

    def _serialize_value(self, value):
        """
        Convert Python values to JSON-safe values.

        Handles special cases like infinity that don't serialize to JSON.

        Args:
            value: Any Python value

        Returns:
            JSON-serializable value (or None for inf/-inf)
        """
        if value == float('-inf'):
            return None
        if value == float('inf'):
            return None
        return value

    def _build_trace_result(self, algorithm_result: Any) -> dict:
        """
        Build the standardized trace result structure.

        This helper ensures all algorithms return consistent structure.
        It automatically generates prediction points and includes them
        in the metadata.

        Args:
            algorithm_result: The algorithm's output (kept intervals, sorted array, etc.)

        Returns:
            dict: Standardized result with trace and metadata
        """
        # Generate prediction points after trace is complete
        prediction_points = self.get_prediction_points()

        # Add prediction points to metadata
        self.metadata["prediction_points"] = prediction_points

        return {
            "result": algorithm_result,
            "trace": {
                "steps": [asdict(s) for s in self.trace],
                "total_steps": len(self.trace),
                "duration": time.time() - self.start_time
            },
            "metadata": self.metadata
        }
