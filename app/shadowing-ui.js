// ============================================================
// Shadowing tab — sentence set list and the per-sentence shadowing
// view (play model audio at two speeds, record + score attempt).
// Depends on: data/shadowing-sets.js, storage.js, design-tokens.js,
// tts.js, recognition.js, scoring.js, pronunciation-assessment.js,
// azure-config.js, i18n.js, toast.js.
// ============================================================

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

  // Used to flag a sound for the "Focus areas" list / daily challenge picks
  // when an attempt falls short — the sentence's own focus tip doubles as
  // a label, truncated to its first clause so it stays short in the UI.
  const focusLabel = () => sentence.focus.en.split(/[;:,.]/)[0].slice(0, 40);

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
        if (diff.score < 85) recordMiss(focusLabel());
        else recordHit(focusLabel());
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
        if (res.pronScore < 85) recordMiss(focusLabel());
        else recordHit(focusLabel());
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
