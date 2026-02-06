import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { CareerPath } from "@/types/career";
import { DEMAND_LABELS } from "@/lib/constants";

export interface CareerCardProps {
  career: CareerPath;
}

export default function CareerCard({ career }: CareerCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-xl">{career.title}</CardTitle>
          <Badge variant={career.demand === "High" ? "warning" : career.demand === "Medium" ? "default" : "low"}>
            {DEMAND_LABELS[career.demand]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-[var(--muted)] leading-relaxed">{career.reason}</p>
      </CardContent>
    </Card>
  );
}
