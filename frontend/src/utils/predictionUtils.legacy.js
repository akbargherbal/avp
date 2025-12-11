// frontend/src/utils/predictionUtils.legacy.js
/**
 * LEGACY - Interval Coverage-Specific Prediction Utilities
 * 
 * ⚠️ ARCHIVED: These functions are specific to Interval Coverage algorithm.
 * Kept for reference only. New prediction mode uses metadata-driven approach.
 * 
 * @deprecated Use trace.metadata.prediction_points instead
 */

/**
 * Check if a step is a prediction point (decision moment)
 * @deprecated Interval Coverage specific
 */
export const isPredictionPoint = (step) => {
  return step?.type === 'EXAMINING_INTERVAL' &&
         step?.data?.interval &&
         step?.data?.comparison;
};

/**
 * Extract prediction data from an EXAMINING_INTERVAL step
 * @deprecated Interval Coverage specific
 */
export const getPredictionData = (step) => {
  if (!isPredictionPoint(step)) {
    return null;
  }

  const interval = step.data.interval;
  const maxEnd = step.data.max_end;
  const comparison = step.data.comparison;

  return {
    interval,
    maxEnd,
    comparison,
    intervalEnd: interval.end,
    maxEndValue: maxEnd === null ? -Infinity : maxEnd,
  };
};

/**
 * Get the correct answer for a prediction point
 * @deprecated Interval Coverage specific
 */
export const getCorrectAnswer = (step, nextStep) => {
  if (!isPredictionPoint(step)) {
    return null;
  }

  if (nextStep?.type !== 'DECISION_MADE') {
    console.warn('Expected DECISION_MADE step after EXAMINING_INTERVAL');
    return null;
  }

  return nextStep.data.decision; // "keep" or "covered"
};

/**
 * Calculate if user's prediction was correct
 * @deprecated Use activePrediction.correct_answer === userAnswer
 */
export const isPredictionCorrect = (userAnswer, correctAnswer) => {
  return userAnswer === correctAnswer;
};

/**
 * Get encouraging feedback based on accuracy percentage
 * NOTE: This is still useful and algorithm-agnostic
 */
export const getAccuracyFeedback = (accuracy) => {
  if (accuracy >= 90) {
    return {
      message: "🎉 Excellent! You've mastered this algorithm!",
      color: "emerald",
      emoji: "🎉"
    };
  } else if (accuracy >= 70) {
    return {
      message: "👍 Great job! You understand the core logic.",
      color: "emerald",
      emoji: "👍"
    };
  } else if (accuracy >= 50) {
    return {
      message: "📚 Good start! Keep practicing to improve.",
      color: "amber",
      emoji: "📚"
    };
  } else {
    return {
      message: "💡 Keep practicing! Try the step-by-step mode to understand each decision.",
      color: "red",
      emoji: "💡"
    };
  }
};

/**
 * Get hint text for a prediction point
 * @deprecated Interval Coverage specific
 */
export const getHintText = (predictionData) => {
  const { intervalEnd, maxEndValue } = predictionData;

  if (maxEndValue === -Infinity) {
    return `Hint: This is the first interval (max_end = -∞). Will it extend coverage?`;
  }

  return `Hint: Compare interval.end (${intervalEnd}) with max_end (${maxEndValue})`;
};

/**
 * Get explanation for the correct answer
 * @deprecated Interval Coverage specific
 */
export const getExplanation = (correctAnswer, predictionData) => {
  const { intervalEnd, maxEndValue } = predictionData;

  if (correctAnswer === "keep") {
    if (maxEndValue === -Infinity) {
      return `✓ KEEP: First interval always extends coverage (${intervalEnd} > -∞)`;
    }
    return `✓ KEEP: interval.end (${intervalEnd}) > max_end (${maxEndValue}), extending coverage`;
  } else {
    return `✗ COVERED: interval.end (${intervalEnd}) ≤ max_end (${maxEndValue}), already covered`;
  }
};