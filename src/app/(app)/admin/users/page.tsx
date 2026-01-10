'use client'

import * as React from "react"
import { getAllUsers, updateUserRole, deleteUser } from "@/services/user.service"
import { User, Role } from "@/types"
import { districts } from "@/lib/districts"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
    ShieldCheck,
    UserIcon,
    Trash2,
    MoreVertical,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DISTRICT_COLORS } from "@/lib/constants"

export default function UsersAdminPage() {
    const [users, setUsers] = React.useState<User[]>([])
    const [loading, setLoading] = React.useState(true)
    const [updatingId, setUpdatingId] = React.useState<string | null>(null)

    const fetchData = React.useCallback(async () => {
        setLoading(true)
        try {
            const data = await getAllUsers()
            setUsers(data)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to load users")
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleRoleChange = async (userId: string, newRole: string) => {
        setUpdatingId(userId)
        try {
            await updateUserRole(userId, newRole)
            toast.success("User role updated successfully")
            fetchData()
        } catch (error) {
            toast.error("Failed to update user role")
        } finally {
            setUpdatingId(null)
        }
    }

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return

        try {
            await deleteUser(userId)
            toast.success("User deleted successfully")
            fetchData()
        } catch (error) {
            toast.error("Failed to delete user")
        }
    }

    const columns: Column<User>[] = [
        {
            key: "name",
            header: "User",
            accessor: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <UserIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <div className="font-medium text-foreground">{row.name}</div>
                        <div className="text-xs text-muted-foreground">{row.email}</div>
                    </div>
                </div>
            ),
            sortable: true,
            width: "300px",
        },
        {
            key: "role",
            header: "Assigned Role / District",
            accessor: (row) => {
                if (row.role === "superadmin") {
                    return <Badge variant='secondary'>Super Admin</Badge>
                }

                const upazila = districts.find(d => d.upazilas.some(u => u.id === row.role));
                if (upazila) {
                    const color = DISTRICT_COLORS[upazila.name.toLocaleLowerCase()]
                    return (
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className={color.badge}>
                                Admin: {row.role && (row.role.charAt(0).toUpperCase() + row.role.slice(1))}
                            </Badge>
                        </div>
                    )
                }

                return <Badge variant="secondary" className="text-muted-foreground">Unassigned</Badge>
            },
            sortable: true,
            width: "250px",
        },
        {
            key: "manage_access",
            header: "Manage Access",
            accessor: (row) => {
                if (row.role === "superadmin") return null;

                return (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Select
                            disabled={updatingId === row.id}
                            onValueChange={(value) => handleRoleChange(row.id, value)}
                            defaultValue={row.role || ""}
                        >
                            <SelectTrigger className="w-50 h-9">
                                <SelectValue placeholder="Assign District" />
                            </SelectTrigger>
                            <SelectContent>
                                {districts.map((d) => (
                                    <SelectGroup key={d.id}>
                                        <SelectLabel>{d.nameBn}</SelectLabel>
                                        {
                                            d.upazilas.map((u) => (
                                                <SelectItem key={`${d.id}-${u.id}`} value={u.id}>
                                                    {u.nameBn} Admin
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )
            },
            width: "100px",
        },
        {
            key: 'actions',
            header: 'Actions',
            accessor: (row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => handleDelete(row.id)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            width: '50px',
        }
    ]

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10">
                    <ShieldCheck className="h-7 w-7 text-purple-600" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        User Management
                    </h1>
                    <p className="text-muted-foreground">Verify and assign district roles to registered users</p>
                </div>
            </div>

            <DataTable
                data={users}
                columns={columns}
                loading={loading}
                searchable
                searchPlaceholder="Search by name or email..."
                emptyMessage="No registered users found."
            />
        </div>
    )
}
