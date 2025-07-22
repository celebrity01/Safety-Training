import React, { useState, useCallback, useEffect } from "react";
import {
  GameState,
  Scenario,
  Category,
  GameHistoryItem,
  AppContext,
  useAppContext,
  View,
  Achievement,
  Toast,
} from "./types";
import { SCENARIO_CATEGORIES, ACHIEVEMENTS } from "./constants";
import { translations, languageNames, Language } from "./translations";
import {
  generateInitialScenario,
  generateNextQuestion,
  generateGameSummary,
  generateScenarioImage,
  isApiReady,
  setApiKey,
} from "./services/geminiService";
import { ApiKeyScreen } from "./components/ApiKeyScreen";
import { Header } from "./components/Header";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { CommunicationsHub } from "./components/CommunicationsHub";
import { Dashboard } from "./components/Dashboard";
import { AchievementsScreen } from "./components/AchievementsScreen";
import { ToastManager } from "./components/Toast";
import {
  AchievementCelebration,
  useAchievementCelebration,
} from "./components/AchievementCelebration";
import { FloatingParticles } from "./components/FloatingParticles";
import {
  SoundEffectsProvider,
  triggerSoundEvent,
} from "./components/SoundEffects";

// Advanced SVG Icons with micro-interactions
const CheckIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={`${className} transition-all duration-300 group-hover:scale-110`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    className={`${className} transition-all duration-300 group-hover:rotate-90`}
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

const PlayIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={`${className} transition-all duration-300 group-hover:translate-x-1`}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={`${className} transition-all duration-300 group-hover:rotate-12`}
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

const ArrowRightIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={`${className} transition-all duration-300 group-hover:translate-x-2`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const SparklesIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={`${className} animate-pulse-soft`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);



// Enhanced Category Selection with Advanced UI
interface CategorySelectionScreenProps {
  onSelect: (category: Category) => void;
  onBack: () => void;
  timerDuration: number | null;
  onTimerChange: (duration: number | null) => void;
}

const CategorySelectionScreen: React.FC<CategorySelectionScreenProps> = ({
  onSelect,
  onBack,
  timerDuration,
  onTimerChange,
}) => {
  const { t } = useAppContext();
    const timerOptions = [null, 15, 20, 30];

  return (
    <div className="container pt-4 pb-12 animate-fade-in">
      <div className="max-w-6xl mx-auto">
                        {/* Header */}
        <div className="text-center mb-4 animate-slide-down">
                    <h2 className="text-heading-1 font-display mb-3 text-gradient-brand">
            {t("chooseScenarioTitle")}
          </h2>
                    <p className="text-body-lg text-secondary max-w-3xl mx-auto leading-relaxed">
            {t("chooseScenarioSubtitle")}
          </p>
        </div>

        {/* Timer Settings with Enhanced Design */}
                <div
          className="max-w-2xl mx-auto mb-8 animate-scale-in"
          style={{ animationDelay: "0.2s" }}
        >
                    <div className="card card-elevated p-6">
                        <h3 className="text-heading-3 font-display mb-4 flex items-center justify-center gap-2">
                            <ClockIcon className="w-5 h-5 text-brand" />
              {t("timerSettingsTitle")}
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {timerOptions.map((opt) => (
                <button
                  key={opt ?? "none"}
                  onClick={() => onTimerChange(opt)}
                  className={`btn transition-all duration-300 ${
                    timerDuration === opt
                      ? "btn-primary shadow-brand scale-105"
                      : "btn-secondary hover:scale-105"
                  }`}
                >
                  {opt === null ? (
                    <span className="flex items-center gap-1">
                      ∞ <span className="text-xs">{t("noTimer")}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      ⚡ <span>{opt}s</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Grid with Sophisticated Interactions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {SCENARIO_CATEGORIES.map((cat, index) => (
            <div
              key={cat.key}
              onClick={() => onSelect(cat)}
                            className="card card-interactive p-6 group animate-slide-up hover:shadow-2xl"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    <cat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                                    <h3 className="text-heading-3 font-display mb-3 group-hover:text-brand transition-colors">
                    {t(`${cat.key}_title`)}
                  </h3>
                                    <p className="text-body-sm text-secondary mb-4 leading-relaxed">
                    {t(`${cat.key}_description`)}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-success rounded-full animate-pulse-soft"></div>
                      <span className="text-body-sm text-success font-medium">
                        Ready for Training
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-brand font-semibold group-hover:gap-4 transition-all duration-300">
                      <span>{t("startTrainingLink")}</span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div
          className="text-center animate-slide-up"
          style={{ animationDelay: "1s" }}
        >
          <button onClick={onBack} className="btn btn-secondary btn-lg group">
            ← {t("backToDashboard")}
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Game Screen with Advanced Interactions
interface GameScreenProps {
  scenario: Scenario;
  category: Category;
  safetyScore: number;
  questionCount: number;
  timerDuration: number | null;
  onAnswer: (
    isCorrect: boolean,
    choiceIndex: number,
    timeRemaining: number,
    timerDuration: number | null,
  ) => void;
  onNextQuestion: (context: string) => void;
  onEndGame: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  scenario,
  category,
  safetyScore,
  questionCount,
  timerDuration,
  onAnswer,
  onNextQuestion,
  onEndGame,
}) => {
  const [userChoice, setUserChoice] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isLoadingNext, setIsLoadingNext] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(timerDuration ?? 15);
  const [streak, setStreak] = useState(0);
  const { t, unlockAchievement } = useAppContext();
  const categoryTitle = t(`${category.key}_title`);

  const { questionData } = scenario;
  const isCorrect = userChoice === questionData.correctChoiceIndex;

  const handleAnswerClick = useCallback(
    (index: number) => {
      if (showFeedback) return;
      setUserChoice(index);
      setShowFeedback(true);
      const correct = index === questionData.correctChoiceIndex;

      if (correct) {
        setStreak((prev) => prev + 1);
        if (timerDuration && timeLeft > 10) {
          unlockAchievement("quick_thinker");
        }
      } else {
        setStreak(0);
      }

      onAnswer(correct, index, timeLeft, timerDuration);
    },
    [
      showFeedback,
      onAnswer,
      timeLeft,
      questionData,
      timerDuration,
      unlockAchievement,
    ],
  );

  useEffect(() => {
    if (!timerDuration || showFeedback) return;

    if (timeLeft <= 0) {
      let incorrectChoiceIndex = questionData.choices.findIndex(
        (_, i) => i !== questionData.correctChoiceIndex,
      );
      if (incorrectChoiceIndex === -1) incorrectChoiceIndex = 0;
      handleAnswerClick(incorrectChoiceIndex);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, showFeedback, questionData, handleAnswerClick, timerDuration]);

  const handleNext = async () => {
    if (userChoice === null) return;
    setIsLoadingNext(true);
    const context = `${t("context_previousQuestion")} "${questionData.question}". ${t("context_myChoice")} "${questionData.choices[userChoice]}". ${isCorrect ? t("context_correct") : t("context_incorrect")}. ${t("context_feedback")} "${questionData.feedback[userChoice]}".`;
    await onNextQuestion(context);
    setUserChoice(null);
    setShowFeedback(false);
    setIsLoadingNext(false);
    setTimeLeft(timerDuration ?? 15);
  };

  const getProgressColor = () => {
    if (safetyScore >= 80)
      return "bg-gradient-to-r from-success to-success-dark";
    if (safetyScore >= 60)
      return "bg-gradient-to-r from-warning to-warning-dark";
    return "bg-gradient-to-r from-error to-error-dark";
  };

  const getTimerColor = () => {
    if (timeLeft > 10) return "text-success";
    if (timeLeft > 5) return "text-warning";
    return "text-error animate-pulse";
  };

    return (
        <div className="container pt-2 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Enhanced Game HUD */}
      <div className="card card-elevated p-8 mb-8 animate-slide-down">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
              <div className="text-heading-1 font-display text-brand">
                {safetyScore}%
              </div>
              <div>
                <div className="text-body-sm text-secondary">
                  {t("safetyScoreLabel")}
                </div>
                {streak > 0 && (
                  <div className="badge badge-warning animate-pulse-soft">
                    🔥 {streak} streak
                  </div>
                )}
              </div>
            </div>
            <div className="w-full max-w-xs mx-auto lg:mx-0">
              <div className="progress progress-lg">
                <div
                  className={`progress-bar ${getProgressColor()}`}
                  style={{ width: `${safetyScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-heading-1 font-display text-gradient-brand mb-2">
              {categoryTitle}
            </h2>
            <p className="text-body text-secondary flex items-center justify-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              {t("questionCountLabel")} #{questionCount}
            </p>
          </div>

          {timerDuration && (
            <div className="text-center lg:text-right">
              <div className={`text-6xl font-display ${getTimerColor()}`}>
                {timeLeft}
              </div>
              <div className="text-caption text-secondary">
                {t("timerLabel")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scenario Image with Enhanced Styling */}
      <div className="card mb-8 overflow-hidden group animate-scale-in">
        <div className="relative">
          <img
            src={scenario.imageUrl}
            alt="Scenario"
            className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
          <div className="absolute top-6 right-6">
            <div className="badge badge-brand backdrop-blur-sm">
              Q{questionCount}
            </div>
          </div>
        </div>
      </div>

            {/* Question Interface */}
      <div className="card p-6 animate-slide-up">
        <div className="text-center mb-10">
          <h3 className="text-heading-1 font-display mb-6 leading-tight">
            {questionData.question}
          </h3>
          {!showFeedback && (
            <p className="text-body-lg text-secondary">
              Choose the best course of action:
            </p>
          )}
        </div>

        <div className="space-y-4 mb-8">
          {questionData.choices.map((choice, index) => {
            let buttonClass =
              "w-full p-6 text-left border-2 rounded-2xl transition-all duration-300 group";

            if (!showFeedback) {
              buttonClass +=
                " border-light hover:border-brand hover:bg-brand-primary-light hover:scale-105 cursor-pointer";
            } else if (index === questionData.correctChoiceIndex) {
              buttonClass +=
                " border-success bg-success-light text-success-dark scale-105";
            } else if (index === userChoice && !isCorrect) {
              buttonClass += " border-error bg-error-light text-error-dark";
            } else {
              buttonClass += " border-light opacity-60";
            }

            return (
              <button
                key={index}
                disabled={showFeedback}
                onClick={() => handleAnswerClick(index)}
                className={buttonClass}
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${
                      showFeedback && index === questionData.correctChoiceIndex
                        ? "bg-success text-white"
                        : showFeedback && index === userChoice && !isCorrect
                          ? "bg-error text-white"
                          : "bg-tertiary group-hover:bg-brand group-hover:text-white"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1 text-body-lg">{choice}</span>
                  {showFeedback &&
                    index === questionData.correctChoiceIndex && (
                      <CheckIcon className="w-6 h-6 text-success animate-bounce-in" />
                    )}
                  {showFeedback && index === userChoice && !isCorrect && (
                    <XIcon className="w-6 h-6 text-error animate-bounce-in" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {showFeedback && userChoice !== null && (
          <div className="animate-scale-in">
            <div
              className={`card p-8 mb-8 ${isCorrect ? "toast-success" : "toast-error"}`}
            >
              <div className="text-center mb-6">
                <div
                  className={`inline-flex items-center gap-4 px-8 py-4 rounded-2xl font-bold text-xl ${
                    isCorrect ? "bg-success text-white" : "bg-error text-white"
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckIcon className="w-6 h-6" />
                      <span>{t("feedbackCorrect")}</span>
                    </>
                  ) : (
                    <>
                      <XIcon className="w-6 h-6" />
                      <span>{t("feedbackIncorrect")}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="card p-6 mb-8">
                <p className="text-body-lg leading-relaxed text-center">
                  {questionData.feedback[userChoice]}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={onEndGame}
                className="btn btn-secondary btn-lg group"
              >
                🏁 {t("endButton")}
              </button>
              <button
                onClick={handleNext}
                disabled={isLoadingNext}
                className="btn btn-primary btn-lg group"
              >
                {isLoadingNext ? (
                  <>
                    <LoadingSpinner />
                    Loading...
                  </>
                ) : (
                  <>
                    {t("nextButton")}
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Game Over Screen
interface GameOverScreenProps {
  summary: string;
  safetyScore: number;
  xpEarned: number;
  baseXp: number;
  bonusXp: number;
  leveledUp: boolean;
  onRestart: () => void;
  onBackToScenarios: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  summary,
  safetyScore,
  xpEarned,
  baseXp,
  bonusXp,
  leveledUp,
  onRestart,
  onBackToScenarios,
}) => {
  const { t, unlockAchievement, level } = useAppContext();

  useEffect(() => {
    unlockAchievement("first_game");
    if (safetyScore === 100) {
      unlockAchievement("perfect_score");
    }
    if (level >= 5) {
      unlockAchievement("level_5");
    }
  }, [safetyScore, level, unlockAchievement]);

  const getScoreData = () => {
    if (safetyScore >= 90)
      return {
        grade: "A+",
        color: "text-brand",
        bgColor: "bg-brand-primary-light",
      };
    if (safetyScore >= 80)
      return { grade: "A", color: "text-success", bgColor: "bg-success-light" };
    if (safetyScore >= 70)
      return { grade: "B", color: "text-info", bgColor: "bg-info-light" };
    if (safetyScore >= 60)
      return { grade: "C", color: "text-warning", bgColor: "bg-warning-light" };
    return { grade: "D", color: "text-error", bgColor: "bg-error-light" };
  };

  const { grade, color, bgColor } = getScoreData();

  return (
    <div className="container section animate-fade-in">
      <div className="max-w-4xl mx-auto text-center">
        {/* Level Up Celebration */}
        {leveledUp && (
          <div className="card toast-success p-8 mb-8 animate-bounce-in">
            <h3 className="text-heading-1 font-display mb-4">
              🎉 {t("levelUp")}
            </h3>
            <p className="text-body-lg">
              Congratulations! You've reached Level {level}!
            </p>
          </div>
        )}

        {/* Score Display */}
        <div className="card card-elevated p-12 mb-8 animate-scale-in">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 mb-8">
            <div
              className={`w-32 h-32 ${bgColor} rounded-full flex items-center justify-center animate-float`}
            >
              <span className={`text-6xl font-display ${color}`}>{grade}</span>
            </div>
            <div>
              <h2 className="text-display-2 font-display mb-4">
                {safetyScore > 60 ? t("gameOverComplete") : t("gameOverFailed")}
              </h2>
              <p className="text-body-xl text-secondary">
                {t("finalScoreLabel")}
              </p>
            </div>
          </div>

          <div className="text-center mb-8">
            <div
              className={`text-9xl font-display ${color} text-gradient-brand animate-pulse-soft`}
            >
              {safetyScore}
            </div>
            <span className="text-4xl text-secondary">%</span>
          </div>
        </div>

        {/* XP Breakdown */}
        {xpEarned > 0 && (
          <div className="card p-8 mb-8 animate-slide-up">
            <h3 className="text-heading-2 font-display mb-8 flex items-center justify-center gap-3">
              <SparklesIcon className="w-6 h-6 text-brand" />
              {t("xpEarned")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-display text-info mb-2">
                  +{baseXp}
                </div>
                <div className="text-body text-secondary">{t("baseXp")}</div>
              </div>
              {bonusXp > 0 && (
                <div className="text-center">
                  <div className="text-4xl font-display text-success mb-2">
                    +{bonusXp}
                  </div>
                  <div className="text-body text-secondary">{t("bonusXp")}</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-5xl font-display text-brand mb-2">
                  +{xpEarned}
                </div>
                <div className="text-body text-brand font-semibold">
                  {t("totalXpEarned")}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Analysis */}
        <div
          className="card p-8 mb-8 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <h3 className="text-heading-2 font-display mb-6">
            {t("performanceAnalysisTitle")}
          </h3>
          <div className="card p-6">
            <p className="text-body leading-relaxed text-left whitespace-pre-wrap">
              {summary || t("noSummary")}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <button onClick={onRestart} className="btn btn-primary btn-xl group">
            🔄 {t("tryAgainButton")}
          </button>
          <button
            onClick={onBackToScenarios}
            className="btn btn-secondary btn-xl group"
          >
            🎯 {t("newScenarioButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Loading and Error Screens
const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
  <div className="container section text-center animate-fade-in">
    <div className="max-w-md mx-auto">
      <div className="w-24 h-24 mx-auto mb-8 animate-float">
        <LoadingSpinner size="xl" />
      </div>
      <h3 className="text-heading-2 font-display text-brand mb-4">
        Loading...
      </h3>
      <p className="text-body-lg text-secondary animate-pulse-soft">
        {message}
      </p>
    </div>
  </div>
);

const ErrorScreen: React.FC<{ message: string; onRetry: () => void }> = ({
  message,
  onRetry,
}) => {
  const { t } = useAppContext();
  return (
    <div className="container section text-center animate-fade-in">
      <div className="max-w-md mx-auto">
        <div className="card toast-error p-8">
          <div className="w-20 h-20 bg-error-light rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-soft">
            <XIcon className="w-10 h-10 text-error" />
          </div>
          <h2 className="text-heading-2 font-display text-error mb-4">
            {t("errorTitle")}
          </h2>
          <p className="text-body text-secondary mb-8 leading-relaxed">
            {message}
          </p>
          <button onClick={onRetry} className="btn btn-primary btn-lg group">
            🔄 {t("tryAgainButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Language Selection
const LanguageSelectionScreen: React.FC<{
  onSelect: (lang: Language) => void;
}> = ({ onSelect }) => (
  <div className="min-h-screen bg-primary flex items-center justify-center p-4 animate-fade-in">
    <div className="max-w-2xl w-full text-center">
      <div className="mb-12">
        <h1 className="text-display-1 font-display text-gradient-rainbow mb-6">
          Select Your Language
        </h1>
        <p className="text-body-xl text-secondary">
          Choose your preferred language to begin your safety training journey.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {(Object.keys(languageNames) as Language[]).map((lang, index) => (
          <button
            key={lang}
            onClick={() => onSelect(lang)}
            className="card card-interactive p-8 text-center hover:shadow-brand animate-scale-in group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="text-heading-2 font-display group-hover:text-brand transition-colors">
              {languageNames[lang]}
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// Main App Content with Enhanced State Management
export const AppContent: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.CATEGORY_SELECTION);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [safetyScore, setSafetyScore] = useState(100);
  const [questionCount, setQuestionCount] = useState(1);
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [gameOverSummary, setGameOverSummary] = useState("");
  const [timerDuration, setTimerDuration] = useState<number | null>(15);

  const {
    t,
    level,
    currentXp,
    setLevel,
    setCurrentXp,
    xpToNextLevel,
    setView,
    unlockAchievement,
    location,
  } = useAppContext();

  const [xpGained, setXpGained] = useState(0);
  const [baseXp, setBaseXp] = useState(0);
  const [bonusXp, setBonusXp] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);

  // Enhanced game state management with animations
  const resetGameState = useCallback(() => {
    setCurrentScenario(null);
    setSelectedCategory(null);
    setGameHistory([]);
    setQuestionCount(1);
    setSafetyScore(100);
    setGameOverSummary("");
    setXpGained(0);
    setBonusXp(0);
    setBaseXp(0);
    setLeveledUp(false);
  }, []);

  const handleSelectCategory = async (category: Category) => {
    setSelectedCategory(category);
    setGameState(GameState.LOADING);
    setLoadingMessage(t("loadingMission"));
    setError(null);
    try {
      const imagePrompt = `A realistic, high-resolution photo of a scene for a "${t(`${category.key}_title`)}" scenario in ${location || "Nigeria"}. Cinematic, detailed, photorealistic.`;
      // Run operations sequentially to avoid "body stream already read" error
      const questionData = await generateInitialScenario(
        t(`${category.key}_title`),
        t("systemInstruction"),
        location || "Nigeria",
      );
      if (!questionData) throw new Error(t("errorMissingScenario"));
      const imageUrl = await generateScenarioImage(imagePrompt, category.key);
      setCurrentScenario({ imageUrl, questionData });
      setGameState(GameState.GAME);
    } catch (e: any) {
      console.error("Error starting game:", e);
      setError(e.message || t("errorUnknown"));
      setGameState(GameState.ERROR);
    }
  };

  const handleAnswer = (
    isCorrect: boolean,
    choiceIndex: number,
    timeRemaining: number,
    timerDuration: number | null,
  ) => {
    setSafetyScore((prev) =>
      Math.max(0, Math.min(100, prev + (isCorrect ? 5 : -20))),
    );
    const speedBonus =
      isCorrect && timerDuration && timeRemaining > timerDuration / 2 ? 15 : 0;
    setBonusXp((prev) => prev + speedBonus);

    if (currentScenario) {
      const historyItem: GameHistoryItem = {
        question: currentScenario.questionData.question,
        userChoice: currentScenario.questionData.choices[choiceIndex],
        correctChoice:
          currentScenario.questionData.choices[
            currentScenario.questionData.correctChoiceIndex
          ],
        isCorrect,
      };
      setGameHistory((prev) => [...prev, historyItem]);
    }
  };

  const handleNextQuestion = async (context: string) => {
    if (!selectedCategory || !currentScenario) return;
    try {
      const questionData = await generateNextQuestion(
        t(`${selectedCategory.key}_title`),
        t("systemInstruction"),
        context,
        location || "Nigeria",
      );
      setCurrentScenario((prev) => (prev ? { ...prev, questionData } : null));
      setQuestionCount((prev) => prev + 1);
    } catch (e: any) {
      console.error(e);
      setError(t("errorNextQuestion"));
      setGameState(GameState.ERROR);
    }
  };

  const handleEndGame = async () => {
    setGameState(GameState.LOADING);
    setLoadingMessage(t("loadingSummary"));

    const correctAnswers = gameHistory.filter((h) => h.isCorrect).length;
    const calculatedBaseXp = 20 * correctAnswers;
    const totalXpGained = calculatedBaseXp + bonusXp;
    setBaseXp(calculatedBaseXp);
    setXpGained(totalXpGained);

    const newTotalXp = currentXp + totalXpGained;
    const didLevelUp = newTotalXp >= xpToNextLevel;

    if (didLevelUp) {
      const newLevel = level + 1;
      setLevel(newLevel);
      setCurrentXp(newTotalXp - xpToNextLevel);
      setLeveledUp(true);
    } else {
      setCurrentXp(newTotalXp);
    }

    try {
      const summaryPrompt = `${t("summaryPrompt_start")} ${selectedCategory ? t(`${selectedCategory.key}_title`) : ""}. ${t("summaryPrompt_middle")} ${JSON.stringify(gameHistory)}`;
      const summary = await generateGameSummary(summaryPrompt);
      setGameOverSummary(summary);
    } catch (e) {
      setGameOverSummary(t("noSummaryError"));
      console.error(e);
    }

    if (safetyScore > 70 && selectedCategory) {
      const key = selectedCategory.key;
      if (key === "urbanFire") unlockAchievement("fire_fighter");
      if (key === "floodResponse") unlockAchievement("flood_expert");

      const currentStats = JSON.parse(
        localStorage.getItem("prepzone_performance") || "{}",
      );
      if (!currentStats[key]) currentStats[key] = { total: 0, correct: 0 };
      currentStats[key].total += 1;
      if (safetyScore === 100) {
        currentStats[key].correct += 1;
      }
      localStorage.setItem(
        "prepzone_performance",
        JSON.stringify(currentStats),
      );
    }

    setGameState(GameState.GAME_OVER);
  };

  const handleRestart = () => {
    const categoryToRestart = selectedCategory;
    resetGameState();
    if (categoryToRestart) {
      handleSelectCategory(categoryToRestart);
    }
  };

  const handleBackToScenarios = () => {
    resetGameState();
    setGameState(GameState.CATEGORY_SELECTION);
  };

    const renderContent = () => {
    switch (gameState) {
      case GameState.CATEGORY_SELECTION:
        return (
          <CategorySelectionScreen
            onSelect={handleSelectCategory}
            onBack={() => setView("dashboard")}
            timerDuration={timerDuration}
            onTimerChange={setTimerDuration}
          />
        );
      case GameState.LOADING:
        return <LoadingScreen message={loadingMessage} />;
      case GameState.GAME:
        if (!currentScenario || !selectedCategory)
          return (
            <ErrorScreen
              message={t("errorMissingScenario")}
              onRetry={handleBackToScenarios}
            />
          );
        return (
          <GameScreen
            scenario={currentScenario}
            category={selectedCategory}
            safetyScore={safetyScore}
            questionCount={questionCount}
            timerDuration={timerDuration}
            onAnswer={handleAnswer}
            onNextQuestion={handleNextQuestion}
            onEndGame={handleEndGame}
          />
        );
      case GameState.GAME_OVER:
        return (
          <GameOverScreen
            summary={gameOverSummary}
            safetyScore={safetyScore}
            xpEarned={xpGained}
            baseXp={baseXp}
            bonusXp={bonusXp}
            leveledUp={leveledUp}
            onRestart={handleRestart}
            onBackToScenarios={handleBackToScenarios}
          />
        );
      case GameState.ERROR:
        return (
          <ErrorScreen
            message={error || t("errorUnknown")}
            onRetry={handleBackToScenarios}
          />
        );
      default:
        return (
          <CategorySelectionScreen
            onSelect={handleSelectCategory}
            onBack={() => setView("dashboard")}
            timerDuration={timerDuration}
            onTimerChange={setTimerDuration}
          />
        );
    }
  };

  return <div className="animate-fade-in">{renderContent()}</div>;
};

// Enhanced App Content Wrapper
const AppContentWrapper: React.FC = () => {
  const { view } = useAppContext();

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard />;
      case "game":
        return <AppContent />;
      case "comms":
        return <CommunicationsHub />;
      case "achievements":
        return <AchievementsScreen />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <Header />
      <main className="animate-fade-in">{renderView()}</main>
    </div>
  );
};

// Main App Component with Enhanced Features
const App: React.FC = () => {
  const [langSelected, setLangSelected] = useState<boolean>(
    () => !!localStorage.getItem("prepzone_lang"),
  );
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem("prepzone_lang") as Language) || "en",
  );
  const [level, setLevel] = useState<number>(() =>
    parseInt(localStorage.getItem("prepzone_level") || "1", 10),
  );
  const [currentXp, setCurrentXp] = useState<number>(() =>
    parseInt(localStorage.getItem("prepzone_xp") || "0", 10),
  );
  const [view, setView] = useState<View>("dashboard");
  const [location, setLocation] = useState<string | null>(() =>
    localStorage.getItem("prepzone_location"),
  );
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("prepzone_achievements") || "[]"),
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean>(() =>
    isApiReady(),
  );
  const { currentCelebration, celebrate, clearCelebration } =
    useAchievementCelebration();

  // Persistent storage effects
  useEffect(() => {
    localStorage.setItem("prepzone_lang", language);
  }, [language]);
  useEffect(() => {
    localStorage.setItem("prepzone_level", level.toString());
  }, [level]);
  useEffect(() => {
    localStorage.setItem("prepzone_xp", currentXp.toString());
  }, [currentXp]);
  useEffect(() => {
    if (location) {
      localStorage.setItem("prepzone_location", location);
    } else {
      localStorage.removeItem("prepzone_location");
    }
  }, [location]);
  useEffect(() => {
    localStorage.setItem(
      "prepzone_achievements",
      JSON.stringify(unlockedAchievements),
    );
  }, [unlockedAchievements]);

  const xpToNextLevel = Math.floor(100 * Math.pow(1.5, level - 1));

  const t = useCallback(
    (key: string): string => {
      return translations[language]?.[key] || translations["en"]?.[key] || key;
    },
    [language],
  );

  const changeLanguage = () => {
    const languages = Object.keys(languageNames) as Language[];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const addToast = (achievement: Achievement) => {
    setToasts((prev) => [...prev, { id: Date.now(), achievement }]);
  };

  const unlockAchievement = (id: string) => {
    if (!unlockedAchievements.includes(id)) {
      setUnlockedAchievements((prev) => [...prev, id]);
      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      if (achievement) {
        addToast(achievement);
        celebrate(achievement); // Trigger full-screen celebration
        triggerSoundEvent("achievement-unlocked"); // Trigger sound effect
      }
    }
  };

  const getPerformanceStats = () => {
    const saved = localStorage.getItem("prepzone_performance");
    return saved ? JSON.parse(saved) : {};
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setLangSelected(true);
  };

  const handleApiKeySubmit = (key: string) => {
    try {
      const success = setApiKey(key);
      if (success) {
        setApiKeyConfigured(true);
      }
    } catch (error: any) {
      alert(
        error.message ||
          "Invalid API key. Please check your key and try again.",
      );
    }
  };

  const changeUserLocation = () => {
    setLocation(null);
  };

  if (!langSelected) {
    return <LanguageSelectionScreen onSelect={handleLanguageSelect} />;
  }

  if (!apiKeyConfigured) {
    return <ApiKeyScreen setApiKey={handleApiKeySubmit} />;
  }

  const appContextValue = {
    language,
    t,
    changeLanguage,
    selectLanguage,
    level,
    currentXp,
    xpToNextLevel,
    setLevel,
    setCurrentXp,
    view,
    setView,
    location,
    setLocation,
    unlockedAchievements,
    unlockAchievement,
    addToast,
    getPerformanceStats,
    changeUserLocation,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <SoundEffectsProvider>
        <FloatingParticles count={15} theme="safety" />
        <ToastManager toasts={toasts} setToasts={setToasts} />
        <AppContentWrapper />
        {currentCelebration && (
          <AchievementCelebration
            achievement={currentCelebration}
            onComplete={clearCelebration}
          />
        )}
      </SoundEffectsProvider>
    </AppContext.Provider>
  );
};

export default App;
