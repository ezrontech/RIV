import { Calendar, Sun } from "lucide-react";

export function RightSidebar() {
    return (
        <aside className="hidden lg:flex flex-col w-80 sticky top-4 h-[calc(100vh-2rem)] p-6 ml-4 mr-4 rounded-3xl bg-[var(--sidebar-right)] shadow-2xl border border-foreground/5 overflow-y-auto no-scrollbar">

            {/* Daily Proverb */}
            <div className="mb-8 p-6 rounded-2xl bg-rasta-yellow/5 border border-rasta-yellow/10">
                <div className="flex items-center gap-2 text-rasta-yellow mb-3 font-bold text-sm uppercase tracking-wider">
                    <Sun size={16} />
                    <span>Word of the Day</span>
                </div>
                <p className="font-medium text-lg italic text-foreground/80">
                    "The stone that the builder refused will always be the head cornerstone."
                </p>
                <div className="mt-2 text-xs text-foreground/40 text-right">— Village Elder</div>
            </div>

            {/* Upcoming Ceremonies */}
            <div className="mb-8">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-rasta-red" />
                    Ceremonies & Retreats
                </h3>
                <div className="space-y-4">
                    {[
                        { date: "Feb 12", title: "Earthstrong Celebration", time: "6:00 PM", type: "Gathering" },
                        { date: "Feb 15", title: "Nyahbinghi Drumming", time: "Sunset", type: "Ceremony" },
                        { date: "Feb 20", title: "Community Farming", time: "Early Morn", type: "Service" },
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4 items-center group cursor-pointer">
                            <div className="flex flex-col items-center justify-center size-14 rounded-xl bg-foreground/5 group-hover:bg-foreground/10 transition-colors border border-foreground/5">
                                <span className="text-xs font-bold text-foreground/50 uppercase">{item.date.split(" ")[0]}</span>
                                <span className="text-lg font-bold text-foreground">{item.date.split(" ")[1]}</span>
                            </div>
                            <div>
                                <div className="font-bold text-foreground/90 group-hover:text-rasta-red transition-colors">{item.title}</div>
                                <div className="text-xs text-foreground/50 font-medium">{item.time} • {item.type}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Links (Replaces Village Notices) */}
            <div className="mt-auto pt-6 border-t border-foreground/5">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-foreground/40 font-medium">
                    <a href="#" className="hover:text-foreground/80 transition-colors">Origin</a>
                    <a href="#" className="hover:text-foreground/80 transition-colors">Partner</a>
                    <a href="#" className="hover:text-foreground/80 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-foreground/80 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-foreground/80 transition-colors">Contact Us</a>
                </div>
                <div className="mt-4 text-[10px] text-foreground/20">
                    © 2026 Rastafari Indigenous Village. All rights reserved.
                </div>
            </div>

        </aside>
    );
}
