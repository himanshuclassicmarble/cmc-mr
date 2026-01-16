import * as jose from "jose";
import type { NextRequest } from "next/server";

export type JwtUserPayload = {
  email: string | null;
  fullName: string | null;
  isActive: boolean;
  role: string | null;
};

export function getJwtUserPayloadFromRequest(
  request: NextRequest,
): JwtUserPayload | null {
  const authCookie = request.cookies
    .getAll()
    .find((c) => c.name.includes("-auth-token"));

  if (!authCookie) return null;

  try {
    let raw = decodeURIComponent(authCookie.value);

    if (raw.startsWith("base64-")) {
      raw = atob(raw.slice(7)); // ✅ Edge-safe (NO Buffer)
    }

    const parsed = JSON.parse(raw);
    const session = Array.isArray(parsed) ? parsed[0] : parsed;
    const jwt = session?.access_token;

    if (!jwt) return null;

    const payload = jose.decodeJwt(jwt);

    return {
      email: typeof payload.email === "string" ? payload.email : null,
      fullName:
        typeof payload.user_metadata?.full_name === "string"
          ? payload.user_metadata.full_name
          : null,
      isActive: payload.is_active === true,
      role: typeof payload.role === "string" ? payload.role : null,
    };
  } catch {
    return null;
  }
}
