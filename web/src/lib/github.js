// GitHub data layer — mirrors assets/js/github.js but as reusable React helpers.
export const USER = 'OPBSUTHAR';

// factorial domain map — diverse → reflects ambitions
export const DOMAIN_MAP = {
  'Krishi-Gati-AI': 'krishi', ledgerly: 'krishi', Agri360: 'krishi', LoRa_IoT_AgriSim: 'krishi',
  'ai-scanner': 'safety', 'crimeintel-ai': 'safety', 'file-lock-app': 'safety', 'sarathi-ll-face-simulator': 'safety', cyber: 'safety',
  'Aviation_NLP_Project': 'space', SpaceFlightMonitor: 'space', SynchroGroundedNet: 'space', AstraForge: 'space', railway: 'space', 'BharatVista-Nexus': 'space', Satora: 'space', 'delhivery-pipeline': 'space',
  Econnect: 'edu', 'student-tracker': 'edu', 'student-teacher-appointment-booking': 'edu', 'catering-reservation-and-order-system': 'edu', 'gym-management-system': 'edu', priority_scheduler: 'edu', 'To-Do-Master': 'edu', 'Expense-Tracker': 'edu', 'recipe-book': 'edu', 'Basic-Calculator': 'edu', 'Tic-Tac-Toe-Game': 'edu', MemoryCardGame: 'edu', 'countdown-timer': 'edu', 'cannibals-missionaries': 'edu', 'electric-vehicle-recharge-bunk': 'krishi', 'student-registration': 'edu', 'project-E': 'edu', 'salary-prediction': 'edu',
};

export const projectDomain = (name) => DOMAIN_MAP[name] || DOMAIN_MAP[name?.toLowerCase()] || 'other';
export const domainLabel = (d) => ({ krishi: '🌾 Krishi', safety: '🛡️ Safety', space: '🛰️ Space', edu: '🎓 Edu', other: '◐ Other' }[d] || d);

export const ogUrl = (name) => `https://opengraph.githubassets.com/1/${USER}/${name}`;
export const liveUrl = (name) => `https://opbsuthar.github.io/${name}/`;

export function isLiveCandidate(lang, name) {
  const webLangs = ['HTML', 'CSS', 'JavaScript', 'TypeScript'];
  return webLangs.includes(lang) || [
    'Econnect', 'login-template', 'Tic-Tac-Toe-Game', 'MemoryCardGame', 'Expense-Tracker', 'To-Do-Master',
    'recipe-book', 'countdown-timer', 'Basic-Calculator', 'SpaceFlightMonitor', 'Krishi-Gati-AI',
    'cannibals-missionaries', 'BharatVista-Nexus', 'Satora', 'BioSite', 'DataZen', 'salary-prediction',
    'cyber', 'student-registration',
  ].includes(name);
}

export const curated = [
  { name: 'BharatVista-Nexus', lang: 'C', desc: 'BharatVista Nexus — Pure C + SQLite open-data nexus (api.data.gov.in + Celestrak TLE) + Leaflet real-time satellite', stars: 0, forks: 0, url: `https://github.com/${USER}/BharatVista-Nexus` },
  { name: 'Satora', lang: 'Python', desc: 'Satora (Agnirva NEAT 5.0) — AI for Indian Satellites • Framewirk • BRD • 6-hat', stars: 0, forks: 0, url: `https://github.com/${USER}/Satora` },
  { name: 'ai-scanner', lang: 'Python', desc: 'AI-powered document scanner — edge, OCR, cloud', stars: 0, forks: 0, url: `https://github.com/${USER}/ai-scanner` },
  { name: 'crimeintel-ai', lang: 'Python', desc: 'CrimeIntel-AI — crime pattern & NLP analysis', stars: 0, forks: 0, url: `https://github.com/${USER}/crimeintel-ai` },
  { name: 'SpaceFlightMonitor', lang: 'JavaScript', desc: 'Space flight monitoring dashboard', stars: 0, forks: 0, url: `https://github.com/${USER}/SpaceFlightMonitor` },
  { name: 'AstraForge', lang: 'TypeScript', desc: 'AstraForge — TypeScript tooling', stars: 0, forks: 0, url: `https://github.com/${USER}/AstraForge` },
];

const mapRepo = (x) => ({
  name: x.name, lang: x.language || 'Other', desc: x.description || '',
  stars: x.stargazers_count, forks: x.forks_count, url: x.html_url,
  updated: x.pushed_at,
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
