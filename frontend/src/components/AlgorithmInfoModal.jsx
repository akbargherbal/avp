import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Algorithm Information Modal
 *
 * LOCKED REQUIREMENTS:
 * - Modal ID: #algorithm-info-modal (for testing)
 * - Width: max-w-xl (576px)
 * - Max height: 85vh (scrollable content)
 * - Escape key closes modal
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility
 * @param {Function} props.onClose - Close handler
 * @param {string} props.algorithmName - Current algorithm (e.g., 'binary-search')
 */
const AlgorithmInfoModal = ({ isOpen, onClose, algorithmName }) => {
  const [infoContent, setInfoContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch algorithm info when modal opens or algorithm changes
  useEffect(() => {
    if (!isOpen || !algorithmName) return;

    const fetchInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl =
          process.env.REACT_APP_API_URL || "http://localhost:5000/api";
        const response = await fetch(
          `${apiUrl}/algorithms/${algorithmName}/info`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch algorithm info: ${response.status}`);
        }

        const data = await response.json();
        setInfoContent(data.info);
      } catch (err) {
        console.error("Error fetching algorithm info:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [isOpen, algorithmName]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="algorithm-info-modal"
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-xl border border-slate-700 p-6 max-h-[85vh] flex flex-col animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {/* Info Icon */}
            <svg
              className="w-6 h-6 text-blue-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="8" />
            </svg>
            Algorithm Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 text-red-300">
              <strong>Error:</strong> {error}
            </div>
          )}

          {!loading && !error && infoContent && (
            <div className="prose prose-invert prose-slate max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom styles for markdown elements
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-2xl font-bold text-white mb-4"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-xl font-semibold text-white mt-6 mb-3"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-lg font-semibold text-white mt-4 mb-2"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="text-slate-300 mb-3 leading-relaxed"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-inside ml-4 space-y-1 text-slate-300 mb-3"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-inside ml-4 space-y-1 text-slate-300 mb-3"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-slate-300" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="text-white font-semibold" {...props} />
                  ),
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code
                        className="bg-slate-700 px-1.5 py-0.5 rounded text-sm font-mono text-blue-300"
                        {...props}
                      />
                    ) : (
                      <code
                        className="block bg-slate-900 p-3 rounded-lg text-sm font-mono text-slate-300 overflow-x-auto"
                        {...props}
                      />
                    ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-blue-500 pl-4 italic text-slate-400 my-4"
                      {...props}
                    />
                  ),
                }}
              >
                {infoContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-700 flex justify-end items-center flex-shrink-0">
          <span className="text-xs text-slate-500 mr-4">
            Press <kbd className="kbd">Esc</kbd> to close
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmInfoModal;
