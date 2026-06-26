// ============================================================
// Skill tree configuration for the Sound Drills tab.
//
// Tier 1 = the original 8 foundational categories — always unlocked.
// Tier 2 = the 8 categories added later, each paired with a related
// Tier 1 category. A Tier 2 category unlocks once its paired Tier 1
// category has been fully gone through at least once, since the two
// sounds are related interference patterns (e.g. the n-vs-l "Hanoi
// merge" is the same liquid-consonant confusion family as r-vs-l).
// ============================================================

const SKILL_TREE_PREREQS = {
  "n-vs-l": "r-vs-l",
  "v-vs-w": "th-sounds",
  "aspiration": "consonant-clusters",
  "z-sound": "s-sh-ch",
  "diphthongs": "vowel-length",
  "final-n-ng": "endings",
  "silent-letters": "final-consonants",
  "intonation": "word-stress",
};
