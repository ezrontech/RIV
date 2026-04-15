"use client";

import { Calendar, User, Share2 } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShareButton } from "@/components/ui/share-button";

export default function ArticlesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [articles, setArticles] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.from('articles').select('*');
            if (data) setArticles(data);
        };
        fetchData();
    }, []);

    const filteredArticles = articles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <SearchBar
                placeholder="Search stories & news..."
                value={searchQuery}
                onChange={setSearchQuery}
            />

            <div className="p-6 grid gap-8">
                {filteredArticles.map((article) => (
                    <article key={article.id} className="flex flex-col gap-4 group border-b border-foreground/5 pb-8 last:border-0">
                        <div className="aspect-[2/1] w-full rounded-2xl overflow-hidden bg-foreground/5 relative cursor-pointer">
                            <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ShareButton 
                                    item={{
                                        type: 'article_share',
                                        title: article.title,
                                        image: article.image,
                                        data: {
                                            title: article.title,
                                            excerpt: article.excerpt,
                                            image: article.image,
                                            author: article.author,
                                            date: article.date
                                        }
                                    }}
                                    className="p-3 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-rasta-green transition-colors shadow-xl"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs font-bold text-foreground/40 uppercase tracking-wide">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} /> {article.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User size={12} /> {article.author}
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold group-hover:text-rasta-red transition-colors leading-tight cursor-pointer">{article.title}</h2>
                            <p className="text-foreground/70 leading-relaxed line-clamp-2">{article.excerpt}</p>

                            <div className="mt-2 flex justify-between items-center">
                                <span className="text-rasta-green font-bold text-sm group-hover:underline cursor-pointer">Read Story →</span>
                                <ShareButton 
                                    item={{
                                        type: 'article_share',
                                        title: article.title,
                                        image: article.image,
                                        data: {
                                            title: article.title,
                                            excerpt: article.excerpt,
                                            image: article.image,
                                            author: article.author,
                                            date: article.date
                                        }
                                    }}
                                    showLabel
                                    className="text-foreground/40 hover:text-foreground"
                                />
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
