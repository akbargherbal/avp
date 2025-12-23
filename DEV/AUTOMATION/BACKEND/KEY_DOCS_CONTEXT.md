## Extremely Important (Must Read & Check Against)

1. **BACKEND_CHECKLIST.md** (this document)
   - The active compliance guide you're working through
   - Every checkbox must be verified

2. **backend/algorithms/base_tracer.py**
   - Must import `AlgorithmTracer` class into your script
   - Must call `_add_step()` method in your code
   - Must implement abstract `generate_narrative()` method
   - Direct code dependency

3. **backend/algorithms/registry.py**
   - Must register your algorithm here
   - Must use `get_info()` method in your implementation
   - Direct integration point

4. **WORKFLOW.md** (v2.4)
   - Defines the stage you're in (Stage 1: Backend Implementation)
   - Stage 1.5 FAA audit is blocking requirement
   - Must follow workflow sequence

5. **FAA_PERSONA.md**
   - Must submit narratives here for arithmetic verification
   - Blocking requirement - cannot proceed without FAA approval
   - Direct interaction required

## Very Important (Must Create/Generate)

6. **docs/narratives/[algorithm-name]/** directory
   - You must generate these files for ALL examples
   - Required output of your work
   - Checked in with your PR

7. **docs/algorithm-info/[algorithm-name].md**
   - You must create this file (150-250 words)
   - Required for `get_info()` to work
   - Checked in with your PR

## Moderately Important (Reference for Testing)

8. **Flask endpoint** (`/api/trace/unified`)
   - Use for manual integration testing
   - Verify your trace loads in browser
   - Testing/validation tool

9. **Unit test files**
   - Reference for test patterns
   - Copy test structure for your algorithm
   - Quality assurance

## Less Important (Reference for Understanding)

10. **Example tracer implementations**
    - Read to understand patterns
    - See how others solved similar problems
    - Learning reference only

---

**TL;DR Priority for Implementation:**
1. Read **BACKEND_CHECKLIST.md** + **WORKFLOW.md** to understand requirements
2. Import from **base_tracer.py** and register in **registry.py** (code dependencies)
3. Generate narratives, submit to **FAA_PERSONA.md**, create **algorithm-info** file
4. Test against endpoints and validate with checklist