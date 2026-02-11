"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Waves, Tv, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { href: "/community", label: "Streams", icon: Waves },
    { href: "/channels", label: "Channels", icon: Tv },
    { href: "/shop", label: "Shop", icon: ShoppingBag },
    { href: "/profile", label: "Profile", icon: User },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-foreground/5 md:hidden pb-[env(safe-area-inset-bottom)]">
            <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
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
    );
}
