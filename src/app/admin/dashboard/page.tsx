"use client";

import { 
    Users, 
    TrendingUp, 
    FileText, 
    ShieldCheck, 
    Eye, 
    ArrowUpRight, 
    LayoutDashboard,
    MoreHorizontal,
    Search,
    Bell,
    Activity,
    Settings,
    ShieldAlert,
    Waves
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock Dashboard Data
const STATS = [
    { label: "Village Members", value: "112,482", trend: "+12%", icon: Users, color: "text-rasta-green" },
    { label: "Active Reasonings", value: "14,204", trend: "+85%", icon: Waves, color: "text-rasta-yellow" },
    { label: "Land Registry", value: "482.5 ha", trend: "0%", icon: ShieldCheck, color: "text-rasta-green" },
    { label: "Open Tickets", value: "12", trend: "-5%", icon: ShieldAlert, color: "text-rasta-red" },
];

const RECENT_ACTIVITY = [
    { 
        id: 1, 
        user: "JahBlessed", 
        title: "New Artisan Shop Listing: Hand-carved Kete Drum", 
        time: "2 hours ago", 
        action: "Verification Required",
        href: "/admin/verify"
    },
    { 
        id: 2, 
        user: "System", 
        title: "Draft for Annual Report 2024 generated", 
        time: "5 hours ago", 
        action: "Document Center",
        href: "/admin/reports/2024-annual"
    },
    { 
        id: 3, 
        user: "Global_Unity", 
        title: "Infrastructure Request: Montego Valley Bridge Restoration", 
        time: "Yesterday", 
        action: "Priority High",
        href: "/admin/requests"
    }
];

export default function AdminDashboardPage() {
    const { profile } = useAuth();
    const router = useRouter();

    return (
        <div className="p-6 md:p-8 min-h-screen">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-rasta-yellow shadow-[0_0_10px_rgba(255,215,0,0.3)]"><ShieldCheck size={20} /></span>
                        <h1 className="text-sm font-black uppercase tracking-[0.3em] text-foreground/40 leading-none">Security Clear: High</h1>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter italic italic-bold mb-2">Commands Center</h2>
                    <p className="text-foreground/50 font-medium">Welcome back, {profile?.name}. Monitoring the RIV pulse in real-time.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative group hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-foreground transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Global Search..."
                            className="bg-foreground/[0.03] border border-foreground/5 py-3 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-1 focus:ring-foreground/20 font-medium transition-all"
                        />
                    </div>
                    <button className="p-3 bg-foreground/[0.03] border border-foreground/5 rounded-2xl hover:bg-foreground/5 transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 size-2 bg-rasta-red rounded-full ring-4 ring-background"></span>
                    </button>
                    <button className="p-3 bg-foreground/[0.03] border border-foreground/5 rounded-2xl hover:bg-foreground/5 transition-colors">
                        <Settings size={20} />
                    </button>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {STATS.map((stat, idx) => (
                    <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group bg-foreground/[0.03] border border-foreground/5 p-8 rounded-[3rem] hover:bg-foreground/[0.05] transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
                    >
                        <div className="absolute top-[-20px] right-[-20px] size-32 bg-rasta-yellow/5 rounded-full blur-3xl group-hover:bg-rasta-yellow/10 transition-colors"></div>
                        
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn("size-12 rounded-2xl bg-black/40 flex items-center justify-center shadow-inner", stat.color)}>
                                <stat.icon size={24} />
                            </div>
                            <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black border", 
                                stat.trend.includes('+') ? "bg-rasta-green/10 text-rasta-green border-rasta-green/20" : 
                                stat.trend.includes('-') ? "bg-rasta-red/10 text-rasta-red border-rasta-red/20" : 
                                "bg-foreground/5 text-foreground/40 border-foreground/10"
                            )}>
                                {stat.trend}
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">{stat.label}</p>
                            <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Intelligence Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
                
                {/* Activity Intelligence */}
                <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-3">
                            <Activity className="text-rasta-yellow" size={24} />
                            <h3 className="text-2xl font-black italic italic-bold tracking-tight">Intelligence Feed</h3>
                        </div>
                        <Link href="/admin/reports" className="text-xs font-black uppercase tracking-widest text-rasta-green flex items-center gap-1 hover:underline">
                            Open Documents <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {RECENT_ACTIVITY.map((activity, idx) => (
                            <motion.div 
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + idx * 0.1 }}
                                className="group flex items-center gap-6 p-6 rounded-[2.5rem] bg-foreground/[0.02] border border-foreground/5 hover:bg-foreground/[0.03] transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="size-12 rounded-2xl bg-black/40 flex items-center justify-center shrink-0 border border-white/5">
                                    <div className="text-sm font-bold text-foreground/40">{activity.user[0]}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-foreground group-hover:text-rasta-yellow transition-colors">{activity.title}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-foreground/40">{activity.time}</span>
                                        <span className="size-1 rounded-full bg-foreground/10"></span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-rasta-green">{activity.action}</span>
                                    </div>
                                </div>
                                <Link href={activity.href} className="p-3 rounded-full hover:bg-foreground/5 transition-colors">
                                    <ArrowUpRight size={18} className="text-foreground/20 group-hover:text-foreground transition-colors" />
                                </Link>
                                
                                {/* Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-r from-rasta-yellow/0 via-rasta-yellow/[0.01] to-rasta-yellow/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions / Status */}
                <div className="lg:col-span-4 space-y-10">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground/20 mb-6 px-2 text-center md:text-left">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <ActionButton label="Dispatch Alert" color="bg-rasta-red" />
                            <ActionButton label="New Report" color="bg-foreground" />
                            <ActionButton label="User Audit" color="bg-foreground/5" textColor="text-foreground" />
                            <ActionButton label="System Log" color="bg-foreground/5" textColor="text-foreground" />
                        </div>
                    </div>

                    <div className="p-8 rounded-[3rem] bg-black/40 border border-white/5 relative overflow-hidden">
                        <div className="flex items-center gap-2 text-rasta-green mb-4">
                            <div className="size-2 rounded-full bg-rasta-green animate-pulse"></div>
                            <p className="text-[10px] font-black uppercase tracking-widest">Protocol status: ACTIVE</p>
                        </div>
                        <h4 className="text-xl font-black mb-4">Community Sustainability Index</h4>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                            <div className="h-full w-[82%] bg-gradient-to-r from-rasta-green to-rasta-yellow shadow-[0_0_10px_rgba(0,166,81,0.3)]"></div>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-foreground/40">
                            <span>RESOURCES CAP: 100%</span>
                            <span>CURRENT: 82%</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

const ActionButton = ({ label, color, textColor = "text-white" }: { label: string, color: string, textColor?: string }) => (
    <button className={cn(
        "py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[1.05] active:scale-95 shadow-lg",
        color,
        textColor
    )}>
        {label}
    </button>
);
