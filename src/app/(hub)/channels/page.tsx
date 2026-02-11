"use client";

import { MOCK_VIDEOS, MOCK_CHANNELS, MOCK_SERIES, MOCK_USERS } from "@/lib/mock-data";
import { Play, CheckCircle2, Flame, TrendingUp, Users, Sparkles, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

// Categories tailored for "Shows"
const CATEGORIES = ["All", "Originals", "Docu-Series", "Culture", "Farming", "Cooking", "News"];

export default function ChannelsPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Refs for horizontal scrolling
    const seriesRef = useRef<HTMLDivElement>(null);
    const newEpisodesRef = useRef<HTMLDivElement>(null);
    const popularRef = useRef<HTMLDivElement>(null);

    const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        if (ref.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Filter logic
    const featuredSeries = MOCK_SERIES[0]; // Spotlight: Cooking with Sister Irie
    const originalSeries = MOCK_SERIES; // List all series as originals
    const latestEpisodes = MOCK_VIDEOS.slice(0, 6); // Just grab recent videos
    const popularVideos = MOCK_VIDEOS.filter(v => parseInt(v.views) > 3);

    // Helper: Find Host Avatar (User or Channel)
    const getHostAvatar = (hostName: string) => {
        const user = MOCK_USERS.find(u => u.name === hostName);
        if (user) return user.avatar;
        const channel = MOCK_CHANNELS.find(c => c.name === hostName);
        if (channel) return channel.avatar;
        return '/images/riv-logo.webp'; // Fallback
    };

    // Helper for Section Headers with Scroll Controls
    const SectionHeader = ({ title, icon: Icon, scrollRef, subtitle }: { title: string, subtitle?: string, icon?: any, scrollRef?: React.RefObject<HTMLDivElement | null> }) => (
        <div className="flex items-end justify-between mb-4 px-1">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-rasta-yellow">
                    {Icon && <Icon size={18} />}
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">RIV Originals</span>
                </div>
                <h2 className="text-2xl font-bold">{title}</h2>
                {subtitle && <p className="text-sm text-foreground/60">{subtitle}</p>}
            </div>
            {scrollRef && (
                <div className="flex gap-2">
                    <button onClick={() => scroll(scrollRef, 'left')} className="p-2 rounded-full border border-foreground/10 hover:bg-foreground/5 transition-colors"><ChevronLeft size={20} /></button>
                    <button onClick={() => scroll(scrollRef, 'right')} className="p-2 rounded-full border border-foreground/10 hover:bg-foreground/5 transition-colors"><ChevronRight size={20} /></button>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col pb-20">
            <SearchBar placeholder="Search shows, series, and episodes..." />

            {/* Category Pills (Sticky) */}
            <div className="sticky top-[80px] z-20 bg-background/95 backdrop-blur-sm border-b border-foreground/5 py-3 px-4 mb-6">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors border",
                                selectedCategory === cat
                                    ? "bg-foreground text-background border-foreground"
                                    : "bg-background text-foreground border-foreground/10 hover:bg-foreground/5"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-12 px-6">

                {/* 1. HERO: Featured Series */}
                {selectedCategory === "All" && (
                    <section className="relative aspect-[4/5] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer isolate">
                        {/* Background Image */}
                        <img
                            src={featuredSeries.cover}
                            alt={featuredSeries.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-2/3 flex flex-col items-start gap-4">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-rasta-red text-white text-[10px] font-bold uppercase tracking-wider rounded">Series Premiere</span>
                                <span className="px-2 py-1 bg-white/20 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded border border-white/10">{featuredSeries.category}</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                                {featuredSeries.title}
                            </h1>

                            <p className="text-white/80 text-sm md:text-lg line-clamp-2 max-w-xl font-medium">
                                {featuredSeries.description}
                            </p>

                            <div className="flex items-center gap-3 text-white/90 text-sm font-bold mt-2">
                                <img src={getHostAvatar(featuredSeries.host)} className="size-8 rounded-full border border-white/20" alt={featuredSeries.host} />
                                <span>Hosted by {featuredSeries.host}</span>
                            </div>

                            <div className="flex items-center gap-3 mt-4">
                                <button className="px-8 py-3.5 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:bg-rasta-yellow transition-colors shadow-lg hover:scale-105 transform duration-200">
                                    <Play size={20} className="fill-black" /> Start Watching
                                </button>
                                <button className="p-3.5 bg-white/10 backdrop-blur text-white font-bold rounded-full hover:bg-white/20 transition-colors border border-white/10">
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* 2. Original Series (Vertical Posters) */}
                <section>
                    <SectionHeader title="RIV Original Series" subtitle="Curated shows from the village." icon={Sparkles} scrollRef={seriesRef} />
                    <div ref={seriesRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-8 -mx-6 px-6 snap-x scroll-smooth">
                        {originalSeries.map((series) => (
                            <div key={series.id} className="snap-center shrink-0 w-[160px] md:w-[200px] group cursor-pointer flex flex-col gap-3">
                                {/* Vertical Poster */}
                                <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                                    <img src={series.thumbnail} alt={series.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                    {/* Logo/Title Overlay on Hover? Maybe purely visual */}
                                </div>

                                <div>
                                    <h3 className="font-bold text-sm leading-tight mb-1 group-hover:text-rasta-green truncate">{series.title}</h3>
                                    <p className="text-xs text-foreground/50">{series.episodes.length} Episodes</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Meet the Hosts (Broadcasters) */}
                <section>
                    <SectionHeader title="Meet the Broadcasters" icon={Users} />
                    <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
                        {MOCK_CHANNELS.map(channel => (
                            <div key={channel.id} className="flex flex-col items-center gap-3 shrink-0 group cursor-pointer min-w-[100px]">
                                <div className="size-24 rounded-full p-0.5 bg-gradient-to-tr from-rasta-red via-rasta-yellow to-rasta-green group-hover:scale-105 transition-transform shadow-lg">
                                    <div className="size-full rounded-full border-4 border-background overflow-hidden relative">
                                        <img src={channel.avatar} alt={channel.name} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold truncate max-w-[120px]">{channel.name}</p>
                                    <p className="text-[10px] text-foreground/50 font-medium bg-foreground/5 px-2 py-0.5 rounded-full inline-block mt-1">HOST</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Latest Episodes (Horizontal Video List) */}
                <section>
                    <SectionHeader title="New Episodes" icon={Flame} scrollRef={newEpisodesRef} />
                    <div ref={newEpisodesRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 snap-x scroll-smooth">
                        {latestEpisodes.map((video) => (
                            <div key={video.id} className="snap-center shrink-0 w-[280px] md:w-[320px] group cursor-pointer flex flex-col gap-3">
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-foreground/10">
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <Play size={10} className="fill-white" /> {video.duration}
                                    </div>
                                    <div className="absolute top-2 left-2 bg-rasta-yellow text-black text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">{video.category}</div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="size-9 rounded-full overflow-hidden shrink-0 border border-foreground/10 bg-foreground/5">
                                        <img src={video.channel.avatar} alt={video.channel.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm leading-snug mb-1 group-hover:text-rasta-green line-clamp-2">{video.title}</h3>
                                        <div className="text-xs text-foreground/60 flex items-center gap-1">
                                            <span>{video.channel.name}</span>
                                            <span className="text-[8px]">•</span>
                                            <span>{video.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}

