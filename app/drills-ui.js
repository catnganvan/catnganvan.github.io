// ============================================================
// Drills tab — category list, the list/skill-tree view toggle, and
// the per-item drill view (play model audio, record + score attempt).
// Depends on: data/drill-categories.js, storage.js, design-tokens.js,
// tts.js, recognition.js, scoring.js, pronunciation-assessment.js,
// azure-config.js, i18n.js, toast.js. skill-tree.js depends on this
// file's renderDrillCategoryList/openDrillCategory.
// ============================================================

function renderDrillCategoryList() {
  const list = document.getElementById("drillCategoryList");
  list.innerHTML = DRILL_CATEGORIES.map((cat, i) => {
    const itemCount = (cat.pairs || cat.words).length;
    const percent = getCompletionPercent(progress.drillProgress, cat.id, itemCount);
    const pal = PAL[i % PAL.length];
    const sub = `${itemCount} ${cat.pairs ? "pairs" : "words"}${percent > 0 ? ` · ${percent}% done` : ""}`;
    const token = DRILL_TOK[cat.id] || "●";
    return `<button class="cat-card" data-cat="${cat.id}">
      <span class="cat-icon" style="background:${pal.c};box-shadow:0 3px 0 ${pal.d}">${token}</span>
      <span class="cat-body">
        <span class="cat-title">${cat.title}</span>
        <span class="cat-sub">${sub}</span>
        <span class="progress-track"><span class="progress-fill" style="background:${pal.c};width:${percent}%"></span></span>
      </span>
      <span class="cat-arrow">${ARROW_RIGHT_SVG}</span>
    </button>`;
  }).join("");

  list.querySelectorAll(".cat-card").forEach((card) => {
    card.addEventListener("click", () => openDrillCategory(card.dataset.cat));
  });
}

let drillState = { catId: null, idx: 0 };

function openDrillCategory(catId) {
  drillState = { catId, idx: 0 };
  document.getElementById("drillCategoryList").classList.add("hidden");
  const tree = document.getElementById("skillTreeView");
  if (tree) tree.classList.add("hidden");
  const toggle = document.getElementById("drillViewToggle");
  if (toggle) toggle.classList.add("hidden");
  // Only one lesson view should ever be on screen at a time — make sure
  // the daily challenge banner/view is tucked away before showing this one.
  const challengeCard = document.getElementById("dailyChallengeCard");
  if (challengeCard) challengeCard.classList.add("hidden");
  const challengeView = document.getElementById("challengeView");
  if (challengeView) challengeView.classList.add("hidden");
  document.getElementById("drillView").classList.remove("hidden");
  renderDrillItem();
}

function closeDrillCategory() {
  document.getElementById("drillView").classList.add("hidden");
  const toggle = document.getElementById("drillViewToggle");
  if (toggle) toggle.classList.remove("hidden");
  const challengeCard = document.getElementById("dailyChallengeCard");
  if (challengeCard) {
    challengeCard.classList.remove("hidden");
    if (typeof renderDailyChallengeCard === "function") renderDailyChallengeCard();
  }
  // Return to whichever view (list or skill tree) was active before.
  if (typeof drillViewMode !== "undefined" && drillViewMode === "tree") {
    document.getElementById("skillTreeView").classList.remove("hidden");
    if (typeof renderSkillTree === "function") renderSkillTree();
  } else {
    document.getElementById("drillCategoryList").classList.remove("hidden");
    renderDrillCategoryList();
  }
}

function renderDrillItem() {
  const catIndex = DRILL_CATEGORIES.findIndex((c) => c.id === drillState.catId);
  const cat = DRILL_CATEGORIES[catIndex];
  const items = cat.pairs || cat.words;
  const item = items[drillState.idx];
  const isPair = !!cat.pairs;
  const view = document.getElementById("drillView");
  const pal = PAL[catIndex % PAL.length];
  const token = DRILL_TOK[cat.id] || "●";
  markItemVisited(progress.drillProgress, cat.id, drillState.idx);

  const progressW = Math.round(((drillState.idx + 1) / items.length) * 100);

  view.innerHTML = `
    <button class="back-link" id="backToCats">${CHEVRON_LEFT_SVG}All sound drills</button>
    <div class="detail-header">
      <span class="detail-icon" style="background:${pal.c};box-shadow:0 3px 0 ${pal.d}">${token}</span>
      <div>
        <h2 class="detail-title">${cat.title}</h2>
        <span class="detail-sub">Item ${drillState.idx + 1} of ${items.length}</span>
      </div>
    </div>
    <div class="progress-bar-lg"><span style="background:${pal.c};width:${progressW}%"></span></div>
    <div class="tip-box" style="border-left:5px solid ${pal.c}">
      <span class="tip-label" style="color:${pal.d}">Why it's tricky</span>
      <span class="tip-body">${cat.vnNote.en}</span>
      ${showVI && cat.vnNote.vi ? `<span class="tip-body-vi">🇻🇳 ${cat.vnNote.vi}</span>` : ""}
    </div>
    ${
      isPair
        ? `<div class="chip-row">
            <div class="word-chip">
              <span class="word-text">${item.a}</span>
              <button class="play-btn" style="background:${pal.c};box-shadow:0 3px 0 ${pal.d}" data-say="${item.a}">${PLAY_SVG}</button>
            </div>
            <div class="word-chip">
              <span class="word-text">${item.b}</span>
              <button class="play-btn" style="background:${pal.c};box-shadow:0 3px 0 ${pal.d}" data-say="${item.b}">${PLAY_SVG}</button>
            </div>
          </div>
          <div class="tip-line"><span class="tip-emoji">💡</span><span>${bilingualHtml(item.tip)}</span></div>
          <div class="action-row">
            <button class="mic-btn" id="micBtnA">${MIC_SVG}Try "${item.a}"</button>
            <button class="mic-btn" id="micBtnB">${MIC_SVG}Try "${item.b}"</button>
          </div>
          <div class="result-box" id="resultBox"></div>`
        : `<div class="chip-row">
            <div class="word-chip">
              <span class="word-text">${item.word}</span>
              <button class="play-btn" style="background:${pal.c};box-shadow:0 3px 0 ${pal.d}" data-say="${item.word}">${PLAY_SVG}</button>
            </div>
          </div>
          <div class="breakdown-line">Breakdown · ${item.breakdown}</div>
          <div class="tip-line"><span class="tip-emoji">💡</span><span>${bilingualHtml(item.tip)}</span></div>
          <div class="action-row">
            <button class="mic-btn" id="micBtnA">${MIC_SVG}Try it</button>
          </div>
          <div class="result-box" id="resultBox"></div>`
    }
    <div class="nav-buttons">
      <button class="btn-secondary ${drillState.idx === 0 ? "is-disabled" : ""}" id="prevItem" ${drillState.idx === 0 ? "disabled" : ""}>${CHEVRON_LEFT_SVG}Back</button>
      <button class="btn-primary" id="nextItem">${drillState.idx === items.length - 1 ? "Finish" : "Next"}${CHEVRON_RIGHT_SVG}</button>
    </div>
  `;

  view.querySelector("#backToCats").addEventListener("click", closeDrillCategory);
  view.querySelectorAll(".play-btn").forEach((b) => {
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      speak(b.dataset.say);
    });
  });

  const resultBox = view.querySelector("#resultBox");

  function runWordAttempt(targetWord, soundLabel) {
    if (azureConfig.usePA && azureConfigured()) {
      runAzureWordAttempt(targetWord, soundLabel);
      return;
    }
    if (!speechSupported()) {
      resultBox.className = "result-box show warn";
      resultBox.innerHTML = "Speech recognition isn't available in this browser. Try Chrome on desktop or Android to get scored feedback.";
      return;
    }
    const micBtns = view.querySelectorAll(".mic-btn");
    micBtns.forEach((m) => (m.disabled = true));
    const activeBtn = [...micBtns].find((m) => m.textContent.includes(targetWord));
    if (activeBtn) activeBtn.classList.add("recording");

    startRecognition(
      (alternatives) => {
        micBtns.forEach((m) => (m.disabled = false));
        if (activeBtn) activeBtn.classList.remove("recording");
        const { matched, heard } = scoreWord(targetWord, alternatives);
        resultBox.classList.add("show");
        if (matched) {
          resultBox.className = "result-box show good";
          resultBox.innerHTML = `✅ Nice! Heard: "<b>${heard}</b>" — matches "${targetWord}".`;
          recordHit(soundLabel);
        } else {
          resultBox.className = "result-box show bad";
          resultBox.innerHTML = `🔁 Heard: "<b>${heard || "(nothing clear)"}</b>" — expected "${targetWord}". ${item.tip ? "Tip: " + bilingualHtml(item.tip) : ""}`;
          recordMiss(soundLabel);
        }
      },
      (errMsg) => {
        micBtns.forEach((m) => (m.disabled = false));
        if (activeBtn) activeBtn.classList.remove("recording");
        resultBox.className = "result-box show warn";
        resultBox.innerHTML = errMsg;
      }
    );
  }

  function runAzureWordAttempt(targetWord, soundLabel) {
    const micBtns = view.querySelectorAll(".mic-btn");
    micBtns.forEach((m) => (m.disabled = true));
    const activeBtn = [...micBtns].find((m) => m.textContent.includes(targetWord));
    if (activeBtn) activeBtn.classList.add("recording");
    resultBox.className = "result-box show warn";
    resultBox.innerHTML = "🎙️ Listening… (Azure Pronunciation Assessment)";

    azurePronunciationAssess(targetWord).then(
      (res) => {
        micBtns.forEach((m) => (m.disabled = false));
        if (activeBtn) activeBtn.classList.remove("recording");
        const passed = res.pronScore >= 70;
        if (passed) {
          resultBox.className = "result-box show good";
          resultBox.innerHTML = `✅ Azure score: <b>${res.pronScore}/100</b> (accuracy ${res.accuracy}, fluency ${res.fluency}). Heard: "${res.text}"`;
          recordHit(soundLabel);
        } else {
          resultBox.className = "result-box show bad";
          resultBox.innerHTML = `🔁 Azure score: <b>${res.pronScore}/100</b> (accuracy ${res.accuracy}, fluency ${res.fluency}). Heard: "${res.text}". ${item.tip ? "Tip: " + bilingualHtml(item.tip) : ""}`;
          recordMiss(soundLabel);
        }
      },
      (err) => {
        micBtns.forEach((m) => (m.disabled = false));
        if (activeBtn) activeBtn.classList.remove("recording");
        resultBox.className = "result-box show warn";
        resultBox.innerHTML = `Azure error: ${err.message} — check your key/region in Settings, or turn off Azure Pronunciation Assessment to use the free fallback.`;
      }
    );
  }

  const micA = view.querySelector("#micBtnA");
  if (micA) micA.addEventListener("click", () => runWordAttempt(isPair ? item.a : item.word, cat.title));
  const micB = view.querySelector("#micBtnB");
  if (micB) micB.addEventListener("click", () => runWordAttempt(item.b, cat.title));

  view.querySelector("#prevItem").addEventListener("click", () => {
    if (drillState.idx > 0) {
      drillState.idx--;
      renderDrillItem();
    }
  });
  view.querySelector("#nextItem").addEventListener("click", () => {
    if (drillState.idx < items.length - 1) {
      drillState.idx++;
      renderDrillItem();
    } else {
      recordSession({ type: "drill", category: cat.title, score: null });
      showToast(`Finished "${cat.title}" drill set! 🎉`);
      closeDrillCategory();
    }
  });
}
