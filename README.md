# Kamba Mobile

Private React Native + Expo application for Kamba, a neighbourhood marketplace. The repository is proprietary; see `LICENSE`.

## Local development

Requires Node.js 22. Run `npm ci`, then `npx expo start`. Product and store listings in `src/data/seeds/` are fictional development fixtures and are not a production backend.

## Android APK builds through EAS Workflows

The Expo project is linked in `app.json`. The workflow at `.eas/workflows/create-production-builds.yml` builds **Android only** with the `production` profile. `eas.json` sets this profile to an installable APK.

To build automatically on a release tag, connect the GitHub repository to the Expo project in Expo's **Project settings → GitHub** and install/authorize the Expo GitHub App. Then push a tag such as `v0.2.1`; EAS builds the APK in Expo's cloud and exposes the artifact and logs in the Expo project dashboard. This route does not use the failed GitHub Actions `EXPO_TOKEN` secret or require Android Studio on a laptop. You can also run the workflow manually from an authenticated EAS CLI session with `npx eas-cli login` followed by `npx eas-cli workflow:run .eas/workflows/create-production-builds.yml`.

Before the first production build, configure Android signing credentials for the `production` profile in EAS. Follow any credential setup prompt, or run `npx eas-cli credentials:configure-build -p android -e production` from an authenticated session. Keep the signing key available to the Expo project for future updates. EAS Workflows store the APK under the Expo build/workflow run; they do not attach it as a GitHub Release asset. If a GitHub Release asset is also required, configure the separate GitHub Actions route and its `EXPO_TOKEN` secret deliberately.

## Structure

- `src/theme/`: shared design tokens.
- `src/components/common/`: reusable native UI pieces.
- `src/screens/`: navigation and app screens.
- `src/data/seeds/`: local development-only demo data and image references.
- `supabase/migrations/` and `docs/data-platform.md`: proposed database schema and production-service boundaries.

The mobile app must not connect directly to PostgreSQL. Database migrations, access control, payments, and production data seeding belong to the backend service.
