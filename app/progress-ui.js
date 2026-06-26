// ============================================================
// Progress tab — streak, stats grid, focus areas, recent sessions,
// and the reset-progress action. Depends on: storage.js, design-tokens.js.
// ============================================================

function renderProgressTab() {
  document.getElementById("streakNum").textContent = String(progress.streak || 0);

  const totalSessions = progress.sessions.length;
  const shadowScores = progress.sessions.filter((s) => s.type === "shadow" && s.score !== null).map((s) => s.score);
  const avgScore = shadowScores.length ? Math.round(shadowScores.reduce((a, b) => a + b, 0) / shadowScores.length) : null;
  const totalMisses = Object.values(progress.soundMisses).reduce((a, b) => a + b, 0);

  const stats = [
    { num: String(totalSessions), label: "Sessions done", color: "#34c759", icon: "cap" },
    { num: avgScore === null ? "—" : avgScore + "%", label: "Avg. shadowing match", color: "#37bdf3", icon: "star" },
    { num: String(progress.streak || 0), label: "Day streak", color: "#ff8a3d", icon: "sparkle" },
    { num: String(totalMisses), label: "Points to practise", color: "#a385ff", icon: "smile" },
  ];

  document.getElementById("statGrid").innerHTML = stats
    .map(
      (s) => `<div class="stat-box">
        <span class="stat-icon" style="background:${s.color}">${iconSvg(s.icon, 2.1)}</span>
        <div class="stat-num" style="color:${s.color}">${s.num}</div>
        <div class="stat-label">${s.label}</div>
      </div>`
    )
    .join("");

  const focusEntries = Object.entries(progress.soundMisses).sort((a, b) => b[1] - a[1]).slice(0, 6);
  document.getElementById("focusAreas").innerHTML = focusEntries.length
    ? focusEntries.map(([label, count]) => `<div class="focus-item"><span class="focus-label">${label}</span><span class="focus-count">${count}×</span></div>`).join("")
    : `<div class="empty-state">No focus areas yet — finish a few drills or shadowing sentences to see your weak spots here.</div>`;

  document.getElementById("recentSessions").innerHTML = progress.sessions.length
    ? progress.sessions
        .slice(0, 8)
        .map((s) => {
          const d = new Date(s.date);
          const dateLabel = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
          const hasScore = s.score !== null && s.score !== undefined;
          return `<div class="recent-item"><span class="recent-cat"><span class="recent-date">${dateLabel}</span> · ${s.category}</span><span class="recent-score" style="color:${hasScore ? "#34c759" : "#9a9388"}">${hasScore ? s.score + "%" : "done"}</span></div>`;
        })
        .join("")
    : `<div class="empty-state">Your completed sessions will show up here.</div>`;
}

document.getElementById("resetProgress").addEventListener("click", () => {
  if (confirm("Reset all progress? This can't be undone.")) {
    progress = { sessions: [], soundMisses: {}, soundStats: {}, lastDay: null, streak: 0, drillProgress: {}, shadowProgress: {} };
    saveProgress(progress);
    renderProgressTab();
    renderDrillCategoryList();
    renderShadowSetList();
    if (typeof refreshSkillTreeIfVisible === "function") refreshSkillTreeIfVisible();
    if (typeof resetDailyChallenge === "function") resetDailyChallenge();
    showToast("Progress reset.");
  }
});
