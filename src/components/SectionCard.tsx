import { LucideIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "./ui/card";

interface SectionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color: "primary" | "accent" | "warning";
}

const SectionCard = ({ title, description, icon: Icon, to, color }: SectionCardProps) => {
  const colorStyles = {
    primary: {
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      hoverBorder: "hover:border-blue-500/30",
    },
    accent: {
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
      hoverBorder: "hover:border-green-500/30",
    },
    warning: {
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
      hoverBorder: "hover:border-orange-500/30",
    },
  };

  const styles = colorStyles[color];

  return (
    <Link
      href={to}
    >
      <Card
        className={`group block ${styles.hoverBorder}`}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${styles.iconBg}`}>
              <Icon className={`h-7 w-7 ${styles.iconColor}`} />
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-foreground transition-colors">
              {title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
            <span>View details</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SectionCard;
