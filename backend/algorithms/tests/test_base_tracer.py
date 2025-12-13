# backend/algorithms/tests/test_base_tracer.py
"""
Comprehensive tests for AlgorithmTracer base class.

Coverage Target: 95%

Test Categories:
1. Abstract method enforcement
2. _add_step() mechanics (step count, MAX_STEPS)
3. _get_visualization_state() hook and enrichment
4. _serialize_value() (infinity handling)
5. _build_trace_result() structure
6. Trace timing and metadata
"""

import pytest
import time
from dataclasses import asdict
from algorithms.base_tracer import AlgorithmTracer, TraceStep


# =============================================================================
# Test Group 1: Abstract Method Enforcement
# =============================================================================

@pytest.mark.unit
class TestAbstractMethods:
    """Test that abstract methods must be implemented."""
    
    def test_cannot_instantiate_base_tracer(self):
        """AlgorithmTracer cannot be instantiated directly."""
        with pytest.raises(TypeError, match="Can't instantiate abstract class"):
            AlgorithmTracer()
    
    def test_must_implement_execute(self):
        """Subclass must implement execute() method."""
        class IncompleteTracer(AlgorithmTracer):
            def get_prediction_points(self):
                return []
        
        with pytest.raises(TypeError, match="Can't instantiate abstract class"):
            IncompleteTracer()
    
    def test_must_implement_get_prediction_points(self):
        """Subclass must implement get_prediction_points() method."""
        class IncompleteTracer(AlgorithmTracer):
            def execute(self, input_data):
                return {}
        
        with pytest.raises(TypeError, match="Can't instantiate abstract class"):
            IncompleteTracer()
    
    def test_complete_implementation_succeeds(self, minimal_tracer):
        """Properly implemented tracer can be instantiated."""
        assert isinstance(minimal_tracer, AlgorithmTracer)
        assert hasattr(minimal_tracer, 'execute')
        assert hasattr(minimal_tracer, 'get_prediction_points')


# =============================================================================
# Test Group 2: Initialization and Basic State
# =============================================================================

@pytest.mark.unit
class TestTracerInitialization:
    """Test tracer initialization and default state."""
    
    def test_initial_trace_is_empty(self, minimal_tracer):
        """New tracer starts with empty trace."""
        assert minimal_tracer.trace == []
        assert len(minimal_tracer.trace) == 0
    
    def test_initial_step_count_is_zero(self, minimal_tracer):
        """New tracer starts with step_count = 0."""
        assert minimal_tracer.step_count == 0
    
    def test_start_time_is_set(self, minimal_tracer):
        """New tracer has start_time initialized."""
        assert hasattr(minimal_tracer, 'start_time')
        assert isinstance(minimal_tracer.start_time, float)
        assert minimal_tracer.start_time > 0
    
    def test_metadata_is_empty_dict(self, minimal_tracer):
        """New tracer starts with empty metadata dict."""
        assert minimal_tracer.metadata == {}
        assert isinstance(minimal_tracer.metadata, dict)
    
    def test_max_steps_constant_exists(self, minimal_tracer):
        """MAX_STEPS constant is defined."""
        assert hasattr(AlgorithmTracer, 'MAX_STEPS')
        assert AlgorithmTracer.MAX_STEPS == 10000


# =============================================================================
# Test Group 3: _add_step() Mechanics
# =============================================================================

@pytest.mark.unit
class TestAddStep:
    """Test the core _add_step() method."""
    
    def test_add_single_step(self, minimal_tracer):
        """Adding a step creates a TraceStep and increments counter."""
        minimal_tracer._add_step(
            step_type="TEST",
            data={"key": "value"},
            description="Test step"
        )
        
        assert len(minimal_tracer.trace) == 1
        assert minimal_tracer.step_count == 1
        
        step = minimal_tracer.trace[0]
        assert isinstance(step, TraceStep)
        assert step.step == 0
        assert step.type == "TEST"
        assert step.data == {"key": "value"}
        assert step.description == "Test step"
    
    def test_add_multiple_steps(self, minimal_tracer):
        """Step count increments correctly for multiple steps."""
        for i in range(5):
            minimal_tracer._add_step(
                step_type=f"STEP_{i}",
                data={"index": i},
                description=f"Step {i}"
            )
        
        assert len(minimal_tracer.trace) == 5
        assert minimal_tracer.step_count == 5
        
        # Verify step numbers are sequential
        for i, step in enumerate(minimal_tracer.trace):
            assert step.step == i
    
    def test_step_has_timestamp(self, minimal_tracer):
        """Each step has a timestamp relative to start_time."""
        minimal_tracer._add_step(
            step_type="TIMED",
            data={},
            description="Timed step"
        )
        
        step = minimal_tracer.trace[0]
        assert hasattr(step, 'timestamp')
        assert isinstance(step.timestamp, float)
        assert step.timestamp >= 0
    
    def test_timestamps_are_increasing(self, minimal_tracer):
        """Timestamps increase as steps are added."""
        for i in range(3):
            minimal_tracer._add_step(
                step_type="TIMED",
                data={},
                description=f"Step {i}"
            )
            time.sleep(0.001)  # Small delay
        
        timestamps = [step.timestamp for step in minimal_tracer.trace]
        assert timestamps == sorted(timestamps)
        assert timestamps[1] > timestamps[0]
        assert timestamps[2] > timestamps[1]
    
    def test_max_steps_limit_enforced(self, max_steps_tracer):
        """Exceeding MAX_STEPS raises RuntimeError."""
        with pytest.raises(RuntimeError, match="Exceeded maximum of 10000 steps"):
            max_steps_tracer.execute({"steps": 10001})
    
    def test_max_steps_exactly_at_limit(self, max_steps_tracer):
        """Exactly MAX_STEPS steps is allowed."""
        # This should succeed without error
        result = max_steps_tracer.execute({"steps": 10000})
        assert result["trace"]["total_steps"] == 10000


# =============================================================================
# Test Group 4: _get_visualization_state() Hook
# =============================================================================

@pytest.mark.unit
class TestVisualizationEnrichment:
    """Test automatic visualization state enrichment."""
    
    def test_default_visualization_state_is_empty(self, minimal_tracer):
        """Default _get_visualization_state() returns empty dict."""
        viz_state = minimal_tracer._get_visualization_state()
        assert viz_state == {}
        assert isinstance(viz_state, dict)
    
    def test_empty_viz_state_no_enrichment(self, minimal_tracer):
        """When viz state is empty, no enrichment happens."""
        minimal_tracer._add_step(
            step_type="TEST",
            data={"original": "data"},
            description="Test"
        )
        
        step = minimal_tracer.trace[0]
        assert step.data == {"original": "data"}
        assert "visualization" not in step.data
    
    def test_viz_state_enrichment_occurs(self, viz_enrichment_tracer):
        """Non-empty viz state is merged into step data."""
        result = viz_enrichment_tracer.execute({})
        
        # Check first step
        first_step = result["trace"]["steps"][0]
        assert "manual_data" in first_step["data"]
        assert "visualization" in first_step["data"]
        assert first_step["data"]["visualization"]["state"] == "step1"
        assert first_step["data"]["visualization"]["extra"] == "auto_enriched"
    
    def test_viz_state_updates_between_steps(self, viz_enrichment_tracer):
        """Visualization state changes between steps."""
        result = viz_enrichment_tracer.execute({})
        
        step1 = result["trace"]["steps"][0]
        step2 = result["trace"]["steps"][1]
        
        assert step1["data"]["visualization"]["state"] == "step1"
        assert step2["data"]["visualization"]["state"] == "step2"
    
    def test_manual_data_preserved_with_enrichment(self, viz_enrichment_tracer):
        """Manual data is preserved alongside enriched viz state."""
        result = viz_enrichment_tracer.execute({})
        
        step = result["trace"]["steps"][0]
        assert step["data"]["manual_data"] == "value1"
        assert step["data"]["visualization"]["state"] == "step1"


# =============================================================================
# Test Group 5: _serialize_value()
# =============================================================================

@pytest.mark.unit
class TestSerializeValue:
    """Test value serialization for JSON compatibility."""
    
    def test_serialize_normal_values(self, minimal_tracer):
        """Normal values pass through unchanged."""
        assert minimal_tracer._serialize_value(42) == 42
        assert minimal_tracer._serialize_value("text") == "text"
        assert minimal_tracer._serialize_value(3.14) == 3.14
        assert minimal_tracer._serialize_value(True) is True
        assert minimal_tracer._serialize_value(None) is None
    
    def test_serialize_positive_infinity(self, minimal_tracer):
        """float('inf') converts to None."""
        assert minimal_tracer._serialize_value(float('inf')) is None
    
    def test_serialize_negative_infinity(self, minimal_tracer):
        """float('-inf') converts to None."""
        assert minimal_tracer._serialize_value(float('-inf')) is None
    
    def test_serialize_collections(self, minimal_tracer):
        """Lists and dicts pass through unchanged."""
        assert minimal_tracer._serialize_value([1, 2, 3]) == [1, 2, 3]
        assert minimal_tracer._serialize_value({"key": "value"}) == {"key": "value"}


# =============================================================================
# Test Group 6: _build_trace_result()
# =============================================================================

@pytest.mark.unit
class TestBuildTraceResult:
    """Test the standardized result structure builder."""
    
    def test_result_structure_has_required_keys(self, minimal_tracer):
        """Result has result, trace, and metadata keys."""
        minimal_tracer.execute({"count": 2})
        result = minimal_tracer._build_trace_result({"test": "output"})
        
        assert "result" in result
        assert "trace" in result
        assert "metadata" in result
    
    def test_result_contains_algorithm_output(self, minimal_tracer):
        """Result key contains the algorithm output."""
        minimal_tracer.execute({"count": 2})
        result = minimal_tracer._build_trace_result({"final": "result"})
        
        assert result["result"] == {"final": "result"}
    
    def test_trace_structure(self, minimal_tracer):
        """Trace has steps, total_steps, and duration."""
        minimal_tracer.execute({"count": 3})
        result = minimal_tracer._build_trace_result({})
        
        trace = result["trace"]
        assert "steps" in trace
        assert "total_steps" in trace
        assert "duration" in trace
        
        assert isinstance(trace["steps"], list)
        assert isinstance(trace["total_steps"], int)
        assert isinstance(trace["duration"], float)
    
    def test_trace_steps_are_dicts(self, minimal_tracer):
        """Trace steps are converted to dicts (JSON-serializable)."""
        minimal_tracer.execute({"count": 2})
        result = minimal_tracer._build_trace_result({})
        
        for step in result["trace"]["steps"]:
            assert isinstance(step, dict)
            assert "step" in step
            assert "type" in step
            assert "timestamp" in step
            assert "data" in step
            assert "description" in step
    
    def test_total_steps_matches_trace_length(self, minimal_tracer):
        """total_steps equals length of steps array."""
        minimal_tracer.execute({"count": 5})
        result = minimal_tracer._build_trace_result({})
        
        assert result["trace"]["total_steps"] == len(result["trace"]["steps"])
        assert result["trace"]["total_steps"] == 5
    
    def test_duration_is_positive(self, minimal_tracer):
        """Duration is a positive float."""
        minimal_tracer.execute({"count": 2})
        result = minimal_tracer._build_trace_result({})
        
        assert result["trace"]["duration"] > 0
        assert isinstance(result["trace"]["duration"], float)
    
    def test_prediction_points_added_to_metadata(self, prediction_tracer):
        """Prediction points are automatically added to metadata."""
        result = prediction_tracer.execute({})
        
        assert "prediction_points" in result["metadata"]
        assert len(result["metadata"]["prediction_points"]) == 2
        
        # Verify structure of prediction points
        pp = result["metadata"]["prediction_points"][0]
        assert "step_index" in pp
        assert "question" in pp
        assert "choices" in pp
        assert "correct_answer" in pp
    
    def test_custom_metadata_preserved(self, minimal_tracer):
        """Custom metadata set in execute() is preserved."""
        result = minimal_tracer.execute({"count": 2})
        
        assert result["metadata"]["algorithm"] == "minimal-test"
        assert result["metadata"]["visualization_type"] == "test"


# =============================================================================
# Test Group 7: Integration Tests (Full Execute Flow)
# =============================================================================

@pytest.mark.unit
class TestExecuteIntegration:
    """Test complete execution flow."""
    
    def test_minimal_execution_flow(self, minimal_tracer):
        """Complete execution produces valid result structure."""
        result = minimal_tracer.execute({"count": 3})
        
        # Top-level structure
        assert "result" in result
        assert "trace" in result
        assert "metadata" in result
        
        # Trace details
        assert result["trace"]["total_steps"] == 3
        assert len(result["trace"]["steps"]) == 3
        
        # Metadata includes predictions
        assert "prediction_points" in result["metadata"]
    
    def test_empty_execution(self, minimal_tracer):
        """Execution with 0 steps works correctly."""
        result = minimal_tracer.execute({"count": 0})
        
        assert result["trace"]["total_steps"] == 0
        assert len(result["trace"]["steps"]) == 0
    
    def test_execution_with_enrichment(self, viz_enrichment_tracer):
        """Execution with viz enrichment produces correct structure."""
        result = viz_enrichment_tracer.execute({})
        
        # All steps should have visualization data
        for step in result["trace"]["steps"]:
            assert "visualization" in step["data"]
            assert "state" in step["data"]["visualization"]
    
    def test_execution_produces_json_serializable_output(self, minimal_tracer):
        """Result can be serialized to JSON."""
        import json
        
        result = minimal_tracer.execute({"count": 3})
        
        # This should not raise an exception
        json_str = json.dumps(result)
        assert isinstance(json_str, str)
        
        # Should be able to deserialize back
        deserialized = json.loads(json_str)
        assert deserialized["trace"]["total_steps"] == 3


# =============================================================================
# Test Group 8: Edge Cases
# =============================================================================

@pytest.mark.edge_case
class TestEdgeCases:
    """Test edge cases and boundary conditions."""
    
    def test_step_with_empty_data(self, minimal_tracer):
        """Step with empty data dict is allowed."""
        minimal_tracer._add_step(
            step_type="EMPTY",
            data={},
            description="Empty data"
        )
        
        assert len(minimal_tracer.trace) == 1
        assert minimal_tracer.trace[0].data == {}
    
    def test_step_with_complex_nested_data(self, minimal_tracer):
        """Step with nested data structures works."""
        complex_data = {
            "nested": {
                "list": [1, 2, 3],
                "dict": {"key": "value"}
            },
            "array": [{"id": 1}, {"id": 2}]
        }
        
        minimal_tracer._add_step(
            step_type="COMPLEX",
            data=complex_data,
            description="Complex data"
        )
        
        assert minimal_tracer.trace[0].data == complex_data
    
    def test_multiple_executions_same_tracer(self, minimal_tracer):
        """WARNING: Tracer state persists between executions."""
        # First execution
        result1 = minimal_tracer.execute({"count": 2})
        assert result1["trace"]["total_steps"] == 2
        
        # Second execution continues from previous state
        result2 = minimal_tracer.execute({"count": 1})
        # This demonstrates why tracers should be instantiated fresh
        assert result2["trace"]["total_steps"] == 3  # 2 + 1
    
    def test_tracer_with_no_metadata(self, minimal_tracer):
        """Tracer without setting metadata still works."""
        # Don't set metadata in execute
        minimal_tracer._add_step("TEST", {}, "test")
        result = minimal_tracer._build_trace_result({})
        
        # Should still have prediction_points in metadata
        assert "prediction_points" in result["metadata"]
    
    def test_prediction_points_with_optional_fields(self, prediction_tracer):
        """Prediction points can have optional hint field."""
        result = prediction_tracer.execute({})
        
        pp = result["metadata"]["prediction_points"]
        
        # First has hint, second doesn't
        assert "hint" in pp[0]
        assert "hint" not in pp[1]


# =============================================================================
# Test Group 9: TraceStep Dataclass
# =============================================================================

@pytest.mark.unit
class TestTraceStepDataclass:
    """Test the TraceStep dataclass structure."""
    
    def test_trace_step_creation(self, sample_trace_step):
        """TraceStep can be created with all fields."""
        assert sample_trace_step.step == 0
        assert sample_trace_step.type == "TEST_STEP"
        assert sample_trace_step.timestamp == 0.001
        assert sample_trace_step.data == {"test": "data"}
        assert sample_trace_step.description == "Test step description"
    
    def test_trace_step_to_dict(self, sample_trace_step):
        """TraceStep can be converted to dict."""
        step_dict = asdict(sample_trace_step)
        
        assert isinstance(step_dict, dict)
        assert step_dict["step"] == 0
        assert step_dict["type"] == "TEST_STEP"
        assert step_dict["timestamp"] == 0.001
        assert step_dict["data"] == {"test": "data"}
        assert step_dict["description"] == "Test step description"
    
    def test_trace_step_immutable_after_creation(self, sample_trace_step):
        """TraceStep fields can be modified (dataclass is mutable by default)."""
        # Note: dataclass is mutable unless frozen=True
        sample_trace_step.step = 99
        assert sample_trace_step.step == 99