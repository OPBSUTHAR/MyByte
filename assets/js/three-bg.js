import * as THREE from 'three';
// Optimized Three.js — professional subtle depth, not balloon
const canvas = document.getElementById('techCanvas');
if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) {
  if (canvas) canvas.style.display='none';
} else {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 100);
  camera.position.z = 6;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:false, powerPreference:'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.setSize(innerWidth, innerHeight, false);

  // subtle particles — optimized count
  const count = Math.min(140, Math.round(innerWidth*innerHeight/14000));
  const pos = new Float32Array(count*3);
  const vel = new Float32Array(count*3);
  for(let i=0;i<count;i++){
    pos[i*3]= (Math.random()-0.5)*12;
    pos[i*3+1]= (Math.random()-0.5)*7;
    pos[i*3+2]= (Math.random()-0.5)*4;
    vel[i*3]= (Math.random()-0.5)*0.003;
    vel[i*3+1]= (Math.random()-0.5)*0.003;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const mat = new THREE.PointsMaterial({ size:0.06, color:0x06b6d4, transparent:true, opacity:0.55, sizeAttenuation:true });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  let raf, ticking=false;
  function onResize(){
    camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
  }
  addEventListener('resize', onResize, {passive:true});

  // idle-aware loop — pause when hidden
  function tick(){
    const p = geo.attributes.position;
    for(let i=0;i<count;i++){
      p.array[i*3]+=vel[i*3];
      p.array[i*3+1]+=vel[i*3+1];
      if(Math.abs(p.array[i*3])>6) vel[i*3]*=-1;
      if(Math.abs(p.array[i*3+1])>3.5) vel[i*3+1]*=-1;
    }
    p.needsUpdate=true;
    points.rotation.y+=0.0006;
    renderer.render(scene,camera);
    if(!document.hidden) raf=requestAnimationFrame(tick);
    else setTimeout(()=> requestAnimationFrame(tick), 600);
  }
  document.addEventListener('visibilitychange', ()=>{ if(!document.hidden && !raf) tick(); });
  // defer start to idle
  (window.requestIdleCallback || (cb=> setTimeout(cb,400)))(tick);
}
