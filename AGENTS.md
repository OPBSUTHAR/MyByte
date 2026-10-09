# AGENTS.md — MyByte Agent Instructions

> This file is auto-loaded by opencode (via `opencode.json: instructions`). Every agent MUST follow it.

## Project: MyByte — Omprakash Suthar Portfolio

**Full-stack React SPA** (Vite + React 18) — the static GitHub Pages build was removed. The only build is `web/` → `web/dist`, served by Vercel at **https://my-byte.vercel.app** (auto-deploys on push to `origin/main`; root `vercel.json`). Python data pipeline: `tools/fetch_github.py` → `data/projects.json` → `web/public/data/`.

### Golden Rule

**You do not ask the user to test, run, or push. You DO it automatically.**

Every task that changes code/docs/assets MUST end with:
1. **Test/verify** locally (build + static checks — the app is NOT run locally)
2. **If all checks pass → commit + push** to `origin/main` automatically. Vercel auto-deploys. No manual prompt.

**Do NOT start a local dev server / preview server after updates** — the user tests the live Vercel deployment themselves and reports back.

If tests fail, fix and re-test until green before pushing.

---

## 1. Before ANY Edit

- Read relevant files fully (`web/src/App.jsx`, `web/src/styles/site.css`, `web/src/components/*`, `web/src/hooks/*`, `web/src/pages/*`, `tools/fetch_github.py`).
- Check `git status`, `git diff`, `git log --oneline -5` to understand current state.
- Preserve the neo-stone design tokens in `web/src/styles/site.css` (`--bg`, `--primary`, etc.) and editorial typography (Fraunces + Inter + JetBrains Mono + Space Grotesk).

## 2. After EVERY Edit — Mandatory Verify

Run these locally **every time** (Windows: use `py` not `python3`):

```bash
# 1. React build — must compile
cd web; npm run build

# 2. CSS — must compile (no unmatched braces)
py -c "import pathlib; c=pathlib.Path('web/src/styles/site.css').read_text(encoding='utf-8'); assert c.count('{')==c.count('}'), 'CSS brace mismatch'; print('CSS OK', c.count('{'), 'rules')"

# 3. JS — key modules must exist with expected exports
py -c "import pathlib; t=pathlib.Path('web/src/App.jsx').read_text(encoding='utf-8'); assert 'useQuest' in t and 'Konami' in t or 'KONAMI' in t; print('App OK')"
py -c "import pathlib; t=pathlib.Path('web/src/components/Terminal.jsx').read_text(encoding='utf-8'); assert 'help' in t and 'sudo hire' in t; print('Terminal OK')"
py -c "import pathlib; t=pathlib.Path('web/src/hooks/useQuest.js').read_text(encoding='utf-8'); assert 'LEVELS' in t and 'ACHIEVEMENTS' in t; print('Quest OK')"

# 4. Serve + smoke test (must return 200 and contain MyByte)
py -c "import http.server, threading, time, urllib.request; httpd=http.server.ThreadingHTTPServer(('127.0.0.1',0), http.server.SimpleHTTPRequestHandler); port=httpd.server_address[1]; threading.Thread(target=httpd.serve_forever, daemon=True).start(); time.sleep(0.8); data=urllib.request.urlopen(f'http://127.0.0.1:{port}/web/dist/').read().decode(); assert 'MyByte' in data or 'root' in data; print('SERVE OK', port); httpd.shutdown()"

# 5. Python tool — must still work (dry-run)
py tools/fetch_github.py --help 2>&1 | head -5; echo "fetch tool exists"
```

If any check fails:
- Fix code immediately.
- Do NOT proceed to push.
- Re-run all checks.

Optional deeper: Lighthouse check, `git diff --stat`.

## 3. Auto-Push + Auto-Run Protocol — Only When Green

When all verifies pass, do **immediately** without asking — first push, then run:

```bash
git status
git diff
git log --oneline -5
git add -A
git commit -m "feat: <concise what changed> — verified & live"
git push origin main
```

Rules for push:
- Stage only intended files (never secrets/`.env`, `__pycache__/`, `.venv/`).
- Commit message: concise, imperative, includes `verified`.
- Do NOT force-push, do NOT amend failed commits — create new commit.
- If `git push` fails (auth/network), report and retry once.
- Report the live URL (https://my-byte.vercel.app) in the final response — do NOT start any local server.

## 4. Style & Constraints

- Prefer EDIT over CREATE. Never create docs unless requested.
- Keep the factorial home sections: Vision → Domains → Case Studies → Showcase → All Work → Goals → Stack → About → Journey → Contact. Domain tags via `DOMAIN_MAP` in `web/src/lib/github.js`.
- Keep dark "obsidian" default theme (`data-theme="dark"`), light "bone" + "cyber" via the theme cycler in Nav and the terminal `theme` command.
- Mobile-first, 95+ Lighthouse target. All animation transform/opacity only; `prefers-reduced-motion` fallbacks everywhere.
- Do not update `opencode.json` or agent config unless asked, except via this file.

## 5. When In Doubt

- Evidence before synthesis: read file, run command, then conclude.
- If instruction conflicts, trust this file over chat history.
- If you fix 1+ checks, state discrepancy clearly before pushing.

---

**Agent: after reading this, you MUST test + push + run automatically on every successful task. The user should never have to say "test, run and push" again.**
