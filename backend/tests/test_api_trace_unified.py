# backend/tests/test_api_trace_unified.py

"""
Unified Trace Endpoint Tests.

Tests the /api/trace/unified endpoint for both binary search
and interval coverage algorithms.
"""

import pytest
from werkzeug.exceptions import UnsupportedMediaType, BadRequest


@pytest.mark.integration
class TestUnifiedTraceEndpoint:
    """Test /api/trace/unified endpoint."""

    def test_missing_request_body_returns_500(self, client):
        """Request without body raises UnsupportedMediaType caught as 500."""
        # Flask raises UnsupportedMediaType when no content-type, caught by generic handler
        response = client.post('/api/trace/unified')
        assert response.status_code == 500

        data = response.get_json()
        assert 'error' in data

    def test_missing_algorithm_field_returns_400(self, client):
        """Request without 'algorithm' field should return 400."""
        response = client.post('/api/trace/unified', json={
            'input': {'array': [1, 2, 3], 'target': 2}
        })
        assert response.status_code == 400

        data = response.get_json()
        assert 'error' in data
        assert 'algorithm' in data['error']
        assert 'available_algorithms' in data

    def test_missing_input_field_returns_400(self, client):
        """Request without 'input' field should return 400."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'binary-search'
        })
        assert response.status_code == 400

        data = response.get_json()
        assert 'error' in data
        assert 'input' in data['error']

    def test_unknown_algorithm_returns_404(self, client):
        """Request with unknown algorithm should return 404."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'nonexistent-algorithm',
            'input': {}
        })
        assert response.status_code == 404

        data = response.get_json()
        assert 'error' in data
        assert 'nonexistent-algorithm' in data['error']
        assert 'available_algorithms' in data

    def test_binary_search_success(self, client):
        """Valid binary search request should return 200."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'binary-search',
            'input': {
                'array': [1, 3, 5, 7, 9],
                'target': 5
            }
        })
        assert response.status_code == 200

        data = response.get_json()
        assert 'trace' in data
        assert 'result' in data
        assert 'metadata' in data

    def test_binary_search_response_structure(self, client):
        """Binary search response should have complete structure."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'binary-search',
            'input': {
                'array': [1, 3, 5, 7, 9],
                'target': 5
            }
        })

        data = response.get_json()

        # Check trace structure
        assert 'steps' in data['trace']
        assert 'total_steps' in data['trace']
        assert 'duration' in data['trace']

        # Check result structure
        assert 'found' in data['result']
        assert 'index' in data['result']

        # Check metadata structure
        assert data['metadata']['algorithm'] == 'binary-search'
        assert data['metadata']['display_name'] == 'Binary Search'
        assert data['metadata']['visualization_type'] == 'array'

    def test_binary_search_invalid_input_returns_400(self, client):
        """Invalid binary search input should return 400."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'binary-search',
            'input': {
                'array': [],  # Empty array - invalid
                'target': 5
            }
        })
        assert response.status_code == 400

        data = response.get_json()
        assert 'error' in data

    def test_binary_search_unsorted_array_returns_400(self, client):
        """Unsorted array should return 400."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'binary-search',
            'input': {
                'array': [5, 3, 1],  # Unsorted
                'target': 3
            }
        })
        assert response.status_code == 400

        data = response.get_json()
        assert 'error' in data

    def test_interval_coverage_success(self, client):
        """Valid interval coverage request should return 200."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'interval-coverage',
            'input': {
                'intervals': [
                    {'id': 1, 'start': 10, 'end': 50, 'color': 'blue'},
                    {'id': 2, 'start': 20, 'end': 60, 'color': 'green'}
                ]
            }
        })
        assert response.status_code == 200

        data = response.get_json()
        assert 'trace' in data
        assert 'result' in data
        assert 'metadata' in data

    def test_interval_coverage_response_structure(self, client):
        """Interval coverage response should have complete structure."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'interval-coverage',
            'input': {
                'intervals': [
                    {'id': 1, 'start': 10, 'end': 50, 'color': 'blue'}
                ]
            }
        })

        data = response.get_json()

        # Check trace structure
        assert 'steps' in data['trace']
        assert 'total_steps' in data['trace']
        assert 'duration' in data['trace']

        # Check result is list of intervals
        assert isinstance(data['result'], list)

        # Check metadata structure
        assert data['metadata']['algorithm'] == 'interval-coverage'
        assert data['metadata']['display_name'] == 'Interval Coverage'
        assert data['metadata']['visualization_type'] == 'timeline'

    def test_interval_coverage_too_many_intervals_returns_400(self, client):
        """Too many intervals should return 400."""
        # Create 101 intervals (MAX_INTERVALS = 100)
        intervals = [
            {'id': i, 'start': i * 10, 'end': i * 10 + 5, 'color': 'blue'}
            for i in range(101)
        ]

        response = client.post('/api/trace/unified', json={
            'algorithm': 'interval-coverage',
            'input': {'intervals': intervals}
        })
        assert response.status_code == 400

        data = response.get_json()
        assert 'error' in data
        assert 'Too many intervals' in data['error']

    def test_prediction_points_included(self, client):
        """Response should include prediction points in metadata."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'binary-search',
            'input': {
                'array': [1, 3, 5, 7, 9],
                'target': 5
            }
        })

        data = response.get_json()
        assert 'prediction_points' in data['metadata']
        assert isinstance(data['metadata']['prediction_points'], list)

    def test_visualization_data_in_steps(self, client):
        """Each step should include visualization data."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'binary-search',
            'input': {
                'array': [1, 3, 5],
                'target': 3
            }
        })

        data = response.get_json()
        steps = data['trace']['steps']

        for step in steps:
            assert 'data' in step
            assert 'visualization' in step['data']

    def test_json_content_type(self, client):
        """Response should have JSON content type."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'binary-search',
            'input': {
                'array': [1, 3, 5],
                'target': 3
            }
        })

        assert response.content_type == 'application/json'

    def test_empty_intervals_list_works(self, client):
        """Empty intervals list should work (returns empty result)."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'interval-coverage',
            'input': {'intervals': []}
        })

        assert response.status_code == 200

        data = response.get_json()
        assert len(data['result']) == 0

    def test_single_element_binary_search(self, client):
        """Single element array should work."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'binary-search',
            'input': {
                'array': [42],
                'target': 42
            }
        })

        assert response.status_code == 200

        data = response.get_json()
        assert data['result']['found'] is True
        assert data['result']['index'] == 0

    def test_trace_steps_have_required_fields(self, client):
        """Each trace step should have required fields."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'binary-search',
            'input': {
                'array': [1, 3, 5],
                'target': 3
            }
        })

        data = response.get_json()
        steps = data['trace']['steps']

        for step in steps:
            assert 'step' in step
            assert 'type' in step
            assert 'data' in step
            assert 'description' in step
            assert 'timestamp' in step

    def test_concurrent_requests_handled(self, client):
        """Multiple concurrent requests should work."""
        # Simulate concurrent requests
        responses = []

        for i in range(5):
            response = client.post('/api/trace/unified', json={
                'algorithm': 'binary-search',
                'input': {
                    'array': [1, 3, 5, 7, 9],
                    'target': 5
                }
            })
            responses.append(response)

        # All should succeed
        for response in responses:
            assert response.status_code == 200


@pytest.mark.integration
class TestUnifiedTraceErrorHandling:
    """Test error handling in unified trace endpoint."""

    def test_invalid_json_returns_500(self, client):
        """Invalid JSON raises BadRequest caught as 500."""
        # Flask raises BadRequest for invalid JSON, caught by generic handler
        response = client.post(
            '/api/trace/unified',
            data='not valid json',
            content_type='application/json'
        )
        assert response.status_code == 500

    def test_null_input_returns_400(self, client):
        """Null input field should return 400."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'binary-search',
            'input': None
        })
        assert response.status_code == 400

    def test_malformed_algorithm_input(self, client):
        """Malformed input for algorithm should return 400."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'binary-search',
            'input': {
                'array': 'not-an-array',  # Wrong type
                'target': 5
            }
        })
        assert response.status_code == 400

    def test_error_response_structure(self, client):
        """Error responses should have consistent structure."""
        response = client.post('/api/trace/unified', json={
            'algorithm': 'unknown'
        })

        data = response.get_json()
        assert 'error' in data
        assert isinstance(data['error'], str)

    def test_unified_trace_runtime_error_handling(self, client, monkeypatch):
        """Test RuntimeError handling in unified trace endpoint."""
        from algorithms.binary_search import BinarySearchTracer

        def mock_execute_runtime_error(self, input_data):
            raise RuntimeError("Max steps exceeded")

        monkeypatch.setattr(BinarySearchTracer, 'execute', mock_execute_runtime_error)

        response = client.post('/api/trace/unified', json={
            'algorithm': 'binary-search',
            'input': {'array': [1, 3, 5], 'target': 3}
        })

        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data

    def test_unified_trace_generic_exception_handling(self, client, monkeypatch):
        """Test generic exception handling in unified trace endpoint."""
        from algorithms.binary_search import BinarySearchTracer

        def mock_execute_generic_error(self, input_data):
            raise TypeError("Simulated type error")

        monkeypatch.setattr(BinarySearchTracer, 'execute', mock_execute_generic_error)

        response = client.post('/api/trace/unified', json={
            'algorithm': 'binary-search',
            'input': {'array': [1, 3, 5], 'target': 3}
        })

        assert response.status_code == 500
        data = response.get_json()
        assert 'error' in data
        assert 'unexpected server error' in data['error'].lower()
