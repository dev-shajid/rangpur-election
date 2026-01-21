'use client'

import { Card } from "@/components/ui/card"

interface MapViewerProps {
    mapUrl: string
    title?: string
    height?: string
}

export function MapViewer({ mapUrl, title, height = "500px" }: MapViewerProps) {
    return (
        <Card className="overflow-hidden">
            {title && (
                <div className="border-b border-border px-6 py-4">
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                </div>
            )}
            <div style={{ height }} className="w-full">
                <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={title || "Map"}
                />
            </div>
        </Card>
    )
}
