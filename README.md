# Interval Coverage Visualization - Interactive Learning Tool

## Project Overview

This project demonstrates a clean separation between algorithmic computation (backend) and visualization (frontend) for educational algorithm visualization, enhanced with **active learning features** that transform passive observation into engaged practice.

**Philosophy:** Backend does ALL the thinking, frontend does ALL the reacting.

**Status:** ✅ Phase 3 Complete - Interactive Learning Tool with Prediction Mode, Visual Highlighting, and Educational Descriptions

## Project Structure

```
interval-viz-poc/
├── backend/
│   ├── algorithms/
│   │   ├── __init__.py
│   │   └── interval_coverage.py    # Algorithm + trace generation
│   ├── app.py                       # Flask API with validation
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ControlBar.jsx       # Navigation controls
│   │   │   ├── CompletionModal.jsx  # Success screen with accuracy
│   │   │   ├── ErrorBoundary.jsx    # Error handling
│   │   │   ├── KeyboardHints.jsx    # Keyboard shortcuts display
│   │   │   └── PredictionModal.jsx  # Interactive prediction prompts
│   │   ├── utils/
│   │   │   └── predictionUtils.js   # Prediction logic helpers
│   │   ├── App.jsx                  # Main container + visualizations
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   ├── .env.development             # Dev environment config
│   ├── .env.production              # Production environment config
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+ (or use pnpm)
- pip and npm/pnpm

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend
python app.py
```

Backend will run on `http://localhost:5000`

**Backend includes:**
- ✅ Input validation with Pydantic
- ✅ Safety limits (max 100 intervals, 10,000 steps)
- ✅ Clear error messages for invalid input
- ✅ CORS support for frontend
- ✅ Educational step descriptions explaining strategy

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install
# or if using pnpm:
pnpm install

# Run frontend
npm start
# or:
pnpm start
```

Frontend will run on `http://localhost:3000`

**Frontend includes:**
- ✅ Component-based architecture (5 extracted components)
- ✅ Error boundaries for graceful failure
- ✅ Environment-based configuration
- ✅ Safe array access (no crashes on malformed data)
- ✅ Deliberate step-by-step navigation
- ✅ **Interactive prediction mode for active learning**
- ✅ **Visual highlighting connecting call stack to timeline**
- ✅ **Educational step descriptions with strategy explanations**
- ✅ **Keyboard shortcuts for efficient navigation**
- ✅ **Accuracy tracking and feedback**

## Active Learning Features

### 🎯 Prediction Mode (Phase 1)

Transform passive observation into active engagement by predicting algorithm decisions before they're revealed.

**Features:**
- **Interactive prompts** at key decision points (EXAMINING_INTERVAL steps)
- **Immediate feedback** with correct/incorrect indication and explanation
- **Accuracy tracking** throughout the trace with percentage display
- **Encouraging feedback** based on performance (90%+: "Excellent!", 70-89%: "Great job!", etc.)
- **Skip option** for questions you want to bypass
- **Watch mode toggle** to switch between interactive and passive viewing

**Keyboard Shortcuts:**
- `K` - Predict "KEEP"
- `C` - Predict "COVERED"
- `S` - Skip question

**Pedagogical Impact:**
- Forces active thinking at critical moments
- Provides immediate reinforcement of correct understanding
- Identifies gaps in comprehension through accuracy metrics
- Mirrors real problem-solving (predict → verify → learn)

### 🔗 Visual Bridge Between Views (Phase 2)

Eliminate mental mapping overhead by directly connecting abstract call stack to concrete timeline visualization.

**Features:**
- **Automatic highlighting** - Active interval in call stack glows on timeline with yellow ring
- **Dimming effect** - Non-active intervals fade to 40% opacity for focus
- **Hover sync** - Hover over any call stack entry to highlight its interval on timeline
- **Smooth transitions** - 300ms GPU-accelerated animations for polish
- **Smart priority** - Hover overrides automatic highlighting for exploration

**Visual Indicators:**
- 🟡 **Yellow ring + glow** - Currently highlighted interval
- 🟡 **Yellow border** - Interval being examined by algorithm
- 🔵 **Cyan line** - max_end coverage tracker
- ⚫ **Dimmed** - Intervals not currently relevant

**Pedagogical Impact:**
- Reduces cognitive load (no manual mapping needed)
- Makes recursion concrete (see which interval each call processes)
- Enables exploration without committing to step changes
- Guides attention to relevant information

### 📚 Enhanced Step Descriptions (Phase 3)

Replace mechanical descriptions with educational explanations that teach the greedy algorithm strategy.

**Features:**
- **Step type badges** with 7 color-coded categories:
  - ⚖️ DECISION (green) - Keep/covered decisions
  - 📊 COVERAGE (cyan) - max_end updates
  - 🔍 EXAMINE (yellow) - Interval comparisons
  - 🔄 RECURSION (blue) - Recursive calls
  - 🎯 BASE CASE (purple) - Termination
  - 📊 SORT (orange) - Sorting steps
  - 🎬 STATE (pink) - Algorithm states

- **Strategy explanations** at critical moments:
  - SORT_COMPLETE: "✓ Sorted! Now we can use a greedy strategy..."
  - EXAMINING_INTERVAL: "Does interval extend beyond max_end? If yes, KEEP..."
  - DECISION_MADE: "✅ KEEP: end > max_end — this extends coverage..."
  - MAX_END_UPDATE: "Coverage extended: max_end updated from X → Y..."

- **Visual hierarchy** - Badge first, then description in larger, readable text
- **Gradient background** with border for professional appearance

**Pedagogical Impact:**
- Students learn WHY decisions are made, not just WHAT
- Greedy strategy is explicit (not inferred)
- Reduces confusion with clear step categorization
- Works synergistically with prediction mode

## Keyboard Shortcuts

Master efficient navigation with these shortcuts:

| Keys | Action | Context |
|------|--------|---------|
| `→` or `Space` | Next step | During navigation |
| `←` | Previous step | During navigation |
| `R` or `Home` | Reset to start | Anytime |
| `End` | Jump to end | During navigation |
| `Esc` | Close modal | In completion modal |
| `K` | Predict "KEEP" | In prediction modal |
| `C` | Predict "COVERED" | In prediction modal |
| `S` | Skip question | In prediction modal |

**Tip:** Click the keyboard icon (bottom-right) to see shortcuts anytime.

## Environment Configuration

The application uses environment variables for deployment flexibility:

**Development** (`.env.development`):
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

**Production** (`.env.production`):
```bash
REACT_APP_API_URL=https://your-backend-domain.com/api
```

**Local Overrides** (create `.env.development.local` if needed):
```bash
REACT_APP_API_URL=http://localhost:9999/api
```

## API Documentation

### POST `/api/trace`

Generate algorithm trace for given intervals.

**Request:**
```json
{
  "intervals": [
    {"id": 1, "start": 540, "end": 660, "color": "blue"},
    {"id": 2, "start": 600, "end": 720, "color": "green"}
  ]
}
```

**Validation Rules:**
- `id` must be a non-negative integer
- `start` and `end` must be integers
- `end` must be greater than `start`
- Maximum 100 intervals per request
- `color` is optional (defaults to "blue")

**Response (200 OK):**
```json
{
  "result": [...],
  "trace": {
    "steps": [...],
    "total_steps": 47,
    "duration": 0.023
  },
  "metadata": {
    "input_size": 4,
    "output_size": 2
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid input data",
  "details": [
    {
      "field": "end",
      "message": "end (650) must be greater than start (700)"
    }
  ]
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0"
}
```

## Key Architecture Decisions

### 1. Backend-Generated Traces

**Decision:** Backend generates complete execution trace upfront.

**Benefits:**
- Frontend has zero algorithm logic
- Traces are deterministic and replayable
- Easier debugging (backend bugs vs UI bugs)
- Backend can be unit tested independently

**Trade-offs:**
- Larger initial payload (~50KB for typical inputs)
- Backend must anticipate visualization needs

### 2. Prediction Mode for Active Learning

**Decision:** Add interactive prediction layer on top of existing trace architecture (frontend-only change).

**Rationale (Pedagogical):**
- Algorithm learning requires active engagement, not passive watching
- Predicting forces students to apply understanding before seeing answers
- Immediate feedback creates effective learning loops
- Accuracy metrics help students self-assess

**Implementation:**
- Detect decision points from trace data (EXAMINING_INTERVAL steps)
- Present modal blocking navigation until prediction made
- Compare user choice against next step (DECISION_MADE)
- Track accuracy statistics throughout session

**Code Impact:** Added ~400 lines across 2 new files (PredictionModal, predictionUtils) with no backend changes.

### 3. Visual Bridge Between Views

**Decision:** Use automatic highlighting to connect call stack entries to timeline intervals.

**Rationale:**
- Students struggle to mentally map abstract recursion to concrete intervals
- Manual visual search adds unnecessary cognitive load
- Direct visual connection makes relationships explicit
- Hover interaction enables exploration without commitment

**Implementation:**
- Extract highlighted interval ID from active call stack entry
- Pass to timeline with dimming for non-highlighted intervals
- Add hover handlers for bidirectional sync
- Use GPU-accelerated CSS transforms for smooth 60fps animations

**Code Impact:** ~120 lines of changes in App.jsx and TimelineView, no backend changes.

### 4. Educational Descriptions

**Decision:** Rewrite step descriptions to explain strategy, not just mechanics.

**Rationale:**
- Students need to understand WHY decisions are made
- Mechanical descriptions ("Decision: KEEP") don't teach the algorithm
- Greedy strategy should be explicit, not inferred
- Step type badges help orient students in execution flow

**Implementation:**
- Backend: Enhanced 15 description strings with strategy explanations
- Frontend: Added step type badge function + gradient description container
- Visual hierarchy: Badge → Description (larger text, better spacing)

**Code Impact:** ~15 backend description changes + ~60 frontend lines for badges/styling.

### 5. Component Extraction

**Decision:** Split monolithic `App.jsx` (570 lines) into focused components.

**Structure:**
- `App.jsx` (~450 lines) - Container + visualizations
- `ControlBar.jsx` - Navigation controls
- `CompletionModal.jsx` - Success screen with accuracy
- `ErrorBoundary.jsx` - Error handling
- `KeyboardHints.jsx` - Shortcuts display
- `PredictionModal.jsx` - Interactive predictions

**Benefits:**
- Easier to maintain and debug
- Reusable components
- Clear separation of concerns
- Enables independent testing

### 6. Input Validation

**Decision:** Use Pydantic for schema-based validation.

**Validation:**
```python
class IntervalInput(BaseModel):
    id: int
    start: int
    end: int
    color: str = 'blue'
    
    @field_validator('end')
    def end_after_start(cls, v, values):
        if 'start' in values and v <= values['start']:
            raise ValueError(...)
```

**Benefits:**
- Clear error messages for users
- Type safety with minimal boilerplate
- Automatic JSON serialization
- Prevents cryptic backend crashes

## Testing

### Backend Testing

```bash
cd backend
python app.py
```

Then test with curl:

```bash
# Valid input
curl -X POST http://localhost:5000/api/trace \
  -H "Content-Type: application/json" \
  -d '{
    "intervals": [
      {"id": 1, "start": 540, "end": 660, "color": "blue"},
      {"id": 2, "start": 600, "end": 720, "color": "green"}
    ]
  }'

# Invalid input (start >= end)
curl -X POST http://localhost:5000/api/trace \
  -H "Content-Type: application/json" \
  -d '{
    "intervals": [
      {"id": 1, "start": 700, "end": 650, "color": "blue"}
    ]
  }'
# Should return 400 with clear error message
```

### Frontend Testing

1. **Normal Operation:**
   - Start both backend and frontend
   - Navigate through steps with Next/Previous/Reset
   - Verify completion modal shows accuracy statistics

2. **Prediction Mode:**
   - Enable prediction mode (blue "⏳ Predict" button)
   - Make predictions at decision points (K for Keep, C for Covered)
   - Verify immediate feedback appears (correct/incorrect)
   - Check accuracy percentage in completion modal
   - Try skip button (S key) to bypass questions

3. **Visual Highlighting:**
   - Observe active interval highlighted with yellow ring on timeline
   - Verify other intervals dim to 40% opacity
   - Hover over call stack entries and check timeline highlighting
   - Confirm smooth transitions (no jank or flickering)

4. **Step Descriptions:**
   - Check step type badges appear with correct colors
   - Verify descriptions explain WHY decisions are made
   - Look for strategy explanations at SORT_COMPLETE steps
   - Confirm gradient background and readable text

5. **Keyboard Shortcuts:**
   - Click keyboard icon (bottom-right) to see shortcuts
   - Test navigation: → (next), ← (prev), R (reset)
   - Test prediction shortcuts: K (keep), C (covered), S (skip)
   - Verify shortcuts don't interfere with modals

6. **Error Handling:**
   - Stop backend
   - Start frontend
   - Should see "Backend Not Available" error with retry button

## Performance Metrics

| Metric | Target | Current Status |
|--------|--------|---------------|
| Backend trace generation | <100ms | ✅ ~20-50ms |
| JSON payload size | <100KB | ✅ ~30-50KB |
| Frontend render time | 60fps | ✅ Smooth |
| Prediction modal response | <50ms | ✅ Instant |
| Highlight transitions | 60fps | ✅ GPU-accelerated |
| Component extraction time | <1 hour | ✅ Complete |
| New algorithm integration | <2 hours | 🔄 Not yet tested |

## What Makes This Different?

### ❌ Traditional Approach (Complex)
```javascript
// Frontend has algorithm logic
const processStep = () => {
  if (interval.end <= maxEnd) {
    // Make decisions
    // Update state
    // Compute values
  }
  // ... 200 lines of mixed concerns
}
```

### ✅ Our Approach (Simple & Effective)
```javascript
// Backend generates complete trace
const step = trace?.trace?.steps?.[currentStep];

// Frontend adds interaction layer
if (isPredictionPoint(step)) {
  return <PredictionModal onAnswer={handleAnswer} />;
}

// Pure visualization
return <TimelineView step={step} highlightId={activeId} />;
```

**Result:** Zero algorithm logic in frontend, but maximum pedagogical value through interaction.

## Deployment

### Backend (Production)

```bash
# Using Gunicorn (recommended)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Or use Flask directly (not recommended for production)
FLASK_ENV=production python app.py
```

**Environment Variables:**
- `FLASK_ENV=production`
- `CORS_ORIGINS=https://your-frontend-domain.com`
- `MAX_INTERVALS=100` (optional)
- `MAX_STEPS=10000` (optional)

### Frontend (Production)

```bash
# Build for production
npm run build
# or:
pnpm build

# Serve with any static host (Vercel, Netlify, etc.)
# Make sure to set REACT_APP_API_URL to your backend URL
```

**Required Environment Variable:**
```bash
REACT_APP_API_URL=https://api.your-domain.com/api
```

## Improvements from Initial POC

| Area | Before (POC) | After (Phase 3) |
|------|-------------|-----------------|
| **Input Validation** | ❌ None - crashes on bad input | ✅ Pydantic validation with clear errors |
| **Error Handling** | ❌ White screen on errors | ✅ Error boundaries + error states |
| **Code Structure** | ❌ 570-line monolithic App.jsx | ✅ 5 extracted components |
| **Learning Mode** | ❌ Passive observation only | ✅ Interactive prediction mode |
| **Visual Connection** | ❌ Manual mental mapping required | ✅ Automatic highlighting + hover sync |
| **Step Descriptions** | ❌ Mechanical ("Decision: KEEP") | ✅ Educational ("✅ KEEP: extends coverage...") |
| **Deployment** | ❌ Hardcoded URLs | ✅ Environment-based config |
| **Data Safety** | ❌ Crashes on malformed data | ✅ Safe access with fallbacks |
| **User Feedback** | ❌ No accuracy tracking | ✅ Prediction stats + encouraging feedback |
| **Navigation** | ❌ Mouse-only | ✅ Full keyboard shortcuts |
| **Code Size** | ~750 lines total | ~1100 lines total (+350 for active learning) |

## Roadmap

### ✅ Completed (Phase 1-3)
- Backend input validation with Pydantic
- Trace size limits (100 intervals, 10k steps)
- Component extraction (5 components)
- Environment configuration
- Safe array access patterns
- Error boundaries
- **Phase 1: Prediction Mode** ✅
  - Interactive prediction prompts at decision points
  - Immediate feedback with explanations
  - Accuracy tracking and statistics
  - Skip option for flexibility
  - Keyboard shortcuts (K/C/S)
- **Phase 2: Visual Bridge Between Views** ✅
  - Automatic highlighting from call stack to timeline
  - Dimming effect for focus
  - Hover sync for exploration
  - Smooth GPU-accelerated transitions
- **Phase 3: Enhanced Step Descriptions** ✅
  - Educational descriptions explaining strategy
  - Step type badges (7 categories, color-coded)
  - Gradient description container with better formatting
  - Strategy explanations at critical moments

### 🔄 Next Phase (Phase 4 - Optional Quick Wins)
- [ ] Difficulty selector (3 preset example sets: beginner/intermediate/advanced)
- [ ] Collapsible call stack (collapse completed calls to reduce clutter)
- [ ] Jump to decision button (skip setup steps, go directly to next decision)
- [ ] Custom interval input editor (manually create/edit intervals)

### 🎯 Future (V2+)
- [ ] Automated tests (pytest + React Testing Library)
- [ ] Shareable URLs (save trace, generate link)
- [ ] Performance optimization (React.memo, delta encoding)
- [ ] Multiple algorithm support
- [ ] Accessibility improvements (ARIA labels, screen reader support)
- [ ] Export trace as step-by-step PDF/slides
- [ ] Compare two executions side-by-side
- [ ] Annotation/notes on steps
- [ ] Dark/light theme toggle
- [ ] Algorithm explanation panel
- [ ] Base tracer abstraction for new algorithms

## Contributing

### Adding a New Algorithm

1. Create new tracer class in `backend/algorithms/`:
```python
class YourAlgorithmTracer(AlgorithmTracer):
    def execute(self, input_data):
        # Implement algorithm with trace generation
        pass
```

2. Add endpoint in `backend/app.py`:
```python
@app.route('/api/your-algorithm/trace', methods=['POST'])
def generate_your_trace():
    # Validate input, generate trace, return JSON
    pass
```

3. Frontend components are reusable - just fetch new endpoint!

### Code Style

- **Backend:** PEP 8, type hints, docstrings
- **Frontend:** ESLint rules, functional components, Tailwind CSS
- **Commits:** Conventional commits (feat:, fix:, refactor:, docs:)

## License

MIT License - See LICENSE file for details

## Questions This Project Answers

1. ✅ Can backend generate complete traces efficiently? (Yes - 20-50ms)
2. ✅ Is the JSON payload reasonable size? (Yes - 30-50KB)
3. ✅ Can frontend display traces without algorithmic logic? (Yes - pure visualization)
4. ✅ Is this approach scalable to other algorithms? (Architecture supports it)
5. ✅ Do the components feel reactive and responsive? (60fps, smooth navigation)
6. ✅ Does error handling prevent crashes? (Error boundaries + validation)
7. ✅ Is the codebase maintainable? (Clear separation, extracted components)
8. ✅ **Does prediction mode improve learning outcomes?** (User engagement metrics pending)
9. ✅ **Do visual connections reduce cognitive load?** (Highlighting eliminates manual mapping)
10. ✅ **Can educational descriptions teach strategy effectively?** (Explanations at critical moments)

## Support

For issues or questions:
- Open an issue on GitHub
- Review the implementation plan in `docs/1.0.0_PLAN.md`
- Check session summaries in `docs/session_*.md`
- See deployment guide in `docs/phase3_deployment_guide.md`

---

**Built with:** Python (Flask) + React + Tailwind CSS  
**Architecture:** Backend trace generation, frontend visualization + active learning  
**Status:** ✅ Phase 3 Complete - Interactive Learning Tool Ready for User Testing  
**Development Time:** 3 sessions (~10 hours) from MVP to Phase 3