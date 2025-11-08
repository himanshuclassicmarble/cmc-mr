"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  const routes = [
    {
      title: "MR Request Screen",
      description: "List the Material Request",
      href: "/mr-menu/mr-request",
    },
    {
      title: "Material Master",
      description: "View and manage existing material master.",
      href: "/mr-menu/material-master",
    },
    {
      title: "User Screen",
      description: "List and Create User.",
      href: "/mr-menu/user-screen",
    },
  ];

  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-16 px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Material Management Portal
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage, create, and track materials efficiently
        </p>
        <Separator className="mt-6 w-24 mx-auto bg-border" />
      </div>

      {/* Grid of Links */}
      <div className="grid w-full max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {routes.map((route) => (
          <Link
            href={route.href}
            key={route.href}
            className="group block focus:outline-none focus:ring-2 focus:ring-ring rounded-2xl transition"
          >
            <Card className="h-full border border-border bg-card hover:bg-accent/10 hover:shadow-md transition-all duration-200 rounded-2xl">
              <CardHeader className="flex flex-col justify-between h-full space-y-4 p-6">
                <div>
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {route.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-2 leading-relaxed">
                    {route.description}
                  </CardDescription>
                </div>
                <div className="flex justify-end">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
