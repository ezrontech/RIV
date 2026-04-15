"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    profile: any | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    isLoading: true,
    signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfileState] = useState<any | null>(null);
    const profileRef = useRef<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isFetchingRef = useRef(false);
    
    const setProfile = (p: any) => {
        profileRef.current = p;
        setProfileState(p);
    };
    const router = useRouter();

    useEffect(() => {
        // 1. Check active sessions and sets the user
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setIsLoading(false);
            }
        };

        fetchSession();

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                    setIsLoading(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string, retries = 3) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        
        // Prevent layout destruction on background tab-focus refreshes
        if (profileRef.current?.id !== userId) {
            setIsLoading(true);
        }

        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();
            
            if (data) {
                setProfile(data);
            } else if (error && error.code === 'PGRST116') {
                 if (retries > 0) {
                     // Trigger race condition: wait and retry
                     setTimeout(() => {
                         isFetchingRef.current = false;
                         fetchProfile(userId, retries - 1);
                     }, 1000);
                     return;
                 }
                 
                 // Fallback: manually create the missing profile row since trigger might not have fired
                 const { data: userData } = await supabase.auth.getUser();
                 if (userData?.user) {
                     const metadata = userData.user.user_metadata;
                     const baseName = metadata?.full_name || userData.user.email?.split('@')[0] || 'Unknown';
                     const newProfile = {
                         id: userId,
                         name: baseName,
                         username: baseName.replace(/\s+/g, '_').toLowerCase(),
                         avatar: metadata?.avatar_url || '/riv-logo.webp',
                         role: 'member'
                     };
                     const { error: insertError } = await supabase.from('profiles').upsert([newProfile]);
                     if (!insertError) {
                         setProfile(newProfile);
                     } else {
                         console.error("Failed to insert fallback profile", insertError);
                         // Last ditch effort: maybe it just committed
                         const { data: finalRetry } = await supabase.from('profiles').select('*').eq('id', userId).single();
                         if (finalRetry) setProfile(finalRetry);
                     }
                 }
            }
        } catch (e) {
            console.error("Error fetching profile", e);
        } finally {
            setIsLoading(false);
            isFetchingRef.current = false;
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        // Use hard redirect to ensure auth state clears fully across all cached routes
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ user, profile, isLoading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
