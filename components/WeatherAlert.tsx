import React, { useState, useEffect } from "react";
import { useAppContext } from "../types";

interface WeatherAlert {
  id: string;
  type: "thunderstorm" | "flood" | "heatwave" | "windstorm" | "fog";
  severity: "low" | "moderate" | "high" | "extreme";
  title: string;
  description: string;
  timestamp: Date;
  expiryTime: Date;
  safetyTips: string[];
}

const CloudIcon: React.FC<{ className?: string }> = ({
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
      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
    />
  </svg>
);

const AlertTriangleIcon: React.FC<{ className?: string }> = ({
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
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
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
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export const WeatherAlert: React.FC = () => {
  const { location } = useAppContext();
  const [currentAlert, setCurrentAlert] = useState<WeatherAlert | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [temperature, setTemperature] = useState(28);

  useEffect(() => {
    // Simulate weather alert generation based on location
    const generateAlert = (): WeatherAlert | null => {
      if (!location) return null;

      const alertTypes = [
        {
          type: "thunderstorm" as const,
          severity: "moderate" as const,
          title: "Thunderstorm Warning",
          description: `Heavy thunderstorms expected in ${location} between 2:00 PM - 6:00 PM today.`,
          safetyTips: [
            "Stay indoors and avoid electrical appliances",
            "Don't take shelter under trees",
            "Avoid using phones during lightning",
            "Stay away from windows and doors",
          ],
          emoji: "⛈️",
        },
        {
          type: "flood" as const,
          severity: "high" as const,
          title: "Flood Alert",
          description: `Heavy rainfall may cause flooding in low-lying areas of ${location}.`,
          safetyTips: [
            "Avoid driving through flooded roads",
            "Move to higher ground if necessary",
            "Keep emergency supplies ready",
            "Monitor radio for updates",
          ],
          emoji: "🌊",
        },
        {
          type: "heatwave" as const,
          severity: "moderate" as const,
          title: "Heat Advisory",
          description: `High temperatures expected in ${location} today. Stay hydrated and cool.`,
          safetyTips: [
            "Drink plenty of water",
            "Avoid outdoor activities during peak hours",
            "Wear light-colored clothing",
            "Check on elderly neighbors",
          ],
          emoji: "🌡️",
        },
      ];

      // 40% chance of having an alert
      if (Math.random() > 0.6) {
        const randomAlert =
          alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const now = new Date();

        return {
          id: `alert-${Date.now()}`,
          ...randomAlert,
          timestamp: now,
          expiryTime: new Date(now.getTime() + 6 * 60 * 60 * 1000), // 6 hours from now
        };
      }

      return null;
    };

    // Generate initial alert
    const alert = generateAlert();
    setCurrentAlert(alert);

    // Update temperature periodically
    const tempInterval = setInterval(() => {
      setTemperature((prev) => prev + (Math.random() - 0.5) * 2);
    }, 30000);

    // Check for new alerts periodically
    const alertInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        // 20% chance every 2 minutes
        const newAlert = generateAlert();
        if (newAlert) {
          setCurrentAlert(newAlert);
          setIsDismissed(false);
        }
      }
    }, 120000);

    return () => {
      clearInterval(tempInterval);
      clearInterval(alertInterval);
    };
  }, [location]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-info border-info bg-info-light";
      case "moderate":
        return "text-warning border-warning bg-warning-light";
      case "high":
        return "text-error border-error bg-error-light";
      case "extreme":
        return "text-error border-error bg-error";
      default:
        return "text-gray-600 border-gray-300 bg-gray-100";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low":
        return "ℹ️";
      case "moderate":
        return "⚠️";
      case "high":
        return "🚨";
      case "extreme":
        return "🆘";
      default:
        return "📢";
    }
  };

  const getWeatherEmoji = (type: string) => {
    switch (type) {
      case "thunderstorm":
        return "⛈️";
      case "flood":
        return "🌊";
      case "heatwave":
        return "🌡️";
      case "windstorm":
        return "💨";
      case "fog":
        return "🌫️";
      default:
        return "🌤️";
    }
  };

  if (!currentAlert || isDismissed) {
    return (
      <div className="fixed top-24 left-6 z-30">
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-xl shadow-lg animate-bounce-in">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🌤️</div>
            <div>
              <div className="font-semibold">{Math.round(temperature)}°C</div>
              <div className="text-xs opacity-90">
                {location || "Your Location"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-24 left-6 w-80 z-40 animate-slide-down">
      <div
        className={`card border-2 ${getSeverityColor(currentAlert.severity)} shadow-xl`}
      >
        {/* Alert Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl animate-pulse-soft">
              {getWeatherEmoji(currentAlert.type)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                {currentAlert.title}
                <span className="text-sm">
                  {getSeverityIcon(currentAlert.severity)}
                </span>
              </h3>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <CloudIcon className="w-3 h-3" />
                {location}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Alert Description */}
        <p className="text-sm text-gray-700 mb-4">{currentAlert.description}</p>

        {/* Safety Tips */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <AlertTriangleIcon className="w-4 h-4" />
            Safety Guidelines:
          </h4>
          <ul className="space-y-1">
            {currentAlert.safetyTips.slice(0, 3).map((tip, index) => (
              <li
                key={index}
                className="text-xs text-gray-600 flex items-start gap-2"
              >
                <span className="text-success mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Time Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-200 pt-3">
          <span>Issued: {currentAlert.timestamp.toLocaleTimeString()}</span>
          <span>Expires: {currentAlert.expiryTime.toLocaleTimeString()}</span>
        </div>

        {/* Action Button */}
        <div className="mt-3">
          <button className="w-full btn btn-sm bg-gradient-brand text-white hover:scale-105 transition-all duration-200">
            📱 View Full Weather Report
          </button>
        </div>
      </div>
    </div>
  );
};
