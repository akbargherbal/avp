# backend/algorithms/tests/test_two_pointer.py
"""
Tests for the Two Pointer algorithm tracer.

Covers correctness, trace generation, visualization state,
prediction points, edge cases, and metadata compliance.
"""

import pytest
from algorithms.two_pointer import TwoPointerTracer
from algorithms.registry import registry

# =============================================================================
# Test Class 1: Algorithm Correctness
# =============================================================================

@pytest.mark.unit
class TestTwoPointerCorrectness:
    """Test algorithm correctness - does it produce the right result?"""

    @pytest.mark.parametrize("array, expected_count, expected_array", [
        # Basic cases
        ([1, 1, 2, 2, 3], 3, [1, 2, 3]),
        ([1, 2, 3, 4, 5], 5, [1, 2, 3, 4, 5]),
        ([1, 1, 1, 1, 1], 1, [1]),
        # Edge cases
        ([], 0, []),
        ([42], 1, [42]),
        # More complex cases
        ([0, 0, 1, 1, 1, 2, 2, 3, 3, 4], 5, [0, 1, 2, 3, 4]),
        ([-5, -5, -1, 0, 0, 0, 3, 3], 4, [-5, -1, 0, 3]),
    ])
    def test_two_pointer_scenarios(self, array, expected_count, expected_array):
        """Test two pointer deduplication with various inputs."""
        tracer = TwoPointerTracer()
        # Pass a copy of the array to avoid modifying the test input list
        result = tracer.execute({'array': array.copy()})
        assert result['result']['unique_count'] == expected_count
        assert result['result']['final_array'] == expected_array

# =============================================================================
# Test Class 4: Prediction Points
# =============================================================================

@pytest.mark.unit
class TestTwoPointerPredictionPoints:
    """Test prediction points for correctness and structure."""

    def test_predictions_generated_correctly(self):
        """Verify prediction points match decision points in the trace."""
        tracer = TwoPointerTracer()
        result = tracer.execute({'array': [1, 1, 2]})
        predictions = result['metadata']['prediction_points']
        steps = result['trace']['steps']

        # Expected predictions at each COMPARE step
        # [1, 1, 2] -> fast=1, slow=0 -> compare 1 vs 1 -> skip
        # [1, 1, 2] -> fast=2, slow=0 -> compare 2 vs 1 -> keep
        assert len(predictions) == 2

        # First prediction: skip
        pred1 = predictions[0]
        assert pred1['question'] == "The fast pointer sees value (1) and the last unique value is (1). What happens next?"
        assert pred1['correct_answer'] == 'skip'
        # Check it corresponds to a COMPARE step
        assert steps[pred1['step_index']]['type'] == 'COMPARE'

        # Second prediction: keep
        pred2 = predictions[1]
        assert pred2['question'] == "The fast pointer sees value (2) and the last unique value is (1). What happens next?"
        assert pred2['correct_answer'] == 'keep'
        assert steps[pred2['step_index']]['type'] == 'COMPARE'

    def test_prediction_structure_is_valid(self):
        """Each prediction must have required fields and 2 choices."""
        tracer = TwoPointerTracer()
        result = tracer.execute({'array': [1, 1, 2, 3, 3, 4]})
        predictions = result['metadata']['prediction_points']

        assert len(predictions) > 0

        for pred in predictions:
            assert 'step_index' in pred
            assert 'question' in pred
            assert 'choices' in pred
            assert 'correct_answer' in pred
            assert 'explanation' in pred
            assert len(pred['choices']) == 2 # Hard limit check
            choice_ids = {c['id'] for c in pred['choices']}
            assert choice_ids == {'keep', 'skip'}

# =============================================================================
# Test Class 5: Edge Cases & Error Handling
# =============================================================================

@pytest.mark.edge_case
class TestTwoPointerEdgeCases:
    """Test edge cases and error handling."""

    def test_unsorted_array_raises_error(self):
        """Unsorted array should raise ValueError."""
        tracer = TwoPointerTracer()
        with pytest.raises(ValueError, match="sorted"):
            tracer.execute({'array': [1, 3, 2]})

    def test_missing_array_key_raises_error(self):
        """Missing 'array' key should raise ValueError."""
        tracer = TwoPointerTracer()
        with pytest.raises(ValueError, match="dictionary with an 'array' key"):
            tracer.execute({'data': [1, 2, 3]})

# =============================================================================
# Test Class 6: Metadata Compliance
# =============================================================================

@pytest.mark.compliance
class TestTwoPointerMetadataCompliance:
    """Test metadata compliance with platform requirements."""

    def test_required_metadata_fields(self):
        """Metadata should have all required fields."""
        tracer = TwoPointerTracer()
        result = tracer.execute({'array': [1, 1, 2]})

        metadata = result['metadata']
        assert 'algorithm' in metadata
        assert 'display_name' in metadata
        assert 'visualization_type' in metadata
        assert 'input_size' in metadata

    def test_metadata_values_correct(self):
        """Metadata fields should have the correct values."""
        tracer = TwoPointerTracer()
        result = tracer.execute({'array': [1, 1, 2, 3, 3]})

        metadata = result['metadata']
        assert metadata['algorithm'] == 'two-pointer'
        assert metadata['display_name'] == 'Two Pointer Pattern'
        assert metadata['visualization_type'] == 'array'
        assert metadata['input_size'] == 5

# =============================================================================
# Test Class 7: Narrative Generation
# =============================================================================

@pytest.mark.narrative
class TestTwoPointerNarrativeGeneration:
    """Tests for narrative generation."""

    def test_narrative_generates_without_errors_for_all_examples(self):
        """
        Ensures generate_narrative runs without KeyError or other exceptions
        for all registered example inputs. This is a critical compliance check.
        """
        algo_metadata = registry.get_metadata('two-pointer')
        for example in algo_metadata['example_inputs']:
            try:
                tracer = TwoPointerTracer()
                result = tracer.execute(example['input'])
                narrative = tracer.generate_narrative(result)
                assert isinstance(narrative, str)
                assert len(narrative) > 0
                assert "Two Pointer Pattern" in narrative
            except Exception as e:
                pytest.fail(f"Narrative generation failed for example '{example['name']}': {e}")

    def test_narrative_contains_decision_data(self):
        """
        Narrative must contain the actual values used in decisions.
        This checks for the anti-pattern of referencing undefined variables.
        """
        tracer = TwoPointerTracer()
        result = tracer.execute({'array': [1, 1, 2]})
        narrative = tracer.generate_narrative(result)

        # Check for the first comparison: 1 vs 1
        assert "**Result:** `1 == 1`. This is a **duplicate**" in narrative

        # Check for the second comparison: 2 vs 1
        assert "**Result:** `2 != 1`. This is a **new unique element**" in narrative
