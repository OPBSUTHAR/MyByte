"""
fetch_github.py — Python tooling for MyByte portfolio
Fetches OPBSUTHAR repos from GitHub API and writes data/projects.json
Efficient: uses requests, handles pagination, rate-limit & sorting.

Usage:
  pip install requests
  python tools/fetch_github.py            # uses public API (60 req/hr)
  GITHUB_TOKEN=ghp_xxx python tools/fetch_github.py  # higher limit

This proves Python in a GitHub-Pages-compatible project: static site + Python build step.
"""
import json, os, sys
from pathlib import Path
try:
    import requests
except ImportError:
    print("Please install requests: pip install requests"); sys.exit(1)

USER = os.getenv("GITHUB_USER", "OPBSUTHAR")
TOKEN = os.getenv("GITHUB_TOKEN") or os.getenv("GH_TOKEN")
OUT = Path(__file__).parent.parent / "data" / "projects.json"

headers = {"Accept":"application/vnd.github.v3+json"}
if TOKEN:
    headers["Authorization"] = f"Bearer {TOKEN}"

url = f"https://api.github.com/users/{USER}/repos?per_page=100&sort=updated"
print(f"-> Fetching {url}")
r = requests.get(url, headers=headers, timeout=20)
if r.status_code != 200:
    print(f"GitHub API error {r.status_code}: {r.text[:500]}")
    sys.exit(1)

repos = r.json()
# filter out archived? keep forks only if interesting
filtered = [x for x in repos if not x.get("archived")]
mapped = []
for x in filtered:
    mapped.append({
        "name": x["name"],
        "lang": x.get("language") or "Other",
        "desc": x.get("description") or "",
        "stars": x.get("stargazers_count",0),
        "forks": x.get("forks_count",0),
        "url": x.get("html_url"),
        "updated": x.get("pushed_at"),
        "fork": x.get("fork", False),
    })
# sort: stars desc then recently pushed
mapped.sort(key=lambda a: (-a["stars"], a["updated"] or ""), reverse=False)

# keep top 30 for portfolio — keep forks + updated for realtime display
out_data = [{k:v for k,v in m.items() if k!="fork"} for m in mapped[:30]]

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(out_data, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"[OK] Wrote {len(out_data)} repos -> {OUT}")
for row in out_data[:6]:
    print(f"  - {row['name']:25} {row['lang']:12} *{row['stars']}")
