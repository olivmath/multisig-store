import { X, Info, AlertTriangle, Megaphone } from "lucide-react";
import { useState, ReactNode } from "react";

interface AnnouncementBannerProps {
  children: ReactNode;
  variant?: "info" | "warning" | "promo";
  dismissible?: boolean;
  storageKey?: string;
}

export function AnnouncementBanner({
  children,
  variant = "info",
  dismissible = true,
  storageKey,
}: AnnouncementBannerProps) {
  const [isDismissed, setIsDismissed] = useState(() => {
    if (storageKey) {
      return localStorage.getItem(storageKey) === "dismissed";
    }
    return false;
  });

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    if (storageKey) {
      localStorage.setItem(storageKey, "dismissed");
    }
  };

  const variantStyles = {
    info: "bg-primary/10 border-primary/20 text-primary",
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400",
    promo: "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-primary/30 text-primary",
  };

  const Icon = {
    info: Info,
    warning: AlertTriangle,
    promo: Megaphone,
  }[variant];

  return (
    <div className={`border-b ${variantStyles[variant]}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-center gap-3 text-base">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-center">{children}</span>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="ml-2 p-1 rounded hover:bg-background/20 transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
