import { DistrictCardSkeleton } from "@/components/loading/DistrictCardSkeleton";

export default function AppLoading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section Skeleton */}
            <section className="relative border-b border-border bg-linear-to-b from-primary/5 via-background to-background">
                <div className="container mx-auto px-4 py-16 sm:py-24 relative">
                    <div className="max-w-3xl mx-auto text-center animate-pulse">
                        <div className="h-8 w-48 bg-muted rounded-full mx-auto mb-6" />
                        <div className="h-16 w-3/4 bg-muted rounded-lg mx-auto mb-4" />
                        <div className="h-6 w-1/2 bg-muted rounded mx-auto" />
                    </div>
                </div>
            </section>

            {/* Districts Grid Skeleton */}
            <section className="container mx-auto px-4 py-12 sm:py-16">
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-2">
                        <div className="h-8 w-48 bg-muted rounded" />
                        <div className="h-4 w-64 bg-muted rounded" />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(8)].map((_, index) => (
                        <DistrictCardSkeleton key={index} />
                    ))}
                </div>
            </section>
        </div>
    );
}
