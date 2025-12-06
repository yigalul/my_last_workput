<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/17A7qovok9M8eCsVfSye7Faa9oiTSnljI

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Run on Android

1. **Prerequisites**: [Android Studio](https://developer.android.com/studio) installed.
2. Sync the project (if you make changes):
   `npx cap sync`
3. Open in Android Studio:
   `npx cap open android`
4. In Android Studio, wait for Gradle sync to finish, then click the "Run" button to launch on your device or emulator.
