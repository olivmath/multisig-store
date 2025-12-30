import { createContext, useContext, useState, ReactNode } from "react";

interface TutorialContextType {
  showTutorial: boolean;
  openTutorial: () => void;
  closeTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | null>(null);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [showTutorial, setShowTutorial] = useState(false);

  const openTutorial = () => setShowTutorial(true);
  const closeTutorial = () => setShowTutorial(false);

  return (
    <TutorialContext.Provider value={{ showTutorial, openTutorial, closeTutorial }}>
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
