// ============================================================
// Browser speech recognition (free fallback) — wraps the Web Speech
// API's SpeechRecognition. Support is strong in Chrome desktop/Android,
// limited/unavailable in Safari/iOS and Firefox.
// ============================================================

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
