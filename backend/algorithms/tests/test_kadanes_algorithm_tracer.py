"""
Tests for Kadane's Algorithm tracer.

Comprehensive test coverage for correctness, trace generation,
visualization state, prediction points, edge cases, and metadata compliance.

Target Coverage: ≥90%
"""

import pytest
from algorithms.kadanes_algorithm_tracer import KadanesAlgorithmTracer


# =============================================================================
# Test Class 1: Algorithm Correctness
# =============================================================================

@pytest.mark.unit
class TestKadanesAlgorithmCorrectness:
    """Test algorithm correctness - does it find the right maximum sum?"""

    @pytest.mark.parametrize("array,expected_sum,expected_start,expected_end", [
        # Basic cases
        ([1, 2, 3, 4], 10, 0, 3),                          # All positive
        ([-2, 1, -3, 4, -1, 2, 1, -5, 4], 6, 3, 6),       # Mixed (classic example)
        ([-2, -5, -1, -8], -1, 2, 2),                      # All negative
        ([5], 5, 0, 0),                                     # Single element
        ([1, -2, 3, -4, 5], 5, 4, 4),                      # Single element max
        ([2, -1, 2, 3, -2, 5], 9, 0, 5),                   # Entire array

        # Edge cases
        ([0, 0, 0], 0, 0, 0),                              # All zeros
        ([1, -1, 1, -1, 1], 1, 0, 0),                      # Alternating
        ([-1, 2, -1, 2, -1], 3, 1, 3),                     # Multiple peaks
        ([10, -5, 3, -2, 8], 14, 0, 4),                    # Entire array best

        # Larger arrays
        # Note: Algorithm updates max only on strict increase (>), so it finds the first/shortest occurrence
        ([1, 2, -5, 4, 5, -3, 2, 1], 9, 3, 4),            # Mid-section [4, 5] (sum 9) found before [4, 5, -3, 2, 1] (sum 9)
        ([-10, 1, 2, 3, -20, 5, 6, 7], 18, 5, 7),         # End section
    ])
    def test_kadanes_algorithm_scenarios(self, array, expected_sum, expected_start, expected_end):
        """Test Kadane's algorithm with various input scenarios."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': array})

        assert result['result']['max_sum'] == expected_sum
        assert result['result']['subarray']['start'] == expected_start
        assert result['result']['subarray']['end'] == expected_end

        # Verify subarray values match
        expected_values = array[expected_start:expected_end + 1]
        assert result['result']['subarray']['values'] == expected_values

        # Verify sum is correct
        assert sum(result['result']['subarray']['values']) == expected_sum

    def test_all_positive_numbers(self):
        """All positive numbers - entire array should be the answer."""
        array = [1, 2, 3, 4, 5]
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': array})

        assert result['result']['max_sum'] == 15
        assert result['result']['subarray']['start'] == 0
        assert result['result']['subarray']['end'] == 4
        assert result['result']['subarray']['values'] == array

    def test_all_negative_numbers(self):
        """All negative numbers - least negative should be the answer."""
        array = [-5, -2, -8, -1, -4]
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': array})

        assert result['result']['max_sum'] == -1
        assert result['result']['subarray']['start'] == 3
        assert result['result']['subarray']['end'] == 3
        assert result['result']['subarray']['values'] == [-1]

    def test_single_positive_in_negatives(self):
        """Single positive number among negatives."""
        array = [-5, -2, 10, -8, -1]
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': array})

        assert result['result']['max_sum'] == 10
        assert result['result']['subarray']['start'] == 2
        assert result['result']['subarray']['end'] == 2

    def test_large_array(self):
        """Test with larger array (50 elements)."""
        # Create array with known maximum subarray
        array = [-1] * 20 + [5, 10, -2, 8, 3] + [-1] * 25
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': array})

        # Maximum should be [5, 10, -2, 8, 3] = 24
        assert result['result']['max_sum'] == 24
        assert result['result']['subarray']['start'] == 20
        assert result['result']['subarray']['end'] == 24

    def test_zero_in_middle(self):
        """Array with zeros in the middle."""
        array = [1, 2, 0, 0, 3, 4]
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': array})

        # Entire array sums to 10
        assert result['result']['max_sum'] == 10
        assert result['result']['subarray']['start'] == 0
        assert result['result']['subarray']['end'] == 5


# =============================================================================
# Test Class 2: Trace Structure
# =============================================================================

@pytest.mark.unit
class TestKadanesAlgorithmTraceStructure:
    """Test trace generation - are all steps recorded correctly?"""

    def test_first_step_is_iterate(self):
        """First step should be ITERATE (initialization)."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        first_step = result['trace']['steps'][0]
        assert first_step['type'] == 'ITERATE'
        assert first_step['data']['decision'] == 'initialize'
        assert first_step['data']['index'] == 0

    def test_second_step_is_update_max(self):
        """Second step should be UPDATE_MAX (initial max)."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        second_step = result['trace']['steps'][1]
        assert second_step['type'] == 'UPDATE_MAX'
        assert second_step['data']['new_max_sum'] == 1

    def test_iterate_steps_for_each_element(self):
        """Should have ITERATE step for each array element."""
        array = [1, 2, 3, 4, 5]
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': array})

        iterate_steps = [s for s in result['trace']['steps'] if s['type'] == 'ITERATE']

        # One ITERATE per element
        assert len(iterate_steps) == len(array)

        # Check indices are sequential
        for i, step in enumerate(iterate_steps):
            assert step['data']['index'] == i

    def test_update_max_steps_present(self):
        """UPDATE_MAX steps should occur when new maximum found."""
        array = [1, 3, 2, 5, 4]  # Max increases at indices 0, 1, 3
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': array})

        update_max_steps = [s for s in result['trace']['steps'] if s['type'] == 'UPDATE_MAX']

        # Should have at least initial update
        assert len(update_max_steps) >= 1

        # Each should have required data
        for step in update_max_steps:
            assert 'old_max_sum' in step['data']
            assert 'new_max_sum' in step['data']
            assert 'comparison' in step['data']
            assert 'subarray_start' in step['data']
            assert 'subarray_end' in step['data']

    def test_decision_field_in_iterate_steps(self):
        """ITERATE steps should have decision field."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, -2, 3]})

        iterate_steps = [s for s in result['trace']['steps'] if s['type'] == 'ITERATE']

        for step in iterate_steps:
            assert 'decision' in step['data']
            decision = step['data']['decision']
            assert decision in ['initialize', 'add_to_current', 'reset_to_current']

    def test_calculation_field_present(self):
        """ITERATE steps should show calculation."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        iterate_steps = [s for s in result['trace']['steps'] if s['type'] == 'ITERATE']

        for step in iterate_steps:
            assert 'calculation' in step['data']
            assert isinstance(step['data']['calculation'], str)
            assert len(step['data']['calculation']) > 0

    def test_old_and_new_current_sum(self):
        """ITERATE steps should track old and new current_sum."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, -5, 3]})

        iterate_steps = [s for s in result['trace']['steps'] if s['type'] == 'ITERATE']

        for step in iterate_steps:
            assert 'old_current_sum' in step['data']
            assert 'new_current_sum' in step['data']

    def test_trace_has_timestamps(self):
        """All steps should have timestamps."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        for step in result['trace']['steps']:
            assert 'timestamp' in step
            assert isinstance(step['timestamp'], (int, float))
            assert step['timestamp'] >= 0

    def test_trace_duration_recorded(self):
        """Trace should include total duration."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        assert 'duration' in result['trace']
        assert isinstance(result['trace']['duration'], (int, float))
        assert result['trace']['duration'] >= 0

    def test_total_steps_matches_array_length(self):
        """total_steps should match length of steps array."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        assert result['trace']['total_steps'] == len(result['trace']['steps'])


# =============================================================================
# Test Class 3: Visualization State
# =============================================================================

@pytest.mark.unit
class TestKadanesAlgorithmVisualizationState:
    """Test visualization state - is frontend data correct?"""

    def test_visualization_state_present(self):
        """Each step should have visualization data."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        for step in result['trace']['steps']:
            assert 'visualization' in step['data']

    def test_array_elements_structure(self):
        """Array elements should have index, value, and state."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        first_step = result['trace']['steps'][0]
        viz = first_step['data']['visualization']

        assert 'array' in viz
        assert len(viz['array']) == 3

        for element in viz['array']:
            assert 'index' in element
            assert 'value' in element
            assert 'state' in element

    def test_element_states_valid(self):
        """Element states should be valid."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        valid_states = {'examining', 'in_current_subarray', 'in_max_subarray', 'excluded'}

        for step in result['trace']['steps']:
            viz = step['data']['visualization']
            for element in viz['array']:
                assert element['state'] in valid_states

    def test_examining_state_at_current_index(self):
        """Current element should have 'examining' state."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        iterate_steps = [s for s in result['trace']['steps'] if s['type'] == 'ITERATE']

        for step in iterate_steps:
            index = step['data']['index']
            viz = step['data']['visualization']

            current_element = viz['array'][index]
            assert current_element['state'] == 'examining'

    def test_current_sum_tracked(self):
        """Visualization should track current_sum."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        for step in result['trace']['steps']:
            viz = step['data']['visualization']
            assert 'current_sum' in viz
            assert isinstance(viz['current_sum'], int)

    def test_max_sum_tracked(self):
        """Visualization should track max_sum."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        for step in result['trace']['steps']:
            viz = step['data']['visualization']
            assert 'max_sum' in viz

    def test_current_subarray_boundaries(self):
        """Visualization should show current subarray boundaries."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        for step in result['trace']['steps']:
            viz = step['data']['visualization']
            assert 'current_subarray' in viz
            assert 'start' in viz['current_subarray']
            assert 'end' in viz['current_subarray']

    def test_max_subarray_boundaries(self):
        """Visualization should show max subarray boundaries."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        for step in result['trace']['steps']:
            viz = step['data']['visualization']
            assert 'max_subarray' in viz
            assert 'start' in viz['max_subarray']
            assert 'end' in viz['max_subarray']

    def test_max_subarray_state_correct(self):
        """Elements in max subarray should have correct state."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        # Check final step
        final_step = result['trace']['steps'][-1]
        viz = final_step['data']['visualization']

        max_start = viz['max_subarray']['start']
        max_end = viz['max_subarray']['end']

        for element in viz['array']:
            if max_start <= element['index'] <= max_end:
                # Should be in_max_subarray (unless examining)
                if element['state'] != 'examining':
                    assert element['state'] == 'in_max_subarray'

    def test_current_sum_increases_correctly(self):
        """Current sum should increase when extending."""
        array = [1, 2, 3]
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': array})

        iterate_steps = [s for s in result['trace']['steps'] if s['type'] == 'ITERATE']

        # For all positive array, current_sum should increase
        previous_sum = 0
        for step in iterate_steps:
            current_sum = step['data']['new_current_sum']
            assert current_sum >= previous_sum
            previous_sum = current_sum

    def test_current_sum_resets_correctly(self):
        """Current sum should reset when starting new subarray."""
        array = [5, -10, 3]  # Should reset at index 2
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': array})

        iterate_steps = [s for s in result['trace']['steps'] if s['type'] == 'ITERATE']

        # Check step at index 2
        step_2 = iterate_steps[2]
        assert step_2['data']['decision'] == 'reset_to_current'
        assert step_2['data']['new_current_sum'] == 3


# =============================================================================
# Test Class 4: Prediction Points
# =============================================================================

@pytest.mark.unit
class TestKadanesAlgorithmPredictionPoints:
    """Test prediction points - are learning moments identified?"""

    def test_predictions_generated(self):
        """Prediction points should be generated."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        predictions = result['metadata']['prediction_points']

        assert isinstance(predictions, list)
        assert len(predictions) > 0

    def test_prediction_count_correct(self):
        """Prediction count should match non-initialization ITERATE steps."""
        array = [1, 2, 3, 4]
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': array})

        # Should have predictions for indices 1, 2, 3 (not 0 which is initialization)
        predictions = result['metadata']['prediction_points']
        assert len(predictions) == len(array) - 1

    def test_prediction_structure_complete(self):
        """Each prediction should have all required fields."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        predictions = result['metadata']['prediction_points']

        required_fields = ['step_index', 'question', 'choices', 'hint', 'correct_answer', 'explanation']

        for pred in predictions:
            for field in required_fields:
                assert field in pred, f"Missing field: {field}"

    def test_prediction_choices_structure(self):
        """Each prediction should have 3 choices with id and label."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        predictions = result['metadata']['prediction_points']

        for pred in predictions:
            choices = pred['choices']
            assert len(choices) == 3

            choice_ids = {c['id'] for c in choices}
            assert choice_ids == {'extend', 'reset', 'skip'}

            for choice in choices:
                assert 'id' in choice
                assert 'label' in choice
                assert isinstance(choice['label'], str)
                assert len(choice['label']) > 0

    def test_correct_answer_valid(self):
        """Correct answer should be 'extend' or 'reset'."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, -2, 3]})

        predictions = result['metadata']['prediction_points']
        valid_answers = {'extend', 'reset'}

        for pred in predictions:
            assert pred['correct_answer'] in valid_answers

    def test_correct_answer_matches_decision(self):
        """Correct answer should match the actual decision made."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, -5, 3]})

        predictions = result['metadata']['prediction_points']
        steps = result['trace']['steps']

        for pred in predictions:
            step_index = pred['step_index']
            correct_answer = pred['correct_answer']

            # Find corresponding ITERATE step
            next_iterate = None
            for step in steps[step_index + 1:]:
                if step['type'] == 'ITERATE':
                    next_iterate = step
                    break

            if next_iterate:
                decision = next_iterate['data']['decision']
                if decision == 'add_to_current':
                    assert correct_answer == 'extend'
                elif decision == 'reset_to_current':
                    assert correct_answer == 'reset'

    def test_prediction_question_mentions_values(self):
        """Question should mention element value and current sum."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        predictions = result['metadata']['prediction_points']

        for pred in predictions:
            question = pred['question'].lower()
            # Question should mention key information
            assert 'current sum' in question or 'sum' in question

    def test_prediction_hint_present(self):
        """Each prediction should have a helpful hint."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        predictions = result['metadata']['prediction_points']

        for pred in predictions:
            hint = pred['hint']
            assert isinstance(hint, str)
            assert len(hint) > 0
            assert 'compare' in hint.lower()

    def test_prediction_explanation_present(self):
        """Each prediction should have an explanation."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        predictions = result['metadata']['prediction_points']

        for pred in predictions:
            explanation = pred['explanation']
            assert isinstance(explanation, str)
            assert len(explanation) > 0


# =============================================================================
# Test Class 5: Edge Cases & Error Handling
# =============================================================================

@pytest.mark.edge_case
class TestKadanesAlgorithmEdgeCases:
    """Test edge cases and error handling."""

    def test_empty_array_raises_error(self):
        """Empty array should raise ValueError."""
        tracer = KadanesAlgorithmTracer()

        with pytest.raises(ValueError, match="cannot be empty"):
            tracer.execute({'array': []})

    def test_non_dict_input_raises_error(self):
        """Non-dictionary input should raise ValueError."""
        tracer = KadanesAlgorithmTracer()

        with pytest.raises(ValueError, match="dictionary"):
            tracer.execute([1, 2, 3])

    def test_missing_array_key_raises_error(self):
        """Missing 'array' key should raise ValueError."""
        tracer = KadanesAlgorithmTracer()

        with pytest.raises(ValueError, match="array"):
            tracer.execute({'data': [1, 2, 3]})

    def test_non_integer_elements_raise_error(self):
        """Non-integer elements should raise ValueError."""
        tracer = KadanesAlgorithmTracer()

        with pytest.raises(ValueError, match="integers"):
            tracer.execute({'array': [1, 2.5, 3]})

    def test_single_element_positive(self):
        """Single positive element."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [42]})

        assert result['result']['max_sum'] == 42
        assert result['result']['subarray']['start'] == 0
        assert result['result']['subarray']['end'] == 0

    def test_single_element_negative(self):
        """Single negative element."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [-5]})

        assert result['result']['max_sum'] == -5
        assert result['result']['subarray']['start'] == 0
        assert result['result']['subarray']['end'] == 0

    def test_single_element_zero(self):
        """Single zero element."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [0]})

        assert result['result']['max_sum'] == 0
        assert result['result']['subarray']['start'] == 0
        assert result['result']['subarray']['end'] == 0

    def test_two_elements_both_positive(self):
        """Two positive elements."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [3, 5]})

        assert result['result']['max_sum'] == 8
        assert result['result']['subarray']['start'] == 0
        assert result['result']['subarray']['end'] == 1

    def test_two_elements_both_negative(self):
        """Two negative elements."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [-3, -5]})

        assert result['result']['max_sum'] == -3
        assert result['result']['subarray']['start'] == 0
        assert result['result']['subarray']['end'] == 0

    def test_large_positive_numbers(self):
        """Array with large positive numbers."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1000, 2000, 3000]})

        assert result['result']['max_sum'] == 6000
        assert result['result']['subarray']['values'] == [1000, 2000, 3000]

    def test_large_negative_numbers(self):
        """Array with large negative numbers."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [-1000, -500, -2000]})

        assert result['result']['max_sum'] == -500
        assert result['result']['subarray']['start'] == 1
        assert result['result']['subarray']['end'] == 1


# =============================================================================
# Test Class 6: Metadata Compliance
# =============================================================================

@pytest.mark.compliance
class TestKadanesAlgorithmMetadataCompliance:
    """Test metadata compliance with frontend requirements."""

    def test_metadata_present(self):
        """Metadata should be present in result."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        assert 'metadata' in result

    def test_required_metadata_fields(self):
        """Metadata should have all required fields."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        metadata = result['metadata']

        required_fields = [
            'algorithm',
            'display_name',
            'visualization_type',
            'visualization_config',
            'input_size',
            'prediction_points'
        ]

        for field in required_fields:
            assert field in metadata, f"Missing required field: {field}"

    def test_algorithm_field_correct(self):
        """algorithm field should be 'kadanes-algorithm'."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        assert result['metadata']['algorithm'] == 'kadanes-algorithm'

    def test_display_name_field_correct(self):
        """display_name field should be 'Kadane's Algorithm'."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        assert result['metadata']['display_name'] == "Kadane's Algorithm"

    def test_visualization_type_correct(self):
        """visualization_type should be 'array'."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        assert result['metadata']['visualization_type'] == 'array'

    def test_visualization_config_structure(self):
        """visualization_config should have expected fields."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        config = result['metadata']['visualization_config']

        assert 'element_renderer' in config
        assert 'show_indices' in config
        assert 'highlight_subarray' in config
        assert 'show_current_sum' in config

        assert config['element_renderer'] == 'number'
        assert config['show_indices'] is True
        assert config['highlight_subarray'] is True
        assert config['show_current_sum'] is True

    def test_input_size_correct(self):
        """input_size should match array length."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3, 4, 5]})

        assert result['metadata']['input_size'] == 5

    def test_prediction_points_in_metadata(self):
        """prediction_points should be in metadata."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        assert 'prediction_points' in result['metadata']
        assert isinstance(result['metadata']['prediction_points'], list)

    def test_metadata_types_correct(self):
        """All metadata fields should have correct types."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        metadata = result['metadata']

        assert isinstance(metadata['algorithm'], str)
        assert isinstance(metadata['display_name'], str)
        assert isinstance(metadata['visualization_type'], str)
        assert isinstance(metadata['visualization_config'], dict)
        assert isinstance(metadata['input_size'], int)
        assert isinstance(metadata['prediction_points'], list)

    def test_result_structure_correct(self):
        """Result should have correct top-level structure."""
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': [1, 2, 3]})

        # Top-level keys
        assert 'result' in result
        assert 'trace' in result
        assert 'metadata' in result

        # Result structure
        assert 'max_sum' in result['result']
        assert 'subarray' in result['result']

        # Subarray structure
        subarray = result['result']['subarray']
        assert 'start' in subarray
        assert 'end' in subarray
        assert 'values' in subarray

        # Trace structure
        assert 'steps' in result['trace']
        assert 'total_steps' in result['trace']
        assert 'duration' in result['trace']

    def test_subarray_values_match_indices(self):
        """Subarray values should match the slice from original array."""
        array = [1, 2, 3, 4, 5]
        tracer = KadanesAlgorithmTracer()
        result = tracer.execute({'array': array})

        subarray = result['result']['subarray']
        start = subarray['start']
        end = subarray['end']
        values = subarray['values']

        expected_values = array[start:end + 1]
        assert values == expected_values