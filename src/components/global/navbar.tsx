"use client";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { ProfilePopover } from "./profile-popover";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
  Package,
  Layers,
  User,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";
import { UserFormSchema } from "@/app/user-screen/components/schema";
import { cn } from "@/lib/utils"; // Shadcn utility for merging classes
import Image from "next/image";

const NAV_LINKS = [
  { label: "Requests", href: "/mrm", icon: Package },
  { label: "Materials", href: "/material-master", icon: Layers },
  { label: "User Management", href: "/user-screen", icon: User },
];

function NavigationControls() {
  const router = useRouter();
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => router.back()}
        aria-label="Go back"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => router.forward()}
        aria-label="Go forward"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Client component for breadcrumbs
function DynamicBreadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return { href, label, isLast: index === pathSegments.length - 1 };
  });

  if (pathSegments.length === 0) return null;

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center gap-1.5">
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only md:not-sr-only">Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.map((item) => (
          <Fragment key={item.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// 2. Reusable Navigation Link Component
function NavItem({
  href,
  label,
  icon: Icon,
  isMobile = false,
}: {
  href: string;
  label: string;
  icon?: any;
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  if (isMobile) {
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
          isActive
            ? "bg-accent text-accent-foreground"
            : "hover:bg-accent text-muted-foreground",
        )}
      >
        {Icon ? (
          <Icon className="h-5 w-5" />
        ) : (
          <div className="h-5 w-5 rounded-sm bg-muted-foreground/50" />
        )}
        <span className="font-medium">{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-md transition-colors text-sm font-medium whitespace-nowrap",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {label}
    </Link>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetHeader className="hidden">
        <SheetTitle></SheetTitle>
        <SheetDescription></SheetDescription>
      </SheetHeader>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <nav className="flex flex-col gap-2 mt-8 px-3">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-accent"
          >
            <Home className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Home</span>
          </Link>

          {/* Mapping through reusable links */}
          {NAV_LINKS.map((link) => (
            <NavItem key={link.href} {...link} isMobile />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default function Navbar({ user }: { user: UserFormSchema }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-3 sm:px-4 mx-auto h-14 sm:h-16 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <MobileNav />

          <Link
            href="/"
            aria-label="Go to homepage"
            className="group shrink-0 flex items-center"
          >
            <div
              className="
                relative flex items-center justify-center
                rounded-xs
                bg-white text-primary-foreground
                p-1.5
              "
            >
              <Image
                src="/images/cmc-logo.png"
                alt="CMC Logo"
                width={100}
                height={100}
                priority
                className="
                  h-6 w-16
                  object-contain
                  transition-transform duration-300
                  group-hover:rotate-1
                "
              />
            </div>
          </Link>
          {/* Desktop navigation - Mapping through reusable links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavItem key={link.href} {...link} />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="hidden sm:block">
            <NavigationControls />
          </div>
          <div className="flex items-center pr-1.5 sm:pr-2 mr-1.5 sm:mr-2 border-r border-border gap-1.5 sm:gap-2">
            <ModeToggle />
          </div>
          <ProfilePopover profile={user} />
        </div>
      </div>

      {/* Breadcrumbs Sections */}
      <div className="hidden md:block border-t bg-muted/30">
        <div className="w-full px-4 mx-auto h-10 flex items-center gap-3">
          <NavigationControls />
          <div className="h-4 w-px bg-border" />
          <DynamicBreadcrumbs />
        </div>
      </div>

      <div className="md:hidden border-t bg-muted/30">
        <div className="w-full px-3 mx-auto h-9 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <NavigationControls />
          <div className="h-4 w-px bg-border shrink-0" />
          <DynamicBreadcrumbs />
        </div>
      </div>
    </header>
  );
}
