import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useTrace } from "../contexts/TraceContext";
import { useKeyboardHandler } from "../contexts/KeyboardContext";

const AlgorithmSwitcher = () => {
  const {
    currentAlgorithm,
    availableAlgorithms,
    switchAlgorithm: onAlgorithmSwitch,
    loading,
  } = useTrace();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get display name for current algorithm
  const currentAlgorithmDisplay =
    availableAlgorithms.find((alg) => alg.name === currentAlgorithm)
      ?.display_name || currentAlgorithm;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key (Priority 5)
  useKeyboardHandler((event) => {
    if (isOpen && event.key === "Escape") {
      setIsOpen(false);
      return true; // Consume event
    }
    return false;
  }, 5);

  const handleAlgorithmSelect = (algorithmName) => {
    if (algorithmName !== currentAlgorithm && !loading) {
      onAlgorithmSwitch(algorithmName);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => !loading && setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed rounded-lg transition-colors group"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Algorithm Icon */}
        <Search className="w-4 h-4 text-blue-400" />

        {/* Algorithm Name */}
        <span className="text-white font-medium text-sm">
          {currentAlgorithmDisplay}
        </span>

        {/* Dropdown Arrow */}
        <ChevronDown
          className={`w-4 h-4 text-slate-400 group-hover:text-white transition-all ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-64 bg-slate-700 rounded-lg shadow-xl border border-slate-600 z-50 animate-in fade-in slide-in-from-top-2 duration-100"
          role="menu"
        >
          <div className="p-2">
            {/* Header */}
            <div className="text-xs text-slate-400 px-3 py-2 font-semibold uppercase tracking-wider">
              Select Algorithm
            </div>

            {/* Algorithm List */}
            {availableAlgorithms.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-400">
                No algorithms available
              </div>
            ) : (
              <div className="space-y-1">
                {availableAlgorithms.map((algorithm) => {
                  const isCurrent = algorithm.name === currentAlgorithm;
                  return (
                    <button
                      key={algorithm.name}
                      onClick={() => handleAlgorithmSelect(algorithm.name)}
                      disabled={isCurrent}
                      className={`w-full text-left px-3 py-2 rounded-md font-medium text-sm transition-colors ${
                        isCurrent
                          ? "bg-blue-600 text-white cursor-default"
                          : "hover:bg-slate-600 text-slate-200"
                      }`}
                      role="menuitem"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate">
                            {algorithm.display_name}
                          </div>
                          {algorithm.description && (
                            <div className="text-xs text-slate-400 truncate mt-0.5">
                              {algorithm.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmSwitcher;
