import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "brand" | "success" | "warning" | "error";
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "brand",
  className = "",
  label = "Loading",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const strokeWidthMap = {
    sm: "2",
    md: "2.5",
    lg: "3",
    xl: "3.5",
  };

  const colorClasses = {
    primary: "text-primary",
    brand: "text-brand",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      role="status"
      aria-label={label}
      aria-live="polite"
    >
      <svg
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth={strokeWidthMap[size]}
          strokeOpacity="0.15"
          strokeLinecap="round"
        />
        <path
          fill="none"
          stroke={`url(#spinner-gradient-${color})`}
          strokeWidth={strokeWidthMap[size]}
          strokeLinecap="round"
          strokeDasharray="15.71"
          strokeDashoffset="15.71"
          d="M12 2a10 10 0 0 1 10 10"
          opacity="0.9"
        />
        <defs>
          <linearGradient
            id={`spinner-gradient-${color}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor={`var(--${color === "brand" ? "brand-primary" : `color-${color}`})`}
            />
            <stop
              offset="100%"
              stopColor={`var(--${color === "brand" ? "brand-secondary" : `color-${color}-dark`})`}
            />
          </linearGradient>
        </defs>
      </svg>
      <span className="sr-only">{label}...</span>
    </div>
  );
};

// Advanced Loading States Component
export const LoadingState: React.FC<{
  type?: "spinner" | "dots" | "pulse" | "skeleton";
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
  className?: string;
}> = ({ type = "spinner", size = "md", message, className = "" }) => {
  if (type === "dots") {
    return (
      <div
        className={`flex items-center justify-center gap-2 ${className}`}
        role="status"
        aria-label="Loading"
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`rounded-full bg-brand animate-bounce ${
              size === "sm"
                ? "w-2 h-2"
                : size === "md"
                  ? "w-3 h-3"
                  : size === "lg"
                    ? "w-4 h-4"
                    : "w-5 h-5"
            }`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
        {message && (
          <span className="ml-3 text-body text-secondary">{message}</span>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (type === "pulse") {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        role="status"
        aria-label="Loading"
      >
        <div
          className={`rounded-full bg-brand animate-pulse-soft ${
            size === "sm"
              ? "w-8 h-8"
              : size === "md"
                ? "w-12 h-12"
                : size === "lg"
                  ? "w-16 h-16"
                  : "w-20 h-20"
          }`}
        />
        {message && (
          <span className="ml-4 text-body text-secondary">{message}</span>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (type === "skeleton") {
    return (
      <div
        className={`space-y-4 ${className}`}
        role="status"
        aria-label="Loading content"
      >
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <span className="sr-only">Loading content...</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <LoadingSpinner size={size} />
      {message && (
        <p className="mt-4 text-body text-secondary animate-pulse-soft">
          {message}
        </p>
      )}
    </div>
  );
};
