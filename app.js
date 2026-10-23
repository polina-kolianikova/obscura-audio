import { phone, mobileFrames, mobileFallback } from "./mobile-stage.js?v=fe1aadeb82b2d227211afe295f4325f4aa5c76dc5fc4886b79c607292047e53d";
import * as THREE from "./assets/vendor/three.module.js?v=ce1fa418de16a19495a9f72495580e3015d7745c296d3ce0485897f902ddedfb";

const drawFrames = mobileFrames("#experience .chapter", ["h1", ".passage-title", "h2", "h2"]);

mobileFallback(".fallback-disc");

const $ = (s) => document.querySelector(s),
  clamp = THREE.MathUtils.clamp,
  mix = THREE.MathUtils.lerp;
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let frequency = 80,
  character = "pure",
  animate = false,
  toneActive = false,
  toneStarting = false,
  audioGeneration = 0,
  experienceVisible = true,
  target = 0,
  progress = 0,
  phase = 0,
  invalidate = () => {},
  audioContext,
  oscillator,
  gain;
const characters = {
  pure: { label: "Pure", value: 0, type: "sine" },
  overtone: { label: "Overtone", value: 1, type: "triangle" },
  pulse: { label: "Pulse", value: 2, type: "sine" },
};
const dialog = $("#notes");
function notes() {
  $("#spec-frequency").textContent = `${frequency} Hz`;
  $("#spec-character").textContent = characters[character].label;
  dialog.showModal();
}
for (const id of ["#open-spec", "#save-open", "#closing-spec"])
  $(id).addEventListener("click", notes);
$("#close-notes").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
$("#download").addEventListener("click", () => {
  const content = `OBSCURA O / 01\nAcoustic object study\n\nFrequency: ${frequency} Hz\nCharacter: ${characters[character].label}\nAssembly: formed membrane, rigid basket, magnet\nMaterial direction: graphite, aluminium, copper\n\nAn independently authored visual and tonal concept.\nThis is not an acoustic measurement, certified loudspeaker design or product order.\nIndependent concept by BlackStack Studio, 2026.\n`;
  const link = document.createElement("a"),
    url = URL.createObjectURL(
      new Blob([content], { type: "text/plain;charset=utf-8" }),
    );
  link.href = url;
  link.download = `obscura-${frequency}hz-study.txt`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $("#download-status").textContent = "Your frequency study has been saved.";
});
function audioLabel() {
  $("#tone").setAttribute("aria-pressed", String(toneActive || toneStarting));
  $("#tone").innerHTML =
    `<span aria-hidden="true">◉</span> Tone ${toneStarting ? "starting" : toneActive ? "on" : "off"}`;
}
function stopTone() {
  audioGeneration++;
  toneStarting = false;
  if (oscillator) {
    try {
      oscillator.stop();
    } catch {}
    oscillator.disconnect();
    oscillator = null;
  }
  if (gain) {
    gain.disconnect();
    gain = null;
  }
  toneActive = false;
  audioContext?.suspend().catch(() => {});
  audioLabel();
}
$("#tone").addEventListener("click", async () => {
  if (toneActive || toneStarting) {
    stopTone();
    invalidate();
    return;
  }
  if (document.hidden || !experienceVisible) return;
  const generation = ++audioGeneration;
  toneStarting = true;
  audioLabel();
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) throw Error("Audio is unavailable");
    audioContext ??= new Audio();
    await audioContext.resume();
    if (generation !== audioGeneration) return;
    if (document.hidden || !experienceVisible) {
      stopTone();
      return;
    }
    oscillator = audioContext.createOscillator();
    gain = audioContext.createGain();
    oscillator.type = characters[character].type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.025, audioContext.currentTime + 0.15);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    toneStarting = false;
    toneActive = true;
    audioLabel();
    $("#sound-note").textContent =
      "A quiet synthetic tone. Turn it off at any time.";
    invalidate();
  } catch {
    if (generation !== audioGeneration) return;
    $("#sound-note").textContent =
      "Audio is unavailable. The visual study remains interactive.";
    stopTone();
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopTone();
});
addEventListener("pagehide", stopTone);
$("#animate").addEventListener("click", () => {
  animate = !animate;
  $("#animate").setAttribute("aria-pressed", String(animate));
  $("#animate").innerHTML =
    `<span aria-hidden="true">${animate ? "Ⅱ" : "▷"}</span> ${animate ? "Pause the wave" : "Move the wave"}`;
  invalidate();
});
$("#frequency").addEventListener("input", (e) => {
  frequency = Number(e.target.value);
  $("#frequency-value").innerHTML = `${frequency} <small>HZ</small>`;
  oscillator?.frequency.setTargetAtTime(
    frequency,
    audioContext.currentTime,
    0.06,
  );
  invalidate();
});
document.querySelectorAll("[data-character]").forEach((button) =>
  button.addEventListener("click", () => {
    character = button.dataset.character;
    document
      .querySelectorAll("[data-character]")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    if (oscillator) oscillator.type = characters[character].type;
    invalidate();
  }),
);
const chapters = [...document.querySelectorAll("#experience .chapter")],
  nav = [...document.querySelectorAll(".chapter-nav a")];
function measure() {
  let i = 0;
  while (i < 3 && scrollY >= chapters[i + 1].offsetTop) i++;
  const start = chapters[i].offsetTop,
    end = chapters[i + 1]?.offsetTop ?? start + chapters[i].offsetHeight;
  target = i + clamp((scrollY - start) / (end - start), 0, 1);
  const current = Math.min(3, Math.round(target));
  nav.forEach((a, j) => {
    if (j === current) a.setAttribute("aria-current", "step");
    else a.removeAttribute("aria-current");
  });
}
addEventListener(
  "scroll",
  () => {
    measure();
    invalidate();
  },
  { passive: true },
);
measure();
let renderer,
  frames = 0;
try {
  const mobileAtStart = phone.matches;
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  let quality = Math.min(devicePixelRatio, mobileAtStart ? 1 : 1.4);
  renderer.setPixelRatio(quality);
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  $("#stage").append(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#161718");
  scene.fog = new THREE.Fog("#161718", 12, 35);
  const camera = new THREE.PerspectiveCamera(
    36,
    innerWidth / innerHeight,
    0.05,
    80,
  );
  scene.add(new THREE.HemisphereLight("#dce1df", "#252221", 2));
  const key = new THREE.DirectionalLight("#fff1d4", 3.2);
  key.position.set(-5, 5, 6);
  scene.add(key);
  const edge = new THREE.DirectionalLight("#b7c9da", 2.5);
  edge.position.set(5, 0, -4);
  scene.add(edge);
  const envCanvas = document.createElement("canvas");
  envCanvas.width = 512;
  envCanvas.height = 256;
  const ec = envCanvas.getContext("2d");
  ec.fillStyle = "#242728";
  ec.fillRect(0, 0, 512, 256);
  const grad = ec.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, "#171b1e");
  grad.addColorStop(0.25, "#b4b7b0");
  grad.addColorStop(0.3, "#323838");
  grad.addColorStop(0.65, "#090b0c");
  grad.addColorStop(0.75, "#b9ad99");
  grad.addColorStop(1, "#171b1e");
  ec.fillStyle = grad;
  ec.fillRect(0, 0, 512, 256);
  ec.fillStyle = "#e9e8d9";
  ec.fillRect(80, 0, 6, 256);
  ec.fillRect(360, 10, 14, 150);
  const et = new THREE.CanvasTexture(envCanvas);
  et.mapping = THREE.EquirectangularReflectionMapping;
  et.colorSpace = THREE.SRGBColorSpace;
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromEquirectangular(et).texture;
  et.dispose();
  pm.dispose();
  const rows = mobileAtStart ? 48 : 72,
    columns = mobileAtStart ? 128 : 192,
    positions = [],
    radii = [],
    indices = [];
  for (let r = 0; r <= rows; r++)
    for (let j = 0; j <= columns; j++) {
      const radius = 0.025 + (r / rows) * 2.72,
        angle = (j / columns) * Math.PI * 2;
      positions.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      radii.push(radius);
    }
  for (let r = 0; r < rows; r++)
    for (let j = 0; j < columns; j++) {
      const a = r * (columns + 1) + j,
        b = a + columns + 1;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  const membraneGeometry = new THREE.BufferGeometry();
  membraneGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  membraneGeometry.setAttribute(
    "aRadius",
    new THREE.Float32BufferAttribute(radii, 1),
  );
  membraneGeometry.setIndex(indices);
  const uniforms = {
    uTime: { value: 0 },
    uFrequency: { value: 80 / 18 },
    uCharacter: { value: 0 },
    uOpen: { value: 0 },
    uShape: { value: 0 },
    uPointer: { value: new THREE.Vector2() },
    uFade: { value: 1 },
  };
  const membraneMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms,
    vertexShader: `
    attribute float aRadius; uniform float uTime; uniform float uFrequency; uniform float uCharacter; uniform float uOpen; uniform float uShape; uniform vec2 uPointer;
    varying vec3 vWorld; varying float vRadius; varying float vWave;
    void main(){float r=aRadius;float theta=atan(position.y,position.x);float wave=sin(r*uFrequency*2.0-uTime+cos(theta*2.0)*.26);wave+=uCharacter*.15*sin(r*uFrequency*4.0+uTime*.7+theta*3.0);float pulse=sin(r*3.0-uTime*.5);wave=mix(wave,wave*pulse,step(1.5,uCharacter)*.6);float radius=mix(r,1.82+r*.34,uOpen);float cone=-.95+pow(r/2.745,1.5)*1.05;float z=mix(wave*(.32+.1*cos(theta*4.0)),cone+wave*.028,uShape);z+=dot(vec2(cos(theta),sin(theta)),uPointer)*.07;vec3 p=vec3(cos(theta)*radius,sin(theta)*radius,z);vec4 world=modelMatrix*vec4(p,1.0);vWorld=world.xyz;vRadius=r;vWave=wave;gl_Position=projectionMatrix*viewMatrix*world;}
  `,
    fragmentShader: `
    precision highp float; varying vec3 vWorld;varying float vRadius;varying float vWave;uniform float uFade;
    void main(){vec3 N=normalize(cross(dFdx(vWorld),dFdy(vWorld)));vec3 V=normalize(cameraPosition-vWorld);if(dot(N,V)<0.0)N=-N;vec3 L=normalize(vec3(-4.0,5.0,6.0)-vWorld);vec3 R=reflect(-V,N);float light=max(dot(N,L),0.0);float fres=pow(1.0-max(dot(N,V),0.0),3.0);float strip=pow(max(dot(R,normalize(vec3(-.7,1.0,1.5))),0.0),20.0);float warm=pow(max(dot(R,normalize(vec3(1.0,-.35,1.2))),0.0),32.0);float etched=pow(.5+.5*cos(vRadius*118.0),16.0)*.06;vec3 colour=vec3(.065,.072,.075)+vec3(.12,.135,.14)*light;colour+=vec3(.9,.94,.89)*strip*.8;colour+=vec3(.64,.30,.15)*warm*.7;colour+=vec3(.2,.24,.25)*fres;colour-=etched;colour+=vec3(.025)*vWave;gl_FragColor=vec4(max(colour,vec3(.018))*uFade,1.0);}
  `,
  });
  const assembly = new THREE.Group();
  scene.add(assembly);
  const membrane = new THREE.Mesh(membraneGeometry, membraneMaterial);
  assembly.add(membrane);
  const tunnelMaterial = new THREE.MeshBasicMaterial({
    color: "#8f9b9b",
    transparent: true,
    opacity: 0.38,
    depthWrite: false,
  });
  const rings = new THREE.InstancedMesh(
    new THREE.TorusGeometry(2.13, 0.008, 5, 144),
    tunnelMaterial,
    18,
  );
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 18; i++) {
    dummy.position.set(
      Math.sin(i * 0.5) * 0.16,
      Math.cos(i * 0.4) * 0.1,
      -1.2 - i * 0.88,
    );
    dummy.rotation.set(
      Math.sin(i * 0.33) * 0.045,
      Math.cos(i * 0.3) * 0.045,
      i * 0.035,
    );
    dummy.scale.setScalar(1 + Math.sin(i * 0.45) * 0.035);
    dummy.updateMatrix();
    rings.setMatrixAt(i, dummy.matrix);
  }
  scene.add(rings);
  const rimGroup = new THREE.Group(),
    basketGroup = new THREE.Group(),
    magnetGroup = new THREE.Group();
  assembly.add(rimGroup, basketGroup, magnetGroup);
  const graphite = new THREE.MeshStandardMaterial({
      color: "#242829",
      metalness: 0.72,
      roughness: 0.34,
    }),
    aluminium = new THREE.MeshStandardMaterial({
      color: "#969d99",
      metalness: 0.95,
      roughness: 0.24,
    }),
    rubber = new THREE.MeshStandardMaterial({
      color: "#191d1e",
      roughness: 0.86,
    }),
    copper = new THREE.MeshStandardMaterial({
      color: "#946247",
      metalness: 0.8,
      roughness: 0.33,
    });
  function torus(radius, tube, material, z, group) {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, 10, 144),
      material,
    );
    mesh.position.z = z;
    group.add(mesh);
    return mesh;
  }
  torus(2.69, 0.065, aluminium, 0.02, rimGroup);
  torus(2.5, 0.15, rubber, -0.02, rimGroup);
  torus(2.76, 0.026, graphite, -0.11, rimGroup);
  const basket = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.16, 0.12, 1),
    graphite,
    12,
  );
  const av = new THREE.Vector3(),
    bv = new THREE.Vector3(),
    axis = new THREE.Vector3(0, 0, 1);
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2;
    av.set(Math.cos(t) * 2.5, Math.sin(t) * 2.5, -0.2);
    bv.set(Math.cos(t) * 1.07, Math.sin(t) * 1.07, -1.88);
    dummy.position.copy(av).add(bv).multiplyScalar(0.5);
    dummy.quaternion.setFromUnitVectors(axis, bv.clone().sub(av).normalize());
    dummy.scale.set(1, 1, av.distanceTo(bv));
    dummy.updateMatrix();
    basket.setMatrixAt(i, dummy.matrix);
  }
  basketGroup.add(basket);
  torus(1.08, 0.09, graphite, -1.88, basketGroup);
  const screws = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.033, 0.033, 0.035, 10),
    aluminium,
    8,
  );
  for (let i = 0; i < 8; i++) {
    const t = (i / 8) * Math.PI * 2;
    dummy.position.set(Math.cos(t) * 2.68, Math.sin(t) * 2.68, 0.08);
    dummy.rotation.set(Math.PI / 2, 0, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    screws.setMatrixAt(i, dummy.matrix);
  }
  rimGroup.add(screws);
  function cylinder(radius, height, material, z) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, height, 64),
      material,
    );
    mesh.rotation.x = Math.PI / 2;
    mesh.position.z = z;
    magnetGroup.add(mesh);
    return mesh;
  }
  cylinder(1.05, 0.6, graphite, -2.08);
  cylinder(1.15, 0.13, aluminium, -2.4);
  cylinder(0.55, 0.9, copper, -1.5);
  torus(0.55, 0.035, copper, -1.1, magnetGroup);
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.57, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    graphite,
  );
  cap.rotation.x = Math.PI / 2;
  cap.position.z = -0.77;
  assembly.add(cap);
  let raf = 0,
    visible = true,
    previous = 0,
    lastRender = 0,
    slow = 0;
  const diagnostics = (mode) => {
    const d = document.documentElement.dataset;
    d.renderFrames = String(frames);
    d.drawCalls = String(renderer.info.render.calls);
    d.triangles = String(renderer.info.render.triangles);
    d.renderDpr = String(renderer.getPixelRatio());
    d.renderMode = mode;
  };
  const poses = [
    { c: [0, 0.3, 10.4], l: [0, 0.1, 0] },
    { c: [0, 0, -1.4], l: [0, 0, -10] },
    { c: [5, 2.2, 9.1], l: [0, 0, -0.6] },
    { c: [6.5, 2.3, 10.4], l: [0, 0, -0.8] },
  ];
  function render(now) {
    raf = 0;
    if (document.hidden || !visible) {
      diagnostics(document.hidden ? "hidden" : "offscreen");
      return;
    }
    const live = (animate || toneActive) && !reduced.matches;
    if (live && now - lastRender < 32) {
      raf = requestAnimationFrame(render);
      return;
    }
    const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 1 / 60;
    previous = now;
    lastRender = now;
    progress = reduced.matches || phone.matches
      ? target
      : mix(progress, target, 1 - Math.exp(-9 * dt));
    if (live) phase += dt * 1.25;
    const p = reduced.matches
        ? Math.round(clamp(progress, 0, 3))
        : clamp(progress, 0, 3),
      i = Math.min(2, Math.floor(p)),
      t = smooth(0, 1, p - i),
      a = poses[i],
      b = poses[i + 1],
      mobile = phone.matches;
    const opening = smooth(0.2, 0.86, p) * (1 - smooth(1.12, 1.85, p)),
      shape = smooth(1.25, 1.95, p),
      explode = smooth(2.25, 2.95, p);
    uniforms.uTime.value = phase + p * 5.2;
    uniforms.uFrequency.value = frequency / 18;
    uniforms.uCharacter.value = characters[character].value;
    uniforms.uOpen.value = opening;
    uniforms.uShape.value = shape;
    membrane.position.z = explode * 1.2;
    rimGroup.position.z = explode * 0.2;
    basketGroup.position.z = -explode * 0.35;
    magnetGroup.position.z = -explode * 1.2;
    cap.position.z = -0.77 + explode * 1.2;
    const reveal = smooth(1.3, 1.9, p);
    cap.visible = shape > 0.65;
    rimGroup.visible =
      basketGroup.visible =
      magnetGroup.visible =
        reveal > 0.001;
    for (const material of [graphite, aluminium, rubber, copper]) {
      material.transparent = reveal < 0.999;
      material.opacity = reveal;
      material.depthWrite = reveal > 0.99;
    }
    rings.visible = shape < 0.98;
    tunnelMaterial.opacity = (0.15 + opening * 0.33) * (1 - shape);
    let x = mix(a.c[0], b.c[0], t),
      y = mix(a.c[1], b.c[1], t),
      z = mix(a.c[2], b.c[2], t);
    if (mobile && p < 0.7) z *= 0.96;
    if (mobile && p > 1.5) {
      x *= 1.15;
      z *= 1.15;
    }
    camera.position.set(x, y + (mobile && p < 0.6 ? 0.9 : 0), z);
    camera.lookAt(
      mix(a.l[0], b.l[0], t),
      mix(a.l[1], b.l[1], t) + (mobile && p < 0.6 ? 0.8 : 0),
      mix(a.l[2], b.l[2], t),
    );
    assembly.rotation.z = mix(-0.08, 0.04, shape);
    const hero = $(".hero h1");
    hero.style.opacity = mobile ? "1" : String(1 - smooth(0.04, 0.65, p));
    hero.style.transform = mobile ? "none" : `translate3d(0,${-p * 80}px,0)`;
    const start = performance.now();
    const visibleFrames = drawFrames(renderer, scene, camera);
    frames++;
    if (performance.now() - start > 23) slow++;
    else slow = Math.max(0, slow - 1);
    if (slow > 10 && quality > 0.8) {
      quality = Math.max(0.8, quality - 0.15);
      renderer.setPixelRatio(quality);
      slow = 0;
    }
    const moving = Math.abs(progress - target) > 0.0003;
    diagnostics(live || moving ? "active" : "idle");
    if ((live && (!phone.matches || visibleFrames > 0)) || moving) raf = requestAnimationFrame(render);
  }
  invalidate = () => {
    if (!raf && !document.hidden && visible) {
      previous = 0;
      raf = requestAnimationFrame(render);
    }
  };
  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    quality = Math.min(devicePixelRatio, phone.matches ? 1 : 1.4);
    renderer.setPixelRatio(quality);
    renderer.setSize(innerWidth, innerHeight, false);
    measure();
    invalidate();
  });
  addEventListener(
    "pointermove",
    (event) => {
      if (reduced.matches) return;
      uniforms.uPointer.value.set(
        (event.clientX / innerWidth - 0.5) * 2,
        (0.5 - event.clientY / innerHeight) * 2,
      );
      invalidate();
    },
    { passive: true },
  );
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    experienceVisible = visible;
    document.body.classList.toggle("past-story", !visible);
    $("#animate").disabled = !visible;
    $("#tone").disabled = !visible;
    if (!visible) {
      cancelAnimationFrame(raf);
      raf = 0;
      stopTone();
      diagnostics("offscreen");
    } else invalidate();
  }).observe($("#experience"));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
      diagnostics("hidden");
    } else invalidate();
  });
  reduced.addEventListener("change", invalidate);
  renderer.domElement.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    cancelAnimationFrame(raf);
    raf = 0;
    visible = false;
    experienceVisible = false;
    stopTone();
    document.body.classList.add("no-webgl");
    diagnostics("offscreen");
  });
  invalidate();
  $("#loader").classList.add("done");
} catch (error) {
  document.body.classList.add("no-webgl");
  $("#loader").classList.add("done");
  $("#animate").disabled = true;
  document.documentElement.dataset.renderMode = "idle";
  console.warn("Static acoustic view enabled.", error.message);
}

const phoneControls = document.querySelector(".controls"),
  controlsParent = phoneControls.parentNode, controlsNext = phoneControls.nextSibling;
function placePhoneControls() {
  if (phone.matches) document.querySelector(".hero .mobile-scene-slot").after(phoneControls);
  else controlsParent.insertBefore(phoneControls, controlsNext);
  dispatchEvent(new Event("resize"));
}
phone.addEventListener("change", placePhoneControls);
placePhoneControls();

document.fonts.ready.then(() => {
  measure();
  invalidate();
});
