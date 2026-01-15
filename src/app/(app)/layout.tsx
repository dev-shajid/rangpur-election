import Header from "@/components/Header";
import WatermarkLayout from "@/components/Watermark";

export default function DistrictLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <WatermarkLayout />
            <Header />
            <>
                {children}
            </>
        </div>
    );
}
