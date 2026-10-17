import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   STORYBOARD — a sketch comic that watercolors itself on scroll.
   Each frame is ink line-art sitting on soft watercolor blobs.
   Every wash carries its target strength as an SVG opacity
   attribute; when motion is allowed we arm `.sb-on` (washes
   hidden) and scrub them back in — panel by panel, blob by blob
   — with GSAP ScrollTrigger. Without JS, or with reduced motion,
   the comic simply ships fully painted.
   ============================================================ */

const PANELS = [
  {
    tag: '01 — ORIGIN',
    cap: 'Bengaluru. A student, one laptop, and a stubborn rule: ship it live or it doesn\u2019t count.',
    art: (
      <svg className="sb-svg" viewBox="0 0 340 240" aria-hidden="true" focusable="false">
        <g className="sb-wash">
          <path className="wb" opacity=".22" fill="#BFD9E2" d="M40 26 Q120 8 210 30 Q150 70 60 64 Q34 48 40 26 Z" />
          <path className="wb" opacity=".3" fill="#C9B28C" d="M24 194 Q170 188 314 192 L316 216 L22 216 Z" />
          <path className="wb" opacity=".55" fill="#F0D6A0" d="M50 156 L124 152 L126 184 L52 188 Z" />
          <path className="wb" opacity=".55" fill="#35D399" d="M126 114 Q176 108 220 114 L220 188 Q172 194 126 188 Z" />
          <path className="wb" opacity=".85" fill="#A7F3D0" d="M152 148 C142 136 126 139 126 149 C126 159 142 161 152 149 C162 137 178 139 178 149 C178 159 162 161 152 149 Z" />
          <path className="wb" opacity=".6" fill="#A7F3D0" d="M244 178 Q240 148 263 146 Q286 148 284 178 L284 194 L244 194 Z" />
          <path className="wb" opacity=".5" fill="#EAC27E" d="M246 120 Q246 103 263 103 Q281 103 282 120 Q282 138 263 139 Q247 138 246 120 Z" />
          <path className="wb" opacity=".5" fill="#D98E4A" d="M290 162 L312 162 L308 192 L292 192 Z" />
        </g>
        <g className="sb-ink">
          <path d="M66 30 Q88 38 84 62 Q80 82 60 84 Q74 70 74 54 Q74 42 66 30 Z" />
          <path d="M106 38 L106 48 M101 43 L111 43" />
          <path d="M130 26 L130 34 M126 30 L134 30" />
          <path d="M28 192 Q170 188 312 191" />
          <path d="M48 192 L46 216 M292 192 L294 216" />
          <path d="M128 116 Q172 112 216 116 L216 186 Q172 190 128 186 Z" />
          <path d="M112 186 L232 186 L224 199 L120 199 Z" />
          <path d="M154 151 C144 139 128 141 128 151 C128 161 144 163 154 151 C164 139 180 141 180 151 C180 161 164 163 154 151 Z" />
          <path className="sb-ink--dash" d="M244 122 Q244 102 263 102 Q282 102 283 121 Q284 140 264 141 Q245 141 244 122 Z" />
          <path d="M242 112 Q244 92 263 92 Q282 92 284 112" />
          <path d="M236 112 Q232 114 232 122 Q232 130 237 130 L242 129 L242 113 Z" />
          <path d="M290 112 Q294 114 294 122 Q294 130 289 130 L284 129 L284 113 Z" />
          <path d="M250 103 Q254 98 260 99" />
          <path d="M256 118 L256 120 M256 131 Q261 135 266 130" />
          <path d="M246 176 Q244 150 263 148 Q283 150 282 176 L282 192 L246 192 Z" />
          <path d="M247 160 Q228 166 216 172 M216 172 Q212 174 210 177" />
          <path d="M292 166 L308 166 L306 190 L294 190 Z" />
          <path d="M308 171 Q316 175 307 181" />
          <path d="M297 158 Q300 152 297 146 M303 158 Q306 152 303 146" />
          <path d="M52 158 L84 155 L87 182 L55 185 Z M60 166 L78 165 M60 173 L74 172" />
          <path d="M92 160 L120 158 L122 180 L94 182 Z M100 168 L114 167 M100 174 L110 173" />
        </g>
      </svg>
    ),
  },
  {
    tag: '02 — THE LOOP',
    cap: 'Eight elements, one system. Land to ocean \u2014 every build feeds the next loop.',
    art: (
      <svg className="sb-svg" viewBox="0 0 340 240" aria-hidden="true" focusable="false">
        <g className="sb-wash">
          <path className="wb" opacity=".3" fill="#BFD9E2" d="M70 40 Q186 34 302 40 L302 174 Q186 179 70 174 Z" />
          <path className="wb" opacity=".16" fill="#A7F3D0" d="M185 52 Q249 54 273 106 Q253 158 185 160 Q117 158 97 106 Q117 54 185 52 Z" />
          <path className="wb" opacity=".6" fill="#35D399" d="M185 104 C164 74 130 80 128 104 C126 128 164 132 185 104 C207 76 242 82 242 104 C242 126 207 132 185 104 Z" />
          <path className="wb" opacity=".45" fill="#2DD4BF" d="M20 188 Q20 146 34 144 Q48 146 48 188 Z" />
          <path className="wb" opacity=".45" fill="#EAC27E" d="M20 114 Q20 102 34 102 Q48 102 49 114 Q49 127 34 128 Q21 127 20 114 Z" />
          <path className="wb" opacity=".45" fill="#2DD4BF" d="M290 56 L338 56 L338 70 L290 70 Z" />
          <path className="wb" opacity=".5" fill="#E0A45E" d="M14 54 L44 54 L26 100 L40 72 L26 72 L38 54 Z" />
          <path className="wb" opacity=".5" fill="#7FC98A" d="M306 128 Q330 136 328 162 Q312 166 310 148 Z" />
          <path className="wb" opacity=".3" fill="#D9C49A" d="M18 206 Q170 202 322 205 L322 220 L18 220 Z" />
        </g>
        <g className="sb-ink">
          <path d="M18 208 Q170 205 322 207" />
          <path d="M70 42 Q186 36 300 42 L300 172 Q186 177 70 172 Z" />
          <path d="M182 172 L182 202 M154 204 L212 203" />
          <path d="M185 106 C167 82 135 86 135 106 C135 126 167 130 185 106 C203 82 235 86 235 106 C235 126 203 130 185 106 Z" />
          <circle cx="273" cy="106" r="5" />
          <circle cx="247" cy="71" r="5" />
          <circle cx="185" cy="56" r="5" />
          <circle cx="123" cy="71" r="5" />
          <circle cx="97" cy="106" r="5" />
          <circle cx="123" cy="141" r="5" />
          <circle cx="185" cy="156" r="5" />
          <circle cx="247" cy="141" r="5" />
          <path d="M18 116 Q18 100 34 100 Q50 100 50 115 Q50 130 34 131 Q19 130 18 116 Z" />
          <path d="M30 116 Q34 120 38 115" />
          <path d="M20 188 Q20 148 34 146 Q48 148 48 188 Z" />
          <path d="M48 154 Q62 144 72 138 M72 138 l6 -4 M72 138 l5 4" />
          <path d="M306 58 L322 56 L324 70 L308 72 Z" />
          <path d="M306 61 L294 63 L292 69 L306 68 M322 59 L336 58 L336 66 L324 68" />
          <path d="M312 50 Q320 44 326 50 M314 56 L314 50" />
          <path d="M320 158 Q320 146 316 136 M316 144 Q308 140 312 134 M318 140 Q326 136 322 130 M315 152 Q308 148 311 141 M319 148 Q327 144 324 137" />
          <path d="M60 52 L48 76 L59 76 L53 98 L72 70 L59 70 L66 52 Z" />
          <path d="M252 194 Q262 186 272 194 T292 194" />
          <path d="M262 204 Q272 196 282 204 T302 204" />
        </g>
      </svg>
    ),
  },
  {
    tag: '03 — FIELD-READY',
    cap: 'Offline OCR. Models under 30KB. Trust is a feature \u2014 especially without internet.',
    art: (
      <svg className="sb-svg" viewBox="0 0 340 240" aria-hidden="true" focusable="false">
        <g className="sb-wash">
          <path className="wb" opacity=".2" fill="#BFD9E2" d="M22 22 Q170 6 318 24 Q318 60 300 74 Q170 84 40 72 Q24 48 22 22 Z" />
          <path className="wb" opacity=".45" fill="#EAD9B0" d="M54 178 L54 142 L112 142 L112 178 Z" />
          <path className="wb" opacity=".45" fill="#EAD9B0" d="M242 178 L242 152 L284 152 L284 178 Z" />
          <path className="wb" opacity=".5" fill="#D98E4A" d="M50 142 L84 114 L118 142 Z" />
          <path className="wb" opacity=".5" fill="#D98E4A" d="M240 152 L264 133 L288 152 Z" />
          <path className="wb" opacity=".5" fill="#F0D6A0" d="M116 120 L186 114 L192 184 L122 190 Z" />
          <path className="wb" opacity=".6" fill="#35D399" d="M106 180 Q128 176 130 190 Q126 202 112 200 Q102 194 106 180 Z" />
          <path className="wb" opacity=".4" fill="#35D399" d="M198 118 L226 118 L226 186 L198 186 Z" />
          <path className="wb" opacity=".4" fill="#2DD4BF" d="M20 194 Q170 184 320 194 L320 222 L20 222 Z" />
          <path className="wb" opacity=".55" fill="#E0A45E" d="M46 182 L64 198 L46 200 Z" />
        </g>
        <g className="sb-ink">
          <path d="M18 178 Q170 175 322 177" />
          <path d="M56 178 L56 142 L84 120 L112 142 L112 178 Z" />
          <path d="M76 178 L76 158 L92 158 L92 178" />
          <path d="M62 148 L72 148 L72 156 L62 156 Z" />
          <path d="M244 178 L244 152 L264 136 L284 152 L284 178 Z" />
          <path d="M250 158 L258 158 L258 165 L250 165 Z" />
          <path d="M158 178 L158 92 M152 112 L164 112 M153 132 L163 132" />
          <path d="M166 84 Q176 76 180 62 M172 88 Q188 78 194 58 M178 92 Q198 80 208 54" />
          <path d="M118 128 L178 122 L184 176 L124 182 Z" />
          <path d="M130 140 L168 136 M131 150 L162 147 M133 160 L170 157" />
          <path className="sb-ink--dash" d="M112 116 L192 110 L198 186 L118 192 Z" />
          <path d="M112 182 Q124 178 130 188 Q128 200 116 200 Q106 196 108 186 Q109 182 112 182 Z" />
          <path d="M114 190 L119 196 L128 184" />
          <path d="M196 118 Q211 114 224 118 L224 184 Q211 188 196 184 Z" />
          <path d="M203 132 L217 130 M203 142 L214 141" />
          <path d="M203 148 Q196 154 200 164" />
          <path d="M224 172 Q236 182 240 194" />
          <path d="M30 202 Q48 212 66 202" />
          <path d="M48 202 L48 180" />
          <path d="M48 182 L62 198 L48 200 Z" />
          <path d="M48 180 l7 3" />
          <path d="M22 200 Q32 192 42 200 T62 200 T82 200 T102 200 T122 200 T142 200 T162 200 T182 200 T202 200 T222 200 T242 200 T262 200 T282 200 T302 200" />
          <path d="M32 214 Q42 206 52 214 T72 214 T92 214 T112 214 T132 214 T152 214 T172 214 T192 214 T212 214 T232 214 T252 214 T272 214 T292 214" />
        </g>
      </svg>
    ),
  },
  {
    tag: '04 — YOUR FRAME',
    cap: '42 repos live, and the loop keeps turning. The next frame could be ours \u2014 say hi.',
    art: (
      <svg className="sb-svg" viewBox="0 0 340 240" aria-hidden="true" focusable="false">
        <g className="sb-wash">
          <path className="wb" opacity=".65" fill="#35D399" d="M170 48 C150 22 118 28 116 50 C114 72 150 76 170 48 C190 24 222 30 222 50 C222 70 190 76 170 48 Z" />
          <path className="wb" opacity=".6" fill="#A7F3D0" d="M148 172 Q146 130 170 128 Q194 130 193 172 L193 202 L148 202 Z" />
          <path className="wb" opacity=".5" fill="#EAC27E" d="M153 99 Q153 83 170 83 Q187 83 188 99 Q188 115 170 116 Q154 115 153 99 Z" />
          <path className="wb" opacity=".4" fill="#BFD9E2" d="M38 62 Q36 42 58 41 L112 39 Q130 39 131 56 L130 78 Q130 88 116 87 L76 89 Q54 90 44 80 Q38 74 38 62 Z" />
          <path className="wb" opacity=".55" fill="#E0A45E" d="M248 96 L292 105 L248 117 Z" />
          <path className="wb" opacity=".3" fill="#D9C49A" d="M24 204 Q170 201 318 204 L318 220 L24 220 Z" />
        </g>
        <g className="sb-ink">
          <path d="M26 206 Q170 203 316 205" />
          <path d="M152 100 Q152 82 170 82 Q188 82 189 99 Q190 116 171 117 Q153 117 152 100 Z" />
          <path d="M156 86 Q162 78 174 80" />
          <path d="M163 98 L163 100 M177 98 L177 100" />
          <path d="M163 108 Q170 113 177 107" />
          <path d="M150 172 Q148 132 170 130 Q192 132 191 172 L191 200 L150 200 Z" />
          <path d="M158 200 L156 210 M182 200 L184 210" />
          <path d="M191 140 Q208 128 216 112 M216 112 l8 -4 M216 112 l7 2 M216 112 l3 8" />
          <path d="M150 140 Q140 156 138 170 M138 170 q-4 4 -2 8" />
          <path d="M170 50 C154 28 124 32 124 50 C124 68 154 72 170 50 C186 28 216 32 216 50 C216 68 186 72 170 50 Z" />
          <path d="M36 64 Q34 42 58 40 L112 38 Q132 38 133 56 L132 78 Q132 90 118 88 L74 90 Q52 92 42 82 Q36 76 36 64 Z" />
          <path d="M74 90 L60 104 L80 92" />
          <text className="sb-hand" x="84" y="70" textAnchor="middle">{"let\u2019s build!"}</text>
          <path d="M248 206 L248 96" />
          <path d="M248 98 L290 106 L248 118 Z" />
          <text className="sb-hand" x="266" y="112" textAnchor="middle">42</text>
          <path d="M296 70 L296 80 M291 75 L301 75" />
          <path d="M110 30 L110 38 M106 34 L114 34" />
          <path d="M300 150 L300 158 M296 154 L304 154" />
        </g>
      </svg>
    ),
  },
];

export default function Storyboard() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      el.classList.add('sb-on');
      el.querySelectorAll('.sb-panel').forEach((panel) => {
        const blobs = panel.querySelectorAll('.wb');
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top 84%',
            end: 'bottom 42%',
            scrub: 0.6,
          },
        });
        tl.fromTo(panel, { y: 30 }, { y: 0, ease: 'power2.out', duration: 0.5 }, 0)
          .fromTo(blobs, { scale: 0.86 }, {
            scale: 1,
            opacity: (i, t) => parseFloat(t.getAttribute('opacity') || '0.5'),
            duration: 1.2,
            ease: 'power1.inOut',
            stagger: 0.08,
          }, 0.12);
      });
      return () => el.classList.remove('sb-on');
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="storyboard" className="section storyboard" ref={root}>
      <div className="container">
        <div className="sb-head">
          <div className="section__eyebrow">∞ — Storyboard</div>
          <h2>The story behind the bytes.</h2>
          <p className="muted">Hand-drawn frames that paint themselves in — scroll to watercolor the comic.</p>
          <div className="sb-hint" aria-hidden="true"><i /> ink first · color on scroll <i className="b2" /></div>
        </div>
        <div className="sb-grid">
          {PANELS.map((p) => (
            <figure key={p.tag} className="sb-panel">
              {p.art}
              <figcaption className="sb-cap"><b>{p.tag}</b><p>{p.cap}</p></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
