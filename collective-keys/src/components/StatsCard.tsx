import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
}

const StatsCard = ({ title, value, icon: Icon, description, trend }: StatsCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 card-hover">
      {/* Gold gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Icon */}
      <div className="relative mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-start space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-display font-semibold tracking-tight">{value}</p>
          {trend && (
            <span className={`text-sm font-medium ${trend.positive ? 'text-green-500' : 'text-destructive'}`}>
              {trend.positive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Decorative element */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors duration-300" />
    </div>
  );
};

export default StatsCard;
