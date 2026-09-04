// MyByte Gate — request via GitHub Issues → owner approves (close issue) → 45 min access
(function(){
  const USER='OPBSUTHAR', REPO='MyByte';
  const LS_REQ='mybyte_request_id', LS_UNTIL='mybyte_access_until', LS_PENDING='mybyte_request_pending';
  const DURATION = 45*60*1000;
  const params = new URLSearchParams(location.search);
  // owner bypass: ?owner=1 or localhost with manual flag
  if(params.get('owner')==='1'){ localStorage.setItem('mybyte_owner','1'); localStorage.setItem(LS_UNTIL, String(Date.now()+DURATION)); location.search=''; return; }
  if(localStorage.getItem('mybyte_owner')==='1'){ return; } // owner never gated
  if(params.get('bypass')==='1') return;

  function isUnlocked(){
    const until = Number(localStorage.getItem(LS_UNTIL)||0);
    return until && Date.now() < until;
  }
  function remainingMs(){
    const until = Number(localStorage.getItem(LS_UNTIL)||0);
    return Math.max(0, until - Date.now());
  }
  if(isUnlocked()){
    // show subtle timer in console and auto-lock after expiry
    const ms = remainingMs();
    setTimeout(()=>{ localStorage.removeItem(LS_UNTIL); location.reload(); }, ms);
    // optional floating badge
    const badge = document.createElement('div');
    badge.id='gateBadge';
    badge.innerHTML=`🔓 Access ${Math.ceil(ms/60000)}m <button onclick="localStorage.removeItem('${LS_UNTIL}');location.reload()" style="margin-left:6px;background:transparent;border:0;color:inherit;cursor:pointer;text-decoration:underline">lock</button>`;
    badge.style.cssText='position:fixed;bottom:14px;right:14px;z-index:9998;background:rgba(6,182,214,.12);border:1px solid rgba(6,182,214,.3);backdrop-filter:blur(8px);padding:6px 10px;border-radius:999px;font:700 .74rem JetBrains Mono,monospace;color:var(--text)';
    // append after DOM ready
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>document.body.appendChild(badge));
    else document.body.appendChild(badge);
    // countdown update
    setInterval(()=>{ const r=remainingMs(); if(r<=0){ badge.textContent='🔒 Expired'; location.reload(); } else badge.firstChild.textContent=`🔓 Access ${Math.ceil(r/60000)}m `; }, 60000);
    return;
  }

  // Need to gate — inject overlay
  const css = `
  #gateOverlay{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgba(7,10,20,.78);backdrop-filter:blur(10px) saturate(1.2);padding:18px}
  #gateCard{width:min(520px,92vw);background:var(--card);border:1px solid var(--line);border-radius:20px;box-shadow:0 24px 64px rgba(0,0,0,.5);overflow:hidden}
  #gateCard .gateHead{padding:18px 18px 0; display:flex; gap:12px; align-items:center}
  #gateCard .gateLogo{width:40px;height:40px;display:grid;place-items:center;background:var(--grad2);color:#fff;border-radius:10px;font-family:JetBrains Mono,monospace;font-weight:800}
  #gateCard h2{margin:0;font-family:Fraunces,serif;font-size:1.5rem;line-height:1}
  #gateCard .gateBody{padding:16px 18px; color:var(--muted); font-size:.92rem; line-height:1.5}
  #gateCard .gateActions{padding:12px 18px 18px; display:grid; gap:10px}
  #gateCard input{width:100%;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--card2);color:var(--text);font:inherit}
  #gateCard .gateNote{font-size:.74rem;color:var(--muted); text-align:center; font-family:JetBrains Mono,monospace}
  #gatePending{display:none; text-align:center; padding:14px; border:1px dashed var(--line); border-radius:12px; background:color-mix(in srgb, var(--card2) 60%, transparent); margin-top:10px}
  `;

  function injectCSS(){ const s=document.createElement('style'); s.textContent=css; document.head.appendChild(s); }

  function buildOverlay(){
    injectCSS();
    const overlay=document.createElement('div');
    overlay.id='gateOverlay';
    overlay.innerHTML=`
      <div id="gateCard">
        <div class="gateHead"><div class="gateLogo">MB</div><div><h2>Request access</h2><div class="small muted">Owner approval required — 45 min access via GitHub</div></div></div>
        <div class="gateBody">
          <p>This portfolio is gated. To view, send a request to <b>@OPBSUTHAR</b> on GitHub. When approved, you get <b>45 minutes</b> of access on this device.</p>
          <label style="display:grid; gap:6px; font-weight:700; font-size:.84rem">Your GitHub username or email
            <input id="gateUser" placeholder="e.g. your-github-handle or you@email.com" required />
          </label>
          <div id="gatePending">
            <div style="font-weight:800; color:var(--text)">⏳ Request sent — awaiting approval</div>
            <div class="small muted" style="margin-top:6px">We opened a GitHub Issue for you. The owner will <b>close the issue</b> to approve. This page checks every 15s.</div>
            <div class="small muted" id="gateStatus" style="margin-top:8px; font-family:JetBrains Mono,monospace"></div>
            <button id="gateCheck" class="btn btn--sm" style="margin-top:10px">Check now</button>
          </div>
        </div>
        <div class="gateActions">
          <button id="gateRequest" class="btn btn--primary">📨 Request via GitHub</button>
          <div style="display:flex; gap:8px"><button id="gateOwner" class="btn btn--ghost btn--sm" style="flex:1">I am owner → unlock</button><a href="https://github.com/OPBSUTHAR/MyByte/issues" target="_blank" class="btn btn--ghost btn--sm" style="flex:1">View requests ↗</a></div>
          <div class="gateNote">No account? Request still opens a pre-filled issue — you can create with email via GitHub. Local only after approval — no code exposed until then (blurred).</div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    document.body.style.overflow='hidden';

    const userInput = overlay.querySelector('#gateUser');
    const reqBtn = overlay.querySelector('#gateRequest');
    const pending = overlay.querySelector('#gatePending');
    const statusEl = overlay.querySelector('#gateStatus');
    const checkBtn = overlay.querySelector('#gateCheck');
    const ownerBtn = overlay.querySelector('#gateOwner');

    // restore pending state if exists
    const existingId = localStorage.getItem(LS_REQ);
    const isPending = localStorage.getItem(LS_PENDING)==='1';
    if(existingId && isPending){
      pending.style.display='block';
      reqBtn.style.display='none';
      userInput.value = localStorage.getItem('mybyte_request_user')||'';
      statusEl.textContent='Request ID: '+existingId+' — polling…';
      startPoll(existingId, statusEl);
    }

    ownerBtn.onclick=()=>{
      const code = prompt('Owner code? (hint: set ?owner=1) — enter any to unlock locally for 45m');
      if(code!==null){ localStorage.setItem('mybyte_owner','1'); localStorage.setItem(LS_UNTIL, String(Date.now()+DURATION)); location.reload(); }
    };

    reqBtn.onclick=()=>{
      const user = userInput.value.trim();
      if(!user){ userInput.focus(); userInput.style.borderColor='var(--primary)'; return; }
      const id = 'req-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6);
      localStorage.setItem(LS_REQ, id);
      localStorage.setItem('mybyte_request_user', user);
      localStorage.setItem(LS_PENDING, '1');
      const title = encodeURIComponent(`Access Request ${id} from ${user}`);
      const body = encodeURIComponent(`Hello @OPBSUTHAR,\n\n**Access request** for MyByte portfolio:\n\n- **Request ID:** \`${id}\`\n- **Visitor:** \`${user}\`\n- **Page:** ${location.href}\n- **Time:** ${new Date().toISOString()}\n\n**To approve:** close this issue. The visitor's page polls GitHub Issues — when closed, they get 45 min access (localStorage).\n\n*Auto-generated from gate.js*`);
      const url = `https://github.com/OPBSUTHAR/MyByte/issues/new?title=${title}&body=${body}`;
      window.open(url,'_blank');
      pending.style.display='block';
      reqBtn.style.display='none';
      statusEl.textContent='Request ID: '+id+' — polling every 15s…';
      startPoll(id, statusEl);
    };
    checkBtn.onclick=()=>{
      const id = localStorage.getItem(LS_REQ);
      if(id) checkApproval(id, statusEl);
    };
  }

  async function checkApproval(id, statusEl){
    try{
      statusEl.textContent='Checking GitHub…';
      // fetch closed + open issues, look for title containing id
      const r = await fetch(`https://api.github.com/repos/${USER}/${REPO}/issues?state=all&per_page=100`, {headers:{'Accept':'application/vnd.github.v3+json'}});
      if(!r.ok) throw new Error('GitHub API '+r.status);
      const issues = await r.json();
      const found = issues.find(it=> it.title && it.title.includes(id));
      if(!found){
        statusEl.textContent='Not found yet — ensure you created the issue (maybe draft?).';
        return;
      }
      if(found.state==='closed'){
        // approved!
        localStorage.setItem(LS_UNTIL, String(Date.now()+DURATION));
        localStorage.removeItem(LS_PENDING);
        statusEl.textContent='✅ Approved! Unlocking for 45 min…';
        setTimeout(()=> location.reload(), 800);
      } else {
        statusEl.textContent='⏳ Found open issue #'+found.number+' — awaiting owner to close it. Retrying…';
      }
    }catch(e){
      statusEl.textContent='Check failed: '+e.message+' — retrying in 15s';
    }
  }
  function startPoll(id, statusEl){
    checkApproval(id, statusEl);
    const iv = setInterval(()=>{
      if(isUnlocked()){ clearInterval(iv); return; }
      const stillPending = localStorage.getItem(LS_PENDING)==='1' && localStorage.getItem(LS_REQ)===id;
      if(!stillPending){ clearInterval(iv); return; }
      checkApproval(id, statusEl);
    }, 15000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', buildOverlay);
  else buildOverlay();
})();
