'use client'

import * as React from "react"
import { getDistrictById } from "@/lib/districts"
import { getPollingInfoByUpazila, deletePollingInfo } from "@/services/polling.service"
import { PollingInfo } from "@/types"
import { ArrowLeft, ClipboardList, Phone, MapPin, MoreVertical, Pencil, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"
import Link from "next/link"
import { DataTable, type Column } from "@/components/ui/data-table"
import { notFound } from "next/navigation"
import { toast } from "sonner"
import { isAdmin as checkIsAdmin } from "@/services/session.service"
import { PollingDialog } from "@/components/PollingDialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCallback, useEffect, useMemo } from "react"

export default function PollingPage() {
    const { name, upazilaId } = useParams()
    const districtName = Array.isArray(name) ? name[0] : name!
    const district = districtName ? getDistrictById(districtName) : null
    const upazila = upazilaId ? district?.upazilas.find(u => u.id === upazilaId) : null


    if (!district || !upazila) {
        notFound()
    }

    const [isAdmin, setIsAdmin] = React.useState(false)

    useEffect(() => {
        checkIsAdmin(upazila?.id).then((isAdminUser) => {
            setIsAdmin(isAdminUser)
        })
    }, [upazila?.id])

    const [pollingData, setPollingData] = React.useState<PollingInfo[]>([])
    const [loading, setLoading] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [currentPage, setCurrentPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(10)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [editingPollingInfo, setEditingPollingInfo] = React.useState<PollingInfo | undefined>()

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getPollingInfoByUpazila(district.id, upazila?.id)
            setPollingData(data)
        } catch (error) {
            toast.error("Failed to load polling information")
        } finally {
            setLoading(false)
        }
    }, [district.id, upazila?.id])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const filteredPollingData = useMemo(() => {
        if (!searchQuery) return pollingData
        const lowerQ = searchQuery.toLowerCase()
        return pollingData.filter(p =>
            p.name.toLowerCase().includes(lowerQ) ||
            p.constituency.toLowerCase().includes(lowerQ) ||
            p.address.toLowerCase().includes(lowerQ) ||
            p.serial.toLowerCase().includes(lowerQ)
        )
    }, [pollingData, searchQuery])

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

    const handleEdit = (info: PollingInfo) => {
        setEditingPollingInfo(info)
        setDialogOpen(true)
    }

    const handleDelete = async (info: PollingInfo) => {
        if (!confirm(`Are you sure you want to delete ${info.name}?`)) return

        try {
            await deletePollingInfo(info._id!, district.id, upazila?.id!)
            toast.success("Polling information deleted successfully")
            fetchData()
        } catch (error) {
            toast.error("Failed to delete polling information")
        }
    }

    const handleDialogSuccess = () => {
        setEditingPollingInfo(undefined)
        fetchData()
    }

    const columns: Column<PollingInfo>[] = [
        {
            key: "serial",
            header: "Serial",
            accessor: (row) => (
                <div className="font-mono text-sm">{row.serial}</div>
            ),
            sortable: true,
            width: "100px",
        },
        {
            key: "name",
            header: "Name",
            accessor: (row) => (
                <div className="font-medium text-foreground">{row.name}</div>
            ),
            sortable: true,
            width: "250px",
        },
        {
            key: "constituency",
            header: "Constituency",
            accessor: (row) => {
                return (
                    <Badge variant="outline">
                        {row.constituency}
                    </Badge>
                );
            },
            sortable: true,
            width: "200px",
        },
        {
            key: "address",
            header: "Address",
            accessor: (row) => (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{row.address}</span>
                </div>
            ),
            sortable: true,
        },
        {
            key: "map",
            header: "Map",
            accessor: (row) => (
                <a href={row.map} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">View Map</Button>
                </a>
            ),
        },
        {
            key: "pollingAgent",
            header: "Polling Agent",
            accessor: (row) => (
                <div className="font-medium text-foreground">{row.pollingAgent}</div>
            ),
        },
        {
            key: "responsiblePersonnel",
            header: "Responsible Personnel",
            accessor: (row) => (
                <div className="font-medium text-foreground">{row.responsiblePersonnel}</div>
            ),
        },
        {
            key: "phoneNumber",
            header: "Phone",
            accessor: (row) => (
                <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-mono text-sm">{row.phoneNumber}</span>
                </div>
            ),
            width: "200px",
        },
        ...(isAdmin ? [{
            key: "actions" as keyof PollingInfo,
            header: "",
            accessor: (row: PollingInfo) => (
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
    ];

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div>
                <Link href={`/district/${district.id}/${upazila.id}`}>
                    <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to {upazila.nameEn}
                    </Button>
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                            <ClipboardList className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                                Polling Information
                            </h1>
                            <p className="text-muted-foreground">{upazila.nameEn} Upazila, {district.name} District</p>
                        </div>
                    </div>
                    {isAdmin && (
                        <Button onClick={() => {
                            setEditingPollingInfo(undefined)
                            setDialogOpen(true)
                        }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Polling Center
                        </Button>
                    )}
                </div>
            </div>

            <DataTable
                data={filteredPollingData}
                columns={columns}
                loading={loading}
                searchable
                searchPlaceholder="Search polling centers..."
                onSearch={handleSearch}
                paginated
                pageSize={pageSize}
                currentPage={currentPage}
                totalCount={filteredPollingData.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                    setPageSize(size)
                    setCurrentPage(1)
                }}
                emptyMessage="No polling centers found matching your criteria."
            />

            <PollingDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                pollingInfo={editingPollingInfo}
                districtId={district.id}
                upazilaId={upazila?.id}
                onSuccess={handleDialogSuccess}
            />
        </div>
    )
}
