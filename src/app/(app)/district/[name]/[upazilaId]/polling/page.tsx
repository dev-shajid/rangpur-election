'use client'

import * as React from "react"
import { getDistrictById } from "@/lib/districts"
import { getPollingInfoByUpazila, deletePollingInfo } from "@/services/polling.service"
import { getUpazilaMap } from "@/services/district-map.service"
import { PollingInfo, UpazilaMap } from "@/types"
import { ArrowLeft, ClipboardList, Phone, MapPin, MoreVertical, Pencil, Trash2, Plus, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { DataTable, type Column } from "@/components/ui/data-table"
import { notFound } from "next/navigation"
import { toast } from "sonner"
import { isAdmin as checkIsAdmin } from "@/services/session.service"
import { PollingDialog } from "@/components/PollingDialog"
import { MapViewer } from "@/components/MapViewer"
import { UpazilaMapDialog } from "@/components/UpazilaMapDialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCallback, useEffect, useMemo } from "react"

export default function PollingPage() {
    const { name, upazilaId } = useParams()
    const router = useRouter()
    const districtName = Array.isArray(name) ? name[0] : name!
    const district = districtName ? getDistrictById(districtName) : null
    const upazila = upazilaId ? district?.upazilas.find(u => u.id === upazilaId) : null


    if (!district || !upazila) {
        notFound()
    }

    const [isAdmin, setIsAdmin] = React.useState(false)
    const [upazilaMapData, setUpazilaMapData] = React.useState<UpazilaMap | null>(null)
    const [mapDialogOpen, setMapDialogOpen] = React.useState(false)

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
            console.log('Polling data fetched:', data)
            console.log('First polling center map:', data[0]?.map)
            setPollingData(data)
            
            // Fetch upazila map
            const mapData = await getUpazilaMap(district.id, upazila?.id)
            setUpazilaMapData(mapData)
        } catch (error) {
            toast.error("Failed to load polling information")
        } finally {
            setLoading(false)
        }
    }, [district.id, upazila?.id])

    const handleMapSuccess = () => {
        router.refresh()
        fetchData()
    }

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const filteredPollingData = useMemo(() => {
        if (!searchQuery) return pollingData
        const lowerQ = searchQuery.toLowerCase()
        return pollingData.filter(p =>
            p.name.toLowerCase().includes(lowerQ) ||
            p.union.toLowerCase().includes(lowerQ) ||
            p.location.toLowerCase().includes(lowerQ) ||
            p.serial.toLowerCase().includes(lowerQ) ||
            p.presidingOfficer.toLowerCase().includes(lowerQ)
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
            width: "80px",
        },
        {
            key: "name",
            header: "Name Of Polling Center",
            accessor: (row) => (
                <div className="font-medium text-foreground">{row.name}</div>
            ),
            sortable: true,
            width: "200px",
        },
        {
            key: "union",
            header: "Union",
            accessor: (row) => (
                <div className="text-sm">{row.union}</div>
            ),
            sortable: true,
            width: "120px",
        },
        {
            key: "location",
            header: "Location",
            accessor: (row) => (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{row.location}</span>
                </div>
            ),
            sortable: true,
            width: "180px",
        },
        {
            key: "maleVoters",
            header: "Male Voters",
            accessor: (row) => (
                <div className="text-sm text-center">{row.maleVoters?.toLocaleString()}</div>
            ),
            sortable: true,
            width: "100px",
        },
        {
            key: "femaleVoters",
            header: "Female Voters",
            accessor: (row) => (
                <div className="text-sm text-center">{row.femaleVoters?.toLocaleString()}</div>
            ),
            sortable: true,
            width: "110px",
        },
        {
            key: "minority",
            header: "Minority",
            accessor: (row) => (
                <div className="text-sm text-center">{row.minority?.toLocaleString()}</div>
            ),
            sortable: true,
            width: "90px",
        },
        {
            key: "presidingOfficer",
            header: "Presiding Officer",
            accessor: (row) => (
                <div className="font-medium text-foreground text-sm">{row.presidingOfficer}</div>
            ),
            sortable: true,
            width: "160px",
        },
        {
            key: "contactDetails",
            header: "Contact Details",
            accessor: (row) => (
                <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-mono text-sm">{row.contactDetails}</span>
                </div>
            ),
            width: "150px",
        },
        {
            key: "category",
            header: "Category",
            accessor: (row) => {
                const categoryColors = {
                    dangerous: "destructive",
                    "less-dangerous": "secondary",
                    normal: "default"
                } as const
                const categoryLabels = {
                    dangerous: "Dangerous",
                    "less-dangerous": "Less Dangerous",
                    normal: "Normal"
                }
                return (
                    <Badge variant={categoryColors[row.category]}>
                        {categoryLabels[row.category]}
                    </Badge>
                )
            },
            sortable: true,
            width: "130px",
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

            {/* Upazila Map Section */}
            {(upazilaMapData || isAdmin) && (
                <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Map className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-semibold text-foreground">
                                {upazilaMapData?.title || `${upazila.nameEn} Upazila Map`}
                            </h2>
                        </div>
                        {isAdmin && (
                            <Button onClick={() => setMapDialogOpen(true)} variant="outline" size="sm">
                                {upazilaMapData ? (
                                    <>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit Map
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Map
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    {upazilaMapData ? (
                        <MapViewer 
                            mapUrl={upazilaMapData.mapUrl} 
                            title={`Polling Centers - ${upazila.nameEn}`}
                            height="350px"
                        />
                    ) : isAdmin ? (
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                            <Map className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                            <h3 className="text-base font-semibold text-foreground mb-2">No Map Configured</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Add a map to display polling locations for {upazila.nameEn} upazila
                            </p>
                            <Button onClick={() => setMapDialogOpen(true)} size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Map
                            </Button>
                        </div>
                    ) : null}
                </div>
            )}

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

            <UpazilaMapDialog
                open={mapDialogOpen}
                onOpenChange={setMapDialogOpen}
                mapData={upazilaMapData}
                districtId={district.id}
                upazilaId={upazila?.id}
                onSuccess={handleMapSuccess}
            />
        </div>
    )
}
