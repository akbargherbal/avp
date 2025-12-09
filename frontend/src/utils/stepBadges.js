export const getStepTypeBadge = (stepType) => {
  if (!stepType)
    return { color: "bg-slate-600 text-slate-200", label: "UNKNOWN" };

  const type = stepType.toUpperCase();

  // Decision points (most important)
  if (type.includes("DECISION")) {
    return {
      color: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50",
      label: "⚖️ DECISION",
    };
  }

  // Coverage tracking
  if (type.includes("MAX_END")) {
    return {
      color: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50",
      label: "📏 COVERAGE",
    };
  }

  // Examining intervals
  if (type.includes("EXAMINING")) {
    return {
      color: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50",
      label: "🔍 EXAMINE",
    };
  }

  // Recursion (calls and returns)
  if (type.includes("CALL_START") || type.includes("CALL_RETURN")) {
    return {
      color: "bg-blue-500/20 text-blue-300 border border-blue-500/50",
      label: "🔄 RECURSION",
    };
  }

  // Base case
  if (type.includes("BASE_CASE")) {
    return {
      color: "bg-purple-500/20 text-purple-300 border border-purple-500/50",
      label: "🎯 BASE CASE",
    };
  }

  // Sorting
  if (type.includes("SORT")) {
    return {
      color: "bg-orange-500/20 text-orange-300 border border-orange-500/50",
      label: "📊 SORT",
    };
  }

  // Algorithm states
  if (type.includes("INITIAL") || type.includes("COMPLETE")) {
    return {
      color: "bg-pink-500/20 text-pink-300 border border-pink-500/50",
      label: "🎬 STATE",
    };
  }

  // Default
  return {
    color: "bg-slate-600/50 text-slate-300",
    label: type.replace(/_/g, " "),
  };
};
