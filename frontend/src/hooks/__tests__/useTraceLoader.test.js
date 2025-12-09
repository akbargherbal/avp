import { renderHook, act, waitFor } from "@testing-library/react";
import { useTraceLoader } from "../useTraceLoader";

// Mock fetch globally
global.fetch = jest.fn();

describe("useTraceLoader", () => {
  const mockSuccessResponse = {
    result: [
      { id: 1, start: 540, end: 660 },
      { id: 3, start: 540, end: 720 },
    ],
    trace: {
      steps: [
        { type: "INIT", data: {} },
        { type: "EXAMINING", data: {} },
        { type: "ALGORITHM_COMPLETE", data: {} },
      ],
      total_steps: 3,
    },
    metadata: {
      input_size: 4,
      output_size: 2,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset env var
    delete process.env.REACT_APP_API_URL;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize with loading state", () => {
      // Mock successful response for initial load
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const { result } = renderHook(() => useTraceLoader());

      expect(result.current.loading).toBe(true);
      expect(result.current.trace).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it("should provide all expected functions", () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const { result } = renderHook(() => useTraceLoader());

      expect(typeof result.current.loadTrace).toBe("function");
      expect(typeof result.current.loadExampleTrace).toBe("function");
      expect(typeof result.current.setTrace).toBe("function");
    });

    it("should automatically load example trace on mount", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const { result } = renderHook(() => useTraceLoader());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/trace",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });

  describe("Successful trace loading", () => {
    it("should load trace successfully", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const { result } = renderHook(() => useTraceLoader());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.trace).toEqual(mockSuccessResponse);
      expect(result.current.error).toBeNull();
    });

    it("should set loading to false after successful load", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const { result } = renderHook(() => useTraceLoader());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("should call API with correct payload", async () => {
      const customIntervals = [
        { id: 10, start: 100, end: 200, color: "red" },
      ];

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSuccessResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSuccessResponse,
        });

      const { result } = renderHook(() => useTraceLoader());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Load custom intervals
      act(() => {
        result.current.loadTrace(customIntervals);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/trace",
        expect.objectContaining({
          body: JSON.stringify({ intervals: customIntervals }),
        })
      );
    });
  });

  describe("Error handling", () => {
    it("should handle network errors", async () => {
      const networkError = new Error("Network failure");
      global.fetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useTraceLoader());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain("Backend error: Network failure");
      expect(result.current.trace).toBeNull();
    });

    it("should handle 404 errors", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: "Endpoint not found" }),
      });

      const { result } = renderHook(() => useTraceLoader());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain("Backend returned 404");
      expect(result.current.error).toContain("Endpoint not found");
    });

    it("should handle 500 errors", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Internal server error" }),
      });

      const { result } = renderHook(() => useTraceLoader());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain("Backend returned 500");
      expect(result.current.error).toContain("Internal server error");
    });

    it("should handle errors without JSON error response", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      const { result } = renderHook(() => useTraceLoader());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain("Backend returned 400");
      expect(result.current.error).toContain("Failed to parse error response");
    });

    it("should handle malformed JSON response", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Unexpected token");
        },
      });

      const { result } = renderHook(() => useTraceLoader());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain("Unexpected token");
    });

    it("should clear previous trace on error", async () => {
      // First successful load
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const { result } = renderHook(() => useTraceLoader());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.trace).toEqual(mockSuccessResponse);

      // Second load fails
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      act(() => {
        result.current.loadTrace([]);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.trace).toBeNull();
      expect(result.current.error).toBeTruthy();
    });
  });

  describe("Loading state management", () => {
    it("should set loading to true when starting new load", async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSuccessResponse,
        })
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve({
                  ok: true,
                  json: async () => mockSuccessResponse,
                });
              }, 100);
            })
        );

      const { result } = renderHook(() => useTraceLoader());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Start new load
      act(() => {
        result.current.loadTrace([]);
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("should clear error when starting new load", async () => {
      // First load fails
      global.fetch.mockRejectedValueOnce(new Error("First error"));

      const { result } = renderHook(() => useTraceLoader());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();

      // Second load succeeds
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      act(() => {
        result.current.loadTrace([]);
      });

      // Error should be cleared immediately when starting load
      expect(result.current.error).toBeNull();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.trace).toEqual(mockSuccessResponse);
    });

    it("should clear previous trace when starting new load", async () => {
      // First load succeeds
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const { result } = renderHook(() => useTraceLoader());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.trace).toEqual(mockSuccessResponse);

      // Start second load
      global.fetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                json: async () => ({ different: "data" }),
              });
            }, 50);
          })
      );

      act(() => {
        result.current.loadTrace([]);
      });

      // Trace should be cleared immediately
      expect(result.current.trace).toBeNull();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe("loadExampleTrace", () => {
    it("should load example trace with predefined intervals", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const { result } = renderHook(() => useTraceLoader());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const callBody = JSON.parse(global.fetch.mock.calls[0][1].body);

      expect(callBody.intervals).toEqual([
        { id: 1, start: 540, end: 660, color: "blue" },
        { id: 2, start: 600, end: 720, color: "green" },
        { id: 3, start: 540, end: 720, color: "amber" },
        { id: 4, start: 900, end: 960, color: "purple" },
      ]);
    });

    it("should be callable multiple times", async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSuccessResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSuccessResponse,
        });

      const { result } = renderHook(() => useTraceLoader());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.loadExampleTrace();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("API URL configuration", () => {
    it("should use default URL when env var not set", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      renderHook(() => useTraceLoader());

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/trace",
        expect.any(Object)
      );
    });

    it("should use custom URL from env var", async () => {
      process.env.REACT_APP_API_URL = "https://custom-api.com/api";

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      renderHook(() => useTraceLoader());

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://custom-api.com/api/trace",
        expect.any(Object)
      );
    });
  });

  describe("setTrace direct manipulation", () => {
    it("should allow direct trace setting via setTrace", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const { result } = renderHook(() => useTraceLoader());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const customTrace = { custom: "trace data" };

      act(() => {
        result.current.setTrace(customTrace);
      });

      expect(result.current.trace).toEqual(customTrace);
    });
  });

  describe("Multiple consecutive loads", () => {
    it("should handle multiple consecutive loads correctly", async () => {
      const response1 = { ...mockSuccessResponse, id: 1 };
      const response2 = { ...mockSuccessResponse, id: 2 };
      const response3 = { ...mockSuccessResponse, id: 3 };

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => response1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => response2,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => response3,
        });

      const { result } = renderHook(() => useTraceLoader());

      // First load (automatic)
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.trace).toEqual(response1);

      // Second load
      act(() => {
        result.current.loadTrace([]);
      });
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.trace).toEqual(response2);

      // Third load
      act(() => {
        result.current.loadTrace([]);
      });
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.trace).toEqual(response3);

      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });

  describe("Console error logging", () => {
    it("should log errors to console", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const error = new Error("Test error");
      global.fetch.mockRejectedValueOnce(error);

      renderHook(() => useTraceLoader());

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Failed to load trace:",
          error
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });
});