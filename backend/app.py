# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from algorithms.interval_coverage import Interval, IntervalCoverageTracer

app = Flask(__name__)
CORS(app)  # Allow frontend to call backend


@app.route('/api/trace', methods=['POST'])
def generate_trace():
    """
    Accept intervals, return complete trace.
    Frontend sends: {"intervals": [...]}
    Backend returns: {"result": [...], "trace": {...}, "metadata": {...}}
    """
    try:
        data = request.json
        
        if not data or 'intervals' not in data:
            return jsonify({"error": "Missing 'intervals' in request body"}), 400
        
        # Convert input to Interval objects
        intervals = [
            Interval(
                id=i['id'],
                start=i['start'],
                end=i['end'],
                color=i.get('color', 'blue')
            )
            for i in data['intervals']
        ]
        
        # Generate trace
        tracer = IntervalCoverageTracer()
        result = tracer.remove_covered_intervals(intervals)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/examples', methods=['GET'])
def get_examples():
    """Provide pre-defined example inputs (NOT traces - just inputs!)"""
    examples = [
        {
            "name": "Basic Example",
            "intervals": [
                {"id": 1, "start": 540, "end": 660, "color": "blue"},
                {"id": 2, "start": 600, "end": 720, "color": "green"},
                {"id": 3, "start": 540, "end": 720, "color": "amber"},
                {"id": 4, "start": 900, "end": 960, "color": "purple"}
            ]
        },
        {
            "name": "All Disjoint",
            "intervals": [
                {"id": 1, "start": 100, "end": 200, "color": "blue"},
                {"id": 2, "start": 300, "end": 400, "color": "green"},
                {"id": 3, "start": 500, "end": 600, "color": "amber"}
            ]
        },
        {
            "name": "All Covered",
            "intervals": [
                {"id": 1, "start": 100, "end": 500, "color": "amber"},
                {"id": 2, "start": 150, "end": 200, "color": "blue"},
                {"id": 3, "start": 250, "end": 350, "color": "green"}
            ]
        }
    ]
    return jsonify(examples)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "algorithm-trace-backend",
        "available_algorithms": ["interval-coverage"]
    })


if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Algorithm Trace Backend Starting...")
    print("=" * 60)
    print("📍 Running on: http://localhost:5000")
    print("📊 Available endpoints:")
    print("   POST /api/trace      - Generate algorithm trace")
    print("   GET  /api/examples   - Get example inputs")
    print("   GET  /api/health     - Health check")
    print("=" * 60)
    print()
    
    # For development
    app.run(debug=True, port=5000)