
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const DistrictCardSkeleton = () => {
    return (
        <Card className="relative overflow-hidden rounded-xl border border-border bg-card">
            <div className="absolute top-0 left-0 right-0 h-1 bg-muted" />
            <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
            </CardContent>
        </Card>
    );
};
