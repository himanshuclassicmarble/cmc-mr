"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function DebugJWT() {
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    supabase.auth.getSession().then(({ data }) => {
      console.log("JWT ACCESS TOKEN:", data.session?.access_token);
    });
  }, []);

  return null;
}
