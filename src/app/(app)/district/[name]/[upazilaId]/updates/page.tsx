'use client';

import UpdateCard from "@/components/UpdateCard";
import { getDistrictById } from "@/lib/districts";
import { getUpdatesByDistrict, deleteUpdate } from "@/services/update.service";
import { Update, IncidentCategory } from "@/types";
import { ArrowLeft, Radio, Filter, Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { UpdateCardSkeleton } from "@/components/loading/UpdateCardSkeleton";
import { isAdmin as checkIsAdmin } from "@/services/session.service";
import { UpdateDialog } from "@/components/UpdateDialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UpdatesPage = () => {
    const { name: districtName, upazilaId } = useParams<{ name: string, upazilaId: string }>();
    const district = districtName ? getDistrictById(districtName) : null;
    const upazila = upazilaId ? district?.upazilas.find(u => u.id === upazilaId) : null;
    const [filter, setFilter] = useState<IncidentCategory | "all">("all");
    const [updates, setUpdates] = useState<Update[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingUpdate, setEditingUpdate] = useState<Update | undefined>();

    if (!district || !upazila) {
        notFound();
    }

    useEffect(() => {
        checkIsAdmin(upazila?.id).then((isAdminUser) => {
            setIsAdmin(isAdminUser);
        });
    }, [upazila?.id]);

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const data = await getUpdatesByDistrict(upazila?.id);
            setUpdates(data);
        } catch (error) {
            toast.error("Failed to load updates");
        } finally {
            setLoading(false);
        }
    }, [upazila?.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredUpdates = useMemo(() => {
        return filter === "all"
            ? updates
            : updates.filter((u) => u.category === filter);
    }, [updates, filter]);

    const categoryCounts = {
        all: updates.length,
        normal: updates.filter((u) => u.category === "normal").length,
        "less-critical": updates.filter((u) => u.category === "less-critical").length,
        critical: updates.filter((u) => u.category === "critical").length,
    };

    const filterButtons: { value: IncidentCategory | "all"; label: string; className: string }[] = [
        { value: "all", label: "All", className: "bg-secondary text-secondary-foreground" },
        { value: "normal", label: "Normal", className: "severity-normal" },
        { value: "less-critical", label: "Less Critical", className: "severity-warning" },
        { value: "critical", label: "Critical", className: "severity-critical" },
    ];

    const handleEdit = (update: Update) => {
        setEditingUpdate(update);
        setDialogOpen(true);
    };

    const handleDelete = async (update: Update) => {
        if (!confirm(`Are you sure you want to delete this update?`)) return;

        try {
            await deleteUpdate(update._id!, district.id, upazila.id);
            toast.success("Update deleted successfully");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete update");
        }
    };

    const handleDialogSuccess = () => {
        fetchData();
        setEditingUpdate(undefined);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <Link href={`/district/${district.id}/${upazila.id}`}>
                    <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to {upazila.nameEn}
                    </Button>
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10">
                            <Radio className="h-7 w-7 text-orange-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                                Security Updates
                            </h1>
                            <p className="text-muted-foreground">{upazila.nameEn} Upazila, {district.name} District</p>
                        </div>
                    </div>
                    {isAdmin && (
                        <Button onClick={() => {
                            setEditingUpdate(undefined);
                            setDialogOpen(true);
                        }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Update
                        </Button>
                    )}
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Filter className="h-4 w-4" />
                        <span>Filter by:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {filterButtons.map((btn) => (
                            <button
                                key={btn.value}
                                onClick={() => setFilter(btn.value)}
                                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all border ${filter === btn.value
                                    ? `${btn.className} ring-2 ring-ring ring-offset-2 ring-offset-background`
                                    : "bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                            >
                                {btn.label}
                                <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5">
                                    {categoryCounts[btn.value]}
                                </Badge>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Updates Feed */}
                <div className="space-y-4">
                    {loading && updates.length === 0 ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <UpdateCardSkeleton key={i} />
                        ))
                    ) : filteredUpdates.length === 0 ? (
                        <div className="rounded-xl border border-border bg-card p-12 text-center">
                            <Radio className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold text-foreground">No Updates Found</h3>
                            <p className="text-muted-foreground mt-1">
                                {filter === "all"
                                    ? "No updates available for this district yet."
                                    : `No ${filter.replace("-", " ")} incidents reported.`}
                            </p>
                        </div>
                    ) : (
                        filteredUpdates.map((update) => (
                            <div key={update.id} className="relative group">
                                <UpdateCard update={update} />
                                {isAdmin && (
                                    <div className="absolute top-4 right-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(update)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(update)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <UpdateDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                update={editingUpdate}
                districtId={district.id}
                upazilaId={upazila.id}
                onSuccess={handleDialogSuccess}
            />
        </div>
    );
};

export default UpdatesPage;
