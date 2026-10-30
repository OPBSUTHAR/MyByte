// GitHub data layer — mirrors assets/js/github.js but as reusable React helpers.
export const USER = 'OPBSUTHAR';

// factorial domain map — diverse → reflects ambitions.
// Keys are matched case-insensitively (GitHub names are mixed-case).
const DOMAIN_ENTRIES = [
  ['Krishi-Gati-AI', 'krishi'], ['ledgerly', 'krishi'], ['Agri360', 'krishi'], ['LoRa_IoT_AgriSim', 'krishi'],
  ['ai-scanner', 'safety'], ['crimeintel-ai', 'safety'], ['CrimeIntel-CommandCenter', 'safety'], ['SentinelVault', 'safety'], ['AeroGrid-SafetyNLP', 'safety'], ['file-lock-app', 'safety'], ['sarathi-ll-face-simulator', 'safety'], ['cyber', 'safety'], ['autonomous-data-annotator', 'ai'], ['freightops-ai', 'ai'], ['SUTHARA_AI', 'ai'],
  ['Aviation_NLP_Project', 'space'], ['SpaceFlightMonitor', 'space'], ['SynchroGroundedNet', 'space'], ['AstraForge', 'space'], ['railway', 'space'], ['railway-management-system', 'space'], ['BharatVista-Nexus', 'space'], ['Satora', 'space'], ['delhivery-pipeline', 'space'],
  ['Econnect', 'edu'], ['student-tracker', 'edu'], ['student-teacher-appointment-booking', 'edu'], ['catering-reservation-and-order-system', 'edu'], ['gym-management-system', 'edu'], ['priority_scheduler', 'edu'], ['To-Do-Master', 'edu'], ['Expense-Tracker', 'edu'], ['recipe-book', 'edu'], ['Basic-Calculator', 'edu'], ['Tic-Tac-Toe-Game', 'edu'], ['MemoryCardGame', 'edu'], ['countdown-timer', 'edu'], ['cannibals-missionaries', 'edu'], ['electric-vehicle-recharge-bunk', 'krishi'], ['student-registration', 'edu'], ['project-E', 'edu'], ['salary-prediction', 'edu'],
];
const DOMAIN_MAP = Object.fromEntries(DOMAIN_ENTRIES.map(([k, v]) => [k.toLowerCase(), v]));

export const projectDomain = (name) => DOMAIN_MAP[name?.toLowerCase()] || 'other';
export const domainLabel = (d) => ({ krishi: '🌾 Krishi', safety: '🛡️ Safety', space: '🛰️ Space', ai: '🧠 AI', edu: '🎓 Edu', other: '◐ Other' }[d] || d);

export const ogUrl = (name) => `https://opengraph.githubassets.com/1/${USER}/${name}`;
export const githubPages = (name) => `https://opbsuthar.github.io/${name}/`;

// Real demo URL: repo homepage when set (Vercel / custom), else the Pages convention.
export const liveUrl = (p) =>
  typeof p === 'string' ? githubPages(p) : (p?.home || githubPages(p?.name ?? ''));

// Repos whose live build lives on GitHub Pages rather than a repo homepage.
const PAGES_LIVE = new Set([
  'Econnect', 'login-template', 'Tic-Tac-Toe-Game', 'MemoryCardGame', 'Expense-Tracker', 'To-Do-Master',
  'recipe-book', 'countdown-timer', 'Basic-Calculator', 'SpaceFlightMonitor', 'Krishi-Gati-AI',
  'cannibals-missionaries', 'BharatVista-Nexus', 'Satora', 'BioSite', 'DataZen', 'salary-prediction',
  'cyber', 'student-registration', 'orbisnova',
]);

export function isLiveCandidate(p) {
  if (!p) return false;
  if (p.home) return true;
  return ['HTML', 'CSS', 'JavaScript', 'TypeScript'].includes(p.lang) || PAGES_LIVE.has(p.name);
}

// Showcase order — newest flagship systems first, not star count.
export const FEATURED_ORDER = [
  'freightops-ai', 'SentinelVault', 'CrimeIntel-CommandCenter', 'AeroGrid-SafetyNLP',
  'railway-management-system', 'MyByte', 'BharatVista-Nexus', 'orbisnova',
  'autonomous-data-annotator', 'Satora', 'ai-scanner',
];
export const featuredRank = (name) => {
  const i = FEATURED_ORDER.indexOf(name);
  return i === -1 ? FEATURED_ORDER.length : i;
};

export const curated = [
  { name: 'freightops-ai', lang: 'Python', desc: 'FreightOps AI — multi-agent freight control tower: RAG, evals, human approval gate', stars: 0, forks: 0, home: 'https://freightops-ai.vercel.app', url: `https://github.com/${USER}/freightops-ai` },
  { name: 'SentinelVault', lang: 'Python', desc: 'Zero-knowledge password manager — AES-256-GCM, HIBP breach checks, TOTP, phishing detection', stars: 0, forks: 0, home: 'https://sentinelvault-pearl.vercel.app', url: `https://github.com/${USER}/SentinelVault` },
  { name: 'CrimeIntel-CommandCenter', lang: 'Python', desc: 'CrimeIntel Command Center — conversational crime intelligence for KSP (FastAPI + React + FAISS)', stars: 0, forks: 0, home: 'https://crimeintel-commandcenter.vercel.app', url: `https://github.com/${USER}/CrimeIntel-CommandCenter` },
  { name: 'AeroGrid-SafetyNLP', lang: 'Python', desc: 'AeroGrid SafetyNLP — aviation & grid incident classification with RAG explanations', stars: 0, forks: 0, home: 'https://aerogrid-safetynlp.vercel.app', url: `https://github.com/${USER}/AeroGrid-SafetyNLP` },
  { name: 'railway-management-system', lang: 'JavaScript', desc: 'RailSetu — railway booking & operations with seat maps and live route tracking', stars: 0, forks: 0, home: 'https://railway-management-system-nine.vercel.app', url: `https://github.com/${USER}/railway-management-system` },
  { name: 'BharatVista-Nexus', lang: 'C', desc: 'BharatVista Nexus — Pure C + SQLite open-data nexus (api.data.gov.in + Celestrak TLE) + Leaflet real-time satellite', stars: 0, forks: 0, home: 'https://opbsuthar.github.io/BharatVista-Nexus/', url: `https://github.com/${USER}/BharatVista-Nexus` },
  { name: 'orbisnova', lang: 'TypeScript', desc: 'Omnia — one app, every device: local-first cross-platform super-app (Expo + React Native)', stars: 0, forks: 0, home: 'https://opbsuthar.github.io/orbisnova/', url: `https://github.com/${USER}/orbisnova` },
  { name: 'autonomous-data-annotator', lang: 'TypeScript', desc: 'Autonomous Data Annotator — annotates any file type through a reactive pipeline', stars: 0, forks: 0, home: 'https://autonomous-data-annotator.vercel.app', url: `https://github.com/${USER}/autonomous-data-annotator` },
];

const mapRepo = (x) => ({
  name: x.name, lang: x.language || 'Other', desc: x.description || '',
  stars: x.stargazers_count, forks: x.forks_count, url: x.html_url,
  home: x.homepage || x.home || '', updated: x.pushed_at,
});

// Loads live GitHub → cache JSON → curated. Never throws.
export async function loadProjects() {
  try {
    const r = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`, { headers: { Accept: 'application/vnd.github.v3+json' } });
    if (r.ok) {
      const data = await r.json();
      if (Array.isArray(data) && data.length) {
        const mapped = data.map(mapRepo)
          .sort((a, b) => (b.stars - a.stars) || (new Date(b.updated) - new Date(a.updated)));
        return { list: mapped, source: 'github' };
      }
    }
    throw new Error('api');
  } catch {
    try {
      const r2 = await fetch('data/projects.json');
      if (r2.ok) {
        const j = await r2.json();
        if (Array.isArray(j) && j.length) return { list: j.map(mapRepo), source: 'cache' };
      }
    } catch { /* ignore */ }
    return { list: curated, source: 'curated' };
  }
}
