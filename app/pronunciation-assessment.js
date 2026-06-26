// ============================================================
// Azure Pronunciation Assessment — loaded lazily from CDN (the
// Microsoft Cognitive Services Speech SDK), only when the user has
// the "Use Azure Pronunciation Assessment" toggle on. Depends on:
// azure-config.js.
// ============================================================

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
