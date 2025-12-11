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
 * Get semantic button color based on choice semantics
 * Matches static mockup color guidelines
 */
const getChoiceColor = (label) => {
  const lowerLabel = label.toLowerCase();
  
  // Positive/Success actions (green/emerald)
  if (lowerLabel.includes('found') || lowerLabel.includes('keep') || 
      lowerLabel.includes('yes') || lowerLabel.includes('continue')) {
    return {
      base: 'bg-emerald-600 hover:bg-emerald-500',
      selected: 'bg-emerald-600 scale-105 ring-2 ring-emerald-400',
      unselected: 'bg-emerald-600/50 opacity-60'
    };
  }
  
  // Negative/Discard actions (orange)
  if (lowerLabel.includes('covered') || lowerLabel.includes('discard') || 
      lowerLabel.includes('no') || lowerLabel.includes('stop')) {
    return {
      base: 'bg-orange-600 hover:bg-orange-500',
      selected: 'bg-orange-600 scale-105 ring-2 ring-orange-400',
      unselected: 'bg-orange-600/50 opacity-60'
    };
  }
  
  // Left/backward direction (blue)
  if (lowerLabel.includes('left') || lowerLabel.includes('back') || 
      lowerLabel.includes('previous')) {
    return {
      base: 'bg-blue-600 hover:bg-blue-500',
      selected: 'bg-blue-600 scale-105 ring-2 ring-blue-400',
      unselected: 'bg-blue-600/50 opacity-60'
    };
  }
  
  // Right/forward direction (red)
  if (lowerLabel.includes('right') || lowerLabel.includes('forward') || 
      lowerLabel.includes('next')) {
    return {
      base: 'bg-red-600 hover:bg-red-500',
      selected: 'bg-red-600 scale-105 ring-2 ring-red-400',
      unselected: 'bg-red-600/50 opacity-60'
    };
  }
  
  // Default fallback (blue)
  return {
    base: 'bg-blue-600 hover:bg-blue-500',
    selected: 'bg-blue-600 scale-105 ring-2 ring-blue-400',
    unselected: 'bg-blue-600/50 opacity-60'
  };
};

/**
 * Algorithm-Agnostic Prediction Modal
 *
 * VISUAL STANDARD: Matches static_mockup/prediction_modal_mockup.html
 * - max-w-lg (512px) - NO max-h constraint per mockup
 * - Semantic button colors (emerald/orange/blue/red)
 * - Two-step confirmation pattern
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
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-white mb-2">{question}</h3>
          <p className="text-slate-400 text-sm">
            {predictionData.step_description || "Make your prediction"}
          </p>
        </div>

        {/* Hint Box */}
        {hint && !showFeedback && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-4">
            <p className="text-blue-300 text-sm">
              💡 <strong>Hint:</strong> {hint}
            </p>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`rounded-lg p-3 mb-4 border-2 ${
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

        {/* Choice Buttons - Dynamic Grid with Semantic Colors */}
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
            {choices.map((choice, index) => {
              const colors = getChoiceColor(choice.label);
              const isSelected = selected === choice.id;
              const isUnselected = selected && !isSelected;
              
              return (
                <button
                  key={choice.id}
                  onClick={() => setSelected(choice.id)}
                  className={`py-4 px-4 rounded-lg font-semibold transition-all shadow-lg ${
                    isSelected
                      ? colors.selected
                      : isUnselected
                      ? colors.unselected
                      : colors.base
                  } text-white`}
                >
                  <div className="text-base mb-1">{choice.label}</div>
                  <div className="text-xs opacity-75">
                    Press {shortcuts[index] || (index + 1)}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Actions - Two-Step Confirmation Pattern */}
        {!showFeedback && (
          <div className="flex justify-between items-center pt-4 border-t border-slate-700">
            <button
              onClick={onSkip}
              className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
            >
              Skip (Press S)
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selected}
              className={`bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-all ${
                selected
                  ? "hover:bg-blue-500 hover:scale-105 shadow-lg animate-pulse"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              Submit (Enter) {selected && "✓"}
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