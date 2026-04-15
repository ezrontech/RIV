"use client";

import { useState } from "react";
import { 
    Heart, 
    Send, 
    MessageCircle, 
    LifeBuoy, 
    AlertCircle, 
    Settings, 
    CheckCircle2, 
    ArrowLeft,
    ShieldQuestion,
    Cpu,
    Users
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CATEGORIES = [
    { id: 'technical', label: 'Technical Issue', icon: Cpu, color: 'text-rasta-red' },
    { id: 'community', label: 'Community & Culture', icon: Users, color: 'text-rasta-green' },
    { id: 'account', label: 'Account / Access', icon: Settings, color: 'text-rasta-yellow' },
    { id: 'other', label: 'Other Inquiries', icon: ShieldQuestion, color: 'text-foreground/40' }
];

export default function SupportPage() {
    const { profile } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [form, setForm] = useState({
        category: '',
        title: '',
        description: '',
        priority: 'medium'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.category || !form.title || !form.description) return;
        
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="size-24 bg-rasta-green/20 text-rasta-green rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,166,81,0.2)]"
                >
                    <CheckCircle2 size={48} />
                </motion.div>
                <h2 className="text-4xl font-black italic italic-bold mb-4">Request Received</h2>
                <p className="text-foreground/50 max-w-md font-medium text-lg leading-relaxed mb-10">
                    Your inquiry has been logged in the RIV Support Intelligence Unit. A Creator or Steward will reasoning with you shortly.
                </p>
                <button 
                    onClick={() => router.push("/community")}
                    className="px-8 py-4 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                    Return to Streams
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
            {/* Header */}
            <div className="mb-16 text-center">
                <Link href="/community" className="inline-flex items-center gap-2 text-foreground/40 hover:text-foreground transition-colors mb-6 text-xs font-black uppercase tracking-widest px-4 py-2 hover:bg-foreground/5 rounded-full transition-all">
                    <ArrowLeft size={14} /> Back to Streams
                </Link>
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="size-12 bg-rasta-green/20 text-rasta-green rounded-2xl flex items-center justify-center shadow-lg">
                        <Heart size={24} className="fill-current" />
                    </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic italic-bold mb-4">Community Support</h1>
                <p className="text-xl text-foreground/50 font-medium max-w-2xl mx-auto">
                    Preserving unity through active listening. If you encountered an issue or need guidance, share your reasoning below.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8 bg-foreground/[0.02] border border-foreground/5 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none -z-10">
                    <LifeBuoy size={300} />
                </div>

                {/* Categories */}
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-6 pl-2">Select Category</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setForm({ ...form, category: cat.id })}
                                className={cn(
                                    "flex flex-col items-center gap-4 p-6 rounded-3xl transition-all border-2 group",
                                    form.category === cat.id 
                                    ? "bg-foreground border-foreground text-background scale-105 shadow-xl" 
                                    : "bg-background border-white/5 text-foreground/40 hover:border-foreground/20 hover:text-foreground"
                                )}
                            >
                                <cat.icon size={24} className={cn(form.category === cat.id ? "text-rasta-yellow" : "group-hover:text-foreground transition-colors")} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 pl-2">Summary of Inquiry</label>
                    <input 
                        type="text" 
                        required
                        placeholder="Brief title..."
                        className="w-full bg-background border-2 border-white/5 px-6 py-4 rounded-2xl focus:outline-none focus:border-foreground/20 font-medium transition-all"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                </div>

                {/* Description */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 pl-2">Full Reasoning</label>
                    <textarea 
                        required
                        rows={6}
                        placeholder="Tell us what happened..."
                        className="w-full bg-background border-2 border-white/5 px-6 py-4 rounded-[2rem] focus:outline-none focus:border-foreground/20 font-medium transition-all resize-none"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>

                {/* Priority Selection */}
                <div className="flex flex-wrap items-center gap-6 pt-4">
                    <div className="flex items-center gap-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 pl-2">Priority</p>
                        <div className="flex gap-2 p-1.5 bg-background rounded-full border border-white/5 shadow-inner">
                            {['low', 'medium', 'high'].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setForm({ ...form, priority: p })}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                                        form.priority === p 
                                        ? "bg-foreground text-background" 
                                        : "text-foreground/40 hover:text-foreground"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isSubmitting || !form.category || !form.title || !form.description}
                        className={cn(
                            "ml-auto flex items-center gap-3 px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl group",
                            isSubmitting ? "bg-foreground/20 text-foreground/40 cursor-not-allowed" : "bg-rasta-green text-white hover:scale-105 active:scale-95 shadow-rasta-green/20"
                        )}
                    >
                        {isSubmitting ? "Dispatching..." : (
                            <>
                                Dispatch Inquiry
                                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-16 flex flex-col md:flex-row items-center justify-between p-10 bg-rasta-yellow/5 border border-rasta-yellow/10 rounded-[3rem] gap-8">
                <div className="flex items-center gap-6">
                    <div className="size-16 rounded-3xl bg-rasta-yellow/20 flex items-center justify-center text-rasta-yellow shadow-lg">
                        <AlertCircle size={32} />
                    </div>
                    <div>
                        <h4 className="text-xl font-black mb-1">Emergency Support?</h4>
                        <p className="text-sm text-foreground/50 font-medium">Use the SOS channel in the hub navigation for immediate safety concerns.</p>
                    </div>
                </div>
                <button className="px-8 py-4 bg-rasta-yellow text-black rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-rasta-yellow/20 hover:scale-105 transition-all">
                    Access Help Desk
                </button>
            </div>
        </div>
    );
}
