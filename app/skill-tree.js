// ============================================================
// Skill tree — an alternate view of the Sound Drills tab that frames
// the 16 categories as a small progression: 8 "Foundations" (always
// unlocked) and 8 "Advanced" categories that unlock once their paired
// Foundation category has been completed once (see
// data/skill-tree.js for the prerequisite pairing).
//
// Mastery stars per category (only shown once a category is fully
// completed at least once):
//   3 stars — ≥85% of recorded attempts in that category were hits
//   2 stars — ≥60% accuracy, OR completed with no recorded mic attempts
//             at all (e.g. unsupported browser) — benefit of the doubt
//   1 star  — completed, but accuracy below 60%
//
// Depends on: data/drill-categories.js, data/skill-tree.js, storage.js,
// design-tokens.js, drills-ui.js (renderDrillCategoryList/openDrillCategory),
// toast.js.
// ============================================================

let drillViewMode = "list"; // "list" | "tree"

function getCategoryMastery(cat) {
  const itemCount = (cat.pairs || cat.words).length;
  const completion = getCompletionPercent(progress.drillProgress, cat.id, itemCount);
  const stat = progress.soundStats[cat.title] || { hits: 0, misses: 0 };
  const attempts = stat.hits + stat.misses;
  const accuracy = attempts ? stat.hits / attempts : null;

  if (completion < 100) return { stars: 0, completion, accuracy, attempts };

  let stars;
  if (accuracy === null) stars = 2;
  else if (accuracy >= 0.85) stars = 3;
  else if (accuracy >= 0.6) stars = 2;
  else stars = 1;

  return { stars, completion, accuracy, attempts };
}

function isCategoryUnlocked(cat) {
  const prereqId = SKILL_TREE_PREREQS[cat.id];
  if (!prereqId) return true;
  const prereqCat = DRILL_CATEGORIES.find((c) => c.id === prereqId);
  if (!prereqCat) return true;
  const itemCount = (prereqCat.pairs || prereqCat.words).length;
  return getCompletionPercent(progress.drillProgress, prereqCat.id, itemCount) >= 100;
}

function starsHtml(stars) {
  let html = "";
  for (let i = 0; i < 3; i++) html += i < stars ? STAR_FILLED_SVG : STAR_EMPTY_SVG;
  return `<span class="node-stars">${html}</span>`;
}

function renderSkillTreeNode(cat, i) {
  const pal = PAL[i % PAL.length];
  const token = DRILL_TOK[cat.id] || "●";
  const unlocked = isCategoryUnlocked(cat);
  const mastery = getCategoryMastery(cat);
  const prereqId = SKILL_TREE_PREREQS[cat.id];
  const prereqTitle = prereqId ? (DRILL_CATEGORIES.find((c) => c.id === prereqId) || {}).title : null;

  return `<button class="tree-node ${unlocked ? "" : "is-locked"}" data-cat="${cat.id}" ${unlocked ? "" : "data-locked-prereq=\"" + prereqTitle + "\""}>
    <span class="tree-node-icon" style="background:${unlocked ? pal.c : "#cfc8bd"};box-shadow:0 3px 0 ${unlocked ? pal.d : "#b3aca1"}">${unlocked ? token : LOCK_SVG}</span>
    <span class="tree-node-title">${cat.title}</span>
    ${unlocked ? starsHtml(mastery.stars) : `<span class="tree-node-lock-note">Unlocks after ${prereqTitle}</span>`}
  </button>`;
}

function renderSkillTree() {
  const container = document.getElementById("skillTreeView");
  if (!container) return;
  const tier1 = DRILL_CATEGORIES.filter((c) => !SKILL_TREE_PREREQS[c.id]);
  const tier2 = DRILL_CATEGORIES.filter((c) => SKILL_TREE_PREREQS[c.id]);

  container.innerHTML = `
    <h3 class="section-h3 tree-section-h3">Foundations</h3>
    <p class="section-subtitle">Always unlocked — start anywhere.</p>
    <div class="tree-grid">${tier1.map((c) => renderSkillTreeNode(c, DRILL_CATEGORIES.indexOf(c))).join("")}</div>
    <h3 class="section-h3 tree-section-h3">Advanced</h3>
    <p class="section-subtitle">Each unlocks once its related foundation is finished once.</p>
    <div class="tree-grid">${tier2.map((c) => renderSkillTreeNode(c, DRILL_CATEGORIES.indexOf(c))).join("")}</div>
  `;

  container.querySelectorAll(".tree-node").forEach((node) => {
    node.addEventListener("click", () => {
      if (node.classList.contains("is-locked")) {
        showToast(`🔒 Finish "${node.dataset.lockedPrereq}" first to unlock this.`);
        return;
      }
      openDrillCategory(node.dataset.cat);
    });
  });
}

function refreshSkillTreeIfVisible() {
  const container = document.getElementById("skillTreeView");
  if (container && !container.classList.contains("hidden")) renderSkillTree();
}

function setupDrillViewToggle() {
  const toggle = document.getElementById("drillViewToggle");
  if (!toggle) return;
  toggle.querySelectorAll(".view-toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      drillViewMode = btn.dataset.view;
      toggle.querySelectorAll(".view-toggle-btn").forEach((b) => b.classList.toggle("active", b === btn));
      const list = document.getElementById("drillCategoryList");
      const tree = document.getElementById("skillTreeView");
      if (drillViewMode === "tree") {
        list.classList.add("hidden");
        tree.classList.remove("hidden");
        renderSkillTree();
      } else {
        tree.classList.add("hidden");
        list.classList.remove("hidden");
        renderDrillCategoryList();
      }
    });
  });
}
