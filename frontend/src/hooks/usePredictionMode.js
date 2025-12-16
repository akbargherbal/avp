import { usePrediction } from "../contexts/PredictionContext";

/**
 * @deprecated Use usePrediction() from PredictionContext instead.
 * Kept for backward compatibility during refactor.
 */
export const usePredictionMode = () => {
  return usePrediction();
};

