// Static content constants ported from the static index.html so the React
// version stays in sync with the GitHub Pages build.

export const PHRASES = [
  'BharatVista Nexus — Pure C + SQLite • live @ data.gov.in',
  'Agnirva NEAT 5.0 — AI for Indian Satellites • ISRO track',
  'Frugal AI • Edge OCR — works offline',
  'Krishi-Gati-AI → farms @ 2G',
  'CrimeIntel-AI → safety with explainability',
  'SpaceFlightMonitor → precision dashboards',
  'C • Python • JS/TS • 42 repos live — shipped 🚀',
];

export const MARQUEE = ['∞ Land', '•', 'Infrastructure', '•', 'Power', '•', 'AI/ML/DL/NLP', '•', 'Agriculture', '•', 'Space', '•', 'Transportation', '•', 'Ocean', '•', 'Pure C', '•', 'BharatVista Nexus', '•', 'Agnirva NEAT 5.0', '•'];

export const STRIP = ['∞ Land', 'Infrastructure', 'Power', 'AI/ML', 'Agriculture', 'Space', 'Transport', 'Ocean', 'Pure C', 'SQLite', 'Python', 'Leaflet', '∞ Loop'];

export const HIGHLIGHTS = [
  { eyebrow: '01 — Focus', h: '∞ 8 Elements — One System', p: 'Land • Infrastructure • Power • AI/ML/DL/NLP • Agriculture • Space • Transportation • Ocean', href: '#infinity', link: 'View focus →' },
  { eyebrow: '02 — Vision', h: 'Why I Build', p: 'Frugal, field-ready systems that work offline — for farmers, controllers, students.', href: '#vision', link: 'Read vision →' },
  { eyebrow: '03 — Featured', h: 'BharatVista Nexus & Agnirva', p: 'Pure C + SQLite open-data nexus and AI for Indian Satellites — 42 repos live.', href: '#featured', link: 'See case studies →' },
  { eyebrow: '04 — Work', h: 'Selected Projects & Portfolio', p: 'Live previews, domain filters, showcase — every project shipped.', href: '#work', link: 'Browse work →' },
  { eyebrow: '05 — Next', h: 'Goals & Contact', p: "2026–30 roadmap, stack, journey — regular @ CHRIST Yeshwantpur. Let's build.", href: '#contact', link: 'Get in touch →' },
];

export const DOMAINS = [
  { id: 'LD', grad: 'linear-gradient(135deg,#8b5a2b,#a16207)', h: 'Land', tag: 'GIS • C • Leaflet', p: <>Ground truth. <b>BharatVista Nexus</b> — geo kernel (haversine, bbox), FieldSync — land systems, cadastral. Where data meets soil.</>, tags: ['BharatVista-Nexus', 'FieldSync'] },
  { id: 'IN', grad: 'linear-gradient(135deg,#475569,#334155)', h: 'Infrastructure', tag: 'C • SQLite • Java', p: <>Connects. <b>SynchroGroundedNet, Econnect, BharatVista</b> — infra safety, networks, open-data nexus. Build to last.</>, tags: ['SynchroGroundedNet', 'Econnect'] },
  { id: 'PW', grad: 'linear-gradient(135deg,#f59e0b,#eab308)', h: 'Power', tag: 'C • Systems • Edge', p: <>Fuels. <b>BharatVista power datasets, priority_scheduler</b> — energy-aware scheduling, frugal compute, offline-first power logic.</>, tags: ['priority_scheduler', 'BharatVista'] },
  { id: 'AI', grad: 'linear-gradient(135deg,#7c3aed,#a78bfa)', h: 'AI / ML / DL / NLP / Tech', tag: 'Python • OCR • LLM', p: <>Thinks. <b>Agnirva NEAT 5.0, ai-scanner, CrimeIntel-AI, Aviation_NLP</b> — vision, language, satellite intelligence.</>, tags: ['Agnirva-AI', 'ai-scanner', 'NLP'] },
  { id: 'AG', grad: 'linear-gradient(135deg,#22c55e,#16a34a)', h: 'Agriculture', tag: 'Python • JS • 2G', p: <>Feeds. <b>Krishi-Gati-AI</b> — low-data farm advisory for 2G, offline-first. Next: vernacular + voice.</>, tags: ['Krishi-Gati-AI', 'ledgerly'] },
  { id: 'SP', grad: 'linear-gradient(135deg,#06b6d4,#0ea5e9)', h: 'Space', tag: 'C • SGP4 • satellite.js', p: <>Guides. <b>BharatVista satellite.html (SGP4), SpaceFlightMonitor, Agnirva — AI for Indian Satellites, AstraForge</b></>, tags: ['BharatVista-Nexus', 'Agnirva'] },
  { id: 'TR', grad: 'linear-gradient(135deg,#ea580c,#f97316)', h: 'Transportation', tag: 'JS • TS • DataViz', p: <>Moves. <b>railway, Aviation_NLP — transit, aviation, mobility</b>. Precision under latency.</>, tags: ['railway', 'Aviation_NLP'] },
  { id: 'OC', grad: 'linear-gradient(135deg,#0ea5e9,#0284c7)', h: 'Ocean', tag: 'C • Data • Maps', p: <>Sustains. <b>BharatVista ocean datasets, OSINT cache</b> — open-data for coasts, fisheries, climate. Leaflet + SQLite.</>, tags: ['BharatVista-Nexus', 'OSINT'] },
];

export const CASES = [
  { bar: 'linear-gradient(90deg,#06b6d4,#22d3ee)', color: '#06b6d4', eyebrow: 'Case 01 • BharatVista-Nexus — Pure C • NEW', h: 'BharatVista Nexus — open-data nexus in Pure C + SQLite', p: <><b>Challenge:</b> Enterprise-grade OSINT nexus without Python/Node — only <code>api.data.gov.in</code> + Celestrak TLE.<br /><b>Role:</b> Solo — C server (POSIX/WinSock, pthreads, libcurl, SQLite), geo kernel (haversine), Leaflet/satellite.js frontend.<br /><b>Process:</b> POSIX sockets → /api/datasets + /api/satellites → SQLite cache → Leaflet + SGP4 ground-track.<br /><b>Result:</b> Live at <code>opbsuthar.github.io/BharatVista-Nexus</code> — <code>make &amp;&amp; ./build/server</code> on :8080. No framework bloat.</>, tags: ['Pure C', 'SQLite', '● Live'], code: 'https://github.com/OPBSUTHAR/BharatVista-Nexus', project: 'BharatVista-Nexus' },
  { bar: 'linear-gradient(90deg,#22c55e,#16a34a)', color: '#16a34a', eyebrow: 'Case 02 • Agnirva AI Internship — NEAT 5.0 • NEW', h: 'Agnirva — AI for Indian Satellites — ISRO track', p: <><b>Challenge:</b> Make Indian satellite data more useful, scalable &amp; intelligent.<br /><b>Role:</b> Intern @ Agnirva (CHRIST) — BRD v0.2 (11 sections), Framewirk micro-movements, 6-hat artifacts, progress-log as source of truth.<br /><b>Process:</b> Week 1 ✓ → Week 2 Business Analyst (BRD, day-1 lens) → prototype stub in <code>src/</code>.<br /><b>Result:</b> <code>github.com/OPBSUTHAR/Satora</code> — docs/progress-log → weekly reports → Earth-observation pipelines. CHRIST Yeshwantpur.</>, tags: ['NEAT 5.0', 'BRD', 'CHRIST'], code: 'https://github.com/OPBSUTHAR/Satora', project: 'Satora' },
  { bar: 'linear-gradient(90deg,#7c3aed,#a78bfa)', color: '#7c3aed', eyebrow: 'Case 03 • ai-scanner — Python • Featured', h: 'AI Scanner — document intelligence on the edge', p: <><b>Challenge:</b> Scan docs with shadows/glare without cloud.<br /><b>Role:</b> Solo — OpenCV, OCR, classifier, cloud sync.<br /><b>Process:</b> Edge detection → perspective warp → Tesseract → lightweight classifier.<br /><b>Result:</b> Mobile scanner with live preview at <code>opbsuthar.github.io/ai-scanner</code>. Offline-first, updated Sep 2025.</>, tags: ['Edge', 'OCR', '● Live'], code: 'https://github.com/OPBSUTHAR/ai-scanner', project: 'ai-scanner' },
];

export const GOALS = [
  { when: 'NOW — 2026', h: 'Ship 5 field-ready AI tools', p: 'Harden AI Scanner + Krishi-Gati-AI with vernacular, voice, offline. Intern at AgTech / SpaceTech / Safety lab. 10K users across demos.', width: 68, note: '68% — 3/5 shipped live' },
  { when: '2027 — Depth', h: 'Frugal AI at edge — <10MB models', p: 'Train & distill ≤10MB OCR/NLP that runs on ₹7k Android. Publish 2 papers + open models. SynchroGroundedNet → real infrastructure pilot.', width: 32, note: 'Researching quantization & ONNX' },
  { when: '2028 — Scale', h: 'Systems for Bharat — 1M rural users', p: 'Krishi-Gati-AI in 3 states, 3 languages. Aviation NLP assisting small airports. Revenue via impact, not ads.', width: 12, note: 'Designing for 2G today' },
  { when: '2030 — Orbit', h: 'MyByte as product studio', p: <>Small team, 4 domains, one principle: <b>if it helps people at the edge, we build it.</b> From villages to orbits — byte-scale, human-scale.</>, width: 6, note: 'Dream → plan → ship' },
];

export const SKILLS = [
  { h: '01 — Interactive Web', lvl: 'Expert', p: 'Landing + dashboards that hit 95+ LH, <30KB, mobile-first. Live iframe pattern you already saw.', width: 92, tags: ['HTML5', 'CSS3', 'JS', 'TS', 'Tailwind', 'React', 'Vite'] },
  { h: '02 — AI / Data', lvl: 'Building', p: 'OCR, NLP, edge. Tesseract, OpenCV, lightweight classifiers — not just calling APIs.', width: 78, tags: ['Python', 'OCR', 'NLP', 'OpenCV', 'Aviation', 'CrimeIntel'] },
  { h: '03 — Systems & C/C++', lvl: 'Advanced', p: 'Schedulers, safety logic, efficient backends. Where polish meets performance.', width: 86, tags: ['C', 'C++', 'Python', 'Node.js', 'REST', 'priority_scheduler'] },
  { h: '04 — Ship & Scale', lvl: 'Fluent', p: 'Git, Actions, Pages, Figma → idea to URL in hours. tools/fetch_github.py keeps portfolio fresh.', width: 88, tags: ['Git', 'Pages', 'Actions', 'Figma', 'SEO', 'Perf'] },
];

export const BENTO = [
  { h: 'Precision by default', p: 'Grid, spacing, typography obsessed. 8px, not 9px.' },
  { h: 'Lightning fast', p: '<30KB, instant on Pages. No jank, 95+ Lighthouse.' },
  { h: 'Live previews', p: 'Every project opens live iframe — not just code.' },
  { h: 'Python brain', p: 'Build step fetches GitHub → always fresh. Proves backend chops on static.' },
];

export const TIMELINE = [
  { when: '2023–24', h: 'Foundation — Learn by shipping', p: 'login-template, Tic-Tac-Toe, MemoryCard — fundamentals, Git, first deploys.' },
  { when: '2025', h: 'Expansion — JS mastery', p: 'Econnect, Expense-Tracker, To-Do-Master, recipe-book, countdown-timer — state, storage, polish.' },
  { when: '2026 H1', h: 'Depth — AI & Systems', p: 'ai-scanner, CrimeIntel-AI, Aviation NLP, Krishi-Gati-AI, SynchroGroundedNet, SpaceFlightMonitor, AstraForge.' },
  { when: '2026 H2 — NEW', h: 'BharatVista Nexus + Agnirva NEAT 5.0 — 3rd Year @ CHRIST Yeshwantpur', p: <><b>BharatVista Nexus</b> — Pure C (POSIX/WinSock, pthreads, libcurl, SQLite) + Leaflet + satellite.js (SGP4) — data.gov.in &amp; Celestrak. <b>Agnirva AI Internship</b> — NEAT 5.0, AI for Indian Satellites, BRD v0.2, Framewirk. 42 repos shipped.</> },
  { when: 'Now', h: 'MyByte — Portfolio as Product', p: 'Not a template. A system: Python fetch → JSON → live showcase → modal iframe. Your idea → shipped. 3rd Year BCA, Yeshwantpur.' },
];

export const LABS = [
  { tag: 'Motion', h: 'Layout & spring physics', p: 'Shared-layout tiles and spring transitions with the Motion library.' },
  { tag: 'Anime.js', h: 'SVG line-draw', p: 'The ∞ glyph traces itself — timeline controls, tiny payload.' },
  { tag: 'Theatre.js', h: 'Keyframe sequence', p: 'Author keyframes once, scrub them here. Ready for the Theatre editor.' },
  { tag: 'Lottie', h: 'Vector motion', p: 'After Effects JSON rendered natively — designer-to-dev pipeline.' },
];
