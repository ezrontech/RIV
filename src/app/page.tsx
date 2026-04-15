"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, ArrowRight, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RootAuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const router = useRouter();
    const { user, isLoading } = useAuth();

    // Redirect authenticated users to the community hub
    useEffect(() => {
        if (!isLoading && user) {
            router.push("/community");
        }
    }, [user, isLoading, router]);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push("/community");
            } else {
                const { error, data } = await supabase.auth.signUp({ 
                    email, 
                    password,
                    options: {
                        data: {
                            full_name: username
                        }
                    }
                });
                if (error) throw error;
                
                if (data.session) {
                    router.push("/community");
                } else {
                    setSuccessMsg("Success! Please check your email to confirm your account.");
                }
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during authentication.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/community`
            }
        });
        if (error) setError(error.message);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-rasta-green" />
            </div>
        );
    }

    if (user) {
        return null; // Prevent flicker while redirecting
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex grid lg:grid-cols-2">
            
            {/* LEFT: Branding/Hero Pane */}
            <div className="hidden lg:flex flex-col justify-end p-12 relative isolate bg-black">
                <img 
                    src="/riv-logo.webp" 
                    alt="RIV Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-30 select-none pointer-events-none mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                
                <div className="relative z-10 max-w-xl">
                    <div className="inline-block px-3 py-1 bg-rasta-red text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                        Welcome to our village
                    </div>
                    <h1 className="text-5xl font-black text-white leading-[1.1] mb-6">
                        Connect With <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rasta-red via-rasta-yellow to-rasta-green">
                            Rastafari Indigenous Village.
                        </span>
                    </h1>
                    <p className="text-white/70 text-lg leading-relaxed">
                        Access the Rastafari Indigenous Village digital platform. Stream podcasts, secure retreats, buy from local artisans, and reason with the worldwide community.
                    </p>
                </div>
            </div>

            {/* RIGHT: Login Core */}
            <div className="flex flex-col justify-center items-center p-6 md:p-12 relative">
                
                <div className="w-full max-w-md flex flex-col gap-8">
                    
                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <img src="/riv-logo.webp" className="w-16 h-16 rounded-full" alt="RIV" />
                        </div>
                        <h2 className="text-3xl font-black">{isLogin ? "Sign In" : "Create Account"}</h2>
                        <p className="text-foreground/60 mt-2 text-sm">
                            {isLogin ? "Welcome back. Reason with us." : "Join the digital village today."}
                        </p>
                    </div>

                    {/* OAuth Box */}
                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={handleGoogleAuth}
                            className="w-full relative flex items-center justify-center gap-3 px-4 py-3.5 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-2xl font-bold transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </button>

                        <div className="flex items-center gap-4 py-2">
                            <div className="flex-1 h-px bg-foreground/10"></div>
                            <span className="text-xs font-bold text-foreground/40 uppercase tracking-wider">OR EMAIL</span>
                            <div className="flex-1 h-px bg-foreground/10"></div>
                        </div>
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
                        
                        {!isLogin && (
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
                                <input 
                                    type="text"
                                    placeholder="Username or Full Name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-rasta-yellow/50 transition-all font-medium"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
                            <input 
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-rasta-yellow/50 transition-all font-medium"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
                            <input 
                                type="password"
                                placeholder="Password (min 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-rasta-yellow/50 transition-all font-medium"
                                required
                                minLength={6}
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-sm rounded-xl">
                                {error}
                            </div>
                        )}
                        
                        {successMsg && (
                            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 font-bold text-sm rounded-xl">
                                {successMsg}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-foreground text-background font-bold rounded-2xl mt-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    {/* Toggle Mode */}
                    <div className="text-center pt-2 border-t border-foreground/5">
                        <p className="text-sm text-foreground/60">
                            {isLogin ? "Don't have an account?" : "Already apart of the village?"}
                            <button 
                                onClick={() => { setIsLogin(!isLogin); setError(null); setSuccessMsg(null); }}
                                className="ml-2 font-bold text-foreground hover:text-rasta-green transition-colors"
                            >
                                {isLogin ? "Sign Up" : "Log In"}
                            </button>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
