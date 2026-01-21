'use client'

import { useEffect, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    union: z.string().min(2, {
        message: "Union is required.",
    }),
    location: z.string().min(3, {
        message: "Location is required.",
    }),
    map: z.string().min(3, {
        message: "Map must be a valid map link.",
    }),
    maleVoters: z.number().min(0, {
        message: "Male voters must be 0 or greater.",
    }),
    femaleVoters: z.number().min(0, {
        message: "Female voters must be 0 or greater.",
    }),
    minority: z.number().min(0, {
        message: "Minority voters must be 0 or greater.",
    }),
    presidingOfficer: z.string().min(3, {
        message: "Presiding officer name is required.",
    }),
    contactDetails: z.string().min(10, {
        message: "Contact details must be at least 10 characters.",
    }),
    category: z.enum(["dangerous", "less-dangerous", "normal"], {
        message: "Please select a category.",
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
            union: pollingInfo?.union || "",
            location: pollingInfo?.location || "",
            map: pollingInfo?.map || "",
            maleVoters: pollingInfo?.maleVoters || 0,
            femaleVoters: pollingInfo?.femaleVoters || 0,
            minority: pollingInfo?.minority || 0,
            presidingOfficer: pollingInfo?.presidingOfficer || "",
            contactDetails: pollingInfo?.contactDetails || "",
            category: pollingInfo?.category || "normal",
        },
    })

    // Reset form when pollingInfo changes or dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                serial: pollingInfo?.serial || "",
                name: pollingInfo?.name || "",
                union: pollingInfo?.union || "",
                location: pollingInfo?.location || "",
                map: pollingInfo?.map || "",
                maleVoters: pollingInfo?.maleVoters || 0,
                femaleVoters: pollingInfo?.femaleVoters || 0,
                minority: pollingInfo?.minority || 0,
                presidingOfficer: pollingInfo?.presidingOfficer || "",
                contactDetails: pollingInfo?.contactDetails || "",
                category: pollingInfo?.category || "normal",
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="serial"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Serial</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 001" disabled={isPending} {...field} />
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
                                        <FormLabel>Name Of Polling Center</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter polling center name" disabled={isPending} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="union"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Union</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter union name" disabled={isPending} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter location" disabled={isPending} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="map"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Map URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Google Maps embed URL" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="maleVoters"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Male Voters</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="0" 
                                                disabled={isPending} 
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="femaleVoters"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Female Voters</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="0" 
                                                disabled={isPending} 
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="minority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Minority</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="0" 
                                                disabled={isPending} 
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="presidingOfficer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Presiding Officer</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter officer name" disabled={isPending} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contactDetails"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Details</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter phone number" disabled={isPending} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Of Polling Center</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="less-dangerous">Less Dangerous</SelectItem>
                                            <SelectItem value="dangerous">Dangerous</SelectItem>
                                        </SelectContent>
                                    </Select>
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
