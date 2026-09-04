# AGENTS.md — MyByte Agent Instructions

> This file is auto-loaded by opencode (via `opencode.json: instructions`). Every agent MUST follow it.

## Project: MyByte — Omprakash Suthar Portfolio

Static HTML/CSS/JS portfolio + Python build step (`tools/fetch_github.py` → `data/projects.json`). Hosted on GitHub Pages via `.github/workflows/deploy.yml`. Zero-build, vanilla stack.

### Golden Rule

**You do not ask the user to test, run, or push. You DO it automatically.**

Every task that changes code/docs/assets MUST end with:
1. **Test/verify** locally
2. **If all checks pass → commit + push** to `origin/main` automatically. No manual prompt.
3. **After push → start app in another terminal** automatically so user can see it live. No repetition needed.

If tests fail, fix and re-test until green before pushing/running.

---

## 1. Before ANY Edit

- Read relevant files fully (`index.html`, `assets/css/style.css`, `assets/js/*.js`, `data/projects.json`, `tools/fetch_github.py`, `.github/workflows/deploy.yml`).
- Check `git status`, `git diff`, `git log --oneline -5` to understand current state.
- Preserve design tokens in `assets/css/style.css:2` (`--bg`, `--grad`, etc.) and editorial typography (Fraunces + Inter + JetBrains Mono).

## 2. After EVERY Edit — Mandatory Verify

Run these locally **every time** (Windows: use `py` not `python3`):

```bash
# 1. HTML structure — must contain all factorial sections
py -c "import pathlib; t=pathlib.Path('index.html').read_text(encoding='utf-8'); assert 'id=\"vision\"' in t and 'id=\"domains\"' in t and 'id=\"work\"' in t and 'id=\"goals\"' in t, 'missing sections'; print('HTML OK', len(t.splitlines()), 'lines')"

# 2. CSS — must compile (no unmatched braces)
py -c "import pathlib; c=pathlib.Path('assets/css/style.css').read_text(); assert c.count('{')==c.count('}'), 'CSS brace mismatch'; print('CSS OK', c.count('{'), 'rules')"

# 3. JS — syntax check (node if available, else py count)
py -c "import pathlib; j=pathlib.Path('assets/js/github.js').read_text(); assert 'DOMAIN_MAP' in j; print('JS github OK')"
py -c "import pathlib; j=pathlib.Path('assets/js/main.js').read_text(); assert 'typed' in j; print('JS main OK')"

# 4. Serve + smoke test (must return 200 and contain MyByte)
py -c "import http.server, threading, time, os, urllib.request; os.chdir('.'); httpd=http.server.ThreadingHTTPServer(('127.0.0.1',0), http.server.SimpleHTTPRequestHandler); port=httpd.server_address[1]; threading.Thread(target=httpd.serve_forever, daemon=True).start(); time.sleep(0.8); data=urllib.request.urlopen(f'http://127.0.0.1:{port}/').read().decode(); assert 'MyByte' in data and 'Omprakash' in data; print('SERVE OK', port); httpd.shutdown()"

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

Then **start app in another terminal** so user can see it live (MyByte is static → `py -m http.server 8000`):

```bash
# Windows PowerShell — new window on port 8000 (kill old if needed)
Start-Process -FilePath "py" -ArgumentList "-m","http.server","8000" -WorkingDirectory "C:\vs code\MyByte"
# verify it started
Start-Sleep -Seconds 1; Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8000/ | Select-Object StatusCode
# → 200 means live at http://localhost:8000
```

Rules for push:
- Stage only intended files (never secrets/`.env`, `__pycache__/`, `.venv/`).
- Commit message: concise, imperative, includes `verified`.
- Do NOT force-push, do NOT amend failed commits — create new commit.
- If `git push` fails (auth/network), report and retry once.

Rules for run:
- ALWAYS start app after push, even if user didn't ask.
- If port 8000 busy, try 8001: `py -m http.server 8001`
- Log the URL (`http://localhost:8000`) in final response.
- Do NOT block agent on server — run detached (`Start-Process` / `bash &`).

## 4. Style & Constraints

- Prefer EDIT over CREATE. Never create docs unless requested.
- Keep `index.html` factorial: Vision → Domains → Case Studies → Showcase → All Work → Goals → Stack → About → Journey → Contact. Domain tags via `DOMAIN_MAP` in `assets/js/github.js:11`.
- Keep dark default theme (`data-theme="dark"`), light toggle via `assets/js/main.js:14`.
- Mobile-first, 95+ Lighthouse target, ≤30KB philosophy.
- Do not update `opencode.json` or agent config unless asked, except via this file.

## 5. When In Doubt

- Evidence before synthesis: read file, run command, then conclude.
- If instruction conflicts, trust this file over chat history.
- If you fix 1+ checks, state discrepancy clearly before pushing.

---

**Agent: after reading this, you MUST test + push + run automatically on every successful task. The user should never have to say "test, run and push" again.**
