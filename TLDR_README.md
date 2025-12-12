# Algorithm Visualization Platform - TLDR

## 🎯 Core Concept

**"Backend does ALL the thinking, frontend does ALL the reacting"**

Educational platform for visualizing algorithms with active learning. Add new algorithms in **3 simple steps** with **zero routing changes**.

---

## ✨ The Registry Magic

### Adding a New Algorithm (1-2 hours)

```python
# Step 1: Create your algorithm (backend/algorithms/your_algo.py)
from .base_tracer import AlgorithmTracer

class YourAlgorithm(AlgorithmTracer):
    def execute(self, input_data):
        # REQUIRED: Set metadata
        self.metadata = {
            'algorithm': 'your-algo',
            'display_name': 'Your Algorithm',      # ✅ REQUIRED
            'visualization_type': 'array',         # ✅ REQUIRED (array/timeline/graph/tree)
        }

        # Your algorithm logic
        self._add_step("INITIAL", {...}, "Starting...")
        # ... more steps ...

        return self._build_trace_result(result)

    def get_prediction_points(self):
        # Define interactive learning moments
        return [{
            'step_index': 5,
            'question': 'What happens next?',
            'choices': [
                {'id': 'a', 'label': 'Option A'},
                {'id': 'b', 'label': 'Option B'}
            ],
            'correct_answer': 'b'
        }]

# Step 2: Register it (backend/algorithms/registry.py)
from .your_algo import YourAlgorithm

registry.register(
    name='your-algo',
    tracer_class=YourAlgorithm,
    display_name='Your Algorithm',
    description='What it does',
    example_inputs=[{
        'name': 'Basic Example',
        'input': {'data': [...]}
    }]
)

# Step 3: That's it! ✅
# - Algorithm appears in UI dropdown automatically
# - No app.py changes needed
# - No frontend routing changes needed
```

---

## 🏗️ Architecture

### One Endpoint Rules Them All

```bash
# Single unified endpoint for ALL algorithms
POST /api/trace/unified
{
  "algorithm": "binary-search",  # or any registered algorithm
  "input": {...}
}
```

**How it works:**

1. Registry maps algorithm name → your tracer class
2. Backend executes and generates complete trace
3. Frontend receives standardized response
4. Visualization auto-selected based on `visualization_type`

### Reusable Visualizations

```python
# Backend declares type
metadata['visualization_type'] = 'array'

# Frontend automatically uses:
# 'array'    → ArrayView    (Binary Search, Merge Sort, Quick Sort)
# 'timeline' → TimelineView (Interval Coverage)
# 'graph'    → GraphView    (DFS, BFS, Dijkstra)
# 'tree'     → TreeView     (BST, Heap operations)
```

**Result:** Binary Search reused ArrayView → **0 minutes** of visualization work!

---

## 📁 Project Structure

```
backend/algorithms/
  ├── base_tracer.py       # ⭐ Inherit from AlgorithmTracer
  ├── registry.py          # ⭐ Register your algorithm here
  └── your_algorithm.py    # ⭐ Your implementation

frontend/src/
  ├── components/visualizations/
  │   ├── ArrayView.jsx       # Reuse for array algorithms
  │   └── TimelineView.jsx    # Reuse for interval algorithms
  └── utils/visualizationRegistry.js  # Maps types → components
```

---

## ✅ Quality Gates (Before You Push)

### Run These 3 Checklists In Order:

#### 1. Backend Checklist (`docs/compliance/BACKEND_CHECKLIST.md`)

- [ ] Has `display_name` and `visualization_type`?
- [ ] Uses `_add_step()` for trace generation?
- [ ] Prediction points have ≤3 choices?
- [ ] Returns `self._build_trace_result()`?

#### 2. Frontend Checklist (`docs/compliance/FRONTEND_CHECKLIST.md`)

- [ ] Uses overflow pattern: `items-start` + `mx-auto` (NOT `items-center`)?
- [ ] Modal IDs are `#prediction-modal`, `#completion-modal`?
- [ ] Keyboard shortcuts work (←→ navigation, R reset)?

#### 3. QA Checklist (`docs/compliance/QA_INTEGRATION_CHECKLIST.md`)

- [ ] All algorithms still work (no regressions)?
- [ ] Responsive on 3 viewport sizes?
- [ ] Performance <100ms trace generation?

**Total time: ~25 minutes** for compliance validation

---

## 🚀 Quick Start

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py  # → http://localhost:5000

# Frontend (separate terminal)
cd frontend
npm install
npm start  # → http://localhost:3000

# Test it works
curl http://localhost:5000/api/algorithms | jq
```

---

## 🎮 Features

### Active Learning (Prediction Mode)

1. Click "⏳ Predict" (top-right)
2. Algorithm pauses at decision points
3. Predict outcome → Get immediate feedback
4. Track your accuracy throughout

### Keyboard Shortcuts

- `→` or `Space` - Next step
- `←` - Previous step
- `R` - Reset to start
- `K/C` - Predict choices
- `S` - Skip question

---

## ⚠️ Critical Rules (Don't Break These!)

### Backend

```python
# ❌ WRONG: Missing required fields
self.metadata = {
    'algorithm': 'merge-sort'
}

# ✅ CORRECT
self.metadata = {
    'algorithm': 'merge-sort',
    'display_name': 'Merge Sort',      # Required
    'visualization_type': 'array',     # Required
}
```

### Frontend

```javascript
// ❌ WRONG: items-center causes overflow cutoff
<div className="... items-center overflow-auto">

// ✅ CORRECT: items-start + mx-auto pattern
<div className="... items-start overflow-auto">
  <div className="mx-auto">
    {/* content */}
  </div>
</div>
```

---

## 📊 Current Status

**✅ Platform Complete** - 2 Algorithms Live:

- **Interval Coverage** (Timeline visualization)
- **Binary Search** (Array visualization)

**Ready for expansion** - Architecture supports infinite algorithms with zero boilerplate.

---

## 🎯 Adding Your Algorithm (Quick Reference)

1. **Backend** (30-45 min):

   - Create tracer class inheriting `AlgorithmTracer`
   - Implement `execute()` and `get_prediction_points()`
   - Register in `registry.py`

2. **Frontend** (0-30 min):

   - **Option A**: Reuse existing visualization → 0 minutes
   - **Option B**: Create new visualization → 30 minutes

3. **Compliance** (25 min):
   - Run 3 checklists
   - Fix violations
   - Verify no regressions

**Total: 1-2 hours** from idea to production-ready algorithm

---

## 📚 Documentation

- **Full README**: Detailed architecture, contributing guide, compliance system
- **Tenant Guide**: `docs/TENANT_GUIDE.md` - Requirement tiers (LOCKED/CONSTRAINED/FREE)
- **Compliance Checklists**: `docs/compliance/` - Backend, Frontend, QA validation
- **API Docs**: See full README for endpoint specifications

---

## 🆘 Support

- **Issues**: Open GitHub issue with [Bug], [Feature], or [Question] tag
- **Contributing**: See "Adding Your Algorithm" section above
- **Compliance Questions**: Reference `docs/compliance/CHECKLIST_SYSTEM_OVERVIEW.md`

---

**License:** MIT

**Built with:** Python 3.11, Flask, React 18, Tailwind CSS

**Development Time:** ~30 hours from concept to production-ready platform with 2 algorithms

_Platform Architecture Complete - Ready for Algorithm Expansion_ ✅
