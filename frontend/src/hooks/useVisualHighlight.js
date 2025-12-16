import { useHighlight } from "../contexts/HighlightContext";

/**
 * @deprecated Use useHighlight() from HighlightContext instead.
 * Kept for backward compatibility during refactor.
 */
export const useVisualHighlight = () => {
  return useHighlight();
};
