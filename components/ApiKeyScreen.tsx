import React, { useState } from "react";

// Clean icons
const KeyIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
    />
  </svg>
);

const EyeIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOffIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m0 0l3.122 3.122M12 12l3.122-3.122m4.256 4.256l3 3m-3-3L21 3"
    />
  </svg>
);

const ExternalLinkIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4",
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

interface ApiKeyScreenProps {
  setApiKey: (key: string) => void;
}

export const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ setApiKey }) => {
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    setIsSubmitting(true);
    try {
      setApiKey(key.trim());
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-display-2 font-display mb-2">
              API Key Required
            </h1>
            <p className="text-body text-secondary">
              Enter your Google AI API key to start using PrepZone
            </p>
          </div>

          {/* API Key Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="apiKey"
                className="block text-body-sm font-medium mb-2"
              >
                Google AI API Key
              </label>
              <div className="relative">
                <input
                  id="apiKey"
                  type={showKey ? "text" : "password"}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Enter your API key..."
                  className="input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary"
                >
                  {showKey ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!key.trim() || isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <KeyIcon className="w-4 h-4" />
                  Continue
                </>
              )}
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-surface rounded-lg">
            <h3 className="text-body-sm font-medium mb-3">Need an API key?</h3>
            <div className="space-y-3 text-body-sm text-secondary">
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary-light rounded-full text-primary text-xs flex items-center justify-center mt-0.5">
                  1
                </span>
                <p>Visit Google AI Studio to get your free API key</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary-light rounded-full text-primary text-xs flex items-center justify-center mt-0.5">
                  2
                </span>
                <p>Copy the API key and paste it above</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary-light rounded-full text-primary text-xs flex items-center justify-center mt-0.5">
                  3
                </span>
                <p>Start your disaster preparedness training!</p>
              </div>
            </div>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary mt-4 inline-flex items-center gap-2"
            >
              Get API Key
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 border border-warning bg-yellow-50 rounded-lg">
            <p className="text-body-sm text-warning">
              <strong>Note:</strong> Your API key is stored locally and never
              shared with others. It's only used to communicate with Google's AI
              services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
