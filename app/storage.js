// ============================================================
// Progress storage — everything here is persisted to localStorage
// under one JSON blob. No backend; all progress is local to this
// browser/device (see README roadmap for server-side sync).
// ============================================================

const STORAGE_KEY = "speakvn_progress_v1";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { sessions: [], soundMisses: {}, soundStats: {}, lastDay: null, streak: 0, drillProgress: {}, shadowProgress: {} };
}

function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

let progress = loadProgress();
// Older saved progress objects may predate these fields — backfill them.
if (!progress.drillProgress) progress.drillProgress = {};
if (!progress.shadowProgress) progress.shadowProgress = {};
if (!progress.soundStats) progress.soundStats = {};

// Marks a given item index as "seen" within a category/set, so we can show
// a completion percentage on the category/set list cards.
function markItemVisited(map, id, idx) {
  const visited = new Set(map[id] || []);
  visited.add(idx);
  map[id] = [...visited];
  saveProgress(progress);
}

function getCompletionPercent(map, id, total) {
  const visited = map[id];
  if (!visited || !total) return 0;
  return Math.min(100, Math.round((visited.length / total) * 100));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function bumpStreak() {
  const today = todayStr();
  if (progress.lastDay === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  progress.streak = progress.lastDay === yesterday ? progress.streak + 1 : 1;
  progress.lastDay = today;
  saveProgress(progress);
}

function recordSession(entry) {
  progress.sessions.unshift({ ...entry, date: new Date().toISOString() });
  progress.sessions = progress.sessions.slice(0, 50);
  bumpStreak();
  saveProgress(progress);
  renderProgressTab();
  // Gamification surfaces (skill tree stars, daily challenge banner) may not
  // be loaded/visible right now — guard with typeof so this file has no hard
  // dependency on them and still works if those scripts are ever removed.
  if (typeof refreshSkillTreeIfVisible === "function") refreshSkillTreeIfVisible();
  if (typeof renderDailyChallengeCard === "function") renderDailyChallengeCard();
}

// ----- Per-sound hit/miss tracking -----
// soundMisses (legacy, still used by the "Focus areas" list) just counts how
// often a sound/label was flagged. soundStats additionally tracks hits so we
// can compute an accuracy rate — used by the skill tree's star ratings and
// by the daily challenge's "weak spot" picks.

function ensureSoundStat(label) {
  if (!progress.soundStats[label]) progress.soundStats[label] = { hits: 0, misses: 0 };
  return progress.soundStats[label];
}

function recordMiss(soundLabel) {
  progress.soundMisses[soundLabel] = (progress.soundMisses[soundLabel] || 0) + 1;
  ensureSoundStat(soundLabel).misses++;
  saveProgress(progress);
}

function recordHit(soundLabel) {
  ensureSoundStat(soundLabel).hits++;
  saveProgress(progress);
}
