import { renderHook, act } from "@testing-library/react";
import { useTraceNavigation } from "../useTraceNavigation";

describe("useTraceNavigation", () => {
  // Mock trace data
  const mockTrace = {
    trace: {
      steps: [
        { type: "INIT", data: { message: "Step 0" } },
        { type: "EXAMINING", data: { message: "Step 1" } },
        { type: "DECISION_MADE", data: { message: "Step 2" } },
        { type: "ALGORITHM_COMPLETE", data: { message: "Step 3" } },
      ],
    },
  };

  const emptyTrace = null;
  const traceWithOneStep = {
    trace: {
      steps: [{ type: "ALGORITHM_COMPLETE", data: {} }],
    },
  };

  describe("Initialization", () => {
    it("should initialize at step 0", () => {
      const { result } = renderHook(() => useTraceNavigation(mockTrace));

      expect(result.current.currentStep).toBe(0);
      expect(result.current.totalSteps).toBe(4);
    });

    it("should handle null trace gracefully", () => {
      const { result } = renderHook(() => useTraceNavigation(emptyTrace));

      expect(result.current.currentStep).toBe(0);
      expect(result.current.totalSteps).toBe(0);
      expect(result.current.currentStepData).toBeUndefined();
    });

    it("should return correct currentStepData", () => {
      const { result } = renderHook(() => useTraceNavigation(mockTrace));

      expect(result.current.currentStepData).toEqual({
        type: "INIT",
        data: { message: "Step 0" },
      });
    });
  });

  describe("nextStep", () => {
    it("should advance to next step", () => {
      const { result } = renderHook(() => useTraceNavigation(mockTrace));

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.currentStepData.type).toBe("EXAMINING");
    });

    it("should not advance beyond last step", () => {
      const { result } = renderHook(() => useTraceNavigation(mockTrace));

      // Jump to last step
      act(() => {
        result.current.jumpToEnd();
      });

      const lastStep = result.current.currentStep;

      // Try to advance
      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(lastStep);
    });

    it("should handle multiple consecutive calls", () => {
      const { result } = renderHook(() => useTraceNavigation(mockTrace));

      act(() => {
        result.current.nextStep();
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(2);
    });

    it("should do nothing when trace is null", () => {
      const { result } = renderHook(() => useTraceNavigation(emptyTrace));

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(0);
    });
  });

  describe("prevStep", () => {
    it("should go to previous step", () => {
      const { result } = renderHook(() => useTraceNavigation(mockTrace));

      // Go to step 2
      act(() => {
        result.current.nextStep();
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(2);

      // Go back
      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(1);
    });

    it("should not go below step 0", () => {
      const { result } = renderHook(() => useTraceNavigation(mockTrace));

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(0);
    });

    it("should handle multiple consecutive calls", () => {
      const { result } = renderHook(() => useTraceNavigation(mockTrace));

      // Jump to end
      act(() => {
        result.current.jumpToEnd();
      });

      // Go back twice
      act(() => {
        result.current.prevStep();
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(1);
    });
  });

  describe("jumpToEnd", () => {
    it("should jump to last step", () => {
      const { result } = renderHook(() => useTraceNavigation(mockTrace));

      act(() => {
        result.current.jumpToEnd();
      });

      expect(result.current.currentStep).toBe(3);
      expect(result.current.currentStepData.type).toBe("ALGORITHM_COMPLETE");
    });

    it("should handle trace with single step", () => {
      const { result } = renderHook(() =>
        useTraceNavigation(traceWithOneStep)
      );

      act(() => {
        result.current.jumpToEnd();
      });

      expect(result.current.currentStep).toBe(0);
    });

    it("should do nothing when trace is null", () => {
      const { result } = renderHook(() => useTraceNavigation(emptyTrace));

      act(() => {
        result.current.jumpToEnd();
      });

      expect(result.current.currentStep).toBe(0);
    });
  });

  describe("resetTrace", () => {
    it("should reset to step 0", () => {
      const { result } = renderHook(() => useTraceNavigation(mockTrace));

      // Navigate away from step 0
      act(() => {
        result.current.nextStep();
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(2);

      // Reset
      act(() => {
        result.current.resetTrace();
      });

      expect(result.current.currentStep).toBe(0);
    });

    it("should call resetPredictionStats callback if provided", () => {
      const mockResetPredictionStats = jest.fn();
      const { result } = renderHook(() =>
        useTraceNavigation(mockTrace, mockResetPredictionStats)
      );

      act(() => {
        result.current.resetTrace();
      });

      expect(mockResetPredictionStats).toHaveBeenCalledTimes(1);
    });

    it("should not crash if resetPredictionStats is not provided", () => {
      const { result } = renderHook(() => useTraceNavigation(mockTrace));

      expect(() => {
        act(() => {
          result.current.resetTrace();
        });
      }).not.toThrow();
    });
  });

  describe("isComplete flag", () => {
    it("should be false for non-completion steps", () => {
      const { result } = renderHook(() => useTraceNavigation(mockTrace));

      expect(result.current.isComplete).toBe(false);

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.isComplete).toBe(false);
    });

    it("should be true for ALGORITHM_COMPLETE step", () => {
      const { result } = renderHook(() => useTraceNavigation(mockTrace));

      act(() => {
        result.current.jumpToEnd();
      });

      expect(result.current.isComplete).toBe(true);
    });

    it("should handle trace with single completion step", () => {
      const { result } = renderHook(() =>
        useTraceNavigation(traceWithOneStep)
      );

      expect(result.current.isComplete).toBe(true);
    });
  });

  describe("setCurrentStep", () => {
    it("should be exposed for direct step manipulation", () => {
      const { result } = renderHook(() => useTraceNavigation(mockTrace));

      expect(result.current.setCurrentStep).toBeDefined();
      expect(typeof result.current.setCurrentStep).toBe("function");
    });

    it("should allow jumping to arbitrary step", () => {
      const { result } = renderHook(() => useTraceNavigation(mockTrace));

      act(() => {
        result.current.setCurrentStep(2);
      });

      expect(result.current.currentStep).toBe(2);
      expect(result.current.currentStepData.type).toBe("DECISION_MADE");
    });
  });

  describe("Trace updates", () => {
    it("should update currentStepData when trace changes", () => {
      const { result, rerender } = renderHook(
        ({ trace }) => useTraceNavigation(trace),
        {
          initialProps: { trace: mockTrace },
        }
      );

      expect(result.current.currentStepData.type).toBe("INIT");

      // Update trace
      const newTrace = {
        trace: {
          steps: [
            { type: "NEW_INIT", data: { message: "New Step 0" } },
            { type: "NEW_EXAMINING", data: { message: "New Step 1" } },
          ],
        },
      };

      rerender({ trace: newTrace });

      expect(result.current.currentStepData.type).toBe("NEW_INIT");
      expect(result.current.totalSteps).toBe(2);
    });

    it("should maintain currentStep position when trace updates", () => {
      const { result, rerender } = renderHook(
        ({ trace }) => useTraceNavigation(trace),
        {
          initialProps: { trace: mockTrace },
        }
      );

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(1);

      // Update trace with more steps
      const newTrace = {
        trace: {
          steps: [
            { type: "STEP_0", data: {} },
            { type: "STEP_1", data: {} },
            { type: "STEP_2", data: {} },
          ],
        },
      };

      rerender({ trace: newTrace });

      // Should still be at step 1
      expect(result.current.currentStep).toBe(1);
      expect(result.current.currentStepData.type).toBe("STEP_1");
    });
  });
});