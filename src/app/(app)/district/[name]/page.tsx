import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Radio, Shield, Users } from "lucide-react";
import { getCriticalUpdatesCountByDistrict, getUpdatesByDistrict } from "@/services/update.service";
import { getDistrictById } from '@/lib/districts';
import SectionCard from '@/components/SectionCard';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CriticalUpdatesBannerSkeleton } from '@/components/loading/CriticalUpdatesBannerSkeleton';
import { DISTRICT_COLORS } from '@/lib/constants';

export default async function DistrictDashboard({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    const districtName = decodeURIComponent(name);

    const district = districtName ? getDistrictById(districtName) : null;

    if (!district) {
        notFound();
    }

    return (
        <>
            {/* District Header */}
            <section className="border-b border-border bg-linear-to-b from-muted/50 to-background">
                <div className="container mx-auto px-4 py-10">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Districts
                        </Button>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className={`h-16 w-2 rounded-full ${DISTRICT_COLORS[districtName.toLowerCase()].bg}`} />
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                                {district.name}
                            </h1>
                            <p className="text-xl text-muted-foreground mt-1">{district.nameBn}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Cards */}
            <section className="container mx-auto px-4 py-12">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                    Election Information
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <SectionCard
                        title="Candidate Information"
                        description="View all registered candidates, their party affiliations, and contact details"
                        icon={Users}
                        to={`/district/${districtName}/candidates`}
                        color="primary"
                    />

                    <SectionCard
                        title="Army Camp Information"
                        description="Security deployment details including unit locations and manpower"
                        icon={Shield}
                        to={`/district/${districtName}/army-camps`}
                        color="accent"
                    />

                    <SectionCard
                        title="Latest Updates"
                        description="Real-time incident reports and status updates from polling stations"
                        icon={Radio}
                        to={`/district/${districtName}/updates`}
                        color="warning"
                    />
                </div>

                {/* Alert Banner for Critical Updates */}
                <Suspense fallback={<CriticalUpdatesBannerSkeleton />}>
                    <CriticalUpdatesBanner districtId={district.name} />
                </Suspense>
            </section>
        </>
    );
}

async function CriticalUpdatesBanner({ districtId }: { districtId: string }) {
    const criticalCount = await getCriticalUpdatesCountByDistrict(districtId);
    if (criticalCount === 0) {
        return null;
    }
    return (
        <div className="mt-8 rounded-xl border-2 border-destructive/30 bg-destructive/10 p-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                    <Radio className="h-5 w-5 text-destructive animate-pulse-subtle" />
                </div>
                <div>
                    <p className="font-semibold text-destructive">
                        {criticalCount} Critical {criticalCount === 1 ? "Incident" : "Incidents"} Reported
                    </p>
                    <p className="text-sm">
                        Immediate attention required. View the updates section for details.
                    </p>
                </div>
                <Link href={`/district/${districtId}/updates`} className="ml-auto">
                    <Button variant="destructive" size="sm">
                        View Updates
                    </Button>
                </Link>
            </div>
        </div>
    );
}