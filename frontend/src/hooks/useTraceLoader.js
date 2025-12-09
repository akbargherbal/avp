import { useState, useCallback, useEffect } from "react";

export const useTraceLoader = () => {
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const loadTrace = useCallback(
    async (intervals) => {
      setLoading(true);
      setError(null);
      setTrace(null); // Clear previous trace on new load attempt

      try {
        const response = await fetch(`${BACKEND_URL}/trace`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ intervals }),
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
      } catch (err) {
        setError(
          `Backend error: ${err.message}. Please ensure the Flask backend is running on port 5000.`
        );
        console.error("Failed to load trace:", err);
      } finally {
        setLoading(false);
      }
    },
    [BACKEND_URL]
  );

  const loadExampleTrace = useCallback(() => {
    loadTrace([
      { id: 1, start: 540, end: 660, color: "blue" },
      { id: 2, start: 600, end: 720, color: "green" },
      { id: 3, start: 540, end: 720, color: "amber" },
      { id: 4, start: 900, end: 960, color: "purple" },
    ]);
  }, [loadTrace]);

  // Initial load effect (replaces useEffect in App.jsx)
  useEffect(() => {
    loadExampleTrace();
  }, [loadExampleTrace]);

  return { trace, loading, error, loadTrace, loadExampleTrace, setTrace };
};
