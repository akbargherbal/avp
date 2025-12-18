## 📧 **Email: Backend Narrative Standards Update - Action Required**

**Subject:** Action Required: Update Your Algorithm Narratives to Backend Checklist v2.2 Standards

**From:** PM Team  
**To:** Backend Development Team  
**Priority:** Normal  
**Estimated Impact:** 30-45 minutes per algorithm

---

### **What's Changing**

We've updated the **Backend Checklist v2.2** with two important enhancements based on recent quality reviews:

1. **Result Field Traceability** - Prevent narrative gaps where final results contain "surprise" data
2. **Frontend Visualization Guidance** - Help frontend team with backend insights for better visualizations

### **Why This Matters**

**Problem Identified:** Recent narrative reviews found cases where final results contained fields (like `winning_position: 6`) that were never explained during the algorithm execution, creating confusion for readers.

**Solution:** Two lightweight checks to ensure narrative completeness and knowledge transfer to frontend.

### **Action Required**

**For Each Algorithm You Own:**

1. **Review your existing narratives** against the updated checklist
2. **Check result field traceability** - ensure every field in your `result` object appears in the narrative
3. **Add visualization hints section** at the end of your narratives
4. **Regenerate narrative files** if updates needed

**Time Estimate:** 15-20 minutes per narrative (most may already pass)

### **New Requirements Overview**

#### **Result Field Traceability**

```python
# Example: If your result contains this...
result = {
    "max_sum": 14,
    "winning_window": [1, 6, 7],
    "window_start_index": 6  # ← This needs narrative context
}

# Your narrative must explain when/why you tracked the index
# "We remember this position (6) since it achieved our best result"
```

#### **Frontend Visualization Hints**

```markdown
## 🎨 Frontend Visualization Hints

### Primary Metrics to Emphasize

- **Current Sum** (`metrics.current_sum`) - Shows real-time algorithm state
- **Max Sum** (`metrics.max_sum`) - Shows progress toward optimal solution

### Visualization Priorities

1. **Highlight active window** - `state: 'in_window'` elements are primary focus
2. **Show sum transitions** - Emphasize when `max_sum` updates

### Key JSON Paths
```

step.data.visualization.metrics.current_sum
step.data.visualization.metrics.max_sum

```

### Algorithm-Specific Guidance
This algorithm's efficiency comes from reusing previous sums - consider animating the "add new, remove old" operation.
```

### **Self-Check Process**

**Quick Validation:**

1. Hide your `result` JSON
2. Read your narrative as a first-time learner
3. Try to predict what the complete result object contains
4. Any surprise fields = missing narrative context

### **Resources**

- **Updated Checklist:** `docs/compliance/BACKEND_CHECKLIST.md` v2.2
- **FAA Audit Process:** Unchanged - arithmetic verification still applies
- **Examples:** See sliding-window narrative for visualization hints template

### **Timeline**

- **Review Period:** Next 2 weeks
- **Update Narratives:** As you work on algorithms naturally
- **No Rush:** These are quality improvements, not urgent fixes

### **Questions?**

This is about making our narratives more complete and helpful - the technical requirements haven't changed. The new checks are lightweight and most of your narratives likely already pass.

**Contact:** PM team for process questions, FAA auditor for arithmetic verification

### **Appreciation**

Your narrative quality has been excellent - these additions will make them even more valuable for both QA review and frontend development.

Thanks for maintaining the high standards that make this platform educational and reliable.

---

**Best regards,**  
**ActionPlan PM**  
_Algorithm Visualization Platform_

---

_P.S. The human-readable style you've developed is fantastic - keep that approach. These new requirements are about completeness, not changing your clear writing style._
