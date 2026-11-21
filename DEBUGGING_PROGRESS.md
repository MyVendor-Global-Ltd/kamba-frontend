# Kamba Mobile + Backend Integration Checkpoint

**Last reconciled:** 2026-11-21  
**Priority:** mobile app and backend. The Next.js website is secondary.

This file replaces older integration notes that referred to a smaller backend API. Those notes are historical and must not be used as the current API contract.

## Repositories

- Backend: https://github.com/MyVendor-Global-Ltd/Kamba
- Mobile: https://github.com/MyVendor-Global-Ltd/kamba-frontend
- Website: https://github.com/MyVendor-Global-Ltd/Kamba-website

## Authoritative API contract

The backend file `docs/WORKFLOWS_AND_SECURITY.md` is the shared, living workflow/security contract for mobile and Next.js:

https://github.com/MyVendor-Global-Ltd/Kamba/blob/main/docs/WORKFLOWS_AND_SECURITY.md

It records routes, role gates, ownership requirements, request fields, server-side decisions, state transitions, security cases, mobile integration status and known gaps. Feature-specific documents such as `docs/DELIVERY_API.md`, `docs/SERVICE_BOOKINGS_API.md` and `docs/COMMERCE_API.md` provide additional detail.

**Update the backend workflow contract in the same PR whenever an API request, response, route, role rule or state transition changes.** Do not create a competing mobile-only API contract. A route/helper existing is not proof that the whole user flow works.

## Backend hosting and API origin

The backend is **not currently hosted**. `https://api.kamba.ng` is not a verified live backend address and must not be treated as one.

- Mobile reads `EXPO_PUBLIC_API_URL` from its environment. The API client appends `/api/v1`.
- Website reads `NEXT_PUBLIC_API_URL` from its environment. Its API client uses the configured origin.
- Backend uses `PORT`, `FRONTEND_URL` and `CORS_ORIGINS` for server listening and browser origin policy.
- Both clients should receive the same backend origin when deployed, but each runtime has its own environment setting and needs its own rebuild/redeployment when that setting changes.
- Never put secrets in `EXPO_PUBLIC_*` or `NEXT_PUBLIC_*` variables.

### Local mobile development

The mobile `.env.example` uses:

```dotenv
EXPO_PUBLIC_API_URL=http://localhost:9001
```

For Android:
- Emulator: `http://10.0.2.2:9001`
- Physical Android device: `http://<development-computer-LAN-IP>:9001` while both devices share the same Wi-Fi/hotspot.

The backend defaults to port 9001. A physical phone's `localhost` is the phone itself, not the laptop.

### Deployment sequence

1. Host the backend and configure its database, Redis (if required), Supabase storage and server-only secrets.
2. Apply database migrations.
3. Verify `GET /health` on the deployed backend.
4. Set the deployed origin in the Expo/EAS `EXPO_PUBLIC_API_URL` environment and the website `NEXT_PUBLIC_API_URL` environment.
5. Configure backend `FRONTEND_URL`/`CORS_ORIGINS` for the exact website origin.
6. Rebuild/redeploy clients and run authenticated Android/browser smoke tests.

A successful Expo export or CI run proves the client bundle builds; it does not prove the backend is hosted or reachable.

## Current mobile implementation checkpoint

The mobile app is connected to these backend workflows:

| Workflow | Current status |
|---|---|
| Email registration/login, session refresh/logout, dashboard profile | Connected to documented auth endpoints; native cookie/session behavior still needs real-device verification |
| Saved buyer location | Foreground GPS, manual text fallback, GET/POST/DELETE saved-location endpoints |
| Nearby store discovery | Uses saved coordinates when available; public browsing remains available without a saved location |
| Product discovery | Uses `GET /commerce/products`; category/search/nearby query parameters are supported |
| Store search | Searches loaded public stores and applies saved-location filtering when available |
| Product detail and cart | Connected to public product detail and buyer cart endpoints |
| Checkout/order history/order detail | Connected to server-authoritative checkout and order endpoints; cart remains single-store |
| Delivery locations/quotes | Connected to university, zone and quote endpoints |
| Delivery provider | Application, availability, offers, accept/decline, pickup/transit/handover evidence and earnings are connected; physical-device testing remains |
| Service bookings | Discovery, booking/quotation requests, vendor quotes, buyer quote response, payment initialization, vendor scheduling/work progression and buyer completion confirmation are connected |
| Service payment complaints | Buyer complaint creation is connected; backend admin resolution endpoint exists, but an admin mobile UI is not connected |
| Saved products | Favorites list, save/remove product actions use buyer-authenticated wishlist endpoints |
| Store follows | Store detail follow/unfollow uses buyer-authenticated endpoints |

### Important payment truth

The backend payment-provider adapter is not configured for production. Checkout/payment flows must fail safely when the provider is unavailable. Do not report a payment as paid, held in a regulated escrow arrangement, released, refunded or transferred unless the backend has verified the provider's final status.

The service-payment UI must display the backend's actual status. A provider response of `pending` means settlement is still pending; it is not `released`.

## Confirmed recent work

Merged and validated:
- Mobile PR #27: Search uses saved location for nearby shop results.
- Mobile PR #28: removed the unverified production API-host fallback; Expo export uses a local placeholder.
- Mobile PR #29: service-payment screen no longer invents a released state when provider settlement is pending.
- Mobile PR #30: mobile wishlist and store-follow integration.
- Backend PR #51: documented environment-driven API origin and contract ownership.

Backend CI on main passed the PostgreSQL 16 + Redis test job, migrations and Vitest suite. Mobile PR CI passed backend-response contract tests, Expo Doctor and Android bundle export for the merged changes.

Website PR #9 contains the small API-origin environment configuration change; it is secondary and should not distract from backend/mobile integration.

## Remaining work recorded by the backend contract

High-priority implementation gaps:
1. **Multi-vendor checkout:** current cart/checkout is restricted to one store. Parent checkout, vendor order groups and compatible delivery/payment allocation are not implemented.
2. **Production payments and settlement:** configure and verify an approved provider adapter, webhook signatures, final payment/refund/transfer states, recipient management and reconciliation. Keep settlement disabled until the actual provider arrangement is approved and verified.
3. **Delivery operations:** provider capacity, university/zone operating hours, cutoff enforcement and route compatibility need stronger configuration-backed enforcement.
4. **Live tracking and notifications:** live GPS/route tracking and proactive buyer delay notifications are not implemented. Photo evidence is not live tracking.
5. **Service-payment admin interface:** buyer complaint creation and backend resolution exist, but an admin resolution UI and physical-device/provider-sandbox verification remain.
6. **Reviews:** backend public review listing and verified-purchase review creation exist; mobile review display and submission remain to be connected.
7. **Notifications:** current mobile Notifications screen explicitly says it is not connected; do not show fake alerts.
8. **Delivery evidence dependencies:** create the private Supabase `delivery-evidence` bucket, configure the dedicated `DELIVERY_HANDOVER_CODE_SECRET`, and test upload permissions/signed URL expiry.
9. **Physical-device verification:** test GPS permission denial/manual location, authentication cookie persistence, camera/photo evidence, upload retry, buyer/provider handover and checkout against a configured provider sandbox.
10. **Multi-role/security testing:** broaden buyer/vendor/provider/admin ownership tests, state-transition concurrency tests and privacy checks.

## Working rules for the next continuation

1. Inspect current main and open PRs before editing; do not revive stale feature branches without comparing them to main.
2. Backend first: confirm route, controller, service, migration and tests; then update `docs/WORKFLOWS_AND_SECURITY.md`.
3. Align the mobile API wrapper and screens to the exact backend contract. Do not create mock success or local authoritative prices/statuses.
4. Use feature branches and PRs. Run the repository CI and fix failures before merging.
5. Do not claim deployment, provider settlement, physical-device verification or feature completion without evidence.
6. Keep the website secondary until the mobile/backend workflows are stable.
