import { getCurrentProfile } from "@/lib/data/current-profile";
import { ChangePassForm } from "./change-pass-form";

const ChangePassword = async () => {
  const profile = await getCurrentProfile();

  return (
    <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Change your password
          </h1>
          <p className="text-sm text-muted-foreground">
            Update your account credentials securely
          </p>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Security
            </span>
          </div>
        </div>

        <ChangePassForm email={profile?.email} />

        <p className="text-center text-xs text-muted-foreground">
          Use a strong password you haven’t used before
        </p>
      </div>
    </main>
  );
};

export default ChangePassword;
