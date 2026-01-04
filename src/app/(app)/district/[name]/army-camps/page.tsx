'use client'

import * as React from "react"
import { getDistrictById } from "@/lib/districts"
import { getArmyCampsByDistrict, deleteArmyCamp } from "@/services/army.service"
import { ArmyCamp } from "@/types"
import { ArrowLeft, Shield, MapPin, Phone, Users, MoreVertical, Pencil, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import Link from "next/link"
import { DataTable, type Column } from "@/components/ui/data-table"
import { notFound } from "next/navigation"
import { toast } from "sonner"
import { isAdmin as checkIsAdmin } from "@/services/session.service"
import { ArmyCampDialog } from "@/components/ArmyCampDialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ArmyCampsPage() {
    const { name } = useParams()
    const districtName = Array.isArray(name) ? name[0] : name!
    const district = districtName ? getDistrictById(districtName) : null

    if (!district) {
        notFound()
    }

    const [camps, setCamps] = React.useState<ArmyCamp[]>([])
    const [loading, setLoading] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [currentPage, setCurrentPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(10)
    const [isAdmin, setIsAdmin] = React.useState(false)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [editingCamp, setEditingCamp] = React.useState<ArmyCamp | undefined>()

    React.useEffect(() => {
        checkIsAdmin(districtName).then((isAdminUser) => {
            setIsAdmin(isAdminUser)
        })
    }, [districtName])

    const fetchData = React.useCallback(async () => {
        setLoading(true)
        try {
            const data = await getArmyCampsByDistrict(districtName)
            setCamps(data)
        } catch (error) {
            toast.error("Failed to load army camps")
        } finally {
            setLoading(false)
        }
    }, [districtName])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    const filteredCamps = React.useMemo(() => {
        if (!searchQuery) return camps
        const lowerQ = searchQuery.toLowerCase()
        return camps.filter(c =>
            c.unit.toLowerCase().includes(lowerQ) ||
            c.location.toLowerCase().includes(lowerQ)
        )
    }, [camps, searchQuery])

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

    const handleEdit = (camp: ArmyCamp) => {
        setEditingCamp(camp)
        setDialogOpen(true)
    }

    const handleDelete = async (camp: ArmyCamp) => {
        if (!confirm(`Are you sure you want to delete ${camp.unit}?`)) return

        try {
            await deleteArmyCamp(camp._id!, districtName)
            toast.success("Army camp deleted successfully")
            fetchData()
        } catch (error) {
            toast.error("Failed to delete army camp")
        }
    }

    const handleDialogSuccess = () => {
        fetchData()
        setEditingCamp(undefined)
    }

    const columns: Column<ArmyCamp>[] = [
        {
            key: "unit",
            header: "Unit Name",
            accessor: (row) => (
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="font-medium text-foreground">{row.unit}</span>
                </div>
            ),
            sortable: true,
            width: "250px",
        },
        {
            key: "location",
            header: "Location",
            accessor: (row) => (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{row.location}</span>
                </div>
            ),
            sortable: true,
        },
        {
            key: "manpower",
            header: "Manpower",
            accessor: (row) => (
                <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">{row.manpower}</span>
                    <span className="text-xs text-muted-foreground">personnel</span>
                </div>
            ),
            sortable: true,
            width: "150px",
        },
        {
            key: "contactNumber",
            header: "Emergency Contact",
            accessor: (row) => (
                <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-red-500" />
                    <span className="font-mono text-sm text-red-600 font-medium">{row.contactNumber}</span>
                </div>
            ),
            sortable: true,
            width: "200px",
        },
        ...(isAdmin ? [{
            key: "actions" as keyof ArmyCamp,
            header: "",
            accessor: (row: ArmyCamp) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(row)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDelete(row)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            width: "50px",
        }] : []),
    ]

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div>
                <Link href={`/district/${districtName}`}>
                    <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to {district.name}
                    </Button>
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10">
                            <Shield className="h-7 w-7 text-emerald-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                                Army Camp Information
                            </h1>
                            <p className="text-muted-foreground">Security deployment for {district.name}</p>
                        </div>
                    </div>
                    {isAdmin && (
                        <Button onClick={() => {
                            setEditingCamp(undefined)
                            setDialogOpen(true)
                        }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Army Camp
                        </Button>
                    )}
                </div>
            </div>

            <DataTable
                data={filteredCamps}
                columns={columns}
                loading={loading}
                searchable
                searchPlaceholder="Search units or locations..."
                onSearch={handleSearch}
                paginated
                pageSize={pageSize}
                currentPage={currentPage}
                totalCount={filteredCamps.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                    setPageSize(size)
                    setCurrentPage(1)
                }}
                emptyMessage="No camps found."
            />

            <ArmyCampDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                camp={editingCamp}
                districtId={districtName}
                onSuccess={handleDialogSuccess}
            />
        </div>
    )
}
