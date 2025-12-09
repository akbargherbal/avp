import { useState, useCallback, useEffect } from "react";

export const useVisualHighlight = (trace, currentStep) => {
  const [highlightedIntervalId, setHighlightedIntervalId] = useState(null);
  const [hoverIntervalId, setHoverIntervalId] = useState(null);

  // Effect: Extract highlighted interval from active call stack entry (replaces Effect 2 in App.jsx)
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

  return {
    effectiveHighlight,
    handleIntervalHover,
  };
};
