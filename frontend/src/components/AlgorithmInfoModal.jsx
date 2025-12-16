// src/components/AlgorithmInfoModal.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Loader, X, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AlgorithmInfoModal = ({ isOpen, onClose, title, children, isLoading }) => {
    console.log("AlgorithmInfoModal re-rendered", { isOpen, isLoading });
    if (!isOpen) return null;

    return (
        <div
            id="algorithm-info-modal"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-slate-800 border-2 border-slate-600 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-5 border-b border-slate-700 flex-shrink-0 bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Info className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">{title || 'Algorithm Details'}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3">
                            <Loader className="animate-spin text-blue-400" size={32} />
                            <p className="text-slate-400 text-sm">Loading documentation...</p>
                        </div>
                    ) : (
                        <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown
                                components={{
                                    code({node, inline, className, children, ...props}) {
                                        return <code className="inline bg-slate-700 rounded-sm px-1 py-0.5 font-mono text-xs text-blue-200">{children}</code>
                                    },
                                    h1: ({children}) => <h1 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-slate-700">{children}</h1>,
                                    h2: ({children}) => <h2 className="text-lg font-bold text-white mt-6 mb-3 flex items-center gap-2">{children}</h2>,
                                    p: ({children}) => <p className="text-slate-300 leading-relaxed mb-4">{children}</p>,
                                    ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-4 text-slate-300">{children}</ul>,
                                    li: ({children}) => <li className="ml-2">{children}</li>
                                }}
                            >
                                {children || ''}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

AlgorithmInfoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    children: PropTypes.string,
    isLoading: PropTypes.bool,
};

export default AlgorithmInfoModal;