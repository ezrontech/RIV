"use client";

import { MOCK_RETREATS } from "@/lib/mock-data";
import { Star, Heart, Clock, Check, Calendar, MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { useRef } from "react";

export default function RetreatsPage() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
        }
    };

    const villageRetreats = MOCK_RETREATS.filter(r => r.category === 'Village Retreats');
    const ceremonies = MOCK_RETREATS.filter(r => r.category === 'Ceremonies');
    const online = MOCK_RETREATS.filter(r => r.category === 'Online Experiences');

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col pb-20">
            <SearchBar placeholder="Search retreats, ceremonies, and online classes..." />

            <div className="flex flex-col gap-12 p-6 overflow-hidden">

                {/* SECTION 1: Horizontal Scroll (Village Retreats) */}
                <section>
                    <div className="flex justify-between items-end mb-6 px-2">
                        <div>
                            <h2 className="text-2xl font-bold">Village Retreats & Immersion</h2>
                            <p className="text-foreground/60 text-sm mt-1">Live, learn, and reason on sacred ground.</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={scrollLeft} className="p-2 rounded-full border border-foreground/10 hover:bg-foreground/5 transition-colors"><ChevronLeft size={20} /></button>
                            <button onClick={scrollRight} className="p-2 rounded-full border border-foreground/10 hover:bg-foreground/5 transition-colors"><ChevronRight size={20} /></button>
                        </div>
                    </div>

                    <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory">
                        {villageRetreats.map((retreat) => (
                            <div key={retreat.id} className="min-w-[300px] md:min-w-[340px] snap-center group cursor-pointer flex flex-col bg-background rounded-2xl overflow-hidden border border-foreground/5 hover:border-rasta-yellow/50 hover:shadow-xl transition-all duration-500">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img src={retreat.image} alt={retreat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <button className="absolute top-3 right-3 p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-rasta-red text-white transition-colors">
                                        <Heart size={16} />
                                    </button>
                                    {retreat.badge && (
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-rasta-green text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">
                                            {retreat.badge}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-1 gap-2">
                                    <div className="flex items-center gap-1 text-rasta-yellow text-xs font-bold">
                                        <Star size={12} fill="currentColor" /> {retreat.rating} <span className="text-foreground/40 font-normal">({retreat.reviews})</span>
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight line-clamp-2">{retreat.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-foreground/60 mt-auto pt-2">
                                        <Clock size={12} /> {retreat.duration}
                                    </div>
                                    <div className="mt-2 flex items-baseline justify-between border-t border-foreground/5 pt-3">
                                        <span className="text-xs text-foreground/50">per person</span>
                                        <span className="text-lg font-bold">{retreat.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 2: Featured Double Card (Ceremonies) */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 px-2">Upcoming Ceremonies</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {ceremonies.map((ceremony) => (
                            <div key={ceremony.id} className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer">
                                <img src={ceremony.image} alt={ceremony.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                                <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                    {ceremony.date}
                                </div>

                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <div className="text-rasta-yellow font-bold text-sm mb-2 uppercase tracking-wide">Live Event</div>
                                    <h3 className="text-3xl font-bold text-white mb-3 leading-tight">{ceremony.title}</h3>
                                    <p className="text-white/70 line-clamp-2 mb-6 max-w-md">{ceremony.description}</p>
                                    <button className="px-6 py-3 bg-rasta-red text-white font-bold rounded-full hover:bg-white hover:text-rasta-red transition-all flex items-center gap-2">
                                        Join Ceremony <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 3: Standard Grid (Online) */}
                <section>
                    <div className="flex justify-between items-center mb-6 px-2">
                        <h2 className="text-2xl font-bold">Online Experiences</h2>
                        <span className="text-sm font-bold text-rasta-green cursor-pointer hover:underline">View All</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {online.map((exp) => (
                            <div key={exp.id} className="group cursor-pointer flex flex-col gap-3">
                                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 backdrop-blur text-xs font-bold rounded">
                                        Online
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-base leading-snug group-hover:text-rasta-green transition-colors">{exp.title}</h3>
                                        <div className="flex items-center gap-1 text-xs font-bold">
                                            <Star size={10} fill="currentColor" className="text-rasta-yellow" /> {exp.rating}
                                        </div>
                                    </div>
                                    <div className="text-sm text-foreground/60 mt-1">{exp.price} • {exp.duration}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
