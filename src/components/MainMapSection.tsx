'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapViewer } from "@/components/MapViewer"
import { MainMapDialog } from "@/components/MainMapDialog"
import { Button } from "@/components/ui/button"
import { MainMap } from "@/types"
import { Pencil, Map as MapIcon, Plus } from "lucide-react"

interface MainMapSectionProps {
    mapData: MainMap | null
    isSuperAdmin: boolean
}

export function MainMapSection({ mapData, isSuperAdmin }: MainMapSectionProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const router = useRouter()

    const handleSuccess = () => {
        router.refresh()
    }

    if (!mapData && !isSuperAdmin) {
        return null
    }

    return (
        <section className="container mx-auto px-4 py-12 sm:py-16">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <MapIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-foreground">
                            {mapData?.title || "Polling Locations"}
                        </h2>
                        {mapData?.description && (
                            <p className="mt-1 text-muted-foreground">{mapData.description}</p>
                        )}
                    </div>
                </div>
                {isSuperAdmin && (
                    <Button onClick={() => setDialogOpen(true)} variant="outline">
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

            {mapData && <MapViewer mapUrl={mapData.mapUrl} height="600px" />}

            {!mapData && isSuperAdmin && (
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                    <MapIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Map Configured</h3>
                    <p className="text-muted-foreground mb-4">
                        Add a map to display polling locations on the home page
                    </p>
                    <Button onClick={() => setDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Map
                    </Button>
                </div>
            )}

            <MainMapDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                mapData={mapData}
                onSuccess={handleSuccess}
            />
        </section>
    )
}
