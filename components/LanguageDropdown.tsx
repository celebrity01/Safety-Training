import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAppContext } from "../types";
import { languageNames, Language } from "../translations";

// Modern SVG Icons
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

const CheckIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4",
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

const SearchIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4",
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

const XIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
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

interface LanguageDropdownProps {
  variant?: "single" | "multi";
  showSearch?: boolean;
  placement?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  variant = "single",
  showSearch = true,
  placement = "bottom-right",
  size = "md",
  className = "",
}) => {
  const { language, selectLanguage } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(
    variant === "multi" ? [language] : []
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const languages = Object.keys(languageNames) as Language[];
  const filteredLanguages = languages.filter((lang) =>
    languageNames[lang].toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Size variants
  const sizeClasses = {
    sm: {
      trigger: "px-3 py-2 text-sm",
      dropdown: "min-w-48",
      option: "px-3 py-2 text-sm",
      search: "px-3 py-2 text-sm",
    },
    md: {
      trigger: "px-4 py-3 text-base",
      dropdown: "min-w-56",
      option: "px-4 py-3 text-base",
      search: "px-4 py-3 text-base",
    },
    lg: {
      trigger: "px-5 py-4 text-lg",
      dropdown: "min-w-64",
      option: "px-5 py-4 text-lg",
      search: "px-5 py-4 text-lg",
    },
  };

  const currentSize = sizeClasses[size];

  // Placement classes
  const placementClasses = {
    "bottom-left": "top-full left-0 mt-2",
    "bottom-right": "top-full right-0 mt-2",
    "top-left": "bottom-full left-0 mb-2",
    "top-right": "bottom-full right-0 mb-2",
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && showSearch && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isOpen, showSearch]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isOpen) {
        if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
          event.preventDefault();
          setIsOpen(true);
          setFocusedIndex(0);
        }
        return;
      }

      switch (event.key) {
        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setSearchQuery("");
          setFocusedIndex(-1);
          triggerRef.current?.focus();
          break;

        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prev) =>
            prev < filteredLanguages.length - 1 ? prev + 1 : 0
          );
          break;

        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredLanguages.length - 1
          );
          break;

        case "Enter":
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filteredLanguages.length) {
            handleLanguageSelect(filteredLanguages[focusedIndex]);
          }
          break;

        case "Tab":
          setIsOpen(false);
          setSearchQuery("");
          setFocusedIndex(-1);
          break;
      }
    },
    [isOpen, focusedIndex, filteredLanguages]
  );

  // Handle language selection
  const handleLanguageSelect = (selectedLang: Language) => {
    if (variant === "single") {
      selectLanguage(selectedLang);
      setIsOpen(false);
      setSearchQuery("");
      setFocusedIndex(-1);
    } else {
      // Multi-select logic
      setSelectedLanguages((prev) =>
        prev.includes(selectedLang)
          ? prev.filter((lang) => lang !== selectedLang)
          : [...prev, selectedLang]
      );
    }
  };

  // Get display text for trigger
  const getDisplayText = () => {
    if (variant === "single") {
      return languageNames[language];
    } else {
      if (selectedLanguages.length === 0) return "Select languages";
      if (selectedLanguages.length === 1) return languageNames[selectedLanguages[0]];
      return `${selectedLanguages.length} languages selected`;
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    searchRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          ${currentSize.trigger}
          w-full flex items-center justify-between gap-3
          bg-white border-2 border-gray-200 rounded-xl
          text-gray-700 font-medium
          transition-all duration-200 ease-out
          hover:border-brand-primary hover:shadow-sm
          focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2
          ${isOpen ? "border-brand-primary shadow-sm" : ""}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        <div className="flex items-center gap-3">
          <GlobeIcon className="w-5 h-5 text-brand-primary" />
          <span className="truncate">{getDisplayText()}</span>
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" />
          
          <div
            className={`
              absolute ${placementClasses[placement]} ${currentSize.dropdown}
              bg-white border border-gray-200 rounded-2xl shadow-2xl z-50
              animate-scale-in origin-top
              max-h-80 overflow-hidden
              backdrop-blur-lg
            `}
            role="listbox"
            aria-label="Language options"
          >
            {/* Search Input */}
            {showSearch && (
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search languages..."
                    className={`
                      ${currentSize.search}
                      w-full pl-10 pr-10
                      bg-gray-50 border border-gray-200 rounded-xl
                      text-gray-700 placeholder-gray-400
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent
                    `}
                    aria-label="Search languages"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Clear search"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <ul
              ref={listRef}
              className="max-h-60 overflow-y-auto py-2"
              role="listbox"
              aria-multiselectable={variant === "multi"}
            >
              {filteredLanguages.length === 0 ? (
                <li className="px-4 py-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">🔍</div>
                  <div className="text-sm">No languages found</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Try adjusting your search
                  </div>
                </li>
              ) : (
                filteredLanguages.map((lang, index) => {
                  const isSelected = variant === "single" 
                    ? language === lang 
                    : selectedLanguages.includes(lang);
                  const isFocused = focusedIndex === index;

                  return (
                    <li key={lang} role="option" aria-selected={isSelected}>
                      <button
                        onClick={() => handleLanguageSelect(lang)}
                        className={`
                          ${currentSize.option}
                          w-full flex items-center justify-between
                          text-left transition-all duration-150
                          ${
                            isSelected
                              ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold"
                              : isFocused
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700 hover:bg-gray-50"
                          }
                        `}
                        onMouseEnter={() => setFocusedIndex(index)}
                      >
                        <div className="flex items-center gap-3">
                          {/* Language Flag/Indicator */}
                          <div
                            className={`
                              w-3 h-3 rounded-full border-2
                              ${
                                isSelected
                                  ? "bg-white border-white"
                                  : "border-gray-300"
                              }
                            `}
                          />
                          <span>{languageNames[lang]}</span>
                        </div>
                        
                        {isSelected && (
                          <CheckIcon className="w-4 h-4 text-white animate-scale-in" />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>

            {/* Multi-select Actions */}
            {variant === "multi" && selectedLanguages.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-600">
                    {selectedLanguages.length} selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedLanguages([])}
                      className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Clear all
                    </button>
                    <button
                      onClick={() => {
                        // Apply selection logic here
                        setIsOpen(false);
                        setSearchQuery("");
                        setFocusedIndex(-1);
                      }}
                      className="px-4 py-1 bg-brand-primary text-white text-xs font-medium rounded-lg hover:bg-brand-primary-dark transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};