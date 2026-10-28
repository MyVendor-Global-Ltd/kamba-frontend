# Kamba Frontend Debugging Progress

## Repositories and checkpoint

- Frontend: `https://github.com/MyVendor-Global-Ltd/kamba-frontend`, branch `fix/expo-runtime-stability`.
- Backend inspected read-only: `https://github.com/MyVendor-Global-Ltd/Kamba`, HEAD `e5fb5b86ab1f03ec952994d9ef8be8b677e48915`. No backend files were modified.
- Latest pushed frontend checkpoint before current code work: `33cfb46 docs: record fetched branch and backend API audit`.
- Current frontend edits are not yet committed/pushed as of this note. Review/commit/push after final checks.

## Work completed in the current continuation

1. Audited the fetched remote route commit `c3fc451`. It adds onboarding/username/phone/OTP routes, notifications/orders routes, and Search as a fifth tab. The referenced auth screens use mocked availability/OTP/success state; Notifications/Orders/Search are static placeholders. I removed the mock-only Username/PhoneVerify/OTP stack routes from active auth navigation and restored the existing four bottom tabs. Search is a root stack route and Home's Search entry opens it. Do not treat placeholder catalog data or these static screens as implemented backend features.
2. Replaced stale API configuration/helpers in `src/utils/api.js` with the backend's `/api/v1` prefix, credentialed cookie requests, login/register/logout/refresh/dashboard and actual OTP/forgot/reset/username-availability paths. The API host may be supplied by `EXPO_PUBLIC_API_URL`; the old default host still needs deployment confirmation.
3. Wired email Login and Register to the documented backend endpoints. Removed mock local auth token success. Store returned profile data; show API/network failures in the form. Registration username availability now queries the real backend endpoint rather than a hardcoded denylist.
4. Phone login now fails closed with a clear message and does not route to a fake OTP screen. Google sign-in no longer fabricates success and explicitly says a frontend OAuth callback is required.
5. Root auth bootstrap now checks the cookie-protected dashboard endpoint instead of trusting local mock tokens. Profile displays the stored user instead of invented “student/verified/member since” data and calls backend logout before clearing state.
6. Fresh preview found and fixed an additional startup crash in `OnboardingScreen.jsx`: nonexistent `typography.sizes.sm/base` entries are replaced with existing `typography.scale.bodySmall/bodyMedium` tokens.
7. Fixed nested navigation success handling in Login/Register so a successful auth routes to Main through the root stack, not a nonexistent Main route in the Auth stack.

## Verification completed

- Babel parser checks passed for all changed JavaScript/JSX files; `git diff --check` passed.
- `npx expo export --platform web --output-dir /tmp/kamba-auth-export-final` passed and produced a web bundle.
- Fresh Expo preview restarted on port 8081. It reached Welcome with no JavaScript console error after the onboarding repair. Registration and email Login screens rendered without submitting personal/account data. Guest browsing reached Home; Discover tab rendered; Home Search opened its Search root route; all four tabs remained visible. Phone Send Code showed the unsupported-backend message and did not request/send an OTP.
- Expo Doctor still returns 18/20 checks. Remaining pre-existing findings: `app.json` contains unsupported `splash` config property, and installed patch versions differ from Expo's expected versions: expo `58.0.19` vs `~58.0.21`, expo-font `58.0.10` vs `~58.0.11`, expo-linking `58.0.14` vs `~58.0.15`, expo-splash-screen `58.0.11` vs `~58.0.12`. No dependency or Expo configuration changes were made.
- Web Animated emits the known warning that `useNativeDriver` is unsupported on web and falls back to JS animation.
- Real account/login/logout calls were not submitted. No live backend connectivity, CORS, cookie persistence, native-device behavior, or authenticated session was verified.

## Backend contract and blockers

Backend sources reviewed include README, app entrypoint, auth routes/controllers/services, OTP service/controller, cookie middleware, vendor routes, and public stores/services. Implemented contracts include:

- `POST /api/v1/auth/register`: email, password, `confirm_password`, username, optional referral_code; returns user id/email/username and sets HttpOnly access/refresh cookies.
- `POST /api/v1/auth/login`: email/password; sets HttpOnly cookies, returns user id/email/username.
- `POST /api/v1/auth/logout`; `POST /api/v1/auth/refresh`; cookie-authenticated `GET /api/v1/auth/dashboard`.
- `GET /api/v1/auth/username-availability?username=...`.
- OTP request/verify routes use `userId`, `purpose`, `endpoint` / `inputOtp`; verification alone does not persist phone verification.
- Public `GET /api/v1/vendors/stores` and `/services` list paginated data; details are slug-based.

The checked-in backend does not expose phone-login, username claim, catalog product search, checkout/order/payment, notifications, favorites, or address endpoints. Google is a GET redirect OAuth route, but frontend callback/redirect configuration is not established. Do not invent successful integrations for missing endpoints.

A read-only request to `https://api.kamba.ng/health` failed with DNS `Could not resolve host: api.kamba.ng`. The checked-in backend `src/index.js` has no CORS middleware. Credentialed web auth therefore cannot be called live-working until the correct host resolves and deployment/proxy CORS permits credentialed requests from the frontend. Confirm the correct public API origin and cross-origin cookie policy with the user/backend owner if needed.

## Next steps

1. Finish source review, commit/push the current validated frontend code promptly to the existing branch (never force-push), then verify clean status and remote tip.
2. Do not submit real registration/login/logout while the host/DNS/CORS configuration is unverified. A browser/web export proves startup only, not backend auth.
3. Catalog Home/Discover/Search still show fake local fixtures/static copy. If continuing, replace only with verified public store/service catalog endpoints and handle offline/empty/error states; never pass numeric fixture IDs into slug routes.
4. Search, Notifications, Orders, checkout, payment/address, favorites, password recovery, Google callback, and phone verification remain incomplete or unsupported as detailed above.
5. Expo Doctor warnings listed above remain. Native Android/iOS/Expo Go were not tested.
