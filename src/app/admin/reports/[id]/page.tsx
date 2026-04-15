"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    ChevronLeft, 
    Download, 
    Share2, 
    Printer, 
    BarChart3, 
    Users, 
    TrendingUp, 
    Layers,
    Calendar,
    FileText,
    ArrowUpRight,
    Search,
    Globe,
    Zap,
    ShieldCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock report data
const MOCK_REPORT = {
    id: "2024-annual",
    title: "2024 Annual RIV Report",
    subtitle: "Unity, Sustainability & Global Growth",
    date: "December 31, 2024",
    author: "RIV Foundation",
    summary: "The 2024 RIV Annual Report highlights our significant growth in community engagement, successful land acquisition in Ethiopia, and the launch of our digital marketplace for artisans.",
    sections: [
        {
            title: "Executive Summary",
            icon: Zap,
            content: "RIV has reached a pivotal milestone this year, crossing 100,000 active members and establishing vital infrastructure for our educational retreats. Our financial position remains strong, allowing for intensified investment in cultural preservation projects.",
            stats: [
                { label: "Community Growth", value: "+124%", trend: "up", color: "text-rasta-green" },
                { label: "Impact Projects", value: "32", trend: "up", color: "text-rasta-red" }
            ]
        },
        {
            title: "Community Metrics",
            icon: Users,
            content: "Our 'Streams' engagement has increased by 85% year-over-year. The introduction of the 'Creator' verified roles has significantly improved the quality of discourse within our digital village.",
            stats: [
                { label: "Active Members", value: "112K", trend: "up", color: "text-rasta-yellow" },
                { label: "Daily Reasoning", value: "14.2K", trend: "up", color: "text-rasta-green" }
            ]
        },
        {
            title: "Global Expansion",
            icon: Globe,
            content: "We successfully established our first international 'Roots Satellite' in Addis Ababa, providing a physical bridge between the Diaspora and the Motherland. Land acquisition for the new RIV Sanctuary is 80% complete.",
            stats: [
                { label: "Land Acquired", value: "482ha", trend: "up", color: "text-rasta-green" },
                { label: "Countries Represented", value: "64", trend: "up", color: "text-rasta-yellow" }
            ]
        }
    ],
    tags: ["Annual Report", "2024", "Growth", "Finances", "Impact"]
};

export default function ReportViewerPage() {
    const { id } = useParams();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState(0);

    return (
        <div className="min-h-screen bg-background pb-20 overflow-x-hidden">
            {/* Header / Navigation */}
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-foreground/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/60 hover:text-foreground group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div className="hidden sm:block">
                        <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-rasta-yellow leading-none mb-1 shadow-rasta-yellow/20 text-glow">Document Center</h1>
                        <p className="text-sm font-bold truncate max-w-[200px] md:max-w-md">{MOCK_REPORT.title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-foreground/5 rounded-full transition-colors text-xs font-bold uppercase tracking-widest text-foreground/60 hover:text-foreground">
                        <Share2 size={16} /> Share
                    </button>
                    <button className="p-2 hover:bg-foreground/5 rounded-full transition-colors hidden sm:block">
                        <Printer size={18} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-rasta-yellow text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:-translate-y-0.5">
                        <Download size={14} /> Download PDF
                    </button>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="max-w-6xl mx-auto px-6 pt-16">
                
                {/* Hero Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-24 text-center relative"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-rasta-yellow/5 rounded-full blur-[120px] -z-10"></div>
                    
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="size-24 bg-foreground/[0.03] border border-rasta-yellow/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl relative"
                    >
                        <FileText size={44} className="text-rasta-yellow" />
                        <div className="absolute inset-0 bg-rasta-yellow/10 rounded-[2.5rem] animate-pulse"></div>
                    </motion.div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-foreground/40">
                        <Calendar size={12} className="text-rasta-yellow" /> {MOCK_REPORT.date}
                    </div>

                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 italic italic-bold leading-[0.85] bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
                        {MOCK_REPORT.title}
                    </h2>
                    
                    <p className="text-2xl text-foreground/60 font-medium max-w-3xl mx-auto leading-relaxed">
                        {MOCK_REPORT.subtitle}
                    </p>
                </motion.div>

                {/* Editorial Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    
                    {/* Navigation Rail */}
                    <div className="lg:col-span-3 space-y-10 hidden lg:block sticky top-32 h-fit">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 mb-6 px-4">Contents</p>
                            <nav className="space-y-2">
                                {MOCK_REPORT.sections.map((section, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveSection(idx)}
                                        className={cn(
                                            "w-full text-left px-6 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all relative overflow-hidden group",
                                            activeSection === idx 
                                            ? "bg-foreground text-background translate-x-3 shadow-2xl" 
                                            : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <section.icon size={16} className={cn(activeSection === idx ? "text-rasta-yellow" : "text-foreground/20 group-hover:text-foreground/50 transition-colors")} />
                                            <span className="relative z-10">{section.title}</span>
                                        </div>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-foreground/[0.02] border border-white/5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-rasta-yellow mb-2">Verified Integrity</p>
                            <p className="text-xs text-foreground/40 leading-relaxed font-medium">This document is cryptographically signed and stored in the RIV Immutable Repository.</p>
                        </div>
                    </div>

                    {/* Report Content */}
                    <div className="lg:col-span-9">
                        <div className="bg-foreground/[0.01] border border-foreground/5 rounded-[4rem] p-8 md:p-20 relative overflow-hidden">
                            {/* Visual Pattern */}
                            <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none select-none -z-10">
                                <ShieldCheck size={400} />
                            </div>

                            {/* Summary Quote */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-20 p-10 bg-black/40 rounded-[3rem] border border-rasta-yellow/10 relative group shadow-2xl"
                            >
                                <div className="absolute -top-6 -left-6 size-12 bg-rasta-yellow text-black flex items-center justify-center rounded-2xl font-black text-4xl italic">“</div>
                                <p className="text-2xl leading-relaxed font-bold italic tracking-tight text-foreground/90">
                                    {MOCK_REPORT.summary}
                                </p>
                            </motion.div>

                            {/* Active Section Content */}
                            <div className="min-h-[500px]">
                                <AnimatePresence mode="wait">
                                    {MOCK_REPORT.sections.map((section, idx) => (
                                        idx === activeSection && (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: 40 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -40 }}
                                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                className="space-y-12"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <div className="h-0.5 w-12 bg-rasta-yellow rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)]"></div>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rasta-yellow">Intelligence Unit</span>
                                                    </div>
                                                    <h3 className="text-5xl font-black tracking-tighter mb-8 italic">{section.title}</h3>
                                                    <p className="text-2xl leading-relaxed text-foreground/70 font-medium">
                                                        {section.content}
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                                    {section.stats.map((stat, sIdx) => (
                                                        <div key={sIdx} className="bg-foreground/5 p-10 rounded-[2.5rem] border border-white/5 hover:border-rasta-yellow/20 transition-all group overflow-hidden relative shadow-lg">
                                                            <div className="absolute top-0 right-0 size-20 bg-gradient-to-br from-rasta-yellow/5 to-transparent rounded-bl-full"></div>
                                                            <div className="flex flex-col gap-2 relative z-10">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={cn("text-4xl font-black tracking-tighter", stat.color)}>
                                                                        {stat.value}
                                                                    </span>
                                                                    <div className={cn("flex items-center", stat.trend === 'up' ? 'text-rasta-green' : 'text-rasta-red')}>
                                                                        <TrendingUp size={16} className={stat.trend === 'down' ? 'rotate-180' : ''} />
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs uppercase tracking-[0.2em] font-black text-foreground/40">{stat.label}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Footnote */}
                            <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex gap-2">
                                    <div className="size-2 rounded-full bg-rasta-red"></div>
                                    <div className="size-2 rounded-full bg-rasta-yellow animate-pulse shadow-[0_0_10px_rgba(255,215,0,0.5)]"></div>
                                    <div className="size-2 rounded-full bg-rasta-green"></div>
                                </div>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {MOCK_REPORT.tags.map(tag => (
                                        <span key={tag} className="px-4 py-2 rounded-full bg-foreground/5 text-[9px] font-black uppercase tracking-widest text-foreground/30 border border-white/5">
                                            #{tag.replace(' ', '_')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Sticky Mobile Section Tabs */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-black/60 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] flex gap-1 z-50 shadow-2xl">
                {MOCK_REPORT.sections.map((section, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveSection(idx)}
                        className={cn(
                            "flex-1 py-4 rounded-2xl transition-all flex flex-col items-center gap-1",
                            activeSection === idx ? "bg-white text-black font-black scale-105 shadow-xl" : "text-white/40"
                        )}
                    >
                        <section.icon size={18} />
                        <span className="text-[8px] font-black uppercase tracking-widest">P.0{idx + 1}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
