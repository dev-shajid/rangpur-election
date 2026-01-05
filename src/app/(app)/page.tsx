import Header from "@/components/Header";
import DistrictCard from "@/components/DistrictCard";
import { districts } from "@/lib/districts";
import { Vote, Shield, Users } from "lucide-react";

const Index = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-linear-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

        <div className="container mx-auto px-4 py-16 sm:py-24 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <Vote className="h-4 w-4" />
              <span>National Election 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Rangpur Division
              <span className="block text-primary mt-2">Election Portal</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Access real-time election information, candidate details, security updates,
              and incident reports for all 8 districts in Rangpur Division.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">8</div>
                <div className="text-sm text-muted-foreground">Districts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">15.9M</div>
                <div className="text-sm text-muted-foreground">Population</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">24/7</div>
                <div className="text-sm text-muted-foreground">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Districts Grid */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Select a District</h2>
            <p className="mt-1 text-muted-foreground">Choose your district to view election information</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {districts.map((district, index) => (
            <DistrictCard key={district.id} district={district} index={index} />
          ))}
        </div>
      </section>

      {/* Info Cards */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="section-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Candidate Information</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              View complete candidate profiles including party affiliation and contact details.
            </p>
          </div>

          <div className="section-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Security Updates</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Real-time army camp information and security deployment across polling stations.
            </p>
          </div>

          <div className="section-card sm:col-span-2 lg:col-span-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Vote className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Live Incident Feed</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Color-coded incident reports with severity levels and action statuses.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Rangpur Division Election Commission. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              For official use only. Data accuracy is admin responsibility.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Index;
