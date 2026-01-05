import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LogOut, User, Building2, ShieldCheck, Mail } from "lucide-react";
import { getCurrentProfile } from "@/lib/data/current-profile";
import Link from "next/link";
import { UserFormSchema } from "@/app/user-screen/components/schema";

export function ProfilePopover({ profile }: { profile: UserFormSchema }) {
  if (!profile) return null;

  const initials = profile.userName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full border border-border hover:bg-muted"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0 shadow-xl border-border" align="end">
        {/* Header Section */}
        <div className="bg-primary/5 p-4 flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-background shadow-sm shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            {" "}
            {/* min-w-0 is crucial for truncate */}
            <h4 className="font-bold text-sm leading-tight truncate">
              {profile.userName}
            </h4>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1 truncate">
              <Mail className="h-3 w-3 shrink-0" />
              <span className="truncate">{profile.email}</span>
            </span>
          </div>
        </div>

        <Separator />

        {/* Info Grid */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="space-y-0.5 min-w-0">
              <p className="uppercase font-bold text-muted-foreground tracking-wider">
                Emp Code
              </p>
              <p className="font-medium truncate">{profile.empCode}</p>
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="uppercase font-bold text-muted-foreground tracking-wider">
                Role
              </p>
              <Badge
                variant="secondary"
                className="font-semibold uppercase text-[9px] h-4 px-1"
              >
                {profile.role}
              </Badge>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 text-xs min-w-0">
              <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="font-medium truncate">{profile.department}</span>
              <span className="text-muted-foreground shrink-0">•</span>
              <span className="text-muted-foreground truncate">
                {profile.plant}
              </span>
            </div>
            {profile.role === "admin" && (
              <div className="flex items-center gap-2 text-[11px] text-green-600 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span>Admin Privileges Active</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Actions Section */}
        <div className="p-1 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-xs h-8"
            asChild
          >
            <Link href="/profile">
              <User className="mr-2 h-3.5 w-3.5" />
              Profile
            </Link>
          </Button>

          {/* Form wrapper to trigger the Server Action */}
        </div>
      </PopoverContent>
    </Popover>
  );
}
