import { useState, useCallback, useEffect } from "react";

export const useTraceLoader = () => {
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(null);
  const [availableAlgorithms, setAvailableAlgorithms] = useState([]);

  const BACKEND_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  /**
   * Fetch list of available algorithms from registry.
   * This populates the algorithm selector dynamically.
   */
  const fetchAvailableAlgorithms = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/algorithms`);
      if (!response.ok) {
        console.warn("Failed to fetch algorithm list, using defaults");
        return;
      }
      const algorithms = await response.json();
      setAvailableAlgorithms(algorithms);
    } catch (err) {
      console.warn("Could not fetch algorithms:", err);
      // Non-critical error - app can still work with hardcoded algorithms
    }
  }, [BACKEND_URL]);

  /**
   * Generic trace loader - supports multiple algorithms.
   *
   * Phase 2: Uses unified endpoint for registry-based algorithms,
   * falls back to legacy endpoints for backward compatibility.
   *
   * @param {string} algorithm - Algorithm identifier ('interval-coverage' or 'binary-search')
   * @param {object} inputData - Algorithm-specific input data (already in correct format)
   */
  const loadTrace = useCallback(
    async (algorithm, inputData) => {
      setLoading(true);
      setError(null);
      setTrace(null); // Clear previous trace on new load attempt

      try {
        let endpoint;
        let requestBody;

        // Check if algorithm is in registry (uses unified endpoint)
        const isRegistryAlgorithm = availableAlgorithms.some(
          (alg) => alg.name === algorithm
        );

        if (isRegistryAlgorithm) {
          // Use unified endpoint for registry-based algorithms
          endpoint = `${BACKEND_URL}/trace/unified`;
          requestBody = {
            algorithm: algorithm,
            input: inputData, // Pass input directly - registry provides correct format
          };
        } else if (algorithm === "interval-coverage") {
          // FALLBACK: Legacy endpoint for Interval Coverage
          // Note: interval-coverage IS in registry, but this fallback handles
          // the race condition where availableAlgorithms hasn't loaded yet
          endpoint = `${BACKEND_URL}/trace`;
          requestBody = inputData; // Legacy endpoint expects the input directly
        } else {
          throw new Error(`Unknown algorithm: ${algorithm}`);
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errData = await response
            .json()
            .catch(() => ({ error: "Failed to parse error response" }));
          throw new Error(
            `Backend returned ${response.status}: ${
              errData.error || "Unknown error"
            }`
          );
        }

        const data = await response.json();
        setTrace(data);
        setCurrentAlgorithm(algorithm);
      } catch (err) {
        setError(
          `Backend error: ${err.message}. Please ensure the Flask backend is running on port 5000.`
        );
        console.error("Failed to load trace:", err);
      } finally {
        setLoading(false);
      }
    },
    [BACKEND_URL, availableAlgorithms]
  );

  /**
   * Load interval coverage trace (backward compatible).
   * Wraps raw interval arrays into the expected {intervals: [...]} format.
   */
  const loadIntervalTrace = useCallback(
    (intervals) => {
      // Wrap raw intervals array into expected format for unified endpoint
      return loadTrace("interval-coverage", { intervals: intervals });
    },
    [loadTrace]
  );

  /**
   * Load binary search trace.
   * Uses unified endpoint via registry.
   */
  const loadBinarySearchTrace = useCallback(
    (array, target) => {
      return loadTrace("binary-search", { array, target });
    },
    [loadTrace]
  );

  /**
   * Switch to a different algorithm and load its first example.
   *
   * ✅ FIXED: This is the PRIMARY way to load traces - uses backend examples.
   * Frontend never generates data, only requests it from backend.
   *
   * @param {string} algorithmName - Name of algorithm to switch to
   */
  const switchAlgorithm = useCallback(
    async (algorithmName) => {
      // Find the algorithm metadata
      const algorithm = availableAlgorithms.find(
        (alg) => alg.name === algorithmName
      );

      if (!algorithm) {
        console.error(`Algorithm '${algorithmName}' not found in registry`);
        setError(`Algorithm '${algorithmName}' not found`);
        return;
      }

      // Check if algorithm has examples
      if (!algorithm.example_inputs || algorithm.example_inputs.length === 0) {
        console.error(`Algorithm '${algorithmName}' has no example inputs`);
        setError(`No examples available for ${algorithm.display_name}`);
        return;
      }

      // Get first example - the input is already in correct format from registry
      const firstExample = algorithm.example_inputs[0];
      const exampleInput = firstExample.input;

      // Load trace with this example (input is already correctly formatted)
      await loadTrace(algorithmName, exampleInput);
    },
    [availableAlgorithms, loadTrace]
  );

  // Fetch available algorithms on mount
  useEffect(() => {
    fetchAvailableAlgorithms();
  }, [fetchAvailableAlgorithms]);

  // ✅ FIXED: Initial load now uses backend examples instead of hardcoded frontend data
  // Wait for algorithms to load, then switch to first algorithm (which loads its first example)
  useEffect(() => {
    if (availableAlgorithms.length > 0 && !currentAlgorithm) {
      // Load the first available algorithm's first example
      // This could be 'interval-coverage' or 'binary-search' depending on registration order
      const firstAlgorithm = availableAlgorithms[0];
      switchAlgorithm(firstAlgorithm.name);
    }
  }, [availableAlgorithms, currentAlgorithm, switchAlgorithm]);

  return {
    trace,
    loading,
    error,
    currentAlgorithm,
    availableAlgorithms, // List of algorithms from registry
    // Generic loader
    loadTrace,
    // Algorithm-specific loaders (backward compatible, but deprecated)
    loadIntervalTrace,
    loadBinarySearchTrace,
    // ✅ PRIMARY METHOD: Algorithm switcher handler (uses backend examples)
    switchAlgorithm,
    // Utility
    fetchAvailableAlgorithms,
    setTrace,
  };
};
