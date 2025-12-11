# QA & Integration Compliance Checklist

**Version:** 1.0  
**Authority:** TENANT_GUIDE.md v1.0 - All Sections  
**Purpose:** End-to-end validation that new algorithms integrate correctly

---

## Pre-Integration Checklist

### Backend Validation

- [ ] **Backend checklist completed** - Backend developer signed off
- [ ] **Unit tests pass** - All algorithm tracer tests green
- [ ] **Trace structure valid** - JSON follows contract

### Frontend Validation

- [ ] **Frontend checklist completed** - Frontend developer signed off
- [ ] **Component tests pass** - All visualization tests green
- [ ] **No console errors** - Clean browser console

---

## ðŸ"' Integration Tests: LOCKED Requirements

### Test Suite 1: Modal Standards (Section 1.1)

#### Prediction Modal

**Test Case: Modal Size Constraints**

```
GIVEN: Algorithm with prediction points
WHEN: Prediction modal opens
THEN:
  ✅ Modal max-width is max-w-lg (512px)
  ✅ Modal max-height is max-h-[85vh]
  ✅ No internal scrollbars visible
  ✅ All content fits in viewport
```

**Test Case: Modal Positioning**

```
GIVEN: Prediction modal open
THEN:
  ✅ Modal is centered (flex items-center justify-center)
  ✅ Background is semi-transparent with blur
  ✅ z-index is 50 (above main content)
  ✅ Padding prevents edge collision (p-4)
```

#### Completion Modal

**Test Case: Modal Size for Complex Results**

```
GIVEN: Algorithm completes with many results
WHEN: Completion modal opens
THEN:
  ✅ Modal max-width is max-w-2xl (672px)
  ✅ Modal max-height is max-h-[85vh]
  ✅ No internal scrolling (uses flex-wrap or grid)
  ✅ All stats visible without scroll
```

---

### Test Suite 2: Panel Layout (Section 1.2)

**Test Case: Flex Ratio Verification**

```
GIVEN: Algorithm loaded
THEN:
  ✅ Visualization panel has flex-[3] (66.67% width)
  ✅ Steps panel has w-96 (384px) OR flex-[1.5]
  ✅ Gap between panels is gap-4 (1rem)
  ✅ Ratio maintained at 1920px, 1366px, 1024px viewports
```

**Test Case: Minimum Width Enforcement**

```
GIVEN: Viewport narrowed to 1024px
THEN:
  ✅ Steps panel never smaller than 384px
  ✅ Visualization panel shrinks to accommodate
  ✅ No horizontal scrollbar on body
  ✅ Content remains readable
```

**Test Case: Overflow Behavior**

```
GIVEN: Trace with 20+ steps
WHEN: Steps exceed viewport height
THEN:
  ✅ Steps panel scrolls independently (overflow-y-auto)
  ✅ Visualization panel scrolls independently (overflow-auto)
  ✅ Scrollbars appear only where needed
  ✅ No nested scrolling issues
```

---

### Test Suite 3: HTML Landmark IDs (Section 1.3)

**Test Case: Required IDs Present**

```
GIVEN: Algorithm loaded
THEN:
  ✅ document.getElementById('app-root') !== null
  ✅ document.getElementById('app-header') !== null
  ✅ document.getElementById('panel-visualization') !== null
  ✅ document.getElementById('panel-steps') !== null
  ✅ document.getElementById('panel-steps-list') !== null
  ✅ document.getElementById('panel-step-description') !== null
```

**Test Case: Dynamic ID Behavior**

```
GIVEN: Algorithm trace with 10 steps
WHEN: Navigate to step 5
THEN:
  ✅ Only ONE element has id="step-current"
  ✅ Element corresponds to current execution context
  ✅ ID updates on step navigation
```

---

### Test Suite 4: Keyboard Navigation (Section 1.4)

**Test Case: Standard Shortcuts**

```
GIVEN: Algorithm loaded, no modal open
WHEN: Press Arrow Right (â†')
THEN: ✅ Advances to next step

WHEN: Press Arrow Left (â†)
THEN: ✅ Goes to previous step

WHEN: Press Space
THEN: ✅ Toggles Watch/Predict mode

WHEN: Press R
THEN: ✅ Resets trace to step 0
```

**Test Case: Modal Shortcuts**

```
GIVEN: Prediction modal open
WHEN: Press F (or semantic letter)
THEN: ✅ Selects corresponding choice

WHEN: Press Enter
THEN: ✅ Submits selected answer

WHEN: Press S
THEN: ✅ Skips prediction
```

**Test Case: Shortcut Conflicts**

```
GIVEN: Input field focused
WHEN: Press Arrow Right
THEN: ✅ Does NOT navigate (ignores shortcut)

GIVEN: Modal open
WHEN: Press Arrow Right
THEN: ✅ Modal handles it, doesn't navigate main app
```

---

### Test Suite 5: Auto-Scroll (Section 1.5)

**Test Case: Scroll to Current Step**

```
GIVEN: Trace with 15+ steps (exceeds viewport)
WHEN: Navigate to step 10
THEN:
  ✅ Element with #step-current scrolls into view
  ✅ Scroll is smooth (behavior: 'smooth')
  ✅ Element centered in viewport (block: 'center')
  ✅ No jarring jumps
```

**Test Case: Scroll Triggers**

```
GIVEN: Step 1 visible, step 10 off-screen
WHEN: Click Next button repeatedly
THEN: ✅ Auto-scrolls to keep current step visible

WHEN: User manually scrolls
THEN: ⌠Does NOT auto-scroll (respects user intent)

WHEN: Switch algorithms
THEN: ⌠Does NOT auto-scroll (resets to top)
```

---

### Test Suite 6: Overflow Pattern (Section 1.6)

**Test Case: Wide Array Visualization**

```
GIVEN: Binary Search with 20-element array
WHEN: Viewport width is 1024px
THEN:
  ✅ Left edge of array is scrollable
  ✅ Right edge of array is scrollable
  ✅ No content cut off on left
  ✅ Horizontal scrollbar appears
```

**Test Case: Correct Pattern Applied**

```
GIVEN: ArrayView component
THEN:
  ✅ Outer container has items-start (NOT items-center)
  ✅ Outer container has overflow-auto
  ✅ Inner wrapper has mx-auto
  ✅ Elements have flex-shrink-0
```

**Anti-Pattern Test:**

```
GIVEN: Wide content
WHEN: Using items-center + overflow-auto
THEN: ⌠FAIL - Left content inaccessible (this is the bug!)
```

---

## 🎨 Integration Tests: CONSTRAINED Requirements

### Test Suite 7: Backend Contract (Section 2.1)

**Test Case: Metadata Structure**

```
GIVEN: Algorithm trace loaded
THEN:
  ✅ trace.metadata.algorithm === string
  ✅ trace.metadata.display_name === string
  ✅ trace.metadata.visualization_type in ['array', 'timeline', 'graph', 'tree']
  ✅ trace.metadata.input_size === number
```

**Test Case: Trace Structure**

```
GIVEN: Trace with N steps
THEN:
  ✅ trace.trace.steps.length === N
  ✅ Each step has .step, .type, .description, .data
  ✅ Each step.data has .visualization
  ✅ Visualization data matches visualization_type
```

---

### Test Suite 8: Visualization Components (Section 2.2)

**Test Case: Component Props**

```
GIVEN: Visualization component
THEN:
  ✅ Accepts step prop
  ✅ Accepts config prop
  ✅ Handles missing step.data.visualization gracefully
  ✅ Shows fallback message on null data
```

**Test Case: State-Based Styling**

```
GIVEN: Binary Search examining mid element
THEN:
  ✅ Mid element has distinct visual state (e.g., yellow, pulsing)
  ✅ Active range elements have different state (e.g., blue)
  ✅ Excluded elements have different state (e.g., gray, dimmed)
```

---

### Test Suite 9: Prediction Mode (Section 2.3)

**Test Case: Choice Limit**

```
GIVEN: Algorithm with prediction points
THEN:
  ✅ Every prediction has ≤3 choices
  ⌠FAIL if any prediction has 4+ choices
```

**Test Case: Shortcut Derivation**

```
GIVEN: Choices ["Found!", "Search Left", "Search Right"]
THEN:
  ✅ Shortcuts are F, L, R (semantic)
  ✅ Fallback numbers 1, 2, 3 also work
```

**Test Case: Two-Step Confirmation**

```
GIVEN: Prediction modal open
WHEN: Select choice (press F)
THEN:
  ✅ Choice button highlights (scale-105, ring-2)
  ✅ Other choices dim (opacity-60)
  ✅ Submit button activates (removes opacity-50)

WHEN: Press Enter
THEN:
  ✅ Submits answer
  ✅ Shows feedback (correct/incorrect)
  ✅ Auto-advances after 2.5s
```

---

### Test Suite 10: Completion Modal (Section 2.4)

**Test Case: Last-Step Detection**

```
GIVEN: Trace with 8 steps
WHEN: Navigate to step 7 (last step, 0-indexed)
THEN:
  ✅ Completion modal appears
  ✅ Uses last-step check (NOT step.type check)
```

**Test Case: Algorithm-Specific Results**

```
GIVEN: Binary Search trace (found=true)
THEN:
  ✅ Shows "Target Found!" message
  ✅ Shows comparisons count
  ✅ Shows found index
  ✅ Border is emerald (success color)

GIVEN: Binary Search trace (found=false)
THEN:
  ✅ Shows "Target Not Found" message
  ✅ Border is red (failure color)
```

**Test Case: Prediction Accuracy**

```
GIVEN: Completed trace with predictions
THEN:
  ✅ Shows accuracy percentage
  ✅ Shows correct/total (e.g., 19/20)
  ✅ Shows feedback message based on accuracy

GIVEN: Completed trace WITHOUT predictions
THEN:
  ✅ Accuracy section hidden
  ✅ No prediction stats displayed
```

---

## Cross-Algorithm Tests

### Test Suite 11: Algorithm Switching

**Test Case: Switch Between Algorithms**

```
GIVEN: Interval Coverage loaded and running
WHEN: Select Binary Search from dropdown
THEN:
  ✅ Trace resets to step 0
  ✅ Visualization changes to ArrayView
  ✅ No console errors
  ✅ No visual glitches
  ✅ Prediction stats reset
```

**Test Case: State Isolation**

```
GIVEN: Interval Coverage at step 5
WHEN: Switch to Binary Search
THEN:
  ✅ Binary Search starts at step 0 (not step 5)
  ✅ No data leakage between algorithms
  ✅ Each algorithm has independent state
```

---

### Test Suite 12: Responsive Behavior

**Test Case: Viewport Sizes**

```
Test at: 1920px, 1366px, 1024px, 768px

At each size:
  ✅ Panel ratio maintained (3:1.5)
  ✅ Steps panel never < 384px
  ✅ Modals fit in viewport (max-h-[85vh])
  ✅ No horizontal body scrollbar
  ✅ All content accessible
```

---

## Performance Tests

### Test Suite 13: Large Traces

**Test Case: 50+ Steps**

```
GIVEN: Algorithm with 50 steps
WHEN: Navigate through entire trace
THEN:
  ✅ No lag or stuttering
  ✅ Auto-scroll remains smooth
  ✅ Memory usage stable
  ✅ No memory leaks
```

**Test Case: Wide Arrays**

```
GIVEN: Binary Search with 100-element array
THEN:
  ✅ Renders without lag
  ✅ Scrolling is smooth
  ✅ All elements accessible
```

---

## Regression Tests

### Test Suite 14: Existing Algorithms

**Test Case: Interval Coverage Still Works**

```
GIVEN: Interval Coverage algorithm
THEN:
  ✅ Timeline renders correctly
  ✅ Call stack shows recursion
  ✅ Prediction mode works
  ✅ Completion modal appears
  ✅ Auto-scroll functions
  ✅ All features from PoC intact
```

**Test Case: No New Bugs**

```
GIVEN: All algorithms loaded
THEN:
  ✅ No console errors
  ✅ No visual regressions
  ✅ No broken interactions
  ✅ Performance unchanged
```

---

## Acceptance Criteria

### PASS ✅

**All of the following must be true:**

- ✅ All LOCKED requirement tests pass (Suites 1-6)
- ✅ All CONSTRAINED requirement tests pass (Suites 7-10)
- ✅ Cross-algorithm tests pass (Suite 11)
- ✅ Responsive tests pass (Suite 12)
- ✅ No regressions (Suite 14)

### MINOR ISSUES âš ï¸

**One or more of the following:**

- âš ï¸ Performance test warnings (Suite 13) but not failures
- âš ï¸ Minor visual inconsistencies (but no LOCKED violations)
- âš ï¸ Documentation updates needed

### FAIL âŒ

**Any of the following:**

- ⌠Any LOCKED requirement test fails
- ⌠Overflow pattern violated (left edge cut off)
- ⌠>3 prediction choices found
- ⌠Required IDs missing
- ⌠Keyboard shortcuts broken
- ⌠Existing algorithm regressed

---

## Test Execution Template

```markdown
# Test Run: [Algorithm Name] - [Date]

## Test Environment

- Browser: Chrome 120, Firefox 121, Safari 17
- Viewport: 1920x1080, 1366x768, 1024x768
- OS: Windows 11, macOS 14, Ubuntu 22.04

## Suite 1: Modal Standards

- [ ] Prediction modal size: PASS/FAIL
- [ ] Completion modal size: PASS/FAIL
- [ ] No internal scrolling: PASS/FAIL

## Suite 2: Panel Layout

- [ ] Flex ratio 3:1.5: PASS/FAIL
- [ ] Min width 384px: PASS/FAIL
- [ ] Overflow behavior: PASS/FAIL

[... continue for all suites ...]

## Overall Result: PASS/FAIL

## Notes:

- [Any observations or issues]

## Sign-off:

- QA Engineer: [Name], [Date]
```

---

## Quick Checklist for New Algorithms

Before submitting for QA review, verify:

- [ ] ✅ Backend checklist completed (backend team)
- [ ] ✅ Frontend checklist completed (frontend team)
- [ ] ✅ Manual smoke test passed (developer)
- [ ] ✅ No console errors
- [ ] ✅ Mockups referenced for visual accuracy
- [ ] ✅ All unit tests passing
- [ ] ✅ Documentation updated

---

**Remember:** The goal is NOT to catch developers making mistakes. The goal is to ensure the Tenant Guide standards are consistently applied, preventing architectural drift. Use this checklist as a conversation starter, not a gotcha list.
