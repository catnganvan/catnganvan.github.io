// ============================================================
// Text comparison / scoring — word-match based (did the recognizer
// hear the right words), not true phoneme-level accuracy. See README
// for the Azure Pronunciation Assessment upgrade path.
// ============================================================

function normalize(s) {
  return s
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, "")
    .trim();
}

// Word-level diff using simple LCS-based alignment, good enough for
// short learner sentences.
function wordDiff(targetText, heardText) {
  const target = normalize(targetText).split(/\s+/).filter(Boolean);
  const heard = normalize(heardText).split(/\s+/).filter(Boolean);

  const n = target.length, m = heard.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = target[i - 1] === heard[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const matched = new Array(n).fill(false);
  let i = n, j = m;
  while (i > 0 && j > 0) {
    if (target[i - 1] === heard[j - 1]) {
      matched[i - 1] = true;
      i--; j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  const matchCount = matched.filter(Boolean).length;
  const score = target.length ? Math.round((matchCount / target.length) * 100) : 0;
  return { target, matched, score };
}

function renderWordDiffHtml(diff) {
  return diff.target
    .map((w, idx) => `<span class="${diff.matched[idx] ? "match" : "miss"}">${w}</span>`)
    .join(" ");
}

function scoreWord(targetWord, alternatives) {
  const t = normalize(targetWord);
  for (const alt of alternatives) {
    if (normalize(alt) === t) return { matched: true, heard: alt };
  }
  // fuzzy: check if any alternative contains the target word as substring
  for (const alt of alternatives) {
    if (normalize(alt).includes(t)) return { matched: true, heard: alt };
  }
  return { matched: false, heard: alternatives[0] || "" };
}
