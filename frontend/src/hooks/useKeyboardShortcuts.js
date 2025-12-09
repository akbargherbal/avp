import { useEffect } from "react";

export const useKeyboardShortcuts = ({
  onNext,
  onPrev,
  onReset,
  onJumpToEnd,
  isComplete,
  modalOpen,
}) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ignore if typing in input/textarea
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      // Ignore if modal is open (prediction modal)
      if (modalOpen) return;

      switch (event.key) {
        case "ArrowRight":
        case " ":
          event.preventDefault();
          if (!isComplete) onNext?.();
          break;

        case "ArrowLeft":
          event.preventDefault();
          if (!isComplete) onPrev?.();
          break;

        case "r":
        case "R":
        case "Home":
          event.preventDefault();
          onReset?.();
          break;

        case "End":
          event.preventDefault();
          onJumpToEnd?.();
          break;

        case "Escape":
          // Allows escape to go back one step if algorithm is complete
          if (isComplete) onPrev?.();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onNext, onPrev, onReset, onJumpToEnd, isComplete, modalOpen]);
};
