import { getCurrentProfile } from "@/lib/data/current-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Building2,
  Briefcase,
  Shield,
  Key,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { SignOut } from "./component/sign-out";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-10 space-y-4">
            <XCircle className="mx-auto h-14 w-14 text-destructive/70" />
            <h2 className="text-xl font-semibold">Profile not found</h2>
            <p className="text-sm text-muted-foreground">
              Please login again or contact IT support.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-6 py-10 space-y-8">
        {/* Page Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              View and manage your account details
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/profile/change-password" passHref>
              <Button variant="outline" className="gap-2">
                <Key className="h-4 w-4" />
                Change Password
              </Button>
            </Link>
            <SignOut />
          </div>
        </header>

        {/* Main Card */}
        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="h-7 w-7 text-primary" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{profile.userName}</h2>
                  <Badge
                    variant={profile.isActive ? "default" : "secondary"}
                    className="gap-1"
                  >
                    {profile.isActive ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {profile.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground font-mono">
                  Employee Code: {profile.empCode}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <ProfileItem
                icon={<Mail />}
                label="Email"
                value={profile.email}
              />

              <ProfileItem
                icon={<Shield />}
                label="Role"
                value={profile.role}
                highlight
              />

              <ProfileItem
                icon={<Building2 />}
                label="Department"
                value={profile.department}
              />

              <ProfileItem
                icon={<Briefcase />}
                label="Plant"
                value={profile.plant}
              />

              {profile.hod && (
                <ProfileItem
                  icon={<User />}
                  label="Head of Department"
                  value={profile.hod}
                  className="md:col-span-2"
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted bg-muted/40">
          <CardContent className="flex gap-4 py-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Account Security</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Update your password regularly and inform IT if you notice
                unusual account activity.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Reusable Profile Item */
/* ---------------------------------- */
function ProfileItem({
  icon,
  label,
  value,
  highlight = false,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex gap-4 ${className}`}>
      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
        {icon}
      </div>

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p
          className={`text-base font-medium ${highlight ? "text-primary" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
