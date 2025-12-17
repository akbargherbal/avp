# Frontend Checklist: UI/UX Compliance

**Version:** 3.0  
**Authority:** WORKFLOW.md v2.1 - Frontend Requirements  
**Visual Authority:** Static mockups (`docs/static_mockup/*.html`) - Single source of truth  
**Purpose:** Verify UI components comply with platform standards

---

## CRITICAL: Visual Standards Authority

**When text differs from mockups, mockups win.**

All visual decisions must reference static mockups:

- `algorithm_page_mockup.html` - Panel layout, keyboard shortcuts, IDs
- `prediction_modal_mockup.html` - Prediction modal standards  
- `completion_modal_mockup.html` - Completion modal standards (Compact Redesign)

**Implementer Responsibility:** Check relevant mockups before implementing or modifying any UI component.

---

## Pre-Integration Validation

**Before starting frontend work:**

- [ ] **QA narrative review PASSED** - Narratives approved for logical completeness
- [ ] **FAA audit completed** - Arithmetic correctness verified  
- [ ] **Backend JSON contract validated** - Narrative confirmed data completeness
- [ ] **FAA-approved narratives available** - Located in `docs/narratives/[algorithm-name]/`
- [ ] **Trust the JSON** - Frontend focuses on "how to render" not "what to render"

---

## SECTION 1: LOCKED REQUIREMENTS (Zero Freedom)

### 1.1 Modal Visual Compliance

**Source:** `completion_modal_mockup.html` and `prediction_modal_mockup.html`

- [ ] **Modal dimensions match mockups** - Width, padding, spacing exactly as shown
- [ ] **Positioning matches mockups** - Fixed overlay, centering, z-index
- [ ] **Typography matches mockups** - Font sizes, weights, colors exactly as shown  
- [ ] **Layout patterns match mockups** - Horizontal vs vertical layouts as shown
- [ ] **Theme colors match mockups** - Success/failure/neutral color schemes
- [ ] **Spacing matches mockups** - Margins, padding, gaps exactly as shown
- [ ] **Content fitting strategy matches mockups** - No scrolling, flex-wrap usage

**Verification:** Side-by-side comparison with static mockups must pass visual inspection.

### 1.2 Panel Layout Architecture

**Source:** `algorithm_page_mockup.html`

- [ ] **Panel proportions match mockup** - 3:1.5 ratio visualization:steps
- [ ] **Required HTML IDs present** - All 6 IDs as shown in mockup
- [ ] **Keyboard shortcuts work as shown** - Arrow keys, Space, R, Home, Enter, S  
- [ ] **Auto-scroll behavior matches** - `#step-current` scrolls into view
- [ ] **Overflow pattern matches mockup** - `items-start` + `mx-auto` pattern (NOT `items-center`)

**Verification:** Measure panel widths, test keyboard shortcuts, verify DOM IDs match mockup structure.

### 1.3 Modal IDs (LOCKED)

**Critical for automated testing:**

- [ ] **Prediction modal:** `id="prediction-modal"`
- [ ] **Completion modal:** `id="completion-modal"`

---

## SECTION 2: CONSTRAINED REQUIREMENTS (Limited Flexibility)

### 2.1 Component Architecture

**Registry-Based Pattern (REQUIRED):**

- [ ] **State component created** - In `algorithm-states/` directory
- [ ] **State component registered** - Added to `stateRegistry.js` 
- [ ] **Naming convention followed** - `{Algorithm}State.jsx` format
- [ ] **Component interface correct** - Accepts `step` prop
- [ ] **No hardcoded routing** - App.jsx uses registry pattern

### 2.2 Prediction Questions

**Hard Constraints:**

- [ ] **Maximum 3 choices** - Strictly enforced limit
- [ ] **Grid layout appropriate** - 2-col for 2 choices, 3-col for 3 choices
- [ ] **Button states implemented** - Default, hover, selected, unselected

### 2.3 Completion Modal Logic

**Detection Strategy:**

- [ ] **Last-step detection used** - Check `step === trace.trace.steps.length - 1`
- [ ] **Algorithm-specific rendering** - Based on `trace?.metadata?.algorithm`
- [ ] **Generic fallback provided** - For unknown algorithms
- [ ] **Prediction accuracy calculated** - If `predictionStats.total > 0`

---

## SECTION 3: FREE ZONES (Your Creative Freedom)

### Implementation Choices

- [ ] **Component architecture** - File organization, patterns (your choice)
- [ ] **State management** - Built-in React state or external libraries  
- [ ] **Performance optimizations** - Memoization, virtualization (as needed)
- [ ] **Custom styling** - Within mockup constraints, visual enhancements welcome

---

## Testing Verification

### LOCKED Requirements Test

- [ ] **Modal visual comparison** - Side-by-side with mockups passes
- [ ] **Panel layout measurement** - Width ratio 3:1.5 verified  
- [ ] **DOM ID inspection** - All 6 required IDs present
- [ ] **Keyboard shortcut testing** - All keys work as specified
- [ ] **Overflow pattern verification** - No left-edge cutoff on wide content
- [ ] **Auto-scroll behavior** - Current step scrolls into view

### CONSTRAINED Requirements Test

- [ ] **Component registration** - Registry lookup succeeds
- [ ] **Component location** - Correct directory placement  
- [ ] **Prediction limit** - ≤3 choices enforced
- [ ] **Completion detection** - Last-step logic works
- [ ] **No hardcoded routing** - App.jsx uses registry

### Integration Test

- [ ] **No regressions** - Existing algorithms still work
- [ ] **Algorithm switching** - State components update correctly
- [ ] **Visual consistency** - Matches established patterns
- [ ] **User experience quality** - Clear, intuitive, responsive

---

## Quick Reference: Required DOM Structure

```jsx
<div id="app-root">
  <div id="app-header">/* Controls */</div>  
  <div className="flex gap-4">
    <div id="panel-visualization" className="flex-[3]">/* Viz */</div>
    <div id="panel-steps" className="w-96">
      <div id="panel-steps-list" className="overflow-y-auto">
        <div id="step-current">/* Active step - auto-scroll target */</div>
      </div>
      <div id="panel-step-description">/* Current action */</div>
    </div>
  </div>
</div>

<!-- Modal IDs (when active) -->  
<div id="prediction-modal">/* Prediction UI */</div>
<div id="completion-modal">/* Completion UI */</div>
```

---

## State Registry Pattern

```javascript
// 1. Create: algorithm-states/MyAlgorithmState.jsx
const MyAlgorithmState = ({ step }) => {
  return <div>{/* Algorithm-specific state display */}</div>;
};

// 2. Register: stateRegistry.js  
const STATE_REGISTRY = {
  "my-algorithm": MyAlgorithmState,
};

// 3. Usage: App.jsx (automatic)
const StateComponent = getStateComponent(currentAlgorithm);
return <StateComponent step={step} />;
```

---

## Approval Criteria

✅ **PASS** - All LOCKED requirements met, visual comparison with mockups passes, state component registered  
⚠️ **MINOR** - CONSTRAINED choices questionable but functional  
❌ **FAIL** - LOCKED requirements violated, visual differences from mockups, missing registrations

---

**Implementation Guidelines:**

- **Check mockups first** - Before implementing any UI changes  
- **Trust the JSON** - Backend has validated all data completeness
- **Reference narratives** - For algorithm behavior understanding
- **Follow registry pattern** - No hardcoded component routing
- **Test with mockups** - Side-by-side visual verification required

**For workflow details:** WORKFLOW.md v2.1  
**For architecture decisions:** docs/ADR/ADR-001-registry-based-architecture.md
