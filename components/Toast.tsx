import React, { useState, useEffect } from "react";
import { useAppContext, Toast } from "../types";

// Enhanced SVG Icons with micro-interactions
const XIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    className={`${className} transition-all duration-200 hover:rotate-90`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const SparklesIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={`${className} animate-pulse-soft`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

// Advanced Toast Message Component
const ToastMessage: React.FC<{
  toast: Toast;
  onRemove: (id: number) => void;
}> = ({ toast, onRemove }) => {
  const { t } = useAppContext();
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressInterval);
          return 0;
        }
        return prev - 100 / 40; // 4 seconds / 100ms intervals
      });
    }, 100);

    // Auto-dismiss timer
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      const removeTimer = setTimeout(() => onRemove(toast.id), 300);
      return () => clearTimeout(removeTimer);
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(exitTimer);
    };
  }, [toast.id, onRemove]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      className={`relative max-w-sm w-full pointer-events-auto transition-all duration-300 ease-out ${
        isExiting
          ? "opacity-0 translate-y-2 scale-95"
          : "opacity-100 translate-y-0 scale-100 animate-slide-down"
      }`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Main Toast Content */}
      <div className="card shadow-xl border-l-4 border-l-success overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-success-light to-transparent opacity-10"></div>

        {/* Content */}
        <div className="relative p-4">
          <div className="flex items-start gap-3">
            {/* Achievement Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-success to-success-dark rounded-xl flex items-center justify-center shadow-success animate-float">
                <toast.achievement.icon className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <SparklesIcon className="w-4 h-4 text-success" />
                <p className="text-body-sm font-semibold text-success">
                  {t("toastUnlocked")}
                </p>
              </div>
              <h4 className="text-body font-semibold text-primary mb-1">
                {t(toast.achievement.nameKey)}
              </h4>
              <p className="text-body-sm text-secondary">
                Achievement unlocked!
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 rounded-lg transition-colors duration-200 text-secondary hover:text-primary hover:bg-tertiary group focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
              aria-label="Dismiss notification"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-success-light">
          <div
            className="h-full bg-gradient-to-r from-success to-success-dark transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Celebration Particles (for special achievements) */}
        {toast.achievement.rarity === "legendary" && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-warning rounded-full animate-confetti"
                style={{
                  left: `${20 + i * 10}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "2s",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Toast Manager Component
export const ToastManager: React.FC<{
  toasts: Toast[];
  setToasts: React.Dispatch<React.SetStateAction<Toast[]>>;
}> = ({ toasts, setToasts }) => {
  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-start justify-end p-6 pointer-events-none z-50"
    >
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {/* Clear All Button (when multiple toasts) */}
        {toasts.length > 1 && (
          <div className="pointer-events-auto">
            <button
              onClick={clearAllToasts}
              className="btn btn-ghost btn-sm ml-auto block text-xs"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Toast Messages */}
        {toasts.map((toast) => (
          <ToastMessage key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
};

// Advanced confetti animation keyframes
const style = document.createElement("style");
style.textContent = `
  @keyframes confetti {
    0% {
      transform: translateY(0) rotateZ(0deg) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-100px) rotateZ(720deg) scale(0);
      opacity: 0;
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }
  
  .animate-confetti {
    animation: confetti 2s ease-out forwards;
  }
  
  .animate-float {
    animation: float 2s ease-in-out infinite;
  }
`;

// Only add styles if not already added
if (!document.head.querySelector("#toast-animations")) {
  style.id = "toast-animations";
  document.head.appendChild(style);
}
