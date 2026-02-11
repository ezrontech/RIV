"use client";

import { MOCK_PODCASTS } from "@/lib/mock-data";
import { Play, Mic, Music, Pause } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { useState } from "react";

export default function PodcastsPage() {
    const [nowPlaying, setNowPlaying] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPodcasts = MOCK_PODCASTS.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.episode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.host.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col pb-24">
            <SearchBar
                placeholder="Search audio & episodes..."
                value={searchQuery}
                onChange={setSearchQuery}
            />

            <div className="p-6 grid gap-6">
                {/* Featured Episode (Hero) */}
                <div className="p-6 rounded-3xl bg-rasta-yellow/10 border border-rasta-yellow/20 flex flex-col md:flex-row gap-6 items-center">
                    <div className="size-32 rounded-2xl bg-rasta-yellow flex items-center justify-center shrink-0 shadow-lg shadow-rasta-yellow/20">
                        <Mic size={48} className="text-background" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="text-rasta-yellow font-bold uppercase tracking-wider text-xs mb-2">Editor's Pick</div>
                        <h2 className="text-2xl font-bold mb-2">The Power of Words</h2>
                        <p className="text-foreground/70 mb-4">Elder Bongo explores the spiritual significance of 'Word, Sound, and Power' in Rastafari tradition.</p>
                        <button className="px-6 py-3 rounded-full bg-foreground text-background font-bold text-sm hover:opacity-90 inline-flex items-center gap-2">
                            <Play size={16} fill="currentColor" /> Play Episode
                        </button>
                    </div>
                </div>

                {/* Episode List */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg px-2">Recent Episodes</h3>
                    {filteredPodcasts.map((podcast) => (
                        <div key={podcast.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-foreground/5 transition-colors group cursor-pointer" onClick={() => setNowPlaying(podcast.id)}>
                            <div className="relative size-16 rounded-xl overflow-hidden bg-foreground/10 shrink-0">
                                <img src={podcast.image} alt={podcast.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play size={24} className="text-white fill-white" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold truncate">{podcast.episode}</h4>
                                <p className="text-sm text-foreground/60 truncate">{podcast.title} • {podcast.host}</p>
                            </div>
                            <div className="text-xs font-bold text-foreground/40">{podcast.duration}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mini Player (Mock) */}
            {nowPlaying && (
                <div className="fixed bottom-0 left-0 right-0 bg-foreground text-background p-4 border-t border-white/10 flex items-center justify-between z-50">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded bg-white/10 flex items-center justify-center">
                            <Music size={20} />
                        </div>
                        <div className="hidden sm:block">
                            <div className="font-bold text-sm">Now Playing</div>
                            <div className="text-xs opacity-70">Reasoning by the River</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-white/10 rounded-full"><Play size={24} fill="currentColor" /></button>
                    </div>
                </div>
            )}
        </div>
    );
}
