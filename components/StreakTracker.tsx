import React, { useState, useEffect } from "react";
import { useAppContext } from "../types";

interface StreakData {
  current: number;
  longest: number;
  lastActivity: Date | null;
  weeklyGoal: number;
  thisWeek: number;
}

const FireIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2s3 3 3 7.5c0 3-1.5 5.5-3 5.5s-3-2.5-3-5.5C9 5 12 2 12 2z" />
    <path d="M8 10s2 2 2 4c0 1.5-1 2.5-2 2.5s-2-1-2-2.5c0-2 2-4 2-4z" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const TrophyIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    />
  </svg>
);

export const StreakTracker: React.FC = () => {
  const { level } = useAppContext();
  const [streakData, setStreakData] = useState<StreakData>({
    current: 7,
    longest: 12,
    lastActivity: new Date(),
    weeklyGoal: 5,
    thisWeek: 3,
  });
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Load streak data from localStorage
    const savedStreak = localStorage.getItem("safety_training_streak");
    if (savedStreak) {
      const parsed = JSON.parse(savedStreak);
      setStreakData({
        ...parsed,
        lastActivity: parsed.lastActivity
          ? new Date(parsed.lastActivity)
          : null,
      });
    }

    // Check if we should show celebration for reaching milestones
    if (streakData.current > 0 && streakData.current % 7 === 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, []);

  const getDaysOfWeek = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date().getDay();
    const thisWeekActivity = [true, true, true, false, false, false, false]; // Mock data

    return days.map((day, index) => ({
      name: day,
      isToday: index === today,
      hasActivity: thisWeekActivity[index],
      isPast: index < today,
    }));
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥";
    if (streak >= 14) return "⚡";
    if (streak >= 7) return "🌟";
    if (streak >= 3) return "✨";
    return "💪";
  };

  const getMotivationalMessage = () => {
    const messages = [
      "You're on fire! Keep up the great work!",
      "Consistency builds expertise!",
      "Every day counts towards safety mastery!",
      "Your dedication is inspiring!",
      "Building life-saving habits daily!",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="space-y-6">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="animate-bounce-in">
            <div className="text-6xl mb-4 text-center animate-pulse-soft">
              🎉
            </div>
            <div className="card p-6 text-center bg-gradient-brand text-white shadow-2xl">
              <h3 className="text-heading-2 font-bold mb-2">
                Streak Milestone!
              </h3>
              <p className="text-body">
                You've maintained your training for {streakData.current} days!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Streak Display */}
      <div className="card card-elevated bg-gradient-to-br from-warning-light via-white to-brand-primary-light">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FireIcon
              className={`w-8 h-8 ${streakData.current > 0 ? "text-warning animate-pulse-soft" : "text-gray-400"}`}
            />
            <h3 className="text-heading-2 font-display">Training Streak</h3>
          </div>

          <div className="mb-4">
            <div className="text-6xl font-display text-warning mb-2 animate-float">
              {streakData.current}
            </div>
            <div className="text-body text-secondary">
              {streakData.current === 1 ? "day" : "days"} in a row
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-secondary mb-4">
            <div className="flex items-center gap-1">
              <TrophyIcon className="w-4 h-4 text-brand" />
              <span>Best: {streakData.longest} days</span>
            </div>
            <div className="text-2xl">{getStreakEmoji(streakData.current)}</div>
          </div>

          <div className="bg-white/80 rounded-xl p-3">
            <p className="text-sm text-brand font-medium">
              {getMotivationalMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-heading-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-brand" />
            This Week's Progress
          </h4>
          <span className="text-sm text-secondary">
            {streakData.thisWeek}/{streakData.weeklyGoal} sessions
          </span>
        </div>

        {/* Days of the week */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {getDaysOfWeek().map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-secondary mb-1">{day.name}</div>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                  day.hasActivity
                    ? "bg-success text-white shadow-success"
                    : day.isToday
                      ? "bg-brand-primary-light border-2 border-brand text-brand"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {day.hasActivity ? "✓" : day.isToday ? "⭘" : ""}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-secondary">Weekly Goal Progress</span>
            <span className="font-medium text-brand">
              {Math.round((streakData.thisWeek / streakData.weeklyGoal) * 100)}%
            </span>
          </div>
          <div className="progress progress-lg">
            <div
              className="progress-bar bg-gradient-to-r from-success to-brand"
              style={{
                width: `${Math.min((streakData.thisWeek / streakData.weeklyGoal) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {streakData.thisWeek >= streakData.weeklyGoal ? (
          <div className="bg-success-light rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-sm font-medium text-success-dark">
              Weekly goal achieved! Excellent work!
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-secondary">
            {streakData.weeklyGoal - streakData.thisWeek} more session
            {streakData.weeklyGoal - streakData.thisWeek !== 1 ? "s" : ""} to
            reach your weekly goal
          </div>
        )}
      </div>

      {/* Streak Milestones */}
      <div className="card">
        <h4 className="text-heading-4 mb-4 flex items-center gap-2">
          <TrophyIcon className="w-5 h-5 text-brand" />
          Streak Milestones
        </h4>

        <div className="space-y-3">
          {[
            {
              days: 3,
              emoji: "✨",
              title: "Getting Started",
              unlocked: streakData.current >= 3,
            },
            {
              days: 7,
              emoji: "🌟",
              title: "One Week Strong",
              unlocked: streakData.current >= 7,
            },
            {
              days: 14,
              emoji: "⚡",
              title: "Two Week Champion",
              unlocked: streakData.current >= 14,
            },
            {
              days: 30,
              emoji: "🔥",
              title: "Monthly Master",
              unlocked: streakData.current >= 30,
            },
          ].map((milestone, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                milestone.unlocked
                  ? "bg-success-light border border-success"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div
                className={`text-2xl ${milestone.unlocked ? "animate-pulse-soft" : "grayscale"}`}
              >
                {milestone.emoji}
              </div>
              <div className="flex-1">
                <div
                  className={`font-medium ${milestone.unlocked ? "text-success-dark" : "text-gray-600"}`}
                >
                  {milestone.title}
                </div>
                <div className="text-sm text-gray-500">
                  {milestone.days} days of consistent training
                </div>
              </div>
              {milestone.unlocked && (
                <div className="text-success">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
