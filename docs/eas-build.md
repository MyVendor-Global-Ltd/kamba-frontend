# Android APK build workflow

## Current setup

`.eas/workflows/create-production-builds.yml` is an Expo-hosted EAS Workflow that runs for pushed Git tags beginning with `v` and can be run manually. It builds Android only with the `production` profile. `eas.json` configures that profile with `android.buildType: apk` and `distribution: internal`, producing an installable APK rather than a Play Store AAB.

On a tag push, Expo must be connected to this GitHub repository using its GitHub App. In Expo, open the linked project's **Settings → GitHub**, install/authorize the Expo GitHub App, and select `MyVendor-Global-Ltd/kamba-frontend`. EAS Workflows then build from the tagged revision and show run logs and the APK artifact in the Expo project dashboard. A laptop/Android Studio and a GitHub Actions `EXPO_TOKEN` secret are not required for this EAS-hosted route.

For a manual CLI run, use an authenticated Expo account and execute `npx eas-cli workflow:run .eas/workflows/create-production-builds.yml` from the repository root. The Expo dashboard also provides a GitHub build-from-ref flow after the repository is linked. The first Android production build may need signing credentials; configure and retain the project's Android keystore in EAS before distributing updates. A build completing is not the same as a validated release: install the APK on representative Android devices, check startup/navigation and the backend-dependent flows, then publish it to the intended testers.

This EAS workflow does not create a GitHub Release or attach the APK to one. The previous GitHub Actions workflow did that by invoking EAS CLI with an `EXPO_TOKEN`; it was removed because the secret was absent and caused the release pipeline to fail. If a GitHub Release asset is needed later, add a separate authenticated release step only after configuring a tightly scoped GitHub/Expo credential.

## Official Expo references

- [EAS Workflows overview and manual runs](https://docs.expo.dev/eas/workflows/introduction/)
- [Create and run workflows, production build profiles, and GitHub connection](https://docs.expo.dev/eas/workflows/get-started/)
- [Workflow tag triggers and manual dispatch syntax](https://docs.expo.dev/eas/workflows/syntax/)
- [Configure Android APK output in `eas.json`](https://docs.expo.dev/build-reference/apk/)
- [Connect GitHub and build from GitHub](https://docs.expo.dev/build/building-from-github/)
