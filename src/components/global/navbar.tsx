import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { ProfilePopover } from "./profile-popover";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/data/current-profile";
import { LayoutDashboard } from "lucide-react";

export default async function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 mx-auto h-16 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg transition-transform group-hover:scale-105">
              <LayoutDashboard size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold tracking-tighter uppercase">
                cmc
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">
                Inventory
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/mrm"
              className="px-3 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            >
              Requests
            </Link>
            <Link
              href="/material-master"
              className="px-3 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            >
              Materials
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center pr-2 mr-2 border-r border-border gap-2">
            <ModeToggle />
          </div>

          <ProfilePopover />
        </div>
      </div>
    </header>
  );
}
