# Known Issues - Algorithm Visualization Platform

**Last Updated:** Session 13 (December 11, 2025)  
**Phase:** Post Phase 4 (Prediction Mode Generalization)

---

## Issue #1: Missing Completion Modal for Binary Search

**Severity:** Medium  
**Status:** Documented, not blocking Phase 5  
**Discovered:** Session 13, during Binary Search testing

### Description
Binary Search algorithm does not show a Completion Modal when the trace finishes, unlike Interval Coverage which displays completion statistics.

### Current Behavior
- **Interval Coverage:** Shows Completion Modal with:
  - Total intervals processed
  - Intervals kept/covered
  - Prediction accuracy statistics
  - "Start Over" button
  
- **Binary Search:** Trace ends silently, no completion feedback

### Expected Behavior
Binary Search should show algorithm-appropriate completion statistics:
- Target found/not found
- Number of comparisons made
- Search range narrowing progression
- Prediction accuracy (if predictions were made)

### Root Cause (Suspected)
`CompletionModal.jsx` likely hardcoded for Interval Coverage data structure. The modal probably expects:
```javascript
result: {
  kept_intervals: [...],
  covered_intervals: [...]
}
```

Binary Search returns:
```javascript
result: {
  found: true/false,
  index: number,
  comparisons: number
}
```

### Investigation Tasks (Future Session)
- [ ] Review `CompletionModal.jsx` implementation
- [ ] Check if completion trigger is algorithm-aware
- [ ] Determine if modal should be:
  - Algorithm-agnostic (dynamic rendering based on result structure)
  - Algorithm-specific (registry pattern like visualizations)
  - Hybrid (base template + algorithm-specific sections)

### Proposed Solution Path
**Option A: Dynamic Completion Modal** (Recommended)
```javascript
// Backend provides completion_summary in metadata
metadata: {
  completion_summary: {
    title: "Search Complete",
    primary_stat: { label: "Result", value: "Found at index 2" },
    stats: [
      { label: "Comparisons", value: 3 },
      { label: "Range Narrowed", value: "8 → 1 elements" }
    ]
  }
}
```

**Option B: Registry Pattern** (More work, more flexible)
- Each algorithm registers its own CompletionModal component
- Follows same pattern as visualization registry

### Priority Rationale
- **Not blocking:** Algorithm works correctly, just lacks polish
- **User impact:** Medium - students don't get completion feedback
- **Educational value:** High - completion stats reinforce learning
- **Effort:** Low-Medium (1-2 hours to implement Option A)

**Recommendation:** Address in Phase 5 or dedicated polish session

---

## Issue #2: Simple Binary Search Examples Feel "Scripted"

**Severity:** Low (Content Quality)  
**Status:** Documented, requires content strategy discussion  
**Discovered:** Session 13, during Binary Search testing

### Description
Current Binary Search example (searching for 7 in small array) finds the target on the first comparison, making the prediction feel trivial and "scripted."

### Current Behavior
```javascript
// Example: Search for 7 in [1, 3, 5, 7, 9, 11, 13, 15]
// Mid calculation: (0 + 7) / 2 = 3 → array[3] = 7
// Result: Found immediately!
```

**Student Experience:**
1. Prediction: "Compare 7 with 7, what's next?"
2. Choices: Found (F) / Search Left (L) / Search Right (R)
3. Answer: Obviously "Found" since 7 == 7

### Expected Educational Experience
Students should see the algorithm:
- Make multiple comparisons
- Narrow the search range progressively
- Experience different scenarios (target found, not found, at edges)

### Root Cause
**Backend:** `backend/app.py` provides 6 examples, but frontend defaults to first one:
```python
examples = [
    {"name": "Basic Search - Target Found", "array": [1,3,5,7,9,11,13,15], "target": 7},
    {"name": "Basic Search - Target Not Found", ...},
    {"name": "Large Array", ...},
    # ... more examples
]
```

The "Basic Search - Target Found" example happens to hit the target immediately due to the specific array/target combination.

### Investigation Tasks (Future Session)
- [ ] Review all 6 Binary Search examples - which ones provide better educational value?
- [ ] Add example selection UI to frontend (dropdown? cycle through?)
- [ ] Consider algorithmic example generation:
  - Generate array where target requires 3-4 comparisons
  - Ensure diverse scenarios (found at start/middle/end, not found)
- [ ] Document "good example" criteria for each algorithm type

### Proposed Solutions

**Option A: Better Default Example** (Quick fix, 15 min)
```javascript
// Change frontend default to "Large Array" example
// Or use example that guarantees 3+ comparisons
```

**Option B: Example Selector UI** (Medium effort, 2-3 hours)
```jsx
<select onChange={loadExample}>
  <option>Basic - Target Found (1 step)</option>
  <option>Large Array (4 steps)</option>
  <option>Target Not Found (3 steps)</option>
</select>
```

**Option C: Smart Example Generator** (High effort, Phase 6+)
- Algorithm analyzes input and predicts number of steps
- Filters examples by complexity
- Suggests "beginner" vs "advanced" traces

### Priority Rationale
- **Not blocking:** Current example works, just not ideal pedagogically
- **User impact:** Low-Medium - affects first impression
- **Educational value:** Medium - better examples = better learning
- **Effort:** Low (Option A) to High (Option C)

**Recommendation:** Quick fix in Phase 5 (change default), UI in Phase 6

---

## Issue #3: Prediction Choice Count Philosophy

**Severity:** Low (Design Decision)  
**Status:** Open question, requires product strategy discussion  
**Discovered:** Session 13, during prediction UX review

### Description
User raised important question: **"Where do we stop with prediction choices?"**

Current state:
- **Binary Search:** 3 choices (Found, Search Left, Search Right)
- **Interval Coverage:** 2 choices (Keep, Covered)

### The Tension
**Educational Value vs Quiz Burden:**

**Too Few Choices:**
- Easy to guess (50/50 odds)
- Less engagement
- May not test understanding

**Too Many Choices:**
- Feels like a formal quiz
- Slows down trace exploration
- Discourages prediction participation

### Examples of Choice Count Scenarios

| Algorithm | Scenario | Natural Choices | Count |
|-----------|----------|----------------|-------|
| Binary Search | Compare mid with target | Found / Left / Right | 3 |
| DFS | Which neighbor next? | Could be 1-4 nodes | 1-4 |
| Merge Sort | Which subarray merges? | Left / Right | 2 |
| Dijkstra | Which node next? | Could be 5-10 nodes | 5-10+ |

**The Problem:** Some algorithms naturally have many choices (graph traversal), others have few (binary decisions).

### Design Questions (No answers yet)

1. **Should we cap choice count?**
   - Max 4 choices? Max 5?
   - Or allow algorithm-specific flexibility?

2. **Should prediction complexity match algorithm complexity?**
   - Binary Search (3 choices) = Simple
   - Dijkstra (10+ nodes) = Complex
   - Does this enhance or detract from learning?

3. **Should students be able to disable predictions?**
   - Some students want passive observation
   - Others want active participation
   - Toggle prediction mode on/off?

4. **What makes a "good" prediction question?**
   - Tests understanding of algorithm logic
   - Not trivial (2 + 2 = ?)
   - Not overwhelming (12 choices)
   - Has educational "aha" moment when revealed

### Proposed Discussion Framework (Future Session)

**Guiding Principles to Define:**
- [ ] Maximum choice count (hard limit?)
- [ ] When to skip predictions (if >X choices, show trace only?)
- [ ] Prediction density (every step? every N steps?)
- [ ] Student control (toggle predictions? skip mode?)

**Algorithm-Specific Strategies:**
- **Binary algorithms (2-3 choices):** Always show predictions
- **Multi-way algorithms (4-6 choices):** Show predictions, cap at 5 most likely
- **Complex graphs (7+ choices):** Consider showing trace without predictions OR ask higher-level questions ("Will path be found?" instead of "Which node next?")

### Priority Rationale
- **Not blocking:** Current algorithms (2-3 choices) work well
- **User impact:** Low now, High for future complex algorithms
- **Educational value:** Critical - wrong choice count kills engagement
- **Effort:** Low (define principles), Medium (implement caps/filtering)

**Recommendation:** Define philosophy before Phase 5 (adding more algorithms). Document guidelines for "good prediction questions."

---

## Issue #4: Potential PoC Overfitting Artifacts (General)

**Severity:** Low (Code Quality)  
**Status:** Vigilance required during Phase 5  
**Discovered:** Session 13, user intuition

### Description
User suspects there may be subtle overfitting to Interval Coverage algorithm in various parts of the codebase, given that it was the original PoC algorithm.

### Areas to Monitor During Phase 5

**Frontend Components:**
- [ ] `TimelineView.jsx` - Assumes timeline structure?
- [ ] `CallStackView.jsx` - Hardcoded for recursive algorithms?
- [ ] `useVisualHighlight.js` - Interval-specific highlighting?
- [ ] `stepBadges.js` - Badge types match intervals only?

**Backend Assumptions:**
- [ ] `base_tracer.py` - Any interval-specific methods?
- [ ] Trace step types - Generic enough?
- [ ] Metadata structure - Flexible for graphs/trees?

**UI/UX Patterns:**
- [ ] Layout assumes left panel = timeline?
- [ ] Right panel assumes call stack exists?
- [ ] Keyboard shortcuts assume certain step types?

### Investigation Strategy
**Rather than preemptive refactoring, use Phase 5 as stress test:**

1. **Add DFS or Merge Sort next** (different structure from intervals)
2. **Document friction points** as they arise
3. **Fix only what breaks** (don't speculate)
4. **Keep track of "worked with no changes" vs "needed adjustment"

### Success Criteria
If Phase 5 adds 3 algorithms with:
- <10% code changes to existing components
- No breaking changes to Interval Coverage
- Clear patterns for future algorithms

Then overfitting concerns are minimal.

---

## Non-Issues (Verified Working)

✅ **Smart Shortcut Extraction** - Working perfectly  
✅ **Keyboard Shortcuts** - K/C for intervals, F/L/R for binary search  
✅ **Prediction Modal Rendering** - No console errors  
✅ **Backend JSON Format** - Standardized across algorithms  
✅ **Visual Highlighting** - Works for both array and timeline views  
✅ **Auto-scroll** - `#step-current` behavior intact  
✅ **Algorithm Switching** - No regressions when toggling between algorithms  

---

## Next Session Priorities

### Must Address Before Phase 5
- [ ] **Issue #3:** Define prediction choice count philosophy
  - Document guidelines for "good predictions"
  - Set max choice limit (recommend: 5)
  - Decide on student control (toggle predictions?)

### Should Address During Phase 5
- [ ] **Issue #1:** Implement dynamic Completion Modal
  - Use Option A (backend provides completion_summary)
  - Test with all algorithms
  
- [ ] **Issue #2:** Fix Binary Search default example
  - Quick win: Change to "Large Array" example
  - Adds polish to first-time user experience

### Monitor During Phase 5
- [ ] **Issue #4:** Watch for PoC overfitting
  - Document any friction when adding DFS/Merge Sort
  - Only fix what actually breaks

---

## Commit Message for Phase 4

```
Phase 4 Complete: Smart prediction shortcuts

- Updated interval_coverage.py to standardized {id, label} format
- Implemented deriveShortcut() in PredictionModal.jsx
- Extracts semantic shortcuts: K/C (intervals), F/L/R (binary search)
- Falls back to numbers when conflicts exist
- Restores PoC-quality UX (Press K/C vs Press 1/2)

Known Issues (see KNOWN_ISSUES.md):
- Binary Search missing Completion Modal (Issue #1)
- Simple examples feel scripted (Issue #2)
- Prediction choice count needs philosophy (Issue #3)
- Potential PoC overfitting to monitor (Issue #4)

All issues documented, none blocking Phase 5.
```
