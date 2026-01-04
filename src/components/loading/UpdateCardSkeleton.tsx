
import { Skeleton } from "@/components/ui/skeleton";

export const UpdateCardSkeleton = () => {
    return (
        <div className="rounded-xl p-5 border border-border bg-card">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center">
                        <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-40" />
                    </div>
                </div>

                <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Incident Description */}
            <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Requirements & Action */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3">
                    <Skeleton className="h-3 w-20 mb-2" />
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="rounded-lg border p-3">
                    <Skeleton className="h-3 w-20 mb-2" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
        </div>
    );
};
