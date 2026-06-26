// ============================================================
// Text-to-speech: free browser SpeechSynthesis by default, with an
// optional Azure neural-voice upgrade (REST token exchange + SSML
// synth) when the user has opted in and configured a key in Settings.
// Depends on: azure-config.js, tts-cache.js, toast.js.
// ============================================================

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
