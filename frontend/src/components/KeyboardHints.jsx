// Create this as frontend/src/components/KeyboardHints.jsx

import React, { useState } from "react";
import { Keyboard, X } from "lucide-react";

const KeyboardHints = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: ["→", "Space"], action: "Next step" },
    { keys: ["←"], action: "Previous step" },
    { keys: ["R", "Home"], action: "Reset to start" },
    { keys: ["End"], action: "Jump to end" },
    { keys: ["Esc"], action: "Close modal" },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          title="Keyboard shortcuts"
        >
          <Keyboard size={20} />
        </button>
      ) : (
        <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-2xl p-4 w-64">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Keyboard size={18} />
              Keyboard Shortcuts
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="space-y-2">
            {shortcuts.map((shortcut, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex gap-1">
                  {shortcut.keys.map((key, keyIdx) => (
                    <React.Fragment key={keyIdx}>
                      <kbd className="bg-slate-700 text-white px-2 py-1 rounded text-xs font-mono border border-slate-600">
                        {key}
                      </kbd>
                      {keyIdx < shortcut.keys.length - 1 && (
                        <span className="text-slate-500 mx-1">or</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <span className="text-slate-400 text-xs">{shortcut.action}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyboardHints;