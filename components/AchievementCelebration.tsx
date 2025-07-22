import React, { useState, useEffect } from "react";
import { Achievement } from "../types";

interface CelebrationProps {
  achievement: Achievement;
  onComplete: () => void;
}

const SparkleIcon: React.FC<{ className?: string; delay?: number }> = ({
  className = "w-4 h-4",
  delay = 0,
}) => (
  <svg
    className={`${className} animate-ping`}
    style={{ animationDelay: `${delay}ms` }}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ConfettiPiece: React.FC<{
  color: string;
  delay: number;
  duration: number;
}> = ({ color, delay, duration }) => (
  <div
    className={`absolute w-2 h-2 ${color} rounded-full animate-bounce opacity-0`}
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}ms`,
      animationDuration: `${duration}ms`,
      animationFillMode: "forwards",
      animationName: "confetti",
    }}
  />
);

export const AchievementCelebration: React.FC<CelebrationProps> = ({
  achievement,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Allow fade out animation
    }, 4000);

    // Stop confetti after 2 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(confettiTimer);
    };
  }, [onComplete]);

  const getRarityConfig = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return {
          bgGradient: "from-yellow-400 via-yellow-500 to-yellow-600",
          borderColor: "border-yellow-400",
          textColor: "text-yellow-900",
          shadowColor: "shadow-yellow-400",
          emoji: "👑",
          title: "LEGENDARY ACHIEVEMENT!",
        };
      case "rare":
        return {
          bgGradient: "from-purple-400 via-purple-500 to-purple-600",
          borderColor: "border-purple-400",
          textColor: "text-purple-900",
          shadowColor: "shadow-purple-400",
          emoji: "💎",
          title: "RARE ACHIEVEMENT!",
        };
      case "common":
      default:
        return {
          bgGradient: "from-blue-400 via-blue-500 to-blue-600",
          borderColor: "border-blue-400",
          textColor: "text-blue-900",
          shadowColor: "shadow-blue-400",
          emoji: "⭐",
          title: "ACHIEVEMENT UNLOCKED!",
        };
    }
  };

  const config = getRarityConfig(achievement.rarity);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
        {/* Confetti */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <ConfettiPiece
                key={i}
                color={
                  [
                    "bg-yellow-400",
                    "bg-blue-400",
                    "bg-purple-400",
                    "bg-green-400",
                    "bg-red-400",
                    "bg-pink-400",
                  ][i % 6]
                }
                delay={i * 50}
                duration={2000 + Math.random() * 1000}
              />
            ))}
          </div>
        )}

        {/* Achievement Card */}
        <div
          className={`relative max-w-md w-full mx-4 animate-bounce-in`}
          onClick={() => {
            setIsVisible(false);
            setTimeout(onComplete, 300);
          }}
        >
          {/* Sparkles around the card */}
          <div className="absolute -inset-4">
            <SparkleIcon
              className="absolute top-0 left-0 w-6 h-6 text-yellow-400"
              delay={0}
            />
            <SparkleIcon
              className="absolute top-0 right-0 w-4 h-4 text-blue-400"
              delay={200}
            />
            <SparkleIcon
              className="absolute bottom-0 left-0 w-5 h-5 text-purple-400"
              delay={400}
            />
            <SparkleIcon
              className="absolute bottom-0 right-0 w-6 h-6 text-green-400"
              delay={600}
            />
            <SparkleIcon
              className="absolute top-1/2 left-0 w-3 h-3 text-pink-400"
              delay={300}
            />
            <SparkleIcon
              className="absolute top-1/2 right-0 w-4 h-4 text-orange-400"
              delay={500}
            />
          </div>

          <div
            className={`
            bg-gradient-to-br ${config.bgGradient} 
            border-4 ${config.borderColor} 
            rounded-3xl shadow-2xl ${config.shadowColor}
            p-8 text-center relative overflow-hidden
          `}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-white/10 transform rotate-45 scale-150"></div>
              <div className="absolute inset-0 bg-white/5 transform -rotate-45 scale-150"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Title */}
              <div className="text-xl font-bold text-white mb-4 animate-pulse-soft">
                {config.emoji} {config.title}
              </div>

              {/* Achievement Icon */}
              <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center animate-float">
                <achievement.icon className="w-16 h-16 text-white" />
              </div>

              {/* Achievement Name */}
              <h2 className="text-2xl font-bold text-white mb-3">
                {achievement.nameKey.replace(/_/g, " ").toUpperCase()}
              </h2>

              {/* Achievement Description */}
              <p className="text-white/90 text-sm mb-6 leading-relaxed">
                {achievement.descriptionKey.replace(/_/g, " ")}
              </p>

              {/* Rarity Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-semibold uppercase tracking-wide">
                  {achievement.rarity}
                </span>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>

              {/* Tap to dismiss hint */}
              <div className="text-white/70 text-xs animate-pulse-soft">
                Tap anywhere to continue
              </div>
            </div>

            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-3xl border-4 border-white/30 animate-ping"></div>
          </div>
        </div>
      </div>

      {/* Custom CSS for confetti animation */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            opacity: 0;
            transform: translateY(-100vh) rotate(0deg);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(720deg);
          }
        }
      `}</style>
    </>
  );
};

// Hook to manage achievement celebrations
export const useAchievementCelebration = () => {
  const [currentCelebration, setCurrentCelebration] =
    useState<Achievement | null>(null);

  const celebrate = (achievement: Achievement) => {
    setCurrentCelebration(achievement);
  };

  const clearCelebration = () => {
    setCurrentCelebration(null);
  };

  return {
    currentCelebration,
    celebrate,
    clearCelebration,
  };
};
