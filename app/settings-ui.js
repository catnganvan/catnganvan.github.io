// ============================================================
// Settings tab — Azure key/region form, the two Azure feature
// toggles, and TTS cache stats/clear. Depends on: azure-config.js,
// tts.js (for azureTokenCache reset), tts-cache.js, toast.js.
// ============================================================

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
