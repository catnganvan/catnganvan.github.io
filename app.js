// ============================================================
// SpeakVaN! — app logic
// Uses: SpeechSynthesis (TTS model audio) + Web Speech API
// (SpeechRecognition) for capturing the learner's attempt.
//
// NOTE on browser support: this prototype relies on the
// browser's built-in speech recognition (best in Chrome on
// desktop/Android; limited/unavailable in Safari/iOS and
// Firefox). See README.md for the production path using a
// cloud pronunciation-scoring API instead.
// ============================================================

const STORAGE_KEY = "speakvn_progress_v1";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { sessions: [], soundMisses: {}, lastDay: null, streak: 0, drillProgress: {}, shadowProgress: {} };
}

function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

let progress = loadProgress();
// Older saved progress objects may predate these fields — backfill them.
if (!progress.drillProgress) progress.drillProgress = {};
if (!progress.shadowProgress) progress.shadowProgress = {};

// Marks a given item index as "seen" within a category/set, so we can show
// a completion percentage on the category/set list cards.
function markItemVisited(map, id, idx) {
  const visited = new Set(map[id] || []);
  visited.add(idx);
  map[id] = [...visited];
  saveProgress(progress);
}

function getCompletionPercent(map, id, total) {
  const visited = map[id];
  if (!visited || !total) return 0;
  return Math.min(100, Math.round((visited.length / total) * 100));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function bumpStreak() {
  const today = todayStr();
  if (progress.lastDay === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  progress.streak = progress.lastDay === yesterday ? progress.streak + 1 : 1;
  progress.lastDay = today;
  saveProgress(progress);
}

function recordSession(entry) {
  progress.sessions.unshift({ ...entry, date: new Date().toISOString() });
  progress.sessions = progress.sessions.slice(0, 50);
  bumpStreak();
  saveProgress(progress);
  renderProgressTab();
}

function recordMiss(soundLabel) {
  progress.soundMisses[soundLabel] = (progress.soundMisses[soundLabel] || 0) + 1;
  saveProgress(progress);
}

// ----------------------- Design tokens (palette + icons) -----------------------
// Warm, Duolingo-style palette: each category/set cycles through 7 colors,
// each with a "main" tone and a darker tone used for the neumorphic offset
// shadow, plus a pale tint used for badges.

const PAL = [
  { c: "#34c759", d: "#27a345", t: "#e7f8ec" },
  { c: "#ff6b5e", d: "#e34b3d", t: "#ffece9" },
  { c: "#ffac33", d: "#e88e12", t: "#fff3df" },
  { c: "#37bdf3", d: "#1aa0db", t: "#e4f6fe" },
  { c: "#a385ff", d: "#8460f0", t: "#efe9ff" },
  { c: "#ff7eb6", d: "#ee5b9c", t: "#ffe9f4" },
  { c: "#2bd4bd", d: "#15b6a1", t: "#e1f9f5" },
];

// Short IPA-ish token shown inside each drill category's icon square.
const DRILL_TOK = {
  "final-consonants": "–d", "consonant-clusters": "skt", "th-sounds": "th",
  "r-vs-l": "r/l", "s-sh-ch": "ʃ", "vowel-length": "iː", "endings": "-ed",
  "word-stress": "ˈA", "n-vs-l": "n/l", "v-vs-w": "v/w", "aspiration": "pʰ",
  "z-sound": "z", "diphthongs": "aɪ", "final-n-ng": "ŋ", "silent-letters": "(k)",
  "intonation": "↗",
};

// Maps each shadowing set to a hand-drawn line icon.
const SET_ICON = {
  greetings: "smile", cafe: "coffee", interview: "briefcase", mrt: "train", hawker: "bowl",
  chores: "sparkle", respect: "heart", uni: "cap", friends: "users", videocall: "video",
  hostfamily: "home", groceries: "cart", clinic: "cross", phonebank: "phone", weekend: "sun",
  festivals: "star", gratitude: "plane",
  library: "cap", weather: "sun", orientation: "users", roommate: "home", parttimejob: "briefcase",
  publicspeaking: "chat", internship: "briefcase", "culture-shock": "sparkle", "long-distance": "heart",
  graduation: "star",
};

const ICONS = {
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14.5s1.4 2 4 2 4-2 4-2"/><path d="M9 9.5h.01M15 9.5h.01"/>',
  coffee: '<path d="M17 8h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M4 8h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z"/><path d="M7 2.5v2M11 2.5v2M15 2.5v2"/>',
  briefcase: '<rect x="3" y="7.5" width="18" height="12.5" rx="2.5"/><path d="M8 7.5V5.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
  train: '<rect x="5" y="3" width="14" height="13" rx="3"/><path d="M5 11h14"/><path d="M8.5 19.5 6 22M15.5 19.5 18 22"/><path d="M9 13.5h.01M15 13.5h.01"/>',
  bowl: '<path d="M3.5 11h17a8.5 8.5 0 0 1-17 0Z"/><path d="M2.5 11h19"/><path d="M11 3c-1 1.2 1 2 0 3.2"/><path d="M14.5 4c-.8 1 .8 1.6 0 2.6"/>',
  sparkle: '<path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4Z"/><path d="M18.5 14l.8 2.1 2.2.7-2.2.7-.8 2.1-.8-2.1-2.2-.7 2.2-.7Z"/>',
  heart: '<path d="M12 20.5S4 15.5 4 9.8A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8 2.8C20 15.5 12 20.5 12 20.5Z"/>',
  cap: '<path d="M22 9 12 5 2 9l10 4 10-4Z"/><path d="M6 11v4.5c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5V11"/><path d="M22 9v5"/>',
  users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19.5a6 6 0 0 1 12 0"/><path d="M16.5 5.6a3.2 3.2 0 0 1 0 6.1"/><path d="M19.5 19.5a6 6 0 0 0-3-5"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10l5-3v10l-5-3Z"/>',
  home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M6 9.5V19h12V9.5"/><path d="M10 19v-5h4v5"/>',
  cart: '<circle cx="9.5" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M2.5 4h2.2l2.3 11.5h10.3l1.8-8H6.2"/>',
  cross: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8.5v7M8.5 12h7"/>',
  phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="3"/><path d="M10.5 18.5h3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  star: '<path d="M12 3.5l2.5 5.6 6.1.6-4.6 4 1.4 6L12 16.6 6.6 19.7 8 13.7l-4.6-4 6.1-.6Z"/>',
  plane: '<path d="M2.5 12 21 4l-7.5 18-2.6-7.9Z"/><path d="M21 4 10.9 14.1"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12Z"/>',
};

function iconSvg(name, strokeWidth = 2) {
  const inner = ICONS[name] || ICONS.chat;
  return `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

const PLAY_SVG = '<svg class="ic" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l11-7z"></path></svg>';
const MIC_SVG = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2.5" width="6" height="11" rx="3"></rect><path d="M5.5 11a6.5 6.5 0 0 0 13 0"></path><path d="M12 17.5V21"></path><path d="M8.5 21h7"></path></svg>';
const ARROW_RIGHT_SVG = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>';
const CHEVRON_LEFT_SVG = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"></path></svg>';
const CHEVRON_RIGHT_SVG = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>';

// ----------------------- Azure config (optional, BYO key) -----------------------
// All Azure features are opt-in and gated behind toggles in the Settings tab.
// The key/region are entered by the user and stored only in this browser's
// localStorage — never hardcoded in source, never sent anywhere but Azure.
// With no backend, the key IS visible in this browser's dev tools/network
// tab; that's a documented tradeoff for personal/pilot use (see README).

const AZURE_CONFIG_KEY = "speakvn_azure_config";

function loadAzureConfig() {
  try {
    const raw = localStorage.getItem(AZURE_CONFIG_KEY);
    if (raw) return { key: "", region: "", useTts: false, usePA: false, ...JSON.parse(raw) };
  } catch (e) {}
  return { key: "", region: "", useTts: false, usePA: false };
}

function saveAzureConfig(cfg) {
  localStorage.setItem(AZURE_CONFIG_KEY, JSON.stringify(cfg));
}

let azureConfig = loadAzureConfig();

function azureConfigured() {
  return !!(azureConfig.key && azureConfig.region);
}

// ----------------------- Speech helpers -----------------------

function speak(text, rate = 0.9) {
  if (azureConfig.useTts && azureConfigured()) {
    azureSpeak(text, rate).catch((e) => {
      console.error(e);
      showToast("Azure TTS error — using browser voice instead.");
      speakBrowser(text, rate);
    });
    return;
  }
  speakBrowser(text, rate);
}

function speakBrowser(text, rate = 0.9) {
  if (!("speechSynthesis" in window)) {
    showToast("Text-to-speech isn't supported in this browser.");
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find((v) => v.lang === "en-US") || voices.find((v) => v.lang.startsWith("en"));
  if (enVoice) utter.voice = enVoice;
  window.speechSynthesis.speak(utter);
}

// ----- Azure TTS (REST: token exchange + SSML synth) -----

let azureTokenCache = { token: null, region: null, key: null, ts: 0 };

async function getAzureToken() {
  const now = Date.now();
  const fresh = azureTokenCache.token
    && azureTokenCache.region === azureConfig.region
    && azureTokenCache.key === azureConfig.key
    && now - azureTokenCache.ts < 8 * 60 * 1000; // tokens last 10 min; refresh a bit early
  if (fresh) return azureTokenCache.token;

  const resp = await fetch(`https://${azureConfig.region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
    method: "POST",
    headers: { "Ocp-Apim-Subscription-Key": azureConfig.key, "Content-Length": "0" },
  });
  if (!resp.ok) throw new Error(`Azure auth failed (${resp.status}). Check your key/region in Settings.`);
  const token = await resp.text();
  azureTokenCache = { token, region: azureConfig.region, key: azureConfig.key, ts: now };
  return token;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

let azureAudioEl = null;

// Alternate between two voice "characters" on every TTS call: a plain,
// everyday-accented voice (Ava) and a clear, neutral newscast-style voice
// (Aria). Exposing learners to both a more natural/casual voice and a
// deliberately clear one — back and forth — is more representative of the
// range of real speech than always using one or the other.
let azureVoiceToggle = false;

function buildAzureSsml(text, rateAttr) {
  azureVoiceToggle = !azureVoiceToggle;
  if (azureVoiceToggle) {
    // Plain neural voice, no style override — natural everyday accent/cadence.
    return {
      voiceTag: "ava",
      ssml: `<speak version="1.0" xml:lang="en-US"><voice name="en-US-AvaNeural"><prosody rate="${rateAttr}">${escapeXml(text)}</prosody></voice></speak>`,
    };
  }
  // en-US-AriaNeural in the "newscast-formal" style reads in a clear,
  // neutral, well-enunciated broadcast tone rather than a casual/regional
  // accent — closer to what a learner should model their pronunciation on.
  // styledegree is dialed back from the default (1.0) since full intensity
  // exaggerates pauses between words/phrases, which reads as "choppy."
  return {
    voiceTag: "aria-newscast",
    ssml: `<speak version="1.0" xml:lang="en-US" xmlns:mstts="https://www.w3.org/2001/mstts"><voice name="en-US-AriaNeural"><mstts:express-as style="newscast-formal" styledegree="0.6"><prosody rate="${rateAttr}">${escapeXml(text)}</prosody></mstts:express-as></voice></speak>`,
  };
}

// ----- TTS audio cache (IndexedDB) -----
// Synthesized clips are cached by exact voice+rate+text so replaying the
// same line (e.g. re-pressing "Slow" on a sentence you already heard)
// reuses the stored audio instead of calling the Azure API again. This is
// a real cost saver since shadowing sentences get replayed a lot. Cache is
// keyed per voice, so alternating Ava/Aria on fresh text still works — only
// exact repeats are served from cache.

const TTS_CACHE_DB_NAME = "speakvn_tts_cache";
const TTS_CACHE_STORE = "clips";
let ttsCacheDbPromise = null;

function openTtsCacheDb() {
  if (ttsCacheDbPromise) return ttsCacheDbPromise;
  ttsCacheDbPromise = new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB not supported in this browser."));
      return;
    }
    const req = indexedDB.open(TTS_CACHE_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(TTS_CACHE_STORE)) {
        db.createObjectStore(TTS_CACHE_STORE, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return ttsCacheDbPromise;
}

function ttsCacheKeyFor(voiceTag, rateAttr, text) {
  return `${voiceTag}|${rateAttr}|${text}`;
}

async function ttsCacheGet(key) {
  try {
    const db = await openTtsCacheDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(TTS_CACHE_STORE, "readonly");
      const req = tx.objectStore(TTS_CACHE_STORE).get(key);
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    return null;
  }
}

async function ttsCachePut(key, blob) {
  try {
    const db = await openTtsCacheDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(TTS_CACHE_STORE, "readwrite");
      tx.objectStore(TTS_CACHE_STORE).put({ key, blob, bytes: blob.size, ts: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    // Cache write failures shouldn't break playback — just means no caching this time.
  }
}

async function ttsCacheStats() {
  try {
    const db = await openTtsCacheDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(TTS_CACHE_STORE, "readonly");
      const req = tx.objectStore(TTS_CACHE_STORE).getAll();
      req.onsuccess = () => {
        const rows = req.result || [];
        const bytes = rows.reduce((sum, r) => sum + (r.bytes || 0), 0);
        resolve({ count: rows.length, bytes });
      };
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    return { count: 0, bytes: 0 };
  }
}

async function ttsCacheClear() {
  try {
    const db = await openTtsCacheDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(TTS_CACHE_STORE, "readwrite");
      tx.objectStore(TTS_CACHE_STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {}
}

async function azureSpeak(text, rate = 0.9) {
  const rateAttr = rate <= 0.65 ? "-35%" : rate < 0.95 ? "-15%" : "0%";
  const { ssml, voiceTag } = buildAzureSsml(text, rateAttr);
  const cacheKey = ttsCacheKeyFor(voiceTag, rateAttr, text);

  let blob = await ttsCacheGet(cacheKey);
  let fromCache = !!blob;
  if (!blob) {
    const token = await getAzureToken();
    const resp = await fetch(`https://${azureConfig.region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/ssml+xml",
        // Higher sample rate / bitrate than the previous 16kHz/128kbps setting —
        // low-quality encoding can itself sound choppy/artifacty on speech audio.
        "X-Microsoft-OutputFormat": "audio-24khz-160kbitrate-mono-mp3",
      },
      body: ssml,
    });
    if (!resp.ok) throw new Error(`Azure TTS request failed (${resp.status}).`);
    blob = await resp.blob();
    ttsCachePut(cacheKey, blob); // fire-and-forget; playback doesn't wait on this
  }

  const url = URL.createObjectURL(blob);
  if (azureAudioEl) {
    azureAudioEl.pause();
    URL.revokeObjectURL(azureAudioEl.src);
  }
  azureAudioEl = new Audio(url);
  azureAudioEl.onended = () => URL.revokeObjectURL(url);
  await azureAudioEl.play();
  if (!fromCache) refreshTtsCacheStatsUi();
}

// ----- Azure Pronunciation Assessment (Speech SDK, loaded lazily from CDN) -----

let speechSdkLoadPromise = null;

// Try a few CDN sources in order — some networks/ad-blockers block aka.ms
// redirects, so jsdelivr/unpkg (plain npm CDNs) are tried as fallbacks.
const SPEECH_SDK_SOURCES = [
  "https://cdn.jsdelivr.net/npm/microsoft-cognitiveservices-speech-sdk/distrib/browser/microsoft.cognitiveservices.speech.sdk.bundle-min.js",
  "https://unpkg.com/microsoft-cognitiveservices-speech-sdk/distrib/browser/microsoft.cognitiveservices.speech.sdk.bundle-min.js",
  "https://aka.ms/csspeech/jsbrowserpackageraw",
];

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

function loadSpeechSDK() {
  if (window.SpeechSDK) return Promise.resolve(window.SpeechSDK);
  if (speechSdkLoadPromise) return speechSdkLoadPromise;

  speechSdkLoadPromise = (async () => {
    let lastErr = null;
    for (const src of SPEECH_SDK_SOURCES) {
      try {
        await loadScriptOnce(src);
        if (window.SpeechSDK) return window.SpeechSDK;
        lastErr = new Error(`Loaded ${src} but window.SpeechSDK was not defined.`);
      } catch (e) {
        lastErr = e;
      }
    }
    // Let a future call retry from scratch instead of staying stuck on the failure.
    speechSdkLoadPromise = null;
    throw new Error(
      `Could not load the Azure Speech SDK from any CDN (last error: ${lastErr?.message || lastErr}). ` +
      `This is usually caused by an ad blocker / privacy extension, or no internet access to npm CDNs. ` +
      `Try disabling content blockers for this page, or turn off Azure Pronunciation Assessment to use the free fallback.`
    );
  })();
  return speechSdkLoadPromise;
}

// Runs one pronunciation-assessment pass against the given reference text
// (a single word or a full sentence) using the learner's microphone.
async function azurePronunciationAssess(referenceText) {
  const SpeechSDK = await loadSpeechSDK();
  return new Promise((resolve, reject) => {
    let speechConfig;
    try {
      speechConfig = SpeechSDK.SpeechConfig.fromSubscription(azureConfig.key, azureConfig.region);
    } catch (e) {
      reject(new Error("Invalid Azure key/region."));
      return;
    }
    speechConfig.speechRecognitionLanguage = "en-US";
    // By default Azure waits ~1-2s of silence (and sometimes longer) before
    // deciding the learner has finished speaking, which feels like the mic
    // is "still recording" after they've stopped. Shorten that window so it
    // wraps up promptly once they go quiet.
    speechConfig.setProperty("Speech_SegmentationSilenceTimeoutMs", "700");
    speechConfig.setProperty("SpeechServiceConnection_EndSilenceTimeoutMs", "700");
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const paConfig = new SpeechSDK.PronunciationAssessmentConfig(
      referenceText,
      SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
      SpeechSDK.PronunciationAssessmentGranularity.Phoneme,
      true
    );
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    paConfig.applyTo(recognizer);

    recognizer.recognizeOnceAsync(
      (result) => {
        recognizer.close();
        if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
          const pa = SpeechSDK.PronunciationAssessmentResult.fromResult(result);
          let words = null;
          try {
            const detail = JSON.parse(result.properties.getProperty(SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult));
            words = detail?.NBest?.[0]?.Words || null;
          } catch (e) {}
          resolve({
            text: result.text,
            accuracy: Math.round(pa.accuracyScore || 0),
            fluency: Math.round(pa.fluencyScore || 0),
            completeness: Math.round(pa.completenessScore || 0),
            pronScore: Math.round(pa.pronunciationScore || 0),
            words,
          });
        } else if (result.reason === SpeechSDK.ResultReason.NoMatch) {
          reject(new Error("No speech recognized. Try again, closer to the mic and speak right after pressing the button."));
        } else {
          const cancellation = SpeechSDK.CancellationDetails.fromResult(result);
          reject(new Error(`Azure recognition was canceled (${cancellation.reason}): ${cancellation.errorDetails || "no details"}.`));
        }
      },
      (err) => {
        recognizer.close();
        reject(new Error(String(err)));
      }
    );
  });
}

function renderAzureWordsHtml(words) {
  if (!words || !words.length) return "";
  return words
    .map((w) => {
      const acc = w.PronunciationAssessment?.AccuracyScore ?? 100;
      const cls = acc >= 80 ? "match" : acc >= 50 ? "ok" : "miss";
      return `<span class="${cls}">${w.Word}</span>`;
    })
    .join(" ");
}

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognizer = null;
let recognizing = false;

function speechSupported() {
  return !!SR;
}

function startRecognition(onResult, onError) {
  if (!SR) {
    onError("Speech recognition isn't supported in this browser. Try Chrome on desktop or Android.");
    return;
  }
  recognizer = new SR();
  recognizer.lang = "en-US";
  recognizer.interimResults = false;
  recognizer.maxAlternatives = 3;
  recognizing = true;

  recognizer.onresult = (event) => {
    const alts = [];
    for (let i = 0; i < event.results[0].length; i++) {
      alts.push(event.results[0][i].transcript.trim());
    }
    onResult(alts);
  };
  recognizer.onerror = (event) => {
    recognizing = false;
    onError(
      event.error === "not-allowed"
        ? "Microphone access was blocked. Please allow microphone permission."
        : `Recognition error: ${event.error}`
    );
  };
  recognizer.onend = () => {
    recognizing = false;
  };
  try {
    recognizer.start();
  } catch (e) {
    onError("Could not start microphone.");
  }
}

function stopRecognition() {
  if (recognizer && recognizing) recognizer.stop();
}

// ----------------------- Text comparison / scoring -----------------------

function normalize(s) {
  return s
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, "")
    .trim();
}

// Word-level diff using simple LCS-based alignment, good enough for
// short learner sentences.
function wordDiff(targetText, heardText) {
  const target = normalize(targetText).split(/\s+/).filter(Boolean);
  const heard = normalize(heardText).split(/\s+/).filter(Boolean);

  const n = target.length, m = heard.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = target[i - 1] === heard[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const matched = new Array(n).fill(false);
  let i = n, j = m;
  while (i > 0 && j > 0) {
    if (target[i - 1] === heard[j - 1]) {
      matched[i - 1] = true;
      i--; j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  const matchCount = matched.filter(Boolean).length;
  const score = target.length ? Math.round((matchCount / target.length) * 100) : 0;
  return { target, matched, score };
}

function renderWordDiffHtml(diff) {
  return diff.target
    .map((w, idx) => `<span class="${diff.matched[idx] ? "match" : "miss"}">${w}</span>`)
    .join(" ");
}

function scoreWord(targetWord, alternatives) {
  const t = normalize(targetWord);
  for (const alt of alternatives) {
    if (normalize(alt) === t) return { matched: true, heard: alt };
  }
  // fuzzy: check if any alternative contains the target word as substring
  for (const alt of alternatives) {
    if (normalize(alt).includes(t)) return { matched: true, heard: alt };
  }
  return { matched: false, heard: alternatives[0] || "" };
}

// ----------------------- Toast -----------------------

const VI_PREF_KEY = "speakvn_show_vi";
let showVI = localStorage.getItem(VI_PREF_KEY) === "1";

function bilingualHtml(obj, viClass) {
  if (!obj) return "";
  const enHtml = obj.en;
  const viHtml = showVI && obj.vi ? `<span class="${viClass || "vi-text"}">🇻🇳 ${obj.vi}</span>` : "";
  return `${enHtml}${viHtml}`;
}

function setupViToggle() {
  const btn = document.getElementById("viToggle");
  btn.setAttribute("aria-pressed", String(showVI));
  btn.addEventListener("click", () => {
    showVI = !showVI;
    localStorage.setItem(VI_PREF_KEY, showVI ? "1" : "0");
    btn.setAttribute("aria-pressed", String(showVI));
    // Re-render whichever view is currently open so the toggle takes effect immediately.
    if (!document.getElementById("drillView").classList.contains("hidden")) renderDrillItem();
    if (!document.getElementById("shadowView").classList.contains("hidden")) renderShadowItem();
    showToast(showVI ? "Showing Vietnamese explanations" : "English-only explanations");
  });
}

let toastTimer = null;
function showToast(msg, ms = 2600) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), ms);
}

// ----------------------- Tabs -----------------------

document.getElementById("tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
  if (btn.dataset.tab === "progress") renderProgressTab();
  if (btn.dataset.tab === "settings") refreshTtsCacheStatsUi();
});

// ----------------------- Drills tab -----------------------

function renderDrillCategoryList() {
  const list = document.getElementById("drillCategoryList");
  list.innerHTML = DRILL_CATEGORIES.map((cat, i) => {
    const itemCount = (cat.pairs || cat.words).length;
    const percent = getCompletionPercent(progress.drillProgress, cat.id, itemCount);
    const pal = PAL[i % PAL.length];
    const sub = `${itemCount} ${cat.pairs ? "pairs" : "words"}${percent > 0 ? ` · ${percent}% done` : ""}`;
    const token = DRILL_TOK[cat.id] || "●";
    return `<button class="cat-card" data-cat="${cat.id}">
      <span class="cat-icon" style="background:${pal.c};box-shadow:0 3px 0 ${pal.d}">${token}</span>
      <span class="cat-body">
        <span class="cat-title">${cat.title}</span>
        <span class="cat-sub">${sub}</span>
        <span class="progress-track"><span class="progress-fill" style="background:${pal.c};width:${percent}%"></span></span>
      </span>
      <span class="cat-arrow">${ARROW_RIGHT_SVG}</span>
    </button>`;
  }).join("");

  list.querySelectorAll(".cat-card").forEach((card) => {
    card.addEventListener("click", () => openDrillCategory(card.dataset.cat));
  });
}

let drillState = { catId: null, idx: 0 };

function openDrillCategory(catId) {
  drillState = { catId, idx: 0 };
  document.getElementById("drillCategoryList").classList.add("hidden");
  document.getElementById("drillView").classList.remove("hidden");
  renderDrillItem();
}

function closeDrillCategory() {
  document.getElementById("drillCategoryList").classList.remove("hidden");
  document.getElementById("drillView").classList.add("hidden");
  renderDrillCategoryList();
}

function renderDrillItem() {
  const catIndex = DRILL_CATEGORIES.findIndex((c) => c.id === drillState.catId);
  const cat = DRILL_CATEGORIES[catIndex];
  const items = cat.pairs || cat.words;
  const item = items[drillState.idx];
  const isPair = !!cat.pairs;
  const view = document.getElementById("drillView");
  const pal = PAL[catIndex % PAL.length];
  const token = DRILL_TOK[cat.id] || "●";
  markItemVisited(progress.drillProgress, cat.id, drillState.idx);

  const progressW = Math.round(((drillState.idx + 1) / items.length) * 100);

  view.innerHTML = `
    <button class="back-link" id="backToCats">${CHEVRON_LEFT_SVG}All sound drills</button>
    <div class="detail-header">
      <span class="detail-icon" style="background:${pal.c};box-shadow:0 3px 0 ${pal.d}">${token}</span>
      <div>
        <h2 class="detail-title">${cat.title}</h2>
        <span class="detail-sub">Item ${drillState.idx + 1} of ${items.length}</span>
      </div>
    </div>
    <div class="progress-bar-lg"><span style="background:${pal.c};width:${progressW}%"></span></div>
    <div class="tip-box" style="border-left:5px solid ${pal.c}">
      <span class="tip-label" style="color:${pal.d}">Why it's tricky</span>
      <span class="tip-body">${cat.vnNote.en}</span>
      ${showVI && cat.vnNote.vi ? `<span class="tip-body-vi">🇻🇳 ${cat.vnNote.vi}</span>` : ""}
    </div>
    ${
      isPair
        ? `<div class="chip-row">
            <div class="word-chip">
              <span class="word-text">${item.a}</span>
              <button class="play-btn" style="background:${pal.c};box-shadow:0 3px 0 ${pal.d}" data-say="${item.a}">${PLAY_SVG}</button>
            </div>
            <div class="word-chip">
              <span class="word-text">${item.b}</span>
              <button class="play-btn" style="background:${pal.c};box-shadow:0 3px 0 ${pal.d}" data-say="${item.b}">${PLAY_SVG}</button>
            </div>
          </div>
          <div class="tip-line"><span class="tip-emoji">💡</span><span>${bilingualHtml(item.tip)}</span></div>
          <div class="action-row">
            <button class="mic-btn" id="micBtnA">${MIC_SVG}Try "${item.a}"</button>
            <button class="mic-btn" id="micBtnB">${MIC_SVG}Try "${item.b}"</button>
          </div>
          <div class="result-box" id="resultBox"></div>`
        : `<div class="chip-row">
            <div class="word-chip">
              <span class="word-text">${item.word}</span>
              <button class="play-btn" style="background:${pal.c};box-shadow:0 3px 0 ${pal.d}" data-say="${item.word}">${PLAY_SVG}</button>
            </div>
          </div>
          <div class="breakdown-line">Breakdown · ${item.breakdown}</div>
          <div class="tip-line"><span class="tip-emoji">💡</span><span>${bilingualHtml(item.tip)}</span></div>
          <div class="action-row">
            <button class="mic-btn" id="micBtnA">${MIC_SVG}Try it</button>
          </div>
          <div class="result-box" id="resultBox"></div>`
    }
    <div class="nav-buttons">
      <button class="btn-secondary ${drillState.idx === 0 ? "is-disabled" : ""}" id="prevItem" ${drillState.idx === 0 ? "disabled" : ""}>${CHEVRON_LEFT_SVG}Back</button>
      <button class="btn-primary" id="nextItem">${drillState.idx === items.length - 1 ? "Finish" : "Next"}${CHEVRON_RIGHT_SVG}</button>
    </div>
  `;

  view.querySelector("#backToCats").addEventListener("click", closeDrillCategory);
  view.querySelectorAll(".play-btn").forEach((b) => {
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      speak(b.dataset.say);
    });
  });

  const resultBox = view.querySelector("#resultBox");

  function runWordAttempt(targetWord, soundLabel) {
    if (azureConfig.usePA && azureConfigured()) {
      runAzureWordAttempt(targetWord, soundLabel);
      return;
    }
    if (!speechSupported()) {
      resultBox.className = "result-box show warn";
      resultBox.innerHTML = "Speech recognition isn't available in this browser. Try Chrome on desktop or Android to get scored feedback.";
      return;
    }
    const micBtns = view.querySelectorAll(".mic-btn");
    micBtns.forEach((m) => (m.disabled = true));
    const activeBtn = [...micBtns].find((m) => m.textContent.includes(targetWord));
    if (activeBtn) activeBtn.classList.add("recording");

    startRecognition(
      (alternatives) => {
        micBtns.forEach((m) => (m.disabled = false));
        if (activeBtn) activeBtn.classList.remove("recording");
        const { matched, heard } = scoreWord(targetWord, alternatives);
        resultBox.classList.add("show");
        if (matched) {
          resultBox.className = "result-box show good";
          resultBox.innerHTML = `✅ Nice! Heard: "<b>${heard}</b>" — matches "${targetWord}".`;
        } else {
          resultBox.className = "result-box show bad";
          resultBox.innerHTML = `🔁 Heard: "<b>${heard || "(nothing clear)"}</b>" — expected "${targetWord}". ${item.tip ? "Tip: " + bilingualHtml(item.tip) : ""}`;
          recordMiss(soundLabel);
        }
      },
      (errMsg) => {
        micBtns.forEach((m) => (m.disabled = false));
        if (activeBtn) activeBtn.classList.remove("recording");
        resultBox.className = "result-box show warn";
        resultBox.innerHTML = errMsg;
      }
    );
  }

  function runAzureWordAttempt(targetWord, soundLabel) {
    const micBtns = view.querySelectorAll(".mic-btn");
    micBtns.forEach((m) => (m.disabled = true));
    const activeBtn = [...micBtns].find((m) => m.textContent.includes(targetWord));
    if (activeBtn) activeBtn.classList.add("recording");
    resultBox.className = "result-box show warn";
    resultBox.innerHTML = "🎙️ Listening… (Azure Pronunciation Assessment)";

    azurePronunciationAssess(targetWord).then(
      (res) => {
        micBtns.forEach((m) => (m.disabled = false));
        if (activeBtn) activeBtn.classList.remove("recording");
        const passed = res.pronScore >= 70;
        if (passed) {
          resultBox.className = "result-box show good";
          resultBox.innerHTML = `✅ Azure score: <b>${res.pronScore}/100</b> (accuracy ${res.accuracy}, fluency ${res.fluency}). Heard: "${res.text}"`;
        } else {
          resultBox.className = "result-box show bad";
          resultBox.innerHTML = `🔁 Azure score: <b>${res.pronScore}/100</b> (accuracy ${res.accuracy}, fluency ${res.fluency}). Heard: "${res.text}". ${item.tip ? "Tip: " + bilingualHtml(item.tip) : ""}`;
          recordMiss(soundLabel);
        }
      },
      (err) => {
        micBtns.forEach((m) => (m.disabled = false));
        if (activeBtn) activeBtn.classList.remove("recording");
        resultBox.className = "result-box show warn";
        resultBox.innerHTML = `Azure error: ${err.message} — check your key/region in Settings, or turn off Azure Pronunciation Assessment to use the free fallback.`;
      }
    );
  }

  const micA = view.querySelector("#micBtnA");
  if (micA) micA.addEventListener("click", () => runWordAttempt(isPair ? item.a : item.word, cat.title));
  const micB = view.querySelector("#micBtnB");
  if (micB) micB.addEventListener("click", () => runWordAttempt(item.b, cat.title));

  view.querySelector("#prevItem").addEventListener("click", () => {
    if (drillState.idx > 0) {
      drillState.idx--;
      renderDrillItem();
    }
  });
  view.querySelector("#nextItem").addEventListener("click", () => {
    if (drillState.idx < items.length - 1) {
      drillState.idx++;
      renderDrillItem();
    } else {
      recordSession({ type: "drill", category: cat.title, score: null });
      showToast(`Finished "${cat.title}" drill set! 🎉`);
      closeDrillCategory();
    }
  });
}

// ----------------------- Shadowing tab -----------------------

function renderShadowSetList() {
  const list = document.getElementById("shadowSetList");
  list.innerHTML = SHADOWING_SETS.map((set, i) => {
    const percent = getCompletionPercent(progress.shadowProgress, set.id, set.sentences.length);
    const pal = PAL[(i + 3) % PAL.length];
    const icon = SET_ICON[set.id] || "chat";
    const sub = `${set.sentences.length} sentences${percent > 0 ? ` · ${percent}%` : ""}`;
    return `<button class="cat-card" data-set="${set.id}">
      <span class="cat-icon" style="background:${pal.c};box-shadow:0 3px 0 ${pal.d}">${iconSvg(icon, 2.1)}</span>
      <span class="cat-body">
        <span class="cat-title">${set.title}</span>
        <span class="cat-sub-row">
          <span class="level-badge" style="color:${pal.d};background:${pal.t}">${set.level}</span>
          <span class="cat-sub">${sub}</span>
        </span>
        <span class="progress-track"><span class="progress-fill" style="background:${pal.c};width:${percent}%"></span></span>
      </span>
      <span class="cat-arrow">${ARROW_RIGHT_SVG}</span>
    </button>`;
  }).join("");
  list.querySelectorAll(".cat-card").forEach((card) => {
    card.addEventListener("click", () => openShadowSet(card.dataset.set));
  });
}

let shadowState = { setId: null, idx: 0, scores: [] };

function openShadowSet(setId) {
  shadowState = { setId, idx: 0, scores: [] };
  document.getElementById("shadowSetList").classList.add("hidden");
  document.getElementById("shadowView").classList.remove("hidden");
  renderShadowItem();
}

function closeShadowSet() {
  document.getElementById("shadowSetList").classList.remove("hidden");
  document.getElementById("shadowView").classList.add("hidden");
  renderShadowSetList();
}

function renderShadowItem() {
  const setIndex = SHADOWING_SETS.findIndex((s) => s.id === shadowState.setId);
  const set = SHADOWING_SETS[setIndex];
  const sentence = set.sentences[shadowState.idx];
  const view = document.getElementById("shadowView");
  const pal = PAL[(setIndex + 3) % PAL.length];
  const icon = SET_ICON[set.id] || "chat";
  markItemVisited(progress.shadowProgress, set.id, shadowState.idx);

  const progressW = Math.round(((shadowState.idx + 1) / set.sentences.length) * 100);

  view.innerHTML = `
    <button class="back-link" id="backToSets">${CHEVRON_LEFT_SVG}All shadowing sets</button>
    <div class="detail-header">
      <span class="detail-icon" style="background:${pal.c};box-shadow:0 3px 0 ${pal.d}">${iconSvg(icon, 2.1)}</span>
      <div>
        <h2 class="detail-title">${set.title}</h2>
        <span class="detail-sub">Sentence ${shadowState.idx + 1} of ${set.sentences.length}</span>
      </div>
    </div>
    <div class="progress-bar-lg"><span style="background:${pal.c};width:${progressW}%"></span></div>
    <div class="sentence-card">
      <p class="sentence-text">${sentence.text}</p>
      <div class="sentence-meta"><span class="tip-emoji">🎯</span><span>${bilingualHtml(sentence.focus, "vi-text")}</span></div>
    </div>
    <div class="action-row">
      <button class="play-btn-outline" id="playSlow"><span style="width:16px;height:16px;color:${pal.c};display:inline-block">${PLAY_SVG}</span>Slow</button>
      <button class="play-btn-outline" id="playNormal"><span style="width:16px;height:16px;color:${pal.c};display:inline-block">${PLAY_SVG}</span>Normal</button>
      <button class="mic-btn" id="micShadow">${MIC_SVG}Record my attempt</button>
    </div>
    <div class="result-box" id="shadowResult"></div>
    <div class="nav-buttons">
      <button class="btn-secondary ${shadowState.idx === 0 ? "is-disabled" : ""}" id="prevSent" ${shadowState.idx === 0 ? "disabled" : ""}>${CHEVRON_LEFT_SVG}Back</button>
      <button class="btn-primary" id="nextSent">${shadowState.idx === set.sentences.length - 1 ? "Finish set" : "Next"}${CHEVRON_RIGHT_SVG}</button>
    </div>
  `;

  view.querySelector("#backToSets").addEventListener("click", closeShadowSet);
  view.querySelector("#playSlow").addEventListener("click", () => speak(sentence.text, 0.6));
  view.querySelector("#playNormal").addEventListener("click", () => speak(sentence.text, 1.0));

  const resultBox = view.querySelector("#shadowResult");
  const micBtn = view.querySelector("#micShadow");

  micBtn.addEventListener("click", () => {
    if (azureConfig.usePA && azureConfigured()) {
      runAzureShadowAttempt();
      return;
    }
    if (!speechSupported()) {
      resultBox.className = "result-box show warn";
      resultBox.innerHTML = "Speech recognition isn't available in this browser. Try Chrome on desktop or Android for scoring.";
      return;
    }
    micBtn.disabled = true;
    micBtn.classList.add("recording");
    startRecognition(
      (alternatives) => {
        micBtn.disabled = false;
        micBtn.classList.remove("recording");
        const heard = alternatives[0] || "";
        const diff = wordDiff(sentence.text, heard);
        shadowState.scores.push(diff.score);
        resultBox.classList.add("show");
        const cls = diff.score >= 85 ? "good" : diff.score >= 60 ? "warn" : "bad";
        const verdict = diff.score >= 85 ? "Great match!" : diff.score >= 60 ? "Getting there" : "Keep practising";
        resultBox.className = `result-box show ${cls}`;
        resultBox.innerHTML = `
          <div class="result-score-row"><span class="result-score-num">${diff.score}%</span><span class="result-verdict">${verdict}</span></div>
          <div class="word-diff">${renderWordDiffHtml(diff)}</div>
          <div class="result-heard">Heard: "${heard}"</div>
        `;
        if (diff.score < 85) recordMiss(sentence.focus.en.split(/[;:,.]/)[0].slice(0, 40));
      },
      (errMsg) => {
        micBtn.disabled = false;
        micBtn.classList.remove("recording");
        resultBox.className = "result-box show warn";
        resultBox.innerHTML = errMsg;
      }
    );
  });

  function runAzureShadowAttempt() {
    micBtn.disabled = true;
    micBtn.classList.add("recording");
    resultBox.className = "result-box show warn";
    resultBox.innerHTML = "🎙️ Listening… (Azure Pronunciation Assessment)";

    azurePronunciationAssess(sentence.text).then(
      (res) => {
        micBtn.disabled = false;
        micBtn.classList.remove("recording");
        shadowState.scores.push(res.pronScore);
        resultBox.classList.add("show");
        const cls = res.pronScore >= 85 ? "good" : res.pronScore >= 60 ? "warn" : "bad";
        const verdict = res.pronScore >= 85 ? "Great match!" : res.pronScore >= 60 ? "Getting there" : "Keep practising";
        const wordsHtml = renderAzureWordsHtml(res.words);
        resultBox.className = `result-box show ${cls}`;
        resultBox.innerHTML = `
          <div class="result-score-row"><span class="result-score-num">${res.pronScore}%</span><span class="result-verdict">${verdict}</span></div>
          ${wordsHtml ? `<div class="word-diff">${wordsHtml}</div>` : ""}
          <div class="result-heard">Accuracy ${res.accuracy} · Fluency ${res.fluency} · Completeness ${res.completeness}. Heard: "${res.text}"</div>
        `;
        if (res.pronScore < 85) recordMiss(sentence.focus.en.split(/[;:,.]/)[0].slice(0, 40));
      },
      (err) => {
        micBtn.disabled = false;
        micBtn.classList.remove("recording");
        resultBox.className = "result-box show warn";
        resultBox.innerHTML = `Azure error: ${err.message} — check your key/region in Settings, or turn off Azure Pronunciation Assessment to use the free fallback.`;
      }
    );
  }

  view.querySelector("#prevSent").addEventListener("click", () => {
    if (shadowState.idx > 0) {
      shadowState.idx--;
      renderShadowItem();
    }
  });
  view.querySelector("#nextSent").addEventListener("click", () => {
    if (shadowState.idx < set.sentences.length - 1) {
      shadowState.idx++;
      renderShadowItem();
    } else {
      const avg = shadowState.scores.length
        ? Math.round(shadowState.scores.reduce((a, b) => a + b, 0) / shadowState.scores.length)
        : null;
      recordSession({ type: "shadow", category: set.title, score: avg });
      showToast(avg !== null ? `Set complete! Average match: ${avg}%` : "Set complete!");
      closeShadowSet();
    }
  });
}

// ----------------------- Settings tab -----------------------

// Defined at module scope so azureSpeak() can call it after caching a fresh
// clip, even though the Settings panel may not be the active tab right now.
function refreshTtsCacheStatsUi() {
  const sizeEl = document.getElementById("ttsCacheSize");
  if (!sizeEl) return;
  ttsCacheStats().then(({ count, bytes }) => {
    const mb = bytes / (1024 * 1024);
    sizeEl.textContent = `${count} ${count === 1 ? "entry" : "entries"} · ${mb < 0.01 && bytes > 0 ? "<0.01" : mb.toFixed(2)} MB`;
  });
}

function setupSettingsTab() {
  const ttsSwitch = document.getElementById("toggleAzureTts");
  const paSwitch = document.getElementById("toggleAzurePa");
  const keyInput = document.getElementById("azureKeyInput");
  const regionInput = document.getElementById("azureRegionInput");
  const saveBtn = document.getElementById("saveAzureSettings");
  const statusEl = document.getElementById("azureStatus");
  const clearCacheBtn = document.getElementById("clearTtsCache");

  keyInput.value = azureConfig.key || "";
  regionInput.value = azureConfig.region || "";
  ttsSwitch.setAttribute("aria-checked", String(!!azureConfig.useTts));
  paSwitch.setAttribute("aria-checked", String(!!azureConfig.usePA));

  function refreshStatus() {
    if (!azureConfigured()) {
      statusEl.className = "settings-status is-off";
      statusEl.textContent = "Not configured — add a key + region above to enable Azure features.";
    } else {
      const parts = [];
      if (azureConfig.useTts) parts.push("TTS");
      if (azureConfig.usePA) parts.push("Pronunciation Assessment");
      statusEl.className = "settings-status is-ok";
      statusEl.textContent = parts.length
        ? `Configured — Azure active for: ${parts.join(", ")}.`
        : "Configured, but both Azure toggles are off — using free browser features.";
    }
  }

  function toggle(switchEl, key) {
    switchEl.addEventListener("click", () => {
      if (!azureConfigured()) {
        showToast("Add your Azure key + region below first, then save.");
        return;
      }
      azureConfig[key] = !azureConfig[key];
      switchEl.setAttribute("aria-checked", String(azureConfig[key]));
      saveAzureConfig(azureConfig);
      refreshStatus();
    });
  }
  toggle(ttsSwitch, "useTts");
  toggle(paSwitch, "usePA");

  saveBtn.addEventListener("click", () => {
    azureConfig.key = keyInput.value.trim();
    azureConfig.region = regionInput.value.trim();
    if (!azureConfigured()) {
      azureConfig.useTts = false;
      azureConfig.usePA = false;
      ttsSwitch.setAttribute("aria-checked", "false");
      paSwitch.setAttribute("aria-checked", "false");
    }
    saveAzureConfig(azureConfig);
    azureTokenCache = { token: null, region: null, key: null, ts: 0 };
    refreshStatus();
    showToast(azureConfigured() ? "Azure settings saved." : "Azure key/region cleared.");
  });

  clearCacheBtn.addEventListener("click", () => {
    ttsCacheClear().then(() => {
      refreshTtsCacheStatsUi();
      showToast("TTS cache cleared.");
    });
  });

  refreshStatus();
  refreshTtsCacheStatsUi();
}

// ----------------------- Progress tab -----------------------

function renderProgressTab() {
  document.getElementById("streakNum").textContent = String(progress.streak || 0);

  const totalSessions = progress.sessions.length;
  const shadowScores = progress.sessions.filter((s) => s.type === "shadow" && s.score !== null).map((s) => s.score);
  const avgScore = shadowScores.length ? Math.round(shadowScores.reduce((a, b) => a + b, 0) / shadowScores.length) : null;
  const totalMisses = Object.values(progress.soundMisses).reduce((a, b) => a + b, 0);

  const stats = [
    { num: String(totalSessions), label: "Sessions done", color: "#34c759", icon: "cap" },
    { num: avgScore === null ? "—" : avgScore + "%", label: "Avg. shadowing match", color: "#37bdf3", icon: "star" },
    { num: String(progress.streak || 0), label: "Day streak", color: "#ff8a3d", icon: "sparkle" },
    { num: String(totalMisses), label: "Points to practise", color: "#a385ff", icon: "smile" },
  ];

  document.getElementById("statGrid").innerHTML = stats
    .map(
      (s) => `<div class="stat-box">
        <span class="stat-icon" style="background:${s.color}">${iconSvg(s.icon, 2.1)}</span>
        <div class="stat-num" style="color:${s.color}">${s.num}</div>
        <div class="stat-label">${s.label}</div>
      </div>`
    )
    .join("");

  const focusEntries = Object.entries(progress.soundMisses).sort((a, b) => b[1] - a[1]).slice(0, 6);
  document.getElementById("focusAreas").innerHTML = focusEntries.length
    ? focusEntries.map(([label, count]) => `<div class="focus-item"><span class="focus-label">${label}</span><span class="focus-count">${count}×</span></div>`).join("")
    : `<div class="empty-state">No focus areas yet — finish a few drills or shadowing sentences to see your weak spots here.</div>`;

  document.getElementById("recentSessions").innerHTML = progress.sessions.length
    ? progress.sessions
        .slice(0, 8)
        .map((s) => {
          const d = new Date(s.date);
          const dateLabel = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
          const hasScore = s.score !== null && s.score !== undefined;
          return `<div class="recent-item"><span class="recent-cat"><span class="recent-date">${dateLabel}</span> · ${s.category}</span><span class="recent-score" style="color:${hasScore ? "#34c759" : "#9a9388"}">${hasScore ? s.score + "%" : "done"}</span></div>`;
        })
        .join("")
    : `<div class="empty-state">Your completed sessions will show up here.</div>`;
}

document.getElementById("resetProgress").addEventListener("click", () => {
  if (confirm("Reset all progress? This can't be undone.")) {
    progress = { sessions: [], soundMisses: {}, lastDay: null, streak: 0, drillProgress: {}, shadowProgress: {} };
    saveProgress(progress);
    renderProgressTab();
    renderDrillCategoryList();
    renderShadowSetList();
    showToast("Progress reset.");
  }
});

// ----------------------- Init -----------------------

if ("speechSynthesis" in window) {
  // Some browsers load voices async; prime the list.
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

setupViToggle();
setupSettingsTab();
renderDrillCategoryList();
renderShadowSetList();
renderProgressTab();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
