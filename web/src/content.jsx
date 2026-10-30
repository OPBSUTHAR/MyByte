// Static content constants ported from the static index.html so the React
// version stays in sync with the GitHub Pages build.

export const PHRASES = [
  'FreightOps AI — agents quote, book, track • human gate',
  'SentinelVault — zero-knowledge vault • AES-256-GCM',
  'Omnia (orbisnova) — one app, every device',
  'BharatVista Nexus — Pure C + SQLite • live @ data.gov.in',
  'Agnirva NEAT 5.0 — AI for Indian Satellites • ISRO track',
  'CrimeIntel Command Center → grounded answers with FAISS',
  'C • Python • JS/TS • 48 repos live — shipped 🚀',
];

export const MARQUEE = ['∞ Land', '•', 'Infrastructure', '•', 'Power', '•', 'AI/ML/DL/NLP', '•', 'Agriculture', '•', 'Space', '•', 'Transportation', '•', 'Ocean', '•', 'Pure C', '•', 'BharatVista Nexus', '•', 'Agnirva NEAT 5.0', '•'];

export const HIGHLIGHTS = [
  { eyebrow: '01 — Focus', h: '∞ 8 Elements — One System', p: 'Land • Infrastructure • Power • AI/ML/DL/NLP • Agriculture • Space • Transportation • Ocean', href: '#infinity', link: 'View focus →' },
  { eyebrow: '02 — Vision', h: 'Why I Build', p: 'Frugal, field-ready systems that work offline — for farmers, controllers, students.', href: '#vision', link: 'Read vision →' },
  { eyebrow: '03 — Featured', h: 'FreightOps AI, BharatVista & Agnirva', p: 'Agentic freight ops with a human gate, a Pure C + SQLite open-data nexus, and AI for Indian Satellites — 48 repos live.', href: '#featured', link: 'See case studies →' },
  { eyebrow: '04 — Work', h: 'Selected Projects & Portfolio', p: 'Live previews, domain filters, showcase — every project shipped.', href: '#work', link: 'Browse work →' },
  { eyebrow: '05 — Next', h: 'Goals & Contact', p: "2026–30 roadmap, stack, journey — regular @ CHRIST Yeshwantpur. Let's build.", href: '#contact', link: 'Get in touch →' },
];

export const DOMAINS = [
  { id: 'LD', h: 'Land', tag: 'GIS • C • Leaflet', p: <>Ground truth. <b>BharatVista Nexus</b> — geo kernel (haversine, bbox), FieldSync — land systems, cadastral. Where data meets soil.</>, tags: ['BharatVista-Nexus', 'FieldSync'] },
  { id: 'IN', h: 'Infrastructure', tag: 'C • SQLite • Java', p: <>Connects. <b>SynchroGroundedNet, Econnect, BharatVista</b> — infra safety, networks, open-data nexus. Build to last.</>, tags: ['SynchroGroundedNet', 'Econnect'] },
  { id: 'PW', h: 'Power', tag: 'C • Systems • Edge', p: <>Fuels. <b>BharatVista power datasets, priority_scheduler</b> — energy-aware scheduling, frugal compute, offline-first power logic.</>, tags: ['priority_scheduler', 'BharatVista'] },
  { id: 'AI', h: 'AI / ML / DL / NLP / Tech', tag: 'Python • RAG • LLM', p: <>Thinks. <b>FreightOps AI, SentinelVault, CrimeIntel Command Center, AeroGrid SafetyNLP, ai-scanner, Autonomous Data Annotator</b> — agents, retrieval, vision, language, satellite intelligence.</>, tags: ['FreightOps AI', 'SentinelVault', 'RAG', 'NLP'] },
  { id: 'AG', h: 'Agriculture', tag: 'Python • JS • 2G', p: <>Feeds. <b>Krishi-Gati-AI</b> — low-data farm advisory for 2G, offline-first. Next: vernacular + voice.</>, tags: ['Krishi-Gati-AI', 'ledgerly'] },
  { id: 'SP', h: 'Space', tag: 'C • SGP4 • satellite.js', p: <>Guides. <b>BharatVista satellite.html (SGP4), SpaceFlightMonitor, Agnirva — AI for Indian Satellites, AstraForge</b></>, tags: ['BharatVista-Nexus', 'Agnirva'] },
  { id: 'TR', h: 'Transportation', tag: 'JS • TS • DataViz', p: <>Moves. <b>railway, Aviation_NLP — transit, aviation, mobility</b>. Precision under latency.</>, tags: ['railway', 'Aviation_NLP'] },
  { id: 'OC', h: 'Ocean', tag: 'C • Data • Maps', p: <>Sustains. <b>BharatVista ocean datasets, OSINT cache</b> — open-data for coasts, fisheries, climate. Leaflet + SQLite.</>, tags: ['BharatVista-Nexus', 'OSINT'] },
];

export const CASES = [
  { eyebrow: 'Case 01 • BharatVista-Nexus — Pure C • NEW', h: 'BharatVista Nexus — open-data nexus in Pure C + SQLite', p: <><b>Challenge:</b> Enterprise-grade OSINT nexus without Python/Node — only <code>api.data.gov.in</code> + Celestrak TLE.<br /><b>Role:</b> Solo — C server (POSIX/WinSock, pthreads, libcurl, SQLite), geo kernel (haversine), Leaflet/satellite.js frontend.<br /><b>Process:</b> POSIX sockets → /api/datasets + /api/satellites → SQLite cache → Leaflet + SGP4 ground-track.<br /><b>Result:</b> Live at <code>opbsuthar.github.io/BharatVista-Nexus</code> — <code>make &amp;&amp; ./build/server</code> on :8080. No framework bloat.</>, tags: ['Pure C', 'SQLite', '● Live'], code: 'https://github.com/OPBSUTHAR/BharatVista-Nexus' },
  { eyebrow: 'Case 02 • Agnirva AI Internship — NEAT 5.0 • NEW', h: 'Agnirva — AI for Indian Satellites — ISRO track', p: <><b>Challenge:</b> Make Indian satellite data more useful, scalable &amp; intelligent.<br /><b>Role:</b> Intern @ Agnirva (CHRIST) — BRD v0.2 (11 sections), Framewirk micro-movements, 6-hat artifacts, progress-log as source of truth.<br /><b>Process:</b> Week 1 ✓ → Week 2 Business Analyst (BRD, day-1 lens) → prototype stub in <code>src/</code>.<br /><b>Result:</b> <code>github.com/OPBSUTHAR/Satora</code> — docs/progress-log → weekly reports → Earth-observation pipelines. CHRIST Yeshwantpur.</>, tags: ['NEAT 5.0', 'BRD', 'CHRIST'], code: 'https://github.com/OPBSUTHAR/Satora' },
  { eyebrow: 'Case 03 • FreightOps AI — Agentic • NEW', h: 'FreightOps AI — a freight control tower that asks before it acts', p: <><b>Challenge:</b> quote, book and track freight without letting an LLM move money unchecked.<br /><b>Role:</b> Solo — planner → executor → reviewer agents, RAG over tariffs &amp; SOPs, 9 behavioral evals, hard approval gate.<br /><b>Process:</b> FastAPI orchestration → per-step traces → confidence + spend caps → human sign-off on risky actions.<br /><b>Result:</b> Live at <code>freightops-ai.vercel.app</code> — every decision traceable, every booking gated.</>, tags: ['Agents', 'RAG', '● Live'], code: 'https://github.com/OPBSUTHAR/freightops-ai' },
];

export const GOALS = [
  { when: 'NOW — 2026', h: 'Ship 5 field-ready AI tools', p: 'Harden AI Scanner + Krishi-Gati-AI with vernacular, voice, offline. Intern at AgTech / SpaceTech / Safety lab. 10K users across demos.', width: 68, note: '68% — 3/5 shipped live' },
  { when: '2027 — Depth', h: 'Frugal AI at edge — <10MB models', p: 'Train & distill ≤10MB OCR/NLP that runs on ₹7k Android. Publish 2 papers + open models. SynchroGroundedNet → real infrastructure pilot.', width: 32, note: 'Researching quantization & ONNX' },
  { when: '2028 — Scale', h: 'Systems for Bharat — 1M rural users', p: 'Krishi-Gati-AI in 3 states, 3 languages. Aviation NLP assisting small airports. Revenue via impact, not ads.', width: 12, note: 'Designing for 2G today' },
  { when: '2030 — Orbit', h: 'MyByte as product studio', p: <>Small team, 4 domains, one principle: <b>if it helps people at the edge, we build it.</b> From villages to orbits — byte-scale, human-scale.</>, width: 6, note: 'Dream → plan → ship' },
];

export const SKILLS = [
  { h: '01 — Full-Stack Web', lvl: 'Expert', p: 'MERN/MEAN interfaces and dashboards that hit 95+ LH, <30KB, mobile-first. Live previews, not screenshots.', width: 92, tags: ['React', 'Next.js', 'Node', 'Express', 'Tailwind', 'Vite', 'TypeScript'] },
  { h: '02 — Agentic AI & RAG', lvl: 'Building', p: 'Planner → executor → reviewer agents with retrieval, tool calling, traces and a human approval gate.', width: 82, tags: ['Python', 'FastAPI', 'RAG', 'LLM evals', 'Tool calling', 'Ollama'] },
  { h: '03 — Vision & NLP', lvl: 'Building', p: 'OCR, classification and retrieval that runs offline or on the edge — not just calling an API.', width: 78, tags: ['OpenCV', 'Tesseract', 'NLP', 'scikit-learn', 'PyTorch', 'FAISS'] },
  { h: '04 — Systems & C/C++', lvl: 'Advanced', p: 'Schedulers, POSIX sockets, SQLite kernels, desktop tooling. Where polish meets performance.', width: 86, tags: ['C', 'C++', 'C#', 'Java', 'SQLite', 'Sockets', 'Spring Boot'] },
  { h: '05 — Data & Databases', lvl: 'Fluent', p: 'Relational, document, graph, cache and time-series — picked for the workload, not the hype.', width: 84, tags: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Supabase', 'Neo4j', 'InfluxDB'] },
  { h: '06 — Ship & Scale', lvl: 'Fluent', p: 'Git, Actions, Vercel, Docker → idea to URL in hours. tools/fetch_github.py keeps this portfolio fresh.', width: 88, tags: ['Git', 'GitHub Actions', 'Vercel', 'Docker', 'Lighthouse', 'SEO'] },
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
  { when: '2026 H2', h: 'BharatVista Nexus + Agnirva NEAT 5.0 — 3rd Year @ CHRIST Yeshwantpur', p: <><b>BharatVista Nexus</b> — Pure C (POSIX/WinSock, pthreads, libcurl, SQLite) + Leaflet + satellite.js (SGP4) — data.gov.in &amp; Celestrak. <b>Agnirva AI Internship</b> — NEAT 5.0, AI for Indian Satellites, BRD v0.2, Framewirk.</> },
  { when: 'Now — 2026', h: 'Agentic systems + one app for every device', p: <><b>FreightOps AI</b> (agents + RAG + approval gate), <b>SentinelVault</b> (AES-256-GCM, zero-knowledge), <b>CrimeIntel Command Center</b>, <b>AeroGrid SafetyNLP</b>, <b>Omnia</b> (Expo, local-first) — 48 repos shipped, 10 live demos.</> },
  { when: 'The loop', h: 'MyByte — Portfolio as Product', p: 'Not a template. A system: Python fetch → JSON → live showcase → modal iframe. Your idea → shipped. 3rd Year BCA, Yeshwantpur.' },
];
