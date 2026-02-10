"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Scroll, Calendar, ShoppingBag, User, Heart, Tv, Mic, ChevronLeft, Menu, Waves, Hammer, Tent } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_ITEMS = [
    { href: "/community", label: "Streams", icon: Waves }, // Nature/Water
    { href: "/channels", label: "Channels", icon: Tv },
    { href: "/podcasts", label: "Podcasts", icon: Mic },
    { href: "/articles", label: "Articles", icon: Scroll }, // Ancient Knowledge
    { href: "/workshops", label: "Workshops", icon: Hammer }, // Craftsmanship/Tools
    { href: "/retreats", label: "Retreats", icon: Tent }, // Shelter/Nature
    { href: "/shop", label: "Artisan Shop", icon: ShoppingBag },
    { href: "/profile", label: "My Profile", icon: User },
];

export function LeftSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

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
            </nav>

            {/* Footer / CTA */}
            <div className={cn("mt-auto border-t border-foreground/5 transition-all duration-300", isCollapsed ? "pt-4" : "pt-6")}>
                <button className={cn(
                    "rounded-full bg-rasta-green text-white font-bold shadow-lg shadow-rasta-green/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 overflow-hidden",
                    isCollapsed ? "size-12 p-0 mx-auto" : "w-full py-3"
                )}>
                    <Heart size={20} className="fill-current shrink-0" />
                    <span className={cn("whitespace-nowrap transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                        Support
                    </span>
                </button>
            </div>
        </aside>
    );
}
