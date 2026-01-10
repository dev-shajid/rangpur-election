import { MapPin, Users, ChevronRight } from "lucide-react";
import { District } from "@/lib/districts";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { DISTRICT_COLORS, DistrictName } from "@/lib/constants";

interface DistrictCardProps {
    district: District;
    index: number;
}

const DistrictCard = ({ district, index }: DistrictCardProps) => {
    const color = DISTRICT_COLORS[district.id as DistrictName];
    return (
        <Link
            href={`/district/${district.id}`}
        >
            <Card
                style={{ animationDelay: `${index * 100}ms` }}
                className="relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 cursor-pointer shadow-card group hover:border-primary/30 hover:shadow-lg hover:translate-y-1.25"
            >
                {/* Color accent bar */}
                <div
                    className={`absolute top-0 left-0 right-0 h-1 ${color.bg} transition-all duration-300 group-hover:h-1.5 ${color.hoverBg}`}
                />
                <CardContent className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                            {district.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <p className="text-lg text-muted-foreground">{district.nameBn}</p>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                            <p className="text-sm text-muted-foreground">{district.upazilas.length} Upazilas</p>
                        </div>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default DistrictCard;
