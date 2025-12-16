import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';

const KeyboardContext = createContext(null);

export const KeyboardProvider = ({ children }) => {
  // Map<Symbol, { priority, handler }>
  const handlersRef = useRef(new Map());

  const registerHandler = useCallback((id, handler, priority = 1) => {
    handlersRef.current.set(id, { handler, priority });
  }, []);

  const unregisterHandler = useCallback((id) => {
    handlersRef.current.delete(id);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Global Input Guard
      if (['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
        return;
      }

      // Sort handlers by priority (descending)
      const sortedHandlers = Array.from(handlersRef.current.values())
        .sort((a, b) => b.priority - a.priority);

      for (const { handler } of sortedHandlers) {
        // Handler should return true if it consumed the event
        const consumed = handler(event);
        if (consumed) {
          // If consumed, we assume preventDefault unless explicitly skipped?
          // Better to let the handler call preventDefault if needed, 
          // but we must stop propagation to lower priorities.
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <KeyboardContext.Provider value={{ registerHandler, unregisterHandler }}>
      {children}
    </KeyboardContext.Provider>
  );
};

export const useKeyboardHandler = (handler, priority = 1) => {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error("useKeyboardHandler must be used within a KeyboardProvider");
  }
  
  const { registerHandler, unregisterHandler } = context;
  const idRef = useRef(Symbol('keyboard-handler'));
  const handlerRef = useRef(handler);

  // Always keep the latest handler ref
  useEffect(() => {
    handlerRef.current = handler;
  });

  // Register on mount / priority change
  useEffect(() => {
    const id = idRef.current;
    // Register a wrapper that calls the current handler
    // This allows the consumer to pass an inline function without re-registering
    registerHandler(id, (e) => handlerRef.current(e), priority);
    
    return () => unregisterHandler(id);
  }, [registerHandler, unregisterHandler, priority]);
};
