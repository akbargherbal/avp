## Execution Plan

---
**IMPORTANT NOTES**:
Since I cannot share the entire codebase all at once, I rely on you to explicitly ask for the specific files you need to make an informed decision; do not make guesses or assumptions.

Provide `cat` commands that I can copy and paste into my terminal to share file contents with you. For example:
`cat absolute/path/to/file`

For large JSON files, use `jq` with appropriate flags to specify the data you want me to provide.

Use `pnpm` instead of `npm`, unless there is a specific need to use `npm`.

---


### Stage 1: Backend Implementation (BE) - 30 min

**Task:** Add algorithm info endpoint and populate metadata

**Changes Required:**

#### 1.1: Create Info Markdown Files (15 min)

Create `/home/akbar/Jupyter_Notebooks/interval-viz-poc/docs/algorithm-info/` directory structure:

```bash
mkdir -p /home/akbar/Jupyter_Notebooks/interval-viz-poc/docs/algorithm-info
```

**File:** `/home/akbar/Jupyter_Notebooks/interval-viz-poc/docs/algorithm-info/binary-search.md`

```markdown
# Binary Search

## Overview

Binary Search is an efficient algorithm for finding a target value within a **sorted array**. It works by repeatedly dividing the search interval in half, eliminating half of the remaining elements in each step.

## How It Works

1. Start with the entire sorted array
2. Compare the target with the middle element
3. If target equals middle: **Found!**
4. If target < middle: Search the **left half**
5. If target > middle: Search the **right half**
6. Repeat until target is found or search space is empty

## Time Complexity

- **Best Case:** O(1) - Target is the middle element
- **Average Case:** O(log n) - Halves search space each step
- **Worst Case:** O(log n) - Target at end or not present

## Space Complexity

- **Iterative:** O(1) - Only stores pointers
- **Recursive:** O(log n) - Call stack depth

## Real-World Applications

- **Databases:** Index lookups for fast queries
- **File Systems:** Locating files in sorted directories
- **Search Engines:** Ranking and retrieval systems
- **Game Development:** Collision detection in sorted objects
- **Libraries:** Dictionary lookups, phone books

## Key Variables

- **L (Left):** Starting boundary of current search range
- **R (Right):** Ending boundary of current search range
- **M (Mid):** Central element being compared to target
- **Target:** The specific value being searched for

## Prerequisites

⚠️ **Critical Requirement:** The input array **must be sorted** in ascending order. Binary Search does not work on unsorted data.

## Fun Fact

Binary Search is so efficient that searching a sorted array of 1 billion elements takes only ~30 comparisons! That's the power of O(log n).
```

**File:** `/home/akbar/Jupyter_Notebooks/interval-viz-poc/docs/algorithm-info/interval-coverage.md`

```markdown
# Interval Coverage

## Overview

Interval Coverage solves the problem of finding the **minimum set of intervals** needed to cover a target range. It uses a greedy algorithm with recursive call tracking to efficiently select intervals that maximize coverage extension.

## How It Works

1. Sort intervals by start time
2. Track maximum coverage achieved so far (`max_end`)
3. For each position, find interval that extends coverage the most
4. Keep intervals that advance coverage, discard redundant ones
5. Recurse until target range is fully covered

## Time Complexity

- **Sorting:** O(n log n)
- **Greedy Selection:** O(n)
- **Overall:** O(n log n)

## Space Complexity

- **Call Stack:** O(n) worst case (deep recursion)
- **Interval Storage:** O(n)

## Real-World Applications

- **Network Coverage:** Cell tower placement optimization
- **Scheduling:** Minimizing staff shifts for continuous coverage
- **Video Streaming:** Selecting video segments for seamless playback
- **Resource Allocation:** Minimizing time slots for task coverage
- **Military Operations:** Radar/sensor coverage planning

## Key Variables

- **max_end:** Maximum coverage achieved so far
- **target_end:** Goal coverage point (e.g., 1000)
- **kept_intervals:** Intervals selected for coverage
- **examining_interval:** Current candidate being evaluated

## Algorithm Insight

The greedy strategy works because:

1. Intervals are sorted by start time
2. At each step, choosing the interval that extends coverage the most is provably optimal
3. No backtracking needed - local optimum = global optimum

## Challenge

Try to predict: Will the algorithm keep an interval or discard it as redundant? Look for intervals that don't extend `max_end` beyond what's already covered!
```

#### 1.2: Add Info Retrieval to Registry (10 min)

**File:** `/home/akbar/Jupyter_Notebooks/interval-viz-poc/backend/algorithms/registry.py`

```python
# Add to imports
import os
from pathlib import Path

class AlgorithmRegistry:
    # ... existing code ...

    def get_info(self, algorithm_name: str) -> str:
        """
        Retrieve algorithm information markdown.

        Args:
            algorithm_name: Algorithm identifier (e.g., 'binary-search')

        Returns:
            str: Markdown content

        Raises:
            ValueError: If algorithm not registered or info file missing
        """
        if algorithm_name not in self._algorithms:
            raise ValueError(
                f"Unknown algorithm: '{algorithm_name}'. "
                f"Available: {list(self._algorithms.keys())}"
            )

        # Construct path to info file
        base_dir = Path(__file__).parent.parent.parent  # interval-viz-poc/
        info_path = base_dir / "docs" / "algorithm-info" / f"{algorithm_name}.md"

        if not info_path.exists():
            raise ValueError(
                f"Algorithm info file not found: {info_path}. "
                f"Create docs/algorithm-info/{algorithm_name}.md"
            )

        return info_path.read_text(encoding='utf-8')
```

#### 1.3: Add API Endpoint (5 min)

**File:** `/home/akbar/Jupyter_Notebooks/interval-viz-poc/backend/app.py`

Add endpoint after `/api/algorithms`:

```python
@app.route('/api/algorithms/<algorithm_name>/info', methods=['GET'])
def get_algorithm_info(algorithm_name):
    """
    Get detailed algorithm information (markdown).

    Returns:
        200: { "algorithm": "binary-search", "info": "# Binary Search\n..." }
        404: { "error": "...", "available_algorithms": [...] }
    """
    try:
        info_markdown = registry.get_info(algorithm_name)
        return jsonify({
            'algorithm': algorithm_name,
            'info': info_markdown
        })
    except ValueError as e:
        return jsonify({
            'error': str(e),
            'available_algorithms': list(registry.list_algorithms().keys())
        }), 404
```

**Testing:**

```bash
# Test binary-search info
curl http://localhost:5000/api/algorithms/binary-search/info | jq

# Test interval-coverage info
curl http://localhost:5000/api/algorithms/interval-coverage/info | jq

# Test unknown algorithm
curl http://localhost:5000/api/algorithms/unknown/info | jq
```

**Reference:** `docs/compliance/BACKEND_CHECKLIST.md` (add info endpoint validation)

**Time Estimate:** 30 min

---

### Stage 2: QA Backend Review (10 min)

**Task:** Verify backend implementation

**Validation:**

- [✓] Info markdown files exist for both algorithms
- [✓] `GET /api/algorithms/{algorithm}/info` returns markdown
- [✓] 404 error for unknown algorithms
- [✓] Markdown is valid (no syntax errors)
- [✓] Content is educational (not just API docs)
- [✓] Backend checklist updated

**Time Estimate:** 10 min

---

### Stage 3: Frontend Implementation (FE) - 45 min

**Task:** Create Algorithm Info Modal with markdown rendering

#### 3.1: Install Markdown Renderer (5 min)

```bash
cd /home/akbar/Jupyter_Notebooks/interval-viz-poc/frontend
pnpm add react-markdown remark-gfm
```

**Why react-markdown:**

- Secure (sanitizes by default, no `dangerouslySetInnerHTML`)
- Supports GitHub Flavored Markdown (tables, strikethrough)
- Small bundle size (~15KB gzipped)
- Well-maintained, 13M+ weekly downloads

#### 3.2: Create AlgorithmInfoModal Component (25 min)

**File:** `/home/akbar/Jupyter_Notebooks/interval-viz-poc/frontend/src/components/AlgorithmInfoModal.jsx`

```jsx
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Algorithm Information Modal
 *
 * LOCKED REQUIREMENTS:
 * - Modal ID: #algorithm-info-modal (for testing)
 * - Width: 600px (matches prediction/completion modals)
 * - Max height: 85vh (scrollable content)
 * - Escape key closes modal
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility
 * @param {Function} props.onClose - Close handler
 * @param {string} props.algorithmName - Current algorithm (e.g., 'binary-search')
 */
const AlgorithmInfoModal = ({ isOpen, onClose, algorithmName }) => {
  const [infoContent, setInfoContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch algorithm info when modal opens or algorithm changes
  useEffect(() => {
    if (!isOpen || !algorithmName) return;

    const fetchInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl =
          process.env.REACT_APP_API_URL || "http://localhost:5000/api";
        const response = await fetch(
          `${apiUrl}/algorithms/${algorithmName}/info`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch algorithm info: ${response.status}`);
        }

        const data = await response.json();
        setInfoContent(data.info);
      } catch (err) {
        console.error("Error fetching algorithm info:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [isOpen, algorithmName]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="algorithm-info-modal"
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-xl border border-slate-700 p-6 max-h-[85vh] flex flex-col animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {/* Info Icon */}
            <svg
              className="w-6 h-6 text-blue-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="8" />
            </svg>
            Algorithm Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 text-red-300">
              <strong>Error:</strong> {error}
            </div>
          )}

          {!loading && !error && infoContent && (
            <div className="prose prose-invert prose-slate max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom styles for markdown elements
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-2xl font-bold text-white mb-4"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-xl font-semibold text-white mt-6 mb-3"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-lg font-semibold text-white mt-4 mb-2"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="text-slate-300 mb-3 leading-relaxed"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-inside ml-4 space-y-1 text-slate-300 mb-3"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-inside ml-4 space-y-1 text-slate-300 mb-3"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-slate-300" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="text-white font-semibold" {...props} />
                  ),
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code
                        className="bg-slate-700 px-1.5 py-0.5 rounded text-sm font-mono text-blue-300"
                        {...props}
                      />
                    ) : (
                      <code
                        className="block bg-slate-900 p-3 rounded-lg text-sm font-mono text-slate-300 overflow-x-auto"
                        {...props}
                      />
                    ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-blue-500 pl-4 italic text-slate-400 my-4"
                      {...props}
                    />
                  ),
                }}
              >
                {infoContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-700 flex justify-end items-center flex-shrink-0">
          <span className="text-xs text-slate-500 mr-4">
            Press <kbd className="kbd">Esc</kbd> to close
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmInfoModal;
```

#### 3.3: Add Info Trigger to Visualization Header (10 min)

**File:** `/home/akbar/Jupyter_Notebooks/interval-viz-poc/frontend/src/App.jsx`

Add state and modal:

```jsx
// Add to imports
import AlgorithmInfoModal from './components/AlgorithmInfoModal';

// Inside App component, add state
const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(false);

// In visualization panel header, replace target display with info trigger:
<div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
  <h2 className="text-lg font-semibold text-white">
    {/* Title based on visualization type */}
    {trace?.metadata?.visualization_type === 'array' && 'Array Visualization'}
    {trace?.metadata?.visualization_type === 'timeline' && 'Timeline Visualization'}
  </h2>

  {/* Algorithm Info Trigger - REPLACES target display */}
  <button
    id="algorithm-info-trigger"
    onClick={() => setShowAlgorithmInfo(true)}
    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors group"
    title="Algorithm Details"
    aria-label="Show algorithm information"
  >
    {/* Info Icon */}
    <svg
      className="w-5 h-5 text-blue-400 group-hover:text-blue-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="8" />
    </svg>
  </button>
</div>

// At end of App component, before closing </div>:
<AlgorithmInfoModal
  isOpen={showAlgorithmInfo}
  onClose={() => setShowAlgorithmInfo(false)}
  algorithmName={currentAlgorithm}
/>
```

#### 3.4: Add kbd Styling to index.css (5 min)

**File:** `/home/akbar/Jupyter_Notebooks/interval-viz-poc/frontend/src/index.css`

Add if not already present:

```css
/* Keyboard key styling (matches mockup) */
.kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 1.75rem;
  padding: 0 0.5rem;
  background-color: #334155; /* slate-700 */
  border: 1px solid #475569; /* slate-600 */
  border-radius: 0.375rem;
  font-family: monospace;
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0; /* slate-200 */
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
}
```

**Reference:** `docs/compliance/FRONTEND_CHECKLIST.md`

**Time Estimate:** 45 min

---

### Stage 4: Integration Testing (QA) - 20 min

**Task:** Validate complete feature

**Test Cases:**

#### Test 1: Modal Trigger

- [ ] Info button visible in visualization header
- [ ] Button has `id="algorithm-info-trigger"`
- [ ] Hover shows tooltip "Algorithm Details"
- [ ] Click opens modal

#### Test 2: Modal Appearance (LOCKED Requirements)

- [ ] Modal has `id="algorithm-info-modal"`
- [ ] Width: 600px (matches other modals)
- [ ] Max height: 85vh
- [ ] Backdrop darkens screen
- [ ] Click outside closes modal
- [ ] Escape key closes modal

#### Test 3: Content Rendering

- [ ] Binary Search: Shows overview, complexity, applications
- [ ] Interval Coverage: Shows overview, complexity, applications
- [ ] Markdown renders correctly (headers, lists, bold, code)
- [ ] Content is scrollable if exceeds max-height
- [ ] Loading spinner appears during fetch

#### Test 4: Error Handling

- [ ] Unknown algorithm shows error message
- [ ] Network error shows error message
- [ ] Error message is user-friendly

#### Test 5: Keyboard Shortcuts

- [ ] Escape closes modal
- [ ] Modal doesn't interfere with step navigation shortcuts

#### Test 6: Responsiveness

- [ ] Modal readable on tablet (768px)
- [ ] Modal readable on mobile (375px)
- [ ] Content doesn't overflow horizontally

#### Test 7: Accessibility

- [ ] Modal has proper ARIA labels
- [ ] Close button has aria-label="Close modal"
- [ ] Focus trapped in modal when open
- [ ] Screen reader announces modal open/close

#### Test 8: Regression Tests

- [ ] Binary Search algorithm still works
- [ ] Interval Coverage algorithm still works
- [ ] Prediction modal still works
- [ ] Completion modal still works
- [ ] Help modal still works
- [ ] All existing keyboard shortcuts work

**Reference:** `docs/compliance/QA_INTEGRATION_CHECKLIST.md`

**Time Estimate:** 20 min

---

## Total Time Investment

| Stage                   | Time         |
| ----------------------- | ------------ |
| Backend Implementation  | 30 min       |
| QA Backend Review       | 10 min       |
| Frontend Implementation | 45 min       |
| Integration Testing     | 20 min       |
| **TOTAL**               | **~2 hours** |

---

## Critical Decisions

### ✅ APPROVED: Separate Endpoint Pattern

**Decision:** Use `GET /api/algorithms/{algorithm}/info` instead of embedding in trace

**Rationale:**

1. Info is static per algorithm, trace is dynamic per execution
2. Frontend can cache info, reducing API calls
3. Cleaner separation of concerns
4. Follows REST principles

### ✅ APPROVED: Markdown Storage Location

**Location:** `/docs/algorithm-info/{algorithm-name}.md`

**Rationale:**

1. Co-located with other documentation
2. Version-controlled with code
3. Easy to edit (plain markdown)
4. Follows existing pattern (`/docs/narratives/`)

### ✅ APPROVED: Modal Styling

**Style:** Matches PredictionModal/CompletionModal (600px, 85vh, same colors)

**Rationale:**

1. Visual consistency across platform
2. Proven dimensions (fits content well)
3. LOCKED requirement compliance

---

## Rollback Strategy

If feature causes issues:

1. **Backend Rollback:**

   ```bash
   # Remove endpoint from app.py
   # Delete docs/algorithm-info/ directory
   # Remove get_info() from registry.py
   ```

2. **Frontend Rollback:**

   ```bash
   cd frontend
   pnpm remove react-markdown remark-gfm
   # Remove AlgorithmInfoModal.jsx
   # Remove modal trigger from App.jsx
   # Restore original visualization header
   ```

3. **Validation:** Run full test suite, verify no regressions

---

## Next Steps

**After implementation:**

1. Update `docs/compliance/FRONTEND_CHECKLIST.md`:

   - Add modal ID requirement: `#algorithm-info-modal`
   - Add trigger ID requirement: `#algorithm-info-trigger`

2. Update `docs/compliance/BACKEND_CHECKLIST.md`:

   - Add requirement: Info markdown file exists
   - Add requirement: `/api/algorithms/{algorithm}/info` endpoint tested

3. Document pattern in `README.md`:

   - Add section: "Algorithm Information Modal"
   - Explain markdown file requirements
   - Show example info structure

4. **Future algorithms:** Must provide `docs/algorithm-info/{algorithm-name}.md` file

---

## Open Questions for Stakeholder Decision

**Q1: Should algorithm info include pseudocode?**

- PRO: More educational, helps understanding
- CON: Harder to maintain, may duplicate narrative content
- **Recommendation:** Start without, add if requested.

**Q2: Should info link to external resources (Wikipedia, etc.)?**

- PRO: Deep learning opportunities
- CON: Link rot, navigation away from platform
- **Recommendation:** Yes, but mark as external links

**Q3: Should there be a "What's New" section for algorithm updates?**

- PRO: Keeps users informed of improvements
- CON: More maintenance overhead
- **Recommendation:** Not in MVP, consider for v2

---
