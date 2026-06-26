// ============================================================
// Vietnamese-translation toggle ("VI" button in the header). When on,
// every bilingual tip/explanation also shows its Vietnamese text.
// Depends on: toast.js, and (at call time only) the drill/shadow
// renderers to refresh the currently open view.
// ============================================================

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
