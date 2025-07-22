import React, { useState, useEffect } from "react";
import { useAppContext } from "../types";

interface Activity {
  id: string;
  type: "achievement" | "training" | "alert" | "milestone";
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  color: string;
}

const BellIcon: React.FC<{ className?: string }> = ({
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
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const ActivityIcon: React.FC<{ className?: string }> = ({
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
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

export const ActivityFeed: React.FC = () => {
  const { location, level, unlockedAchievements } = useAppContext();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Generate realistic activities
  useEffect(() => {
    const generateActivity = (): Activity => {
      const activityTypes = [
        {
          type: "training" as const,
          title: "Training Session Completed",
          description: "Successfully completed Urban Fire Emergency scenario",
          icon: "🎯",
          color: "text-brand",
        },
        {
          type: "achievement" as const,
          title: "New Achievement Unlocked",
          description: "Fire Fighter badge earned",
          icon: "🏆",
          color: "text-warning",
        },
        {
          type: "alert" as const,
          title: "Weather Alert",
          description: `Heavy rainfall expected in ${location || "your area"}`,
          icon: "🌧️",
          color: "text-info",
        },
        {
          type: "milestone" as const,
          title: "Level Up!",
          description: `Reached Level ${level}`,
          icon: "⭐",
          color: "text-success",
        },
      ];

      const randomActivity =
        activityTypes[Math.floor(Math.random() * activityTypes.length)];

      return {
        id: `activity-${Date.now()}-${Math.random()}`,
        ...randomActivity,
        timestamp: new Date(Date.now() - Math.random() * 3600000), // Random time within last hour
      };
    };

    // Initialize with some activities
    const initialActivities = Array.from({ length: 5 }, generateActivity);
    setActivities(
      initialActivities.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
      ),
    );

    // Add new activities periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance every 10 seconds
        const newActivity = generateActivity();
        setActivities((prev) => [newActivity, ...prev.slice(0, 9)]); // Keep only 10 latest
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [location, level]);

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-24 right-6 bg-gradient-brand text-white p-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-200 z-30 animate-bounce-in"
        aria-label="Show Activity Feed"
      >
        <BellIcon className="w-5 h-5" />
        {activities.length > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {Math.min(activities.length, 9)}
            </span>
          </div>
        )}
      </button>
    );
  }

  return (
    <>
      {/* Activity Feed Panel */}
      <div className="fixed top-24 right-6 w-80 max-h-96 z-40 animate-scale-in">
        <div className="card-elevated backdrop-blur-lg bg-white/95 border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-brand" />
              <h3 className="text-heading-4 font-semibold">Live Activity</h3>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Activity List */}
          <div className="max-h-80 overflow-y-auto">
            {activities.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <ActivityIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="p-4 hover:bg-gray-50 transition-colors duration-200 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0 mt-1">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4
                            className={`font-medium ${activity.color} truncate`}
                          >
                            {activity.title}
                          </h4>
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {timeAgo(activity.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        {activity.type === "alert" && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-light text-warning-dark">
                              📢 Active Alert
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <div className="text-center">
              <span className="text-xs text-gray-500">
                🔄 Updates every 10 seconds
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30"
        onClick={() => setIsVisible(false)}
      />
    </>
  );
};
