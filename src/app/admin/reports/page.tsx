"use client";

import { useState, useEffect } from "react";
import { 
    FileText, 
    Search, 
    Filter, 
    Download, 
    MoreHorizontal, 
    Plus, 
    ArrowLeft,
    PieChart,
    Lock,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";


// Mock reports data
const MOCK_REPORTS = [
    {
        id: "2024-annual",
        title: "2024 Annual RIV Report",
        type: "Financial & Growth",
        date: "2024-12-31",
        status: "Finalized",
        author: "System Admin",
        size: "4.2 MB",
        color: "text-rasta-green"
    },
    {
        id: "q3-community",
        title: "Q3 Community Engagement Study",
        type: "Engagement",
        date: "2024-09-30",
        status: "Finalized",
        author: "Community Creator",
        size: "1.8 MB",
        color: "text-rasta-yellow"
    },
    {
        id: "2023-annual",
        title: "2023 Annual Foundations",
        type: "Archive",
        date: "2023-12-31",
        status: "Archived",
        author: "Root Admin",
        size: "5.5 MB",
        color: "text-rasta-red"
    },
    {
        id: "ethiopia-project",
        title: "Ethiopia Infrastructure Progress",
        type: "Project",
        date: "2024-11-15",
        status: "Draft",
        author: "Project Lead",
        size: "12.4 MB",
        color: "text-rasta-green"
    }
];

export default function DocumentCenterPage() {
    const { profile } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredReports = MOCK_REPORTS.filter(report => 
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 md:p-8 min-h-screen">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/admin/dashboard" className="p-2 hover:bg-foreground/5 rounded-full transition-colors group">
                        <ArrowLeft size={20} className="text-foreground/40 group-hover:text-foreground transition-colors" />
                    </Link>
                    <h1 className="text-sm font-black uppercase tracking-[0.3em] text-foreground/40 leading-none">Command Center</h1>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-5xl font-black tracking-tighter italic italic-bold mb-2">Document Center</h2>
                        <p className="text-foreground/50 font-medium">Manage confidential repository of RIV platform intelligence.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3.5 bg-foreground text-background rounded-full font-black text-xs hover:opacity-90 transition-opacity self-start md:self-auto shadow-xl">
                        <Plus size={16} /> New Document
                    </button>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <StatCard icon={FileText} label="Total Docs" value="148" color="text-rasta-red" bg="bg-rasta-red/10" />
                <StatCard icon={PieChart} label="Data Size" value="1.2 GB" color="text-rasta-yellow" bg="bg-rasta-yellow/10" />
                <StatCard icon={Lock} label="Encrypted" value="100%" color="text-rasta-green" bg="bg-rasta-green/10" />
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-foreground transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search Intelligence..."
                        className="w-full bg-foreground/[0.03] border border-foreground/5 py-4 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-1 focus:ring-foreground/20 font-medium transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-4 bg-foreground/[0.03] border border-foreground/5 rounded-2xl hover:bg-foreground/5 transition-colors font-bold text-sm">
                    <Filter size={18} /> Filters
                </button>
            </div>

            {/* Document Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report, idx) => (
                    <motion.div 
                        key={report.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative bg-foreground/[0.02] border border-foreground/5 rounded-[2.5rem] p-8 hover:bg-foreground/[0.04] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                    >
                        {/* Glow Decor */}
                        <div className="absolute top-0 right-0 size-24 bg-rasta-yellow/5 rounded-full blur-2xl group-hover:bg-rasta-yellow/10 transition-colors"></div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className={`size-14 rounded-2xl bg-black/40 flex items-center justify-center ${report.color} group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
                                <FileText size={28} />
                            </div>
                            <div className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                                <span className={`size-1.5 rounded-full ${report.status === 'Finalized' ? 'bg-rasta-green' : 'bg-rasta-yellow animate-pulse'}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest text-foreground/60">{report.status}</span>
                            </div>
                        </div>

                        <div className="relative z-10 mb-8">
                            <h3 className="text-xl font-bold mb-2 group-hover:text-rasta-yellow transition-colors">{report.title}</h3>
                            <p className="text-sm text-foreground/40 font-medium">{report.type}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                            <ItemMeta label="Updated" value={report.date} />
                            <ItemMeta label="Size" value={report.size} />
                        </div>

                        <div className="flex gap-2 relative z-10">
                            <Link href={`/admin/reports/${report.id}`} className="flex-[2]">
                                <button className="w-full py-4 bg-foreground text-background rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity">
                                    Open Intelligence
                                </button>
                            </Link>
                            <button className="flex-1 py-4 bg-foreground/5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-foreground/10 transition-colors flex items-center justify-center">
                                <Download size={12} />
                            </button>
                        </div>

                        {/* Hover Overlay Decor */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <button className="p-2 hover:bg-foreground/10 rounded-full transition-colors">
                                <MoreHorizontal size={18} className="text-foreground/40" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filteredReports.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="size-20 bg-foreground/5 rounded-full flex items-center justify-center mb-6">
                        <Search size={32} className="text-foreground/20" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No intelligence found</h3>
                    <p className="text-foreground/40">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
            )}
        </div>
    );
}

const StatCard = ({ icon: Icon, label, value, color, bg }: any) => (
    <div className="bg-foreground/[0.03] border border-foreground/5 p-8 rounded-[2rem] flex items-center gap-6 group hover:bg-foreground/[0.05] transition-all">
        <div className={`size-14 rounded-2xl ${bg} flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
            <Icon size={28} />
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">{label}</p>
            <p className="text-2xl font-black">{value}</p>
        </div>
    </div>
);

const ItemMeta = ({ label, value }: { label: string, value: string }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-[9px] font-black text-foreground/20 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-bold text-foreground/60">{value}</span>
    </div>
);
