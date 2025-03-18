
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
}: StatsCardProps) => {
  return (
    <Card className={cn("overflow-hidden hover-lift transition-all", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="mt-1 text-xs text-muted-foreground flex items-center">
            {description}
            {trend && trendValue && (
              <span
                className={cn(
                  "ml-1 flex items-center",
                  trend === "up" && "text-green-500",
                  trend === "down" && "text-red-500"
                )}
              >
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "•"} {trendValue}
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
