import { DateTime } from "luxon";

/**
 * Convert ISO / Date / string to DD/MM/YYYY
 * Default timezone: Asia/Kolkata (IST)
 */
export function formatDate(
  input: string | Date | null | undefined,
  options?: {
    format?: string;
    zone?: string;
    fallback?: string;
  },
): string {
  if (!input) return options?.fallback ?? "-";

  const format = options?.format ?? "dd/MM/yyyy";
  const zone = options?.zone ?? "Asia/Kolkata";

  const dt =
    input instanceof Date
      ? DateTime.fromJSDate(input, { zone })
      : DateTime.fromISO(input.toString(), { zone });

  return dt.isValid ? dt.toFormat(format) : (options?.fallback ?? "-");
}
