# backend/algorithms/tests/conftest.py
"""
Shared pytest fixtures for algorithm tests.

This module provides common fixtures used across all test modules:
- Mock tracer implementations for testing base_tracer
- Registry management fixtures
- Sample data generators
"""

import pytest
from typing import Any, List, Dict
from algorithms.base_tracer import AlgorithmTracer, TraceStep


# =============================================================================
# Mock Tracer Implementations for Testing
# =============================================================================

class MinimalTracer(AlgorithmTracer):
    """
    Minimal concrete implementation of AlgorithmTracer for testing.
    
    This implements only the required abstract methods with simple behavior.
    Used to test base_tracer functionality without algorithm complexity.
    """
    
    def execute(self, input_data: Any) -> dict:
        """Execute a simple algorithm that just counts."""
        self.metadata = {
            "algorithm": "minimal-test",
            "visualization_type": "test"
        }
        
        count = input_data.get("count", 3)
        for i in range(count):
            self._add_step(
                step_type="COUNT",
                data={"value": i},
                description=f"Counting: {i}"
            )
        
        return self._build_trace_result({"final_count": count})
    
    def get_prediction_points(self) -> List[Dict[str, Any]]:
        """Return empty prediction points for testing."""
        return []


class VizEnrichmentTracer(AlgorithmTracer):
    """
    Tracer that tests automatic visualization enrichment.
    
    Overrides _get_visualization_state() to test the automatic
    enrichment feature of _add_step().
    """
    
    def __init__(self):
        super().__init__()
        self.current_state = "initial"
    
    def execute(self, input_data: Any) -> dict:
        """Execute with automatic state enrichment."""
        self.metadata = {
            "algorithm": "viz-enrichment-test",
            "visualization_type": "test"
        }
        
        # Step 1: Initial state
        self.current_state = "step1"
        self._add_step(
            step_type="STEP_1",
            data={"manual_data": "value1"},
            description="First step"
        )
        
        # Step 2: Changed state
        self.current_state = "step2"
        self._add_step(
            step_type="STEP_2",
            data={"manual_data": "value2"},
            description="Second step"
        )
        
        return self._build_trace_result({"result": "done"})
    
    def get_prediction_points(self) -> List[Dict[str, Any]]:
        """Return sample prediction point."""
        return [
            {
                "step_index": 0,
                "question": "What will happen next?",
                "choices": ["A", "B"],
                "correct_answer": "A"
            }
        ]
    
    def _get_visualization_state(self) -> dict:
        """Return current state for automatic enrichment."""
        return {
            "state": self.current_state,
            "extra": "auto_enriched"
        }


class PredictionTracer(AlgorithmTracer):
    """
    Tracer that generates multiple prediction points for testing.
    """
    
    def execute(self, input_data: Any) -> dict:
        """Execute with multiple steps for prediction testing."""
        self.metadata = {
            "algorithm": "prediction-test",
            "visualization_type": "test"
        }
        
        for i in range(5):
            self._add_step(
                step_type="PREDICT_STEP",
                data={"step": i},
                description=f"Step {i}"
            )
        
        return self._build_trace_result({"result": "complete"})
    
    def get_prediction_points(self) -> List[Dict[str, Any]]:
        """Return multiple prediction points."""
        return [
            {
                "step_index": 1,
                "question": "First prediction?",
                "choices": ["A", "B", "C"],
                "hint": "Think about it",
                "correct_answer": "B"
            },
            {
                "step_index": 3,
                "question": "Second prediction?",
                "choices": ["X", "Y"],
                "correct_answer": "X"
            }
        ]


class MaxStepsTracer(AlgorithmTracer):
    """
    Tracer that can exceed MAX_STEPS for testing the limit.
    """
    
    def execute(self, input_data: Any) -> dict:
        """Execute with configurable step count."""
        self.metadata = {
            "algorithm": "max-steps-test",
            "visualization_type": "test"
        }
        
        step_count = input_data.get("steps", 5)
        
        for i in range(step_count):
            self._add_step(
                step_type="STEP",
                data={"i": i},
                description=f"Step {i}"
            )
        
        return self._build_trace_result({"steps_executed": step_count})
    
    def get_prediction_points(self) -> List[Dict[str, Any]]:
        """No predictions needed for this test."""
        return []


# =============================================================================
# Pytest Fixtures
# =============================================================================

@pytest.fixture
def minimal_tracer():
    """Provide a minimal tracer instance."""
    return MinimalTracer()


@pytest.fixture
def viz_enrichment_tracer():
    """Provide a tracer with visualization enrichment."""
    return VizEnrichmentTracer()


@pytest.fixture
def prediction_tracer():
    """Provide a tracer with multiple prediction points."""
    return PredictionTracer()


@pytest.fixture
def max_steps_tracer():
    """Provide a tracer for testing MAX_STEPS limit."""
    return MaxStepsTracer()


@pytest.fixture
def sample_trace_step():
    """Provide a sample TraceStep for testing."""
    return TraceStep(
        step=0,
        type="TEST_STEP",
        timestamp=0.001,
        data={"test": "data"},
        description="Test step description"
    )


# =============================================================================
# Registry Fixtures (for future sessions)
# =============================================================================

@pytest.fixture
def clean_registry():
    """
    Provide a clean registry instance.
    
    Note: This will be expanded in Session 27 when we test registry.py
    For now, it's a placeholder for consistency.
    """
    from algorithms.registry import AlgorithmRegistry
    return AlgorithmRegistry()


# =============================================================================
# Sample Data Generators
# =============================================================================

@pytest.fixture
def sample_binary_search_input():
    """Sample input for binary search algorithm."""
    return {
        "array": [1, 3, 5, 7, 9, 11, 13, 15],
        "target": 7
    }


@pytest.fixture
def sample_interval_input():
    """Sample input for interval coverage algorithm."""
    return {
        "intervals": [
            {"id": 1, "start": 100, "end": 300, "color": "blue"},
            {"id": 2, "start": 150, "end": 250, "color": "green"},
            {"id": 3, "start": 400, "end": 500, "color": "amber"}
        ]
    }