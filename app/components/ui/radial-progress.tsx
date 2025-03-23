import { cn } from "@/lib/utils";

interface RadialProgressProps {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RadialProgress({ value = 0, size = "md", className }: RadialProgressProps) {
  const radius = size === "sm" ? 20 : size === "md" ? 35 : 50;
  const strokeWidth = size === "sm" ? 4 : size === "md" ? 6 : 8;
  const normalizedValue = Math.min(100, Math.max(0, value));
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  const getColor = (value: number) => {
    if (value >= 80) return "#0CCE6B"; // Green
    if (value >= 50) return "#FFA400"; // Orange
    return "#FF4E42"; // Red
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        className="transform -rotate-90"
        width={(radius + strokeWidth) * 2}
        height={(radius + strokeWidth) * 2}
      >
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
        />
        <circle
          className="transition-all duration-300 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke={getColor(normalizedValue)}
          fill="transparent"
          r={radius}
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
        />
      </svg>
      <div className="absolute flex items-center justify-center text-gray-700">
        <span className={cn(
          "font-bold",
          size === "sm" ? "text-sm" : size === "md" ? "text-xl" : "text-2xl"
        )}>
          {Math.round(normalizedValue)}
        </span>
      </div>
    </div>
  );
} 