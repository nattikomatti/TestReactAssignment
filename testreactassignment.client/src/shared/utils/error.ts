/**
 * Extracts a user-facing error message from an unknown caught value.
 * Handles Axios error shapes (response.data.message / response.data.error)
 * and generic Error objects.
 */
export function extractApiError(e: unknown, fallback = "เกิดข้อผิดพลาด"): string {
  if (typeof e !== "object" || !e) return fallback;
  const err = e as Record<string, any>;
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  );
}
