// ============================================================
// Design tokens: palette, per-category icon tokens, hand-drawn line
// icon set, and small reusable inline SVGs used across the UI.
// ============================================================

// Warm, Duolingo-style palette: each category/set cycles through 7 colors,
// each with a "main" tone and a darker tone used for the neumorphic offset
// shadow, plus a pale tint used for badges.

const PAL = [
  { c: "#34c759", d: "#27a345", t: "#e7f8ec" },
  { c: "#ff6b5e", d: "#e34b3d", t: "#ffece9" },
  { c: "#ffac33", d: "#e88e12", t: "#fff3df" },
  { c: "#37bdf3", d: "#1aa0db", t: "#e4f6fe" },
  { c: "#a385ff", d: "#8460f0", t: "#efe9ff" },
  { c: "#ff7eb6", d: "#ee5b9c", t: "#ffe9f4" },
  { c: "#2bd4bd", d: "#15b6a1", t: "#e1f9f5" },
];

// Short IPA-ish token shown inside each drill category's icon square.
const DRILL_TOK = {
  "final-consonants": "–d", "consonant-clusters": "skt", "th-sounds": "th",
  "r-vs-l": "r/l", "s-sh-ch": "ʃ", "vowel-length": "iː", "endings": "-ed",
  "word-stress": "ˈA", "n-vs-l": "n/l", "v-vs-w": "v/w", "aspiration": "pʰ",
  "z-sound": "z", "diphthongs": "aɪ", "final-n-ng": "ŋ", "silent-letters": "(k)",
  "intonation": "↗",
};

// Maps each shadowing set to a hand-drawn line icon.
const SET_ICON = {
  greetings: "smile", cafe: "coffee", interview: "briefcase", mrt: "train", hawker: "bowl",
  chores: "sparkle", respect: "heart", uni: "cap", friends: "users", videocall: "video",
  hostfamily: "home", groceries: "cart", clinic: "cross", phonebank: "phone", weekend: "sun",
  festivals: "star", gratitude: "plane",
  library: "cap", weather: "sun", orientation: "users", roommate: "home", parttimejob: "briefcase",
  publicspeaking: "chat", internship: "briefcase", "culture-shock": "sparkle", "long-distance": "heart",
  graduation: "star",
};

const ICONS = {
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14.5s1.4 2 4 2 4-2 4-2"/><path d="M9 9.5h.01M15 9.5h.01"/>',
  coffee: '<path d="M17 8h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M4 8h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z"/><path d="M7 2.5v2M11 2.5v2M15 2.5v2"/>',
  briefcase: '<rect x="3" y="7.5" width="18" height="12.5" rx="2.5"/><path d="M8 7.5V5.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
  train: '<rect x="5" y="3" width="14" height="13" rx="3"/><path d="M5 11h14"/><path d="M8.5 19.5 6 22M15.5 19.5 18 22"/><path d="M9 13.5h.01M15 13.5h.01"/>',
  bowl: '<path d="M3.5 11h17a8.5 8.5 0 0 1-17 0Z"/><path d="M2.5 11h19"/><path d="M11 3c-1 1.2 1 2 0 3.2"/><path d="M14.5 4c-.8 1 .8 1.6 0 2.6"/>',
  sparkle: '<path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4Z"/><path d="M18.5 14l.8 2.1 2.2.7-2.2.7-.8 2.1-.8-2.1-2.2-.7 2.2-.7Z"/>',
  heart: '<path d="M12 20.5S4 15.5 4 9.8A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8 2.8C20 15.5 12 20.5 12 20.5Z"/>',
  cap: '<path d="M22 9 12 5 2 9l10 4 10-4Z"/><path d="M6 11v4.5c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5V11"/><path d="M22 9v5"/>',
  users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19.5a6 6 0 0 1 12 0"/><path d="M16.5 5.6a3.2 3.2 0 0 1 0 6.1"/><path d="M19.5 19.5a6 6 0 0 0-3-5"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10l5-3v10l-5-3Z"/>',
  home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M6 9.5V19h12V9.5"/><path d="M10 19v-5h4v5"/>',
  cart: '<circle cx="9.5" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M2.5 4h2.2l2.3 11.5h10.3l1.8-8H6.2"/>',
  cross: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8.5v7M8.5 12h7"/>',
  phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="3"/><path d="M10.5 18.5h3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  star: '<path d="M12 3.5l2.5 5.6 6.1.6-4.6 4 1.4 6L12 16.6 6.6 19.7 8 13.7l-4.6-4 6.1-.6Z"/>',
  plane: '<path d="M2.5 12 21 4l-7.5 18-2.6-7.9Z"/><path d="M21 4 10.9 14.1"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12Z"/>',
};

function iconSvg(name, strokeWidth = 2) {
  const inner = ICONS[name] || ICONS.chat;
  return `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

const PLAY_SVG = '<svg class="ic" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l11-7z"></path></svg>';
const MIC_SVG = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2.5" width="6" height="11" rx="3"></rect><path d="M5.5 11a6.5 6.5 0 0 0 13 0"></path><path d="M12 17.5V21"></path><path d="M8.5 21h7"></path></svg>';
const ARROW_RIGHT_SVG = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>';
const CHEVRON_LEFT_SVG = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"></path></svg>';
const CHEVRON_RIGHT_SVG = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>';
const LOCK_SVG = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2.5"></rect><path d="M8 11V7.5a4 4 0 0 1 8 0V11"></path></svg>';
const STAR_FILLED_SVG = '<svg class="ic star-ic" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5l2.5 5.6 6.1.6-4.6 4 1.4 6L12 16.6 6.6 19.7 8 13.7l-4.6-4 6.1-.6Z"/></svg>';
const STAR_EMPTY_SVG = '<svg class="ic star-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l2.5 5.6 6.1.6-4.6 4 1.4 6L12 16.6 6.6 19.7 8 13.7l-4.6-4 6.1-.6Z"/></svg>';
