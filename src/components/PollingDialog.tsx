'use client'

import { useEffect, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PollingInfo } from "@/types"
import { toast } from "sonner"
import { createPollingInfo, updatePollingInfo } from "@/services/polling.service"

const formSchema = z.object({
    serial: z.string().min(1, {
        message: "Serial is required.",
    }),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    map: z.string().min(3, {
        message: "Map must be a valid map link.",
    }),
    constituency: z.string().min(2, {
        message: "Constituency must be at least 2 characters.",
    }),
    phoneNumber: z.string().min(10, {
        message: "Phone number must be at least 10 characters.",
    }),
    address: z.string().min(3, {
        message: "Address must be at least 3 characters.",
    }),
    pollingAgent: z.string().min(3, {
        message: "Polling agent must be at least 3 characters.",
    }),
    responsiblePersonnel: z.string().min(3, {
        message: "Responsible personnel must be at least 3 characters.",
    }),
})

interface PollingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    pollingInfo?: PollingInfo
    districtId: string
    upazilaId: string
    onSuccess: () => void
}

export function PollingDialog({ open, onOpenChange, pollingInfo, districtId, upazilaId, onSuccess }: PollingDialogProps) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serial: pollingInfo?.serial || "",
            name: pollingInfo?.name || "",
            map: pollingInfo?.map || "",
            constituency: pollingInfo?.constituency || "",
            phoneNumber: pollingInfo?.phoneNumber || "",
            address: pollingInfo?.address || "",
            pollingAgent: pollingInfo?.pollingAgent || "",
            responsiblePersonnel: pollingInfo?.responsiblePersonnel || "",
        },
    })

    // Reset form when pollingInfo changes or dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                serial: pollingInfo?.serial || "",
                name: pollingInfo?.name || "",
                map: pollingInfo?.map || "",
                constituency: pollingInfo?.constituency || "",
                phoneNumber: pollingInfo?.phoneNumber || "",
                address: pollingInfo?.address || "",
            })
        }
    }, [pollingInfo, open, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                if (pollingInfo?._id) {
                    await updatePollingInfo(pollingInfo._id, { ...values, districtId, upazilaId })
                    toast.success("Polling information updated successfully")
                } else {
                    await createPollingInfo({ ...values, districtId, upazilaId })
                    toast.success("Polling information created successfully")
                }
                onSuccess()
                onOpenChange(false)
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to save polling information")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>{pollingInfo ? "Edit Polling Center" : "Add New Polling Center"}</DialogTitle>
                    <DialogDescription>
                        {pollingInfo ? "Update polling center details" : "Add a new polling center to the district"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="serial"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Serial</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter serial number" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter polling center name" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="constituency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Constituency</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter constituency" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter phone number" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter address" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="map"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Map</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter map link" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pollingAgent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Polling Agent</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter polling agent" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="responsiblePersonnel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Responsible Personnel</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter responsible personnel" disabled={isPending} {...field} />
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
                                {isPending ? "Saving..." : pollingInfo ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
