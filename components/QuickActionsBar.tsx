import React, { useState, useEffect } from "react";
import { useAppContext } from "../types";

// Emergency Action Icons
const EmergencyIcon: React.FC<{ className?: string }> = ({
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

const PhoneIcon: React.FC<{ className?: string }> = ({
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
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const MapIcon: React.FC<{ className?: string }> = ({
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
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({
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
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

interface EmergencyContact {
  name: string;
  number: string;
  type: "emergency" | "medical" | "fire" | "police";
}

export const QuickActionsBar: React.FC = () => {
  const { location } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [emergencyContacts] = useState<EmergencyContact[]>([
    { name: "Emergency Services", number: "199", type: "emergency" },
    { name: "Fire Service", number: "191", type: "fire" },
    { name: "Police", number: "199", type: "police" },
    { name: "Medical Emergency", number: "199", type: "medical" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const handleEmergencyCall = (number: string, name: string) => {
    if (
      window.confirm(
        `Call ${name} at ${number}?\n\nNote: This will attempt to open your phone app.`,
      )
    ) {
      window.open(`tel:${number}`, "_self");
    }
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case "fire":
        return "🚒";
      case "police":
        return "👮";
      case "medical":
        return "🚑";
      default:
        return "🚨";
    }
  };

  return (
    <>
      {/* Quick Actions Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group ${
            isExpanded
              ? "bg-error text-white rotate-45 scale-110"
              : "bg-gradient-brand text-white hover:scale-110 animate-pulse-soft"
          }`}
          aria-label="Emergency Quick Actions"
        >
          {isExpanded ? (
            <svg
              className="w-8 h-8"
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
          ) : (
            <EmergencyIcon className="w-8 h-8 group-hover:animate-bounce" />
          )}
        </button>

        {/* Quick Actions Panel */}
        {isExpanded && (
          <div className="absolute bottom-20 right-0 w-80 animate-scale-in">
            <div className="card-elevated backdrop-blur-lg bg-white/95 border border-gray-200">
              {/* Header */}
              <div className="border-b border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-heading-4 text-error font-bold flex items-center gap-2">
                    🚨 Emergency Actions
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ClockIcon className="w-3 h-3" />
                    {formatTime(currentTime)}
                  </div>
                </div>
                {location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapIcon className="w-4 h-4" />
                    <span>📍 {location}, Nigeria</span>
                  </div>
                )}
              </div>

              {/* Emergency Contacts */}
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Emergency Contacts
                </h4>
                <div className="space-y-2">
                  {emergencyContacts.map((contact, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleEmergencyCall(contact.number, contact.name)
                      }
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-error-light transition-all duration-200 group border border-transparent hover:border-error"
                    >
                      <div className="text-2xl">
                        {getContactIcon(contact.type)}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900 group-hover:text-error">
                          {contact.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          📞 {contact.number}
                        </div>
                      </div>
                      <PhoneIcon className="w-5 h-5 text-gray-400 group-hover:text-error" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Tips */}
              <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-brand-primary-light to-brand-secondary-light">
                <div className="text-xs text-gray-700">
                  <div className="font-semibold mb-1">💡 Emergency Tip:</div>
                  <div>
                    Stay calm, speak clearly, and provide your exact location
                    when calling emergency services.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};
