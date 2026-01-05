import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/mr-menu/mr-request-v3");
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access the Material Request System
          </p>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Continue
            </span>
          </div>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer hint (optional) */}
        <p className="text-center text-xs text-muted-foreground">
          Authorized personnel only
        </p>
      </div>
    </main>
  );
}
