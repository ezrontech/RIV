"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <div className="h-screen w-full bg-background" />;
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}
