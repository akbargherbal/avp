# /home/akbar/Jupyter_Notebooks/interval-viz-poc/backend/algorithms/registry.py
"""
Algorithm Registry for automatic discovery and routing.

This registry system allows adding new algorithms without modifying
app.py or frontend components. Each algorithm tracer registers itself
with metadata that drives the frontend UI and routing logic.

Phase 2: Dynamic algorithm discovery and unified routing
"""
import os
from pathlib import Path
from typing import Dict, Type, List, Any, Optional
from .base_tracer import AlgorithmTracer
import inspect


class AlgorithmRegistry:
    """
    Central registry for algorithm tracers.

    Provides:
    - Algorithm registration with metadata
    - Retrieval by algorithm name
    - List all available algorithms with metadata
    - Validation of tracer implementations
    """

    def __init__(self):
        """Initialize empty registry."""
        self._algorithms: Dict[str, Dict[str, Any]] = {}

    def register(
        self,
        name: str,
        tracer_class: Type[AlgorithmTracer],
        display_name: str,
        description: str,
        example_inputs: List[Dict[str, Any]],
        input_schema: Optional[Dict[str, Any]] = None,
    ):
        """
        Register an algorithm tracer with metadata.

        Args:
            name: Unique identifier (e.g., 'binary-search', 'interval-coverage')
            tracer_class: Class inheriting from AlgorithmTracer
            display_name: Human-readable name for UI (e.g., 'Binary Search')
            description: Brief explanation of the algorithm
            example_inputs: List of example input dictionaries for quick testing
            input_schema: Optional JSON schema for input validation

        Raises:
            ValueError: If name already registered or tracer_class invalid
        """
        # Validate tracer class
        if not inspect.isclass(tracer_class):
            raise ValueError(f"tracer_class must be a class, got {type(tracer_class)}")

        if not issubclass(tracer_class, AlgorithmTracer):
            raise ValueError(
                f"{tracer_class.__name__} must inherit from AlgorithmTracer"
            )

        # Check for duplicate registration
        if name in self._algorithms:
            raise ValueError(f"Algorithm '{name}' is already registered")

        # Store algorithm metadata
        self._algorithms[name] = {
            "name": name,
            "tracer_class": tracer_class,
            "display_name": display_name,
            "description": description,
            "example_inputs": example_inputs,
            "input_schema": input_schema,
        }

    def get(self, name: str) -> Type[AlgorithmTracer]:
        """
        Retrieve tracer class by algorithm name.

        Args:
            name: Algorithm identifier

        Returns:
            Tracer class for instantiation

        Raises:
            KeyError: If algorithm not found
        """
        if name not in self._algorithms:
            available = ", ".join(self._algorithms.keys())
            raise KeyError(
                f"Algorithm '{name}' not found. " f"Available algorithms: {available}"
            )

        return self._algorithms[name]["tracer_class"]

    def get_metadata(self, name: str) -> Dict[str, Any]:
        """
        Get complete metadata for an algorithm (excluding tracer_class).

        Args:
            name: Algorithm identifier

        Returns:
            Dictionary with display_name, description, example_inputs, etc.

        Raises:
            KeyError: If algorithm not found
        """
        if name not in self._algorithms:
            raise KeyError(f"Algorithm '{name}' not found")

        # Return copy without tracer_class (not JSON-serializable)
        metadata = self._algorithms[name].copy()
        del metadata["tracer_class"]
        return metadata

    def get_info(self, algorithm_name: str) -> str:
        """
        Retrieve algorithm information markdown.

        Args:
            algorithm_name: Algorithm identifier (e.g., 'binary-search')

        Returns:
            str: Markdown content

        Raises:
            ValueError: If algorithm not registered or info file missing
        """
        if algorithm_name not in self._algorithms:
            raise ValueError(
                f"Unknown algorithm: '{algorithm_name}'. "
                f"Available: {list(self._algorithms.keys())}"
            )

        # Construct path to info file relative to this file's location
        # backend/algorithms/registry.py -> backend/ -> interval-viz-poc/
        base_dir = Path(__file__).parent.parent.parent
        info_path = base_dir / "docs" / "algorithm-info" / f"{algorithm_name}.md"

        if not info_path.exists():
            raise ValueError(
                f"Algorithm info file not found: {info_path}. "
                f"Create docs/algorithm-info/{algorithm_name}.md"
            )

        return info_path.read_text(encoding="utf-8")

    def list_algorithms(self) -> List[Dict[str, Any]]:
        """
        Return list of all registered algorithms with metadata.

        Returns:
            List of algorithm metadata dictionaries (without tracer_class)
            Suitable for JSON serialization to frontend.

        Example:
            [
                {
                    'name': 'binary-search',
                    'display_name': 'Binary Search',
                    'description': 'Search sorted array in O(log n) time',
                    'example_inputs': [...]
                },
                ...
            ]
        """
        return [self.get_metadata(name) for name in self._algorithms.keys()]

    def is_registered(self, name: str) -> bool:
        """Check if algorithm is registered."""
        return name in self._algorithms

    def count(self) -> int:
        """Return number of registered algorithms."""
        return len(self._algorithms)

    def __contains__(self, name: str) -> bool:
        """Support 'name in registry' syntax."""
        return self.is_registered(name)

    def __len__(self) -> int:
        """Support len(registry) syntax."""
        return self.count()


# =============================================================================
# Singleton Registry Instance
# =============================================================================

# Create global registry instance
registry = AlgorithmRegistry()


# =============================================================================
# Algorithm Registrations
# =============================================================================


def register_algorithms():
    """
    Register all available algorithm tracers.

    This function is called once during module import to populate
    the registry. Adding a new algorithm only requires adding a
    registration call here.
    """

    # Import algorithm tracers
    from .binary_search import BinarySearchTracer
    from .interval_coverage import IntervalCoverageTracer
    from .two_pointer import TwoPointerTracer
    from .sliding_window import SlidingWindowTracer
    from .merge_sort import MergeSortTracer

    # -------------------------------------------------------------------------
    # Interval Coverage (PoC Algorithm - Now Refactored!)
    # -------------------------------------------------------------------------
    if not registry.is_registered("interval-coverage"):
        registry.register(
            name="interval-coverage",
            tracer_class=IntervalCoverageTracer,
            display_name="Interval Coverage",
            description="Remove intervals that are completely covered by other intervals using a greedy recursive strategy",
            example_inputs=[
                {
                    "name": "Basic Example - 4 Intervals",
                    "input": {
                        "intervals": [
                            {"id": 1, "start": 540, "end": 660, "color": "blue"},
                            {"id": 2, "start": 600, "end": 720, "color": "green"},
                            {"id": 3, "start": 540, "end": 720, "color": "amber"},
                            {"id": 4, "start": 900, "end": 960, "color": "purple"},
                        ]
                    },
                },
                {
                    "name": "No Overlap - All Kept",
                    "input": {
                        "intervals": [
                            {"id": 1, "start": 100, "end": 200, "color": "blue"},
                            {"id": 2, "start": 300, "end": 400, "color": "green"},
                            {"id": 3, "start": 500, "end": 600, "color": "amber"},
                        ]
                    },
                },
                {
                    "name": "Full Coverage - Only One Kept",
                    "input": {
                        "intervals": [
                            {"id": 1, "start": 100, "end": 500, "color": "blue"},
                            {"id": 2, "start": 150, "end": 250, "color": "green"},
                            {"id": 3, "start": 200, "end": 300, "color": "amber"},
                            {"id": 4, "start": 350, "end": 450, "color": "purple"},
                        ]
                    },
                },
                {
                    "name": "Complex Case - 6 Intervals",
                    "input": {
                        "intervals": [
                            {"id": 1, "start": 0, "end": 300, "color": "blue"},
                            {"id": 2, "start": 100, "end": 200, "color": "green"},
                            {"id": 3, "start": 250, "end": 500, "color": "amber"},
                            {"id": 4, "start": 150, "end": 350, "color": "purple"},
                            {"id": 5, "start": 600, "end": 700, "color": "red"},
                            {"id": 6, "start": 650, "end": 800, "color": "orange"},
                        ]
                    },
                },
            ],
            input_schema={
                "type": "object",
                "required": ["intervals"],
                "properties": {
                    "intervals": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "required": ["id", "start", "end", "color"],
                            "properties": {
                                "id": {"type": "integer"},
                                "start": {"type": "integer"},
                                "end": {"type": "integer"},
                                "color": {"type": "string"},
                            },
                        },
                        "minItems": 1,
                        "maxItems": 100,
                        "description": "List of time intervals to analyze",
                    }
                },
            },
        )

    # -------------------------------------------------------------------------
    # Binary Search
    # -------------------------------------------------------------------------
    if not registry.is_registered("binary-search"):
        registry.register(
            name="binary-search",
            tracer_class=BinarySearchTracer,
            display_name="Binary Search",
            description="Search for a target value in a sorted array using divide-and-conquer strategy (O(log n) time complexity)",
            example_inputs=[
                {
                    "name": "Basic Search - Target Found",
                    "input": {
                        "array": [
                            4,
                            11,
                            12,
                            14,
                            22,
                            23,
                            33,
                            34,
                            39,
                            48,
                            51,
                            59,
                            63,
                            69,
                            70,
                            71,
                            74,
                            79,
                        ],
                        "target": 59,
                    },
                },
                {
                    "name": "Basic Search - Target Not Found",
                    "input": {"array": [1, 3, 5, 7, 9, 11, 13, 15], "target": 6},
                },
                {
                    "name": "Large Array",
                    "input": {
                        "array": list(range(1, 101, 2)),  # [1, 3, 5, ..., 99]
                        "target": 51,
                    },
                },
                {
                    "name": "Single Element - Found",
                    "input": {"array": [42], "target": 42},
                },
                {
                    "name": "Target at Start",
                    "input": {"array": [10, 20, 30, 40, 50], "target": 10},
                },
                {
                    "name": "Target at End",
                    "input": {"array": [10, 20, 30, 40, 50], "target": 50},
                },
            ],
            input_schema={
                "type": "object",
                "required": ["array", "target"],
                "properties": {
                    "array": {
                        "type": "array",
                        "items": {"type": "integer"},
                        "minItems": 1,
                        "description": "Sorted array of integers",
                    },
                    "target": {"type": "integer", "description": "Value to search for"},
                },
            },
        )

    # -------------------------------------------------------------------------
    # Two Pointer Pattern
    # -------------------------------------------------------------------------
    if not registry.is_registered("two-pointer"):
        registry.register(
            name="two-pointer",
            tracer_class=TwoPointerTracer,
            display_name="Two Pointer Pattern",
            description="Remove duplicates from a sorted array in-place using a slow and fast pointer technique.",
            example_inputs=[
                {
                    "name": "Basic Duplicates",
                    "input": {
                        "array": [0, 1, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 8, 8, 9]
                    },
                },
                {"name": "All Unique", "input": {"array": [1, 2, 3, 4, 5]}},
                {"name": "All Duplicates", "input": {"array": [1, 1, 1, 1, 1]}},
            ],
            input_schema={
                "type": "object",
                "required": ["array"],
                "properties": {
                    "array": {
                        "type": "array",
                        "items": {"type": "integer"},
                        "description": "Sorted array of integers, may contain duplicates",
                    }
                },
            },
        )

    # -------------------------------------------------------------------------
    # Sliding Window Pattern
    # -------------------------------------------------------------------------
    if not registry.is_registered("sliding-window"):
        registry.register(
            name="sliding-window",
            tracer_class=SlidingWindowTracer,
            display_name="Sliding Window Pattern",
            description="Find maximum sum subarray of a fixed size k",
            example_inputs=[
                {
                    "name": "Basic",
                    "input": {"array": [1, 5, 1, 3, 2, 5, 1, 6, 7, 0, 5], "k": 3},
                },
                {
                    "name": "Increasing Trend",
                    "input": {"array": [1, 2, 3, 4, 5, 6], "k": 3},
                },
                {
                    "name": "Decreasing Trend",
                    "input": {"array": [6, 5, 4, 3, 2, 1], "k": 4},
                },
            ],
            input_schema={
                "type": "object",
                "required": ["array", "k"],
                "properties": {
                    "array": {
                        "type": "array",
                        "items": {"type": "integer"},
                        "description": "Array of integers",
                    },
                    "k": {
                        "type": "integer",
                        "description": "The size of the sliding window",
                    },
                },
            },
        )

    # -------------------------------------------------------------------------
    # Merge Sort
    # -------------------------------------------------------------------------
    if not registry.is_registered("merge-sort"):
        registry.register(
            name="merge-sort",
            tracer_class=MergeSortTracer,
            display_name="Merge Sort",
            description="Recursive divide-and-conquer sorting algorithm with O(n log n) guaranteed time complexity",
            example_inputs=[
                {
                    "name": "Basic - 8 Elements",
                    "input": {"array": [38, 27, 43, 3, 9, 82, 10, 5]},
                },
                {
                    "name": "Already Sorted",
                    "input": {"array": [1, 2, 3, 4, 5, 6, 7, 8]},
                },
                {
                    "name": "Reverse Sorted",
                    "input": {"array": [8, 7, 6, 5, 4, 3, 2, 1]},
                },
                {
                    "name": "With Duplicates",
                    "input": {"array": [5, 2, 8, 2, 9, 1, 5, 5]},
                },
                {"name": "Small Array", "input": {"array": [3, 1, 4, 1, 5]}},
                {
                    "name": "Larger Array - 12 Elements",
                    "input": {
                        "array": [64, 34, 25, 12, 22, 11, 90, 88, 45, 50, 33, 17]
                    },
                },
            ],
            input_schema={
                "type": "object",
                "required": ["array"],
                "properties": {
                    "array": {
                        "type": "array",
                        "items": {"type": "number"},
                        "minItems": 1,
                        "maxItems": 12,
                        "description": "Array of numbers to sort (8-12 elements recommended)",
                    }
                },
            },
        )


# Auto-register algorithms on module import
# Added idempotency checks to prevent re-registration during hot-reloading
if not registry.is_registered("binary-search"):
    register_algorithms()


# =============================================================================
# Convenience Functions
# =============================================================================


def get_algorithm_names() -> List[str]:
    """Get list of all registered algorithm names."""
    return list(registry._algorithms.keys())


def get_algorithm(name: str) -> Type[AlgorithmTracer]:
    """Alias for registry.get() for convenience."""
    return registry.get(name)
