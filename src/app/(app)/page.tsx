import DistrictCard from "@/components/DistrictCard";
import { districts } from "@/lib/districts";
import { Vote, Shield, Users, ClipboardList } from "lucide-react";
import { getMainMap } from "@/services/map.service";
import { auth } from "@/auth";
import { MainMapSection } from "@/components/MainMapSection";

const Index = async () => {
  const [mapData, session] = await Promise.all([
    getMainMap(),
    auth()
  ]);
  const isSuperAdmin = session?.user?.role === "superadmin";

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 pb-10 pt-16 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium mb-6">
              <Vote className="h-4 w-4" />
              <span>National Parlament Election 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
              Rangpur Division
              <span className="block text-primary mt-2">Election Portal</span>
            </h1>
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

      {/* Main Map Section */}
      <MainMapSection 
        mapData={mapData} 
        isSuperAdmin={isSuperAdmin}
      />

      {/* Info Cards */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {
            [
              {
                title: "Candidate Information",
                description: "View complete candidate profiles including party affiliation and contact details.",
                icon: Users,
                color: "blue"
              },
              {
                title: "Security Updates",
                description: "Real-time army camp information and security deployment across polling stations.",
                icon: Shield,
                color: "green"
              },
              {
                title: "Live Incident Feed",
                description: "Color-coded incident reports with severity levels and action statuses.",
                icon: Vote,
                color: "orange"
              },
              {
                title: "Polling Information",
                description: "Detailed polling center locations, serial numbers, and contact information.",
                icon: ClipboardList,
                color: "blue"
              }
            ].map((card, idx) => (
              <div key={idx} className={`section-card ${card.title === "Live Incident Feed" ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${card.color}-500/10 text-${card.color}-500`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{card.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {card.description}
                </p>
              </div>
            ))
          }
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
