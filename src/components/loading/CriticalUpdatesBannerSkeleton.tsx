
import { Skeleton } from "@/components/ui/skeleton";

export const CriticalUpdatesBannerSkeleton = () => { 
    return (
        <div className="mt-8 rounded-xl border-2 p-4">
            <div className="flex items-center gap-3">
                <Skeleton className="flex h-10 w-10 items-center justify-center rounded-full"/>
                <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="ml-auto h-8 w-24 rounded-md" />
            </div>
        </div>
    );
};