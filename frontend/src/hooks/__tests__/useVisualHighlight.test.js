import { renderHook, act } from "@testing-library/react";
import { useVisualHighlight } from "../useVisualHighlight";

describe("useVisualHighlight", () => {
  // Mock trace data with call stack
  const mockTraceWithCallStack = {
    trace: {
      steps: [
        {
          type: "INIT",
          data: {
            call_stack_state: [
              {
                current_interval: { id: 1, start: 540, end: 660 },
              },
            ],
          },
        },
        {
          type: "EXAMINING",
          data: {
            call_stack_state: [
              {
                current_interval: { id: 1, start: 540, end: 660 },
              },
              {
                current_interval: { id: 2, start: 600, end: 720 },
              },
            ],
          },
        },
        {
          type: "DECISION",
          data: {
            call_stack_state: [
              {
                current_interval: { id: 3, start: 900, end: 960 },
              },
            ],
          },
        },
      ],
    },
  };

  const mockTraceEmptyCallStack = {
    trace: {
      steps: [
        {
          type: "INIT",
          data: {
            call_stack_state: [],
          },
        },
      ],
    },
  };

  const mockTraceNoCurrentInterval = {
    trace: {
      steps: [
        {
          type: "INIT",
          data: {
            call_stack_state: [
              {
                // No current_interval property
              },
            ],
          },
        },
      ],
    },
  };

  describe("Initialization", () => {
    it("should initialize with no highlight", () => {
      const { result } = renderHook(() =>
        useVisualHighlight(mockTraceWithCallStack, 0)
      );

      expect(result.current.effectiveHighlight).toBe(1);
      expect(typeof result.current.handleIntervalHover).toBe("function");
    });

    it("should extract highlight from active call stack entry", () => {
      const { result } = renderHook(() =>
        useVisualHighlight(mockTraceWithCallStack, 0)
      );

      // Step 0 has interval ID 1 in the active call
      expect(result.current.effectiveHighlight).toBe(1);
    });

    it("should handle null trace", () => {
      const { result } = renderHook(() => useVisualHighlight(null, 0));

      expect(result.current.effectiveHighlight).toBeNull();
    });
  });

  describe("Auto-highlighting from call stack", () => {
    it("should highlight interval from last call in stack", () => {
      // Step 1 has 2 calls, should highlight the last one (ID 2)
      const { result } = renderHook(() =>
        useVisualHighlight(mockTraceWithCallStack, 1)
      );

      expect(result.current.effectiveHighlight).toBe(2);
    });

    it("should update highlight when step changes", () => {
      const { result, rerender } = renderHook(
        ({ trace, step }) => useVisualHighlight(trace, step),
        {
          initialProps: {
            trace: mockTraceWithCallStack,
            step: 0,
          },
        }
      );

      expect(result.current.effectiveHighlight).toBe(1);

      // Move to step 1 (different interval)
      rerender({ trace: mockTraceWithCallStack, step: 1 });

      expect(result.current.effectiveHighlight).toBe(2);

      // Move to step 2
      rerender({ trace: mockTraceWithCallStack, step: 2 });

      expect(result.current.effectiveHighlight).toBe(3);
    });

    it("should handle empty call stack", () => {
      const { result } = renderHook(() =>
        useVisualHighlight(mockTraceEmptyCallStack, 0)
      );

      expect(result.current.effectiveHighlight).toBeNull();
    });

    it("should handle call stack with no current_interval", () => {
      const { result } = renderHook(() =>
        useVisualHighlight(mockTraceNoCurrentInterval, 0)
      );

      expect(result.current.effectiveHighlight).toBeNull();
    });

    it("should handle step with no data", () => {
      const traceNoData = {
        trace: {
          steps: [{ type: "INIT" }],
        },
      };

      const { result } = renderHook(() => useVisualHighlight(traceNoData, 0));

      expect(result.current.effectiveHighlight).toBeNull();
    });

    it("should handle step with no call_stack_state", () => {
      const traceNoCallStack = {
        trace: {
          steps: [
            {
              type: "INIT",
              data: {},
            },
          ],
        },
      };

      const { result } = renderHook(() =>
        useVisualHighlight(traceNoCallStack, 0)
      );

      expect(result.current.effectiveHighlight).toBeNull();
    });
  });

  describe("Hover interactions", () => {
    it("should update hover interval on hover", () => {
      const { result } = renderHook(() =>
        useVisualHighlight(mockTraceWithCallStack, 0)
      );

      act(() => {
        result.current.handleIntervalHover(5);
      });

      // Hover should override auto-highlight
      expect(result.current.effectiveHighlight).toBe(5);
    });

    it("should prioritize hover over auto-highlight", () => {
      const { result } = renderHook(() =>
        useVisualHighlight(mockTraceWithCallStack, 0)
      );

      // Auto-highlight should be 1
      expect(result.current.effectiveHighlight).toBe(1);

      // Hover over different interval
      act(() => {
        result.current.handleIntervalHover(99);
      });

      expect(result.current.effectiveHighlight).toBe(99);
    });

    it("should clear hover by passing null", () => {
      const { result } = renderHook(() =>
        useVisualHighlight(mockTraceWithCallStack, 0)
      );

      // Set hover
      act(() => {
        result.current.handleIntervalHover(5);
      });

      expect(result.current.effectiveHighlight).toBe(5);

      // Clear hover
      act(() => {
        result.current.handleIntervalHover(null);
      });

      // Should revert to auto-highlight
      expect(result.current.effectiveHighlight).toBe(1);
    });

    it("should maintain hover even when step changes", () => {
      const { result, rerender } = renderHook(
        ({ trace, step }) => useVisualHighlight(trace, step),
        {
          initialProps: {
            trace: mockTraceWithCallStack,
            step: 0,
          },
        }
      );

      // Set hover
      act(() => {
        result.current.handleIntervalHover(42);
      });

      expect(result.current.effectiveHighlight).toBe(42);

      // Change step (auto-highlight would change to 2)
      rerender({ trace: mockTraceWithCallStack, step: 1 });

      // Hover should still override
      expect(result.current.effectiveHighlight).toBe(42);
    });

    it("should handle multiple hover changes", () => {
      const { result } = renderHook(() =>
        useVisualHighlight(mockTraceWithCallStack, 0)
      );

      act(() => {
        result.current.handleIntervalHover(10);
      });
      expect(result.current.effectiveHighlight).toBe(10);

      act(() => {
        result.current.handleIntervalHover(20);
      });
      expect(result.current.effectiveHighlight).toBe(20);

      act(() => {
        result.current.handleIntervalHover(30);
      });
      expect(result.current.effectiveHighlight).toBe(30);
    });
  });

  describe("Effective highlight logic", () => {
    it("should return auto-highlight when no hover", () => {
      const { result } = renderHook(() =>
        useVisualHighlight(mockTraceWithCallStack, 0)
      );

      // No hover, should use auto-highlight
      expect(result.current.effectiveHighlight).toBe(1);
    });

    it("should return hover when both hover and auto-highlight exist", () => {
      const { result } = renderHook(() =>
        useVisualHighlight(mockTraceWithCallStack, 0)
      );

      act(() => {
        result.current.handleIntervalHover(7);
      });

      // Both exist, hover wins
      expect(result.current.effectiveHighlight).toBe(7);
    });

    it("should return null when neither hover nor auto-highlight exist", () => {
      const { result } = renderHook(() =>
        useVisualHighlight(mockTraceEmptyCallStack, 0)
      );

      // No auto-highlight (empty call stack), no hover
      expect(result.current.effectiveHighlight).toBeNull();
    });

    it("should handle hover set to 0 (falsy but valid)", () => {
      const { result } = renderHook(() =>
        useVisualHighlight(mockTraceWithCallStack, 0)
      );

      act(() => {
        result.current.handleIntervalHover(0);
      });

      // 0 is a valid interval ID, should be used
      expect(result.current.effectiveHighlight).toBe(0);
    });
  });

  describe("Edge cases", () => {
    it("should handle trace update to null", () => {
      const { result, rerender } = renderHook(
        ({ trace, step }) => useVisualHighlight(trace, step),
        {
          initialProps: {
            trace: mockTraceWithCallStack,
            step: 0,
          },
        }
      );

      expect(result.current.effectiveHighlight).toBe(1);

      // Update to null trace
      rerender({ trace: null, step: 0 });

      expect(result.current.effectiveHighlight).toBeNull();
    });

    it("should handle current_interval.id being undefined", () => {
      const traceUndefinedId = {
        trace: {
          steps: [
            {
              type: "INIT",
              data: {
                call_stack_state: [
                  {
                    current_interval: { start: 100, end: 200 }, // No id
                  },
                ],
              },
            },
          ],
        },
      };

      const { result } = renderHook(() =>
        useVisualHighlight(traceUndefinedId, 0)
      );

      expect(result.current.effectiveHighlight).toBeNull();
    });

    it("should handle current_interval.id being 0", () => {
      const traceZeroId = {
        trace: {
          steps: [
            {
              type: "INIT",
              data: {
                call_stack_state: [
                  {
                    current_interval: { id: 0, start: 100, end: 200 },
                  },
                ],
              },
            },
          ],
        },
      };

      const { result } = renderHook(() => useVisualHighlight(traceZeroId, 0));

      // 0 is a valid ID
      expect(result.current.effectiveHighlight).toBe(0);
    });

    it("should handle deeply nested call stack", () => {
      const traceDeepStack = {
        trace: {
          steps: [
            {
              type: "RECURSIVE",
              data: {
                call_stack_state: [
                  { current_interval: { id: 1 } },
                  { current_interval: { id: 2 } },
                  { current_interval: { id: 3 } },
                  { current_interval: { id: 4 } },
                  { current_interval: { id: 5 } }, // Should highlight this (last)
                ],
              },
            },
          ],
        },
      };

      const { result } = renderHook(() => useVisualHighlight(traceDeepStack, 0));

      expect(result.current.effectiveHighlight).toBe(5);
    });

    it("should handle step index out of bounds", () => {
      const { result } = renderHook(() =>
        useVisualHighlight(mockTraceWithCallStack, 999)
      );

      expect(result.current.effectiveHighlight).toBeNull();
    });
  });

  describe("Callback stability", () => {
    it("should maintain stable handleIntervalHover reference", () => {
      const { result, rerender } = renderHook(
        ({ trace, step }) => useVisualHighlight(trace, step),
        {
          initialProps: {
            trace: mockTraceWithCallStack,
            step: 0,
          },
        }
      );

      const firstCallback = result.current.handleIntervalHover;

      // Change step
      rerender({ trace: mockTraceWithCallStack, step: 1 });

      const secondCallback = result.current.handleIntervalHover;

      // Callback should be stable (useCallback with no deps)
      expect(firstCallback).toBe(secondCallback);
    });
  });
});