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
