import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const TUTORIAL_STORAGE_KEY = "multisig-store-tour-completed";

interface TutorialContextType {
  showTutorial: boolean;
  openTutorial: () => void;
  closeTutorial: () => void;
  hasCompletedTutorial: boolean;
}

const TutorialContext = createContext<TutorialContextType | null>(null);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(true);

  // Check if user has completed the tutorial before
  useEffect(() => {
    const completed = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (!completed) {
      // First time user - start tutorial after a short delay
      setHasCompletedTutorial(false);
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const openTutorial = () => setShowTutorial(true);

  const closeTutorial = () => {
    setShowTutorial(false);
    setHasCompletedTutorial(true);
    localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
  };

  return (
    <TutorialContext.Provider
      value={{ showTutorial, openTutorial, closeTutorial, hasCompletedTutorial }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
}
