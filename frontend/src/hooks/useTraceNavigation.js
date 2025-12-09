import { useState, useCallback, useMemo } from "react";

export const useTraceNavigation = (trace, resetPredictionStats) => {
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = trace?.trace?.steps?.length || 0;

  const nextStep = useCallback(() => {
    if (totalSteps > 0 && currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [totalSteps, currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const jumpToEnd = useCallback(() => {
    if (totalSteps > 0) {
      setCurrentStep(totalSteps - 1);
    }
  }, [totalSteps]);

  const resetTrace = useCallback(() => {
    setCurrentStep(0);
    // We pass the prediction reset function from App.jsx to ensure state synchronization
    if (resetPredictionStats) {
      resetPredictionStats();
    }
  }, [resetPredictionStats]);

  const currentStepData = useMemo(
    () => trace?.trace?.steps?.[currentStep],
    [trace, currentStep]
  );

  const isComplete = currentStepData?.type === "ALGORITHM_COMPLETE";

  return {
    currentStep,
    currentStepData,
    totalSteps,
    nextStep,
    prevStep,
    resetTrace,
    jumpToEnd,
    isComplete,
    setCurrentStep, // Exposed for keyboard shortcuts/prediction logic
  };
};
