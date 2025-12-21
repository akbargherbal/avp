// frontend/src/utils/visualizationRegistry.js
/**
 * Visualization Registry
 *
 * Phase 3: Maps visualization types to React components.
 * Allows algorithms to declare their visualization needs via metadata,
 * and the frontend dynamically selects the correct component.
 *
 * Updated (Dec 21, 2025): Added interval-coverage visualization type
 *
 * Usage:
 *   const Component = getVisualizationComponent(trace.metadata.visualization_type);
 *   return <Component step={step} config={trace.metadata.visualization_config} />;
 */
import TimelineView from "../components/visualizations/TimelineView";
import ArrayView from "../components/visualizations/ArrayView";
import MergeSortVisualization from "../components/visualizations/MergeSortVisualization";
import IntervalCoverageVisualization from "../components/visualizations/IntervalCoverageVisualization";

/**
 * Registry mapping visualization types to components.
 *
 * Key = visualization_type from backend metadata
 * Value = React component
 */
const VISUALIZATION_REGISTRY = {
  // Interval Coverage algorithm - LSP tree + timeline composite
  // Updated Dec 21, 2025: Changed from "timeline" to "interval-coverage"
  // to use new composite visualization (RecursiveCallStackView + TimelineView)
  "interval-coverage": IntervalCoverageVisualization,

  // Legacy timeline view (kept for backward compatibility)
  // Used by older interval coverage traces before migration
  timeline: TimelineView,

  // Binary Search and other array algorithms
  array: ArrayView,

  // Merge Sort - LSP tree + array comparison
  // Note: Changed from "timeline" to "merge-sort" for clarity
  // Merge sort needs custom 2-column layout (LSP tree + main area)
  "merge-sort": MergeSortVisualization,

  // Future: Graph algorithms (DFS, BFS, Dijkstra)
  // graph: GraphView,

  // Future: Tree algorithms (BST, Heap)
  // tree: TreeView,

  // Future: Matrix algorithms (Dynamic Programming)
  // matrix: MatrixView,
};

/**
 * Retrieve visualization component by type.
 * Falls back to TimelineView if type not found (backward compatibility).
 *
 * @param {string} type - Visualization type from backend metadata
 * @returns {React.Component} - Visualization component
 */
export const getVisualizationComponent = (type) => {
  if (!type) {
    console.warn("No visualization type specified, using default (timeline)");
    return TimelineView;
  }

  const component = VISUALIZATION_REGISTRY[type];

  if (!component) {
    console.warn(
      `Unknown visualization type: ${type}, falling back to timeline`,
    );
    return TimelineView;
  }

  return component;
};

/**
 * Get list of all registered visualization types.
 * Useful for debugging and validation.
 *
 * @returns {string[]} - Array of visualization type keys
 */
export const getRegisteredTypes = () => {
  return Object.keys(VISUALIZATION_REGISTRY);
};

/**
 * Check if a visualization type is registered.
 *
 * @param {string} type - Visualization type to check
 * @returns {boolean}
 */
export const isVisualizationTypeRegistered = (type) => {
  return type in VISUALIZATION_REGISTRY;
};

const registry = {
  getVisualizationComponent,
  getRegisteredTypes,
  isVisualizationTypeRegistered,
};

export default registry;
