import React, { useState, useEffect } from "react";
import { useAppContext } from "../types";
import { getPersonalizedRecommendations } from "../services/geminiService";
import {
  NIGERIAN_STATES,
  SCENARIO_CATEGORIES,
  AlertBellIcon,
  BrainIcon,
  LightbulbIcon,
} from "../constants";
import { StreakTracker } from "./StreakTracker";
import { WeatherAlert } from "./WeatherAlert";
import { QuickActionsBar } from "./QuickActionsBar";
import { ActivityFeed } from "./ActivityFeed";

interface Recommendation {
  contextualAlert: string;
  trainingRecommendationKey: string;
  trainingRecommendationReason: string;
  preparednessTip: string;
}

// Enhanced SVG Icons
const LocationIcon: React.FC<{ className?: string }> = ({
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

const PlayIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({
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
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ChartBarIcon: React.FC<{ className?: string }> = ({
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
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const FireIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2s3 3 3 7.5c0 3-1.5 5.5-3 5.5s-3-2.5-3-5.5C9 5 12 2 12 2z" />
    <path d="M8 10s2 2 2 4c0 1.5-1 2.5-2 2.5s-2-1-2-2.5c0-2 2-4 2-4z" />
  </svg>
);

const TrendingUpIcon: React.FC<{ className?: string }> = ({
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
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

// Progress Ring Component
const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  value?: string;
  color?: string;
  className?: string;
}> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  label,
  value,
  color = "brand",
  className = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--gray-200)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#gradient-${color})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient
            id={`gradient-${color}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor={
                color === "brand"
                  ? "var(--brand-primary)"
                  : `var(--color-${color})`
              }
            />
            <stop
              offset="100%"
              stopColor={
                color === "brand"
                  ? "var(--brand-secondary)"
                  : `var(--color-${color}-dark)`
              }
            />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {value && (
          <div className="text-heading-2 font-display text-brand">{value}</div>
        )}
        {label && <div className="text-caption text-center">{label}</div>}
      </div>
    </div>
  );
};

// Simple State Dropdown
const StateDropdown: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (state: string) => void;
}> = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStates = NIGERIAN_STATES.filter((state) =>
    state.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const popularStates = [
    "Lagos",
    "FCT - Abuja",
    "Rivers",
    "Kano",
    "Ogun",
    "Kaduna",
  ];

  const handleSelect = (state: string) => {
    onSelect(state);
    onClose();
    setSearchTerm("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white shadow-xl max-w-sm w-full animate-scale-in border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-brand flex items-center justify-center">
                <LocationIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Your State
                </h3>
                <p className="text-sm text-gray-500">🇳🇬 Choose your location</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg
                className="w-4 h-4 text-gray-500"
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
        </div>

        {/* Quick Select Popular States */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">
            Popular
          </p>
          <div className="grid grid-cols-2 gap-2">
            {popularStates.map((state) => (
              <button
                key={state}
                onClick={() => handleSelect(state)}
                className="p-3 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-brand-primary hover:text-white transition-all duration-200 border border-gray-200 hover:border-brand-primary"
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative mb-3">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search all 37 states..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-brand-primary focus:ring-0 text-sm transition-all"
            />
          </div>

          {/* States List */}
          <div className="max-h-48 overflow-y-auto">
            {searchTerm && (
              <p className="text-xs text-gray-500 mb-2 px-1">
                {filteredStates.length} state
                {filteredStates.length !== 1 ? "s" : ""} found
              </p>
            )}

            {filteredStates.length === 0 && searchTerm ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No states found</p>
                <p className="text-xs text-gray-400">Try a different search</p>
              </div>
            ) : (
              <div className="space-y-1">
                {(searchTerm ? filteredStates : NIGERIAN_STATES).map(
                  (state) => (
                    <button
                      key={state}
                      onClick={() => handleSelect(state)}
                      className="w-full text-left p-3 text-sm text-gray-700 hover:bg-brand-primary hover:text-white transition-all duration-200 flex items-center justify-between group"
                    >
                      <span>{state}</span>
                      <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Welcome Hero Section
const WelcomeHero: React.FC = () => {
  const { setView, location, setLocation } = useAppContext();
  const [showLocationModal, setShowLocationModal] = useState(false);

  return (
    <>
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-brand-accent/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-brand-secondary/10 to-transparent"></div>

                        <div className="container py-8 relative">
                    <div className="text-center max-w-5xl mx-auto">
            {/* Location Selection - Moved to top */}
            {!location ? (
              <div className="flex items-center justify-center gap-3 mb-6 animate-scale-in">
                <LocationIcon className="w-5 h-5 text-brand" />
                <span className="text-body font-medium text-brand">
                  Select your state to get started
                </span>
                <button
                  onClick={() => setShowLocationModal(true)}
                  className="btn btn-primary btn-sm group ml-2"
                >
                  Choose State
                  <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 mb-6 animate-bounce-in">
                <div className="flex items-center gap-2">
                  <LocationIcon className="w-5 h-5 text-brand" />
                  <span className="text-body font-medium text-brand">
                    🇳🇬 {location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowLocationModal(true)}
                    className="btn btn-primary btn-sm group hover:scale-105 transition-all duration-200"
                  >
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Change State
                  </button>
                </div>
              </div>
            )}

            {/* Interactive Training Title */}
            <div className="mb-4 animate-slide-up">
                            <h2 className="text-display-2 font-display mb-3 text-gradient-brand">
                Master Safety Skills with
                <br />
                AI-Powered Training
              </h2>
              <p className="text-body-xl text-secondary mb-4 leading-relaxed">
                Immersive AI-powered scenarios that adapt to your learning style and location-specific risks.
              </p>
              <button
                onClick={() => setView("game")}
                className="btn btn-primary btn-xl group"
              >
                <PlayIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Start Now
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            

            

            

            
          </div>
        </div>
      </section>

      <StateDropdown
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelect={setLocation}
      />
    </>
  );
};

// Stats Overview Section
const StatsOverview: React.FC = () => {
  const { level, currentXp, xpToNextLevel, unlockedAchievements } =
    useAppContext();
  const xpPercentage = Math.min((currentXp / xpToNextLevel) * 100, 100);

  const stats = [
    {
      icon: StarIcon,
      label: "Current Level",
      value: level.toString(),
      change: "+2 this month",
      color: "text-brand",
      bgColor: "bg-brand-primary-light",
    },
    {
      icon: ChartBarIcon,
      label: "XP Earned",
      value: currentXp.toLocaleString(),
      change: `${xpToNextLevel - currentXp} to next level`,
      color: "text-info",
      bgColor: "bg-info-light",
    },
    {
      icon: CheckIcon,
      label: "Achievements",
      value: unlockedAchievements.length.toString(),
      change: "+3 this week",
      color: "text-success",
      bgColor: "bg-success-light",
    },
    {
      icon: FireIcon,
      label: "Training Streak",
      value: "7 days",
      change: "Personal best!",
      color: "text-warning",
      bgColor: "bg-warning-light",
    },
  ];

  return (
    <section className="section bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-display-2 font-display mb-4">Your Progress</h2>
          <p className="text-body-lg text-secondary max-w-2xl mx-auto">
            Track your safety training journey with detailed analytics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="card card-interactive animate-slide-up hover:shadow-brand"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <TrendingUpIcon className="w-5 h-5 text-success" />
              </div>
              <div className="text-display-3 font-display text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-body-sm text-secondary mb-2">
                {stat.label}
              </div>
              <div className="text-caption text-success">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* XP Progress */}
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-heading-2 font-display mb-2">
                Level Progress
              </h3>
              <p className="text-body text-secondary">
                You're {Math.round(xpPercentage)}% towards Level {level + 1}
              </p>
            </div>
            <div className="text-right">
              <div className="text-heading-3 text-brand">
                {currentXp.toLocaleString()}
              </div>
              <div className="text-caption">
                / {xpToNextLevel.toLocaleString()} XP
              </div>
            </div>
          </div>
          <div className="progress progress-lg mb-4">
            <div
              className="progress-bar bg-gradient-brand"
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
          <div className="text-caption text-center">
            {(xpToNextLevel - currentXp).toLocaleString()} XP remaining to reach
            Level {level + 1}
          </div>
        </div>
      </div>
    </section>
  );
};

// Training Categories Section
const TrainingCategories: React.FC = () => {
  const { setView } = useAppContext();

  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-display-2 font-display mb-4">
            Training Scenarios
          </h2>
          <p className="text-body-lg text-secondary max-w-2xl mx-auto">
            Master various disaster scenarios with our comprehensive training
            modules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {SCENARIO_CATEGORIES.map((category, index) => (
            <div
              key={category.key}
              onClick={() => setView("game")}
              className="card card-interactive animate-slide-up hover:shadow-brand cursor-pointer group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start gap-8">
                <div className="w-18 h-18 bg-gradient-brand rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <category.icon className="w-9 h-9 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-heading-2 font-display mb-4 group-hover:text-brand transition-colors">
                    {category.key.replace(/([A-Z])/g, " $1").trim()}
                  </h3>
                  <p className="text-body text-secondary mb-6">
                    Professional disaster response training scenario with
                    AI-powered feedback
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="badge badge-success">Available</div>
                    <div className="flex items-center gap-2 text-brand font-semibold group-hover:gap-4 transition-all">
                      <span>Start Training</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setView("game")}
            className="btn btn-primary btn-xl group"
          >
            <PlayIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            Explore All Training Scenarios
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

// Personalized Recommendations Section
const PersonalizedRecommendations: React.FC = () => {
  const { location, setView } = useAppContext();
  const [recommendations, setRecommendations] = useState<Recommendation | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location) {
      loadRecommendations();
    }
  }, [location]);

  const loadRecommendations = async () => {
    if (!location) return;

    setLoading(true);
    try {
      const recs = await getPersonalizedRecommendations(location, 1, {}, "en");
      setRecommendations(recs);
    } catch (e) {
      console.error("Failed to load recommendations:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!location || !recommendations) {
    return null;
  }

  return (
    <section className="section bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-display-2 font-display mb-4">
            Personalized for{" "}
            <span className="text-gradient-brand">{location}</span>
          </h2>
          <p className="text-body-lg text-secondary max-w-2xl mx-auto mb-6">
            AI-powered recommendations tailored to your location and training
            progress
          </p>

          {/* Quick State Change */}
          <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-6 py-3 shadow-lg border border-gray-200">
            <LocationIcon className="w-4 h-4 text-brand" />
            <span className="text-sm font-medium text-gray-700">
              Training for:{" "}
              <span className="text-brand font-semibold">{location}</span>
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-xs text-brand hover:text-brand-dark font-medium px-3 py-1 bg-brand-primary-light hover:bg-brand-primary rounded-lg transition-all duration-200 flex items-center gap-1 hover:scale-105"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Change State
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="inline-flex items-center gap-3 text-body-lg text-secondary">
              <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
              Generating personalized recommendations...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="card card-interactive p-8 hover:shadow-warning transition-all">
              <div className="w-16 h-16 bg-warning-light rounded-2xl flex items-center justify-center mb-6">
                <AlertBellIcon className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-heading-2 mb-4">Local Alert</h3>
              <p className="text-body text-secondary mb-6 leading-relaxed">
                {recommendations.contextualAlert}
              </p>
              <button className="btn btn-outline w-full group">
                Learn More
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="card card-interactive p-8 hover:shadow-brand transition-all">
              <div className="w-16 h-16 bg-brand-primary-light rounded-2xl flex items-center justify-center mb-6">
                <BrainIcon className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-heading-2 mb-4">Recommended Training</h3>
              <p className="text-body text-secondary mb-6 leading-relaxed">
                {recommendations.trainingRecommendationReason}
              </p>
              <button
                onClick={() => setView("game")}
                className="btn btn-primary w-full group"
              >
                Start Training
                <PlayIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="card card-interactive p-8 hover:shadow-success transition-all">
              <div className="w-16 h-16 bg-success-light rounded-2xl flex items-center justify-center mb-6">
                <LightbulbIcon className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-heading-2 mb-4">Safety Tip</h3>
              <p className="text-body text-secondary mb-6 leading-relaxed">
                {recommendations.preparednessTip}
              </p>
              <button className="btn btn-outline w-full group">
                View All Tips
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Main Dashboard Component
export const Dashboard: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <WelcomeHero />

      
    </div>
  );
};
