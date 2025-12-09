# Interval Coverage Visualization - Proof of Concept

## Project Overview

This POC demonstrates a clean separation between algorithmic computation (backend) and visualization (frontend).

**Philosophy:** Backend does ALL the thinking, frontend does ALL the reacting.

## Project Structure

```
interval-viz-poc/
├── backend/
│   ├── algorithms/
│   │   ├── __init__.py
│   │   ├── interval_coverage.py
│   │   └── trace_generator.py
│   ├── app.py
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TimelineView.jsx
│   │   │   ├── CallStackView.jsx
│   │   │   └── Controls.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── README.md
│
└── README.md
```

## Setup Instructions

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install flask flask-cors

# Create requirements.txt
pip freeze > requirements.txt

# Run backend
python app.py
```

Backend will run on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Initialize React app (if starting fresh)
npx create-react-app .

# Install dependencies
npm install lucide-react

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Run frontend
npm start
```

Frontend will run on `http://localhost:3000`

## Key Files

### Backend: `algorithms/interval_coverage.py`

This file contains:
- `IntervalCoverageTracer` class that runs the algorithm
- Complete trace generation at EVERY step
- No frontend concerns - pure Python logic

**Key principle:** Generate complete "movie frames" that frontend can just display.

### Backend: `app.py`

Simple Flask API with two endpoints:
- `POST /api/trace` - Generate trace for given intervals
- `GET /api/examples` - Get pre-defined example inputs

### Frontend: `src/App.jsx`

React component that:
- Fetches trace from backend
- Displays current step
- Handles play/pause/step controls
- NO algorithmic logic

## Testing the POC

### 1. Start Backend
```bash
cd backend
python app.py
```

### 2. Test API Directly
```bash
curl -X POST http://localhost:5000/api/trace \
  -H "Content-Type: application/json" \
  -d '{
    "intervals": [
      {"id": 1, "start": 540, "end": 660, "color": "blue"},
      {"id": 2, "start": 600, "end": 720, "color": "green"}
    ]
  }'
```

You should see a complete JSON trace with all steps.

### 3. Start Frontend
```bash
cd frontend
npm start
```

Visit `http://localhost:3000` and you should see the visualization.

## What Makes This Different?

### ❌ Old Approach (Complex)
```javascript
// Frontend has algorithm logic
const processStep = () => {
  if (interval.end <= maxEnd) {
    // Make decisions
    // Update state
    // Compute values
  }
  // ... 200 lines of complexity
}
```

### ✅ New Approach (Simple)
```javascript
// Frontend just displays
const step = trace.steps[currentStep];
return <TimelineView data={step.data} />
```

## Benefits

1. **Debugging:** Backend generates complete trace once. Frontend bugs are just UI bugs.

2. **Flexibility:** Change visualization without touching algorithm. Change algorithm without touching UI.

3. **Testing:** Backend can be unit tested independently. Frontend can use mock traces.

4. **Scalability:** Add new algorithms by creating new trace generators. Frontend components are reusable.

5. **Performance:** Complex computation happens once on backend. Frontend just plays the "movie".

## Next Steps for Production

1. **Add More Algorithms:**
   - Create new tracer classes (MergeSortTracer, DijkstraTracer, etc.)
   - Each outputs standardized trace format
   - Frontend components just work

2. **Enhance Visualization:**
   - Add more generic components (GraphView, ArrayView, TreeView)
   - Let backend specify which components to use via metadata

3. **User Input:**
   - Add form to let users input custom intervals
   - Backend validates and generates trace
   - Frontend displays result

4. **Save/Share:**
   - Store traces in database
   - Generate shareable links
   - Export as video/GIF

## Architecture Decision Record

**Decision:** Backend generates complete trace, frontend displays it.

**Rationale:**
- Separation of concerns
- Easier debugging (frontend bugs vs algorithm bugs)
- Reusable components
- Language strengths (Python for algorithms, React for UI)

**Trade-offs:**
- Larger initial payload (but cached/compressed easily)
- Backend must anticipate all visualization needs (but trace is flexible)

**Result:** Much simpler codebase, easier to maintain and extend.

## File Size Reference

- `interval_coverage.py`: ~200 lines (algorithm + trace generation)
- `app.py`: ~50 lines (simple API)
- `App.jsx`: ~150 lines (pure visualization)

Total: ~400 lines vs ~500+ lines with mixed concerns.

## Questions This POC Answers

1. ✅ Can backend generate complete traces?
2. ✅ Is the JSON payload reasonable size?
3. ✅ Can frontend display traces without algorithmic logic?
4. ✅ Is this approach scalable to other algorithms?
5. ✅ Do the components feel reactive and responsive?

## Success Criteria

- [ ] Backend generates trace in <100ms
- [ ] JSON payload is <100KB uncompressed
- [ ] Frontend renders smoothly at 60fps
- [ ] Adding a new visualization component takes <1 hour
- [ ] Adding a new algorithm takes <2 hours
- [ ] Zero algorithm logic in React components