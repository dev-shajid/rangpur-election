'use client'

import { useEffect, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Update } from "@/types"
import { toast } from "sonner"
import { createUpdate, updateUpdate } from "@/services/update.service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
    time: z.string().min(1, {
        message: "Time is required.",
    }),
    location: z.string().min(3, {
        message: "Location must be at least 3 characters.",
    }),
    incident: z.string().min(5, {
        message: "Incident description must be at least 5 characters.",
    }),
    category: z.enum(["normal", "less-critical", "critical"]),
    requirements: z.string().optional().default("None"),
    action: z.string().min(3, {
        message: "Action taken must be at least 3 characters.",
    }),
})

type FormValues = z.infer<typeof formSchema>

interface UpdateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    update?: Update
    districtId: string
    onSuccess: () => void
}

export function UpdateDialog({ open, onOpenChange, update, districtId, onSuccess }: UpdateDialogProps) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<FormValues>({
        defaultValues: {
            time: new Date().toISOString().slice(0, 16),
            location: "",
            incident: "",
            category: "normal",
            requirements: "None",
            action: "",
        },
    })

    // Reset form when update changes or dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                time: update?.time || new Date().toISOString().slice(0, 16),
                location: update?.location || "",
                incident: update?.incident || "",
                category: update?.category || "normal",
                requirements: update?.requirements || "None",
                action: update?.action || "",
            })
        }
    }, [update, open, form])

    async function onSubmit(values: FormValues) {
        startTransition(async () => {
            try {
                if (update?._id) {
                    await updateUpdate(update._id, values)
                    toast.success("Update modified successfully")
                } else {
                    await createUpdate({ ...values, districtId })
                    toast.success("Update created successfully")
                }
                onSuccess()
                onOpenChange(false)
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to save update")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{update ? "Edit Update" : "Add New Update"}</DialogTitle>
                    <DialogDescription>
                        {update ? "Modify incident update" : "Report a new incident or update"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Time</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            disabled={isPending}
                                            {...field}
                                        />
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
                        <FormField
                            control={form.control}
                            name="incident"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Incident Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Describe the incident" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                        disabled={isPending}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="less-critical">Less Critical</SelectItem>
                                            <SelectItem value="critical">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="requirements"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Requirements</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter requirements (optional)" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="action"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Action Taken</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Describe action taken" disabled={isPending} {...field} />
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
                                {isPending ? "Saving..." : update ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}