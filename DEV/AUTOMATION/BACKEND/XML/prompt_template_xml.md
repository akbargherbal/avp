# Backend Tracer Generation - User Prompt Template

## 1. Task Definition
Generate the Stage 1 Backend Artifacts for the following algorithm.

**Target Algorithm:** `{{ALGORITHM_NAME}}`  
**Visualization Type:** `{{VISUALIZATION_TYPE}}`

**OUTPUT FORMAT: You MUST respond with ONLY valid XML. Start immediately with `<?xml version="1.0" encoding="UTF-8"?>` - no text before it.**

## 2. Input Specification
```json
{{ALGORITHM_SPECIFICATION_JSON}}
```

## 3. Context & Reference Materials

### A. Base Class (Immutable)
*Inherit from this class. Do not modify it.*
```python
{{BASE_TRACER_CODE}}
```

### B. Compliance Checklist (Locked Requirements)
*Strictly adhere to the LOCKED and CONSTRAINED sections.*
```markdown
{{BACKEND_CHECKLIST_EXCERPT}}
```

### C. Visualization Contract
*Ensure `data.visualization` matches this structure exactly.*
```markdown
{{VISUALIZATION_CONTRACT}}
```

### D. Reference Implementation (Few-Shot Example)
*Follow the patterns in this working tracer.*
```python
{{EXAMPLE_TRACER_CODE}}
```

### E. FAA Audit Criteria
*Ensure the narrative passes these arithmetic checks.*
```markdown
{{FAA_AUDIT_GUIDE}}
```

## 4. Generate These Files

1. **`{{ALGORITHM_NAME_KEBAB}}_tracer.py`** - Complete tracer class implementation
2. **`test_{{ALGORITHM_NAME_KEBAB}}_tracer.py`** - Unit tests with edge cases  
3. **`docs/algorithm-info/{{ALGORITHM_NAME_KEBAB}}.md`** - Educational documentation (150-250 words)

**Requirements:**
- Inherit from `AlgorithmTracer`
- Use `_add_step()` and `_build_trace_result()` helpers
- Maximum 3 choices per prediction question
- Narrative must show ALL decision data with actual values
- Fail loudly (KeyError) if visualization data is missing
- All code must be complete and functional (no TODOs)

**Output as XML with CDATA:**
- Wrap all code in `<![CDATA[...]]>` sections
- No escaping needed inside CDATA
- Order: tracer → tests → documentation

**Begin generation - output XML only:**