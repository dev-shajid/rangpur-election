import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Radio } from "lucide-react";
import { getDistrictById } from '@/lib/districts';
import { notFound } from 'next/navigation';
import { DISTRICT_COLORS } from '@/lib/constants';
import { auth } from '@/auth';
import { cn } from '@/lib/utils';

export default async function DistrictDashboard({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const districtName = decodeURIComponent(name);
  const session = await auth();

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
        {/* Upazilas Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Administrative Subdivisions (Upazilas)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {district.upazilas.map((upazila) => (
              <Link
                href={`/district/${districtName}/${upazila.id}`}
                key={upazila.nameBn}
                className="group relative p-4 rounded-md border border-border bg-card/60 backdrop-blur hover:bg-card hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Accent dot */}
                <span className={cn("absolute top-3 right-3 h-2 w-2 rounded-full transition-colors", session?.user?.role === upazila.id ? "bg-green-500" : "bg-primary/40 group-hover:bg-primary")} />

                {/* Content */}
                <div className="flex flex-col gap-1">
                  {/* Bangla name */}
                  <span className="text-base font-semibold text-foreground leading-tight">
                    {upazila.nameBn}
                  </span>

                  {/* English name */}
                  <span className="text-xs uppercase tracking-wide text-muted-foreground group-hover:text-primary transition-colors">
                    {upazila.nameEn}
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}