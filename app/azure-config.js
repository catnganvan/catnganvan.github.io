// ============================================================
// Azure config (optional, BYO key) — all Azure features are opt-in
// and gated behind toggles in the Settings tab. The key/region are
// entered by the user and stored only in this browser's localStorage —
// never hardcoded in source, never sent anywhere but Azure. With no
// backend, the key IS visible in this browser's dev tools/network
// tab; that's a documented tradeoff for personal/pilot use (see README).
// ============================================================

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
