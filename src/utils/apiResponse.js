export function responsePayload(response) {
  // The Express handler returns { success: true, ...serviceResult }.
  // Accept the older { success: true, result: serviceResult } shape as well.
  return response?.data?.result ?? response?.data ?? null;
}
