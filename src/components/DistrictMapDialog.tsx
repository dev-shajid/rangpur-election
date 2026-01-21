'use client'

import { useEffect, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DistrictMap } from "@/types"
import { toast } from "sonner"
import { createOrUpdateDistrictMap } from "@/services/district-map.service"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    mapUrl: z.string().url({
        message: "Please enter a valid URL.",
    }),
    description: z.string().optional(),
})

interface DistrictMapDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mapData?: DistrictMap | null
    districtId: string
    onSuccess: () => void
}

export function DistrictMapDialog({ open, onOpenChange, mapData, districtId, onSuccess }: DistrictMapDialogProps) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: mapData?.title || "",
            mapUrl: mapData?.mapUrl || "",
            description: mapData?.description || "",
        },
    })

    useEffect(() => {
        if (open) {
            form.reset({
                title: mapData?.title || "",
                mapUrl: mapData?.mapUrl || "",
                description: mapData?.description || "",
            })
        }
    }, [mapData, open, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                await createOrUpdateDistrictMap(districtId, values)
                toast.success("District map updated successfully")
                onSuccess()
                onOpenChange(false)
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to save map")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>{mapData ? "Edit District Map" : "Add District Map"}</DialogTitle>
                    <DialogDescription>
                        Configure the map for this district
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., District Map" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mapUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Map URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://your-map-url-here" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Brief description of the map" 
                                            disabled={isPending} 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : mapData ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
