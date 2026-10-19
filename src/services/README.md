# Mobile API services

This directory is reserved for client-side adapters to Kamba's versioned backend API. It must not contain SQL clients, direct database connections, privileged credentials, or payment-provider secrets.

Planned modules: `httpClient.js` (base URL, request timeout, auth header, normalized errors), `authService.js`, `catalogService.js`, `storeService.js`, `orderService.js`, `notificationService.js`, and `uploadService.js`. Each public method should use typed-by-contract JS objects, validate API responses at the boundary, use abortable requests, and surface user-safe errors. Keep secure tokens in the platform secure store; do not persist tokens or personal/order payloads to ordinary AsyncStorage. Add fixtures only through the explicit development seed module under `src/data/seeds/`.
