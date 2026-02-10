"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    placeholder?: string;
    className?: string;
}

export function SearchBar({ placeholder = "Search RIV...", className }: SearchBarProps) {
    return (
        <div className={cn("sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-foreground/5 p-4", className)}>
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50 group-focus-within:text-rasta-yellow transition-colors" size={20} />
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full bg-foreground/5 border border-foreground/5 rounded-full py-3 pl-12 pr-6 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-1 focus:ring-rasta-yellow/50 transition-all"
                />
            </div>
        </div>
    );
}
