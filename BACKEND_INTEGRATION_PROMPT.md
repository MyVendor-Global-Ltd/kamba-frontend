# Kamba Mobile API Integration Reference

> This file is a client-side pointer and setup note. The authoritative, detailed API contract lives in the backend repository at `docs/WORKFLOWS_AND_SECURITY.md`:
> https://github.com/MyVendor-Global-Ltd/Kamba/blob/main/docs/WORKFLOWS_AND_SECURITY.md
>
> Do not copy an older endpoint list into this file. When a backend route, request, response, role rule or workflow changes, update the backend contract first and align this client to it.

## API origin

Set `EXPO_PUBLIC_API_URL` to the backend **origin only**. The API client appends `/api/v1`.

```dotenv
# Local backend on the same computer (web/local tooling)
EXPO_PUBLIC_API_URL=http://localhost:9001

# Android emulator:
# EXPO_PUBLIC_API_URL=http://10.0.2.2:9001

# Physical Android device:
# EXPO_PUBLIC_API_URL=http://<development-computer-LAN-IP>:9001

# Production:
# EXPO_PUBLIC_API_URL=https://<deployed-backend-origin>
```

The backend is not currently hosted. `https://api.kamba.ng` is not a confirmed live origin and must not be used as a silent fallback. After deployment, set the production value in the Expo/EAS environment and rebuild the app.

## Client integration rules

- All API calls go through `src/utils/api.js`; do not hardcode API hosts in screens.
- Keep the backend as the authority for authentication, roles, ownership, product prices, stock, platform fees, delivery quotes, order/payment status, provider payouts and service-payment state.
- NGN values are integer kobo. Never calculate or submit a client-authoritative payable total.
- Send the documented idempotency header for checkout and other retryable creation/payment operations.
- Handle permission denial and unavailable location without blocking general browsing. Do not claim nearby results when only a text location is saved and no coordinates are available.
- Do not mock a successful login, payment, checkout, order transition, delivery, booking or refund when the backend/provider is unavailable.
- Keep auth cookies/tokens in the existing secure native storage path. Never log credentials or put secrets in Expo public environment variables.
- A route/helper existing is not proof that a screen is connected. Update the backend workflow map's mobile status only after verifying the actual request and response handling.

## Current implementation checkpoints

The backend workflow map records the detailed request/response and security contracts. Current mobile coverage includes authentication, saved location and nearby discovery, catalog/cart/checkout, order/payment actions, delivery-provider operations and the main service-booking/quotation lifecycle. The following remain explicitly unverified or incomplete in that map: live payment-provider configuration and physical-device checkout verification, service-payment dispute/refund and admin resolution UX, full notification flow, reviews/follows/wishlist integration, multi-vendor checkout, and live GPS/batch delivery.

Do not claim these are complete until the backend map, tests and real client flows are updated with evidence.
