"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { profile, isLoading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!profile || profile.role !== 'creator') {
                router.push("/community");
            } else {
                setIsAuthorized(true);
            }
        }
    }, [profile, isLoading, router]);

    if (isLoading || !isAuthorized) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 border-4 border-rasta-yellow/20 border-t-rasta-yellow rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(255,215,0,0.3)]"></div>
                <h2 className="text-xl font-black italic italic-bold tracking-tighter text-rasta-yellow">Authenticating Intelligence...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20 md:pb-0">
            {children}
            
            {/* Command Center Overlay Elements (Optional Decor) */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rasta-yellow/30 to-transparent pointer-events-none z-50"></div>
        </div>
    );
}
