import React from "react";
import { renderHook } from "@testing-library/react";
import { useKeyboardShortcuts } from "../useKeyboardShortcuts";
import { KeyboardProvider } from "../../contexts/KeyboardContext";

describe("useKeyboardShortcuts", () => {
  let mockCallbacks;

  beforeEach(() => {
    mockCallbacks = {
      onNext: jest.fn(),
      onPrev: jest.fn(),
      onReset: jest.fn(),
      onJumpToEnd: jest.fn(),
      onCloseModal: jest.fn(),
      isComplete: false,
      modalOpen: false,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Wrapper for Context
  const wrapper = ({ children }) => (
    <KeyboardProvider>{children}</KeyboardProvider>
  );

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

  describe("Navigation shortcuts", () => {
    it("should call onNext when ArrowRight is pressed", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks), { wrapper });

      pressKey("ArrowRight");

      expect(mockCallbacks.onNext).toHaveBeenCalledTimes(1);
    });

    it("should call onNext when Space is pressed", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks), { wrapper });

      pressKey(" ");

      expect(mockCallbacks.onNext).toHaveBeenCalledTimes(1);
    });

    it("should call onPrev when ArrowLeft is pressed", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks), { wrapper });

      pressKey("ArrowLeft");

      expect(mockCallbacks.onPrev).toHaveBeenCalledTimes(1);
    });

    it("should not call onNext when algorithm is complete", () => {
      const callbacks = { ...mockCallbacks, isComplete: true };
      renderHook(() => useKeyboardShortcuts(callbacks), { wrapper });

      pressKey("ArrowRight");

      expect(mockCallbacks.onNext).not.toHaveBeenCalled();
    });
  });

  describe("Reset shortcuts", () => {
    it("should call onReset when lowercase 'r' is pressed", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks), { wrapper });

      pressKey("r");

      expect(mockCallbacks.onReset).toHaveBeenCalledTimes(1);
    });

    it("should call onReset when uppercase 'R' is pressed", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks), { wrapper });

      pressKey("R");

      expect(mockCallbacks.onReset).toHaveBeenCalledTimes(1);
    });

    it("should call onReset when Home is pressed", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks), { wrapper });

      pressKey("Home");

      expect(mockCallbacks.onReset).toHaveBeenCalledTimes(1);
    });
  });

  describe("Jump to end shortcut", () => {
    it("should call onJumpToEnd when End is pressed", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks), { wrapper });

      pressKey("End");

      expect(mockCallbacks.onJumpToEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe("Escape key behavior", () => {
    it("should call onCloseModal when Escape is pressed and algorithm is complete", () => {
      const callbacks = { ...mockCallbacks, isComplete: true };
      renderHook(() => useKeyboardShortcuts(callbacks), { wrapper });

      pressKey("Escape");

      expect(mockCallbacks.onCloseModal).toHaveBeenCalledTimes(1);
    });

    it("should not call onCloseModal when Escape is pressed and algorithm is not complete", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks), { wrapper });

      pressKey("Escape");

      expect(mockCallbacks.onCloseModal).not.toHaveBeenCalled();
    });
  });

  describe("Modal blocking", () => {
    it("should not trigger shortcuts when modal is open", () => {
      const callbacks = { ...mockCallbacks, modalOpen: true };
      renderHook(() => useKeyboardShortcuts(callbacks), { wrapper });

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
          wrapper,
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
      renderHook(() => useKeyboardShortcuts(mockCallbacks), { wrapper });

      const input = document.createElement("input");
      pressKey("ArrowRight", input);
      pressKey(" ", input);

      expect(mockCallbacks.onNext).not.toHaveBeenCalled();
    });

    it("should not trigger shortcuts when typing in TEXTAREA", () => {
      renderHook(() => useKeyboardShortcuts(mockCallbacks), { wrapper });

      const textarea = document.createElement("textarea");
      pressKey("ArrowLeft", textarea);
      pressKey("r", textarea);

      expect(mockCallbacks.onPrev).not.toHaveBeenCalled();
      expect(mockCallbacks.onReset).not.toHaveBeenCalled();
    });
  });
});
