import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, LifeBuoy } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border pb-6 mb-12">
          <Image
            src="/images/cmc-logo.png"
            alt="Classic Marble Company"
            width={140}
            height={40}
            className="h-10 p-1 bg-white w-auto object-contain"
            priority
          />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Error 404
          </span>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Content */}
          <section className="lg:col-span-7">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Page not found
            </h1>

            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
              The requested page does not exist or may have been moved. Please
              use the options below to continue.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="sm">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>

              <Button asChild variant="outline" size="sm">
                <Link href="/contact">
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </section>

          {/* Right Links */}
          <aside className="lg:col-span-5 lg:border-l border-border lg:pl-10">
            <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
              Useful Links
            </h2>

            <nav className="space-y-2">
              {[
                { title: "Stone Collections", href: "/collections" },
                { title: "Projects", href: "/projects" },
                { title: "Technical Details", href: "/technical" },
                { title: "About Company", href: "/about" },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 border border-border hover:bg-muted transition"
                >
                  <span className="text-sm font-medium">{item.title}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </nav>
          </aside>
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-border text-xs text-muted-foreground flex justify-between">
          <span>© {new Date().getFullYear()} Classic Marble Company</span>
          <span>All rights reserved</span>
        </footer>
      </div>
    </div>
  );
}
