/**
 * State Component Registry
 * 
 * Maps algorithm names to their corresponding state components (RIGHT panel).
 * Mirrors the pattern from visualizationRegistry.js but for algorithm-specific state displays.
 * 
 * Phase 3 of frontend refactoring: Registry-based architecture for state components.
 */

import BinarySearchState from '../components/visualizations/BinarySearchState';
import IntervalCoverageState from '../components/visualizations/IntervalCoverageState';

/**
 * Fallback component for algorithms without a registered state component
 */
const DefaultStateComponent = ({ step }) => {
  return (
    <div className="text-slate-400 text-sm">
      <p className="mb-2">Algorithm state display not configured.</p>
      <p className="text-xs">Algorithm: {step?.metadata?.algorithm || 'unknown'}</p>
    </div>
  );
};

/**
 * Registry mapping algorithm names to state components
 * 
 * @type {Object.<string, React.Component>}
 */
const STATE_REGISTRY = {
  'binary-search': BinarySearchState,
  'interval-coverage': IntervalCoverageState,
};

/**
 * Get the state component for a given algorithm
 * 
 * @param {string} algorithmName - The algorithm identifier (e.g., 'binary-search')
 * @returns {React.Component} The state component for this algorithm, or DefaultStateComponent
 * 
 * @example
 * const StateComponent = getStateComponent('binary-search');
 * <StateComponent step={step} trace={trace} />
 */
export const getStateComponent = (algorithmName) => {
  if (!algorithmName) {
    console.warn('getStateComponent called with null/undefined algorithmName');
    return DefaultStateComponent;
  }

  const component = STATE_REGISTRY[algorithmName];
  
  if (!component) {
    console.warn(`No state component registered for algorithm: ${algorithmName}`);
    return DefaultStateComponent;
  }

  return component;
};

/**
 * Check if an algorithm has a registered state component
 * 
 * @param {string} algorithmName - The algorithm identifier
 * @returns {boolean} True if a state component is registered
 */
export const isStateComponentRegistered = (algorithmName) => {
  return algorithmName && STATE_REGISTRY.hasOwnProperty(algorithmName);
};

/**
 * Get list of all algorithms with registered state components
 * 
 * @returns {string[]} Array of algorithm names
 */
export const getRegisteredAlgorithms = () => {
  return Object.keys(STATE_REGISTRY);
};