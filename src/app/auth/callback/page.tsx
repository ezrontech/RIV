"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Supabase client handles the #access_token fragment or ?code= parameter 
        // automatically when initialized in the browser. 
        // We just need to wait for the session to be established.

        const checkSession = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                
                if (sessionError) throw sessionError;

                if (session) {
                    console.log("Session established via callback. Redirecting...");
                    router.push("/community");
                    return;
                }

                // If no session yet, it might still be processing the fragment or code
                // supabase.auth.onAuthStateChange will catch it when it finishes.
            } catch (err: any) {
                console.error("Callback error:", err);
                setError(err.message || "Authentication failed during callback.");
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log("Auth Event in Callback:", event);
                if (session) {
                    router.push("/community");
                } else if (event === 'SIGNED_OUT') {
                    router.push("/login?error=Authentication failed or canceled");
                }
            }
        );

        // Fail-safe: if nothing happens after 10 seconds, redirect to login
        const timeout = setTimeout(() => {
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (!session) {
                    setError("Authentication timed out. Please try again.");
                }
            });
        }, 10000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, [router]);

    if (error) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 gap-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl max-w-md text-center">
                    <p className="font-bold mb-2">Login Error</p>
                    <p className="text-sm opacity-80">{error}</p>
                </div>
                <button 
                    onClick={() => router.push("/login")}
                    className="px-6 py-2.5 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                    Back to Login
                </button>
            </div>
        );
    }

    return <div className="min-h-screen bg-background" />;
}
