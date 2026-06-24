# SpeakVaN! — English Pronunciation Coach (Prototype)

A speaking and pronunciation practice app for Vietnamese learners (ages ~15–21) who already know basic English grammar/vocabulary but need targeted speaking and pronunciation practice. Runs in any modern browser on desktop, Android, or iOS, and can be installed to a phone's home screen as a PWA.

## What's in this prototype

- **Sound Drills** — 16 categories covering the pronunciation errors Vietnamese speakers most commonly make in English, with 107 drill entries total. Original 8 (now expanded to 8 entries each): final consonants, consonant clusters, TH sounds, R vs L, S/SH/CH, vowel length, -ed/-s endings, and word stress. Plus 8 new categories added based on further research into Vietnamese-English interference patterns: N vs L (the Hanoi/Northern n/l merge), V vs W, word-initial aspiration (p/t/k), the Z sound, diphthongs (gliding vowels), final -N vs -NG, silent letters, and sentence intonation (question/statement pitch patterns). Each item has a short Vietnamese-context explanation of *why* it's hard, a model audio button, and a "record yourself" check. Tap the 🇻🇳 VI toggle in the header to show Vietnamese translations alongside every explanation and tip.
- **Shadowing** — 27 sentence sets (332 sentences total) for the listen-then-repeat ("shadowing") technique, with word-by-word match scoring. Sentence count now scales with level so harder sets give more practice reps: **Beginner** sets have 8 sentences each (10 sets), **Intermediate** sets have 12 sentences each (9 sets), and **Advanced** sets have 18 sentences each (8 sets) — and within most Intermediate/Advanced sets the sentences follow a loose story or logical sequence (e.g. applying for an internship → first week → a mistake → growth → reflection) rather than being unrelated one-offs. Themes — Beginner: Greetings & Small Talk, Taking the MRT, Family Life: Chores & Responsibilities, Making Friends on Campus, Video Calling Home, Living with a Host Family, Grocery Shopping at the Supermarket, Weekend Plans & Exploring Singapore, Visiting the Library, Talking About the Weather. Intermediate: Ordering Food at a Café, Ordering at a Hawker Centre, University Life: Lectures & Group Projects, At the Clinic & Pharmacy, Setting Up a Phone Plan & Bank Account, Freshman Orientation Week, Living with a Roommate, Working a Part-Time Job, Giving a Class Presentation. Advanced: Job Interview Basics, Family Life: Respecting & Understanding Parents, Multicultural Festivals in Singapore, Talking About Homesickness & Gratitude, Internship & Career Planning, Navigating Culture Shock, Long-Distance Relationships While Abroad, Reflecting Before Graduation — all grounded in the everyday reality of a Vietnamese student living and studying in Singapore (public transport, hawker food, host-family life, campus life, work, and the emotional side of being far from home).
- **Progress** — streak counter, average shadowing match score, and a "focus areas" list showing which sounds the learner gets flagged on most, all stored locally on the device.
- **Settings (optional Azure AI Speech upgrade)** — two independent toggles, "Use Azure Text-to-Speech" and "Use Azure Pronunciation Assessment," plus fields to paste your own Azure Speech key + region. Both are off by default and the app works fully on free browser APIs without them. See [Optional: connect Azure AI Speech](#optional-connect-azure-ai-speech-better-voices--real-pronunciation-scoring) below for setup and the security tradeoffs.

## How to try it right now

1. Open `index.html` in **Google Chrome** (desktop or Android) — this currently has the most reliable support for the Web Speech API used for recording/scoring.
2. Allow microphone access when prompted.
3. Tap a sound drill or shadowing sentence, press ▶ to hear the model pronunciation, then press the mic button and say it back.

You can also serve the folder with any static file server (e.g. `npx serve .`) and open it from a phone on the same network, or deploy it to any static host (GitHub Pages, Netlify, Vercel) to test on real iOS/Android devices over HTTPS (microphone access requires HTTPS or localhost).

### Important browser/device limitations of this prototype

- **Speech recognition (scoring your attempt)** uses the browser's built-in `SpeechRecognition` API. Support is currently strong in Chrome (desktop + Android) but **limited or unavailable in Safari/iOS and Firefox**. On unsupported browsers, the drills and audio playback still work, but recording/scoring will show a message instead of a score.
- **Text-to-speech (model audio)** uses `SpeechSynthesis`, which is broadly supported, though voice quality varies by OS.
- This is a **functional prototype**, not a production-grade pronunciation grader. Scoring is word-match based (did the recognizer hear the right words), not true phoneme-level accuracy — see the roadmap below for how to get real pronunciation scoring.

## Why these features, and what's next

This prototype answers the core question — "does the speaking-practice loop work and is the content useful?" — before investing in native app builds or paid APIs. Recommended next steps, in order:

1. ~~**Add real pronunciation scoring.**~~ **Done.** The Settings tab now has an optional Azure AI Speech (Pronunciation Assessment) integration with per-phoneme accuracy/fluency/completeness scores — see [Optional: connect Azure AI Speech](#optional-connect-azure-ai-speech-better-voices--real-pronunciation-scoring) below. It's off by default; the free Web Speech word-match scoring remains the fallback.
2. **Move to a true cross-platform app shell.** For real Android/iOS app store distribution (not just a browser/PWA), wrap this same logic in **React Native with Expo** — one codebase compiles to iOS, Android, and web, and Expo has first-class APIs for microphone access that work consistently across both phone platforms (unlike the inconsistent browser-only Web Speech API).
3. **Expand content with native speakers / linguists.** The current drill set is built from well-documented Vietnamese-English interference patterns, but a Vietnamese ESL teacher reviewing the content (especially the IPA-style tips) before wider rollout is worth doing.
4. **Add accounts + server-side progress sync** if this needs to work across devices or support a classroom/teacher view of student progress (currently all progress is local to one device/browser via `localStorage`).
5. **Spaced repetition.** The "Focus Areas" tracker already records which sounds a learner struggles with — the natural next step is resurfacing those specific drills more often instead of always going in a fixed order.

## Optional: connect Azure AI Speech (better voices + real pronunciation scoring)

By default this app uses only free, built-in browser APIs (`SpeechSynthesis` for model audio, `SpeechRecognition` for scoring your attempt). The **Settings** tab lets you optionally connect a Microsoft Azure AI Speech resource for two upgrades, each toggled independently:

- **Use Azure Text-to-Speech** — swaps the browser's voice for Azure neural voices, which sound noticeably more natural, especially at the "Slow" playback speed used in Shadowing. Each time you press play, the app **alternates between two voices**: `en-US-AvaNeural` (plain, conversational) and `en-US-AriaNeural` with the `newscast-formal` speaking style (clear, broadcast-style enunciation, `styledegree` dialed down to 0.6 so it doesn't sound overly theatrical). Audio is synthesized at 24kHz/160kbps for smoother-sounding speech.
- **Use Azure Pronunciation Assessment** — swaps the simple word-match scoring for Azure's phoneme-level Pronunciation Assessment, which returns accuracy/fluency/completeness scores and flags individual words, instead of just "did the recognizer hear the right words."

Both features are **off by default**. If you don't add a key, nothing changes — the app behaves exactly as described above. If Azure returns an error at any point (bad key, network issue, rate limit), the app shows the error and you can just turn the toggle off to keep using the free fallback for that feature.

### Text-to-speech caching

To cut down on Azure API calls, synthesized audio clips are cached on-device in **IndexedDB** (cache key = voice + speed + the exact text), so replaying the same line in the same voice/speed reuses the cached clip instead of calling Azure again — the two-voice alternation still works normally since each voice's clip is cached separately. The Settings tab shows the current cache size (entry count + MB) and has a **Clear cache** button. The cache persists across sessions until cleared; it's just a performance/cost optimization and isn't required for the app to work.

### 1. Create a free-tier Azure Speech resource

1. Go to the [Azure Portal](https://portal.azure.com) (a free Microsoft/Azure account is required; new accounts get a startup credit, and the Speech service itself has a separate **free tier (F0)** with ~5 hours/month of audio).
2. Search for **"Speech services"** (sometimes listed as part of "Azure AI services") and click **Create**.
3. Pick a subscription, a resource group (or create one), a **region** (e.g. `eastus`, `southeastasia` — pick one geographically close to your users), a name, and the **Free F0** pricing tier if available (falls back to the pay-as-you-go **Standard S0** tier if F0 isn't offered in your region/subscription).
4. Once it's deployed, open the resource → **Keys and Endpoint** in the left sidebar. Copy **Key 1** and note the **Region** shown there.

### 2. Paste the key into the app

1. Open the **Settings** tab in the app.
2. Paste the key into **Speech key** and the region (e.g. `eastus`) into **Region**, then press **Save**.
3. Flip on **Use Azure Text-to-Speech** and/or **Use Azure Pronunciation Assessment** as you like — they work independently.

### ⚠️ Security note — read before using this with real students

This app has **no backend server** — it's static HTML/CSS/JS that runs entirely in the browser. That means:

- Your Azure key is stored only in **this browser's `localStorage`**, on this device. It is never committed to the code or sent to any server of ours.
- However, because all Azure calls are made directly from the browser, **the key is visible in that browser's DevTools (Network tab / Application → Local Storage)** to anyone with access to that device or browser session.
- This is an acceptable tradeoff for **personal use or a small trusted pilot** (e.g. you, or a handful of students using devices you control), but it is **not a safe pattern for a public, unauthenticated deployment** — anyone who opens DevTools on that page could copy your key and run up charges on your Azure account.
- If you outgrow this tradeoff, the standard fix is the one already on the roadmap above: add a thin backend (even a single serverless function) that holds the Azure key server-side and proxies/token-exchanges on the client's behalf, so the raw key never reaches the browser.
- You can revoke/rotate a leaked key anytime from the Azure Portal (**Keys and Endpoint** → regenerate), and Azure's free tier's usage caps limit worst-case exposure.

## File structure

```
index.html     — app shell and markup
style.css      — all styling (mobile-first, responsive)
app.js         — app logic: tabs, drills, shadowing, speech, scoring, progress
data.js        — drill categories and shadowing sentences (content only)
manifest.json  — PWA manifest (installable to home screen)
sw.js          — service worker (offline app-shell caching)
icon.svg       — app icon
```
