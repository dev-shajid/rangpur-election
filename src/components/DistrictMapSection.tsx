'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapViewer } from "@/components/MapViewer"
import { DistrictMapDialog } from "@/components/DistrictMapDialog"
import { Button } from "@/components/ui/button"
import { DistrictMap } from "@/types"
import { Pencil, Map as MapIcon, Plus } from "lucide-react"

interface DistrictMapSectionProps {
    mapData: DistrictMap | null
    districtId: string
    districtName: string
    isAdmin: boolean
}

export function DistrictMapSection({ mapData, districtId, districtName, isAdmin }: DistrictMapSectionProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const router = useRouter()

    const handleSuccess = () => {
        router.refresh()
    }

    if (!mapData && !isAdmin) {
        return null
    }

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <MapIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">
                            {mapData?.title || `${districtName} District Map`}
                        </h2>
                        {mapData?.description && (
                            <p className="text-sm text-muted-foreground">{mapData.description}</p>
                        )}
                    </div>
                </div>
                {isAdmin && (
                    <Button onClick={() => setDialogOpen(true)} variant="outline" size="sm">
                        {mapData ? (
                            <>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Map
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Map
                            </>
                        )}
                    </Button>
                )}
            </div>

            {mapData && <MapViewer mapUrl={mapData.mapUrl} height="400px" />}

            {!mapData && isAdmin && (
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                    <MapIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Map Configured</h3>
                    <p className="text-muted-foreground mb-4">
                        Add a map to display locations for {districtName} district
                    </p>
                    <Button onClick={() => setDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Map
                    </Button>
                </div>
            )}

            <DistrictMapDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                mapData={mapData}
                districtId={districtId}
                onSuccess={handleSuccess}
            />
        </section>
    )
}
