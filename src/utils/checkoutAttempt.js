export function getCheckoutAttempt(payload, previousAttempt = null) {
  const signature = JSON.stringify(payload);
  if (previousAttempt?.signature === signature && previousAttempt?.key) {
    return previousAttempt;
  }
  const randomId = globalThis.crypto?.randomUUID?.()
    || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return {
    signature,
    key: `kamba-checkout-${randomId}`,
  };
}
