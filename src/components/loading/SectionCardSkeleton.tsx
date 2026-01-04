
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const SectionCardSkeleton = () => {
    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                    <Skeleton className="h-14 w-14 rounded-xl" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="mt-4 flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4" />
                </div>
            </CardContent>
        </Card>
    );
};
