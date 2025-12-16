import { useKeyboardHandler } from "../contexts/KeyboardContext";

export const useKeyboardShortcuts = ({
  // Navigation
  onNext,
  onPrev,
  onReset,
  onJumpToEnd,
  isComplete,
  // Modals & Predictions
  modalOpen,
  predictionOpen,
  onSelectChoice,
  onSubmitAnswer,
  onSkipPrediction,
  onCloseModal,
}) => {
  
  // 1. Prediction Mode Shortcuts (Highest Priority: 20)
  useKeyboardHandler((event) => {
    if (!predictionOpen) return false;

    switch (event.key.toLowerCase()) {
      case 'k': onSelectChoice?.(0); return true;
      case 'c': onSelectChoice?.(1); return true;
      case 's': onSkipPrediction?.(); return true;
      case 'enter': onSubmitAnswer?.(); return true;
      case 'escape': onSkipPrediction?.(); return true; // Allow skipping with Escape
      default: return false;
    }
  }, 20);

  // 2. Modal Close Shortcuts (High Priority: 10)
  useKeyboardHandler((event) => {
    if (!modalOpen) return false;

    if (event.key === 'Escape') {
      onCloseModal?.();
      return true;
    }
    return false;
  }, 10);

  // 3. Global Navigation Shortcuts (Base Priority: 1)
  useKeyboardHandler((event) => {
    // If a modal is open, we generally don't want to trigger navigation
    // unless specifically allowed. For now, block navigation if modal is open.
    if (modalOpen || predictionOpen) return false;

    switch (event.key) {
      case "ArrowRight":
      case " ":
        if (!isComplete) onNext?.();
        return true;
      case "ArrowLeft":
        if (!isComplete) onPrev?.();
        return true;
      case "r":
      case "R":
      case "Home":
        onReset?.();
        return true;
      case "End":
        onJumpToEnd?.();
        return true;
      case "Escape":
        if (isComplete) {
            onCloseModal?.();
            return true;
        }
        return false;
      default:
        return false;
    }
  }, 1);
};
