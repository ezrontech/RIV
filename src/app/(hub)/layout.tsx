import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function CommunityLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Fixed height container, no window scroll
        <div className="flex h-screen bg-background text-foreground max-w-[1920px] mx-auto justify-center overflow-hidden">
            <LeftSidebar />

            {/* Main Content Area -Scrolls independently */}
            <main className="flex-1 min-w-0 border-r border-foreground/5 h-full overflow-y-auto overflow-x-hidden no-scrollbar flex justify-center">
                <div className="w-full max-w-2xl pb-20"> {/* pb-20 for bottom breathing room */}
                    {children}
                </div>
            </main>

            <RightSidebar />
            <MobileNav />
        </div>
    );
}
