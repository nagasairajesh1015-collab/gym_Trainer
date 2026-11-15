# IronPath on Android and iOS (Capacitor)

The web app is wrapped as a native app. Everything works offline: the exercise videos in
`public/animations` are bundled inside the app.

## One-time setup
1. Install Node 18+ and JDK 17.
2. Android: install Android Studio (it brings the Android SDK). iOS: a Mac with Xcode 15+.
3. In this folder run:
   npm install
   npm run assets          # makes all app icons and splash screens from assets/
   npx cap add android     # and/or: npx cap add ios

## Build and run
npm run android            # builds the web app, syncs, opens Android Studio
  - Press Run to test on a phone or emulator.
  - Build > Build APK(s) for a file you can install, or Build > Generate Signed Bundle (AAB) for Google Play.
npm run ios                # opens Xcode; pick your team under Signing & Capabilities, then Run
Every time you change the web code, run `npm run cap:sync` (or the two commands above).

## No Android Studio? Build the APK in the cloud
Push this folder to GitHub. Open Actions > "Build Android APK" > Run workflow. Download
`ironpath-debug-apk` from the run (a debug APK you can install on any Android phone).

## Settings you may want to change
- App id and name: `capacitor.config.json` (appId must be unique, for example com.yourname.ironpath).
- AI review in the Diet Plan: native apps are not inside Claude, so add
  `<script>window.AI_ENDPOINT = "https://your-server.example/ai"</script>` to `index.html`.
  The server keeps your API key private and answers `{ prompt }` with `{ json }`. Without it the
  AI button shows a friendly "not available" message; all calculations still work.
- Real exercise footage: replace any `public/animations/<exercise-id>.mp4` with the same file name.

## Store checklist
Google Play: signed AAB, 512 px icon, screenshots, privacy policy (the app stores data only on the device).
App Store: Apple Developer account, App Privacy answers ("data not collected"), screenshots.
Add a "not medical advice" note in the store description because of the Diet Plan.
