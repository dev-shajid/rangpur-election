'use client'

import * as React from "react"
import { getDistrictById } from "@/lib/districts"
import { getCandidatesByDistrict, deleteCandidate } from "@/services/candidate.service"
import { Candidate } from "@/types"
import { ArrowLeft, Users, Phone, MapPin, MoreVertical, Pencil, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"
import Link from "next/link"
import { DataTable, type Column } from "@/components/ui/data-table"
import { notFound } from "next/navigation"
import { toast } from "sonner"
import { isAdmin as checkIsAdmin } from "@/services/session.service"
import { CandidateDialog } from "@/components/CandidateDialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useMemo } from "react"

export default function CandidatesPage() {
    const { name } = useParams()
    const districtName = Array.isArray(name) ? name[0] : name!
    const district = districtName ? getDistrictById(districtName) : null
    const { data: session } = useSession()

    if (!district) {
        notFound()
    }

    const [isAdmin, setIsAdmin] = React.useState(false)

    useEffect(() => {
        checkIsAdmin(districtName).then((isAdminUser) => {
            setIsAdmin(isAdminUser)
        })
    }, [districtName])

    const [candidates, setCandidates] = React.useState<Candidate[]>([])
    const [loading, setLoading] = React.useState(true)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [currentPage, setCurrentPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(10)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [editingCandidate, setEditingCandidate] = React.useState<Candidate | undefined>()

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getCandidatesByDistrict(districtName)
            setCandidates(data)
        } catch (error) {
            toast.error("Failed to load candidates")
        } finally {
            setLoading(false)
        }
    }, [districtName])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const filteredCandidates = useMemo(() => {
        if (!searchQuery) return candidates
        const lowerQ = searchQuery.toLowerCase()
        return candidates.filter(c =>
            c.name.toLowerCase().includes(lowerQ) ||
            c.party.toLowerCase().includes(lowerQ) ||
            c.address.toLowerCase().includes(lowerQ)
        )
    }, [candidates, searchQuery])

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

    const handleEdit = (candidate: Candidate) => {
        setEditingCandidate(candidate)
        setDialogOpen(true)
    }

    const handleDelete = async (candidate: Candidate) => {
        if (!confirm(`Are you sure you want to delete ${candidate.name}?`)) return

        try {
            await deleteCandidate(candidate._id!, districtName)
            toast.success("Candidate deleted successfully")
            fetchData()
        } catch (error) {
            toast.error("Failed to delete candidate")
        }
    }

    const handleDialogSuccess = () => {
        fetchData()
        setEditingCandidate(undefined)
    }

    const columns: Column<Candidate>[] = [
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
            key: "party",
            header: "Party",
            accessor: (row) => {
                return (
                    <Badge variant="outline">
                        {row.party}
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
            key: "contactNumber",
            header: "Contact",
            accessor: (row) => (
                <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-mono text-sm">{row.contactNumber}</span>
                </div>
            ),
            width: "200px",
        },
        ...(isAdmin ? [{
            key: "actions" as keyof Candidate,
            header: "",
            accessor: (row: Candidate) => (
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
                <Link href={`/district/${districtName}`}>
                    <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to {district.name}
                    </Button>
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                            <Users className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                                Candidate Information
                            </h1>
                            <p className="text-muted-foreground">{district.name} District</p>
                        </div>
                    </div>
                    {isAdmin && (
                        <Button onClick={() => {
                            setEditingCandidate(undefined)
                            setDialogOpen(true)
                        }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Candidate
                        </Button>
                    )}
                </div>
            </div>

            <DataTable
                data={filteredCandidates}
                columns={columns}
                loading={loading}
                searchable
                searchPlaceholder="Search candidates..."
                onSearch={handleSearch}
                paginated
                pageSize={pageSize}
                currentPage={currentPage}
                totalCount={filteredCandidates.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                    setPageSize(size)
                    setCurrentPage(1)
                }}
                emptyMessage="No candidates found matching your criteria."
            />

            <CandidateDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                candidate={editingCandidate}
                districtId={districtName}
                onSuccess={handleDialogSuccess}
            />
        </div>
    )
}
