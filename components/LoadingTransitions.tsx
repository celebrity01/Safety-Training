import React, { useState, useEffect } from "react";

interface AdvancedLoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "neural" | "quantum" | "morphic" | "holographic";
  text?: string;
}

export const AdvancedLoading: React.FC<AdvancedLoadingProps> = ({
  size = "md",
  variant = "neural",
  text = "Loading...",
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const renderNeuralLoader = () => (
    <div className="relative">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Central core */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin">
          <div className="absolute inset-2 rounded-full bg-slate-900"></div>
        </div>

        {/* Neural connections */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 60}deg) translateY(-${size === "sm" ? "20" : size === "md" ? "30" : size === "lg" ? "40" : "60"}px)`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div className="absolute w-0.5 h-4 bg-gradient-to-t from-cyan-400 to-transparent origin-bottom animate-pulse"></div>
          </div>
        ))}
      </div>

      {text && (
        <div className="mt-4 text-center">
          <div className="text-cyan-400 font-semibold animate-pulse">
            {text}
          </div>
          <div className="mt-2 w-32 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );

  const renderQuantumLoader = () => (
    <div className="relative">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Quantum particles */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-purple-500 opacity-60"
            style={{
              animation: `quantum-spin ${2 + i * 0.5}s linear infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          ></div>
        ))}

        {/* Central quantum dot */}
        <div className="absolute inset-1/3 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse shadow-lg shadow-purple-500/50"></div>
      </div>

      {text && (
        <div className="mt-4 text-center text-purple-400 font-semibold animate-pulse">
          {text}
        </div>
      )}
    </div>
  );

  const renderMorphicLoader = () => (
    <div className="relative">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full animate-bounce">
          <div className="absolute inset-1 bg-slate-900 rounded-full"></div>
          <div className="absolute inset-2 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full opacity-60 animate-ping"></div>
        </div>
      </div>

      {text && (
        <div className="mt-4 text-center text-emerald-400 font-semibold">
          {text}
        </div>
      )}
    </div>
  );

  const renderHolographicLoader = () => (
    <div className="relative">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-spin">
          <div className="absolute inset-0.5 rounded-full bg-slate-900"></div>
          <div className="absolute inset-1 rounded-full bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 animate-pulse"></div>
        </div>

        {/* Holographic scanlines */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div
            className="absolute inset-x-0 h-0.5 bg-cyan-400 animate-pulse"
            style={{ top: "25%" }}
          ></div>
          <div
            className="absolute inset-x-0 h-0.5 bg-blue-500 animate-pulse"
            style={{ top: "50%", animationDelay: "0.1s" }}
          ></div>
          <div
            className="absolute inset-x-0 h-0.5 bg-purple-600 animate-pulse"
            style={{ top: "75%", animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>

      {text && (
        <div className="mt-4 text-center">
          <div className="text-cyan-400 font-mono font-semibold animate-pulse">
            {text}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            ◊ QUANTUM PROCESSING ◊
          </div>
        </div>
      )}
    </div>
  );

  const loaders = {
    neural: renderNeuralLoader,
    quantum: renderQuantumLoader,
    morphic: renderMorphicLoader,
    holographic: renderHolographicLoader,
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes quantum-spin {
        0% { 
          transform: rotate(0deg) scale(1);
          opacity: 0.6;
        }
        50% { 
          transform: rotate(180deg) scale(1.1);
          opacity: 1;
        }
        100% { 
          transform: rotate(360deg) scale(1);
          opacity: 0.6;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {loaders[variant]()}
    </div>
  );
};

interface PageTransitionProps {
  isTransitioning: boolean;
  direction?: "left" | "right" | "up" | "down";
  variant?: "slide" | "fade" | "scale" | "morphic";
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  isTransitioning,
  direction = "right",
  variant = "morphic",
  children,
}) => {
  const getTransitionClasses = () => {
    if (!isTransitioning)
      return "opacity-100 scale-100 translate-x-0 translate-y-0";

    switch (variant) {
      case "slide":
        switch (direction) {
          case "left":
            return "opacity-0 -translate-x-full";
          case "right":
            return "opacity-0 translate-x-full";
          case "up":
            return "opacity-0 -translate-y-full";
          case "down":
            return "opacity-0 translate-y-full";
          default:
            return "opacity-0 translate-x-full";
        }
      case "fade":
        return "opacity-0";
      case "scale":
        return "opacity-0 scale-75";
      case "morphic":
        return "opacity-0 scale-110 blur-sm";
      default:
        return "opacity-0";
    }
  };

  return (
    <div
      className={`transition-all duration-500 ease-out transform ${getTransitionClasses()}`}
    >
      {children}
    </div>
  );
};

interface SkeletonProps {
  lines?: number;
  variant?: "text" | "card" | "avatar" | "image";
  className?: string;
}

export const AdvancedSkeleton: React.FC<SkeletonProps> = ({
  lines = 3,
  variant = "text",
  className = "",
}) => {
  const renderTextSkeleton = () => (
    <div className={`space-y-3 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded animate-pulse"
          style={{
            width: i === lines - 1 ? "75%" : "100%",
            animationDelay: `${i * 0.1}s`,
          }}
        ></div>
      ))}
    </div>
  );

  const renderCardSkeleton = () => (
    <div className={`neo-card p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full animate-pulse"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-3/4 animate-pulse"></div>
          <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-1/2 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse"></div>
            <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-5/6 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAvatarSkeleton = () => (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-24 animate-pulse"></div>
        <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-16 animate-pulse"></div>
      </div>
    </div>
  );

  const renderImageSkeleton = () => (
    <div
      className={`aspect-video bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-lg animate-pulse ${className}`}
    ></div>
  );

  const skeletons = {
    text: renderTextSkeleton,
    card: renderCardSkeleton,
    avatar: renderAvatarSkeleton,
    image: renderImageSkeleton,
  };

  return skeletons[variant]();
};

export default {
  AdvancedLoading,
  PageTransition,
  AdvancedSkeleton,
};
