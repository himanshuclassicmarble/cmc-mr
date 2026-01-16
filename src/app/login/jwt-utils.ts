/**
 * Utility functions to extract JWT claims for authentication
 */

interface JWTClaims {
  sub?: string;
  email?: string;
  is_active?: boolean;
  role?: string;
  aud?: string;
  exp?: number;
  iat?: number;
}

/**
 * Decode JWT token and extract claims
 * Note: This does NOT verify the signature - Supabase handles that at the request level
 */
export function decodeJWT(token: string): JWTClaims | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = JSON.parse(
      Buffer.from(payload, "base64").toString("utf-8"),
    );

    return decoded as JWTClaims;
  } catch (error) {
    console.error("[JWT] Failed to decode token:", error);
    return null;
  }
}

/**
 * Extract JWT from Authorization header
 */
export function extractJWTFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}

/**
 * Get user claims from authorization header
 */
export function getUserClaimsFromHeader(
  authHeader: string | null,
): JWTClaims | null {
  const token = extractJWTFromHeader(authHeader);
  if (!token) return null;

  return decodeJWT(token);
}
