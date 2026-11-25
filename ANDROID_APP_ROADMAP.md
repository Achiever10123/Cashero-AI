# Cashero Android App Roadmap

## Goal

Ship Cashero as an installable Android app while keeping its expense-tracking
features, offline behavior, and existing data model.

## Recommendation: reuse the web app with Capacitor

The easiest route is to package the existing app with **Capacitor** and build
the Android project from the current web app. Capacitor hosts the app in a
native Android shell and lets the project add native features when needed.
It works with both React and vanilla JavaScript; choosing vanilla JavaScript
does not, by itself, make an Android app or remove the need for Android
packaging.

Avoid a ground-up rewrite for the first Android release. The current project
already has a responsive web app, offline support, and React-related code and
dependencies. Reuse and stabilize what is there first; decide separately
whether to finish the existing React migration or keep the current mix. If a
new repository is required, bring over the working app and its tests rather
than rebuilding the features in vanilla JavaScript.

**In short:** Capacitor + the existing app is the smallest change. React Native
would mean a larger UI rewrite and is not the easiest way to get this app onto
Android.

## Roadmap

### Phase 1 — Confirm the baseline

- [ ] Inventory current screens, app flows, data formats, and existing tests.
- [ ] Verify the production web build and the current offline experience.
- [ ] Identify any browser-only APIs, external links, and backend requirements.
- [ ] Decide whether Android development stays in this repository or moves to a
      new one; keep one source of truth for app behavior.
- [ ] Record the current JSON backup format as the initial data migration path.

**Exit check:** The existing app builds, its key flows work, and the Android
project can consume a known build output.

### Phase 2 — Make the web app comfortable on a phone

- [ ] Check every primary screen at common Android phone sizes and orientations.
- [ ] Improve touch target sizes, form input types, keyboard behavior, and
      scrolling around dialogs and bottom navigation.
- [ ] Check charts, tables, imports, and exports on a narrow screen.
- [ ] Handle Android back navigation consistently in dialogs and app screens.
- [ ] Add clear loading, empty, error, and offline states.

**Exit check:** A user can add, edit, find, and review transactions using a
phone-sized browser without layout or keyboard blockers.

### Phase 3 — Add the Android shell

- [ ] Add Capacitor and configure the built web output as the app's web assets.
- [ ] Create the Android platform project and open it in Android Studio.
- [ ] Set the application ID, display name, app icon, and launch screen.
- [ ] Configure development and release builds; keep signing credentials out of
      source control.
- [ ] Verify navigation, status/navigation bars, links, and network error
      behavior on an emulator and a physical device.

**Exit check:** A debug APK installs and launches the app on a real Android
device.

### Phase 4 — Review storage, privacy, and native behavior

- [ ] Test persistence across app restarts, upgrades, and device reboots.
- [ ] Decide whether sensitive values need encrypted storage and use an
      appropriate native secure-storage solution for secrets or keys.
- [ ] Keep transaction data private; do not log personal financial details.
- [ ] Preserve JSON backup and restore, and clearly explain how existing browser
      data can be moved to the Android app.
- [ ] Request only Android permissions required by a feature; defer camera,
      microphone, or notification permissions until those features are included.
- [ ] Test offline use, interrupted requests, and recovery from storage errors.

**Exit check:** Data survives normal app lifecycle events, and backup, restore,
and privacy behavior are understood and tested.

### Phase 5 — Android-specific polish and testing

- [ ] Test on supported Android versions, screen sizes, and at least one
      physical device.
- [ ] Verify system back, app pause/resume, keyboard, accessibility, and
      deep-link behavior where applicable.
- [ ] Add automated tests for critical calculations and data migration, plus
      end-to-end checks for the core transaction flow.
- [ ] Verify the release build has no debug configuration or secrets.
- [ ] Prepare store listing text, screenshots, privacy disclosures, and support
      contact details.

**Exit check:** A release candidate passes the core-flow checklist on emulator
and physical hardware.

### Phase 6 — Release and maintain

- [ ] Create a signed Android App Bundle (AAB) using a securely managed signing
      key.
- [ ] Publish to an internal or closed testing track and collect feedback.
- [ ] Fix launch-blocking issues, data-loss risks, and device-specific bugs.
- [ ] Roll out gradually and monitor crashes and user reports.
- [ ] Document the repeatable build, signing, and release process.

**Exit check:** The tested Android build is available through the chosen
distribution channel and can be updated reliably.

## Keep the first release focused

Include the existing core expense, history, and analytics flows; local/offline
use; and a clear way to back up or restore data. Defer push notifications,
receipt scanning, voice input, widgets, and other native-only features until
the packaged app is stable.

## React vs. vanilla JavaScript

| Choice                         | When it makes sense                                                         | Recommendation for Cashero                                                              |
| ------------------------------ | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Existing app + Capacitor       | Fastest route; preserves current features and web code                      | **Recommended**                                                                         |
| React + Capacitor              | Useful if continuing the current component-based UI and adding more screens | Prefer this over rewriting existing features if the React migration is already underway |
| Vanilla JavaScript + Capacitor | Suitable for a small, deliberately simple UI with few shared components     | Not a reason on its own to create a new repo or rebuild Cashero                         |
| React Native                   | Best considered when a fully native UI is a firm requirement                | Not the easiest migration; expect a substantial rewrite                                 |

Capacitor does not require React. Choose the UI framework based on the code
being reused and maintained, not as an Android packaging requirement.

## Main risks to resolve early

- **Existing data:** Browser storage does not automatically transfer to an
  installed Android app. Keep export/import available and test the migration
  instructions.
- **Storage security:** A PIN screen is not the same as encrypting stored
  transaction data. Assess the current storage design before release.
- **Web-to-app differences:** File pickers, downloads, browser dialogs, and
  service-worker behavior may differ inside the Android shell.
- **Backend configuration:** Verify API URLs, CORS assumptions, and network
  failure handling in the packaged build.
- **Store requirements:** Check current Google Play target API, privacy, and
  signing requirements when preparing the release; these can change.

## Suggested first milestone

Build a debug Capacitor APK from the existing app, install it on one Android
device, and verify that a transaction can be added, remains after restarting
the app, and can be backed up and restored. Use that result to decide whether
any UI framework changes are actually necessary.
