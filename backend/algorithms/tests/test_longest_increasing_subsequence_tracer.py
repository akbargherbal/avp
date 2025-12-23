
"""
Tests for Longest Increasing Subsequence (Patience Sorting) algorithm tracer.

Comprehensive test coverage for correctness, trace generation, visualization
state, prediction points, edge cases, and metadata compliance.

Target Coverage: ≥90%
"""

import pytest
from algorithms.longest_increasing_subsequence_tracer import LongestIncreasingSubsequenceTracer


# =============================================================================
# Test Class 1: Algorithm Correctness
# =============================================================================

@pytest.mark.unit
class TestLISCorrectness:
    """Test algorithm correctness - does it find the right LIS length?"""

    @pytest.mark.parametrize("array,expected_length", [
        # Basic cases
        ([10, 9, 2, 5, 3, 7, 101, 18], 4),  # LIS: [2, 3, 7, 18] or [2, 3, 7, 101]
        ([0, 1, 0, 3, 2, 3], 4),             # LIS: [0, 1, 2, 3]
        ([7, 7, 7, 7, 7], 1),                # All same (strictly increasing)
        
        # Strictly increasing
        ([1, 2, 3, 4, 5], 5),                # Entire array
        
        # Strictly decreasing
        ([5, 4, 3, 2, 1], 1),                # Any single element
        
        # Single element
        ([42], 1),
        
        # Two elements
        ([1, 2], 2),                         # Increasing
        ([2, 1], 1),                         # Decreasing
        ([5, 5], 1),                         # Same
        
        # Mixed patterns
        ([3, 1, 4, 1, 5, 9, 2, 6], 4),      # LIS: [1, 4, 5, 9] or [1, 4, 5, 6]
        ([1, 3, 2, 4], 3),                   # LIS: [1, 2, 4] or [1, 3, 4]
        
        # Negative numbers
        ([-10, -5, -3, 0, 5, 10], 6),       # Entire array
        ([-1, -2, -3, -4], 1),               # Decreasing negatives
        
        # With duplicates
        ([1, 2, 2, 3, 4], 4),                # LIS: [1, 2, 3, 4]
        ([4, 4, 4, 1, 2, 3], 3),             # LIS: [1, 2, 3]
    ])
    def test_lis_length_scenarios(self, array, expected_length):
        """Test LIS length calculation with various scenarios."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        assert result['result']['lis_length'] == expected_length

    def test_large_array_increasing(self):
        """Test with large strictly increasing array."""
        array = list(range(1, 101))  # [1, 2, ..., 100]
        
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        assert result['result']['lis_length'] == 100

    def test_large_array_decreasing(self):
        """Test with large strictly decreasing array."""
        array = list(range(100, 0, -1))  # [100, 99, ..., 1]
        
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        assert result['result']['lis_length'] == 1

    def test_large_array_mixed(self):
        """Test with large mixed array."""
        array = [10, 22, 9, 33, 21, 50, 41, 60, 80]
        
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        # LIS: [10, 22, 33, 50, 60, 80]
        assert result['result']['lis_length'] == 6

    def test_final_tails_length_matches_lis(self):
        """Final tails array length should equal LIS length."""
        array = [10, 9, 2, 5, 3, 7, 101, 18]
        
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        lis_length = result['result']['lis_length']
        final_tails = result['result']['final_tails']
        
        assert len(final_tails) == lis_length

    def test_tails_array_sorted(self):
        """Tails array should always be sorted."""
        array = [10, 9, 2, 5, 3, 7, 101, 18]
        
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        final_tails = result['result']['final_tails']
        
        # Check if sorted
        assert all(final_tails[i] < final_tails[i+1] for i in range(len(final_tails)-1))


# =============================================================================
# Test Class 2: Trace Structure
# =============================================================================

@pytest.mark.unit
class TestLISTraceStructure:
    """Test trace generation - are all steps recorded correctly?"""

    def test_initial_state_first_step(self):
        """First step should be INITIAL_STATE."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        first_step = result['trace']['steps'][0]
        assert first_step['type'] == 'INITIAL_STATE'
        assert 'array_size' in first_step['data']
        assert 'initial_array' in first_step['data']

    def test_check_element_steps_present(self):
        """CHECK_ELEMENT steps should be present for each array element."""
        array = [1, 3, 2, 4]
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        check_steps = [s for s in result['trace']['steps'] if s['type'] == 'CHECK_ELEMENT']
        
        # Should have one CHECK_ELEMENT per array element
        assert len(check_steps) == len(array)
        
        # Each should have required data
        for i, step in enumerate(check_steps):
            assert step['data']['current_index'] == i
            assert step['data']['current_num'] == array[i]
            assert 'tails_before' in step['data']

    def test_extend_tail_steps(self):
        """EXTEND_TAIL steps should be present when extending."""
        array = [1, 2, 3]  # All extending
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        extend_steps = [s for s in result['trace']['steps'] if s['type'] == 'EXTEND_TAIL']
        
        # Should have 3 extend steps
        assert len(extend_steps) == 3
        
        # Each should have required data
        for step in extend_steps:
            assert 'current_num' in step['data']
            assert 'new_length' in step['data']
            assert 'tails_after' in step['data']

    def test_replace_tail_steps(self):
        """REPLACE_TAIL steps should be present when replacing."""
        array = [3, 1, 2]  # 3 extends, 1 replaces, 2 extends
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        replace_steps = [s for s in result['trace']['steps'] if s['type'] == 'REPLACE_TAIL']
        
        # Should have at least 1 replace step
        assert len(replace_steps) >= 1
        
        # Each should have required data
        for step in replace_steps:
            assert 'current_num' in step['data']
            assert 'replace_index' in step['data']
            assert 'old_value' in step['data']
            assert 'new_value' in step['data']
            assert 'tails_after' in step['data']

    def test_binary_search_steps(self):
        """BINARY_SEARCH steps should be present when searching."""
        array = [1, 5, 2]  # 1, 5 extend -> tails=[1,5]. 2 replaces 5 -> binary search runs
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        search_steps = [s for s in result['trace']['steps'] if s['type'] == 'BINARY_SEARCH']
        
        # Should have binary search steps
        assert len(search_steps) > 0
        
        # Each should have required data
        for step in search_steps:
            assert 'current_num' in step['data']
            assert 'left' in step['data']
            assert 'right' in step['data']
            assert 'mid' in step['data']
            assert 'mid_value' in step['data']
            assert 'comparison' in step['data']

    def test_step_sequence_logical(self):
        """Steps should follow logical sequence: CHECK → (SEARCH*) → (EXTEND|REPLACE)."""
        array = [3, 1, 2]
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        steps = result['trace']['steps']
        
        # Skip INITIAL_STATE
        i = 1
        while i < len(steps):
            step = steps[i]
            
            if step['type'] == 'CHECK_ELEMENT':
                # Next should be BINARY_SEARCH, EXTEND_TAIL, or REPLACE_TAIL
                if i + 1 < len(steps):
                    next_step = steps[i + 1]
                    assert next_step['type'] in ['BINARY_SEARCH', 'EXTEND_TAIL', 'REPLACE_TAIL']
            
            i += 1

    def test_trace_has_timestamps(self):
        """All steps should have timestamps."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        for step in result['trace']['steps']:
            assert 'timestamp' in step
            assert isinstance(step['timestamp'], (int, float))
            assert step['timestamp'] >= 0

    def test_trace_duration_recorded(self):
        """Trace should include total duration."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        assert 'duration' in result['trace']
        assert isinstance(result['trace']['duration'], (int, float))
        assert result['trace']['duration'] >= 0

    def test_total_steps_matches_array_length(self):
        """total_steps should match length of steps array."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        assert result['trace']['total_steps'] == len(result['trace']['steps'])


# =============================================================================
# Test Class 3: Visualization State
# =============================================================================

@pytest.mark.unit
class TestLISVisualizationState:
    """Test visualization state - is frontend data correct?"""

    def test_visualization_state_present(self):
        """Each step (except INITIAL_STATE) should have visualization data."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        for step in result['trace']['steps']:
            if step['type'] != 'INITIAL_STATE':
                assert 'visualization' in step['data']

    def test_array_elements_structure(self):
        """Array elements should have index, value, and state."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        # Check a CHECK_ELEMENT step
        check_step = [s for s in result['trace']['steps'] if s['type'] == 'CHECK_ELEMENT'][0]
        viz = check_step['data']['visualization']
        
        assert 'array' in viz
        assert len(viz['array']) == 3
        
        for element in viz['array']:
            assert 'index' in element
            assert 'value' in element
            assert 'state' in element

    def test_element_states_valid(self):
        """Element states should be one of: pending, examining, processed."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        valid_states = {'pending', 'examining', 'processed'}
        
        for step in result['trace']['steps']:
            if 'visualization' in step['data']:
                viz = step['data']['visualization']
                for element in viz['array']:
                    assert element['state'] in valid_states

    def test_examining_state_at_current_index(self):
        """Element at current_index should have 'examining' state."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        check_steps = [s for s in result['trace']['steps'] if s['type'] == 'CHECK_ELEMENT']
        
        for step in check_steps:
            current_index = step['data']['current_index']
            viz = step['data']['visualization']
            
            current_element = viz['array'][current_index]
            assert current_element['state'] == 'examining'

    def test_processed_state_before_current(self):
        """Elements before current_index should have 'processed' state."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2, 4]})
        
        # Check a later CHECK_ELEMENT step
        check_steps = [s for s in result['trace']['steps'] if s['type'] == 'CHECK_ELEMENT']
        
        if len(check_steps) > 1:
            step = check_steps[2]  # Third element
            current_index = step['data']['current_index']
            viz = step['data']['visualization']
            
            # Elements before current should be processed
            for element in viz['array']:
                if element['index'] < current_index:
                    assert element['state'] == 'processed'

    def test_pending_state_after_current(self):
        """Elements after current_index should have 'pending' state."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2, 4]})
        
        # Check first CHECK_ELEMENT step
        check_steps = [s for s in result['trace']['steps'] if s['type'] == 'CHECK_ELEMENT']
        step = check_steps[0]
        
        current_index = step['data']['current_index']
        viz = step['data']['visualization']
        
        # Elements after current should be pending
        for element in viz['array']:
            if element['index'] > current_index:
                assert element['state'] == 'pending'

    def test_tails_array_structure(self):
        """Tails array should have index, value, and state."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        # Check an EXTEND_TAIL step
        extend_steps = [s for s in result['trace']['steps'] if s['type'] == 'EXTEND_TAIL']
        
        if extend_steps:
            step = extend_steps[0]
            viz = step['data']['visualization']
            
            assert 'tails' in viz
            
            for tail in viz['tails']:
                assert 'index' in tail
                assert 'value' in tail
                assert 'state' in tail

    def test_tail_states_valid(self):
        """Tail states should be one of: active, examining, replacing."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        valid_states = {'active', 'examining', 'replacing'}
        
        for step in result['trace']['steps']:
            if 'visualization' in step['data']:
                viz = step['data']['visualization']
                if 'tails' in viz:
                    for tail in viz['tails']:
                        assert tail['state'] in valid_states

    def test_current_element_present(self):
        """current_element should be present in visualization."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        check_steps = [s for s in result['trace']['steps'] if s['type'] == 'CHECK_ELEMENT']
        
        for step in check_steps:
            viz = step['data']['visualization']
            
            assert 'current_element' in viz
            assert viz['current_element'] is not None
            assert 'index' in viz['current_element']
            assert 'value' in viz['current_element']

    def test_tails_length_tracked(self):
        """tails_length should be tracked in visualization."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        for step in result['trace']['steps']:
            if 'visualization' in step['data']:
                viz = step['data']['visualization']
                assert 'tails_length' in viz
                assert isinstance(viz['tails_length'], int)
                assert viz['tails_length'] >= 0

    def test_binary_search_pointers_present(self):
        """Binary search pointers should be present during search."""
        array = [5, 1, 2, 3]  # Will trigger binary search
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        search_steps = [s for s in result['trace']['steps'] if s['type'] == 'BINARY_SEARCH']
        
        for step in search_steps:
            viz = step['data']['visualization']
            
            assert 'binary_search' in viz
            bs = viz['binary_search']
            assert 'left' in bs
            assert 'right' in bs
            assert 'mid' in bs

    def test_tails_length_increases_on_extend(self):
        """Tails length should increase after EXTEND_TAIL."""
        array = [1, 2, 3]  # All extending
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        extend_steps = [s for s in result['trace']['steps'] if s['type'] == 'EXTEND_TAIL']
        
        previous_length = 0
        for step in extend_steps:
            viz = step['data']['visualization']
            current_length = viz['tails_length']
            
            assert current_length == previous_length + 1
            previous_length = current_length

    def test_tails_length_unchanged_on_replace(self):
        """Tails length should stay same after REPLACE_TAIL."""
        array = [3, 1, 2]  # 3 extends, 1 replaces
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        # Find a REPLACE_TAIL step and check previous step
        for i, step in enumerate(result['trace']['steps']):
            if step['type'] == 'REPLACE_TAIL' and i > 0:
                # Find previous step with visualization
                prev_step = None
                for j in range(i-1, -1, -1):
                    if 'visualization' in result['trace']['steps'][j]['data']:
                        prev_step = result['trace']['steps'][j]
                        break
                
                if prev_step:
                    prev_length = prev_step['data']['visualization']['tails_length']
                    curr_length = step['data']['visualization']['tails_length']
                    
                    assert curr_length == prev_length


# =============================================================================
# Test Class 4: Prediction Points
# =============================================================================

@pytest.mark.unit
class TestLISPredictionPoints:
    """Test prediction points - are learning moments identified?"""

    def test_predictions_generated(self):
        """Prediction points should be generated."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        predictions = result['metadata']['prediction_points']
        
        assert isinstance(predictions, list)
        assert len(predictions) > 0

    def test_prediction_count_matches_elements(self):
        """Prediction count should match number of CHECK_ELEMENT steps."""
        array = [1, 3, 2, 4]
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        check_count = len([s for s in result['trace']['steps'] if s['type'] == 'CHECK_ELEMENT'])
        prediction_count = len(result['metadata']['prediction_points'])
        
        assert prediction_count == check_count

    def test_prediction_structure_complete(self):
        """Each prediction should have all required fields."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        predictions = result['metadata']['prediction_points']
        
        required_fields = ['step_index', 'question', 'choices', 'hint', 'correct_answer', 'explanation']
        
        for pred in predictions:
            for field in required_fields:
                assert field in pred, f"Missing field: {field}"

    def test_prediction_choices_structure(self):
        """Each prediction should have 3 choices with id and label."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        predictions = result['metadata']['prediction_points']
        
        for pred in predictions:
            choices = pred['choices']
            assert len(choices) == 3
            
            choice_ids = {c['id'] for c in choices}
            assert choice_ids == {'extend', 'replace', 'skip'}
            
            for choice in choices:
                assert 'id' in choice
                assert 'label' in choice
                assert isinstance(choice['label'], str)
                assert len(choice['label']) > 0

    def test_correct_answer_valid(self):
        """Correct answer should be one of the three choices."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        predictions = result['metadata']['prediction_points']
        valid_answers = {'extend', 'replace', 'skip'}
        
        for pred in predictions:
            assert pred['correct_answer'] in valid_answers

    def test_correct_answer_matches_next_step(self):
        """Correct answer should match the actual next step taken."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        predictions = result['metadata']['prediction_points']
        steps = result['trace']['steps']
        
        for pred in predictions:
            step_index = pred['step_index']
            correct_answer = pred['correct_answer']
            
            # Get next step (skip BINARY_SEARCH steps)
            next_step = None
            for j in range(step_index + 1, len(steps)):
                if steps[j]['type'] in ['EXTEND_TAIL', 'REPLACE_TAIL']:
                    next_step = steps[j]
                    break
            
            if next_step:
                # Verify answer matches next step type
                if correct_answer == 'extend':
                    assert next_step['type'] == 'EXTEND_TAIL'
                elif correct_answer == 'replace':
                    # Should eventually lead to REPLACE_TAIL
                    assert next_step['type'] in ['REPLACE_TAIL', 'BINARY_SEARCH']

    def test_prediction_question_present(self):
        """Each prediction should have a meaningful question."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        predictions = result['metadata']['prediction_points']
        
        for pred in predictions:
            question = pred['question']
            assert isinstance(question, str)
            assert len(question) > 0

    def test_prediction_hint_present(self):
        """Each prediction should have a helpful hint."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        predictions = result['metadata']['prediction_points']
        
        for pred in predictions:
            hint = pred['hint']
            assert isinstance(hint, str)
            assert len(hint) > 0

    def test_prediction_explanation_present(self):
        """Each prediction should have an explanation."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        predictions = result['metadata']['prediction_points']
        
        for pred in predictions:
            explanation = pred['explanation']
            assert isinstance(explanation, str)
            assert len(explanation) > 0


# =============================================================================
# Test Class 5: Edge Cases & Error Handling
# =============================================================================

@pytest.mark.edge_case
class TestLISEdgeCases:
    """Test edge cases and error handling."""

    def test_empty_array_raises_error(self):
        """Empty array should raise ValueError."""
        tracer = LongestIncreasingSubsequenceTracer()
        
        with pytest.raises(ValueError, match="cannot be empty"):
            tracer.execute({'array': []})

    def test_non_dict_input_raises_error(self):
        """Non-dictionary input should raise ValueError."""
        tracer = LongestIncreasingSubsequenceTracer()
        
        with pytest.raises(ValueError, match="dictionary"):
            tracer.execute([1, 3, 2])

    def test_missing_array_key_raises_error(self):
        """Missing 'array' key should raise ValueError."""
        tracer = LongestIncreasingSubsequenceTracer()
        
        with pytest.raises(ValueError, match="array"):
            tracer.execute({'target': 5})

    def test_single_element(self):
        """Single element array should return LIS length 1."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [42]})
        
        assert result['result']['lis_length'] == 1
        assert result['result']['final_tails'] == [42]

    def test_two_elements_increasing(self):
        """Two elements increasing should return LIS length 2."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 2]})
        
        assert result['result']['lis_length'] == 2

    def test_two_elements_decreasing(self):
        """Two elements decreasing should return LIS length 1."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [2, 1]})
        
        assert result['result']['lis_length'] == 1

    def test_two_elements_equal(self):
        """Two equal elements should return LIS length 1 (strictly increasing)."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [5, 5]})
        
        assert result['result']['lis_length'] == 1

    def test_all_same_values(self):
        """Array with all same values should return LIS length 1."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [7, 7, 7, 7, 7]})
        
        assert result['result']['lis_length'] == 1

    def test_strictly_increasing(self):
        """Strictly increasing array should return full length."""
        array = [1, 2, 3, 4, 5]
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        assert result['result']['lis_length'] == len(array)

    def test_strictly_decreasing(self):
        """Strictly decreasing array should return LIS length 1."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [5, 4, 3, 2, 1]})
        
        assert result['result']['lis_length'] == 1

    def test_negative_numbers(self):
        """Array with negative numbers should work correctly."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [-10, -5, -3, 0, 5, 10]})
        
        assert result['result']['lis_length'] == 6

    def test_mixed_positive_negative(self):
        """Array with mixed positive and negative numbers."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [-5, 3, -2, 1, 4]})
        
        # LIS: [-5, -2, 1, 4] or [-5, 3, 4]
        assert result['result']['lis_length'] >= 3

    def test_large_values(self):
        """Array with large values should work."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1000, 2000, 1500, 3000]})
        
        # LIS: [1000, 1500, 3000] or [1000, 2000, 3000]
        assert result['result']['lis_length'] == 3

    def test_alternating_pattern(self):
        """Alternating high-low pattern."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 10, 2, 9, 3, 8]})
        
        # LIS: [1, 2, 3, 8]
        assert result['result']['lis_length'] == 4


# =============================================================================
# Test Class 6: Metadata Compliance
# =============================================================================

@pytest.mark.compliance
class TestLISMetadataCompliance:
    """Test metadata compliance with frontend requirements."""

    def test_metadata_present(self):
        """Metadata should be present in result."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        assert 'metadata' in result

    def test_required_metadata_fields(self):
        """Metadata should have all required fields."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
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
        """algorithm field should be 'longest-increasing-subsequence'."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        assert result['metadata']['algorithm'] == 'longest-increasing-subsequence'

    def test_display_name_field_correct(self):
        """display_name field should be correct."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        assert result['metadata']['display_name'] == 'Longest Increasing Subsequence (Patience Sorting)'

    def test_visualization_type_correct(self):
        """visualization_type should be 'array'."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        assert result['metadata']['visualization_type'] == 'array'

    def test_visualization_config_structure(self):
        """visualization_config should have expected fields."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        config = result['metadata']['visualization_config']
        
        assert 'show_indices' in config
        assert 'show_tails_overlay' in config
        assert config['show_indices'] is True
        assert config['show_tails_overlay'] is True

    def test_input_size_correct(self):
        """input_size should match array length."""
        array = [1, 3, 2, 4, 5]
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        assert result['metadata']['input_size'] == len(array)

    def test_prediction_points_in_metadata(self):
        """prediction_points should be in metadata."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        assert 'prediction_points' in result['metadata']
        assert isinstance(result['metadata']['prediction_points'], list)

    def test_metadata_types_correct(self):
        """All metadata fields should have correct types."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        metadata = result['metadata']
        
        assert isinstance(metadata['algorithm'], str)
        assert isinstance(metadata['display_name'], str)
        assert isinstance(metadata['visualization_type'], str)
        assert isinstance(metadata['visualization_config'], dict)
        assert isinstance(metadata['input_size'], int)
        assert isinstance(metadata['prediction_points'], list)

    def test_result_structure_correct(self):
        """Result should have correct top-level structure."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        # Top-level keys
        assert 'result' in result
        assert 'trace' in result
        assert 'metadata' in result
        
        # Result structure
        assert 'lis_length' in result['result']
        assert 'final_tails' in result['result']
        
        # Trace structure
        assert 'steps' in result['trace']
        assert 'total_steps' in result['trace']
        assert 'duration' in result['trace']


# =============================================================================
# Test Class 7: Narrative Generation
# =============================================================================

@pytest.mark.unit
class TestLISNarrativeGeneration:
    """Test narrative generation - does it produce valid markdown?"""

    def test_narrative_generates_without_error(self):
        """generate_narrative should execute without exceptions."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        # Should not raise any exceptions
        narrative = tracer.generate_narrative(result)
        
        assert isinstance(narrative, str)
        assert len(narrative) > 0

    def test_narrative_contains_header(self):
        """Narrative should contain algorithm name header."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        narrative = tracer.generate_narrative(result)
        
        assert "Longest Increasing Subsequence" in narrative
        assert "Patience Sorting" in narrative

    def test_narrative_contains_input_info(self):
        """Narrative should contain input array information."""
        array = [1, 3, 2]
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': array})
        
        narrative = tracer.generate_narrative(result)
        
        assert "Input Array" in narrative
        assert str(array) in narrative

    def test_narrative_contains_result(self):
        """Narrative should contain final result."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        narrative = tracer.generate_narrative(result)
        
        assert "LIS Length" in narrative or "Result" in narrative
        assert str(result['result']['lis_length']) in narrative

    def test_narrative_contains_step_headers(self):
        """Narrative should contain step headers."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        narrative = tracer.generate_narrative(result)
        
        assert "## Step 0" in narrative
        assert "## Step 1" in narrative

    def test_narrative_contains_visualization_hints(self):
        """Narrative should contain Frontend Visualization Hints section."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        narrative = tracer.generate_narrative(result)
        
        assert "🎨 Frontend Visualization Hints" in narrative
        assert "Primary Metrics to Emphasize" in narrative
        assert "Visualization Priorities" in narrative
        assert "Key JSON Paths" in narrative
        assert "Algorithm-Specific Guidance" in narrative

    def test_narrative_shows_tails_array(self):
        """Narrative should show tails array state."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        narrative = tracer.generate_narrative(result)
        
        assert "tails" in narrative.lower() or "Tails" in narrative

    def test_narrative_explains_decisions(self):
        """Narrative should explain extend vs replace decisions."""
        tracer = LongestIncreasingSubsequenceTracer()
        result = tracer.execute({'array': [1, 3, 2]})
        
        narrative = tracer.generate_narrative(result)
        
        # Should mention decision logic
        assert "extend" in narrative.lower() or "Extend" in narrative
        assert "replace" in narrative.lower() or "Replace" in narrative
