"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Scroll, Calendar, ShoppingBag, User, Heart, Tv, Mic, ChevronLeft, Menu, Waves, Hammer, Tent, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const NAV_ITEMS = [
    { href: "/community", label: "Streams", icon: Waves }, // Nature/Water
    { href: "/channels", label: "Channels", icon: Tv },
    { href: "/podcasts", label: "Podcasts", icon: Mic },
    { href: "/articles", label: "Articles", icon: Scroll }, // Ancient Knowledge
    { href: "/workshops", label: "Workshops", icon: Hammer }, // Craftsmanship/Tools
    { href: "/retreats", label: "Retreats", icon: Tent }, // Shelter/Nature
    { href: "/shop", label: "Artisan Shop", icon: ShoppingBag },
];

export function LeftSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { profile, signOut } = useAuth();

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col sticky top-0 h-screen border-r border-foreground/5 bg-[var(--sidebar-left)] transition-all duration-300 ease-in-out relative",
                isCollapsed ? "w-20 p-4" : "w-64 p-6"
            )}
        >
            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-24 p-1.5 rounded-full bg-rasta-yellow text-rasta-black shadow-lg hover:scale-110 transition-transform z-50 border border-white/10"
            >
                <ChevronLeft size={14} className={cn("transition-transform duration-300", isCollapsed && "rotate-180")} />
            </button>

            {/* Logo Area */}
            <div className={cn("flex items-center gap-3 mb-10 transition-all duration-300", isCollapsed ? "justify-center px-0 mt-4" : "px-2 justify-center")}>
                <div className={cn("relative transition-all duration-300", isCollapsed ? "size-14" : "w-full h-16")}>
                    <img src="/riv-logo.webp" alt="RIV Logo" className="object-contain w-full h-full" />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 flex-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center py-3 rounded-full text-base font-medium transition-all group overflow-hidden",
                                isCollapsed ? "justify-center px-0 size-12 mx-auto gap-0" : "px-4 gap-4",
                                isActive
                                    ? "bg-foreground text-background font-bold shadow-md"
                                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                            )}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <item.icon size={24} className={cn("shrink-0", isActive ? "text-rasta-yellow" : "group-hover:scale-110 transition-transform")} />
                            <span className={cn("whitespace-nowrap transition-opacity duration-300", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}

                {/* Admin Link for Creators */}
                {profile?.role === 'creator' && (
                    <Link
                        href="/admin/dashboard"
                        className={cn(
                            "flex items-center py-3 rounded-full text-base font-medium transition-all group overflow-hidden mt-4 border border-rasta-yellow/20 bg-rasta-yellow/5 hover:bg-rasta-yellow/10",
                            isCollapsed ? "justify-center px-0 size-12 mx-auto gap-0" : "px-4 gap-4",
                            pathname.startsWith("/admin")
                                ? "bg-rasta-yellow text-black font-bold border-none"
                                : "text-rasta-yellow"
                        )}
                        title={isCollapsed ? "Admin Dashboard" : undefined}
                    >
                        <ShieldCheck size={24} className={cn("shrink-0", !pathname.startsWith("/admin") && "group-hover:scale-110 transition-transform")} />
                        <span className={cn("whitespace-nowrap transition-opacity duration-300", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                            Admin
                        </span>
                    </Link>
                )}
            </nav>

            {/* Footer / CTA Area */}
            <div className={cn("mt-auto flex flex-col transition-all duration-300", isCollapsed ? "pt-4 gap-2" : "pt-6 gap-4 border-t border-foreground/5")}>
                
                {/* Consolidated Account Card */}
                {!isCollapsed ? (
                    <div className="relative group bg-foreground/[0.03] rounded-3xl p-3 border border-foreground/5 mb-2 hover:border-foreground/10 transition-all duration-300">
                        <Link href="/profile" className="flex items-center gap-3">
                            <div className="size-10 rounded-2xl bg-foreground/10 overflow-hidden shrink-0 border border-foreground/10 group-hover:border-rasta-yellow transition-colors">
                                <img src={profile?.avatar || "/riv-logo.webp"} alt="User" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold truncate group-hover:text-rasta-yellow transition-colors">{profile?.name || "Guest"}</div>
                                <div className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">My Account</div>
                            </div>
                        </Link>
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                signOut();
                            }} 
                            className="absolute top-3 right-3 p-1.5 text-foreground/20 hover:text-rasta-red hover:bg-rasta-red/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Sign Out"
                        >
                            <LogOut size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 mb-2">
                         <Link href="/profile" className="size-12 rounded-2xl bg-foreground/10 overflow-hidden shrink-0 border border-foreground/10 hover:border-rasta-yellow transition-colors flex items-center justify-center">
                             <img src={profile?.avatar || "/riv-logo.webp"} alt="User" className="w-full h-full object-cover" />
                         </Link>
                         <button onClick={signOut} className="p-2 text-foreground/40 hover:text-rasta-red transition-colors" title="Sign Out">
                             <LogOut size={20} />
                         </button>
                    </div>
                )}

                {/* Support Button (Absolute Final Item) */}
                <Link href="/support" className="w-full">
                    <button className={cn(
                        "rounded-full bg-rasta-green text-white font-bold shadow-lg shadow-rasta-green/10 hover:shadow-rasta-green/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 overflow-hidden",
                        isCollapsed ? "size-12 p-0 mx-auto" : "w-full py-4"
                    )}>
                        <Heart size={20} className={cn("shrink-0", !isCollapsed && "fill-current")} />
                        <span className={cn("whitespace-nowrap transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "opacity-100 font-bold")}>
                            Support
                        </span>
                    </button>
                </Link>
            </div>
        </aside>
    );
}
