// ============================================================
// Toast — small transient status messages at the bottom of the screen.
// ============================================================

let toastTimer = null;
function showToast(msg, ms = 2600) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), ms);
}
