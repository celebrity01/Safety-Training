import React, { useState } from "react";
import { useAppContext } from "../types";
import { ACHIEVEMENTS } from "../constants";

// Enhanced SVG Icons for progress tracking
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

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.563.563 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
    />
  </svg>
);

const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

const FlameIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z"
    />
  </svg>
);

export const AchievementsScreen: React.FC = () => {
  const { t, unlockedAchievements, level, currentXp, xpToNextLevel } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hoveredAchievement, setHoveredAchievement] = useState<string | null>(
    null,
  );

  const xpPercentage = Math.min((currentXp / xpToNextLevel) * 100, 100);

  const categories = [
    { id: "all", name: "🏆 All", count: ACHIEVEMENTS.length },
    { id: "unlocked", name: "✅ Unlocked", count: unlockedAchievements.length },
    {
      id: "locked",
      name: "🔒 Locked",
      count: ACHIEVEMENTS.length - unlockedAchievements.length,
    },
    {
      id: "rare",
      name: "💎 Rare",
      count: ACHIEVEMENTS.filter((a) => a.rarity === "rare").length,
    },
    {
      id: "legendary",
      name: "👑 Legendary",
      count: ACHIEVEMENTS.filter((a) => a.rarity === "legendary").length,
    },
  ];

  const filteredAchievements = ACHIEVEMENTS.filter((achievement) => {
    switch (selectedCategory) {
      case "unlocked":
        return unlockedAchievements.includes(achievement.id);
      case "locked":
        return !unlockedAchievements.includes(achievement.id);
      case "rare":
        return achievement.rarity === "rare";
      case "legendary":
        return achievement.rarity === "legendary";
      default:
        return true;
    }
  });

  const getAchievementRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-slate-400 to-slate-600";
      case "rare":
        return "from-blue-400 to-cyan-500";
      case "epic":
        return "from-purple-400 to-pink-500";
      case "legendary":
        return "from-yellow-400 to-orange-500";
      default:
        return "from-slate-400 to-slate-600";
    }
  };

  const getAchievementIcon = (id: string) => {
    switch (id) {
      case "first_game":
        return "🎮";
      case "perfect_score":
        return "💯";
      case "quick_thinker":
        return "⚡";
      case "level_5":
        return "⭐";
      case "fire_fighter":
        return "🔥";
      case "flood_expert":
        return "🌊";
      default:
        return "🏆";
    }
  };

  const completionPercentage = Math.round(
    (unlockedAchievements.length / ACHIEVEMENTS.length) * 100,
  );

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 animate-bounce-in">
      {/* Header Section */}
      <div className="text-center mb-12 animate-slide-in-down">
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="achievement-badge w-20 h-20 rounded-full flex items-center justify-center text-4xl">
            🏆
          </div>
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-glow animate-glow-rotate">
              {t("achievementsTab")}
            </h1>
            <p className="text-xl text-slate-300 mt-2">
              Unlock your safety training milestones
            </p>
          </div>
        </div>

                {/* Enhanced Progress Overview */}
        <div className="glass-quiz p-8 rounded-3xl max-w-4xl mx-auto border border-slate-600/30 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-4xl font-black text-emerald-400 mb-1">
                {unlockedAchievements.length}
              </div>
              <div className="text-slate-400 text-sm font-bold">ACHIEVEMENTS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-brand mb-1">
                {level}
              </div>
              <div className="text-slate-400 text-sm font-bold">LEVEL</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-info mb-1">
                {currentXp.toLocaleString()}
              </div>
              <div className="text-slate-400 text-sm font-bold">TOTAL XP</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                {completionPercentage}%
              </div>
              <div className="text-slate-400 text-sm font-bold">COMPLETE</div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-300">Level {level} Progress</span>
              <span className="text-sm text-slate-400">{Math.round(xpPercentage)}% to Level {level + 1}</span>
            </div>
            <div className="w-full bg-slate-800/60 rounded-full h-4 overflow-hidden border-2 border-slate-600/50 relative">
              <div
                className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-brand-primary to-brand-secondary"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{currentXp.toLocaleString()} XP</span>
              <span>{xpToNextLevel.toLocaleString()} XP</span>
            </div>
          </div>

          {/* Achievement Progress Bar */}
          <div className="w-full bg-slate-800/60 rounded-full h-6 overflow-hidden border-2 border-slate-600/50 relative">
            <div
              className="progress-xp h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-yellow-400 to-orange-400"
              style={{ width: `${completionPercentage}%` }}
            ></div>
            <div
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: "inset 0 0 6px 1px rgba(0,0,0,0.3)" }}
            ></div>
          </div>
        </div>

        {/* Detailed Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <div className="glass-card p-6 rounded-2xl border border-slate-600/30 hover:border-brand/50 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-brand-primary-light rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-brand" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{currentXp.toLocaleString()}</div>
                <div className="text-sm text-slate-400">Experience Points</div>
              </div>
            </div>
            <div className="text-sm text-success flex items-center gap-1">
              <TrendingUpIcon className="w-4 h-4" />
              {(xpToNextLevel - currentXp).toLocaleString()} to next level
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-600/30 hover:border-warning/50 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-warning-light rounded-xl flex items-center justify-center">
                <FireIcon className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">7 days</div>
                <div className="text-sm text-slate-400">Training Streak</div>
              </div>
            </div>
            <div className="text-sm text-warning flex items-center gap-1">
              <span>🔥</span>
              Personal best!
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-600/30 hover:border-success/50 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-success-light rounded-xl flex items-center justify-center">
                <CheckIcon className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{unlockedAchievements.length}</div>
                <div className="text-sm text-slate-400">Achievements</div>
              </div>
            </div>
            <div className="text-sm text-success flex items-center gap-1">
              <TrendingUpIcon className="w-4 h-4" />
              +3 this week
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div
        className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-in-up"
        style={{ animationDelay: "0.3s" }}
      >
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 border-2 hover:scale-105 animate-slide-in-up ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 border-blue-400 text-white shadow-lg shadow-blue-500/25"
                : "glass-card border-slate-700/60 text-slate-200 hover:border-slate-600/80 hover:text-white"
            }`}
            style={{ animationDelay: `${0.4 + index * 0.1}s` }}
          >
            <span className="text-lg">{category.name}</span>
            <div
              className={`px-3 py-1 rounded-full text-sm font-black ${
                selectedCategory === category.id
                  ? "bg-white/20 text-white"
                  : "bg-slate-700/80 text-slate-300"
              }`}
            >
              {category.count}
            </div>
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAchievements.map((achievement, index) => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          const rarityColor = getAchievementRarityColor(
            achievement.rarity || "common",
          );

          return (
            <div
              key={achievement.id}
              className={`glass-card p-6 rounded-3xl border-2 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl group animate-bounce-in ${
                isUnlocked
                  ? `border-transparent bg-gradient-to-br ${rarityColor} bg-opacity-10 hover:shadow-lg shadow-current/20`
                  : "border-slate-700/60 hover:border-slate-600/80 opacity-60"
              }`}
              style={{ animationDelay: `${0.6 + index * 0.05}s` }}
              onMouseEnter={() => setHoveredAchievement(achievement.id)}
              onMouseLeave={() => setHoveredAchievement(null)}
            >
              {/* Achievement Icon */}
              <div className="text-center mb-4">
                <div
                  className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl transition-all duration-300 ${
                    isUnlocked
                      ? `bg-gradient-to-br ${rarityColor} animate-bounce-subtle shadow-lg`
                      : "bg-slate-800/60 text-slate-600"
                  }`}
                >
                  {isUnlocked ? (
                    getAchievementIcon(achievement.id)
                  ) : (
                    <LockIcon className="w-8 h-8" />
                  )}
                </div>

                {/* Rarity Indicator */}
                {isUnlocked &&
                  achievement.rarity &&
                  achievement.rarity !== "common" && (
                    <div
                      className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${rarityColor} text-white`}
                    >
                      {achievement.rarity === "legendary" && (
                        <FlameIcon className="w-3 h-3" />
                      )}
                      {achievement.rarity === "rare" && (
                        <StarIcon className="w-3 h-3" />
                      )}
                      {achievement.rarity?.toUpperCase()}
                    </div>
                  )}
              </div>

              {/* Achievement Info */}
              <div className="text-center">
                <h3
                  className={`font-bold text-lg mb-2 transition-colors ${
                    isUnlocked ? "text-white text-glow" : "text-slate-500"
                  }`}
                >
                  {t(`achievement_${achievement.id}_title`)}
                </h3>
                <p
                  className={`text-sm leading-relaxed transition-colors ${
                    isUnlocked ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {t(`achievement_${achievement.id}_description`)}
                </p>

                {/* Unlock Status */}
                <div className="mt-4">
                  {isUnlocked ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold">
                      <CheckIcon className="w-5 h-5" />
                      <span>UNLOCKED</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-slate-500 font-bold">
                      <LockIcon className="w-5 h-5" />
                      <span>LOCKED</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hover Effect */}
              {hoveredAchievement === achievement.id && isUnlocked && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl animate-shimmer"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-16 animate-scale-in">
          <div className="text-6xl mb-6">🔍</div>
          <h3 className="text-2xl font-bold text-slate-400 mb-2">
            No achievements found
          </h3>
          <p className="text-slate-500">Try selecting a different category</p>
        </div>
      )}

      {/* Achievement Tips */}
      {selectedCategory === "locked" && filteredAchievements.length > 0 && (
        <div className="mt-12 glass-card p-8 rounded-3xl border border-slate-600/30 text-center animate-slide-in-up">
          <div className="text-4xl mb-4">💡</div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">
            Achievement Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div className="bg-slate-800/50 p-4 rounded-2xl">
              <div className="text-2xl mb-2">🎮</div>
              <h4 className="font-bold text-white mb-2">Complete Training</h4>
              <p className="text-slate-400 text-sm">
                Finish scenario-based training sessions to unlock basic
                achievements.
              </p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-bold text-white mb-2">Speed & Accuracy</h4>
              <p className="text-slate-400 text-sm">
                Answer quickly and correctly to earn speed-based achievements.
              </p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl">
              <div className="text-2xl mb-2">🔥</div>
              <h4 className="font-bold text-white mb-2">Consistency</h4>
              <p className="text-slate-400 text-sm">
                Practice regularly and maintain streaks for rare achievements.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
