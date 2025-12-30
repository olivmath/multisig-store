import { Home, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import { Button } from "../components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/">
            <div className="hidden sm:block">
              <Logo showTagline size="md" />
            </div>
            <div className="block sm:hidden">
              <Logo size="sm" />
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />

        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 */}
            <h1 className="text-8xl md:text-9xl font-bold text-primary/20 mb-4 animate-fade-in">
              404
            </h1>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 animate-fade-up">
              Page Not Found
            </h2>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
