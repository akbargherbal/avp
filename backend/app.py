from flask import Flask, jsonify, request
from flask_cors import CORS

# Import algorithms to ensure they register themselves with the registry
from algorithms.registry import registry

app = Flask(__name__)
CORS(app)

# ============================================================================
# Unified API Endpoints
# ============================================================================


@app.route("/api/algorithms", methods=["GET"])
def list_algorithms():
    """
    Return list of all available algorithms with metadata.
    Frontend uses this to dynamically populate algorithm selector.
    """
    try:
        algorithms = registry.list_algorithms()
        return jsonify(algorithms)
    except Exception as e:
        app.logger.error(f"Error listing algorithms: {e}", exc_info=True)
        return jsonify({"error": "Failed to retrieve algorithm list"}), 500


@app.route("/api/algorithms/<algorithm_name>/info", methods=["GET"])
def get_algorithm_info(algorithm_name):
    """
    Get detailed algorithm information (markdown).
    """
    try:
        info_markdown = registry.get_info(algorithm_name)
        return jsonify({"algorithm": algorithm_name, "info": info_markdown})
    except ValueError as e:
        return (
            jsonify(
                {
                    "error": str(e),
                    "available_algorithms": [
                        alg["name"] for alg in registry.list_algorithms()
                    ],
                }
            ),
            404,
        )


@app.route("/api/trace/unified", methods=["POST"])
def generate_trace_unified():
    """
    Unified trace generation endpoint - routes to correct algorithm.

    Input format:
        {
            "algorithm": "binary-search",
            "input": { ... }
        }
    """
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        # Extract algorithm name and input
        algorithm_name = data.get("algorithm")
        algorithm_input = data.get("input")

        if not algorithm_name:
            return (
                jsonify(
                    {
                        "error": "Missing required field: 'algorithm'",
                        "available_algorithms": [
                            alg["name"] for alg in registry.list_algorithms()
                        ],
                    }
                ),
                400,
            )

        # Check if algorithm exists
        if algorithm_name not in registry:
            available = [alg["name"] for alg in registry.list_algorithms()]
            return (
                jsonify(
                    {
                        "error": f"Unknown algorithm: '{algorithm_name}'",
                        "available_algorithms": available,
                    }
                ),
                404,
            )

        if algorithm_input is None:
            return jsonify({"error": "Missing required field: 'input'"}), 400

        # Get tracer class and instantiate
        tracer_class = registry.get(algorithm_name)
        tracer = tracer_class()

        # Execute algorithm with input
        # Note: Algorithm-specific validation happens in tracer.execute()
        result = tracer.execute(algorithm_input)

        return jsonify(result)

    except ValueError as e:
        # Algorithm-specific validation errors
        return jsonify({"error": str(e)}), 400

    except RuntimeError as e:
        # Algorithm execution errors (e.g., max steps exceeded)
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        app.logger.error(
            f"Unexpected error in unified trace endpoint: {e}", exc_info=True
        )
        return jsonify({"error": "An unexpected server error occurred"}), 500


@app.route("/api/health", methods=["GET"])
def health_check():
    """
    Health check endpoint.
    """
    return jsonify(
        {
            "status": "healthy",
            "service": "algorithm-trace-backend",
            "algorithms_registered": len(registry),
            "available_algorithms": [alg["name"] for alg in registry.list_algorithms()],
        }
    )


# ============================================================================
# Main Entry Point
# ============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Algorithm Trace Backend Starting...")
    print("=" * 60)
    print("📍 Running on: http://localhost:5000")
    print(f"📊 Registered Algorithms: {len(registry)}")
    for alg in registry.list_algorithms():
        print(f"   - {alg['name']}: {alg['display_name']}")
    print()
    print("📡 Available endpoints:")
    print("   GET  /api/algorithms               - List all algorithms")
    print("   GET  /api/algorithms/<name>/info   - Get algorithm details")
    print("   POST /api/trace/unified            - Unified trace endpoint")
    print("   GET  /api/health                   - Health check")
    print("=" * 60)
    print()

    app.run(debug=True, port=5000)
