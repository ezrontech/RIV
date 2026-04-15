"use client";

import { BookOpen, User, Clock, Star, Plus, X, Image as ImageIcon, Share2 } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { uploadImage } from "@/lib/storage";
import { ShareButton } from "@/components/ui/share-button";

export default function WorkshopsPage() {

    const { profile } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [workshops, setWorkshops] = useState<any[]>([]);

    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newWorkshop, setNewWorkshop] = useState({ title: "", description: "", price: "", file: null as File | null });

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.from('workshops').select('*').order('title');
            if (data) setWorkshops(data);
        };
        fetchData();
    }, []);

    const handleCreateWorkshop = async () => {
        if (!newWorkshop.title || !newWorkshop.description || !profile) return;
        setIsSubmitting(true);
        let imageUrl = null;

        if (newWorkshop.file) {
            imageUrl = await uploadImage(newWorkshop.file, "workshops");
        }

        const workshopData = {
            id: `ws_${Date.now()}`,
            user_id: profile.id,
            title: newWorkshop.title,
            description: newWorkshop.description,
            price: newWorkshop.price || "Free",
            instructor: profile.name,
            level: "All Levels",
            duration: "2 Hours",
            students: 0,
            image: imageUrl || "/images/Placeholder.jpg"
        };

        const { error } = await supabase.from('workshops').insert([workshopData]);
        if (!error) {
            setWorkshops([workshopData, ...workshops]);
            setIsCreating(false);
            setNewWorkshop({ title: "", description: "", price: "", file: null });
        } else {
            console.error("Error creating workshop:", error);
        }
        setIsSubmitting(false);
    };

    const filteredWorkshops = workshops.filter(w =>
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

                {/* Create Workshop Button / Form */}
                {profile && (
                    <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-4">
                        {!isCreating ? (
                            <button onClick={() => setIsCreating(true)} className="w-full py-4 border-2 border-dashed border-foreground/20 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-foreground/5 hover:border-foreground/30 transition-all text-foreground/70 tracking-wide">
                                <Plus size={18} /> Host a Workshop
                            </button>
                        ) : (
                            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="flex justify-between items-center px-1">
                                    <h3 className="font-black text-lg">Create New Workshop</h3>
                                    <button onClick={() => setIsCreating(false)} className="p-1 hover:bg-foreground/10 rounded-full transition-colors"><X size={20} /></button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input disabled={isSubmitting} type="text" placeholder="Workshop Title" value={newWorkshop.title} onChange={e => setNewWorkshop({...newWorkshop, title: e.target.value})} className="w-full bg-background border border-foreground/10 p-3 rounded-xl focus:ring-1 focus:ring-rasta-yellow outline-none" />
                                    <input disabled={isSubmitting} type="text" placeholder="Price (Optional, e.g. $25)" value={newWorkshop.price} onChange={e => setNewWorkshop({...newWorkshop, price: e.target.value})} className="w-full bg-background border border-foreground/10 p-3 rounded-xl focus:ring-1 focus:ring-rasta-yellow outline-none" />
                                </div>
                                <textarea disabled={isSubmitting} placeholder="Workshop Description" value={newWorkshop.description} onChange={e => setNewWorkshop({...newWorkshop, description: e.target.value})} className="w-full bg-background border border-foreground/10 p-3 rounded-xl focus:ring-1 focus:ring-rasta-yellow outline-none min-h-[80px]" />
                                
                                <div className="flex items-center gap-4">
                                    <label className="flex-1 border border-dashed border-foreground/20 bg-background hover:bg-foreground/5 transition-colors p-3 rounded-xl cursor-pointer flex items-center gap-3">
                                        <input disabled={isSubmitting} type="file" accept="image/*" className="hidden" onChange={e => setNewWorkshop({...newWorkshop, file: e.target.files?.[0] || null})} />
                                        <div className="p-2 bg-rasta-yellow/20 text-rasta-yellow rounded-lg"><ImageIcon size={20} /></div>
                                        <span className="text-sm font-medium text-foreground/60">{newWorkshop.file ? newWorkshop.file.name : "Cover Image (Optional)"}</span>
                                    </label>
                                    <button onClick={handleCreateWorkshop} disabled={(!newWorkshop.title || !newWorkshop.description) || isSubmitting} className="px-8 py-4 bg-rasta-green text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 h-full">
                                        {isSubmitting ? "Creating..." : "Publish Workshop"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Hero / Featured */}
                {workshops.length > 0 && (
                    <div className="rounded-3xl bg-rasta-green/10 border border-rasta-green/20 p-8 flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
                        <div className="flex-1">
                            <div className="inline-block px-3 py-1 rounded-full bg-rasta-green text-white text-xs font-bold uppercase tracking-wider mb-4">Featured Workshop</div>
                            <h1 className="text-3xl font-bold mb-4">{workshops[0].title}</h1>
                            <p className="text-lg text-foreground/80 mb-6">{workshops[0].description}</p>
                             <div className="flex items-center gap-4">
                                <button className="px-8 py-3 rounded-full bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity">
                                    Enroll Now - {workshops[0].price || 'Free'}
                                </button>
                                <ShareButton 
                                    item={{
                                        type: 'workshop_share',
                                        title: workshops[0].title,
                                        image: workshops[0].image,
                                        data: workshops[0]
                                    }}
                                    className="p-3 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
                                />
                             </div>
                        </div>
                        <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                            <img src={workshops[0].image} alt={workshops[0].title} className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}

                {/* Workshop Grid */}
                <h2 className="text-xl font-bold mt-4 px-2">Upcoming Workshops</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWorkshops.map((workshop) => (
                        <div key={workshop.id} className="group cursor-pointer bg-foreground/5 rounded-2xl overflow-hidden hover:bg-foreground/10 transition-colors border border-foreground/5">
                            <div className="aspect-video relative overflow-hidden">
                                <img src={workshop.image} alt={workshop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                 <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <div className="bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-md">
                                        {workshop.level}
                                    </div>
                                    <ShareButton 
                                        item={{
                                            type: 'workshop_share',
                                            title: workshop.title,
                                            image: workshop.image,
                                            data: workshop
                                        }}
                                        className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-rasta-green transition-colors"
                                    />
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
