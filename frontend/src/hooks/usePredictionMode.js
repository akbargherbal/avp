import { useState, useCallback, useEffect } from "react";
import { isPredictionPoint } from "../utils/predictionUtils";

export const usePredictionMode = (trace, currentStep, nextStep) => {
  const [predictionMode, setPredictionMode] = useState(true);
  const [showPrediction, setShowPrediction] = useState(false);
  const [predictionStats, setPredictionStats] = useState({
    total: 0,
    correct: 0,
  });

  const currentStepData = trace?.trace?.steps?.[currentStep];
  const nextStepData = trace?.trace?.steps?.[currentStep + 1];

  // Auto-detect prediction points (replaces Effect 3 in App.jsx)
  useEffect(() => {
    if (!trace || !predictionMode) {
      setShowPrediction(false);
      return;
    }

    if (isPredictionPoint(currentStepData) && nextStepData?.type === "DECISION_MADE") {
      setShowPrediction(true);
    } else {
      setShowPrediction(false);
    }
  }, [currentStep, trace, predictionMode, currentStepData, nextStepData]);

  const handlePredictionAnswer = useCallback((isCorrect) => {
    setPredictionStats((prev) => ({
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
    }));
    setShowPrediction(false);
    nextStep(); // Advance step after answering
  }, [nextStep]);

  const handlePredictionSkip = useCallback(() => {
    setShowPrediction(false);
    nextStep(); // Advance step after skipping
  }, [nextStep]);

  const togglePredictionMode = useCallback(() => {
    setPredictionMode((prev) => !prev);
    setShowPrediction(false);
  }, []);

  const resetPredictionStats = useCallback(() => {
    setPredictionStats({ total: 0, correct: 0 });
  }, []);

  return {
    predictionMode,
    showPrediction,
    predictionStats,
    togglePredictionMode,
    handlePredictionAnswer,
    handlePredictionSkip,
    resetPredictionStats,
  };
};
