import * as THREE from 'three';

// 3D ∞ — free library Three.js, attractive + interactive, time-spent magnet
const canvas = document.getElementById('infinityCanvas');
const wrap = document.getElementById('infinity3dWrap');
const tooltip = document.getElementById('infinityTooltip');
if (!canvas || !wrap) { /* no canvas */ }

const labels = ['Land','Infrastructure','Power','AI/ML','Agriculture','Space','Transport','Ocean'];
const labelColors = [0x8b5a2b, 0x475569, 0xf59e0b, 0x7c3aed, 0x22c55e, 0x06b6d4, 0xea580c, 0x0ea5e9];

let scene, camera, renderer, tube, spheres = [], dot, raycaster, mouse, animationId;
let time = 0, hoverIdx = -1, autoRotate = true, isDragging = false, lastX = 0, rotY = 0;

function init() {
  scene = new THREE.Scene();
  scene.background = null;

  const rect = canvas.getBoundingClientRect();
  camera = new THREE.PerspectiveCamera(42, rect.width / 320, 0.1, 100);
  camera.position.set(0, 1.2, 6.5);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(rect.width, 320, false);

  // lights — attractive
  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const dir = new THREE.DirectionalLight(0xffffff, 1.1); dir.position.set(3,5,4); scene.add(dir);
  const point = new THREE.PointLight(0x06b6d4, 1.2, 12); point.position.set(2,1,2); scene.add(point);
  const point2 = new THREE.PointLight(0x7c3aed, 0.9, 12); point2.position.set(-2,0,1); scene.add(point2);

  // ∞ curve — figure-8 in 3D
  class InfinityCurve extends THREE.Curve {
    getPoint(t) {
      const a = t * Math.PI * 2;
      // lemniscate of Bernoulli scaled to 3D with slight Z for depth
      const scale = 2.1;
      const x = scale * Math.cos(a) / (1 + Math.sin(a)*Math.sin(a));
      const z = scale * Math.cos(a) * Math.sin(a) / (1 + Math.sin(a)*Math.sin(a));
      const y = Math.sin(a*2) * 0.12; // subtle 3D wave
      return new THREE.Vector3(x, y, z);
    }
  }
  const curve = new InfinityCurve();
  const tubeGeo = new THREE.TubeGeometry(curve, 180, 0.07, 14, true);
  const tubeMat = new THREE.MeshPhysicalMaterial({
    color: 0x334155, roughness: 0.32, metalness: 0.15, clearcoat: 0.6, transparent: true, opacity: 0.92
  });
  tube = new THREE.Mesh(tubeGeo, tubeMat);
  scene.add(tube);

  // traveling dot
  const dotGeo = new THREE.SphereGeometry(0.14, 18, 18);
  const dotMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.9 });
  dot = new THREE.Mesh(dotGeo, dotMat);
  scene.add(dot);

  // 8 nodes — interactive spheres + labels via sprites (simple)
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  for (let i = 0; i < 8; i++) {
    const t = i / 8;
    const p = curve.getPoint(t);
    const g = new THREE.SphereGeometry(i % 4 === 0 ? 0.22 : 0.17, 18, 18);
    const m = new THREE.MeshStandardMaterial({ color: labelColors[i], roughness: 0.4, metalness: 0.2 });
    const s = new THREE.Mesh(g, m);
    s.position.copy(p);
    s.userData = { idx: i, label: labels[i] };
    spheres.push(s);
    scene.add(s);
    // glow on hover — small point light per sphere
    const glow = new THREE.PointLight(labelColors[i], 0.0, 1.2);
    glow.position.copy(p);
    s.userData.glow = glow;
    scene.add(glow);
  }

  // center ∞ — small torus
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.28, 0.06, 14, 28),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
  );
  torus.rotation.x = Math.PI * 0.4;
  torus.position.set(0,0,0.12);
  scene.add(torus);

  // center text — canvas sprite
  const c = document.createElement('canvas'); c.width = 128; c.height = 128;
  const ctx = c.getContext('2d'); ctx.fillStyle = 'white'; ctx.font = 'bold 72px serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('∞',64,70);
  const tex = new THREE.CanvasTexture(c);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
  sprite.scale.set(0.9,0.9,1); sprite.position.set(0,0,0.32);
  scene.add(sprite);

  // events — drag rotate + hover
  canvas.addEventListener('pointerdown', e => { isDragging = true; lastX = e.clientX; autoRotate = false; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointerup', e => { isDragging = false; setTimeout(()=> autoRotate = true, 2200); });
  canvas.addEventListener('pointermove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left)/rect.width)*2 -1;
    mouse.y = -((e.clientY - rect.top)/rect.height)*2 +1;
    if (isDragging) {
      const dx = e.clientX - lastX; rotY += dx * 0.008; lastX = e.clientX;
    }
    // hover
    raycaster.setFromCamera(mouse, camera);
    const inter = raycaster.intersectObjects(spheres);
    if (inter.length) {
      const obj = inter[0].object;
      hoverIdx = obj.userData.idx;
      tooltip.textContent = obj.userData.label + ' → click to explore';
      tooltip.style.display = 'block';
      tooltip.style.left = e.clientX - wrap.getBoundingClientRect().left + 'px';
      tooltip.style.top = e.clientY - wrap.getBoundingClientRect().top + 'px';
      obj.scale.set(1.25,1.25,1.25);
      obj.userData.glow.intensity = 1.1;
      document.body.style.cursor = 'pointer';
    } else {
      if (hoverIdx !== -1) {
        const prev = spheres[hoverIdx];
        if (prev) { prev.scale.set(1,1,1); prev.userData.glow.intensity = 0; }
      }
      hoverIdx = -1; tooltip.style.display = 'none'; document.body.style.cursor = '';
    }
  });
  canvas.addEventListener('click', () => {
    if (hoverIdx !== -1) {
      const cards = document.querySelectorAll('.domain--infinity');
      if (cards[hoverIdx]) cards[hoverIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  window.addEventListener('resize', onResize);
  animate();
}

function onResize() {
  if (!canvas || !renderer || !camera) return;
  const rect = canvas.getBoundingClientRect();
  camera.aspect = rect.width / 320;
  camera.updateProjectionMatrix();
  renderer.setSize(rect.width, 320, false);
}

function animate() {
  animationId = requestAnimationFrame(animate);
  time += 0.006;
  if (autoRotate && !isDragging) rotY += 0.004;
  if (tube) tube.rotation.y = rotY * 0.6;
  spheres.forEach(s => s.rotation.y = rotY * 0.3);
  // dot travels
  if (dot) {
    const t = (time * 0.45) % 1;
    // reuse curve
    const a = t * Math.PI * 2;
    const scale = 2.1;
    dot.position.set(
      scale * Math.cos(a) / (1 + Math.sin(a)*Math.sin(a)),
      Math.sin(a*2)*0.12,
      scale * Math.cos(a)*Math.sin(a) / (1 + Math.sin(a)*Math.sin(a))
    );
    dot.position.y += tube ? tube.rotation.y*0 : 0;
    // make dot orbit with tube rotation
    const rot = tube ? tube.rotation.y : 0;
    const x = dot.position.x, z = dot.position.z;
    dot.position.x = x * Math.cos(rot) - z * Math.sin(rot);
    dot.position.z = x * Math.sin(rot) + z * Math.cos(rot);
  }
  // subtle camera breathe to keep time spent
  camera.position.y = 1.2 + Math.sin(time*0.7)*0.12;
  camera.lookAt(0,0,0);
  renderer.render(scene, camera);
}

// init when visible
const io = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting && !scene) init();
  });
}, { threshold: 0.2 });
if (canvas) io.observe(canvas);
// fallback init after 1.2s if not intersecting (e.g., small screen)
setTimeout(()=> { if (!scene && canvas) init(); }, 1600);
