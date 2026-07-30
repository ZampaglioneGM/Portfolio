/* ============================================================
   ANIMUS neural portfolio — rendering + interaction
   Pure vanilla JS. Builds an SVG graph from data.js, animates
   synaptic pulses, and reveals memory nodes on selection.
   ============================================================ */

const SVG_NS = "http://www.w3.org/2000/svg";

// tiny helper: create an SVG element with attributes
function svg(tag, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

// flat-top hexagon points around (cx, cy) with radius r
function hexPoints(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

// upward equilateral triangle centered on (cx, cy)
function triPoints(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 3; i++) {
    const a = (Math.PI / 180) * (120 * i - 90);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

const graph = document.getElementById("graph");
const panel = document.getElementById("panel");
const nodeById = Object.fromEntries(PORTFOLIO.nodes.map((n) => [n.id, n]));

// map each node id -> edge indices it touches (for highlighting)
const edgeIndexByNode = {};
PORTFOLIO.edges.forEach(([a, b], i) => {
  (edgeIndexByNode[a] ||= []).push(i);
  (edgeIndexByNode[b] ||= []).push(i);
});

// ---- Layers -------------------------------------------------
const floaterLayer = svg("g", { class: "floater-layer" });
const edgeLayer = svg("g", { class: "edge-layer" });
const pulseLayer = svg("g", { class: "pulse-layer" });
const nodeLayer = svg("g", { class: "node-layer" });
graph.append(floaterLayer, edgeLayer, pulseLayer, nodeLayer);

// ---- Edges --------------------------------------------------
const edgeEls = [];
const edgeGeom = [];
PORTFOLIO.edges.forEach(([aId, bId]) => {
  const a = nodeById[aId];
  const b = nodeById[bId];
  const line = svg("line", {
    class: "edge",
    x1: a.x,
    y1: a.y,
    x2: b.x,
    y2: b.y,
  });
  edgeLayer.appendChild(line);
  edgeEls.push(line);
  edgeGeom.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
});

// ---- Synaptic pulses ---------------------------------------
// Each edge carries a couple of glowing dots that flow end-to-end.
const pulses = [];
edgeGeom.forEach((_, edgeIndex) => {
  const count = 1 + (edgeIndex % 2); // 1 or 2 pulses per edge
  for (let p = 0; p < count; p++) {
    const dot = svg("circle", { class: "pulse", r: 2.4 });
    pulseLayer.appendChild(dot);
    pulses.push({
      el: dot,
      edgeIndex,
      t: Math.random(),
      speed: 0.0016 + Math.random() * 0.0022,
    });
  }
});

// ---- Nodes --------------------------------------------------
PORTFOLIO.nodes.forEach((n, i) => {
  const isCore = n.type === "core";
  const r = isCore ? 52 : 40;

  const g = svg("g", {
    class: `node${isCore ? " core" : ""}`,
    "data-id": n.id,
    tabindex: "0",
    role: "button",
    "aria-label": `${n.role} at ${n.company}`,
  });

  // selection glow ring (hidden until selected)
  g.appendChild(svg("polygon", { class: "glow", points: hexPoints(n.x, n.y, r + 8) }));
  // outer decorative hex
  g.appendChild(svg("polygon", { class: "hex-outer", points: hexPoints(n.x, n.y, r + 7) }));
  // main hex
  g.appendChild(svg("polygon", { class: "hex", points: hexPoints(n.x, n.y, r) }));
  // inner triangle motif
  g.appendChild(svg("polygon", { class: "tri", points: triPoints(n.x, n.y, r * 0.42) }));

  // labels under the node — core gets a third line (name / role / dates)
  const label = svg("text", { class: "label", x: n.x, y: n.y + r + 24 });
  label.textContent = (n.nodeLabel || n.company).toUpperCase();
  g.appendChild(label);

  if (isCore) {
    const role = svg("text", { class: "sublabel", x: n.x, y: n.y + r + 42 });
    role.textContent = n.role;
    const period = svg("text", { class: "sublabel", x: n.x, y: n.y + r + 58 });
    period.textContent = n.period;
    g.append(role, period);
  } else {
    const sub = svg("text", { class: "sublabel", x: n.x, y: n.y + r + 42 });
    sub.textContent = n.period;
    g.appendChild(sub);
  }

  nodeLayer.appendChild(g);

  // staggered reveal — the "boot / sync" sequence
  setTimeout(() => g.classList.add("is-revealed"), 300 + i * 140);

  g.addEventListener("mouseenter", () => {
    highlight(n.id);
    updateHud(n.id);
  });
  g.addEventListener("mouseleave", () => {
    if (!graph.classList.contains("has-selection")) clearHighlight();
    updateHud(null);
  });
  g.addEventListener("click", () => selectNode(n.id));
  g.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectNode(n.id);
    }
  });
});

// ---- Floating triangles (ambient) --------------------------
const floaters = [];
for (let i = 0; i < 14; i++) {
  const size = 8 + Math.random() * 26;
  const tri = svg("polygon", { class: "floater" });
  floaterLayer.appendChild(tri);
  floaters.push({
    el: tri,
    x: Math.random() * 1400,
    y: Math.random() * 900,
    size,
    rot: Math.random() * 360,
    drift: 0.05 + Math.random() * 0.12,
    spin: (Math.random() - 0.5) * 0.15,
  });
}

// ---- Highlight / selection ---------------------------------
let selectedId = null;

function setEdgesActive(nodeId, active) {
  (edgeIndexByNode[nodeId] || []).forEach((idx) => {
    edgeEls[idx].classList.toggle("is-active", active);
  });
}

function highlight(nodeId) {
  if (selectedId) return; // don't fight an active selection
  edgeEls.forEach((e) => e.classList.remove("is-active"));
  setEdgesActive(nodeId, true);
}

function clearHighlight() {
  edgeEls.forEach((e) => e.classList.remove("is-active"));
}

function selectNode(nodeId) {
  selectedId = nodeId;
  graph.classList.add("has-selection");
  document.querySelectorAll(".node").forEach((el) => {
    el.classList.toggle("is-selected", el.dataset.id === nodeId);
  });
  edgeEls.forEach((e) => e.classList.remove("is-active"));
  setEdgesActive(nodeId, true);
  openPanel(nodeById[nodeId]);
}

function deselect() {
  selectedId = null;
  graph.classList.remove("has-selection");
  document.querySelectorAll(".node").forEach((el) => el.classList.remove("is-selected"));
  clearHighlight();
  closePanel();
}

// ---- HUD readout -------------------------------------------
const metaSubject = document.getElementById("metaSubject");
const metaNode = document.getElementById("metaNode");
metaSubject.textContent = PORTFOLIO.profile.subject;

function updateHud(nodeId) {
  metaNode.textContent = nodeId
    ? nodeById[nodeId].company.toUpperCase()
    : "STANDBY";
}

// ---- Panel --------------------------------------------------
const els = {
  period: document.getElementById("panelPeriod"),
  role: document.getElementById("panelRole"),
  company: document.getElementById("panelCompany"),
  location: document.getElementById("panelLocation"),
  summary: document.getElementById("panelSummary"),
  tags: document.getElementById("panelTags"),
};

function openPanel(n) {
  const isCore = n.type === "core";
  // core card reads Name -> Role -> Period; job cards read Period -> Role -> Company
  els.role.textContent = isCore ? n.company : n.role;
  els.company.textContent = isCore ? n.role : n.company;
  els.period.textContent = n.period;
  els.location.textContent = `◍ ${n.location}`;
  els.summary.textContent = n.summary;
  els.tags.innerHTML = "";
  n.tags.forEach((t) => {
    const s = document.createElement("span");
    s.textContent = t;
    els.tags.appendChild(s);
  });
  panel.classList.toggle("is-core", isCore);
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
}

function closePanel() {
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
}

document.getElementById("panelClose").addEventListener("click", deselect);
// click on empty canvas closes the selection
graph.addEventListener("click", (e) => {
  if (e.target === graph) deselect();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") deselect();
});

// ---- Parallax (mouse-driven 2.5D tilt) ----------------------
// One rigid tilt on the whole graph, like a picture hinged in space —
// not separate layers sliding at different rates. Exponential damping
// (lerp toward the target by a fixed fraction each frame) is what makes
// it decelerate naturally into place instead of snapping or overshooting.
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
let targetParX = 0;
let targetParY = 0;
let parX = 0;
let parY = 0;

if (!prefersReducedMotion) {
  window.addEventListener("mousemove", (e) => {
    targetParX = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
    targetParY = (e.clientY / window.innerHeight) * 2 - 1;
  });
  window.addEventListener("mouseleave", () => {
    targetParX = 0;
    targetParY = 0;
  });
}

// ---- Animation loop ----------------------------------------
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function frame() {
  // parallax — horizontal tilt dominant, vertical tilt subtle, plus a
  // touch of drift, all as one rigid transform on the graph
  if (!prefersReducedMotion) {
    parX = lerp(parX, targetParX, 0.05);
    parY = lerp(parY, targetParY, 0.05);
    const rotateY = parX * -9;
    const rotateX = parY * 3.5;
    const shiftX = parX * 14;
    graph.style.transform = `perspective(1400px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateX(${shiftX.toFixed(1)}px)`;
  }

  // synaptic pulses
  for (const pu of pulses) {
    pu.t += pu.speed;
    if (pu.t > 1) pu.t -= 1;
    const g = edgeGeom[pu.edgeIndex];
    pu.el.setAttribute("cx", lerp(g.x1, g.x2, pu.t).toFixed(1));
    pu.el.setAttribute("cy", lerp(g.y1, g.y2, pu.t).toFixed(1));
    const active = edgeEls[pu.edgeIndex].classList.contains("is-active");
    pu.el.setAttribute("r", active ? 3.6 : 2.2);
    pu.el.setAttribute("opacity", active ? 1 : 0.5);
  }

  // ambient triangles
  for (const f of floaters) {
    f.y -= f.drift;
    f.rot += f.spin;
    if (f.y < -40) {
      f.y = 940;
      f.x = Math.random() * 1400;
    }
    f.el.setAttribute("points", triPoints(0, 0, f.size));
    f.el.setAttribute(
      "transform",
      `translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.rot.toFixed(1)})`
    );
  }

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ---- Theme toggle (White <-> Black) -------------------------
const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");
const themeIcon = document.getElementById("themeIcon");

function readStoredTheme() {
  try {
    const stored = localStorage.getItem("reflex-theme");
    // migrate legacy theme names from the old Animus/Fallout toggle
    if (stored === "fallout") return "black";
    if (stored === "animus") return "white";
    return stored;
  } catch {
    return null; // localStorage can be blocked; fall back to default
  }
}

function applyTheme(name) {
  document.body.classList.toggle("theme-black", name === "black");
  themeLabel.textContent = name.toUpperCase();
  themeIcon.textContent = name === "black" ? "☾" : "☀";
  themeToggle.setAttribute("aria-pressed", name === "black" ? "true" : "false");
  try {
    localStorage.setItem("reflex-theme", name);
  } catch {
    /* ignore write failures */
  }
}

let theme = readStoredTheme() || "black";
applyTheme(theme);

themeToggle.addEventListener("click", () => {
  theme = theme === "white" ? "black" : "white";
  applyTheme(theme);
});
