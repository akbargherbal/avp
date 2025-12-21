// frontend/src/contexts/PredictionContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useTrace } from "./TraceContext";
import { useNavigation } from "./NavigationContext";

const PredictionContext = createContext(null);

export const PredictionProvider = ({ children }) => {
  const { trace } = useTrace();
  const { setCurrentStep } = useNavigation();

  const [predictionMode, setPredictionMode] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [activePrediction, setActivePrediction] = useState(null);
  const [predictionStats, setPredictionStats] = useState({
    total: 0,
    correct: 0,
  });

  // Memoize prediction points to prevent unstable dependency in activatePredictionForStep
  const predictionPoints = useMemo(
    () => trace?.metadata?.prediction_points || [],
    [trace],
  );

  // Reset stats when trace changes
  useEffect(() => {
    setPredictionStats({ total: 0, correct: 0 });
    setShowPrediction(false);
    setActivePrediction(null);
  }, [trace]);

  const activatePredictionForStep = useCallback(
    (stepIndex) => {
      if (!predictionMode || !predictionPoints.length) {
        return false;
      }
      const matchingPrediction = predictionPoints.find(
        (p) => p.step_index === stepIndex,
      );
      if (matchingPrediction) {
        setActivePrediction(matchingPrediction);
        setShowPrediction(true);
        return true;
      }
      return false;
    },
    [predictionPoints, predictionMode],
  );

  const handlePredictionAnswer = useCallback(
    (userAnswer) => {
      if (!activePrediction) return;

      if (typeof activePrediction.step_index !== "number") {
        console.error(
          "Prediction point is missing a valid 'step_index'. Cannot advance step.",
          activePrediction,
        );
        setShowPrediction(false);
        setActivePrediction(null);
        return;
      }

      const isCorrect = userAnswer === activePrediction.correct_answer;
      const targetStep = activePrediction.step_index;
      setPredictionStats((prev) => ({
        total: prev.total + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
      }));
      setShowPrediction(false);
      setActivePrediction(null);
      setCurrentStep(targetStep);
    },
    [activePrediction, setCurrentStep],
  );

  const handlePredictionSkip = useCallback(() => {
    if (!activePrediction) {
      // If no active prediction but modal is open (edge case), just close it
      if (showPrediction) setShowPrediction(false);
      return;
    }

    if (typeof activePrediction.step_index !== "number") {
      console.error(
        "Prediction point is missing a valid 'step_index'. Cannot skip step.",
        activePrediction,
      );
      setShowPrediction(false);
      setActivePrediction(null);
      return;
    }

    const targetStep = activePrediction.step_index;
    setShowPrediction(false);
    setActivePrediction(null);
    setCurrentStep(targetStep);
  }, [activePrediction, showPrediction, setCurrentStep]);

  const togglePredictionMode = useCallback(() => {
    setPredictionMode((prev) => !prev);
    setShowPrediction(false);
    setActivePrediction(null);
  }, []);

  const resetPredictionStats = useCallback(() => {
    setPredictionStats({ total: 0, correct: 0 });
  }, []);

  const value = {
    predictionMode,
    showPrediction,
    activePrediction,
    predictionStats,
    togglePredictionMode,
    handlePredictionAnswer,
    handlePredictionSkip,
    resetPredictionStats,
    activatePredictionForStep,
  };

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error("usePrediction must be used within a PredictionProvider");
  }
  return context;
};
