# Frontend UI/UX Compliance Checklist

**Version:** 1.0  
**Authority:** TENANT_GUIDE.md v1.0 - Sections 1 (LOCKED) & 2 (CONSTRAINED)  
**Purpose:** Verify UI components comply with platform standards

---

## SECTION 1: LOCKED REQUIREMENTS (Zero Freedom)

### 1.1 Modal Standards

#### Size Constraints

- [ ] **Max height: `max-h-[85vh]`** - Never exceed 85% viewport height
- [ ] **Prediction Modal: `max-w-lg`** (512px max width)
- [ ] **Completion Modal: `max-w-2xl`** (672px max width for complex results)
- [ ] **No internal scrolling** - Content must fit without scroll

#### Positioning

- [ ] **`fixed inset-0`** - Full viewport overlay
- [ ] **`bg-black/80 backdrop-blur-sm`** - Semi-transparent blurred background
- [ ] **`flex items-center justify-center`** - Centered modal
- [ ] **`z-50`** - Above all other content
- [ ] **`p-4`** - Padding to prevent viewport edge collision

#### Scrolling Prohibition

- [ ] ✅ **NO `overflow-y-auto` on modal body**
- [ ] ✅ **Content designed to fit** using compact layouts, smaller fonts, grid layouts
- [ ] ✅ **Use grid/flex wrapping** instead of scrolling for long lists

---

### 1.2 Panel Layout Architecture

#### Mandatory Flex Ratio

- [ ] **Visualization panel: `flex-[3]`** - 66.67% width (left panel)
- [ ] **Steps panel: `w-96`** - Fixed 384px OR `flex-[1.5]` (right panel)
- [ ] **Gap between panels: `gap-4`** - 1rem spacing

#### Minimum Widths

- [ ] **Steps panel: 384px minimum** (`w-96`) - Never smaller
- [ ] **Visualization panel: No minimum** - Can shrink with viewport

#### Overflow Handling

- [ ] **Each panel manages own overflow** - `overflow-hidden` on parent
- [ ] **Scrollable content: `overflow-auto`** on inner div
- [ ] **Visualization uses `items-start + mx-auto`** pattern (see 1.6)

---

### 1.3 HTML Landmark IDs

#### Required IDs (6 Mandatory)

- [ ] **`#app-root`** - Top-level app container (outermost `<div>`)
- [ ] **`#app-header`** - Main header bar (algorithm info, controls)
- [ ] **`#panel-visualization`** - Main visualization area (left panel)
- [ ] **`#panel-steps`** - Right panel container (steps/state)
- [ ] **`#panel-steps-list`** - Scrollable steps/stack list
- [ ] **`#panel-step-description`** - Current step description (bottom of right panel)

#### Dynamic ID

- [ ] **`#step-current`** - Currently executing step (auto-scroll target)
  - Applied to active call frame in CallStackView
  - Only ONE element should have this ID at a time

---

### 1.4 Keyboard Navigation

#### Standard Shortcuts (Always Active)

- [ ] **â†' (Right Arrow)** - Next Step
- [ ] **↠(Left Arrow)** - Previous Step
- [ ] **Space** - Toggle Mode (Watch/Predict)
- [ ] **R** - Reset (restart trace from beginning)

#### Modal-Specific (When Modal Active)

- [ ] **Enter** - Submit (in PredictionModal)
- [ ] **S** - Skip (in PredictionModal)
- [ ] **Escape** - Close modal (optional enhancement)

#### Prediction Shortcuts (Auto-Derived, Max 3)

- [ ] **HARD LIMIT: ≤3 prediction choices** - Never exceed
- [ ] **Derivation strategy implemented** - First letter → key words → numbers (1,2,3)
- [ ] **Fallback numbers work** - 1, 2, 3 always functional

#### Implementation Pattern

- [ ] **`useEffect` + `window.addEventListener`** - Global keyboard listener
- [ ] **Ignore when modal open** - Modals handle own shortcuts
- [ ] **Ignore when typing** - Check if `INPUT` or `TEXTAREA` focused
- [ ] **`event.preventDefault()`** - Prevent default browser behavior

---

### 1.5 Auto-Scroll Behavior

#### Required Implementation

- [ ] **`useRef()` for active element** - Create `activeCallRef`
- [ ] **`scrollIntoView()` on step change** - Trigger in `useEffect`
- [ ] **Options: `behavior: 'smooth', block: 'center'`** - Exact parameters
- [ ] **Dependency: `[currentStep]`** - Re-trigger on step change

#### Scroll Triggers

- [ ] ✅ **User navigates** (Arrow keys, buttons)
- [ ] ✅ **Prediction mode auto-advances** (after correct answer)
- [ ] ✅ **Watch mode** (auto-play)
- [ ] ⌠**NOT on manual scroll** (don't fight user intent)
- [ ] ⌠**NOT on algorithm switch** (scrolling to top expected)

---

### 1.6 Overflow Handling Anti-Patterns

#### THE CRITICAL PATTERN

**⌠WRONG (causes left edge cutoff):**

```jsx
<div className="flex items-center overflow-auto">
  {/* Wide content - left portion inaccessible */}
</div>
```

**✅ CORRECT (permanent solution):**

```jsx
<div className="flex items-start overflow-auto">
  <div className="mx-auto">{/* Wide content - fully scrollable */}</div>
</div>
```

#### Checklist

- [ ] **Visualization panel uses `items-start`** - NOT `items-center`
- [ ] **Inner wrapper has `mx-auto`** - For centering when content fits
- [ ] **`overflow-auto` on outer container** - Enables scrolling
- [ ] **`flex-shrink-0` on elements** - Prevent squishing
- [ ] **Tested with wide content** - Verify left edge accessible

---

## SECTION 2: CONSTRAINED REQUIREMENTS (Limited Freedom)

### 2.1 Visualization Component Interface

#### Required Props

- [ ] **`step` prop** - Current step data (includes `step.data.visualization`)
- [ ] **`config` prop** - Visualization config from metadata

#### Required Behavior

- [ ] **Extract visualization data** - From `step?.data?.visualization`
- [ ] **Graceful fallback** - Handle missing data (show message)
- [ ] **State-based styling** - Map element states to visual styles
- [ ] **Overflow pattern** - Use `items-start + mx-auto` (Section 1.6)

#### Allowed Customizations

- [ ] ✅ **Custom animation styles** (transitions, hover effects)
- [ ] ✅ **Algorithm-specific visual elements** (pivot indicators, etc.)
- [ ] ✅ **Color scheme variations** (within Tailwind palette)
- [ ] ✅ **Layout within panel** (grid vs flex vs custom)

#### Restrictions

- [ ] ⌠**NOT ignoring `step.data.visualization` structure**
- [ ] ⌠**NOT violating overflow pattern** (no `items-center + overflow-auto`)
- [ ] ⌠**NOT exceeding panel boundaries** (use `overflow-auto`)

---

### 2.2 Prediction Questions

#### HARD LIMIT: Maximum 3 Choices

- [ ] **≤3 choices per question** - Strictly enforced
- [ ] **2-choice grid: `grid-cols-2`** - Side-by-side layout
- [ ] **3-choice grid: `grid-cols-3`** - Three columns layout

#### Question Simplification (If >3 Natural Choices)

- [ ] **Strategy 1: Higher-level questions** - Yes/No/Maybe
- [ ] **Strategy 2: Group choices conceptually** - Regions/categories
- [ ] **Strategy 3: Skip prediction** - Not every step needs one

#### Button States

- [ ] **Default: `bg-{color}-600`**
- [ ] **Hover: `hover:bg-{color}-500 hover:scale-105`**
- [ ] **Selected: `scale-105 ring-2 ring-{color}-400 shadow-xl`**
- [ ] **Unselected (after selection): `opacity-60`**

---

### 2.3 Completion Modal

#### Detection Strategy

- [ ] **Last-step detection** - Check if `step === trace.trace.steps.length - 1`
- [ ] ⌠**NOT step type check** - Algorithm-agnostic

#### Algorithm-Specific Rendering

- [ ] **Detect algorithm** - From `trace?.metadata?.algorithm`
- [ ] **Render appropriate results** - Binary Search vs Interval Coverage vs Generic
- [ ] **Generic fallback** - Always provide for unknown algorithms

#### Prediction Accuracy Display

- [ ] **Calculate accuracy** - If `predictionStats.total > 0`
- [ ] **Show stats** - Correct/total, percentage
- [ ] **Feedback message** - Based on accuracy percentage
- [ ] **Hide section** - If prediction mode not used

---

## SECTION 3: FREE CHOICES (Your Decision)

### Component Architecture

- [ ] **File organization** - Flat vs nested (your choice)
- [ ] **Component patterns** - Functional vs class (prefer functional)
- [ ] **Code splitting** - React.lazy if needed

### State Management

- [ ] **Built-in React state** - useState, useReducer, useContext
- [ ] **External libraries** - Redux, Zustand, MobX (if needed)

### Performance

- [ ] **Memoization** - React.memo, useMemo, useCallback (when profiled)
- [ ] **Virtualization** - React Virtual/Window (for >100 steps)

---

## Testing Checklist

### LOCKED Requirements Test

- [ ] **Modal fits in `max-h-[85vh]`** - No scrolling
- [ ] **Panel layout uses 3:1.5 ratio** - Measure widths
- [ ] **All 6 required IDs present** - Inspect DOM
- [ ] **Keyboard shortcuts work** - Arrow keys, Space, R, Enter, S
- [ ] **Auto-scroll works** - `#step-current` scrolls into view
- [ ] **Overflow pattern correct** - Left edge accessible on wide content

### CONSTRAINED Requirements Test

- [ ] **Visualization component accepts props** - step, config
- [ ] **Prediction questions ≤3 choices** - Count buttons
- [ ] **Completion modal uses last-step detection** - Check logic

### User Experience Test

- [ ] **No regressions** - Existing algorithms work
- [ ] **Visualization clear** - Easy to understand
- [ ] **Step descriptions helpful** - Meaningful text
- [ ] **Prediction questions meaningful** - Not arbitrary

---

## Example: ArrayView Validation

```jsx
// Validation points for ArrayView component
const validateArrayView = (component) => {
  // LOCKED: Overflow pattern
  const container = component.querySelector(".overflow-auto");
  assert(container.classList.contains("items-start"), "Must use items-start");
  const wrapper = container.querySelector(".mx-auto");
  assert(wrapper !== null, "Must have mx-auto wrapper");

  // CONSTRAINED: Props interface
  assert(component.props.step !== undefined, "Must accept step prop");
  assert(component.props.config !== undefined, "Must accept config prop");

  // CONSTRAINED: Graceful fallback
  if (!component.props.step?.data?.visualization) {
    const fallback = component.querySelector(".text-gray-400");
    assert(fallback !== null, "Must show fallback message");
  }

  console.log("✅ ArrayView is compliant");
};
```

---

## Quick Reference: Modal Sizes

| Modal Type | Max Width      | Use Case                        |
| ---------- | -------------- | ------------------------------- |
| Prediction | `max-w-lg`     | 512px - Questions (2-3 choices) |
| Completion | `max-w-2xl`    | 672px - Results + stats         |
| All Modals | `max-h-[85vh]` | 85% viewport - No scrolling     |

---

## Quick Reference: Required IDs

```jsx
<div id="app-root">
  <div id="app-header">/* Controls */</div>
  <div className="flex">
    <div id="panel-visualization">/* Timeline/Array */</div>
    <div id="panel-steps">
      <div id="panel-steps-list">
        <div id="step-current">/* Active step */</div>
      </div>
      <div id="panel-step-description">/* Current action */</div>
    </div>
  </div>
</div>
```

---

## Approval Criteria

✅ **PASS** - All LOCKED requirements met, no anti-patterns present  
**MINOR ISSUES** - CONSTRAINED choices questionable but acceptable  
**FAIL** - LOCKED requirements violated, UI regression detected

---

**Remember:** The three static mockups (`algorithm_page_mockup.html`, `prediction_modal_mockup.html`, `completion_modal_mockup.html`) are your visual source of truth. When in doubt, reference them.
