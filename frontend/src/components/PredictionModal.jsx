import React, { useState, useEffect } from "react";
import { HelpCircle, CheckCircle, XCircle } from "lucide-react";

/**
 * Derive semantic keyboard shortcut from choice label.
 * 
 * Strategy:
 * 1. Try first letter of label (if unique among choices)
 * 2. Try first letter of key words (capitalized words like "Left"/"Right")
 * 3. Fall back to number (1, 2, 3...)
 * 
 * Examples:
 * - "Found! (5 == 5)" → F
 * - "Search Left" → L (from "Left")
 * - "Search Right" → R (from "Right")
 * - "Keep this interval" → K
 * - "Covered by previous" → C
 * 
 * @param {Object} choice - Choice object with {id, label}
 * @param {Array} allChoices - All choices to check for conflicts
 * @param {number} index - Fallback number (1-based)
 * @returns {string} Single character shortcut
 */
const deriveShortcut = (choice, allChoices, index) => {
  const label = choice.label || '';
  
  // Strategy 1: Try first letter
  const firstLetter = label[0]?.toUpperCase();
  if (firstLetter && /[A-Z]/.test(firstLetter)) {
    const conflicts = allChoices.filter(c => 
      c.label[0]?.toUpperCase() === firstLetter
    );
    if (conflicts.length === 1) {
      return firstLetter;
    }
  }
  
  // Strategy 2: Extract key words (capitalized words in the middle of label)
  // Matches: "Search Left" → ["Search", "Left"]
  //          "Found! (5 == 5)" → ["Found"]
  const words = label.match(/\b[A-Z][a-z]+/g) || [];
  
  for (const word of words) {
    const letter = word[0].toUpperCase();
    const conflicts = allChoices.filter(c => {
      const otherWords = (c.label || '').match(/\b[A-Z][a-z]+/g) || [];
      return otherWords.some(w => w[0].toUpperCase() === letter);
    });
    
    if (conflicts.length === 1) {
      return letter;
    }
  }
  
  // Strategy 3: Fall back to number
  return (index + 1).toString();
};

/**
 * Algorithm-Agnostic Prediction Modal
 *
 * Renders prediction questions from backend-generated metadata.
 * Supports any algorithm that provides prediction_points in trace.
 * 
 * Automatically extracts semantic shortcuts from choice labels:
 * - Binary Search: F/L/R (Found, Left, Right)
 * - Interval Coverage: K/C (Keep, Covered)
 */
const PredictionModal = ({ predictionData, onAnswer, onSkip }) => {
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);

  // Derive shortcuts when prediction changes
  useEffect(() => {
    if (predictionData?.choices) {
      const derivedShortcuts = predictionData.choices.map((choice, idx) => 
        deriveShortcut(choice, predictionData.choices, idx)
      );
      setShortcuts(derivedShortcuts);
    }
  }, [predictionData]);

  // Reset state when prediction changes
  useEffect(() => {
    setSelected(null);
    setShowFeedback(false);
    setIsCorrect(false);
  }, [predictionData?.step_index]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ignore if already showing feedback
      if (showFeedback) return;

      // Skip shortcut (always 'S')
      if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (onSkip) {
          onSkip();
        }
        return;
      }

      // Submit shortcut (always 'Enter')
      if (event.key === "Enter") {
        if (selected) {
          event.preventDefault();
          handleSubmit();
        }
        return;
      }

      // Dynamic choice shortcuts - match against derived shortcuts
      const pressedKey = event.key.toUpperCase();
      const choiceIndex = shortcuts.findIndex(s => s.toUpperCase() === pressedKey);
      
      if (choiceIndex !== -1) {
        event.preventDefault();
        setSelected(predictionData.choices[choiceIndex].id);
        return;
      }

      // Fallback: Accept number keys 1-9
      const numberIndex = parseInt(event.key) - 1;
      if (
        !isNaN(numberIndex) &&
        numberIndex >= 0 &&
        numberIndex < predictionData.choices.length
      ) {
        event.preventDefault();
        setSelected(predictionData.choices[numberIndex].id);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showFeedback, onSkip, selected, predictionData, shortcuts]);

  const handleSubmit = () => {
    if (!selected) return;

    const correct = selected === predictionData.correct_answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    // Auto-advance after 2.5 seconds
    setTimeout(() => {
      onAnswer(selected);
    }, 2500);
  };

  if (!predictionData) {
    return null;
  }

  const { question, choices, hint, explanation } = predictionData;

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
          <p className="text-slate-400 text-sm">{question}</p>
        </div>

        {/* Hint */}
        {hint && !showFeedback && (
          <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-3 mb-4">
            <p className="text-blue-300 text-sm">💡 {hint}</p>
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

        {/* Choice Buttons - Dynamic Grid */}
        {!showFeedback && (
          <div
            className={`grid gap-3 mb-4 ${
              choices.length <= 2
                ? "grid-cols-2"
                : choices.length === 3
                ? "grid-cols-3"
                : "grid-cols-2"
            }`}
          >
            {choices.map((choice, index) => (
              <button
                key={choice.id}
                onClick={() => setSelected(choice.id)}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  selected === choice.id
                    ? "bg-blue-500 text-white scale-105 ring-2 ring-blue-400"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                <div className="text-base">{choice.label}</div>
                <div className="text-xs opacity-75 mt-1">
                  Press {shortcuts[index] || (index + 1)}
                </div>
              </button>
            ))}
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
              Submit Answer {selected && "(Enter)"}
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