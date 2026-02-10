"use client";

import { MOCK_PRODUCTS, MOCK_USERS, MOCK_CHANNELS } from "@/lib/mock-data";
import { ShoppingBag, Search, Store, ArrowRight, Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/ui/search-bar";

export default function ShopPage() {

    // Simulate "Vendors" from Channels/Users for variety
    const vendors = [
        { id: 'v1', name: 'Sister Irie', avatar: MOCK_USERS[1].avatar, category: 'Food & Spices', rating: 4.9 },
        { id: 'v2', name: 'Ras Tafari Youth', avatar: MOCK_USERS[2].avatar, category: 'Crafts', rating: 4.8 },
        { id: 'v3', name: 'Elder Bongo', avatar: MOCK_USERS[0].avatar, category: 'Woodwork', rating: 5.0 },
        { id: 'v4', name: 'Mama Africa', avatar: MOCK_USERS[3].avatar, category: 'Herbal Medicine', rating: 4.9 },
    ];

    const getVendorAvatar = (artisanName: string) => {
        const vendor = vendors.find(v => v.name === artisanName);
        return vendor ? vendor.avatar : '/images/riv-logo.webp';
    };

    const categories = ["All", "Crafts", "Food", "Clothing", "Herbs", "Instruments"];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col pb-20">
            {/* Header / Search */}
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-foreground/5 py-3 px-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="font-black text-xl tracking-tight">Village Market</h1>
                        <p className="text-xs text-foreground/60 font-medium">Support Local Artisans</p>
                    </div>
                    <div className="p-2 bg-foreground/5 rounded-full relative hover:bg-foreground/10 cursor-pointer transition-colors">
                        <ShoppingBag size={20} />
                        <span className="absolute -top-1 -right-1 size-4 bg-rasta-red text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-background">2</span>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                    <input
                        type="text"
                        placeholder="Search for products, artisans..."
                        className="w-full bg-foreground/5 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 placeholder:text-foreground/40"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-8 px-4 py-6">

                {/* 1. Hero: Featured Vendor / Marketplace Highlight */}
                <section className="relative aspect-[2/1] md:aspect-[3/1] rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
                    <img src="/images/IMG_6582-768x1024.jpg" alt="Market Day" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-center items-start">
                        <span className="px-2 py-1 bg-rasta-yellow text-black text-[10px] font-bold uppercase tracking-wider rounded mb-2">Market Day Special</span>
                        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">Fresh Harvest <br /> & Roots Tonic</h2>
                        <p className="text-white/80 text-xs md:text-sm max-w-[200px] mb-4">Direct from Sister Irie's garden to your table. 100% Organic.</p>
                        <button className="px-4 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-rasta-green hover:text-white transition-colors">Shop Collection</button>
                    </div>
                </section>

                {/* Categories */}
                <section className="flex gap-2 overflow-x-auto no-scrollbar">
                    {categories.map((cat, idx) => (
                        <button key={idx} className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors",
                            idx === 0 ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-foreground/10 hover:border-foreground/30"
                        )}>
                            {cat}
                        </button>
                    ))}
                </section>

                {/* 2. Meet the Artisans (Vendors Rail) */}
                <section>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Store size={18} className="text-rasta-green" /> Top Artisans</h3>
                        <button className="text-xs text-rasta-green font-bold flex items-center hover:underline">View All <ArrowRight size={12} className="ml-0.5" /></button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {vendors.map(vendor => (
                            <div key={vendor.id} className="flex flex-col items-center gap-2 shrink-0 p-3 bg-foreground/5 rounded-xl min-w-[100px] cursor-pointer hover:bg-foreground/10 transition-colors">
                                <img src={vendor.avatar} alt={vendor.name} className="size-16 rounded-full object-cover border-2 border-background shadow-sm" />
                                <div className="text-center">
                                    <p className="text-xs font-bold truncate max-w-[90px]">{vendor.name}</p>
                                    <p className="text-[10px] text-foreground/50">{vendor.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Popular Products (Grid) */}
                <section>
                    <h3 className="font-bold text-lg mb-3 px-1">Popular in the Village</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {MOCK_PRODUCTS.map((product) => (
                            <div key={product.id} className="group flex flex-col gap-2 cursor-pointer">
                                <div className="aspect-square w-full rounded-xl overflow-hidden bg-foreground/5 relative">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                                    {/* Quick Actions */}
                                    <button className="absolute top-2 right-2 size-8 rounded-full bg-black/20 backdrop-blur text-white flex items-center justify-center hover:bg-rasta-red transition-colors opacity-0 group-hover:opacity-100">
                                        <Heart size={14} />
                                    </button>
                                    <button className="absolute bottom-2 right-2 size-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-rasta-yellow transition-colors translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300">
                                        <ShoppingBag size={18} />
                                    </button>
                                </div>

                                <div>
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-sm leading-tight pr-1 line-clamp-2 group-hover:text-rasta-green">{product.name}</h4>
                                        <span className="font-bold text-sm">{product.price}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <img src={getVendorAvatar(product.artisan)} className="size-4 rounded-full object-cover" />
                                        <p className="text-xs text-foreground/60 truncate">By {product.artisan}</p>
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
