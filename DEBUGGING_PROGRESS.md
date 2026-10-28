# Kamba Frontend Debugging Progress

## Repository and checkpoint

Frontend repository: `https://github.com/MyVendor-Global-Ltd/kamba-frontend`.
Backend repository, inspected read-only: `https://github.com/MyVendor-Global-Ltd/Kamba` (HEAD at inspection: `e5fb5b86ab1f03ec952994d9ef8be8b677e48915`). Backend files have not been modified.

Working branch: `fix/expo-runtime-stability`. The previously tested frontend code is commit `370a65a737fec9909cb91793fba11075bb53f78a`; the branch was fetched and fast-forwarded to new route commit `c3fc45138df7a7def39a6e0685502434723730c1`. That new navigation commit is pushed upstream but has not been run through a fresh preview since arrival. The branch was clean after fast-forward. `origin/main` remains at merge commit `2c850fd` and does not include `c3fc451`.

## Previously verified frontend state

The pushed `370a65a` checkpoint passed `npx expo export --platform web --output-dir /tmp/kamba-web-export-final3`. In a browser preview, Welcome, guest browsing, Home/Discover/Cart/Profile tabs, Cart quantity increment, Profile logout, registration rendering/input, email Login rendering, and Phone Login rendering/input filtering were tested. No real auth, OTP, Google, checkout, or payment submission was made. Native Android/iOS/Expo Go were not available. The project has no `test` or `lint` script in `npm run`.

Expo Doctor previously passed 18/20 checks and flagged the `app.json` `splash` schema field plus patch mismatches for `expo` (58.0.19 vs ~58.0.21), `expo-font` (58.0.10 vs ~58.0.11), `expo-linking` (58.0.14 vs ~58.0.15), and `expo-splash-screen` (58.0.11 vs ~58.0.12). No dependency changes were made.

The Expo preview process `job_85jfkUl3` was later terminated by idle timeout (exit 137). A fresh check found no Expo/Metro process, port 8081 closed, and the prior production web export artifact still present. Do not treat the old preview URL as currently live; restart the server only when needed for fresh testing.

## Fetched remote navigation update: audit result

The fetched `c3fc451` adds route registrations for `Search`, `Onboarding`, `Username`, `PhoneVerify`, `OTP`, `Notifications`, and `Orders`. The referenced files exist, but several are not real end-to-end screens: Search/Notifications/Orders currently show static copy; `UsernameScreen` uses a hardcoded taken-name list; `PhoneVerifyScreen` simulates OTP delivery with a timeout; `OTPScreen` accepts any six-digit code except `000000` and marks the phone verified locally. Do not claim these routes are functionally complete or make mock auth appear successful. Review whether to retain, narrow, or replace these route additions only as real backend-backed functionality is integrated. Preserve the existing four-tab navigation structure unless product requirements explicitly justify a change; the remote commit adds Search as a fifth bottom tab.

## Backend contract found (read-only source)

Sources: backend `README.md`, `src/index.js`, `src/routes/auth.route.js`, `src/controllers/auth.controller.js`, `src/controllers/otp.controller.js`, `src/services/auth.services.js`, `src/services/otp.service.js`, `src/routes/vendors.js`, and public vendor service files at the backend HEAD above.

The backend mounts auth routes beneath `/api/v1/` and vendor routes beneath `/api/v1/vendors`. Its documented/authenticated endpoints include:

| Endpoint | Contract relevant to frontend |
|---|---|
| `POST /api/v1/auth/register` | `email`, `password`, `confirm_password`, `username`; optional `referral_code`. Returns `{success:true,result:{message,id,email,username}}` and sets HttpOnly access/refresh cookies. |
| `POST /api/v1/auth/login` | `email`, `password`. Returns user `id/email/username` in `result` and sets HttpOnly access/refresh cookies. |
| `POST /api/v1/auth/logout` | Clears the HttpOnly cookies. |
| `POST /api/v1/auth/refresh` | Rotates cookies using the refresh cookie. |
| `GET /api/v1/auth/dashboard` | Cookie-authenticated user information (`id`, `email`, `username`, role, etc.). |
| `GET /api/v1/auth/username-availability?username=...` | Returns `{success:true,isAvailable:true}` or HTTP 409 when taken. |
| `POST /api/v1/auth/otp/request` | Requires `userId`, `purpose`, and `endpoint`. |
| `POST /api/v1/auth/otp/verify` | Requires `userId`, `purpose`, and `inputOtp`; validates but does not itself persist a verified phone field. |
| `GET /api/v1/vendors/stores` and `/services` | Public, paginated catalog endpoints returning `stores` / `services`. Store and service detail endpoints are keyed by slug. |

The backend does **not** expose a phone-login endpoint, username-claim endpoint, checkout/order/notification endpoint, or JSON bearer-token response in this checked-in contract. Google OAuth is a `GET /api/v1/auth/google` redirect flow, not the frontend's existing POST helper. Its final redirect depends on `FRONTEND_URL`.

The frontend `src/utils/api.js` currently defaults to `https://api.kamba.ng/v1`, whereas the checked-in backend mounts `/api/v1`. It also defines unsupported helpers (`/auth/phone/send`, `/auth/phone/verify`, `/user/username/check`, `/user/username`) and no call sites currently use the auth helpers. Login/Register write mock tokens; auth bootstrap depends on that local token. Backend auth middleware reads the `access_token` cookie. Cookie-backed web auth therefore needs correct base-path configuration and credential handling; verify deployment CORS/SameSite behavior rather than assuming it.

A read-only GET to `https://api.kamba.ng/health` failed in this environment with `Could not resolve host: api.kamba.ng`. The API contract can be implemented from checked-in source, but live API verification is blocked until the host resolves or the user supplies the correct reachable API URL. Backend `src/index.js` contains no CORS middleware; backend changes are out of scope, so web credentialed requests may additionally depend on deployment/proxy CORS configuration.

## Next frontend work

1. Align the frontend API client with the documented `/api/v1` paths, cookie session model, and actual username/OTP helpers. Wire email registration/login to `authAPI` and remove fake success; use response `result` and keep errors visible. Use the dashboard endpoint to check a cookie-backed session. Do not submit accounts during preview testing.
2. Disable or clearly fail closed for phone-login/Google paths that cannot be completed against the verified contract. Do not register mock OTP screens as a successful auth path. Phone verification needs an authenticated/user ID path and backend persistence semantics before it can be claimed complete.
3. Implement Search/store browsing only against the verified public catalog endpoints; use backend `slug` for store navigation. Do not route numeric local fixture IDs to a real store detail endpoint. Checkout, buyer orders, notifications, favorites, and payment/address flows still lack matching backend endpoints/screens; do not invent them.
4. Test the web build and only those interactions whose API behavior is verifiable. The backend hostname/DNS and cross-origin cookie configuration must be resolved before claiming live auth works. Re-run Expo Doctor/export, review the full diff, update this handoff, commit small verified checkpoints, and push normally to `fix/expo-runtime-stability` (never force-push).
