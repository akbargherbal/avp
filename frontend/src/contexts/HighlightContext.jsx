import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useTrace } from "./TraceContext";
import { useNavigation } from "./NavigationContext";

const HighlightContext = createContext(null);

export const HighlightProvider = ({ children }) => {
  const { trace } = useTrace();
  const { currentStep } = useNavigation();

  const [highlightedIntervalId, setHighlightedIntervalId] = useState(null);
  const [hoverIntervalId, setHoverIntervalId] = useState(null);

  // Effect: Extract highlighted interval from active call stack entry
  useEffect(() => {
    if (!trace) {
      setHighlightedIntervalId(null);
      return;
    }

    const step = trace?.trace?.steps?.[currentStep];
    const callStack = step?.data?.call_stack_state || [];

    // Get the active call (last in stack)
    const activeCall = callStack[callStack.length - 1];

    if (activeCall?.current_interval?.id !== undefined) {
      setHighlightedIntervalId(activeCall.current_interval.id);
    } else {
      setHighlightedIntervalId(null);
    }
  }, [currentStep, trace]);

  // Handler: Handle hover interactions
  const handleIntervalHover = useCallback((intervalId) => {
    setHoverIntervalId(intervalId);
  }, []);

  // Derived state: Use hover ID if available, otherwise use step-based highlight
  const effectiveHighlight =
    hoverIntervalId !== null ? hoverIntervalId : highlightedIntervalId;

  const value = {
    effectiveHighlight,
    handleIntervalHover,
  };

  return (
    <HighlightContext.Provider value={value}>
      {children}
    </HighlightContext.Provider>
  );
};

export const useVisualHighlight = () => {
  const context = useContext(HighlightContext);
  if (!context) {
    throw new Error(
      "useVisualHighlight must be used within a HighlightProvider"
    );
  }
  return context;
};
