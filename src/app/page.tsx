"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ArrowRight,
  Menu,
  X,
  FileText,
  Package,
  Users,
  Home,
} from "lucide-react";

export default function HomePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const routes = [
    {
      title: "Material Request Master",
      description: "List the Material Request",
      href: "/mrm",
      icon: FileText,
    },
    {
      title: "MM Material Master",
      description: "List the Material Master",
      href: "/material-master",
      icon: Package,
    },
    {
      title: "User Screen",
      description: "View Users",
      href: "/user-screen",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Link
                href={route.href}
                key={route.href}
                className="group block focus:outline-none focus:ring-2 focus:ring-ring rounded-2xl transition"
              >
                <Card className="h-full border border-border bg-card hover:bg-accent/10 hover:shadow-md transition-all duration-200 rounded-2xl">
                  <CardHeader className="flex flex-col justify-between h-full space-y-4 p-6">
                    <div className="flex items-start gap-3">
                      <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {route.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground mt-2 leading-relaxed">
                          {route.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
