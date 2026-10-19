# Kamba Mobile

Private React Native + Expo application for Kamba, a neighbourhood marketplace. The repository is proprietary; see `LICENSE`.

## Local development

Requires Node.js 22 and Expo tooling. Run `npm ci`, then `npx expo start`. Open the project in Expo Go or a development build. This is a JavaScript-only app. Product and store samples are illustrative fixtures, not real listings or a production backend.

## Android APK releases

Before the first release, create/link this app to an Expo project (`npx eas-cli init`), commit the generated `extra.eas.projectId` in `app.json`, configure Android signing credentials in EAS, and add an Expo access token as the repository Actions secret `EXPO_TOKEN`. Push a version tag such as `v1.0.0` to invoke `.github/workflows/android-release.yml`. The workflow runs an EAS production Android APK build, downloads the build artifact, and publishes it as a GitHub Release asset. The workflow-dispatched option can rebuild an existing tag. EAS manages the Android signing credentials; maintain access/recovery procedures for the Expo account. Validate a release build on supported Android devices before broad distribution.

## Project organization

- `src/theme/`: shared visual tokens.
- `src/screens/`: app screens.
- `src/data/seeds/`: development-only deterministic fixtures.
- `docs/data-platform.md`: proposed production data schema and API-service boundaries.

The mobile app must not connect directly to PostgreSQL. Database migrations, access control, and production seed data belong to the backend service.
