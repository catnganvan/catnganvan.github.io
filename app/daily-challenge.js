// ============================================================
// Daily Weak-Spot Challenge — a 5-item mixed set (drill words +
// shadowing sentences) picked from the learner's most-flagged focus
// areas, refreshed once per calendar day. The same 5 picks persist
// across reloads within a day (seeded by date), and which of the 5
// are already done also persists, so closing the app mid-challenge
// doesn't lose progress.
//
// Depends on: data/drill-categories.js, data/shadowing-sets.js,
// storage.js, design-tokens.js, tts.js, recognition.js, scoring.js,
// pronunciation-assessment.js, azure-config.js, i18n.js, toast.js.
// ============================================================

const DAILY_CHALLENGE_KEY = "speakvn_daily_challenge_v1";
const DAILY_CHALLENGE_SIZE = 5;

function loadDailyChallenge() {
  try {
    const raw = localStorage.getItem(DAILY_CHALLENGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function saveDailyChallenge(c) {
  localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(c));
}

// Small deterministic PRNG (mulberry32-ish) seeded from a string, so the
// same shuffle/picks happen all day for a given date but change daily.
function seededRandom(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822519);
    h = Math.imul(h ^ (h >>> 13), 3266489917);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function shuffleWithRandom(arr, rand) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function topFocusLabels(n = 5) {
  return Object.entries(progress.soundMisses)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([label]) => label);
}

// Items pulled specifically from the learner's recorded weak spots.
function buildWeakSpotPool(labels) {
  const pool = [];
  if (!labels.length) return pool;
  DRILL_CATEGORIES.forEach((cat) => {
    if (!labels.includes(cat.title)) return;
    (cat.pairs || cat.words).forEach((item, idx) => pool.push({ type: "drill", catId: cat.id, idx }));
  });
  SHADOWING_SETS.forEach((set) => {
    set.sentences.forEach((sentence, idx) => {
      const label = sentence.focus.en.split(/[;:,.]/)[0].slice(0, 40);
      if (labels.includes(label)) pool.push({ type: "shadow", setId: set.id, idx });
    });
  });
  return pool;
}

// Fallback used when there isn't enough (or any) miss history yet —
// favors content the learner hasn't fully completed, so the challenge
// is still useful from day one.
function buildFallbackPool() {
  const pool = [];
  DRILL_CATEGORIES.forEach((cat) => {
    const total = (cat.pairs || cat.words).length;
    const percent = getCompletionPercent(progress.drillProgress, cat.id, total);
    if (percent < 100) (cat.pairs || cat.words).forEach((item, idx) => pool.push({ type: "drill", catId: cat.id, idx }));
  });
  SHADOWING_SETS.forEach((set) => {
    const percent = getCompletionPercent(progress.shadowProgress, set.id, set.sentences.length);
    if (percent < 100) set.sentences.forEach((s, idx) => pool.push({ type: "shadow", setId: set.id, idx }));
  });
  return pool;
}

function sameRef(a, b) {
  return a.type === b.type && a.catId === b.catId && a.setId === b.setId && a.idx === b.idx;
}

function generateDailyChallenge(date) {
  const labels = topFocusLabels();
  let pool = buildWeakSpotPool(labels);
  if (pool.length < DAILY_CHALLENGE_SIZE) {
    const fallback = buildFallbackPool().filter((f) => !pool.some((p) => sameRef(p, f)));
    pool = pool.concat(fallback);
  }
  const rand = seededRandom(date);
  const items = shuffleWithRandom(pool, rand).slice(0, DAILY_CHALLENGE_SIZE);
  return { date, items, completed: [] };
}

function getOrCreateDailyChallenge() {
  const today = todayStr();
  let c = loadDailyChallenge();
  if (!c || c.date !== today || !c.items || !c.items.length) {
    c = generateDailyChallenge(today);
    saveDailyChallenge(c);
  }
  return c;
}

function resetDailyChallenge() {
  localStorage.removeItem(DAILY_CHALLENGE_KEY);
  renderDailyChallengeCard();
}

function resolveChallengeItem(ref) {
  if (ref.type === "drill") {
    const cat = DRILL_CATEGORIES.find((c) => c.id === ref.catId);
    if (!cat) return null;
    const items = cat.pairs || cat.words;
    return { type: "drill", cat, item: items[ref.idx] };
  }
  const set = SHADOWING_SETS.find((s) => s.id === ref.setId);
  if (!set) return null;
  return { type: "shadow", set, sentence: set.sentences[ref.idx] };
}

// ----------------------- Banner card -----------------------

function renderDailyChallengeCard() {
  const container = document.getElementById("dailyChallengeCard");
  if (!container) return;
  const challenge = getOrCreateDailyChallenge();
  const total = challenge.items.length;
  const done = challenge.completed.length;
  const allDone = total > 0 && done >= total;

  container.innerHTML = `
    <div class="challenge-card-inner ${allDone ? "is-done" : ""}">
      <span class="challenge-icon">${allDone ? "🏆" : "🔥"}</span>
      <div class="challenge-body">
        <span class="challenge-title">${allDone ? "Daily Challenge complete!" : "Daily Weak-Spot Challenge"}</span>
        <span class="challenge-sub">${allDone ? "Come back tomorrow for a new set." : `${done}/${total} done · 5 picks targeting your trickiest sounds`}</span>
      </div>
      <button class="btn-primary challenge-btn" id="dailyChallengeBtn" ${allDone ? "disabled" : ""}>${done > 0 && !allDone ? "Continue" : "Start"}</button>
    </div>
  `;
  if (!allDone) {
    container.querySelector("#dailyChallengeBtn").addEventListener("click", openDailyChallenge);
  }
}

// ----------------------- Challenge session -----------------------

let challengeState = { idx: 0, items: [], completed: new Set() };

function openDailyChallenge() {
  const challenge = getOrCreateDailyChallenge();
  challengeState = {
    idx: challenge.completed.length < challenge.items.length ? challenge.completed.length : 0,
    items: challenge.items,
    completed: new Set(challenge.completed),
  };
  document.getElementById("drillCategoryList").classList.add("hidden");
  document.getElementById("skillTreeView").classList.add("hidden");
  document.getElementById("dailyChallengeCard").classList.add("hidden");
  const toggle = document.getElementById("drillViewToggle");
  if (toggle) toggle.classList.add("hidden");
  document.getElementById("challengeView").classList.remove("hidden");
  renderChallengeItem();
}

function closeDailyChallenge() {
  document.getElementById("challengeView").classList.add("hidden");
  const toggle = document.getElementById("drillViewToggle");
  if (toggle) toggle.classList.remove("hidden");
  document.getElementById("dailyChallengeCard").classList.remove("hidden");
  if (drillViewMode === "tree") {
    document.getElementById("skillTreeView").classList.remove("hidden");
    renderSkillTree();
  } else {
    document.getElementById("drillCategoryList").classList.remove("hidden");
    renderDrillCategoryList();
  }
  renderDailyChallengeCard();
}

function persistChallengeCompletion() {
  const c = loadDailyChallenge();
  if (!c) return;
  c.completed = [...challengeState.completed];
  saveDailyChallenge(c);
}

function renderChallengeItem() {
  const view = document.getElementById("challengeView");
  const ref = challengeState.items[challengeState.idx];
  const resolved = ref && resolveChallengeItem(ref);

  if (!resolved) {
    // Content this ref pointed to no longer exists (shouldn't normally
    // happen) — skip straight to the finish screen instead of crashing.
    finishChallenge();
    return;
  }

  const isDrill = resolved.type === "drill";
  const targetText = isDrill ? (resolved.item.a || resolved.item.word) : resolved.sentence.text;
  const soundLabel = isDrill ? resolved.cat.title : resolved.sentence.focus.en.split(/[;:,.]/)[0].slice(0, 40);
  const tip = isDrill ? resolved.item.tip : resolved.sentence.focus;
  const alreadyDone = challengeState.completed.has(challengeState.idx);
  const progressW = Math.round(((challengeState.idx + 1) / challengeState.items.length) * 100);

  view.innerHTML = `
    <button class="back-link" id="backFromChallenge">${CHEVRON_LEFT_SVG}Exit challenge</button>
    <div class="detail-header">
      <span class="detail-icon" style="background:#ff8a3d;box-shadow:0 3px 0 #e6731f">🔥</span>
      <div>
        <h2 class="detail-title">Daily Challenge</h2>
        <span class="detail-sub">Item ${challengeState.idx + 1} of ${challengeState.items.length}${alreadyDone ? " · already done" : ""}</span>
      </div>
    </div>
    <div class="progress-bar-lg"><span style="background:#ff8a3d;width:${progressW}%"></span></div>
    <div class="sentence-card">
      <p class="sentence-text">${targetText}</p>
      ${tip ? `<div class="sentence-meta"><span class="tip-emoji">🎯</span><span>${bilingualHtml(tip, "vi-text")}</span></div>` : ""}
    </div>
    <div class="action-row">
      <button class="play-btn-outline" id="challengePlay"><span style="width:16px;height:16px;color:#ff8a3d;display:inline-block">${PLAY_SVG}</span>Play</button>
      <button class="mic-btn" id="challengeMic">${MIC_SVG}Record my attempt</button>
    </div>
    <div class="result-box" id="challengeResult"></div>
    <div class="nav-buttons">
      <button class="btn-secondary ${challengeState.idx === 0 ? "is-disabled" : ""}" id="challengePrev" ${challengeState.idx === 0 ? "disabled" : ""}>${CHEVRON_LEFT_SVG}Back</button>
      <button class="btn-primary" id="challengeNext">${challengeState.idx === challengeState.items.length - 1 ? "Finish" : "Next"}${CHEVRON_RIGHT_SVG}</button>
    </div>
  `;

  view.querySelector("#backFromChallenge").addEventListener("click", closeDailyChallenge);
  view.querySelector("#challengePlay").addEventListener("click", () => speak(targetText, 0.85));

  const resultBox = view.querySelector("#challengeResult");
  const micBtn = view.querySelector("#challengeMic");

  function markDone(success) {
    challengeState.completed.add(challengeState.idx);
    persistChallengeCompletion();
    if (success) recordHit(soundLabel);
    else recordMiss(soundLabel);
  }

  micBtn.addEventListener("click", () => {
    if (azureConfig.usePA && azureConfigured()) {
      runAzureAttempt();
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
        resultBox.classList.add("show");
        if (isDrill) {
          const { matched, heard } = scoreWord(targetText, alternatives);
          resultBox.className = `result-box show ${matched ? "good" : "bad"}`;
          resultBox.innerHTML = matched
            ? `✅ Nice! Heard: "<b>${heard}</b>" — matches "${targetText}".`
            : `🔁 Heard: "<b>${heard || "(nothing clear)"}</b>" — expected "${targetText}".`;
          markDone(matched);
        } else {
          const heard = alternatives[0] || "";
          const diff = wordDiff(targetText, heard);
          const cls = diff.score >= 85 ? "good" : diff.score >= 60 ? "warn" : "bad";
          resultBox.className = `result-box show ${cls}`;
          resultBox.innerHTML = `
            <div class="result-score-row"><span class="result-score-num">${diff.score}%</span></div>
            <div class="word-diff">${renderWordDiffHtml(diff)}</div>
          `;
          markDone(diff.score >= 85);
        }
      },
      (errMsg) => {
        micBtn.disabled = false;
        micBtn.classList.remove("recording");
        resultBox.className = "result-box show warn";
        resultBox.innerHTML = errMsg;
      }
    );
  });

  function runAzureAttempt() {
    micBtn.disabled = true;
    micBtn.classList.add("recording");
    resultBox.className = "result-box show warn";
    resultBox.innerHTML = "🎙️ Listening… (Azure Pronunciation Assessment)";
    azurePronunciationAssess(targetText).then(
      (res) => {
        micBtn.disabled = false;
        micBtn.classList.remove("recording");
        resultBox.classList.add("show");
        const cls = res.pronScore >= 85 ? "good" : res.pronScore >= 60 ? "warn" : "bad";
        resultBox.className = `result-box show ${cls}`;
        resultBox.innerHTML = `<div class="result-score-row"><span class="result-score-num">${res.pronScore}%</span></div><div class="result-heard">Heard: "${res.text}"</div>`;
        markDone(res.pronScore >= 70);
      },
      (err) => {
        micBtn.disabled = false;
        micBtn.classList.remove("recording");
        resultBox.className = "result-box show warn";
        resultBox.innerHTML = `Azure error: ${err.message}`;
      }
    );
  }

  view.querySelector("#challengePrev").addEventListener("click", () => {
    if (challengeState.idx > 0) {
      challengeState.idx--;
      renderChallengeItem();
    }
  });
  view.querySelector("#challengeNext").addEventListener("click", () => {
    if (challengeState.idx < challengeState.items.length - 1) {
      challengeState.idx++;
      renderChallengeItem();
    } else {
      finishChallenge();
    }
  });
}

function finishChallenge() {
  const total = challengeState.items.length;
  const done = challengeState.completed.size;
  recordSession({ type: "challenge", category: "Daily Challenge", score: null });
  showToast(done >= total ? "🏆 Daily Challenge complete! Come back tomorrow for a new set." : "Challenge progress saved.");
  closeDailyChallenge();
}
