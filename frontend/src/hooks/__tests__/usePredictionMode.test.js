import { renderHook, act } from "@testing-library/react";
import { usePredictionMode } from "../usePredictionMode";
import * as predictionUtils from "../../utils/predictionUtils";

// Mock the predictionUtils module
jest.mock("../../utils/predictionUtils");

describe("usePredictionMode", () => {
  let mockNextStep;

  beforeEach(() => {
    mockNextStep = jest.fn();
    jest.clearAllMocks();
  });

  // Mock trace data
  const mockTraceWithPrediction = {
    trace: {
      steps: [
        { type: "INIT", data: {} },
        {
          type: "EXAMINING_INTERVAL",
          data: {
            interval: { id: 1, start: 540, end: 660 },
            max_end: 600,
            comparison: "end > max_end",
          },
        },
        { type: "DECISION_MADE", data: { decision: "keep" } },
        { type: "ALGORITHM_COMPLETE", data: {} },
      ],
    },
  };

  const mockTraceNoPrediction = {
    trace: {
      steps: [
        { type: "INIT", data: {} },
        { type: "SORTING", data: {} },
        { type: "ALGORITHM_COMPLETE", data: {} },
      ],
    },
  };

  describe("Initialization", () => {
    it("should initialize with prediction mode enabled", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 0, mockNextStep)
      );

      expect(result.current.predictionMode).toBe(true);
      expect(result.current.showPrediction).toBe(false);
      expect(result.current.predictionStats).toEqual({ total: 0, correct: 0 });
    });

    it("should provide all expected functions", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 0, mockNextStep)
      );

      expect(typeof result.current.togglePredictionMode).toBe("function");
      expect(typeof result.current.handlePredictionAnswer).toBe("function");
      expect(typeof result.current.handlePredictionSkip).toBe("function");
      expect(typeof result.current.resetPredictionStats).toBe("function");
    });
  });

  describe("Prediction point detection", () => {
    it("should show prediction when at a prediction point", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(true);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 1, mockNextStep)
      );

      expect(result.current.showPrediction).toBe(true);
      expect(predictionUtils.isPredictionPoint).toHaveBeenCalledWith(
        mockTraceWithPrediction.trace.steps[1]
      );
    });

    it("should not show prediction when not at a prediction point", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 0, mockNextStep)
      );

      expect(result.current.showPrediction).toBe(false);
    });

    it("should not show prediction when next step is not DECISION_MADE", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(true);

      // At step 2 (DECISION_MADE), next step is ALGORITHM_COMPLETE
      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 2, mockNextStep)
      );

      expect(result.current.showPrediction).toBe(false);
    });

    it("should update showPrediction when step changes", () => {
      predictionUtils.isPredictionPoint
        .mockReturnValueOnce(false) // Step 0
        .mockReturnValueOnce(true); // Step 1

      const { result, rerender } = renderHook(
        ({ trace, step }) => usePredictionMode(trace, step, mockNextStep),
        {
          initialProps: {
            trace: mockTraceWithPrediction,
            step: 0,
          },
        }
      );

      expect(result.current.showPrediction).toBe(false);

      // Move to prediction point
      rerender({
        trace: mockTraceWithPrediction,
        step: 1,
      });

      expect(result.current.showPrediction).toBe(true);
    });
  });

  describe("Prediction mode toggle", () => {
    it("should toggle prediction mode off", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 0, mockNextStep)
      );

      expect(result.current.predictionMode).toBe(true);

      act(() => {
        result.current.togglePredictionMode();
      });

      expect(result.current.predictionMode).toBe(false);
    });

    it("should toggle prediction mode back on", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 0, mockNextStep)
      );

      act(() => {
        result.current.togglePredictionMode();
        result.current.togglePredictionMode();
      });

      expect(result.current.predictionMode).toBe(true);
    });

    it("should hide prediction when mode is toggled off", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(true);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 1, mockNextStep)
      );

      expect(result.current.showPrediction).toBe(true);

      act(() => {
        result.current.togglePredictionMode();
      });

      expect(result.current.showPrediction).toBe(false);
    });

    it("should not show predictions when mode is off", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(true);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 1, mockNextStep)
      );

      // Turn off prediction mode
      act(() => {
        result.current.togglePredictionMode();
      });

      expect(result.current.predictionMode).toBe(false);
      expect(result.current.showPrediction).toBe(false);
    });
  });

  describe("handlePredictionAnswer", () => {
    it("should increment stats for correct answer", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 0, mockNextStep)
      );

      act(() => {
        result.current.handlePredictionAnswer(true);
      });

      expect(result.current.predictionStats).toEqual({
        total: 1,
        correct: 1,
      });
    });

    it("should increment stats for incorrect answer", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 0, mockNextStep)
      );

      act(() => {
        result.current.handlePredictionAnswer(false);
      });

      expect(result.current.predictionStats).toEqual({
        total: 1,
        correct: 0,
      });
    });

    it("should handle multiple predictions", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 0, mockNextStep)
      );

      act(() => {
        result.current.handlePredictionAnswer(true); // Correct
        result.current.handlePredictionAnswer(false); // Incorrect
        result.current.handlePredictionAnswer(true); // Correct
      });

      expect(result.current.predictionStats).toEqual({
        total: 3,
        correct: 2,
      });
    });

    it("should hide prediction modal after answer", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(true);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 1, mockNextStep)
      );

      expect(result.current.showPrediction).toBe(true);

      act(() => {
        result.current.handlePredictionAnswer(true);
      });

      expect(result.current.showPrediction).toBe(false);
    });

    it("should call nextStep after answer", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 0, mockNextStep)
      );

      act(() => {
        result.current.handlePredictionAnswer(true);
      });

      expect(mockNextStep).toHaveBeenCalledTimes(1);
    });
  });

  describe("handlePredictionSkip", () => {
    it("should not increment stats when skipping", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 0, mockNextStep)
      );

      act(() => {
        result.current.handlePredictionSkip();
      });

      expect(result.current.predictionStats).toEqual({
        total: 0,
        correct: 0,
      });
    });

    it("should hide prediction modal after skip", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(true);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 1, mockNextStep)
      );

      expect(result.current.showPrediction).toBe(true);

      act(() => {
        result.current.handlePredictionSkip();
      });

      expect(result.current.showPrediction).toBe(false);
    });

    it("should call nextStep after skip", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 0, mockNextStep)
      );

      act(() => {
        result.current.handlePredictionSkip();
      });

      expect(mockNextStep).toHaveBeenCalledTimes(1);
    });
  });

  describe("resetPredictionStats", () => {
    it("should reset stats to zero", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 0, mockNextStep)
      );

      // Build up some stats
      act(() => {
        result.current.handlePredictionAnswer(true);
        result.current.handlePredictionAnswer(false);
        result.current.handlePredictionAnswer(true);
      });

      expect(result.current.predictionStats).toEqual({
        total: 3,
        correct: 2,
      });

      // Reset
      act(() => {
        result.current.resetPredictionStats();
      });

      expect(result.current.predictionStats).toEqual({
        total: 0,
        correct: 0,
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle null trace", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result } = renderHook(() =>
        usePredictionMode(null, 0, mockNextStep)
      );

      expect(result.current.showPrediction).toBe(false);
      expect(result.current.predictionMode).toBe(true);
    });

    it("should handle trace without prediction points", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result, rerender } = renderHook(
        ({ trace, step }) => usePredictionMode(trace, step, mockNextStep),
        {
          initialProps: {
            trace: mockTraceNoPrediction,
            step: 0,
          },
        }
      );

      expect(result.current.showPrediction).toBe(false);

      // Move through steps
      rerender({ trace: mockTraceNoPrediction, step: 1 });
      expect(result.current.showPrediction).toBe(false);

      rerender({ trace: mockTraceNoPrediction, step: 2 });
      expect(result.current.showPrediction).toBe(false);
    });

    it("should handle 100% accuracy", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 0, mockNextStep)
      );

      act(() => {
        result.current.handlePredictionAnswer(true);
        result.current.handlePredictionAnswer(true);
        result.current.handlePredictionAnswer(true);
      });

      expect(result.current.predictionStats).toEqual({
        total: 3,
        correct: 3,
      });
    });

    it("should handle 0% accuracy", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 0, mockNextStep)
      );

      act(() => {
        result.current.handlePredictionAnswer(false);
        result.current.handlePredictionAnswer(false);
        result.current.handlePredictionAnswer(false);
      });

      expect(result.current.predictionStats).toEqual({
        total: 3,
        correct: 0,
      });
    });

    it("should handle mixing answers and skips", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { result } = renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 0, mockNextStep)
      );

      act(() => {
        result.current.handlePredictionAnswer(true); // total: 1, correct: 1
        result.current.handlePredictionSkip(); // No change
        result.current.handlePredictionAnswer(false); // total: 2, correct: 1
        result.current.handlePredictionSkip(); // No change
      });

      expect(result.current.predictionStats).toEqual({
        total: 2,
        correct: 1,
      });
      expect(mockNextStep).toHaveBeenCalledTimes(4); // All actions advance
    });
  });

  describe("Integration with isPredictionPoint", () => {
    it("should call isPredictionPoint with current step data", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      renderHook(() =>
        usePredictionMode(mockTraceWithPrediction, 0, mockNextStep)
      );

      expect(predictionUtils.isPredictionPoint).toHaveBeenCalledWith(
        mockTraceWithPrediction.trace.steps[0]
      );
    });

    it("should re-evaluate prediction point when step changes", () => {
      predictionUtils.isPredictionPoint.mockReturnValue(false);

      const { rerender } = renderHook(
        ({ trace, step }) => usePredictionMode(trace, step, mockNextStep),
        {
          initialProps: {
            trace: mockTraceWithPrediction,
            step: 0,
          },
        }
      );

      expect(predictionUtils.isPredictionPoint).toHaveBeenCalledTimes(1);

      rerender({ trace: mockTraceWithPrediction, step: 1 });

      expect(predictionUtils.isPredictionPoint).toHaveBeenCalledTimes(2);
    });
  });
});