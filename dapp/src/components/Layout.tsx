import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import ConnectButton from "./ConnectButton";
import { NotificationBell } from "./NotificationBell";
import { NetworkSelector } from "./NetworkSelector";
import { Footer } from "./Footer";
import { Tutorial } from "./Tutorial";
import { useTutorial } from "../contexts/TutorialContext";
import { AnnouncementBanner } from "./AnnouncementBanner";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { showTutorial, closeTutorial } = useTutorial();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Announcement Banner */}
      <AnnouncementBanner variant="warning" storageKey="testnet-banner-v1">
        This app is running on <strong>Sepolia Testnet</strong>. Do not use real funds.
      </AnnouncementBanner>

      {/* Header - Fixed */}
      <header className="flex-shrink-0 border-b border-border bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link to="/dashboard" className="hidden sm:block">
            <Logo size="md" />
          </Link>
          <Link to="/dashboard" className="block sm:hidden">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationBell />
            <NetworkSelector />
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Body - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Footer - Fixed */}
      <Footer />

      {/* Tutorial Modal */}
      <Tutorial forceOpen={showTutorial} onClose={closeTutorial} />
    </div>
  );
}
