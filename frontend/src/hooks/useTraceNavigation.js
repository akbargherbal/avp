import { useNavigation } from "../contexts/NavigationContext";

/**
 * @deprecated Use useNavigation() from NavigationContext instead.
 * Kept for backward compatibility during refactor.
 */
export const useTraceNavigation = () => {
  return useNavigation();
};

