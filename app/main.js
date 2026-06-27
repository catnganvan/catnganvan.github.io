// ============================================================
// Init — wires up the tab nav, primes speechSynthesis voices, runs the
// first render of every tab/feature, and registers the service worker.
// Loaded last so every function/var from the other app/*.js files it
// calls is already defined.
// ============================================================

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

if ("speechSynthesis" in window) {
  // Some browsers load voices async; prime the list.
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

// Easter egg: tapping the brand icon next to "SpeakVaN!" reads out a
// playful greeting. "Vuhn" is a phonetic respelling so the TTS engine
// says the Vietnamese name "Van" with the same central vowel as "Vern"
// but without the rhotic R sound (closer to "fun"'s vowel than "van"'s),
// instead of the English word "van" (vehicle).
document.getElementById("brandMark").addEventListener("click", () => {
  speak("Speak more Vuhn! Eat more Vuhn, listen to your Daddy Vuhn", 0.95);
});

setupViToggle();
setupSettingsTab();
setupDrillViewToggle();
renderDrillCategoryList();
renderShadowSetList();
renderProgressTab();
renderDailyChallengeCard();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
