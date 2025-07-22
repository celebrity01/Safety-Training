import React, { useState, useEffect, useCallback } from "react";
import { useAppContext, Broadcast } from "../types";
import { languageNames } from "../translations";
import { generateEmergencyBroadcast } from "../services/geminiService";
import { LoadingSpinner } from "./LoadingSpinner";

const AlertCard: React.FC<{ broadcast: Broadcast }> = ({ broadcast }) => {
  const { t } = useAppContext();
  const severityStyles = {
    Alert: {
      border: "border-red-500/80",
      text: "text-red-300",
      label: t("alertAlert"),
      glow: "shadow-red-500/30",
      bg: "bg-gradient-to-br from-red-950/80 via-red-900/60 to-black/80",
      overlay: "bg-red-900/20",
    },
    Warning: {
      border: "border-yellow-500/80",
      text: "text-yellow-300",
      label: t("alertWarning"),
      glow: "shadow-yellow-500/30",
      bg: "bg-gradient-to-br from-yellow-950/80 via-yellow-900/60 to-black/80",
      overlay: "bg-yellow-900/20",
    },
    Info: {
      border: "border-blue-500/80",
      text: "text-blue-300",
      label: t("alertInfo"),
      glow: "shadow-blue-500/20",
      bg: "bg-gradient-to-br from-blue-950/80 via-blue-900/60 to-black/80",
      overlay: "bg-blue-900/20",
    },
  };
  const style = severityStyles[broadcast.severity] || severityStyles.Info;

  return (
    <div className="relative overflow-hidden">
      {/* Dark overlay background */}
      <div className={`absolute inset-0 ${style.bg} rounded-xl`}></div>
      <div className={`absolute inset-0 ${style.overlay} rounded-xl`}></div>

      <div
        className={`relative glass-pane rounded-xl p-6 animate-fade-in shadow-2xl ${style.border} ${style.glow} backdrop-blur-sm`}
      >
              <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="text-2xl font-bold text-gray-100 drop-shadow-lg">{broadcast.title}</h3>
          <span
            className={`font-bold text-sm px-3 py-1 rounded-full whitespace-nowrap bg-black/60 ${style.text} border ${style.border} shadow-lg`}
          >
            {style.label}
          </span>
        </div>
        <p className="text-gray-200 mb-5 whitespace-pre-wrap font-light leading-relaxed drop-shadow-md">
          {broadcast.message}
        </p>
      {broadcast.sources && broadcast.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-600/60">
          <h4 className="font-semibold text-gray-300 text-sm mb-2 drop-shadow">
            {t("alertSources")}:
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {broadcast.sources.map((source, index) => (
              <li key={index}>
                                <a
                  href={source.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:text-cyan-200 hover:underline text-sm drop-shadow transition-colors"
                >
                  {source.web.title || source.web.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
              <p className="text-xs text-gray-400 text-right mt-4 drop-shadow">
          {new Date(broadcast.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export const Broadcasts: React.FC = () => {
  const { t, language, unlockAchievement } = useAppContext();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBroadcast = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await generateEmergencyBroadcast(
        languageNames[language],
      );
      let text = response.text?.trim() || "";
      if (text.startsWith("```json")) {
        text = text.substring(7, text.length - 3).trim();
      }
      const newBroadcastData = JSON.parse(text);

      const newBroadcast: Broadcast = {
        ...newBroadcastData,
        timestamp: new Date().toISOString(),
        sources:
          response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
      };
      setBroadcasts((prev) => [newBroadcast, ...prev]);
      unlockAchievement("comms_check");
    } catch (e) {
      setError(t("errorBroadcast"));
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [language, t, unlockAchievement]);

  // Fetch one alert on initial load
  useEffect(() => {
    if (broadcasts.length === 0) {
      fetchBroadcast();
    }
  }, [broadcasts.length, fetchBroadcast]);

  return (
    <div>
      <div className="mb-8 text-center">
        <button
          onClick={fetchBroadcast}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-all disabled:bg-slate-600 disabled:cursor-wait flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30 hover:scale-105 transform"
        >
          {isLoading ? <LoadingSpinner /> : t("checkAlertsButton")}
        </button>
        {isLoading && (
          <p className="text-sm text-slate-400 mt-2">{t("loadingAlerts")}</p>
        )}
      </div>

      {error && (
        <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
          {error}
        </p>
      )}

      <div className="space-y-6">
        {broadcasts.length > 0
          ? broadcasts.map((b, index) => (
              <AlertCard key={index} broadcast={b} />
            ))
          : !isLoading &&
            !error && (
              <p className="text-center text-slate-400 py-10">
                {t("noAlerts")}
              </p>
            )}
      </div>
    </div>
  );
};
