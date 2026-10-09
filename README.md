# MyByte — Full-Stack React Portfolio by Omprakash Suthar (@OPBSUTHAR)

> A gamified, motion-rich developer portfolio — React SPA with an interactive terminal, XP quest system, Konami arcade mode, pinned horizontal scroll, and a neo-stone (Igloo-inspired) design system. Hosted on Vercel.

![Deploy](https://github.com/OPBSUTHAR/MyByte/actions/workflows/deploy.yml/badge.svg)
![License](https://img.shields.io/badge/license-Proprietary-red)

**Live:** `https://my-byte.vercel.app`

## ✨ Features
- ⚡ **Full-stack React SPA** — Vite + React 18, hash-routed pages (Home / Resume / Story / 404)
- 🎮 **Gamified** — XP HUD with 14 achievements, levels (Explorer → ∞ Loop Runner), Konami-code Retro Arcade Mode, confetti rewards
- 💻 **Interactive terminal** — `nybyte.py` is a real CLI: `help`, `cat skills`, `sudo hire`, `run demo`, `theme obsidian|bone|cyber`, `frugal = false` (bloat mode!), easter eggs
- 🎨 **Neo-stone design** — obsidian/bone/cyber materials, film grain, tactile shadows, acid-lime accents; dark/light themes that actually work
- 🖱 **Immersive mouse physics** — magnetic cursor with snap-to-button, pointer-reactive particle field, heavy-slab 3D tilt
- 🎬 **Cinematic motion** — 1s compile preloader, SplitType-style char reveals, Lenis momentum scroll, GSAP pinned horizontal domains gallery
- 🔗 **GitHub-aware** — live repos via API + Python generator (`tools/fetch_github.py` → `data/projects.json` → `web/public/data/`)
- ♿ **Accessible** — `prefers-reduced-motion` fallbacks everywhere, keyboard-navigable book, semantic HTML

## 🧰 Stack
- **Frontend:** React 18, Vite 5, GSAP + ScrollTrigger, Lenis, Motion, Three.js, PixiJS, Spline, Theatre.js, Lottie, Anime.js, Popmotion, Mo.js
- **Data pipeline (Python):** `tools/fetch_github.py` fetches GitHub repos → `data/projects.json` → served from `web/public/data/`
- **Hosting:** Vercel (auto-deploy on push to `main`; root `vercel.json` builds `web/` → `web/dist`)

## 📁 Structure
```
MyByte/
├── web/                      # the app (only build)
│   ├── index.html
│   ├── vite.config.js
│   ├── public/data/          # projects.json + resume.json (runtime data)
│   └── src/
│       ├── App.jsx           # router + quest + arcade + frugal + theme
│       ├── router.jsx        # tiny hash router
│       ├── pages/            # Resume, Story (ancient book), NotFound
│       ├── components/       # Hero, Terminal, QuestHud, Cursor, Preloader, …
│       ├── hooks/            # useLenis, useQuest, useVisits, useMediaQuery
│       ├── fx/               # confetti, ThreeScene, PixiParticles, …
│       └── styles/           # site.css (neo-stone system) + overrides.css
├── tools/fetch_github.py     # Python: GitHub API → data/projects.json
├── data/projects.json        # generated data (source for web/public/data)
├── vercel.json               # Vercel build config
└── README.md
```

## 🚀 Local dev
```bash
cd web
npm install
npm run dev        # http://localhost:5173
npm run build      # → web/dist (what Vercel serves)
```

## 🐍 Refresh project data
```bash
pip install requests
py tools/fetch_github.py   # → data/projects.json (copy to web/public/data/)
```

## 📬 Contact
- GitHub: [@OPBSUTHAR](https://github.com/OPBSUTHAR)
- LinkedIn: [omprakash-suthar-246240318](https://www.linkedin.com/in/omprakash-suthar-246240318/)
- X: [@omprakashrj155](https://x.com/omprakashrj155)

---
Built with ❤️ by Omprakash Suthar. All rights reserved.
