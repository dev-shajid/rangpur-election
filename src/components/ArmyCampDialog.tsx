'use client'

import { useEffect, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ArmyCamp } from "@/types"
import { toast } from "sonner"
import { createArmyCamp, updateArmyCamp } from "@/services/army.service"

const formSchema = z.object({
    unit: z.string().min(2, {
        message: "Unit name must be at least 2 characters.",
    }),
    location: z.string().min(3, {
        message: "Location must be at least 3 characters.",
    }),
    manpower: z.number().min(1, {
        message: "Manpower must be at least 1.",
    }),
    contactNumber: z.string().min(10, {
        message: "Contact number must be at least 10 characters.",
    }),
})

interface ArmyCampDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    camp?: ArmyCamp
    districtId: string
    onSuccess: () => void
}

export function ArmyCampDialog({ open, onOpenChange, camp, districtId, onSuccess }: ArmyCampDialogProps) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            unit: camp?.unit || "",
            location: camp?.location || "",
            manpower: camp?.manpower || 0,
            contactNumber: camp?.contactNumber || "",
        },
    })

    // Reset form when camp changes or dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                unit: camp?.unit || "",
                location: camp?.location || "",
                manpower: camp?.manpower || 0,
                contactNumber: camp?.contactNumber || "",
            })
        }
    }, [camp, open, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                if (camp?._id) {
                    await updateArmyCamp(camp._id, values)
                    toast.success("Army camp updated successfully")
                } else {
                    await createArmyCamp({ ...values, districtId })
                    toast.success("Army camp created successfully")
                }
                onSuccess()
                onOpenChange(false)
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to save army camp")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{camp ? "Edit Army Camp" : "Add New Army Camp"}</DialogTitle>
                    <DialogDescription>
                        {camp ? "Update army camp information" : "Add a new army camp to the district"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="unit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unit Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter unit name" disabled={isPending} {...field} />
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
                            name="manpower"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Manpower</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter manpower"
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
                            name="contactNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Emergency Contact</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter emergency contact" disabled={isPending} {...field} />
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
                                {isPending ? "Saving..." : camp ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
