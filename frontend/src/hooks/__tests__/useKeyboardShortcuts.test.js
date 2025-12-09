import { renderHook } from "@testing-library/react";
import { useKeyboardShortcuts } from "../useKeyboardShortcuts";

describe("useKeyboardShortcuts", () => {
  let mockCallbacks;

  beforeEach(() => {
    mockCallbacks = {
      onNext: jest.fn(),
      onPrev: jest.fn(),
      onReset: jest.fn(),
      onJumpToEnd: jest.fn(),
      isComplete: false,
      modalOpen: false,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Helper to simulate keyboard events
  const pressKey = (key, target = document.body) => {
    const event = new KeyboardEvent("keydown", {
      key,
      bubbles: true,
      cancelable: true,
    });

    // Mock the target
    Object.defineProperty(event, "target", {
      value: target,
      writable: false,
    });

    window.dispatchEvent(event);
    return event;
  };

  describe("Event listener lifecycle", () => {
    it("should attach keydown listener on mount", () => {
      const addEventListenerSpy = jest.spyOn(window, "addEventListener");

      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );

      addEventListenerSpy.mockRestore();
    });

    it("should remove keydown listener on unmount", () => {
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() =>
        useKeyboardShortcuts(mockCallbacks)
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });

    it("should update listener when dependencies change", () => {
      const { rerender } = renderHook(
        ({ callbacks }) => useKeyboardShortcuts(callbacks),
        {
          initialProps: { callbacks: mockCallbacks },
        }
      );

      pressKey("ArrowRight");
      expect(mockCallbacks.onNext).toHaveBeenCalledTimes(1);

      // Update callbacks
      const newCallbacks = {
        ...mockCallbacks,
        onNext: jest.fn(),
      };

      rerender({ callbacks: newCallbacks });

      pressKey("ArrowRight");
      expect(mockCallbacks.onNext).toHaveBeenCalledTimes(1); // Old callback
      expect(newCallbacks.onNext).toHaveBeenCalledTimes(1); // New callback
    });
  });

  describe("Navigation shortcuts", () => {
    it("should call onNext when ArrowRight is pressed", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      pressKey("ArrowRight");

      expect(mockCallbacks.onNext).toHaveBeenCalledTimes(1);
    });

    it("should call onNext when Space is pressed", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      pressKey(" ");

      expect(mockCallbacks.onNext).toHaveBeenCalledTimes(1);
    });

    it("should call onPrev when ArrowLeft is pressed", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      pressKey("ArrowLeft");

      expect(mockCallbacks.onPrev).toHaveBeenCalledTimes(1);
    });

    it("should not call onNext when algorithm is complete", () => {
      const callbacks = { ...mockCallbacks, isComplete: true };
      renderHook(() => useKeyboardShortcuts(callbacks));

      pressKey("ArrowRight");

      expect(mockCallbacks.onNext).not.toHaveBeenCalled();
    });

    it("should not call onPrev when algorithm is complete", () => {
      const callbacks = { ...mockCallbacks, isComplete: true };
      renderHook(() => useKeyboardShortcuts(callbacks));

      pressKey("ArrowLeft");

      expect(mockCallbacks.onPrev).not.toHaveBeenCalled();
    });
  });

  describe("Reset shortcuts", () => {
    it("should call onReset when lowercase 'r' is pressed", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      pressKey("r");

      expect(mockCallbacks.onReset).toHaveBeenCalledTimes(1);
    });

    it("should call onReset when uppercase 'R' is pressed", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      pressKey("R");

      expect(mockCallbacks.onReset).toHaveBeenCalledTimes(1);
    });

    it("should call onReset when Home is pressed", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      pressKey("Home");

      expect(mockCallbacks.onReset).toHaveBeenCalledTimes(1);
    });

    it("should call onReset even when algorithm is complete", () => {
      const callbacks = { ...mockCallbacks, isComplete: true };
      renderHook(() => useKeyboardShortcuts(callbacks));

      pressKey("r");

      expect(mockCallbacks.onReset).toHaveBeenCalledTimes(1);
    });
  });

  describe("Jump to end shortcut", () => {
    it("should call onJumpToEnd when End is pressed", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      pressKey("End");

      expect(mockCallbacks.onJumpToEnd).toHaveBeenCalledTimes(1);
    });

    it("should call onJumpToEnd even when algorithm is complete", () => {
      const callbacks = { ...mockCallbacks, isComplete: true };
      renderHook(() => useKeyboardShortcuts(callbacks));

      pressKey("End");

      expect(mockCallbacks.onJumpToEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe("Escape key behavior", () => {
    it("should call onPrev when Escape is pressed and algorithm is complete", () => {
      const callbacks = { ...mockCallbacks, isComplete: true };
      renderHook(() => useKeyboardShortcuts(callbacks));

      pressKey("Escape");

      expect(mockCallbacks.onPrev).toHaveBeenCalledTimes(1);
    });

    it("should not call onPrev when Escape is pressed and algorithm is not complete", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      pressKey("Escape");

      expect(mockCallbacks.onPrev).not.toHaveBeenCalled();
    });
  });

  describe("Modal blocking", () => {
    it("should not trigger shortcuts when modal is open", () => {
      const callbacks = { ...mockCallbacks, modalOpen: true };
      renderHook(() => useKeyboardShortcuts(callbacks));

      pressKey("ArrowRight");
      pressKey("ArrowLeft");
      pressKey("r");
      pressKey("Home");
      pressKey("End");
      pressKey(" ");

      expect(mockCallbacks.onNext).not.toHaveBeenCalled();
      expect(mockCallbacks.onPrev).not.toHaveBeenCalled();
      expect(mockCallbacks.onReset).not.toHaveBeenCalled();
      expect(mockCallbacks.onJumpToEnd).not.toHaveBeenCalled();
    });

    it("should trigger shortcuts when modal is closed", () => {
      const { rerender } = renderHook(
        ({ callbacks }) => useKeyboardShortcuts(callbacks),
        {
          initialProps: { callbacks: { ...mockCallbacks, modalOpen: true } },
        }
      );

      pressKey("ArrowRight");
      expect(mockCallbacks.onNext).not.toHaveBeenCalled();

      // Close modal
      rerender({ callbacks: { ...mockCallbacks, modalOpen: false } });

      pressKey("ArrowRight");
      expect(mockCallbacks.onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe("Input field exclusion", () => {
    it("should not trigger shortcuts when typing in INPUT", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      const input = document.createElement("input");
      pressKey("ArrowRight", input);
      pressKey(" ", input);

      expect(mockCallbacks.onNext).not.toHaveBeenCalled();
    });

    it("should not trigger shortcuts when typing in TEXTAREA", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      const textarea = document.createElement("textarea");
      pressKey("ArrowLeft", textarea);
      pressKey("r", textarea);

      expect(mockCallbacks.onPrev).not.toHaveBeenCalled();
      expect(mockCallbacks.onReset).not.toHaveBeenCalled();
    });

    it("should trigger shortcuts when focus is on other elements", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      const div = document.createElement("div");
      pressKey("ArrowRight", div);

      expect(mockCallbacks.onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe("Missing callbacks", () => {
    it("should not crash when onNext is undefined", () => {
      const callbacks = { ...mockCallbacks, onNext: undefined };

      renderHook(() => useKeyboardShortcuts(callbacks));

      expect(() => {
        pressKey("ArrowRight");
      }).not.toThrow();
    });

    it("should not crash when onPrev is undefined", () => {
      const callbacks = { ...mockCallbacks, onPrev: undefined };

      renderHook(() => useKeyboardShortcuts(callbacks));

      expect(() => {
        pressKey("ArrowLeft");
      }).not.toThrow();
    });

    it("should not crash when onReset is undefined", () => {
      const callbacks = { ...mockCallbacks, onReset: undefined };

      renderHook(() => useKeyboardShortcuts(callbacks));

      expect(() => {
        pressKey("r");
      }).not.toThrow();
    });

    it("should not crash when onJumpToEnd is undefined", () => {
      const callbacks = { ...mockCallbacks, onJumpToEnd: undefined };

      renderHook(() => useKeyboardShortcuts(callbacks));

      expect(() => {
        pressKey("End");
      }).not.toThrow();
    });
  });

  describe("Event prevention", () => {
    it("should prevent default for ArrowRight", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      const event = pressKey("ArrowRight");

      // preventDefault should have been called
      expect(event.defaultPrevented).toBe(true);
    });

    it("should prevent default for Space", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      const event = pressKey(" ");

      expect(event.defaultPrevented).toBe(true);
    });

    it("should prevent default for Home", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      const event = pressKey("Home");

      expect(event.defaultPrevented).toBe(true);
    });

    it("should prevent default for End", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      const event = pressKey("End");

      expect(event.defaultPrevented).toBe(true);
    });

    it("should not prevent default for unhandled keys", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      const event = pressKey("a");

      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe("Multiple key presses", () => {
    it("should handle rapid consecutive key presses", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      pressKey("ArrowRight");
      pressKey("ArrowRight");
      pressKey("ArrowRight");

      expect(mockCallbacks.onNext).toHaveBeenCalledTimes(3);
    });

    it("should handle mixed key presses", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      pressKey("ArrowRight");
      pressKey("ArrowLeft");
      pressKey("Home");
      pressKey("End");

      expect(mockCallbacks.onNext).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onPrev).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onReset).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onJumpToEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe("Unhandled keys", () => {
    it("should not call any callbacks for unhandled keys", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks));

      pressKey("a");
      pressKey("b");
      pressKey("Enter");
      pressKey("Tab");

      expect(mockCallbacks.onNext).not.toHaveBeenCalled();
      expect(mockCallbacks.onPrev).not.toHaveBeenCalled();
      expect(mockCallbacks.onReset).not.toHaveBeenCalled();
      expect(mockCallbacks.onJumpToEnd).not.toHaveBeenCalled();
    });
  });
});