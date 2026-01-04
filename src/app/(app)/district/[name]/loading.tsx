
import { SectionCardSkeleton } from "@/components/loading/SectionCardSkeleton";
import { CriticalUpdatesBannerSkeleton } from "@/components/loading/CriticalUpdatesBannerSkeleton";
import { PageHeaderSkeleton } from "@/components/loading/PageHeaderSkeleton";

export default function DistrictLoading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Page Header Skeleton */}
                <PageHeaderSkeleton />
            </div>
            <hr />
            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Dashboard Grid Skeleton */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}>
                            <SectionCardSkeleton />
                        </div>
                    ))}
                </div>

                {/* Critical Updates Skeleton */}
                <CriticalUpdatesBannerSkeleton />
            </div>
        </div>
    );
}
