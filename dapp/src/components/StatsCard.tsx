import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    positive: boolean;
  };
}

const StatsCard = ({ title, value, trend }: StatsCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 card-hover flex flex-col items-center justify-center text-center">
      {/* Gold gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative flex flex-col items-center space-y-2">
        <div className="flex items-baseline gap-2">
          <p className="text-5xl font-display font-bold tracking-tight text-primary">{value}</p>
          {trend && (
            <span className={`text-sm font-medium ${trend.positive ? 'text-green-500' : 'text-destructive'}`}>
              {trend.positive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
        <p className="text-lg font-medium text-muted-foreground">{title}</p>
      </div>

      {/* Decorative element */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors duration-300" />
    </div>
  );
};

export default StatsCard;
