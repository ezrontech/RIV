"use client";

import { ShoppingBag, Search, Store, ArrowRight, Star, Heart, Plus, X, Image as ImageIcon, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/ui/search-bar";
import { useAuth } from "@/context/AuthContext";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import { ShareButton } from "@/components/ui/share-button";

export default function ShopPage() {
    const { profile } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState<any[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);

    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: "", price: "", file: null as File | null });

    useEffect(() => {
        const fetchData = async () => {
            const [{ data: pData }, { data: prData }] = await Promise.all([
                supabase.from('products').select('*').order('name'),
                supabase.from('profiles').select('*')
            ]);
            if (pData) setProducts(pData);
            if (prData) setProfiles(prData);
        };
        fetchData();
    }, []);

    const handleCreateProduct = async () => {
        if (!newProduct.name || !newProduct.price || !profile) return;
        setIsSubmitting(true);
        let imageUrl = null;

        if (newProduct.file) {
            imageUrl = await uploadImage(newProduct.file, "products");
        }

        const productData = {
            id: `prod_${Date.now()}`,
            user_id: profile.id,
            name: newProduct.name,
            price: newProduct.price,
            artisan: profile.name,
            image: imageUrl || "/images/Roots-Tonic.jpg"
        };

        const { error } = await supabase.from('products').insert([productData]);
        if (!error) {
            setProducts([productData, ...products]);
            setIsCreating(false);
            setNewProduct({ name: "", price: "", file: null });
        } else {
            console.error("Error creating product:", error);
        }
        setIsSubmitting(false);
    };

    const uniqueArtisans = Array.from(new Set(products.map(p => p.artisan)));
    const vendors = uniqueArtisans.map((artisan, i) => ({
        id: `v${i}`,
        name: artisan,
        category: 'Artisan', 
        rating: 5.0
    }));

    const getVendorAvatar = (artisanName: string) => {
        const user = profiles.find(u => u.name === artisanName);
        return user ? user.avatar : '/riv-logo.webp';
    };

    const categories = ["All", "Crafts", "Food", "Clothing", "Herbs", "Instruments"];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col pb-20">
            {/* Header / Search */}
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-foreground/5 p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="font-black text-xl tracking-tight">Artisan Shop</h1>
                        <p className="text-xs text-foreground/60 font-medium">Support Local Artisans</p>
                    </div>
                    <div className="p-2 bg-foreground/5 rounded-full relative hover:bg-foreground/10 cursor-pointer transition-colors">
                        <ShoppingBag size={20} />
                        <span className="absolute -top-1 -right-1 size-4 bg-rasta-red text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-background">2</span>
                    </div>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50 group-focus-within:text-rasta-yellow transition-colors" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for products, artisans..."
                        className="w-full bg-foreground/5 border border-foreground/5 rounded-full py-3 pl-12 pr-6 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-1 focus:ring-rasta-yellow/50 transition-all"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-8 px-4 py-6">

                {/* Create Product Button / Form */}
                {profile && (
                    <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-4">
                        {!isCreating ? (
                            <button onClick={() => setIsCreating(true)} className="w-full py-4 border-2 border-dashed border-foreground/20 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-foreground/5 hover:border-foreground/30 transition-all text-foreground/70 tracking-wide">
                                <Plus size={18} /> List an Item for the Village
                            </button>
                        ) : (
                            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="flex justify-between items-center px-1">
                                    <h3 className="font-black text-lg">List New Item</h3>
                                    <button onClick={() => setIsCreating(false)} className="p-1 hover:bg-foreground/10 rounded-full transition-colors"><X size={20} /></button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input disabled={isSubmitting} type="text" placeholder="Product Name (e.g., Roots Tonic)" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-background border border-foreground/10 p-3 rounded-xl focus:ring-1 focus:ring-rasta-yellow outline-none" />
                                    <input disabled={isSubmitting} type="text" placeholder="Price (e.g., $15.00)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-background border border-foreground/10 p-3 rounded-xl focus:ring-1 focus:ring-rasta-yellow outline-none" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="flex-1 border border-dashed border-foreground/20 bg-background hover:bg-foreground/5 transition-colors p-3 rounded-xl cursor-pointer flex items-center gap-3">
                                        <input disabled={isSubmitting} type="file" accept="image/*" className="hidden" onChange={e => setNewProduct({...newProduct, file: e.target.files?.[0] || null})} />
                                        <div className="p-2 bg-rasta-yellow/20 text-rasta-yellow rounded-lg"><ImageIcon size={20} /></div>
                                        <span className="text-sm font-medium text-foreground/60">{newProduct.file ? newProduct.file.name : "Upload Product Image"}</span>
                                    </label>
                                    <button onClick={handleCreateProduct} disabled={(!newProduct.name || !newProduct.price) || isSubmitting} className="px-8 py-4 bg-rasta-green text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 h-full">
                                        {isSubmitting ? "Listing..." : "Post Item"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 1. Hero: Featured Vendor / Marketplace Highlight */}
                {products.length > 0 && (
                    <section className="relative aspect-[4/3] sm:aspect-[2/1] md:aspect-[3/1] rounded-2xl overflow-hidden shadow-xl group cursor-pointer border border-foreground/5">
                        <img src={products[0].image} alt={products[0].name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                        <div className="absolute inset-0 p-6 flex flex-col justify-center items-start">
                            <span className="px-2 py-1 bg-rasta-yellow text-black text-[10px] font-bold uppercase tracking-wider rounded mb-2">Featured Item</span>
                            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">{products[0].name}</h2>
                            <p className="text-white/80 text-xs md:text-sm max-w-[200px] mb-4">Direct from {products[0].artisan}'s craft to you.</p>
                            <button className="px-4 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-rasta-green hover:text-white transition-colors">Shop Collection</button>
                        </div>
                    </section>
                )}

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
                                <img src={getVendorAvatar(vendor.name)} alt={vendor.name} className="size-16 rounded-full object-cover border-2 border-background shadow-sm" />
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
                        {products.filter(p =>
                            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.artisan.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((product) => (
                            <div key={product.id} className="group flex flex-col gap-2 cursor-pointer">
                                <div className="aspect-square w-full rounded-xl overflow-hidden bg-foreground/5 relative">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                                    {/* Quick Actions */}
                                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="size-8 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center hover:bg-rasta-red transition-colors shadow-lg">
                                            <Heart size={14} />
                                        </button>
                                        <ShareButton 
                                            item={{
                                                type: 'product_share',
                                                title: product.name,
                                                image: product.image,
                                                data: product
                                            }}
                                            className="size-8 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center hover:bg-rasta-green transition-colors shadow-lg"
                                        />
                                    </div>
                                    <button className="absolute bottom-2 right-2 size-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:bg-rasta-yellow transition-colors translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300">
                                        <ShoppingBag size={18} />
                                    </button>
                                </div>

                                <div>
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-sm leading-tight pr-1 line-clamp-2 group-hover:text-rasta-green">{product.name}</h4>
                                        <span className="font-bold text-sm">{product.price}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-1.5 overflow-hidden">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <img src={getVendorAvatar(product.artisan)} className="size-4 rounded-full object-cover" />
                                            <p className="text-[10px] text-foreground/60 truncate">By {product.artisan}</p>
                                        </div>
                                        <ShareButton 
                                            item={{
                                                type: 'product_share',
                                                title: product.name,
                                                image: product.image,
                                                data: product
                                            }}
                                            className="text-foreground/20 hover:text-foreground"
                                        />
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
