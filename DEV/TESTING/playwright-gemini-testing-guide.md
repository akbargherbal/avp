# Algorithm Visualization Platform - Playwright/Gemini CLI Testing Guide

A comprehensive guide for testing your Algorithm Visualization Platform using Playwright MCP Server with Gemini CLI.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Gemini CLI Configuration](#gemini-cli-configuration)
4. [Testing Workflows](#testing-workflows)
5. [Test Scenarios](#test-scenarios)
6. [Compliance Testing](#compliance-testing)
7. [Advanced Testing Patterns](#advanced-testing-patterns)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js 18+** (for Gemini CLI and Playwright)
- **Python 3.11+** (for your backend)
- **npm or pnpm** (package manager)
- **Google Gemini API Key** (get from https://aistudio.google.com/app/apikey)

### Your Application Setup

```bash
# Backend should be running on http://localhost:5000
cd backend
source venv/bin/activate
python app.py

# Frontend should be running on http://localhost:3000
cd frontend
npm start
```

---

## Environment Setup

### Step 1: Install Gemini CLI

```bash
# Clone or download Gemini CLI repository
# (Assuming you have the bundle from the guide)
cd /path/to/gemini-cli

# Install dependencies
npm install
npm run bundle

# Verify installation
node bundle/gemini.js --help
```

### Step 2: Set Up Authentication

**Option A: API Key (Recommended for Testing)**

```bash
# Get your API key from Google AI Studio
# https://aistudio.google.com/app/apikey

# Set environment variable
export GEMINI_API_KEY="your_api_key_here"

# Make it persistent (add to ~/.bashrc or ~/.zshrc)
echo 'export GEMINI_API_KEY="your_api_key_here"' >> ~/.bashrc
source ~/.bashrc
```

**Option B: OAuth (Interactive)**

```bash
# Run CLI - it will prompt for authentication
node bundle/gemini.js

# Select "1. Login with Google"
# Browser opens automatically for authentication
```

### Step 3: Verify Authentication

```bash
# Test that authentication works
node bundle/gemini.js "Hello, can you hear me?"

# You should get a response from Gemini
```

---

## Gemini CLI Configuration

### Configure Playwright MCP Server

Create or edit the Gemini CLI settings file with Playwright configuration.

**File Location:**
- **Mac/Linux:** `~/.config/gemini/settings.json`
- **Windows:** `%USERPROFILE%\.config\gemini\settings.json`

**Configuration:**

```json
{
  "model": {
    "name": "gemini-2.5-pro"
  },
  "general": {
    "preferredEditor": "code"
  },
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

**Verify MCP Server Connection:**

```bash
# Start Gemini CLI
node bundle/gemini.js

# Inside CLI, check MCP status
/mcp

# You should see "playwright" listed as connected
```

---

## Testing Workflows

### Workflow 1: Exploratory Testing (QA Agent)

Use Gemini as an AI QA engineer to explore your application and find bugs.

**Start the CLI:**

```bash
node bundle/gemini.js
```

**Example Prompt:**

```
@playwright I want you to act as a QA Engineer testing an Algorithm Visualization Platform. 

Application URL: http://localhost:3000

Your tasks:
1. Navigate to the application
2. Test the algorithm selector dropdown (should show "Binary Search" and "Interval Coverage")
3. For Binary Search:
   - Select an example input
   - Navigate through steps using arrow buttons
   - Test keyboard shortcuts (→, ←, R)
   - Enable prediction mode and test it
4. Report any visual bugs, console errors, or broken functionality

Be thorough and document everything you find.
```

**Expected Behavior:**
- Gemini will navigate to your app
- Take screenshots at each step
- Click through UI elements
- Report findings in detail

### Workflow 2: Automated Test Generation

Have Gemini write Playwright test files based on your application behavior.

**Example Prompt:**

```
@playwright 

Application: Algorithm Visualization Platform at http://localhost:3000

Task: Create a comprehensive Playwright test suite (TypeScript) that validates:

1. **Algorithm Discovery & Switching**
   - Algorithm dropdown appears
   - Both algorithms are listed
   - Switching between algorithms works

2. **Binary Search Visualization**
   - Example inputs load
   - ArrayView displays correctly
   - Step navigation works (next/prev/reset)
   - Visual states update (active_range, examining, excluded)

3. **Prediction Mode**
   - Can toggle prediction mode
   - Modal appears at decision points
   - Can make predictions and get feedback
   - Accuracy tracking works

4. **Keyboard Shortcuts**
   - Arrow keys navigate steps
   - R resets to start
   - K/C work in prediction mode

First, explore the application manually to understand its behavior, then write the test file.
```

### Workflow 3: Compliance Validation

Use Gemini to verify your application meets compliance checklist requirements.

**Example Prompt:**

```
@playwright 

Application: http://localhost:3000
Reference Document: @docs/compliance/FRONTEND_CHECKLIST.md

Task: Systematically validate EVERY item in the Frontend Compliance Checklist.

For each checklist item:
1. Navigate to relevant section
2. Inspect DOM elements
3. Test behavior
4. Screenshot evidence
5. Mark as ✅ PASS or ❌ FAIL with explanation

Focus on:
- Modal IDs (#prediction-modal, #completion-modal)
- Overflow patterns (items-start + mx-auto)
- Keyboard shortcuts
- Auto-scroll behavior

Generate a compliance report.
```

---

## Test Scenarios

### Scenario 1: Algorithm Selector Testing

**Objective:** Validate algorithm discovery and switching functionality.

**Gemini Prompt:**

```
@playwright Navigate to http://localhost:3000

Test the algorithm selector:
1. Verify dropdown exists in top-left
2. Click dropdown and verify "Binary Search" and "Interval Coverage" are present
3. Select "Binary Search" - verify UI updates
4. Select "Interval Coverage" - verify UI updates
5. Check that example inputs change when switching algorithms

Report any issues found.
```

**Expected Output:**
- Screenshots of dropdown open/closed
- Confirmation both algorithms appear
- Evidence of successful algorithm switching

### Scenario 2: Binary Search Step Navigation

**Objective:** Validate step-by-step navigation for Binary Search.

**Gemini Prompt:**

```
@playwright Navigate to http://localhost:3000

Test Binary Search visualization:
1. Select "Binary Search" from dropdown
2. Click the first example input "Basic Search - Target Found"
3. Verify ArrayView displays with:
   - Target indicator at top
   - Array elements in grid
   - Pointers (L, R, M) below elements
4. Click "Next Step" button 5 times
5. Verify:
   - Step counter updates
   - Array element states change (colors)
   - Pointers move correctly
6. Click "Previous Step" 2 times - verify it works
7. Click "Reset" - verify returns to step 0

Screenshot each major state.
```

### Scenario 3: Prediction Mode Flow

**Objective:** Test interactive prediction functionality end-to-end.

**Gemini Prompt:**

```
@playwright Navigate to http://localhost:3000

Test Prediction Mode:
1. Select "Binary Search"
2. Load first example
3. Click "⏳ Predict" button to enable prediction mode
4. Click "Next Step" until prediction modal appears
5. Verify modal contains:
   - Question text
   - 2-3 choice buttons
   - Skip button
6. Click a choice button
7. Verify immediate feedback (✅ correct or ❌ incorrect)
8. Click "Continue" to proceed
9. Complete entire trace
10. Verify completion modal shows:
    - Final accuracy percentage
    - Encouraging message
    - "Start Over" button

Test both correct and incorrect predictions.
```

### Scenario 4: Keyboard Shortcuts

**Objective:** Validate all keyboard shortcuts work correctly.

**Gemini Prompt:**

```
@playwright Navigate to http://localhost:3000

Test Keyboard Shortcuts:
1. Load Binary Search example
2. Test navigation shortcuts:
   - Press → (right arrow) - should go to next step
   - Press ← (left arrow) - should go to previous step
   - Press R - should reset to start
   - Press End - should jump to last step
3. Enable prediction mode
4. Navigate to prediction modal
5. Test prediction shortcuts:
   - Press K - should select first choice
   - Press C - should select second choice
   - Press S - should skip question
6. Click keyboard icon (bottom-right)
7. Verify shortcut hints display

Report which shortcuts work and which fail.
```

### Scenario 5: Overflow Pattern Validation

**Objective:** Verify content doesn't get cut off with large arrays.

**Gemini Prompt:**

```
@playwright Navigate to http://localhost:3000

Test Overflow Handling:
1. Select "Binary Search"
2. Create a custom input with large array:
   - Array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
   - Target: 15
   (Use browser console to submit if needed)
3. Load the trace
4. Verify:
   - All array elements are visible (no cutoff on left)
   - Can scroll vertically to see all content
   - No horizontal scrollbar appears
   - Content uses items-start + mx-auto pattern
5. Inspect the DOM to verify:
   - Parent has "items-start"
   - Child has "mx-auto"

Screenshot the layout with large array.
```

### Scenario 6: Modal ID Compliance

**Objective:** Validate modal HTML IDs match LOCKED requirements.

**Gemini Prompt:**

```
@playwright Navigate to http://localhost:3000

Test Modal ID Compliance:
1. Enable prediction mode
2. Navigate to prediction point
3. When prediction modal appears:
   - Use browser DevTools to inspect modal
   - Verify modal has id="prediction-modal"
   - Screenshot the DOM inspector
4. Complete trace to trigger completion modal
5. When completion modal appears:
   - Inspect modal
   - Verify modal has id="completion-modal"
   - Screenshot the DOM inspector

Report if IDs match exactly (case-sensitive).
```

### Scenario 7: Visual Highlighting (Interval Coverage)

**Objective:** Test visual bridge between call stack and timeline.

**Gemini Prompt:**

```
@playwright Navigate to http://localhost:3000

Test Visual Highlighting for Interval Coverage:
1. Select "Interval Coverage" from dropdown
2. Load first example
3. Navigate through steps
4. When call stack appears (right panel):
   - Verify active call stack entry has yellow border
   - Verify corresponding interval on timeline has yellow glow
   - Hover over different call stack entries
   - Verify hovered interval highlights on timeline
   - Verify other intervals dim to lower opacity
5. Screenshot various highlight states

Report if highlighting works correctly.
```

### Scenario 8: Error Handling

**Objective:** Validate graceful error handling.

**Gemini Prompt:**

```
@playwright 

Test Error Handling:
1. Navigate to http://localhost:3000 (backend should be running)
2. Verify app loads correctly
3. In a separate terminal, stop the backend (Ctrl+C)
4. Refresh the frontend page
5. Verify error boundary displays:
   - Clear error message "Backend Not Available"
   - "Retry Connection" button
6. Restart backend
7. Click "Retry Connection"
8. Verify app reconnects successfully

Screenshot error state and recovery.
```

---

## Compliance Testing

### Backend Compliance Test

**Reference:** `docs/compliance/BACKEND_CHECKLIST.md`

**Gemini Prompt:**

```
@playwright I need to validate backend compliance for a new algorithm.

Backend URL: http://localhost:5000/api

Test Trace Endpoint:
POST http://localhost:5000/api/trace/unified
Body: {
  "algorithm": "binary-search",
  "input": {
    "array": [1, 3, 5, 7, 9],
    "target": 5
  }
}

Validate the response against Backend Compliance Checklist:

✅ LOCKED REQUIREMENTS:
1. Response has "result", "trace", "metadata" keys
2. metadata.algorithm = "binary-search"
3. metadata.display_name exists (string)
4. metadata.visualization_type exists (string)
5. trace.steps is array
6. Each step has: step, type, timestamp, data, description
7. data.visualization exists
8. Pointers use object format: {left: 0, right: 7, mid: 3}
9. Elements use state string: "active_range", "examining", "excluded"

✅ CONSTRAINED REQUIREMENTS:
10. Prediction points have ≤3 choices
11. Step types from allowed list

✅ FREE ZONES:
12. Algorithm logic is correct

Generate compliance report with ✅/❌ for each item.
```

### Frontend Compliance Test

**Reference:** `docs/compliance/FRONTEND_CHECKLIST.md`

**Gemini Prompt:**

```
@playwright Navigate to http://localhost:3000

Validate Frontend Compliance Checklist:

✅ LOCKED REQUIREMENTS:
1. Prediction modal id="prediction-modal"
2. Completion modal id="completion-modal"
3. Overflow pattern: parent has items-start, child has mx-auto
4. No items-center on overflow containers
5. Keyboard shortcuts: →, ←, R, K, C, S, Enter
6. Auto-scroll to active call stack entry
7. Panel structure: h-full, items-start, overflow-auto, py-4 px-6

✅ CONSTRAINED REQUIREMENTS:
8. Visualization accepts step and config props
9. Uses state strings consistently
10. Prediction modal shows feedback immediately

For each item:
- Navigate to test scenario
- Inspect DOM or test behavior
- Mark ✅ PASS or ❌ FAIL
- Screenshot evidence

Generate detailed compliance report.
```

### QA Integration Test

**Reference:** `docs/compliance/QA_INTEGRATION_CHECKLIST.md`

**Gemini Prompt:**

```
@playwright Comprehensive QA Integration Test

Application: http://localhost:3000

Execute all 14 test suites from QA checklist:

**LOCKED REQUIREMENTS (Suites 1-6):**
1. Modal Behavior & IDs
2. Panel Layout & Overflow Pattern
3. Keyboard Shortcuts
4. Auto-scroll Behavior
5. Overflow Content Handling
6. Modal Standards

**CONSTRAINED REQUIREMENTS (Suites 7-10):**
7. Backend Contract Compliance
8. Prediction Format Validation
9. Visualization Data Patterns
10. Completion Modal Requirements

**INTEGRATION TESTS (Suites 11-14):**
11. Cross-Algorithm Compatibility
12. Responsive Design (test 3 viewport sizes)
13. Performance Benchmarks
14. Regression Testing

For each suite:
- Execute all test cases
- Document results
- Screenshot failures
- Measure performance where applicable

Generate comprehensive QA report with pass/fail summary.
```

---

## Advanced Testing Patterns

### Pattern 1: Continuous Exploration Loop

**Use Case:** Find bugs through extended exploration.

```bash
node bundle/gemini.js
```

**Prompt:**

```
@playwright Act as an adversarial QA tester.

Application: http://localhost:3000

Continuously explore the application for 15 minutes:
1. Try unusual input combinations
2. Rapidly switch between algorithms
3. Spam keyboard shortcuts
4. Resize browser window during interaction
5. Test prediction mode with wrong answers repeatedly
6. Try to break the UI in creative ways

Log every bug, console error, or unexpected behavior.
Generate a bug report at the end.
```

### Pattern 2: Test Generation from Specifications

**Use Case:** Generate test files from compliance documents.

**Prompt:**

```
@playwright 

References: 
- @docs/compliance/FRONTEND_CHECKLIST.md
- @docs/compliance/BACKEND_CHECKLIST.md

Task: Generate a complete Playwright test suite (TypeScript) that validates ALL items in both checklists.

Structure:
```typescript
// tests/compliance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Frontend Compliance', () => {
  test('Modal IDs', async ({ page }) => {
    // Test prediction-modal and completion-modal IDs
  });
  
  test('Overflow Pattern', async ({ page }) => {
    // Verify items-start + mx-auto pattern
  });
  
  // ... all other frontend checks
});

test.describe('Backend Compliance', () => {
  test('Trace Structure', async ({ request }) => {
    // Validate trace response format
  });
  
  // ... all other backend checks
});
```

Write complete, runnable test file.
```

### Pattern 3: Performance Benchmarking

**Use Case:** Measure and optimize performance.

**Prompt:**

```
@playwright Navigate to http://localhost:3000

Performance Benchmark Test:

1. Measure trace generation time:
   - Use browser DevTools Network tab
   - Load Binary Search example
   - Record time for POST /api/trace/unified
   - Target: <100ms

2. Measure frontend render time:
   - Use Performance API
   - Record time to first meaningful paint
   - Target: <50ms

3. Measure step navigation FPS:
   - Use browser Performance profiler
   - Rapidly navigate steps (click Next 20 times)
   - Record frame rate
   - Target: 60fps

4. Measure JSON payload size:
   - Inspect Network response
   - Record payload size in KB
   - Target: <100KB

Generate performance report with actual vs target metrics.
```

### Pattern 4: Cross-Browser Testing

**Use Case:** Ensure compatibility across browsers.

**Prompt:**

```
@playwright Cross-Browser Compatibility Test

Test application on multiple browsers:
- Chromium (default)
- Firefox
- WebKit (Safari)

For each browser:
1. Navigate to http://localhost:3000
2. Run core functionality tests:
   - Algorithm switching
   - Step navigation
   - Prediction mode
   - Keyboard shortcuts
3. Screenshot key interactions
4. Note any browser-specific issues

Generate compatibility matrix report.
```

---

## Troubleshooting

### Issue: Gemini CLI Can't Connect to MCP Server

**Symptom:** `@playwright` tag not recognized, or "MCP server not found" error.

**Solutions:**

1. **Verify settings.json location:**
   ```bash
   # Mac/Linux
   cat ~/.config/gemini/settings.json
   
   # Windows
   type %USERPROFILE%\.config\gemini\settings.json
   ```

2. **Check JSON syntax:**
   ```bash
   # Use JSON validator
   cat ~/.config/gemini/settings.json | python -m json.tool
   ```

3. **Verify MCP server status:**
   ```bash
   node bundle/gemini.js
   # Inside CLI:
   /mcp
   # Should show "playwright" as connected
   ```

4. **Manually test npx command:**
   ```bash
   npx -y @playwright/mcp@latest
   # Should start Playwright MCP server
   ```

### Issue: Authentication Failures

**Symptom:** "Authentication failed" or "No API key found" errors.

**Solutions:**

1. **Verify API key is set:**
   ```bash
   echo $GEMINI_API_KEY
   # Should show your API key
   ```

2. **Re-export in current shell:**
   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   ```

3. **Check .bashrc/.zshrc:**
   ```bash
   cat ~/.bashrc | grep GEMINI_API_KEY
   source ~/.bashrc
   ```

4. **Use OAuth instead:**
   ```bash
   unset GEMINI_API_KEY
   node bundle/gemini.js
   # Select "Login with Google"
   ```

### Issue: Backend Not Available Errors

**Symptom:** Frontend shows "Backend Not Available" error.

**Solutions:**

1. **Verify backend is running:**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"status": "healthy", ...}
   ```

2. **Check backend logs:**
   ```bash
   cd backend
   python app.py
   # Look for "Running on http://localhost:5000"
   ```

3. **Verify CORS settings:**
   ```python
   # backend/app.py
   CORS(app, resources={
       r"/api/*": {"origins": "http://localhost:3000"}
   })
   ```

### Issue: Playwright Can't Find Elements

**Symptom:** "Element not found" errors in Gemini output.

**Solutions:**

1. **Wait for elements:**
   ```
   @playwright Navigate to http://localhost:3000
   Wait for the algorithm dropdown to appear (may take 1-2 seconds).
   Then click it.
   ```

2. **Use explicit selectors:**
   ```
   @playwright 
   Wait for element with selector: button:has-text("Next Step")
   Then click it.
   ```

3. **Check if app is fully loaded:**
   ```
   @playwright
   1. Navigate to http://localhost:3000
   2. Wait for network idle (no pending requests)
   3. Then proceed with tests
   ```

### Issue: Tests Are Slow

**Symptom:** Gemini takes 10+ seconds per action.

**Solutions:**

1. **Use faster model:**
   ```json
   {
     "model": {
       "name": "gemini-2.5-flash"  // Faster than pro
     }
   }
   ```

2. **Batch operations:**
   ```
   @playwright Navigate to http://localhost:3000
   
   Execute these steps in sequence (don't ask for confirmation between steps):
   1. Click dropdown
   2. Select Binary Search
   3. Click first example
   4. Click Next Step 5 times
   
   Only show me the final state.
   ```

3. **Skip screenshots:**
   ```
   @playwright Test navigation (no screenshots needed unless failure occurs)
   ```

### Issue: Modal Tests Fail

**Symptom:** Can't find prediction or completion modals.

**Solutions:**

1. **Ensure prediction mode is enabled:**
   ```
   @playwright
   1. Click the "⏳ Predict" button to enable prediction mode
   2. Wait for button text to change to "⚡ Watch"
   3. Then navigate steps to trigger modal
   ```

2. **Wait for modal animation:**
   ```
   @playwright
   Navigate to prediction point.
   Wait 500ms for modal fade-in animation.
   Then inspect modal.
   ```

3. **Check modal visibility:**
   ```
   @playwright
   Use browser console to check:
   document.getElementById('prediction-modal')
   
   Should return the modal element (not null).
   ```

---

## Best Practices

### 1. Start Sessions with Context

Always provide context at the start of each testing session:

```
@playwright I'm testing an Algorithm Visualization Platform.

Key Details:
- Frontend: http://localhost:3000 (React)
- Backend: http://localhost:5000 (Flask)
- Algorithms: Binary Search, Interval Coverage
- Features: Step navigation, prediction mode, keyboard shortcuts

Today's focus: Testing prediction mode accuracy tracking.
```

### 2. Use Iterative Refinement

If Gemini's test fails, refine the prompt:

```
Your previous test didn't find the modal. Let me clarify:

The prediction modal only appears when:
1. Prediction mode is enabled (click "⏳ Predict" button)
2. You navigate to a prediction point (marked in trace)
3. The modal has id="prediction-modal"

Please retry with these constraints.
```

### 3. Reference Documentation

Attach relevant docs for context:

```
@playwright 
Reference: @docs/compliance/FRONTEND_CHECKLIST.md

Test ONLY the items marked as LOCKED requirements.
Ignore CONSTRAINED and FREE zones for now.
```

### 4. Save Successful Test Scripts

When Gemini generates good tests, save them:

```
@playwright Your previous test was perfect.

Please save it as a Playwright test file:
File: tests/binary-search-navigation.spec.ts

Include:
- Full TypeScript syntax
- Proper imports
- Descriptive test names
- Assertions
```

### 5. Use Memory for Repeated Tests

Save common test scenarios to Gemini memory:

```
/memory add "Algorithm Visualization Platform Testing:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Always enable prediction mode before testing predictions
- Modal IDs: prediction-modal, completion-modal
- Keyboard shortcuts: →, ←, R, K, C, S"
```

---

## Quick Reference

### Essential Commands

```bash
# Start Gemini CLI
node bundle/gemini.js

# Check MCP server status
/mcp

# View memory
/memory show

# Switch model
/model

# Exit CLI
/quit
```

### Common Test Patterns

**Navigate and Inspect:**
```
@playwright Navigate to http://localhost:3000
Inspect the page structure and report what you see.
```

**Test Specific Feature:**
```
@playwright Test [feature] on http://localhost:3000
Expected behavior: [description]
Report any discrepancies.
```

**Generate Test File:**
```
@playwright Explore [feature], then write a Playwright test file (TypeScript) that validates it.
```

**Compliance Check:**
```
@playwright Validate [checklist] compliance for http://localhost:3000
Reference: @docs/compliance/[CHECKLIST].md
```

---

## Summary

This guide provides a complete framework for testing your Algorithm Visualization Platform using Playwright with Gemini CLI.

**Key Workflows:**
1. **Exploratory Testing** - Use Gemini as AI QA engineer
2. **Test Generation** - Have Gemini write Playwright test files
3. **Compliance Validation** - Automate checklist verification
4. **Performance Benchmarking** - Measure and optimize

**Coverage:**
- ✅ Algorithm discovery and switching
- ✅ Visualization rendering (ArrayView, TimelineView)
- ✅ Step navigation (buttons and keyboard)
- ✅ Prediction mode end-to-end
- ✅ Modal behavior and IDs
- ✅ Overflow patterns
- ✅ Error handling
- ✅ Compliance checklists (Backend, Frontend, QA)

**Next Steps:**
1. Complete environment setup
2. Run first exploratory test
3. Generate test files for core features
4. Integrate into CI/CD pipeline

**Pro Tip:** Start with Scenario 1 (Algorithm Selector Testing) to verify your setup works correctly before moving to complex scenarios.

---

**Ready to start testing?** Run `node bundle/gemini.js` and paste your first test prompt! 🚀
