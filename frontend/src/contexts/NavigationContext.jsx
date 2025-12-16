import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useTrace } from "./TraceContext";

const NavigationContext = createContext(null);

export const NavigationProvider = ({ children }) => {
  const { trace } = useTrace();
  const [currentStep, setCurrentStep] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  const totalSteps = trace?.trace?.steps?.length || 0;

  // Reset state when trace changes
  useEffect(() => {
    setCurrentStep(0);
    setShowCompletionModal(false);
  }, [trace]);

  const isViewingFinalStep = useMemo(
    () => currentStep === totalSteps - 1 && totalSteps > 0,
    [currentStep, totalSteps]
  );

  const nextStep = useCallback(() => {
    if (isViewingFinalStep) {
      setShowCompletionModal(true);
      return;
    }
    if (totalSteps > 0 && currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [totalSteps, currentStep, isViewingFinalStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const jumpToEnd = useCallback(() => {
    if (totalSteps > 0) {
      setCurrentStep(totalSteps - 1);
      setShowCompletionModal(false);
    }
  }, [totalSteps]);

  const resetTrace = useCallback(() => {
    setCurrentStep(0);
    setShowCompletionModal(false);
  }, []);

  const closeCompletionModal = useCallback(() => {
    setShowCompletionModal(false);
  }, []);

  const currentStepData = useMemo(
    () => trace?.trace?.steps?.[currentStep],
    [trace, currentStep]
  );

  const isComplete = currentStepData?.type === "ALGORITHM_COMPLETE";

  const value = {
    currentStep,
    currentStepData,
    totalSteps,
    nextStep,
    prevStep,
    resetTrace,
    jumpToEnd,
    isComplete,
    setCurrentStep,
    showCompletionModal,
    setShowCompletionModal,
    closeCompletionModal,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

