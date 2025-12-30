interface StatsCardProps {
  title: string;
  value: string | number;
}

const StatsCard = ({ title, value }: StatsCardProps) => {
  return (
    <div className="rounded-2xl bg-card border border-border p-6 card-hover flex flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center space-y-2">
        <p className="text-5xl font-bold tracking-tight text-primary">{value}</p>
        <p className="text-lg font-medium text-muted-foreground">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
