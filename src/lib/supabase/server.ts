import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { CookieOptions } from "@supabase/ssr";

/* -------------------------------------------------------------------------- */
/*                              Env Validation                                */
/* -------------------------------------------------------------------------- */

function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase env missing: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

/* -------------------------------------------------------------------------- */
/*                         Server-side Supabase Client                          */
/* -------------------------------------------------------------------------- */

export async function createSupabaseServerClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  const cookieStore = await cookies(); // ✅ FIXED

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },

      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(
            ({
              name,
              value,
              options,
            }: {
              name: string;
              value: string;
              options?: CookieOptions;
            }) => {
              cookieStore.set(name, value, options);
            },
          );
        } catch (error) {
          console.error(
            "[Supabase][ServerClient] Failed to set cookies",
            error,
          );
          /**
           * This can fail in:
           * - Server Components
           * - Static rendering
           * Middleware will still handle cookies correctly
           */
        }
      },
    },
  });
}
