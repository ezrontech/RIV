"use client";

import { MOCK_ARTICLES } from "@/lib/mock-data";
import { Calendar, User } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";

import { useState } from "react";

export default function ArticlesPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredArticles = MOCK_ARTICLES.filter(a =>
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
                    <article key={article.id} className="flex flex-col gap-4 group cursor-pointer border-b border-foreground/5 pb-8 last:border-0">
                        <div className="aspect-[2/1] w-full rounded-2xl overflow-hidden bg-foreground/5">
                            <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-4 text-xs font-bold text-foreground/40 uppercase tracking-wide">
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} /> {article.date}
                                </div>
                                <div className="flex items-center gap-1">
                                    <User size={12} /> {article.author}
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold group-hover:text-rasta-red transition-colors leading-tight">{article.title}</h2>
                            <p className="text-foreground/70 leading-relaxed line-clamp-2">{article.excerpt}</p>

                            <div className="mt-2 text-rasta-green font-bold text-sm group-hover:underline">Read Story →</div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
