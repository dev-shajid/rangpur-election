'use client'

import { useEffect, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Candidate } from "@/types"
import { toast } from "sonner"
import { createCandidate, updateCandidate } from "@/services/candidate.service"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    party: z.string().min(2, {
        message: "Party name must be at least 2 characters.",
    }),
    address: z.string().min(3, {
        message: "Address must be at least 3 characters.",
    }),
    contactNumber: z.string().min(10, {
        message: "Contact number must be at least 10 characters.",
    }),
})

interface CandidateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    candidate?: Candidate
    districtId: string
    upazilaId: string
    onSuccess: () => void
}

export function CandidateDialog({ open, onOpenChange, candidate, districtId, upazilaId, onSuccess }: CandidateDialogProps) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: candidate?.name || "",
            party: candidate?.party || "",
            address: candidate?.address || "",
            contactNumber: candidate?.contactNumber || "",
        },
    })

    // Reset form when candidate changes or dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                name: candidate?.name || "",
                party: candidate?.party || "",
                address: candidate?.address || "",
                contactNumber: candidate?.contactNumber || "",
            })
        }
    }, [candidate, open, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                if (candidate?._id) {
                    await updateCandidate(candidate._id, { ...values, districtId, upazilaId })
                    toast.success("Candidate updated successfully")
                } else {
                    await createCandidate({ ...values, districtId, upazilaId })
                    toast.success("Candidate created successfully")
                }
                onSuccess()
                onOpenChange(false)
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to save candidate")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>{candidate ? "Edit Candidate" : "Add New Candidate"}</DialogTitle>
                    <DialogDescription>
                        {candidate ? "Update candidate information" : "Add a new candidate to the district"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter candidate name" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="party"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Party</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter party name" disabled={isPending} {...field} />
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
                            name="contactNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter contact number" disabled={isPending} {...field} />
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
                                {isPending ? "Saving..." : candidate ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
