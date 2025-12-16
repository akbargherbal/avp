# Executive Summary: Keyboard Shortcut Conflicts

## Investigation ID

INV-3: Keyboard Shortcut Conflicts

## Status

[x] Investigation Complete
[x] Issue Confirmed
Date Completed: 2025-12-16

---

## Findings Summary (3-5 sentences)

Multiple components independently listen for the `Escape` key, leading to potential conflicts and an undesirable user experience where a single keypress can close multiple UI elements simultaneously. Specifically, `useKeyboardShortcuts.js`, `AlgorithmSwitcher.jsx` (when its dropdown is open), and `KeyboardHints.jsx` (when its panel is open) all attach `keydown` listeners for `Escape`. While `useKeyboardShortcuts` attempts to prioritize actions based on modal state, it cannot prevent other independent listeners from firing, resulting in overlapping actions.

---

## Evidence & Metrics

### Quantitative Data

-   **`addEventListener("keydown")` locations (excluding docs)**:
    -   `frontend/src/hooks/useKeyboardShortcuts.js`
    -   `frontend/src/components/AlgorithmSwitcher.jsx`
    -   `frontend/src/components/KeyboardHints.jsx`
-   **Conflicting Key**: `Escape` is listened to by all three active sources.
-   **Number of potential simultaneous actions for `Escape`**: Up to 3 (e.g., closing `AlgorithmSwitcher` dropdown, `KeyboardHints` panel, and a modal via `useKeyboardShortcuts`).

### Qualitative Observations

-   **Code Smell**: Decentralized handling of a common global keyboard event (`Escape`).
-   **User Experience Impact**: Pressing `Escape` might unexpectedly close more than one open UI element (e.g., closing both the Algorithm Switcher dropdown and Keyboard Hints panel at the same time).
-   **Prioritization Logic**: `useKeyboardShortcuts.js` includes `if (predictionOpen) return;` and `if (modalOpen) return;` logic to prioritize actions when prediction or other modals are open. However, this only prevents subsequent handlers *within that specific hook* from firing, not other independent `window`/`document` listeners.
-   **Text Input Handling**: `useKeyboardShortcuts.js` correctly prevents shortcuts when the target is an `INPUT` or `TEXTAREA`, mitigating conflicts with typing. Other components do not explicitly include this check, but their specific use cases (closing on `Escape`) are less likely to conflict with text input.

### Test Results

-   **Static Analysis**: Identified overlapping `Escape` key listeners.
-   **Conflict Scenario**: If both the `AlgorithmSwitcher` dropdown and the `KeyboardHints` panel are open, pressing `Escape` will close both. If a modal managed by `useKeyboardShortcuts` is also open (and not `predictionOpen` which takes highest priority), that modal would also close simultaneously. This is an undesirable multiple action for a single key press.

---

## Severity Assessment

**Impact**: [x] Medium
**Urgency**: [ ] Immediate / [x] Soon / [ ] Eventually / [ ] Not Needed

**Justification**: While not application-breaking, the current `Escape` key handling creates an inconsistent and potentially confusing user experience. It can lead to unintended simultaneous closures of multiple UI elements. Addressing this will improve the predictability and intuitiveness of the user interface. It's an issue that should be fixed soon to refine UX.

---

## Affected Files & Components

**Direct Impact**:

-   `frontend/src/hooks/useKeyboardShortcuts.js`
-   `frontend/src/components/AlgorithmSwitcher.jsx`
-   `frontend/src/components/KeyboardHints.jsx`
-   `frontend/src/App.jsx` (as the orchestrator of `modalOpen` and `onCloseModal` props for `useKeyboardShortcuts`)

**Indirect Impact** (will need changes if this is fixed):

-   Any modal or overlay component in `frontend/src/components/` that expects `Escape` to close it, which might currently rely on the `useKeyboardShortcuts`'s general modal handling.

**Estimated Files to Modify**: 3-4 (the three components/hooks directly involved, potentially `App.jsx` for how it passes modal state).

---

## Dependencies & Related Investigations

**Depends On** (must be fixed first):

-   [ ] INV-1: Single Responsibility Violation (Refactoring `App.jsx` might provide a better structure for centralizing modal state, which would help with keyboard shortcuts).

**Blocks** (other investigations waiting on this):

-   [ ] None.

**Related To** (could be fixed together):

-   [x] INV-1: Single Responsibility Violation
-   Reason: A refactoring of `App.jsx` (INV-1) to better manage modal states could lead to a more centralized and robust keyboard shortcut system, making it easier to control event propagation for keys like `Escape`.

---

## Recommended Solution Approach

**Strategy**: Implement a centralized keyboard event management system that allows components to register and unregister their desired `keydown` handlers. This system should support prioritization and event consumption to ensure only one action is triggered per keypress for a given context.

**Implementation Steps** (rough outline, not detailed):

1.  **Create a Keyboard Context/Provider**: A React Context (e.g., `KeyboardContext`) that provides functions to register/unregister keydown handlers with a priority.
2.  **Centralized Listener**: A single `window.addEventListener("keydown")` within the provider that iterates through registered handlers (from highest to lowest priority) and executes the first one that matches the `event.key` and `condition`. This handler should then call `event.stopPropagation()` and `event.preventDefault()` if it handles the event.
3.  **Refactor Components**:
    -   Modify `useKeyboardShortcuts` to register its handlers with the new centralized system, ensuring its existing prioritization for `predictionOpen` and `modalOpen` is maintained.
    -   Modify `AlgorithmSwitcher` and `KeyboardHints` to register their `Escape` handlers with a lower priority than active modals, and ensure these handlers consume the event.
4.  **Testing**: Thoroughly test `Escape` key behavior when various combinations of UI elements (dropdown, hints, modals) are open to ensure only the highest-priority action occurs.

**Estimated Effort**: 2-3 days

**Risk Assessment**:

-   Breaking changes: [x] Yes (modifying core event handling system)
-   Requires testing: [x] Yes
-   Affects user experience: [x] Yes (intended to improve, but bugs could degrade)

---

## Recommendation

[ ] **Fix Now** - Critical path item, blocks other work
[x] **Fix in Sprint 1** - High priority, clear solution
[ ] **Fix in Sprint 2** - Medium priority, plan alongside other work
[ ] **Monitor** - Not urgent, revisit in 3 months
[ ] **Not an Issue** - Suspicion not confirmed, no action needed

**Additional Notes**: This refactoring aligns well with the overall goal of improving component modularity and user experience. It's crucial to implement a robust testing strategy for keyboard events after these changes.

---

**Investigator**: CodeAuditor
**Review Date**: 2026-01-16
