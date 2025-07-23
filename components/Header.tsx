import React, { useState, useRef, useEffect } from "react";
import { useAppContext, View } from "../types";
import { languageNames, Language } from "../translations";
import { SoundToggle } from "./SoundEffects";

// Modern SVG Icons with enhanced styling
const GlobeIcon: React.FC<{ className?: string }> = ({
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
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-3a5 5 0 00-5-5 5 5 0 00-5 5v3m9-9v-3a5 5 0 00-5-5 5 5 0 00-5 5v3"
    />
  </svg>
);

const MenuIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
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
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
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

const ChevronDownIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4",
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const HomeIcon: React.FC<{ className?: string }> = ({
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
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const AcademicCapIcon: React.FC<{ className?: string }> = ({
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
      d="M12 14l9-5-9-5-9 5 9 5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
    />
  </svg>
);

const ChatIcon: React.FC<{ className?: string }> = ({
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
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.255-.949L5 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
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

const StarIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4",
}) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

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

// Progress Ring Component for XP visualization
const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}> = ({ progress, size = 48, strokeWidth = 4, className = "" }) => {
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
          stroke="url(#progress-gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
        <defs>
          <linearGradient
            id="progress-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="var(--brand-primary)" />
            <stop offset="100%" stopColor="var(--brand-secondary)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <StarIcon className="w-4 h-4 text-brand" />
      </div>
    </div>
  );
};

// Advanced 3MTT Logo Component
const Logo3MTT: React.FC<{ className?: string; showText?: boolean }> = ({
  className = "",
  showText = true,
}) => (
    <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative flex flex-col rounded-2xl overflow-hidden">
      <img
        src="https://cdn.builder.io/api/v1/image/assets%2F520d68a1554248838ad76d15283f7c83%2F07a5c6176cc14995a9e7d99ee325a073?format=webp&width=800"
        alt="3MTT Logo"
        className="h-10 w-auto object-contain animate-pulse-soft rounded-2xl"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-30 transition-opacity duration-300 transform skew-x-12"></div>
    </div>
    {showText && (
      <div className="hidden sm:block">
        <h1 className="font-display text-heading-3 text-gradient-brand leading-none">
          Safety Training
        </h1>
        <p className="text-caption text-tertiary font-medium tracking-wide">
          3MTT Assistance Platform
        </p>
      </div>
    )}
  </div>
);

export const Header: React.FC = () => {
  const {
    view,
    setView,
    t,
    language,
    selectLanguage,
    level,
    currentXp,
    xpToNextLevel,
    location,
  } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [notificationCount] = useState(2);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (selectedLanguage: Language) => {
    if (selectedLanguage !== language) {
      selectLanguage(selectedLanguage);
    }
    setLanguageDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navigationItems = [
    {
      key: "dashboard",
      icon: HomeIcon,
      label: "Dashboard",
      description: "Overview & Analytics",
    },
    
    {
      key: "comms",
      icon: ChatIcon,
      label: "Communications",
      description: "Communications Hub",
    },
    {
      key: "achievements",
      icon: TrophyIcon,
      label: "Achievements",
      description: "Progress & Badges",
    },
  ];

  const xpPercentage = Math.min((currentXp / xpToNextLevel) * 100, 100);

  return (
    <header className="nav animate-slide-down">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Logo3MTT className="cursor-pointer hover:scale-105 transition-transform duration-300" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-3">
            {navigationItems.map((item) => (
              <div key={item.key} className="relative group">
                <button
                  onClick={() => setView(item.key as View)}
                  className={`nav-item flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${view === item.key ? "nav-item-active bg-brand text-white" : "hover:bg-gray-100"}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>

                {/* Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.description}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* XP Progress - Desktop */}
            <div className="hidden xl:flex items-center gap-4">
              <div className="text-right">
                <div className="text-body-sm font-semibold text-brand">
                  Level {level}
                </div>
                <div className="text-caption">
                  {currentXp.toLocaleString()}/{xpToNextLevel.toLocaleString()}{" "}
                  XP
                </div>
              </div>
              <ProgressRing
                progress={xpPercentage}
                className="animate-pulse-soft"
              />
            </div>

            {/* Location Indicator - Desktop */}
            {location && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-brand-primary-light to-brand-secondary-light rounded-xl border border-brand-primary/20">
                <svg
                  className="w-4 h-4 text-brand"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-brand">
                  🇳🇬 {location}
                </span>
              </div>
            )}

                        {/* Notifications */}
            <div className="relative">
              <button className="btn-ghost relative">
                <BellIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Sound Toggle */}
            <SoundToggle />

            {/* Language Selector */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="btn-ghost flex items-center gap-2"
              >
                <GlobeIcon className="w-4 h-4" />
                <span className="hidden md:inline font-medium">
                  {languageNames[language]}
                </span>
                <span className="md:hidden font-bold text-xs">
                  {language.toUpperCase()}
                </span>
                <ChevronDownIcon
                  className={`w-3 h-3 transition-transform duration-200 ${languageDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {languageDropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-gray-800 border border-gray-700 rounded-2xl shadow-xl z-50 animate-scale-in backdrop-blur-lg">
                  <div className="p-3">
                    <div className="px-4 py-3 text-caption font-semibold text-gray-400 border-b border-gray-600 mb-3">
                      Select Language
                    </div>
                    {(Object.keys(languageNames) as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageSelect(lang)}
                        className={`w-full text-left px-4 py-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-between ${
                          language === lang
                            ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold shadow-brand"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        <span>{languageNames[lang]}</span>
                        {language === lang && (
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse-soft"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden btn-ghost"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-light mt-4 animate-slide-down">
            {/* Mobile XP Progress */}
            <div className="py-6 border-b border-light">
              <div className="flex items-center gap-4">
                <ProgressRing progress={xpPercentage} size={56} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-body font-semibold text-brand">
                      Level {level}
                    </span>
                    <span className="text-body-sm text-secondary">
                      {Math.round(xpPercentage)}%
                    </span>
                  </div>
                  <div className="progress progress-sm">
                    <div
                      className="progress-bar"
                      style={{ width: `${xpPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-caption mt-1">
                    {currentXp.toLocaleString()} /{" "}
                    {xpToNextLevel.toLocaleString()} XP
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="py-4 space-y-1">
              {navigationItems.map((item, index) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setView(item.key as View);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 animate-slide-up ${
                    view === item.key
                      ? "bg-gradient-brand text-white shadow-brand"
                      : "text-secondary hover:bg-tertiary hover:text-primary"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`p-2 rounded-lg ${view === item.key ? "bg-white bg-opacity-20" : "bg-tertiary"}`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{item.label}</div>
                    <div
                      className={`text-xs ${view === item.key ? "text-white text-opacity-80" : "text-tertiary"}`}
                    >
                      {item.description}
                    </div>
                  </div>
                  {view === item.key && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse-soft"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
