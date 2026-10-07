# MyByte — Web (React / Vite)

The **full-potential React build** of the MyByte portfolio. The zero-build static
site stays at the repository root and keeps deploying to **GitHub Pages**; this
folder is a separate app that deploys to **Vercel**.

## Deploy on Vercel

**Option A — repo root (recommended, one project, both deploys)**

The root `vercel.json` already points Vercel at this folder:

```jsonc
{
  "buildCommand": "cd web && npm install && npm run build",
  "outputDirectory": "web/dist"
}
```

1. Import the repo at [vercel.com/new](https://vercel.com/new).
2. Root directory: **repo root** (leave default). Vercel reads `vercel.json`.
3. Deploy. GitHub Pages is unaffected because its workflow only publishes root files.

**Option B — set the Root Directory to `web/`** on the import screen; the
`web/vercel.json` (`framework: vite`) is then used instead.

## Local development

```bash
cd web
npm install
npm run dev      # http://localhost:5173
npm run build    # -> web/dist
npm run preview
```

> On a machine behind a TLS-intercepting proxy, install with
> `npm install --strict-ssl=false`. Vercel's own build is unaffected.

## What's inside

A complete React 18 port of every section (Hero → Vision → ∞ Elements → Domains →
Case Studies → Showcase → Portfolio → Goals → Stack → Motion Lab → About →
Journey → Contact) plus the project modal, theme toggle, and live GitHub data.

### The animation stack (all 9 libraries, each in its best-fit role)

| Library | Role in this build |
| --- | --- |
| **Motion** (Framer Motion) | Declarative spring physics, shared-layout transitions, drag gestures, filter/`layout` animations in the Portfolio grid, `MotionConfig reducedMotion="user"`. |
| **Anime.js** | SVG line-draw of the ∞ glyph — tiny payload, timeline controls. |
| **Theatre.js** | Keyframe sequence authored as reactive object values; scrubber UI, Studio editor available in dev. |
| **Lottie-Web** | Locally-generated After Effects JSON (`public/lottie/loop.json`) rendered via `lottie-react`. |
| **Three.js** (+ React Three Fiber) | Interactive WebGL scene — wireframe core + orbiting particle field. |
| **Spline** | On-demand interactive 3D embed (`@splinetool/react-spline`). |
| **PixiJS** | GPU-accelerated 2D canvas with ~900 live sprites. |
| **Popmotion** | Low-level spring animation driving the physics orb. |
| **Mo.js** | Particle-burst micro-interactions on click. |
| **GSAP + ScrollTrigger + Lenis** | Every scroll reveal, the hero timeline, progress bars, orb parallax, and inertial smooth scrolling. |

All heavy scenes are code-split and lazy-loaded, so the initial route stays light.
`prefers-reduced-motion` is respected throughout (Lenis disables, GSAP skips
animation, Motion uses `reducedMotion="user"`).

### Data

`web/public/data/projects.json` and `resume.json` mirror `data/` at the repo
root; `src/lib/github.js` loads live from the GitHub API, then cache, then a
curated fallback — the same strategy as the static site.

## Keeping the two builds in sync

`src/styles/site.css` is a copy of `assets/css/style.css`. When the shared design
tokens or section styles change, re-copy it:

```powershell
Copy-Item ..\assets\css\style.css .\src\styles\site.css -Force
```
