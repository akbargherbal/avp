import React from "react";
import { render, screen } from "@testing-library/react";
import BinarySearchState from "./BinarySearchState";

describe("BinarySearchState", () => {
  const mockTrace = {
    metadata: {
      input_size: 10,
    },
  };

  const createMockStep = (pointers = null, searchSpaceSize = null) => ({
    data: {
      visualization: {
        ...(pointers && { pointers }),
        ...(searchSpaceSize !== null && { search_space_size: searchSpaceSize }),
      },
    },
  });

  it("renders pointers section when pointers data is present", () => {
    const step = createMockStep({ left: 0, right: 9, mid: 4 });
    render(<BinarySearchState step={step} trace={mockTrace} />);

    expect(screen.getByText("Pointers")).toBeInTheDocument();
    expect(screen.getByText("left:")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("right:")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("mid:")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("renders search progress section when search_space_size is present", () => {
    const step = createMockStep(null, 5);
    render(<BinarySearchState step={step} trace={mockTrace} />);

    expect(screen.getByText("Search Progress")).toBeInTheDocument();
    expect(screen.getByText("Space Size:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders both sections when both data types are present", () => {
    const step = createMockStep({ left: 2, right: 7, mid: 4 }, 6);
    render(<BinarySearchState step={step} trace={mockTrace} />);

    expect(screen.getByText("Pointers")).toBeInTheDocument();
    expect(screen.getByText("Search Progress")).toBeInTheDocument();
  });

  it("handles missing step data gracefully", () => {
    const step = { data: {} };
    render(<BinarySearchState step={step} trace={mockTrace} />);

    expect(screen.getByText("No state data available for this step")).toBeInTheDocument();
  });

  it("handles undefined visualization data gracefully", () => {
    const step = null;
    render(<BinarySearchState step={step} trace={mockTrace} />);

    expect(screen.getByText("No state data available for this step")).toBeInTheDocument();
  });

  it("filters out null and undefined pointer values", () => {
    const step = createMockStep({ left: 0, right: 9, mid: null });
    render(<BinarySearchState step={step} trace={mockTrace} />);

    expect(screen.getByText("left:")).toBeInTheDocument();
    expect(screen.getByText("right:")).toBeInTheDocument();
    // mid should not be rendered since it's null
    expect(screen.queryByText("mid:")).not.toBeInTheDocument();
  });

  it("calculates progress bar width correctly", () => {
    const step = createMockStep(null, 5);
    const { container } = render(<BinarySearchState step={step} trace={mockTrace} />);

    // Search space size = 5, input size = 10
    // Progress = 100 - (5/10 * 100) = 50%
    const progressBar = container.querySelector('.bg-blue-500');
    expect(progressBar).toHaveStyle({ width: '50%' });
  });

  it("handles zero search space size", () => {
    const step = createMockStep(null, 0);
    const { container } = render(<BinarySearchState step={step} trace={mockTrace} />);

    // Progress should be 100% when search space is 0
    const progressBar = container.querySelector('.bg-blue-500');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  it("handles missing trace metadata gracefully", () => {
    const step = createMockStep(null, 5);
    render(<BinarySearchState step={step} trace={null} />);

    // Should still render without crashing
    expect(screen.getByText("Search Progress")).toBeInTheDocument();
  });
});
