import React, { createContext, useContext } from "react";
import { Language } from "./translations";

export enum GameState {
  LANGUAGE_SELECTION,
  CATEGORY_SELECTION,
  LOADING,
  GAME,
  GAME_OVER,
  ERROR,
}

export type View = "dashboard" | "game" | "comms" | "achievements";

export interface Question {
  question: string;
  choices: string[];
  correctChoiceIndex: number;
  feedback: string[];
}

export interface Scenario {
  imageUrl: string;
  questionData: Question;
}

export interface Category {
  key: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface GameHistoryItem {
  question: string;
  userChoice: string;
  correctChoice: string;
  isCorrect: boolean;
}

export interface Achievement {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  rarity: "common" | "rare" | "legendary";
}

export interface Toast {
  id: number;
  achievement: Achievement;
}

// --- COMMS HUB TYPES ---
export interface Broadcast {
  title: string;
  message: string;
  severity: "Alert" | "Warning" | "Info";
  timestamp: string;
  sources?: { web: { uri: string; title: string } }[];
}

export interface Message {
  id: number;
  text: string;
  sender: "user" | "contact" | "system";
  timestamp: string;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string; // Emoji
  lastMessage: string;
  unread: number;
}

// --- APP CONTEXT ---
interface AppContextType {
  language: Language;
  t: (key: string) => string;
  changeLanguage: () => void;
  selectLanguage: (lang: Language) => void;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  setCurrentXp: React.Dispatch<React.SetStateAction<number>>;
  view: View;
  setView: React.Dispatch<React.SetStateAction<View>>;
  location: string | null;
  setLocation: React.Dispatch<React.SetStateAction<string | null>>;
  unlockedAchievements: string[];
  unlockAchievement: (id: string) => void;
  addToast: (achievement: Achievement) => void;
  getPerformanceStats: () => Record<string, { total: number; correct: number }>;
  changeUserLocation: () => void;
}
export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
