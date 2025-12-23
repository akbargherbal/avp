## Required Documents/Scripts

1. **`base_tracer.py`** - The immutable base class that all tracers inherit from
   - Must include the complete `AlgorithmTracer` abstract base class
   - Should have all helper methods (`_add_step()`, `_build_trace_result()`, `_get_visualization_state()`)

2. **Algorithm Specifications (10 files)** - JSON format for each algorithm
   - Input/output specification
   - Edge cases to handle
   - Expected behavior description
   - Any algorithm-specific constraints

3. **Backend Compliance Checklist** - Markdown excerpt
   - LOCKED requirements section
   - CONSTRAINED requirements section
   - FREE zones documentation

4. **Visualization Contracts (4 files)** - One per visualization type
   - `array-visualization-contract.md` - Structure for array-based visualizations
   - `timeline-visualization-contract.md` - Structure for timeline visualizations
   - `graph-visualization-contract.md` - Structure for graph visualizations
   - `tree-visualization-contract.md` - Structure for tree visualizations

5. **Reference Implementation(s)** - Working example tracer(s)
   - At least one complete, production-ready tracer per visualization type
   - Should demonstrate best practices
   - Must pass all quality standards

6. **FAA Audit Guide** - Markdown document
   - Arithmetic verification criteria
   - Good/bad narrative examples
   - Decision data requirements
   - Common narrative anti-patterns

7. **Prompt Assembly Script** - Python script to generate final prompts
   - Reads template from `prompt_template_xml.md`
   - Substitutes placeholders with actual content
   - Generates 10 algorithm-specific prompts

8. **Algorithm Metadata File** - JSON/CSV listing all 10 algorithms
   - Algorithm name (display name)
   - Kebab-case identifier
   - Visualization type
   - Path to specification file
   - Any special notes

9. **Output Validation Script** - Python script to verify XML output
   - Parse XML response
   - Validate file structure
   - Check CDATA sections
   - Verify required files are present

10. **API Integration Script** - Python script to send prompts to LLM
    - Load system prompt
    - Load assembled user prompts
    - Handle API calls with retry logic
    - Save responses to appropriate directories
    - Log successes/failures

## Optional But Recommended

11. **Test Data Fixtures** - Sample inputs for each algorithm
    - Typical cases
    - Edge cases
    - Expected outputs

12. **Response Post-Processor** - Script to extract files from XML
    - Parse XML response
    - Extract CDATA content
    - Write files to correct directory structure
    - Generate summary report

Would you like me to help you create any of these specific files or scripts?