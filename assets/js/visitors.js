// MyByte visitors — total site visit counter shown in every footer.
// Uses the public CounterAPI (CountAPI successor). Falls back to a
// per-browser localStorage count if the network/API is unavailable.
(function(){
  const NS = 'opbsuthar-mybyte', KEY = 'visits';
  function inject(count){
    const footers = document.querySelectorAll('.footer__inner');
    footers.forEach(f => {
      const p = document.createElement('p');
      p.className = 'small muted';
      p.innerHTML = '👣 Total visits: <b>' + count + '</b>';
      f.appendChild(p);
    });
  }
  fetch(`https://api.counterapi.dev/v1/${NS}/${KEY}/up`)
    .then(r => r.ok ? r.json() : Promise.reject(new Error(r.status)))
    .then(d => inject(d.count))
    .catch(() => {
      const n = Number(localStorage.getItem('mybyte_visits') || 0) + 1;
      localStorage.setItem('mybyte_visits', String(n));
      inject(n);
    });
})();
