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
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { SignOut } from "./component/sign-out";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-4">
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
        {/* Page Header */}
        <header className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Profile
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                View and manage your account details
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link
                href="/profile/change-password"
                passHref
                className="w-full sm:w-auto"
              >
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Key className="h-4 w-4" />
                  <span className="hidden sm:inline">Change Password</span>
                  <span className="sm:hidden">Password</span>
                </Button>
              </Link>
              <SignOut />
            </div>
          </div>
        </header>

        {/* Main Profile Card */}
        <Card className="shadow-md border-border/50">
          <CardHeader className="border-b bg-muted/30 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Avatar */}
              <div className="h-16 w-16 sm:h-14 sm:w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-8 w-8 sm:h-7 sm:w-7 text-primary" />
              </div>

              {/* User Info */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-semibold truncate">
                    {profile.userName}
                  </h2>
                  <Badge
                    variant={profile.isActive ? "default" : "secondary"}
                    className="gap-1 w-fit"
                  >
                    {profile.isActive ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {profile.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground font-mono break-all">
                  Employee Code: {profile.empCode}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-x-12 lg:gap-y-8">
              <ProfileItem
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={profile.email}
              />

              <ProfileItem
                icon={<Shield className="h-4 w-4" />}
                label="Role"
                value={profile.role}
                highlight
              />

              <ProfileItem
                icon={<Building2 className="h-4 w-4" />}
                label="Department"
                value={profile.department}
              />

              <ProfileItem
                icon={<Briefcase className="h-4 w-4" />}
                label="Plant"
                value={profile.plant}
              />

              {profile.hod && (
                <ProfileItem
                  icon={<User className="h-4 w-4" />}
                  label="Head of Department"
                  value={profile.hod}
                  className="sm:col-span-2"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Notice Card */}
        <Card className="border-muted bg-gradient-to-br from-muted/40 to-muted/20 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base">
                  Account Security
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Update your password regularly and inform IT if you notice
                  unusual account activity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Card (Optional - Enterprise Enhancement) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Verified Account"
            description="Your account is verified and active"
            variant="success"
          />
          <InfoCard
            icon={<Shield className="h-5 w-5" />}
            title="2FA Enabled"
            description="Two-factor authentication is active"
            variant="primary"
          />
          <InfoCard
            icon={<AlertCircle className="h-5 w-5" />}
            title="Need Help?"
            description="Contact IT support for assistance"
            variant="muted"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Reusable Profile Item Component */
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
    <div className={`flex gap-3 sm:gap-4 ${className}`}>
      <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
        {icon}
      </div>

      <div className="space-y-1 flex-1 min-w-0">
        <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground font-medium">
          {label}
        </p>
        <p
          className={`text-sm sm:text-base font-medium truncate ${
            highlight ? "text-primary" : ""
          }`}
          title={value}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Info Card Component (Enterprise Enhancement) */
/* ---------------------------------- */
function InfoCard({
  icon,
  title,
  description,
  variant = "muted",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: "success" | "primary" | "muted";
}) {
  const variantStyles = {
    success:
      "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900",
    primary: "bg-primary/5 border-primary/20",
    muted: "bg-muted/40 border-muted",
  };

  const iconStyles = {
    success:
      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    primary: "bg-primary/10 text-primary",
    muted: "bg-muted text-muted-foreground",
  };

  return (
    <Card className={`${variantStyles[variant]} shadow-sm border`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex gap-3 items-start">
          <div
            className={`h-9 w-9 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconStyles[variant]}`}
          >
            {icon}
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <h4 className="font-medium text-sm sm:text-base">{title}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
