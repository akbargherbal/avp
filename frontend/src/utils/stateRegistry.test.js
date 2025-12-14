import {
  getStateComponent,
  isStateComponentRegistered,
  getRegisteredAlgorithms,
} from "./stateRegistry";
import IntervalCoverageState from "../components/algorithm-states/IntervalCoverageState";
import BinarySearchState from "../components/algorithm-states/BinarySearchState";

describe("stateRegistry", () => {
  describe("getStateComponent", () => {
    it("returns IntervalCoverageState for 'interval-coverage'", () => {
      const component = getStateComponent("interval-coverage");
      expect(component).toBe(IntervalCoverageState);
    });

    it("returns BinarySearchState for 'binary-search'", () => {
      const component = getStateComponent("binary-search");
      expect(component).toBe(BinarySearchState);
    });

    it("returns fallback component for unknown algorithm", () => {
      const component = getStateComponent("unknown-algorithm");
      expect(component).not.toBe(IntervalCoverageState);
      expect(component).not.toBe(BinarySearchState);
      // Should return the default component (a function)
      expect(typeof component).toBe("function");
    });

    it("logs warning for unknown algorithm", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      getStateComponent("unknown-algorithm");
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("No state component registered")
      );
      consoleSpy.mockRestore();
    });

    it("returns fallback component when algorithmName is null", () => {
      const component = getStateComponent(null);
      expect(typeof component).toBe("function");
    });

    it("returns fallback component when algorithmName is undefined", () => {
      const component = getStateComponent(undefined);
      expect(typeof component).toBe("function");
    });

    it("logs warning when algorithmName is not provided", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
      getStateComponent(null);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("getStateComponent called with null/undefined")
      );
      consoleSpy.mockRestore();
    });
  });

  describe("isStateComponentRegistered", () => {
    it("returns true for 'interval-coverage'", () => {
      expect(isStateComponentRegistered("interval-coverage")).toBe(true);
    });

    it("returns true for 'binary-search'", () => {
      expect(isStateComponentRegistered("binary-search")).toBe(true);
    });

    it("returns false for unknown algorithm", () => {
      expect(isStateComponentRegistered("unknown-algorithm")).toBe(false);
    });

    it("returns false for null", () => {
      expect(isStateComponentRegistered(null)).toBe(false);
    });

    it("returns false for undefined", () => {
      expect(isStateComponentRegistered(undefined)).toBe(false);
    });
  });

  describe("getRegisteredAlgorithms", () => {
    it("returns array of registered algorithm names", () => {
      const algorithms = getRegisteredAlgorithms();
      expect(algorithms).toEqual(
        expect.arrayContaining(["interval-coverage", "binary-search"])
      );
    });

    it("returns array with correct length", () => {
      const algorithms = getRegisteredAlgorithms();
      expect(algorithms).toHaveLength(2);
    });
  });
});
