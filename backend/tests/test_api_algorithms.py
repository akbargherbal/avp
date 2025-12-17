# backend/tests/test_api_algorithms.py
"""
Algorithm Discovery API Tests.

Tests the /api/algorithms endpoints used for dynamic algorithm discovery.
"""

import pytest
from algorithms.registry import registry

@pytest.mark.integration
class TestAlgorithmDiscovery:
    """Test algorithm discovery endpoints."""

    def test_list_algorithms_returns_200(self, client):
        """GET /api/algorithms should return 200 and list."""
        response = client.get('/api/algorithms')
        assert response.status_code == 200
        
        data = response.get_json()
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Verify structure of first item
        algo = data[0]
        assert 'name' in algo
        assert 'display_name' in algo
        assert 'description' in algo
        assert 'example_inputs' in algo

    def test_list_algorithms_contains_registered(self, client):
        """List should contain known registered algorithms."""
        response = client.get('/api/algorithms')
        data = response.get_json()
        
        names = [a['name'] for a in data]
        assert 'binary-search' in names
        assert 'interval-coverage' in names

    def test_get_algorithm_info_success(self, client, monkeypatch):
        """GET /api/algorithms/<name>/info should return markdown."""
        
        # Mock registry.get_info to avoid file system dependency
        def mock_get_info(name):
            if name == 'binary-search':
                return "# Binary Search Info"
            raise ValueError(f"Unknown algorithm: {name}")
            
        monkeypatch.setattr(registry, 'get_info', mock_get_info)
        
        response = client.get('/api/algorithms/binary-search/info')
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['algorithm'] == 'binary-search'
        assert data['info'] == "# Binary Search Info"

    def test_get_algorithm_info_not_found(self, client):
        """Requesting info for unknown algorithm should return 404."""
        response = client.get('/api/algorithms/nonexistent-algo/info')
        assert response.status_code == 404
        
        data = response.get_json()
        assert 'error' in data
        assert 'available_algorithms' in data

    def test_list_algorithms_error_handling(self, client, monkeypatch):
        """Test error handling when registry fails."""
        
        def mock_list_algorithms():
            raise Exception("Registry failure")
            
        monkeypatch.setattr(registry, 'list_algorithms', mock_list_algorithms)
        
        response = client.get('/api/algorithms')
        assert response.status_code == 500
        
        data = response.get_json()
        assert 'error' in data
