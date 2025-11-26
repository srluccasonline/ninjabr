<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/18FivmUxglNYWHcxXOu8V3xsvfnZYCNfx

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

### Notes about AI Studio dev vs local

This project ships with an `importmap` in `index.html` pointing to AI Studio's CDN. That helps when the app is served inside the Google AI Studio environment, but it can cause a blank/black screen locally because the CDN modules are different or subject to CORS.

If you run locally and see a black screen, open `index.html` and comment out the `importmap` block (it is already commented in the repo) so Vite will bundle local node_modules packages instead.

If you're testing in AI Studio, you can re-enable the `importmap` or use a deploy environment that serves those modules.
### Notes about AI Studio dev vs local ✅

This project ships with an `importmap` in `index.html` that points to AI Studio's special CDN. That works inside Google AI Studio but can cause a blank/black screen when you run the app locally because the CDN's module resolution (and CORS) differs.

What I changed to fix local dev:
- The importmap is now injected dynamically only when the app is actually hosted inside AI Studio (we detect this using the hostname).
- Local dev will now use `node_modules` and Vite's module bundling, so the app loads correctly in your browser with `npm run dev`.

Local dev steps (recommended):
1. Install dependencies:
```bash
npm install
```
2. Create a `.env.local` file at the project root with your Gemini API key (if needed by your features):
```env
GEMINI_API_KEY=your_api_key_here
```
3. Run the dev server:
```bash
npm run dev
```
4. Open http://localhost:3000 or http://localhost:3001 (Vite may fall back to 3001 if 3000 is busy).

Notes & tips:
- If you need to force the AI Studio importmap even on a local host (e.g., for testing), you can update the `aiHostPatterns` array in `index.html` or set a custom host (not recommended).
- The site still builds for production with `npm run build` and can be previewed with `npm run preview`.
- If you rely on the Gemini API but do not have a key locally, our `mockService` provides fake data so the UI remains functional during dev.
