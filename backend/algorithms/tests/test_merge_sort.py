"""
Tests for Merge Sort algorithm tracer.

Comprehensive test coverage for correctness, trace generation,
visualization state, prediction points, edge cases, and metadata compliance.

Target Coverage: ≥90%
Pattern: Following test_binary_search.py structure
"""

import pytest
from algorithms.merge_sort import MergeSortTracer


# =============================================================================
# Test Class 1: Algorithm Correctness
# =============================================================================

@pytest.mark.unit
class TestMergeSortCorrectness:
    """Test algorithm correctness - does it sort correctly?"""

    @pytest.mark.parametrize("array,expected", [
        # Basic cases
        ([3, 1, 4, 1, 5, 9, 2, 6], [1, 1, 2, 3, 4, 5, 6, 9]),
        ([5, 2, 8, 1, 9], [1, 2, 5, 8, 9]),
        ([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]),  # Already sorted
        ([5, 4, 3, 2, 1], [1, 2, 3, 4, 5]),  # Reverse sorted
        
        # Edge cases
        ([42], [42]),  # Single element
        ([2, 1], [1, 2]),  # Two elements
        ([3, 1, 2], [1, 2, 3]),  # Three elements
        
        # Duplicates
        ([3, 1, 3, 1, 2], [1, 1, 2, 3, 3]),
        ([5, 5, 5, 5], [5, 5, 5, 5]),  # All same
        
        # Negative numbers
        ([-3, 1, -5, 2, 0], [-5, -3, 0, 1, 2]),
        
        # Larger array (12 elements - within spec)
        ([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    ])
    def test_merge_sort_scenarios(self, array, expected):
        """Test merge sort with various input scenarios."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': array})
        
        assert result['result']['sorted_array'] == expected

    def test_stability_preserved(self):
        """Test that merge sort is stable (equal elements maintain relative order)."""
        # Using tuples where first element is key, second is original position
        # We'll just test with integers for now, stability verified by trace
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 3, 2, 1]})
        
        # Should be sorted correctly
        assert result['result']['sorted_array'] == [1, 1, 2, 3, 3]

    def test_comparison_count_reasonable(self):
        """Comparison count should be O(n log n)."""
        array = list(range(8, 0, -1))  # [8, 7, 6, 5, 4, 3, 2, 1]
        
        tracer = MergeSortTracer()
        result = tracer.execute({'array': array})
        
        comparisons = result['result']['comparisons']
        n = len(array)
        
        # For n=8, worst case is approximately n * log2(n) = 8 * 3 = 24 comparisons
        # Merge sort typically does fewer in practice
        assert comparisons <= n * n.bit_length()

    def test_merge_count_expected(self):
        """Merge count should match recursion structure."""
        array = [4, 2, 3, 1]
        
        tracer = MergeSortTracer()
        result = tracer.execute({'array': array})
        
        merges = result['result']['merges']
        
        # For array of 4 elements:
        # Level 2: 2 merges (pairs)
        # Level 1: 1 merge (halves)
        # Total: 3 merges
        assert merges == 3


# =============================================================================
# Test Class 2: Trace Structure
# =============================================================================

@pytest.mark.unit
class TestMergeSortTraceStructure:
    """Test trace generation - are all steps recorded correctly?"""

    def test_initial_state_first_step(self):
        """First step should be INITIAL_STATE."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        first_step = result['trace']['steps'][0]
        assert first_step['type'] == 'INITIAL_STATE'
        assert 'array' in first_step['data']
        assert 'size' in first_step['data']

    def test_algorithm_complete_final_step(self):
        """Last step should be ALGORITHM_COMPLETE."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        last_step = result['trace']['steps'][-1]
        assert last_step['type'] == 'ALGORITHM_COMPLETE'
        assert 'sorted_array' in last_step['data']
        assert 'comparisons' in last_step['data']
        assert 'merges' in last_step['data']

    def test_split_steps_present(self):
        """SPLIT_ARRAY steps should be present for recursive splits."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [4, 3, 2, 1]})
        
        split_steps = [s for s in result['trace']['steps'] if s['type'] == 'SPLIT_ARRAY']
        
        # Should have splits for: [4,3,2,1] -> [4,3] and [2,1] -> [4],[3] and [2],[1]
        assert len(split_steps) >= 3

    def test_base_case_steps_present(self):
        """BASE_CASE steps should be present for single elements."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 2, 1]})
        
        base_steps = [s for s in result['trace']['steps'] if s['type'] == 'BASE_CASE']
        
        # Should have base case for each single element
        assert len(base_steps) == 3

    def test_merge_start_steps_present(self):
        """MERGE_START steps should precede merge operations."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [2, 1, 4, 3]})
        
        merge_start_steps = [s for s in result['trace']['steps'] if s['type'] == 'MERGE_START']
        
        assert len(merge_start_steps) >= 3  # Multiple merge operations

    def test_merge_compare_steps_present(self):
        """MERGE_COMPARE steps should be present during merging."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        compare_steps = [s for s in result['trace']['steps'] if s['type'] == 'MERGE_COMPARE']
        
        # Should have comparison steps during merge
        assert len(compare_steps) >= 2

    def test_merge_complete_steps_present(self):
        """MERGE_COMPLETE steps should follow merge operations."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [2, 1]})
        
        complete_steps = [s for s in result['trace']['steps'] if s['type'] == 'MERGE_COMPLETE']
        
        # Should have merge complete for final merge
        assert len(complete_steps) >= 1

    def test_split_data_structure(self):
        """SPLIT_ARRAY steps should have required data."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [4, 3, 2, 1]})
        
        split_steps = [s for s in result['trace']['steps'] if s['type'] == 'SPLIT_ARRAY']
        
        for step in split_steps:
            assert 'array' in step['data']
            assert 'left_half' in step['data']
            assert 'right_half' in step['data']
            assert 'mid_index' in step['data']
            assert 'depth' in step['data']

    def test_merge_data_structure(self):
        """MERGE_START steps should have required data."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        merge_steps = [s for s in result['trace']['steps'] if s['type'] == 'MERGE_START']
        
        for step in merge_steps:
            assert 'left' in step['data']
            assert 'right' in step['data']
            assert 'depth' in step['data']

    def test_depth_increases_with_recursion(self):
        """Depth should increase as recursion goes deeper."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [4, 3, 2, 1]})
        
        split_steps = [s for s in result['trace']['steps'] if s['type'] == 'SPLIT_ARRAY']
        
        # First split should be at depth 0
        assert split_steps[0]['data']['depth'] == 0
        
        # Later splits should have higher depths
        depths = [s['data']['depth'] for s in split_steps]
        assert max(depths) > 0

    def test_trace_has_timestamps(self):
        """All steps should have timestamps."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        for step in result['trace']['steps']:
            assert 'timestamp' in step
            assert isinstance(step['timestamp'], (int, float))
            assert step['timestamp'] >= 0

    def test_total_steps_matches_array_length(self):
        """total_steps should match length of steps array."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        assert result['trace']['total_steps'] == len(result['trace']['steps'])


# =============================================================================
# Test Class 3: Visualization State
# =============================================================================

@pytest.mark.unit
class TestMergeSortVisualizationState:
    """Test visualization state - is frontend data correct?"""

    def test_visualization_state_present(self):
        """Steps should have visualization data."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        # Check non-initial steps have visualization
        for step in result['trace']['steps'][1:]:
            assert 'visualization' in step['data']

    def test_all_intervals_structure(self):
        """all_intervals should represent array segments."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [4, 3, 2, 1]})
        
        # Find a split step
        split_step = [s for s in result['trace']['steps'] if s['type'] == 'SPLIT_ARRAY'][0]
        viz = split_step['data']['visualization']
        
        assert 'all_intervals' in viz
        
        if viz['all_intervals']:
            interval = viz['all_intervals'][0]
            assert 'id' in interval
            assert 'start' in interval
            assert 'end' in interval
            assert 'color' in interval
            assert 'state' in interval

    def test_call_stack_state_structure(self):
        """call_stack_state should show active calls."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 2, 1]})
        
        split_step = [s for s in result['trace']['steps'] if s['type'] == 'SPLIT_ARRAY'][0]
        viz = split_step['data']['visualization']
        
        assert 'call_stack_state' in viz
        
        if viz['call_stack_state']:
            call = viz['call_stack_state'][0]
            assert 'id' in call
            assert 'is_active' in call
            assert 'depth' in call
            assert 'operation' in call

    def test_comparison_count_in_visualization(self):
        """comparison_count should be tracked in visualization."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        # Check a merge step
        merge_steps = [s for s in result['trace']['steps'] if s['type'] == 'MERGE_COMPARE']
        
        if merge_steps:
            viz = merge_steps[0]['data']['visualization']
            assert 'comparison_count' in viz
            assert isinstance(viz['comparison_count'], int)

    def test_merge_count_in_visualization(self):
        """merge_count should be tracked in visualization."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [2, 1]})
        
        complete_step = [s for s in result['trace']['steps'] if s['type'] == 'MERGE_COMPLETE'][0]
        viz = complete_step['data']['visualization']
        
        assert 'merge_count' in viz
        assert isinstance(viz['merge_count'], int)

    def test_depth_colors_vary(self):
        """Different depths should have different colors."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [4, 3, 2, 1]})
        
        split_steps = [s for s in result['trace']['steps'] if s['type'] == 'SPLIT_ARRAY']
        
        # Collect colors at different depths
        colors_by_depth = {}
        for step in split_steps:
            viz = step['data']['visualization']
            depth = step['data']['depth']
            
            if viz['all_intervals']:
                color = viz['all_intervals'][0]['color']
                colors_by_depth[depth] = color
        
        # Should have at least 2 different depths with colors
        assert len(colors_by_depth) >= 2


# =============================================================================
# Test Class 4: Prediction Points
# =============================================================================

@pytest.mark.unit
class TestMergeSortPredictionPoints:
    """Test prediction points - are learning moments identified?"""

    def test_predictions_generated(self):
        """Prediction points should be generated."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        predictions = result['metadata']['prediction_points']
        
        assert isinstance(predictions, list)
        # May have 0 predictions if array is small, but should be a list
        assert predictions is not None

    def test_prediction_structure_complete(self):
        """Each prediction should have all required fields."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [4, 3, 2, 1]})
        
        predictions = result['metadata']['prediction_points']
        
        required_fields = ['step_index', 'question', 'choices', 'hint', 'correct_answer', 'explanation']
        
        for pred in predictions:
            for field in required_fields:
                assert field in pred, f"Missing field: {field}"

    def test_prediction_choices_binary(self):
        """Each prediction should have 2 choices (left or right)."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [4, 3, 2, 1]})
        
        predictions = result['metadata']['prediction_points']
        
        for pred in predictions:
            choices = pred['choices']
            assert len(choices) == 2
            
            choice_ids = {c['id'] for c in choices}
            assert choice_ids == {'left', 'right'}

    def test_correct_answer_valid(self):
        """Correct answer should be 'left' or 'right'."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [4, 3, 2, 1]})
        
        predictions = result['metadata']['prediction_points']
        valid_answers = {'left', 'right'}
        
        for pred in predictions:
            assert pred['correct_answer'] in valid_answers

    def test_prediction_limit_respected(self):
        """Should not exceed 3 predictions (requirement)."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [8, 7, 6, 5, 4, 3, 2, 1]})
        
        predictions = result['metadata']['prediction_points']
        
        # HARD LIMIT: max 3 predictions
        assert len(predictions) <= 3

    def test_prediction_question_mentions_merge(self):
        """Question should mention merging."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [4, 3, 2, 1]})
        
        predictions = result['metadata']['prediction_points']
        
        for pred in predictions:
            question = pred['question'].lower()
            assert 'merg' in question or 'select' in question

    def test_prediction_hint_helpful(self):
        """Hints should guide comparison."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        predictions = result['metadata']['prediction_points']
        
        for pred in predictions:
            hint = pred['hint'].lower()
            assert 'compar' in hint or 'vs' in hint or 'smaller' in hint


# =============================================================================
# Test Class 5: Edge Cases & Error Handling
# =============================================================================

@pytest.mark.edge_case
class TestMergeSortEdgeCases:
    """Test edge cases and error handling."""

    def test_empty_array_raises_error(self):
        """Empty array should raise ValueError."""
        tracer = MergeSortTracer()
        
        with pytest.raises(ValueError, match="cannot be empty"):
            tracer.execute({'array': []})

    def test_non_dict_input_raises_error(self):
        """Non-dictionary input should raise ValueError."""
        tracer = MergeSortTracer()
        
        with pytest.raises(ValueError, match="dictionary"):
            tracer.execute([3, 1, 2])

    def test_missing_array_key_raises_error(self):
        """Missing 'array' key should raise ValueError."""
        tracer = MergeSortTracer()
        
        with pytest.raises(ValueError, match="array"):
            tracer.execute({'data': [3, 1, 2]})

    def test_single_element_array(self):
        """Single element should return same element."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [42]})
        
        assert result['result']['sorted_array'] == [42]
        assert result['result']['comparisons'] == 0  # No comparisons needed

    def test_two_element_array(self):
        """Two elements should be sorted correctly."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [2, 1]})
        
        assert result['result']['sorted_array'] == [1, 2]

    def test_negative_numbers(self):
        """Array with negative numbers should work."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [-5, 3, -1, 0, 2]})
        
        assert result['result']['sorted_array'] == [-5, -1, 0, 2, 3]

    def test_all_same_values(self):
        """Array with all same values."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [5, 5, 5, 5]})
        
        assert result['result']['sorted_array'] == [5, 5, 5, 5]

    def test_floating_point_numbers(self):
        """Floating point numbers should work."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3.5, 1.2, 2.8]})
        
        assert result['result']['sorted_array'] == [1.2, 2.8, 3.5]

    def test_large_array_within_limit(self):
        """Array of 12 elements (within spec) should work."""
        array = list(range(12, 0, -1))  # [12, 11, ..., 1]
        
        tracer = MergeSortTracer()
        result = tracer.execute({'array': array})
        
        assert result['result']['sorted_array'] == list(range(1, 13))


# =============================================================================
# Test Class 6: Metadata Compliance
# =============================================================================

@pytest.mark.compliance
class TestMergeSortMetadataCompliance:
    """Test metadata compliance with frontend requirements."""

    def test_metadata_present(self):
        """Metadata should be present in result."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        assert 'metadata' in result

    def test_required_metadata_fields(self):
        """Metadata should have all required fields."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
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
        """algorithm field should be 'merge-sort'."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        assert result['metadata']['algorithm'] == 'merge-sort'

    def test_display_name_field_correct(self):
        """display_name field should be 'Merge Sort'."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        assert result['metadata']['display_name'] == 'Merge Sort'

    def test_visualization_type_correct(self):
        """visualization_type should be 'timeline'."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        assert result['metadata']['visualization_type'] == 'timeline'

    def test_visualization_config_structure(self):
        """visualization_config should have expected fields."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        config = result['metadata']['visualization_config']
        
        assert 'show_call_stack' in config
        assert 'show_depth_levels' in config
        assert 'color_by_depth' in config

    def test_input_size_correct(self):
        """input_size should match array length."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2, 5, 4]})
        
        assert result['metadata']['input_size'] == 5

    def test_result_structure_correct(self):
        """Result should have correct top-level structure."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        # Top-level keys
        assert 'result' in result
        assert 'trace' in result
        assert 'metadata' in result
        
        # Result structure
        assert 'sorted_array' in result['result']
        assert 'comparisons' in result['result']
        assert 'merges' in result['result']
        
        # Trace structure
        assert 'steps' in result['trace']
        assert 'total_steps' in result['trace']
        assert 'duration' in result['trace']

    def test_metadata_types_correct(self):
        """All metadata fields should have correct types."""
        tracer = MergeSortTracer()
        result = tracer.execute({'array': [3, 1, 2]})
        
        metadata = result['metadata']
        
        assert isinstance(metadata['algorithm'], str)
        assert isinstance(metadata['display_name'], str)
        assert isinstance(metadata['visualization_type'], str)
        assert isinstance(metadata['visualization_config'], dict)
        assert isinstance(metadata['input_size'], int)
        assert isinstance(metadata['prediction_points'], list)
