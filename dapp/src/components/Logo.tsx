import { Store } from "lucide-react";

interface LogoProps {
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ showTagline = false, size = "md" }: LogoProps) => {
  const iconSize = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textSize = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80">
          <Store className={`${iconSize[size]} text-primary-foreground`} strokeWidth={2} />
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`${textSize[size]} font-semibold tracking-tight`}>
          MultiSig<span className="text-primary">Store</span>
        </span>
        {showTagline && (
          <span className="text-xs text-muted-foreground">
            Collective Security for Shared Assets
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
