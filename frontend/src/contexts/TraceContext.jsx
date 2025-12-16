import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const TraceContext = createContext(null);

export const TraceProvider = ({ children }) => {
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(null);
  const [availableAlgorithms, setAvailableAlgorithms] = useState([]);

  const BACKEND_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  /**
   * Fetch list of available algorithms from registry.
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
    }
  }, [BACKEND_URL]);

  /**
   * Generic trace loader
   */
  const loadTrace = useCallback(
    async (algorithm, inputData) => {
      setLoading(true);
      setError(null);
      setTrace(null);

      try {
        let endpoint;
        let requestBody;

        const isRegistryAlgorithm = availableAlgorithms.some(
          (alg) => alg.name === algorithm
        );

        if (isRegistryAlgorithm) {
          endpoint = `${BACKEND_URL}/trace/unified`;
          requestBody = {
            algorithm: algorithm,
            input: inputData,
          };
        } else if (algorithm === "interval-coverage") {
          endpoint = `${BACKEND_URL}/trace`;
          requestBody = inputData;
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
   * Load interval coverage trace (backward compatible)
   */
  const loadIntervalTrace = useCallback(
    (intervals) => {
      return loadTrace("interval-coverage", { intervals: intervals });
    },
    [loadTrace]
  );

  /**
   * Load binary search trace (backward compatible)
   */
  const loadBinarySearchTrace = useCallback(
    (array, target) => {
      return loadTrace("binary-search", { array, target });
    },
    [loadTrace]
  );

  /**
   * Switch to a different algorithm and load its first example.
   */
  const switchAlgorithm = useCallback(
    async (algorithmName) => {
      const algorithm = availableAlgorithms.find(
        (alg) => alg.name === algorithmName
      );

      if (!algorithm) {
        console.error(`Algorithm '${algorithmName}' not found in registry`);
        setError(`Algorithm '${algorithmName}' not found`);
        return;
      }

      if (!algorithm.example_inputs || algorithm.example_inputs.length === 0) {
        console.error(`Algorithm '${algorithmName}' has no example inputs`);
        setError(`No examples available for ${algorithm.display_name}`);
        return;
      }

      const firstExample = algorithm.example_inputs[0];
      const exampleInput = firstExample.input;

      await loadTrace(algorithmName, exampleInput);
    },
    [availableAlgorithms, loadTrace]
  );

  // Fetch available algorithms on mount
  useEffect(() => {
    fetchAvailableAlgorithms();
  }, [fetchAvailableAlgorithms]);

  // Initial load
  useEffect(() => {
    if (availableAlgorithms.length > 0 && !currentAlgorithm) {
      const firstAlgorithm = availableAlgorithms[0];
      switchAlgorithm(firstAlgorithm.name);
    }
  }, [availableAlgorithms, currentAlgorithm, switchAlgorithm]);

  const value = {
    trace,
    loading,
    error,
    currentAlgorithm,
    availableAlgorithms,
    loadTrace,
    loadIntervalTrace,
    loadBinarySearchTrace,
    switchAlgorithm,
    fetchAvailableAlgorithms,
    setTrace,
  };

  return (
    <TraceContext.Provider value={value}>{children}</TraceContext.Provider>
  );
};

export const useTrace = () => {
  const context = useContext(TraceContext);
  if (!context) {
    throw new Error("useTrace must be used within a TraceProvider");
  }
  return context;
};
