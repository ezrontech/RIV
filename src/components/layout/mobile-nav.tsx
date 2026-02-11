"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Waves, Tv, Mic, Scroll, Menu, X,
    ShoppingBag, User, Hammer, Tent, Heart,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

// Bottom Tab Items
const TAB_ITEMS = [
    { label: "Menu", icon: Menu, action: "toggle_sidebar" },
    { href: "/community", label: "Streams", icon: Waves },
    { href: "/channels", label: "Channels", icon: Tv },
    { href: "/podcasts", label: "Podcasts", icon: Mic },
    { href: "/articles", label: "Articles", icon: Scroll },
];

// Full Sidebar Items for the Drawer
const SIDEBAR_ITEMS = [
    { href: "/community", label: "Streams", icon: Waves },
    { href: "/channels", label: "Channels", icon: Tv },
    { href: "/podcasts", label: "Podcasts", icon: Mic },
    { href: "/articles", label: "Articles", icon: Scroll },
    { href: "/workshops", label: "Workshops", icon: Hammer },
    { href: "/retreats", label: "Retreats", icon: Tent },
    { href: "/shop", label: "Artisan Shop", icon: ShoppingBag },
    { href: "/profile", label: "My Profile", icon: User },
];

export function MobileNav() {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Close sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isSidebarOpen]);

    return (
        <>
            {/* Sidebar Drawer Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-[60] flex md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-[80%] max-w-xs h-full bg-[var(--sidebar-left)] border-r border-white/10 p-6 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-32">
                                <img src="/riv-logo.webp" alt="RIV" className="w-full h-auto" />
                            </div>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
                            {SIDEBAR_ITEMS.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
                                            isActive
                                                ? "bg-foreground text-background font-bold"
                                                : "text-foreground/70 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <item.icon size={22} className={cn(isActive && "text-rasta-yellow")} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer Actions */}
                        <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                            <button className="w-full py-3 rounded-full bg-rasta-green text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-rasta-green/20">
                                <Heart size={18} className="fill-current" />
                                <span>Support RIV</span>
                            </button>
                            <div className="flex items-center gap-3 px-2">
                                <div className="size-10 rounded-full bg-white/10 overflow-hidden">
                                    <img src="/images/users/firstman.webp" alt="User" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-white">Firstman</div>
                                    <div className="text-xs text-white/50">Community Elder</div>
                                </div>
                                <button className="text-white/50 hover:text-rasta-red transition-colors">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Tab Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-foreground/5 md:hidden pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
                <div className="flex justify-around items-center h-16 pointer-events-auto">
                    {TAB_ITEMS.map((item, index) => {
                        const isSidebarTrigger = item.action === "toggle_sidebar";
                        const isActive = !isSidebarTrigger && pathname === item.href;

                        return isSidebarTrigger ? (
                            <button
                                key={index}
                                onClick={() => setIsSidebarOpen(true)}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-foreground/60 hover:text-foreground active:scale-95"
                                )}
                            >
                                <item.icon size={24} strokeWidth={2} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </button>
                        ) : (
                            <Link
                                key={index}
                                href={item.href!}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors active:scale-95",
                                    isActive ? "text-rasta-yellow" : "text-foreground/60 hover:text-foreground"
                                )}
                            >
                                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
