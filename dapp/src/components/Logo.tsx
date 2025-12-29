import { Shield } from "lucide-react";

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
        {/* Shield with multiple keys */}
        <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary to-gold-light">
          <Shield className={`${iconSize[size]} text-primary-foreground`} strokeWidth={1.5} />
          {/* Three key lines inside shield */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-3 bg-primary-foreground/80 rounded-full" />
              <div className="w-0.5 h-4 bg-primary-foreground rounded-full" />
              <div className="w-0.5 h-3 bg-primary-foreground/80 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`${textSize[size]} font-display font-semibold tracking-tight`}>
          MultiSig<span className="text-primary">Store</span>
        </span>
        {showTagline && (
          <span className="text-xs text-muted-foreground font-body">
            Collective Security for Shared Assets
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
