# Backend Test Plan - Next 3-5 Sessions

**Project:** Algorithm Visualization Platform  
**Target Coverage:** ≥90%  
**Estimated Time:** 15-25 hours (3-5 sessions)

---

## Session Overview

### Session 26: Foundation Setup + Base Tracer Tests
**Goal:** Set up testing infrastructure and test the foundation class  
**Duration:** ~5 hours

**Tasks:**
1. Create test infrastructure
   - `requirements-dev.txt` with pytest dependencies
   - `pytest.ini` configuration
   - `.coveragerc` configuration
   - Directory structure: `backend/algorithms/tests/`

2. Write `test_base_tracer.py` (Target: 95% coverage)
   - Test abstract method enforcement
   - Test `_add_step()` mechanics (step count, MAX_STEPS)
   - Test `_get_visualization_state()` hook
   - Test `_serialize_value()` (infinity handling)
   - Test `_build_trace_result()` structure
   - Test trace timing

3. Write `conftest.py` with shared fixtures

**Success Criteria:**
- [ ] All config files in place
- [ ] pytest runs successfully
- [ ] base_tracer.py coverage ≥95%

---

### Session 27: Registry Tests
**Goal:** Verify algorithm registration system  
**Duration:** ~3 hours

**Tasks:**
1. Write `test_registry.py` (Target: 95% coverage)
   - Test valid registration
   - Test invalid registration (wrong class type, duplicates)
   - Test retrieval (get, get with unknown key)
   - Test listing (list_algorithms, get_metadata)
   - Test metadata exclusion (tracer_class not exposed)

**Success Criteria:**
- [ ] registry.py coverage ≥95%
- [ ] All edge cases covered (errors, duplicates)

---

### Session 28: Binary Search Algorithm Tests
**Goal:** Comprehensive testing of reference implementation  
**Duration:** ~5 hours

**Tasks:**
1. Write `test_binary_search.py` (Target: 90% coverage)
   - **Correctness Tests:** Found/not found cases, boundary elements
   - **Trace Structure Tests:** Initial state, final states, step types
   - **Visualization Tests:** Element states, pointers, found marker
   - **Prediction Tests:** Point generation, structure, correct answers
   - **Edge Cases:** Empty array, unsorted, missing keys, single element
   - **Metadata Tests:** Required fields, config structure

2. Use parameterized tests for multiple scenarios

**Success Criteria:**
- [ ] binary_search.py coverage ≥90%
- [ ] All 6 test categories passing
- [ ] Edge cases handled correctly

---

### Session 29: Interval Coverage Algorithm Tests
**Goal:** Test the original algorithm  
**Duration:** ~4 hours

**Tasks:**
1. Review interval_coverage.py implementation
   - **Ask for:** `cat backend/algorithms/interval_coverage.py`
   - Understand interval merging logic
   - Identify prediction points

2. Write `test_interval_coverage.py` (Target: 90% coverage)
   - **Correctness Tests:** Full coverage, partial coverage, no coverage
   - **Trace Structure Tests:** Step sequence validation
   - **Visualization Tests:** Interval states, coverage display
   - **Prediction Tests:** Merge decisions
   - **Edge Cases:** Empty intervals, single interval, overlapping

**Success Criteria:**
- [ ] interval_coverage.py coverage ≥90%
- [ ] Algorithm correctness verified

---

### Session 30: API Integration Tests
**Goal:** Test Flask endpoints and contracts  
**Duration:** ~5 hours

**Tasks:**
1. Create `backend/tests/` directory

2. Write `test_api_health.py`
   - Test `/health` endpoint
   - Test `/algorithms` listing endpoint

3. Write `test_api_trace_unified.py`
   - Test `/trace` endpoint for each algorithm
   - Test request/response contracts
   - Test error handling (invalid algorithm, bad input)

4. Write `test_api_algorithms.py`
   - Test algorithm metadata retrieval
   - Test frontend compliance (all required fields)

5. Run full coverage report
   - Verify ≥90% overall coverage
   - Generate HTML coverage report
   - Identify any gaps

**Success Criteria:**
- [ ] app.py coverage ≥85%
- [ ] All API contracts tested
- [ ] **Overall backend coverage ≥90%**

---

## Session-by-Session Checklist

### Before Each Session
```bash
# Activate environment
cd backend
source .venv/bin/activate  # or: source venv/bin/activate

# Pull latest changes
git pull origin main
```

### During Each Session
```bash
# Run tests continuously
pytest -v

# Check coverage for specific file
pytest --cov=algorithms/binary_search --cov-report=term-missing

# Run specific test class
pytest algorithms/tests/test_binary_search.py::TestBinarySearchCorrectness -v
```

### After Each Session
```bash
# Run full coverage
pytest --cov=. --cov-report=html --cov-report=term-missing

# Review HTML report
firefox htmlcov/index.html  # or: open htmlcov/index.html

# Commit progress
git add .
git commit -m "test: session X - [component] tests (coverage: Y%)"
```

---

## Files to Request Per Session

### Session 26 (Foundation)
```bash
cat backend/algorithms/base_tracer.py
```

### Session 27 (Registry)
```bash
cat backend/algorithms/registry.py
cat backend/algorithms/__init__.py
```

### Session 28 (Binary Search)
*Already have binary_search.py from this session*

### Session 29 (Interval Coverage)
```bash
cat backend/algorithms/interval_coverage.py
```

### Session 30 (API)
```bash
cat backend/app.py
cat backend/requirements.txt
```

---

## Quick Reference: Pytest Markers

Use these to categorize and run specific test groups:

```bash
# Run only unit tests
pytest -m unit

# Run only edge case tests
pytest -m edge_case

# Run only compliance tests
pytest -m compliance

# Skip slow tests
pytest -m "not slow"
```

**Markers to use:**
- `@pytest.mark.unit` - Unit tests for components
- `@pytest.mark.integration` - API/integration tests
- `@pytest.mark.edge_case` - Edge cases and boundaries
- `@pytest.mark.compliance` - Frontend contract compliance
- `@pytest.mark.slow` - Tests taking >1 second

---

## Coverage Targets Summary

| Component | Target | Priority | Session |
|-----------|--------|----------|---------|
| `base_tracer.py` | 95% | CRITICAL | 26 |
| `registry.py` | 95% | CRITICAL | 27 |
| `binary_search.py` | 90% | HIGH | 28 |
| `interval_coverage.py` | 90% | HIGH | 29 |
| `app.py` | 85% | MEDIUM | 30 |
| **OVERALL** | **≥90%** | **CRITICAL** | **30** |

---

## Definition of Done

**After Session 30, you should have:**

✅ Complete test suite with ≥90% coverage  
✅ All components tested (base → registry → algorithms → API)  
✅ HTML coverage report showing gaps  
✅ All edge cases covered  
✅ All frontend contracts verified  
✅ CI/CD ready (tests can run in pipeline)  
✅ Documentation of any discovered limitations  

**Deliverables:**
- `backend/algorithms/tests/` with all test files
- `backend/tests/` with API tests
- `requirements-dev.txt`
- `pytest.ini` and `.coveragerc`
- Coverage report (HTML + terminal)
- Test execution summary

---

## Common Issues & Solutions

**Issue:** Tests discovering algorithms at import time  
**Solution:** Use fixtures that control registry state

**Issue:** Trace object not JSON-serializable  
**Solution:** Test uses `_build_trace_result()` output, not raw trace

**Issue:** Visualization state varies by step  
**Solution:** Test specific step indices, not just any step

**Issue:** Prediction points depend on execution path  
**Solution:** Use parameterized tests for different paths

---

**Next Session:** Session 26 - Foundation Setup + Base Tracer Tests  
**Estimated Start:** When you're ready to begin testing implementation
