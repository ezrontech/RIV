import { User } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface AvatarProps {
    user: User;
    className?: string;
}

export function Avatar({ user, className }: AvatarProps) {
    const isImage = user.avatar.startsWith("http") || user.avatar.startsWith("/");

    if (isImage) {
        return (
            <div className={cn("size-10 rounded-full overflow-hidden shrink-0 border border-foreground/10", className)}>
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
        );
    }

    return (
        <div className={cn("size-10 rounded-full flex items-center justify-center text-background font-bold text-sm overflow-hidden shrink-0", user.avatar, className)}>
            {user.name.charAt(0)}
        </div>
    );
}
