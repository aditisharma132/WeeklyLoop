"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { LayoutDashboard, CalendarDays, LineChart, Settings, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const links = [
        { href: "/dashboard", label: "Today", icon: LayoutDashboard },
        { href: "/calendar", label: "Calendar", icon: CalendarDays },
        { href: "/progress", label: "Progress", icon: LineChart },
    ];

    return (
        <aside className="w-64 border-r border-white/5 bg-background/50 backdrop-blur-xl flex flex-col h-screen sticky top-0">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="font-bold text-white text-xl leading-none">W</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight">WeeklyLoop</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                isActive 
                                    ? "bg-primary/10 text-primary font-medium" 
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                {session ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 px-4 py-2">
                            {session.user?.image ? (
                                <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">
                                    {session.user?.name?.charAt(0) || "U"}
                                </div>
                            )}
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <span className="text-sm font-medium truncate">{session.user?.name}</span>
                                <span className="text-xs text-white/40 truncate">{session.user?.email}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full flex items-center gap-3 px-4 py-2 text-red-400/80 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Log out</span>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => signIn("google", { callbackUrl: '/dashboard' })}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
                    >
                        <LogIn className="w-5 h-5" />
                        <span className="font-medium">Sign In</span>
                    </button>
                )}
            </div>
        </aside>
    );
}
