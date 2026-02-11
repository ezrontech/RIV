"use client";

import { MOCK_WORKSHOPS } from "@/lib/mock-data";
import { BookOpen, User, Clock, Star } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";

import { useState } from "react";

export default function WorkshopsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredWorkshops = MOCK_WORKSHOPS.filter(w =>
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <SearchBar
                placeholder="Search workshops, skills, and teachers..."
                value={searchQuery}
                onChange={setSearchQuery}
            />

            <div className="p-6 grid gap-6">
                {/* Hero / Featured */}
                <div className="rounded-3xl bg-rasta-green/10 border border-rasta-green/20 p-8 flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
                    <div className="flex-1">
                        <div className="inline-block px-3 py-1 rounded-full bg-rasta-green text-white text-xs font-bold uppercase tracking-wider mb-4">Featured Workshop</div>
                        <h1 className="text-3xl font-bold mb-4">Traditional Nyabinghi Drumming</h1>
                        <p className="text-lg text-foreground/80 mb-6">Join Ras Tafari Youth for a 4-week intensive on the heartbeat of Nyabinghi. Connect with the rhythm of the village.</p>
                        <button className="px-8 py-3 rounded-full bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity">
                            Enroll Now - Free
                        </button>
                    </div>
                    <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                        <img src="/images/Ceremonial-1f35b70-1-768x1024.jpg" alt="Drumming" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Workshop Grid */}
                <h2 className="text-xl font-bold mt-4 px-2">Upcoming Workshops</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkshops.map((workshop) => (
                        <div key={workshop.id} className="group cursor-pointer bg-foreground/5 rounded-2xl overflow-hidden hover:bg-foreground/10 transition-colors border border-foreground/5">
                            <div className="aspect-video relative overflow-hidden">
                                <img src={workshop.image} alt={workshop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-md">
                                    {workshop.level}
                                </div>
                            </div>
                            <div className="p-5 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg leading-tight group-hover:text-rasta-green transition-colors">{workshop.title}</h3>
                                    <span className="font-bold text-rasta-green text-sm">{workshop.price}</span>
                                </div>

                                <p className="text-sm text-foreground/60 line-clamp-2">{workshop.description}</p>

                                <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-foreground/5 text-xs text-foreground/50 font-medium uppercase tracking-wide">
                                    <div className="flex items-center gap-2">
                                        <User size={14} /> {workshop.instructor}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} /> {workshop.duration}
                                        </div>
                                        <div>{workshop.students} Students</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
