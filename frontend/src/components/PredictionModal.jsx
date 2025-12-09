// frontend/src/components/PredictionModal.jsx
import React, { useState, useEffect } from "react";
import { HelpCircle, CheckCircle, XCircle } from "lucide-react";
import {
  getPredictionData,
  getCorrectAnswer,
  isPredictionCorrect,
  getHintText,
  getExplanation,
} from "../utils/predictionUtils";
import { getIntervalColor } from "../constants/intervalColors"; // <-- NEW IMPORT

const PredictionModal = ({ step, nextStep, onAnswer, onSkip }) => {
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Extract prediction data
  const predictionData = getPredictionData(step);
  const correctAnswer = getCorrectAnswer(step, nextStep);

  // Reset state when step changes
  useEffect(() => {
    setSelected(null);
    setShowFeedback(false);
    setIsCorrect(false);
  }, [step?.step]);

  // Handle keyboard shortcuts (K for Keep, C for Covered, S for Skip)
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ignore if already showing feedback
      if (showFeedback) return;

      switch (event.key.toLowerCase()) {
        case "k":
          setSelected("keep");
          break;
        case "c":
          setSelected("covered");
          break;
        case "s":
          if (onSkip) {
            onSkip();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showFeedback, onSkip]);

  const handleSubmit = () => {
    if (!selected) return;

    const correct = isPredictionCorrect(selected, correctAnswer);
    setIsCorrect(correct);
    setShowFeedback(true);

    // Auto-advance after 2.5 seconds
    setTimeout(() => {
      onAnswer(correct);
    }, 2500);
  };

  if (!predictionData || !correctAnswer) {
    return null;
  }

  const { interval, comparison } = predictionData;
  const hintText = getHintText(predictionData);
  const explanation = getExplanation(correctAnswer, predictionData);
  
  // Use utility function for interval color
  const intervalColors = getIntervalColor(interval.color);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl border-2 border-blue-500 max-w-lg w-full p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mb-3">
            <HelpCircle className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Make a Prediction
          </h2>
          <p className="text-slate-400 text-sm">
            Will this interval be kept or covered?
          </p>
        </div>

        {/* Interval Information */}
        <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className={`px-3 py-2 rounded-md text-sm font-bold ${intervalColors.bg} ${intervalColors.text}`}
            >
              Interval: ({interval.start}, {interval.end})
            </div>
          </div>
          <div className="text-center text-slate-300 text-sm">
            Comparison: {comparison}
          </div>
        </div>

        {/* Hint */}
        {!showFeedback && (
          <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-3 mb-4">
            <p className="text-blue-300 text-sm">{hintText}</p>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`rounded-lg p-4 mb-4 border-2 ${
              isCorrect
                ? "bg-emerald-900/30 border-emerald-500"
                : "bg-red-900/30 border-red-500"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <span
                className={`font-bold ${
                  isCorrect ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isCorrect ? "Correct!" : "Incorrect"}
              </span>
            </div>
            <p className="text-slate-300 text-sm">{explanation}</p>
          </div>
        )}

        {/* Choice Buttons */}
        {!showFeedback && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setSelected("keep")}
              className={`py-3 px-4 rounded-lg font-bold transition-all ${
                selected === "keep"
                  ? "bg-emerald-500 text-white scale-105 ring-2 ring-emerald-400"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              <div className="text-lg">✓ KEEP</div>
              <div className="text-xs opacity-75">Press K</div>
            </button>

            <button
              onClick={() => setSelected("covered")}
              className={`py-3 px-4 rounded-lg font-bold transition-all ${
                selected === "covered"
                  ? "bg-red-500 text-white scale-105 ring-2 ring-red-400"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              <div className="text-lg">✗ COVERED</div>
              <div className="text-xs opacity-75">Press C</div>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {!showFeedback && (
          <div className="flex gap-2">
            <button
              onClick={onSkip}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Skip Question (S)
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selected}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Submit Answer
            </button>
          </div>
        )}

        {/* Auto-advancing message */}
        {showFeedback && (
          <div className="text-center text-slate-400 text-sm">
            Advancing to next step...
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionModal;
