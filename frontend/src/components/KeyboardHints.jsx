import React, { useState, createContext, useContext } from "react";
import { Keyboard, X } from "lucide-react";
import { useKeyboardHandler } from "../contexts/KeyboardContext";

/**
 * KeyboardHintsContext - Provides access to modal controls
 * Phase 0 Refactoring (Session 53):
 * - Removed floating button (was bottom-right corner)
 * - Modal now controlled via context (StatePanel can trigger it)
 */
const KeyboardHintsContext = createContext({
  openModal: () => {},
  closeModal: () => {},
  isOpen: false,
});

export const useKeyboardHintsModal = () => useContext(KeyboardHintsContext);

export const KeyboardHintsProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: ["→", "Space"], action: "Next step" },
    { keys: ["←"], action: "Previous step" },
    { keys: ["R", "Home"], action: "Reset to start" },
    { keys: ["End"], action: "Jump to end" },
    { keys: ["Esc"], action: "Close modal" },
  ];

  // Handle Escape key to close hints (Priority 5)
  useKeyboardHandler((event) => {
    if (isOpen && event.key === "Escape") {
      setIsOpen(false);
      return true; // Consume event
    }
    return false;
  }, 5);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <KeyboardHintsContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      
      {/* Modal Only - No Floating Button */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-2xl p-6 w-80 transition-all duration-300 transform">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Keyboard size={18} />
                Keyboard Shortcuts
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close keyboard shortcuts"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {shortcuts.map((shortcut, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, keyIdx) => (
                      <React.Fragment key={keyIdx}>
                        <kbd className="bg-slate-700 text-white px-2 py-1 rounded text-xs font-mono border border-slate-600 shadow-sm">
                          {key}
                        </kbd>
                        {keyIdx < shortcut.keys.length - 1 && (
                          <span className="text-slate-500 mx-1">or</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <span className="text-slate-400 text-xs">
                    {shortcut.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </KeyboardHintsContext.Provider>
  );
};

/**
 * Legacy default export for backwards compatibility
 * Can be removed once App.jsx is updated
 */
const KeyboardHints = () => {
  console.warn(
    "KeyboardHints: Using legacy default export. Please migrate to KeyboardHintsProvider."
  );
  return null;
};

export default KeyboardHints;