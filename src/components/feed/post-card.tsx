import { Post } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/avatar";
import { Heart, MessageCircle, Repeat, Share, Play, ShoppingBag, Calendar, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollLeft = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const renderContent = () => {
        switch (post.type) {
            case 'poll':
                return (
                    <div className="mt-3 flex flex-col gap-2">
                        {post.pollOptions?.map(opt => {
                            const percentage = Math.round((opt.votes / (post.pollTotalWrites || 1)) * 100);
                            return (
                                <div key={opt.id} className="relative h-10 rounded-lg bg-foreground/5 overflow-hidden flex items-center px-4 cursor-pointer hover:bg-foreground/10 transition-colors group">
                                    <div className="absolute top-0 left-0 h-full bg-rasta-yellow/20 transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                                    <span className="relative z-10 font-bold text-sm w-full flex justify-between">
                                        <span>{opt.label}</span>
                                        <span className="text-foreground/60">{percentage}%</span>
                                    </span>
                                </div>
                            )
                        })}
                        <div className="text-xs text-foreground/40 font-medium px-1 mt-1">{post.pollTotalWrites} votes • 2 days left</div>
                    </div>
                );

            case 'carousel':
                return (
                    <div className="group/carousel relative w-full max-w-full">
                        <div
                            ref={carouselRef}
                            className="mt-3 flex overflow-x-auto gap-2 no-scrollbar snap-x pb-2 scroll-smooth w-full"
                        >
                            {post.images?.map((img, idx) => (
                                <div key={idx} className="shrink-0 w-[240px] md:w-[280px] aspect-[4/5] rounded-xl overflow-hidden bg-foreground/5 snap-center border border-foreground/5 relative first:ml-0">
                                    <img src={img} className="w-full h-full object-cover" alt={`Slide ${idx}`} />
                                </div>
                            ))}
                        </div>
                        {/* Scroll Controls */}
                        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background/50 to-transparent z-10 flex items-center justify-start pl-2 pointer-events-none">
                            <button
                                onClick={scrollLeft}
                                className="p-2 rounded-full bg-black/50 backdrop-blur text-white hover:bg-rasta-red transition-colors pointer-events-auto shadow-lg"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        </div>
                        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background/50 to-transparent z-10 flex items-center justify-end pr-2 pointer-events-none">
                            <button
                                onClick={scrollRight}
                                className="p-2 rounded-full bg-black/50 backdrop-blur text-white hover:bg-rasta-red transition-colors pointer-events-auto shadow-lg"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                );

            case 'video_share':
                const video = post.sharedData;
                if (!video) return null;
                return (
                    <div className="mt-3 rounded-xl border border-foreground/10 overflow-hidden bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer group">
                        <div className="aspect-video relative">
                            <img src={video.thumbnail} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="size-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white group-hover:scale-110 transition-transform"><Play size={18} fill="currentColor" /></div>
                            </div>
                        </div>
                        <div className="p-3">
                            <h4 className="font-bold text-sm line-clamp-1">{video.title}</h4>
                            <div className="text-xs text-foreground/60 mt-0.5">{video.channel.name} • {video.views}</div>
                        </div>
                    </div>
                );

            case 'product_share':
                const product = post.sharedData;
                if (!product) return null;
                return (
                    <div className="mt-3 rounded-xl border border-foreground/10 overflow-hidden bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer flex gap-3 p-3 items-center group">
                        <div className="size-16 rounded-lg bg-white overflow-hidden shrink-0">
                            <img src={product.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <div className="text-[10px] font-bold text-rasta-green uppercase tracking-wide mb-0.5">Shop</div>
                            <h4 className="font-bold text-sm line-clamp-1">{product.name}</h4>
                            <div className="text-xs text-foreground/60">{product.artisan}</div>
                        </div>
                        <button className="px-3 py-1.5 bg-foreground text-background text-xs font-bold rounded-full group-hover:bg-rasta-yellow group-hover:text-black transition-colors">
                            {product.price}
                        </button>
                    </div>
                );

            case 'event_share':
                const event = post.sharedData;
                if (!event) return null;
                return (
                    <div className="mt-3 rounded-xl border border-foreground/10 overflow-hidden bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex flex-col group">
                        <div className="h-24 relative overflow-hidden">
                            <img src={event.image} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 bg-white/90 text-black text-xs font-bold px-2 py-1 rounded shadow-sm">{event.date}</div>
                        </div>
                        <div className="p-3">
                            <div className="text-[10px] font-bold text-rasta-red uppercase tracking-wide mb-1 flex items-center gap-1"><Calendar size={10} /> Event</div>
                            <h4 className="font-bold text-sm leading-tight">{event.title}</h4>
                            <div className="mt-3 flex justify-between items-center text-xs">
                                <span className="text-foreground/60">{event.spots}</span>
                                <span className="font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">Details <ArrowRight size={12} /></span>
                            </div>
                        </div>
                    </div>
                );

            case 'article_share':
                const article = post.sharedData;
                if (!article) return null;
                return (
                    <div className="mt-3 rounded-xl border border-foreground/10 bg-foreground/5 p-4 cursor-pointer hover:border-foreground/20 transition-all group">
                        <div className="text-[10px] font-bold text-foreground/50 uppercase tracking-wide mb-2 flex items-center gap-1"><BookOpen size={10} /> Read</div>
                        <h3 className="font-bold text-lg leading-tight mb-2 font-serif group-hover:text-rasta-green transition-colors">{article.title}</h3>
                        <p className="text-sm text-foreground/70 line-clamp-2 italic border-l-2 border-foreground/20 pl-3">{article.excerpt}</p>
                    </div>
                )

            default:
                // Standard Image
                if (post.image) {
                    return (
                        <div className="mt-3 relative aspect-video w-full overflow-hidden rounded-xl border border-foreground/5 bg-foreground/5">
                            <img
                                src={post.image}
                                alt="Post attachment"
                                className="object-cover size-full hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    );
                }
                return null;
        }
    }

    return (
        <div className="flex gap-4 p-4 border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors">
            <div className="flex flex-col items-center gap-2">
                <Avatar user={post.user} />
                {/* Vertical line connecting posts in a thread (visual only for now) */}
                <div className="w-0.5 grow bg-foreground/10 my-2 rounded-full"></div>
            </div>

            <div className="flex-1 min-w-0 space-y-2 pb-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-base">{post.user.username}</span>
                        {post.user.role === 'elder' && (
                            <span className="px-1.5 py-0.5 rounded-full bg-rasta-yellow/20 text-rasta-yellow text-[10px] font-bold uppercase tracking-wide border border-rasta-yellow/30">
                                Elder
                            </span>
                        )}
                        <span className="text-foreground/40 text-sm">{post.timestamp}</span>
                    </div>
                    <button className="text-foreground/40 hover:text-foreground">
                        <div className="size-1 rounded-full bg-current shadow-[4px_0_0_current, -4px_0_0_current]"></div>
                    </button>
                </div>

                {/* Content */}
                <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-[15px]">
                    {post.content}
                </p>

                {/* Dynamic Content (Poll, Media, Shared) */}
                {renderContent()}

                {/* Actions */}
                <div className="flex items-center gap-6 mt-3 text-foreground/60">
                    <button className="flex items-center gap-1.5 hover:text-rasta-red transition-colors group">
                        <Heart size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">{post.likes}</span>
                    </button>

                    <button className="flex items-center gap-1.5 hover:text-rasta-yellow transition-colors group">
                        <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">{post.replies}</span>
                    </button>

                    <button className="flex items-center gap-1.5 hover:text-rasta-green transition-colors group">
                        <Repeat size={18} className="group-hover:scale-110 transition-transform" />
                    </button>

                    <button className="flex items-center gap-1.5 hover:text-foreground transition-colors group ml-auto">
                        <Share size={18} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
