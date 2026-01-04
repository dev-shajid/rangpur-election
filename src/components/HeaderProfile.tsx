'use client'

import {
    LogOut,
    Monitor,
    Moon,
    Sun,
    UserCog,
} from "lucide-react";
import ThemeChange from "./theme-change";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function HeaderProfile() {
    const { data: session, status } = useSession();
    const { theme, setTheme } = useTheme();

    const initials =
        (session?.user?.name ?? "")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "";
    if (status === 'loading') return <Skeleton className="w-24 h-8 rounded-md" />;
    if (status === 'unauthenticated') return (
        <div className="flex items-center gap-2">
            <ThemeChange />
            <Link href="/login" className="text-sm font-medium text-primary hover:text-primary/80">
                <Button variant="outline">Login</Button>
            </Link>
        </div>);

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className='h-8 w-8 shrink-0 cursor-pointer bg-muted border'>
                        <AvatarImage
                            src={session?.user.image || "/placeholder.svg"}
                            alt={session?.user?.name || "User"}
                        />
                        <AvatarFallback className='text-xs font-medium'>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className='w-56 mb-2'
                    align='end'
                    side='top'
                    sideOffset={8}
                >
                    <>
                        <div className='flex-1 min-w-0 text-left p-2'>
                            <p className='text-sm font-medium truncate leading-tight'>
                                {session?.user?.name ?? "User"}
                            </p>
                            <p className='text-xs text-muted-foreground truncate leading-tight'>
                                {session?.user?.email ?? "abc@gmail.com"}
                            </p>
                        </div>
                    </>
                    <DropdownMenuSeparator className='my-1' />

                    {session?.user?.role === "superadmin" && (
                        <>
                            <DropdownMenuGroup>
                                <Link href="/admin/users">
                                    <DropdownMenuItem className='cursor-pointer'>
                                        <UserCog className='mr-2 h-4 w-4' />
                                        <span>Manage Users</span>
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator className='my-1' />
                        </>
                    )}

                    <DropdownMenuLabel className='text-xs font-medium text-muted-foreground px-2 py-1'>
                        Theme
                    </DropdownMenuLabel>

                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={() => setTheme("light")}
                            className='cursor-pointer'
                        >
                            <Sun className='mr-2 h-4 w-4' />
                            <span>Light</span>
                            {theme === "light" && (
                                <div className='ml-auto h-2 w-2 rounded-full bg-primary' />
                            )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setTheme("dark")}
                            className='cursor-pointer'
                        >
                            <Moon className='mr-2 h-4 w-4' />
                            <span>Dark</span>
                            {theme === "dark" && (
                                <div className='ml-auto h-2 w-2 rounded-full bg-primary' />
                            )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setTheme("system")}
                            className='cursor-pointer'
                        >
                            <Monitor className='mr-2 h-4 w-4' />
                            <span>System</span>
                            {theme === "system" && (
                                <div className='ml-auto h-2 w-2 rounded-full bg-primary' />
                            )}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => signOut()}
                        className='cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950'
                    >
                        <LogOut className='mr-2 h-4 w-4' />
                        <span>Sign Out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div >
    )
}
