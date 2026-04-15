import { User } from "@/types/schema";
import { cn } from "@/lib/utils";

interface AvatarProps {
    user: User;
    className?: string;
}

export function Avatar({ user, className }: AvatarProps) {
    if (!user) {
        return (
            <div className={cn("size-10 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 border border-foreground/5", className)}>
                <div className="size-4 rounded-full bg-foreground/20 animate-pulse" />
            </div>
        );
    }

    const avatarUrl = user.avatar || "/riv-logo.webp";
    const isImage = avatarUrl.startsWith("http") || avatarUrl.startsWith("/");

    if (isImage) {
        return (
            <div className={cn("size-10 rounded-full overflow-hidden shrink-0 border border-foreground/10 cursor-pointer", className)}>
                <img src={avatarUrl} alt={user.name || "User"} className="w-full h-full object-cover" />
            </div>
        );
    }

    return (
        <div className={cn("size-10 rounded-full flex items-center justify-center text-background font-bold text-sm overflow-hidden shrink-0 cursor-pointer", avatarUrl, className)}>
            {(user.name || user.username || "?").charAt(0).toUpperCase()}
        </div>
    );
}
