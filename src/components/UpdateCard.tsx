import { Clock, MapPin, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { Update, IncidentCategory } from "@/types";
import { Badge } from "@/components/ui/badge";

interface UpdateCardProps {
    update: Update;
}

const UpdateCard = ({ update }: UpdateCardProps) => {
    const getCategoryConfig = (category: IncidentCategory) => {
        switch (category) {
            case "critical":
                return {
                    containerClass: "bg-red-500/10 border-red-500 border-2",
                    badge: "bg-red-500",
                    icon: AlertTriangle,
                    label: "Critical",
                };
            case "less-critical":
                return {
                    containerClass: "bg-yellow-500/10 border-yellow-500 border-2",
                    badge: "bg-yellow-500",
                    icon: AlertCircle,
                    label: "Less Critical",
                };
            default:
                return {
                    containerClass: "bg-green-500/10 border-green-500 border-2",
                    badge: "bg-green-500",
                    icon: CheckCircle,
                    label: "Normal",
                };
        }
    };

    const config = getCategoryConfig(update.category);
    const IconComponent = config.icon;

    const formattedTime = new Date(update.updatedAt || 0).toLocaleString("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    return (
        <div className={`rounded-xl p-5 ${config.containerClass} transition-all duration-200 hover:shadow-md`}>
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80">
                        <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-sm opacity-80">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formattedTime}</span>
                        </div>
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 opacity-70" />
                                <span className="font-medium">{update.location}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Badge className={config.badge}>
                    {config.label}
                </Badge>
            </div>

            {/* Incident Description */}
            <div className="mt-4">
                <p className="text-sm leading-relaxed">{update.incident}</p>
            </div>

            {/* Requirements & Action */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-background/50 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide opacity-60">Requirements</p>
                    <p className="mt-1 text-sm">{update.requirements}</p>
                </div>
                <div className="rounded-lg bg-background/50 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide opacity-60">Action Taken</p>
                    <p className="mt-1 text-sm">{update.action}</p>
                </div>
            </div>
        </div>
    );
};

export default UpdateCard;
