import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ClipboardList, Radio, Shield, Users } from "lucide-react";
import { getCriticalUpdatesCountByDistrict } from "@/services/update.service";
import { getUpazilaById } from '@/lib/districts';
import SectionCard from '@/components/SectionCard';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CriticalUpdatesBannerSkeleton } from '@/components/loading/CriticalUpdatesBannerSkeleton';

export default async function UpazilaDashboard({ params }: { params: Promise<{ name: string, upazilaId: string }> }) {
    const { name, upazilaId } = await params;
    const districtId = decodeURIComponent(name);
    const upazilaIdDecoded = decodeURIComponent(upazilaId);

    const upazila = upazilaIdDecoded ? getUpazilaById(districtId, upazilaIdDecoded) : null;

    if (!upazila) {
        notFound();
    }

    return (
        <>
            {/* District Header */}
            <section className="border-b border-border bg-linear-to-b from-muted/50 to-background">
                <div className="container mx-auto px-4 py-10">
                    <Link href={`/district/${districtId}`}>
                        <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to {districtId.charAt(0).toUpperCase() + districtId.slice(1)}
                        </Button>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                                {upazila.nameBn}
                            </h1>
                            <p className="text-xl text-muted-foreground mt-1">{upazila.nameEn}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Cards */}
            <section className="container mx-auto px-4 py-12">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                    Election Information
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <SectionCard
                        title="Candidate Information"
                        description="View all registered candidates, their party affiliations, and contact details"
                        icon={Users}
                        to={`/district/${districtId}/${upazila.id}/candidates`}
                        color="primary"
                    />

                    <SectionCard
                        title="Army Camp Information"
                        description="Security deployment details including unit locations and manpower"
                        icon={Shield}
                        to={`/district/${districtId}/${upazila.id}/army-camps`}
                        color="accent"
                    />

                    <SectionCard
                        title="Security Updates"
                        description="Real-time incident reports and status updates from polling stations"
                        icon={Radio}
                        to={`/district/${districtId}/${upazila.id}/updates`}
                        color="warning"
                    />

                    <SectionCard
                        title="Polling Information"
                        description="Manage and view polling center details, serial numbers, and locations"
                        icon={ClipboardList}
                        to={`/district/${districtId}/${upazila.id}/polling`}
                        color="primary"
                    />
                </div>

                {/* Alert Banner for Critical Updates */}
                <Suspense fallback={<CriticalUpdatesBannerSkeleton />}>
                    <CriticalUpdatesBanner districtId={districtId} upazilaId={upazila.id} />
                </Suspense>
            </section>
        </>
    );
}

async function CriticalUpdatesBanner({ districtId, upazilaId }: { districtId: string, upazilaId: string }) {
    const criticalCount = await getCriticalUpdatesCountByDistrict(upazilaId);
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
                <Link href={`/district/${districtId}/${upazilaId}/updates`} className="ml-auto">
                    <Button variant="destructive" size="sm">
                        View Updates
                    </Button>
                </Link>
            </div>
        </div>
    );
}