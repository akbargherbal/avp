export const INTERVAL_COLORS = {
  blue: { bg: "bg-blue-800", text: "text-white", border: "border-blue-600" },
  green: {
    bg: "bg-green-600",
    text: "text-white",
    border: "border-green-500",
  },
  amber: {
    bg: "bg-amber-500",
    text: "text-black",
    border: "border-amber-400",
  },
  purple: {
    bg: "bg-purple-600",
    text: "text-white",
    border: "border-purple-500",
  },
};

export const getIntervalColor = (color) =>
  INTERVAL_COLORS[color] || {
    bg: "bg-gray-500",
    text: "text-white",
    border: "border-gray-400",
  };
