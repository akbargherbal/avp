# Frontend UI/UX Compliance Checklist

**Version:** 1.1 (Session 22 - Corrected)
**Authority:** TENANT_GUIDE.md v1.0 - Sections 1 (LOCKED) & 2 (CONSTRAINED)
**Visual Authority:** Static Mockups (`docs/static_mockup/*.html`)
**Purpose:** Verify UI components comply with platform standards

---

## SECTION 1: LOCKED REQUIREMENTS (Zero Freedom)

### 1.1 Modal Standards

#### Size Constraints

- [ ] **All modals use `max-w-lg` (512px)** - PredictionModal, CompletionModal, all dialogs
- [ ] **NO height constraints** - Content designed to fit naturally (no `max-h-[85vh]`)
- [ ] **Outer padding: `p-6`** - Consistent 24px padding on all modals
- [ ] **No internal scrolling** - Content must fit without `overflow-y-auto`

**Source:** `completion_modal_mockup.html` and `prediction_modal_mockup.html` - all examples use `max-w-lg w-full p-6`

**Rationale:**

- Single width maintains visual consistency across all modal types
- Height constraints unnecessary: 3-choice limit + compact spacing + flex-wrap patterns keep modals naturally compact
- Example: `completion_modal_mockup.html` Example 3 shows complex interval data fitting perfectly at 512px using flex-wrap

#### Positioning

- [ ] **`fixed inset-0`** - Full viewport overlay
- [ ] **`bg-black/80 backdrop-blur-sm`** - Semi-transparent blurred background
- [ ] **`flex items-center justify-center`** - Centered modal
- [ ] **`z-50`** - Above all other content
- [ ] **`p-4`** on overlay - Padding to prevent viewport edge collision

#### Content Fitting Strategy

- [ ] **Use flex-wrap** for lists of items (intervals, results, badges)
- [ ] **Use compact spacing** (mb-3, mb-4, NOT mb-6+)
- [ ] **Use smaller fonts** (text-sm, text-xs for labels)
- [ ] **Show summary for long lists** (e.g., "+5 more" instead of scrolling)

---

### 1.1.1 Modal Spacing Standards

**Source:** Extracted from static mockup HTML structure

#### CompletionModal Spacing Verification

- [ ] **Outer padding: `p-6`** (NOT p-5, NOT p-8)
- [ ] **Header icon margin: `mb-3`** (12px below icon)
- [ ] **Header section margin: `mb-4`** (16px below entire header)
- [ ] **Section gaps: `mb-4`** (stats, accuracy, results sections)
- [ ] **Inner content padding: `p-3`** (content boxes like stats grid)
- [ ] **Grid gaps: `gap-3`** (between stat columns)
- [ ] **Actions section: `pt-4`** (16px above buttons)
- [ ] **Actions gap: `gap-3`** (between Close and Start Over buttons)

#### PredictionModal Spacing Verification

- [ ] **Outer padding: `p-6`** (NOT p-8)
- [ ] **Question header margin: `mb-6`** (24px - major section break)
- [ ] **Hint box margin: `mb-6`** (24px - major section break)
- [ ] **Hint box padding: `p-4`** (16px internal padding)
- [ ] **Choices grid margin: `mb-6`** (24px below choices)
- [ ] **Choices grid gap: `gap-3`** (12px between buttons)
- [ ] **Actions section: `pt-4`** (16px above actions)

#### Typography Verification

- [ ] **Modal titles: `text-2xl`** (NOT text-3xl)
- [ ] **Subtitle: `text-sm`** (step count, algorithm name)
- [ ] **Section headers: `text-sm` + `font-bold`** (e.g., "Prediction Accuracy")
- [ ] **Stat values: `text-xl` + `font-bold`** (NOT text-2xl unless for emphasis)
- [ ] **Percentage emphasis: `text-2xl`** (accuracy percentage only)
- [ ] **Labels: `text-xs`** (field labels, hints)
- [ ] **Body text: `text-sm`** (descriptions, content)
- [ ] **Button primary text: `text-base`** (choice button main text)
- [ ] **Button shortcuts: `text-xs`** (keyboard hint text)

#### Visual Quality Checks

- [ ] **Modal height ≤ 400px** (typical case with all sections visible)
- [ ] **No excessive whitespace** (gaps between sections feel balanced)
- [ ] **Text hierarchy clear** (size differences create visual structure)
- [ ] **Compact without cramped** (breathing room without waste)
- [ ] **Matches static mockup** (side-by-side comparison passes)

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

- [ ] **→ (Right Arrow)** - Next Step
- [ ] **Space** - Next Step (alternative to Right Arrow)
- [ ] **← (Left Arrow)** - Previous Step
- [ ] **R** - Reset (restart trace from beginning)
- [ ] **Home** - Reset (alternative to R)

**Source:** `algorithm_page_mockup.html` lines 856-874

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
- [ ] **Space handled same as Right Arrow** - Both advance to next step

#### Anti-Patterns

- [ ] ⛔ **NOT using Space for mode toggle** - Space is for navigation only
- [ ] ⛔ **NOT different behavior for Space vs Right Arrow** - Must be identical

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
- [ ] ⛔ **NOT on manual scroll** (don't fight user intent)
- [ ] ⛔ **NOT on algorithm switch** (scrolling to top expected)

---

### 1.6 Overflow Handling Anti-Patterns

#### THE CRITICAL PATTERN

**⛔ WRONG (causes left edge cutoff):**

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

- [ ] ⛔ **NOT ignoring `step.data.visualization` structure**
- [ ] ⛔ **NOT violating overflow pattern** (no `items-center + overflow-auto`)
- [ ] ⛔ **NOT exceeding panel boundaries** (use `overflow-auto`)

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
- [ ] ⛔ **NOT step type check** - Algorithm-agnostic

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

- [ ] **Modal uses `max-w-lg`** - Measure width (should be 512px max)
- [ ] **Modal has NO height constraint** - No `max-h-[85vh]` class present
- [ ] **Modal outer padding is `p-6`** - Measure padding (should be 24px)
- [ ] **Panel layout uses 3:1.5 ratio** - Measure widths
- [ ] **All 6 required IDs present** - Inspect DOM
- [ ] **Keyboard shortcuts work** - Arrow keys, Space, R, Enter, S
- [ ] **Auto-scroll works** - `#step-current` scrolls into view
- [ ] **Overflow pattern correct** - Left edge accessible on wide content
- [ ] **Spacing matches mockup** - Side-by-side visual comparison

### CONSTRAINED Requirements Test

- [ ] **Visualization component accepts props** - step, config
- [ ] **Prediction questions ≤3 choices** - Count buttons
- [ ] **Completion modal uses last-step detection** - Check logic

### User Experience Test

- [ ] **No regressions** - Existing algorithms work
- [ ] **Visualization clear** - Easy to understand
- [ ] **Step descriptions helpful** - Meaningful text
- [ ] **Prediction questions meaningful** - Not arbitrary
- [ ] **Modals feel compact** - No excessive whitespace
- [ ] **Visual consistency** - All modals look similar

---

## Quick Reference: Modal Standards

| Property               | Value              | Source                 |
| ---------------------- | ------------------ | ---------------------- |
| **Width**              | `max-w-lg` (512px) | All mockup examples    |
| **Height**             | No constraint      | Content fits naturally |
| **Padding**            | `p-6` (24px)       | All mockup examples    |
| **Major section gaps** | `mb-6` (24px)      | PredictionModal        |
| **Minor section gaps** | `mb-4` (16px)      | CompletionModal        |
| **Inner padding**      | `p-3` (12px)       | Content boxes          |
| **Grid gaps**          | `gap-3` (12px)     | Stats, choices         |
| **Title font**         | `text-2xl`         | NOT text-3xl           |
| **Stat values**        | `text-xl`          | NOT text-2xl           |

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

✅ **PASS** - All LOCKED requirements met, spacing matches mockups, no anti-patterns present  
⚠️ **MINOR ISSUES** - CONSTRAINED choices questionable but acceptable  
❌ **FAIL** - LOCKED requirements violated, spacing doesn't match mockups, UI regression detected

---

**Remember:** The three static mockups (`algorithm_page_mockup.html`, `prediction_modal_mockup.html`, `completion_modal_mockup.html`) are your **visual source of truth**. When in doubt, reference them.

**Version History:**

- v1.0: Initial checklist (Session 17)
- v1.1: Corrected modal standards based on mockup analysis (Session 22)
  - Removed `max-h-[85vh]` requirement (not in mockups)
  - Changed CompletionModal from `max-w-2xl` to `max-w-lg` (matches mockups)
  - Corrected padding from `p-5` to `p-6` (matches mockups)
  - Added detailed spacing verification based on mockup HTML structure
