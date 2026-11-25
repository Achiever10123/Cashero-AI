# Cashero Android APK Roadmap

## Goal

Build and test Cashero as an Android app using the existing web app and
Capacitor. Keep the expense-tracking features, offline behavior, and JSON
backup/restore flow.

## Current project status

- The web UI uses vanilla JavaScript; React and its dependencies have been
  removed.
- Capacitor 8 and the Android platform project are set up in this repository.
- The application ID is `org.cashero.ai`; the display name is `Cashero AI`.
- Capacitor packages the web build from `dist/`. Run `npm run android:sync`
  after web changes.
- Web build, unit/API tests, browser tests, and Capacitor asset sync have passed.
- A native APK has not been built on this machine yet; Android Studio and the
  Android SDK still need to be installed.

## What to install

1. **Node.js 22 or newer** — required by Capacitor 8. Install from
   [nodejs.org](https://nodejs.org/). This project currently uses Node 26.
2. **Android Studio 2025.2.1 or newer** — install the latest stable version
   from the [Android Studio download page](https://developer.android.com/studio).
   Capacitor 8 requires this minimum version.
3. **Android SDK Platform API 36** — the current project is configured with
   `compileSdkVersion` and `targetSdkVersion` 36. Install it through Android
   Studio's **Tools → SDK Manager → SDK Platforms**.
4. In Android Studio's **SDK Manager → SDK Tools**, install/keep current:
   **Android SDK Build-Tools**, **Android SDK Platform-Tools** (includes
   `adb`), **Android SDK Command-line Tools**, and **Android Emulator** if
   you want to test on an emulator.
5. **Choose one test device:** create an emulator in **Tools → Device
   Manager**, or use a physical Android phone with Developer options and USB
   debugging enabled.

Android Studio installs the JDK it needs; a separate JDK and a separate Gradle
installation are not required. The Android project includes the Gradle wrapper
(`android/gradlew.bat`), which downloads and uses the configured Gradle version.
See Capacitor's [environment setup](https://capacitorjs.com/docs/getting-started/environment-setup)
and [Android guide](https://capacitorjs.com/docs/android).

### About `node_modules`

`node_modules/` is the local folder where npm installs this project's
JavaScript dependencies (including Vite, Playwright, and Capacitor). It is
ignored by Git and should not be committed or downloaded separately. It is
needed to build, test, and sync the app. If it is removed, run `npm ci` from
the repository root to recreate it from `package-lock.json`.

## Build and install a debug APK

Run these steps in order from the repository root.

### 1. Check Node.js and install project dependencies

Open PowerShell or a terminal in the repository and verify Node.js:

```powershell
node --version
npm --version
```

The Node version must be 22 or newer. Install exactly the dependencies recorded
in the lockfile:

```powershell
npm ci
```

Do not run `npm ci` while another npm install is running. It will recreate
`node_modules/` if needed.

If npm reports that it blocked a dependency install script and a build later
fails, run `npx cap doctor` and follow its package-specific instructions. For
example, approve a listed `esbuild` script with `npm install-scripts approve
esbuild`, then run `npm rebuild`.

### 2. Verify the web app

```powershell
npm test
npm run build
```

The production files must be generated in `dist/` before Capacitor copies them
into the Android project.

### 3. Sync the web app into Android

```powershell
npm run android:sync
```

This runs the web production build and then `cap sync android`. Repeat it after
changing web code so the Android project receives the latest version. Do not
edit files under `android/app/src/main/assets/public` by hand; Capacitor
regenerates that folder.

### 4. Open and sync the Android project

```powershell
npm run android:open
```

In Android Studio, allow the initial Gradle sync and any SDK/license prompts to
finish. If Android Studio reports a missing SDK, install API 36 using SDK
Manager. If Gradle asks for a JDK, select Android Studio's bundled JDK in
**Settings → Build, Execution, Deployment → Build Tools → Gradle → Gradle JDK**.

The current app ID is configured in `capacitor.config.json`,
`android/app/build.gradle`, the Android strings, and the Java activity package.
Keep these values aligned. Choose the final app ID before publishing: changing
it after distribution creates a different Android app and prevents in-place
updates.

To replace the starter launcher icon, right-click `android/app/src/main/res` in
Android Studio and choose **New → Image Asset**. Select the app icon source,
preview the adaptive icon, and finish the wizard.

### 5. Select an emulator or device

- **Emulator:** in Android Studio open **Tools → Device Manager**, create a
  phone device, download a compatible system image, and start it.
- **Physical phone:** enable Developer options and USB debugging, connect it
  over USB, and approve the computer authorization prompt.

Capacitor supports Android API 24 and newer. The project builds against API
36; test on the emulator/device versions you intend to support. See Android's
[AVD guide](https://developer.android.com/studio/run/managing-avds).

### 6. Run the app from Android Studio

Choose the `app` run configuration and the emulator/device in Android Studio,
then click **Run**. Confirm that the app launches and exercise the main flows:

- Add an expense and confirm it is still present after closing and reopening.
- Navigate between dashboard, add-expense, and history screens.
- Test export/restore and offline behavior.
- Check layout, keyboard, Android back navigation, and network error behavior.

### 7. Build a debug APK

For a command-line build, open PowerShell in the repository root:

```powershell
Set-Location android
.\gradlew.bat assembleDebug
```

The debug APK is written to:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

The debug APK is automatically signed with a development key and is suitable
for testing or personal installation, not store release.

### 8. Install the debug APK

With an emulator or USB-debugging-enabled phone connected, either click **Run**
in Android Studio or install from the `android/` directory:

```powershell
.\gradlew.bat installDebug
```

Alternatively, install the built APK with `adb`:

```powershell
adb install -r app\build\outputs\apk\debug\app-debug.apk
```

On Windows, if `adb` is not on `PATH`, run it from the Android SDK's
`platform-tools` directory or add that directory to `PATH`.

## Make a release build

For a signed APK to distribute directly, use Android Studio's
**Build → Generate Signed Bundle / APK → APK** wizard. Create/select a release
keystore and key, then select the `release` build variant. Store the keystore
and passwords securely outside the repository; never commit them. Keep secure
backups because updates must use a compatible signing identity. Increase
`versionCode` in `android/app/build.gradle` for each release.

For Google Play, create a signed **Android App Bundle (AAB)** instead. Google
Play uses Play App Signing for store delivery; a debug APK is not a Play Store
release. Read Android's official [app signing guide](https://developer.android.com/studio/publish/app-signing)
and [command-line build guide](https://developer.android.com/build/building-cmdline).
Follow current Play Console target API, privacy, and listing requirements when
publishing, since these change over time.

## Routine after making web changes

From the repository root:

```powershell
npm test
npm run android:sync
npm run android:open
```

Then run the app again in Android Studio or rebuild with
`.\gradlew.bat assembleDebug` from `android/`.

## Remaining roadmap

### Before first APK

- [ ] Install Android Studio and API 36 SDK packages.
- [ ] Open the project in Android Studio and complete Gradle sync.
- [ ] Select the final app icon and verify the display name.
- [ ] Run on an emulator and a physical device.
- [ ] Build, install, and test the debug APK using the steps above.

### Before public release

- [ ] Test persistence across app restarts, upgrades, and device reboots.
- [ ] Verify backup/restore and explain how browser data can be moved to Android.
- [ ] Review privacy disclosures, permissions, and storage security.
- [ ] Test supported screen sizes, Android versions, back navigation, keyboard,
      accessibility, file import/export, and offline behavior.
- [ ] Create a signed release APK for direct distribution or a signed AAB for
      Google Play; keep signing credentials out of source control.
- [ ] Prepare store listing, screenshots, support contact, and release process.

**First milestone:** install a debug APK on one real Android device, add a
transaction, restart the app, and verify that the transaction and backup/restore
flow still work.
