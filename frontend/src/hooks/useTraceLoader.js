import { useTrace } from "../contexts/TraceContext";

/**
 * @deprecated Use useTrace() from TraceContext instead.
 * Kept for backward compatibility during refactor.
 */
export const useTraceLoader = () => {
  return useTrace();
};

