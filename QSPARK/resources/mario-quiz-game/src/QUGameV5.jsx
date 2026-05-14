import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";

export default function QUGameV5() {
  const mountRef = useRef(null);
  const joystickRef = useRef(null);
  const lookAreaRef = useRef(null);
  const gameStateRef = useRef({
    scene: null, camera: null, renderer: null,
    player: { x: 0, y: 1.7, z: 18, yaw: 0, pitch: 0 },
    keys: {}, enemies: [], questionStations: [],
    activeStation: null, locked: false, stair: null,
    joy: { x: 0, y: 0 }, // -1..1 normalized vector (mobile joystick)
    look: { up: false, down: false, left: false, right: false }, // on-screen look pad
  });

  const [isMobile, setIsMobile] = useState(false);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState(null);
  const [enemyAlert, setEnemyAlert] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const questionsAnsweredRef = useRef(0);
  useEffect(() => { questionsAnsweredRef.current = questionsAnswered; }, [questionsAnswered]);
  const ROOMS_UNLOCK_AT = 3;

  // Detect mobile/touch device
  useEffect(() => {
    const check = () => {
      const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const small = window.innerWidth < 900;
      setIsMobile(touch || small);
    };
    check();
    window.addEventListener("resize", check);

    // Inject viewport meta for proper mobile rendering
    let viewport = document.querySelector('meta[name="viewport"]');
    let createdViewport = false;
    if (!viewport) {
      viewport = document.createElement("meta");
      viewport.setAttribute("name", "viewport");
      document.head.appendChild(viewport);
      createdViewport = true;
    }
    const oldContent = viewport.getAttribute("content");
    viewport.setAttribute(
      "content",
      "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
    );

    return () => {
      window.removeEventListener("resize", check);
      if (createdViewport) viewport.remove();
      else if (oldContent) viewport.setAttribute("content", oldContent);
    };
  }, []);

  // Questions come from Laravel via window.GAME_DATA; fallback keeps Vite preview usable.
  const FALLBACK_QUESTIONS = [
    { q: "ما هي عاصمة المملكة العربية السعودية؟", options: ["جدة", "الرياض", "بريدة", "الدمام"], correct: 1, difficulty: "easy" },
    { q: "في أي مدينة تقع جامعة القصيم؟", options: ["الرياض", "بريدة", "عنيزة", "حائل"], correct: 1, difficulty: "easy" },
    { q: "كم عدد أركان الإسلام؟", options: ["3", "4", "5", "6"], correct: 2, difficulty: "easy" },
    { q: "ما هي اللغة الرسمية للمملكة؟", options: ["English", "العربية", "Urdu", "French"], correct: 1, difficulty: "easy" },
    { q: "في أي عام تأسست جامعة القصيم؟", options: ["1990", "2000", "2004", "2010"], correct: 2, difficulty: "medium" },
    { q: "ما هو شعار رؤية المملكة؟", options: ["2020", "2025", "2030", "2040"], correct: 2, difficulty: "medium" },
    { q: "كم عدد الكليات في جامعة القصيم تقريباً؟", options: ["10", "20", "30", "40+"], correct: 3, difficulty: "medium" },
    { q: "ما هي عملة المملكة العربية السعودية؟", options: ["دينار", "ريال", "درهم", "دولار"], correct: 1, difficulty: "medium" },
    { q: "ما هو أكبر صحراء في المملكة؟", options: ["النفود", "الربع الخالي", "الدهناء", "الصحراء الكبرى"], correct: 1, difficulty: "hard" },
    { q: "كم عدد الصلوات المفروضة في اليوم؟", options: ["3", "4", "5", "6"], correct: 2, difficulty: "hard" },
  ];

  // Normalize incoming questions to v5's shape: { q, options, correct, difficulty, id }.
  // Accepts either { question, options, correctIndex } (Laravel QuizQuestion) or { q, options, correct } (legacy).
  const normalize = (raw) => ({
    id: raw.id ?? null,
    q: raw.q ?? raw.question ?? "",
    qEn: raw.qEn ?? raw.question_en ?? "",
    options: raw.options ?? [],
    correct: raw.correct ?? raw.correctIndex ?? 0,
    difficulty: raw.difficulty ?? "medium",
  });

  // Split incoming questions into three live buckets the adaptive engine pulls from.
  // Untagged questions fall into `medium` so the engine can still step around them.
  const buildPools = (groupedOrFlat) => {
    let easy = [], medium = [], hard = [];
    if (groupedOrFlat && !Array.isArray(groupedOrFlat) && (groupedOrFlat.easy || groupedOrFlat.medium || groupedOrFlat.hard)) {
      easy = (groupedOrFlat.easy || []).map(normalize);
      medium = (groupedOrFlat.medium || []).map(normalize);
      hard = (groupedOrFlat.hard || []).map(normalize);
    } else {
      const flat = (groupedOrFlat || []).map(normalize);
      easy = flat.filter((q) => q.difficulty === "easy");
      medium = flat.filter((q) => q.difficulty === "medium");
      hard = flat.filter((q) => q.difficulty === "hard");
      if (easy.length === 0 && medium.length === 0 && hard.length === 0) medium = flat;
    }
    return { easy, medium, hard };
  };

  const GAME_DATA = (typeof window !== "undefined" && window.GAME_DATA) || {};
  const initialPools = (() => {
    const p = buildPools(GAME_DATA.groupedQuestions || GAME_DATA.questions);
    const total = p.easy.length + p.medium.length + p.hard.length;
    return total >= 10 ? p : buildPools(FALLBACK_QUESTIONS);
  })();
  const courseCode = GAME_DATA.courseCode || "TEST";
  const courseId = GAME_DATA.courseId || null;
  const attachmentKey = GAME_DATA.attachmentKey || null;
  const csrfToken = GAME_DATA.csrfToken || "";

  // Per-question timing for analytics.
  const questionTimingRef = useRef({ startedAt: 0, perQuestion: [], difficultyChanges: [] });
  const sessionIdRef = useRef(`game_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`);

  // Adaptive engine state. Pools mutate (shift) as questions are consumed; difficulty
  // is updated after each answer using time_taken + correctness + lives_after.
  const poolsRef = useRef({ easy: [], medium: [], hard: [] });
  const currentDifficultyRef = useRef("easy");

  const ADAPT_STEP_UP = { easy: "medium", medium: "hard", hard: "hard" };
  const ADAPT_STEP_DOWN = { hard: "medium", medium: "easy", easy: "easy" };

  // Decide the next difficulty from the just-answered outcome.
  // Rules: timeout/wrong → step down; correct + fast (<10s) + ≥2 lives → step up;
  // last life caps progression (never push to harder when lives ≤ 1).
  const pickNextDifficulty = (prev, { correct, time_taken, timed_out, lives_after }) => {
    if (timed_out || !correct) return ADAPT_STEP_DOWN[prev];
    if (lives_after <= 1) return prev;
    if (time_taken < 10) return ADAPT_STEP_UP[prev];
    return prev; // correct but slow → hold
  };

  // Pull a question from the requested bucket; fall back to neighbours so the run
  // can always present a question even when one bucket is empty.
  const pickQuestionFor = (diff) => {
    const order = diff === "hard"
      ? ["hard", "medium", "easy"]
      : diff === "easy"
        ? ["easy", "medium", "hard"]
        : ["medium", "easy", "hard"];
    for (const d of order) {
      const bucket = poolsRef.current[d];
      if (bucket && bucket.length > 0) return bucket.shift();
    }
    return null;
  };

  // Room metadata — each room has a name and assigned question index
  const roomData = [
    { name: "قاعة المحاضرات", nameEn: "Lecture Hall", qIdx: 5, color: 0x4a90e2 },
    { name: "المكتبة", nameEn: "Library", qIdx: 6, color: 0xc87a3a },
    { name: "المختبر", nameEn: "Laboratory", qIdx: 7, color: 0x7ae24a },
    { name: "قاعة الاجتماعات", nameEn: "Meeting Room", qIdx: 8, color: 0xa04ae2 },
    { name: "المسجد", nameEn: "Mosque", qIdx: 9, color: 0x006c35 },
  ];

  const makeStarFloorTexture = () => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 1024;
    const ctx = c.getContext("2d");
    // Cream tile base
    ctx.fillStyle = "#f0e8d0";
    ctx.fillRect(0, 0, 1024, 1024);
    // Subtle grid
    ctx.strokeStyle = "#e0d6b8";
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= 1024; i += 64) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1024); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1024, i); ctx.stroke();
    }
    const cx = 512, cy = 512;
    // 8-petal star — match image 1 (orange/teal/orange/teal alternation)
    const petalColors = ["#c87a3a", "#3d6b5c", "#c87a3a", "#3d6b5c", "#c87a3a", "#3d6b5c", "#c87a3a", "#3d6b5c"];
    ctx.fillStyle = "#1a1a1a";
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const px = cx + Math.cos(angle) * 200;
      const py = cy + Math.sin(angle) * 200;
      ctx.beginPath();
      for (let j = 0; j < 8; j++) {
        const a = (j / 8) * Math.PI * 2;
        const x = px + Math.cos(a) * 130;
        const y = py + Math.sin(a) * 130;
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const px = cx + Math.cos(angle) * 200;
      const py = cy + Math.sin(angle) * 200;
      ctx.fillStyle = petalColors[i];
      ctx.beginPath();
      for (let j = 0; j < 8; j++) {
        const a = (j / 8) * Math.PI * 2;
        const x = px + Math.cos(a) * 118;
        const y = py + Math.sin(a) * 118;
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
    // Center 4-pointed star (overlapping rotated squares)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(-145, -145, 290, 290);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-145, -145, 290, 290);
    ctx.restore();
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = "#c87a3a";
    ctx.fillRect(-130, -130, 260, 260);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-130, -130, 260, 260);
    ctx.restore();
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  const makeQULogoTexture = () => {
    const c = document.createElement("canvas");
    c.width = 1024; c.height = 512;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#006c35";
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = "#f5e9d4";
    ctx.fillRect(40, 40, 944, 432);
    ctx.fillStyle = "#006c35";
    ctx.font = "bold 130px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("جامعة القصيم", 512, 180);
    ctx.fillRect(200, 250, 624, 6);
    ctx.fillStyle = "#1a4a2a";
    ctx.font = "bold 70px sans-serif";
    ctx.fillText("QASSIM UNIVERSITY", 512, 320);
    ctx.font = "40px serif";
    ctx.fillStyle = "#8a6f55";
    ctx.fillText("Established 1424 H — 2004", 512, 400);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  const makeSaudiFlagTexture = () => {
    const c = document.createElement("canvas");
    c.width = 800; c.height = 533;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#006c35";
    ctx.fillRect(0, 0, 800, 533);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 75px serif";
    ctx.textAlign = "center";
    ctx.fillText("لا إله إلا الله محمد رسول الله", 400, 200);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(150, 350); ctx.lineTo(650, 350);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(150, 350); ctx.lineTo(180, 335); ctx.lineTo(180, 365);
    ctx.closePath();
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.fillRect(640, 340, 30, 20);
    ctx.fillRect(660, 325, 15, 50);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  const initScene = useCallback(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xc8d4e0);
    scene.fog = new THREE.Fog(0xd4b878, 90, 250);

    const camera = new THREE.PerspectiveCamera(
      75, mount.clientWidth / mount.clientHeight, 0.1, 500
    );
    camera.position.set(0, 1.7, 28);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    // ============ LIGHTING — bright desert sun ============
    const ambient = new THREE.AmbientLight(0xfff0d0, 0.95);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xfff5c8, 1.4);
    sun.position.set(20, 90, 25);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.left = -80;
    sun.shadow.camera.right = 80;
    sun.shadow.camera.top = 80;
    sun.shadow.camera.bottom = -80;
    scene.add(sun);
    const hemi = new THREE.HemisphereLight(0xc8d4e0, 0xc89868, 0.55);
    scene.add(hemi);

    // ============ EXACT QU SANDSTONE COLORS (from image 1) ============
    // Main wall — warm sandy beige (the dominant building color)
    const sandstone = new THREE.MeshStandardMaterial({
      color: 0xd4b878, roughness: 0.93,
    });
    // Slightly darker — for parapet shadows
    const sandShadow = new THREE.MeshStandardMaterial({
      color: 0xb89860, roughness: 0.93,
    });
    // Lighter — sun-hit edges
    const sandLight = new THREE.MeshStandardMaterial({
      color: 0xe5cf95, roughness: 0.9,
    });
    // Very dark window glass (the thin black strips)
    const darkGlass = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a, roughness: 0.2, metalness: 0.7,
    });
    // White marble floor
    const marbleFloor = new THREE.MeshStandardMaterial({
      color: 0xf2eadc, roughness: 0.4,
    });
    // Stair brown
    const stairWood = new THREE.MeshStandardMaterial({
      color: 0xa87848, roughness: 0.85,
    });
    // Saudi green
    const saudiGreen = new THREE.MeshStandardMaterial({
      color: 0x006c35, roughness: 0.6,
    });

    // ============ DIMENSIONS — RECTANGULAR FOOTPRINT (matches the real building) ============
    // Building is wider X than deep Z (looking at images, atrium is rectangular)
    const atriumX = 26;        // half-width along X axis (square-ish atrium)
    const atriumZ = 26;        // half-depth along Z axis (matches X)
    const corridorWidth = 7;
    const floorHeight = 3.2;
    const numFloors = 6;       // 6 visible balcony levels (matches image 1 — count the floors)
    const setbackPerFloor = 1.2; // each floor steps in 1.2m

    // ============ GROUND ============
    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(200, 0.2, 200),
      new THREE.MeshStandardMaterial({ color: 0xb89868, roughness: 0.95 })
    );
    ground.position.y = -0.2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ============ ATRIUM FLOOR ============
    const floorBase = new THREE.Mesh(
      new THREE.BoxGeometry(atriumX * 2, 0.2, atriumZ * 2),
      marbleFloor
    );
    floorBase.position.y = -0.05;
    floorBase.receiveShadow = true;
    scene.add(floorBase);

    // Star pattern in floor — placed in central zone
    const starFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.MeshStandardMaterial({
        map: makeStarFloorTexture(), roughness: 0.4,
      })
    );
    starFloor.rotation.x = -Math.PI / 2;
    starFloor.position.set(0, 0.06, 5);
    starFloor.receiveShadow = true;
    scene.add(starFloor);

    // ============ STEPPED BALCONIES — RECTANGULAR + cantilevering inward ============
    function buildLevel(level) {
      const group = new THREE.Group();
      // Each floor's atrium opening shrinks
      const innerX = atriumX - level * setbackPerFloor;
      const innerZ = atriumZ - level * setbackPerFloor;
      const yBase = level * floorHeight;

      if (level === 0) {
        // Ground level — open corridor
        const sides = [
          { x: 0, z: -atriumZ - corridorWidth/2, w: (atriumX + corridorWidth)*2, d: corridorWidth },
          { x: 0, z: atriumZ + corridorWidth/2, w: (atriumX + corridorWidth)*2, d: corridorWidth },
          { x: -atriumX - corridorWidth/2, z: 0, w: corridorWidth, d: atriumZ*2 },
          { x: atriumX + corridorWidth/2, z: 0, w: corridorWidth, d: atriumZ*2 },
        ];
        sides.forEach(s => {
          const f = new THREE.Mesh(
            new THREE.BoxGeometry(s.w, 0.2, s.d), marbleFloor
          );
          f.position.set(s.x, 0, s.z);
          f.receiveShadow = true;
          group.add(f);
        });
        // Outer perimeter walls
        const oX = atriumX + corridorWidth;
        const oZ = atriumZ + corridorWidth;
        const ow1 = new THREE.Mesh(
          new THREE.BoxGeometry(oX*2, floorHeight, 0.5), sandstone
        );
        ow1.position.set(0, floorHeight/2, -oZ + 0.25);
        ow1.castShadow = true; ow1.receiveShadow = true;
        group.add(ow1);
        const ow2 = ow1.clone();
        ow2.position.set(0, floorHeight/2, oZ - 0.25);
        group.add(ow2);
        const ow3 = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, floorHeight, oZ*2), sandstone
        );
        ow3.position.set(-oX + 0.25, floorHeight/2, 0);
        ow3.castShadow = true;
        group.add(ow3);
        // East wall with DOORWAY gap (from z = -3 to z = 3)
        // Top piece (above doorway)
        const ow4top = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, floorHeight - 2.4, 6), sandstone
        );
        ow4top.position.set(oX - 0.25, floorHeight - (floorHeight - 2.4)/2, 0);
        group.add(ow4top);
        // North piece
        const ow4n = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, floorHeight, oZ - 3), sandstone
        );
        ow4n.position.set(oX - 0.25, floorHeight/2, -oZ/2 - 1.5);
        ow4n.castShadow = true;
        group.add(ow4n);
        // South piece
        const ow4s = ow4n.clone();
        ow4s.position.set(oX - 0.25, floorHeight/2, oZ/2 + 1.5);
        group.add(ow4s);
        // Door frame top trim (decorative)
        const doorTrim = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 0.15, 6.4), sandShadow
        );
        doorTrim.position.set(oX - 0.25, 2.4, 0);
        group.add(doorTrim);
        return group;
      }

      // Upper floors — OCTAGONAL shape with V-notches on each side
      const slabT = 0.5;

      function balconySegment(len, depth) {
        const sg = new THREE.Group();
        if (len <= 0) return sg;
        const slab = new THREE.Mesh(
          new THREE.BoxGeometry(len, slabT, depth),
          sandShadow
        );
        slab.position.set(0, -slabT/2, depth/2 - 0.5);
        slab.castShadow = true;
        slab.receiveShadow = true;
        sg.add(slab);
        const surface = new THREE.Mesh(
          new THREE.BoxGeometry(len - 0.1, 0.05, depth - 0.3),
          marbleFloor
        );
        surface.position.set(0, 0.025, depth/2 - 0.5);
        surface.receiveShadow = true;
        sg.add(surface);
        const parapet = new THREE.Mesh(
          new THREE.BoxGeometry(len, 0.95, 0.4),
          sandstone
        );
        parapet.position.set(0, 0.475, -0.2);
        parapet.castShadow = true;
        parapet.receiveShadow = true;
        sg.add(parapet);
        const cap = new THREE.Mesh(
          new THREE.BoxGeometry(len, 0.1, 0.5),
          sandShadow
        );
        cap.position.set(0, 1.0, -0.2);
        sg.add(cap);
        return sg;
      }

      function backWallSegment(len, depth) {
        const sg = new THREE.Group();
        if (len <= 0) return sg;
        const wallBelow = new THREE.Mesh(
          new THREE.BoxGeometry(len, 1.4, 0.4),
          sandstone
        );
        wallBelow.position.set(0, 0.7, depth - 0.2);
        wallBelow.castShadow = true;
        sg.add(wallBelow);
        const strip = new THREE.Mesh(
          new THREE.BoxGeometry(len, 0.5, 0.15),
          darkGlass
        );
        strip.position.set(0, 1.7, depth - 0.4);
        sg.add(strip);
        const wallAbove = new THREE.Mesh(
          new THREE.BoxGeometry(len, floorHeight - 2.1, 0.4),
          sandstone
        );
        wallAbove.position.set(0, 1.95 + (floorHeight - 2.1)/2, depth - 0.2);
        wallAbove.castShadow = true;
        sg.add(wallAbove);
        const trim = new THREE.Mesh(
          new THREE.BoxGeometry(len, 0.2, 0.5),
          sandLight
        );
        trim.position.set(0, floorHeight - 0.1, depth - 0.3);
        sg.add(trim);
        return sg;
      }

      // ========= OCTAGONAL FOOTPRINT with V-NOTCHES =========
      // The building has 8 sides arranged as an octagon
      // Each side has a small inward V-notch in the middle (matches reference image)
      const corW = corridorWidth;
      const numSides = 8;
      const radius = (innerX + innerZ) / 2;  // average radius for octagonal approximation
      // Side length of a regular octagon inscribed at radius r:
      const sideLen = 2 * radius * Math.sin(Math.PI / numSides);
      // Distance from center to middle of each side (apothem):
      const apothem = radius * Math.cos(Math.PI / numSides);

      // Build each of the 8 sides
      for (let i = 0; i < numSides; i++) {
        // Angle from atrium center to this side's midpoint
        const angle = (i / numSides) * Math.PI * 2;
        const cx = Math.cos(angle) * apothem;
        const cz = Math.sin(angle) * apothem;
        // Rotation so parapet faces inward (toward atrium center)
        // Parapet is on -z side of the segment in local space, so we want
        // local +z to point AWAY from center (outward)
        const ry = -angle - Math.PI / 2;

        // Each side has 3 parts: left flat, V-notch, right flat
        const sideGroup = new THREE.Group();

        const notchHalfW = sideLen * 0.18;   // V-notch is ~36% of side width
        const notchInward = 1.6;             // V protrudes inward this much
        const flatLen = (sideLen - notchHalfW * 2) / 2;

        // Left flat segment
        if (flatLen > 0) {
          const left = new THREE.Group();
          left.add(balconySegment(flatLen, corW + 1.5));
          left.add(backWallSegment(flatLen, corW + 1.5));
          left.position.x = -(notchHalfW + flatLen/2);
          sideGroup.add(left);
        }

        // V-NOTCH (apex points INWARD = toward atrium center = -z in local space... wait
        // In our local frame here, +z points away from atrium center (outward).
        // The V-notch protrudes INWARD = toward the atrium = -z direction
        // Wait actually re-reading: the notch in the reference IMAGE protrudes OUTWARD
        // (away from atrium, into the building corridor space). The apex of the V is
        // the part closest to the camera/viewer (inside the atrium).
        // Let me re-interpret: the V protrudes INTO the atrium space = toward center = -z (local outward direction is +z)
        // No: parapet faces atrium = parapet at z=-0.2 in segment local. Atrium is at z<0 in segment local.
        // Outward (corridor) = +z. So inward toward atrium = -z direction.
        // V apex pointing INWARD (toward atrium) = apex at -notchInward in z

        // Build the V-notch as two angled segments meeting at apex
        // Left half of V: from (-notchHalfW, 0) to apex (0, -notchInward)
        const halfNotchAngle = Math.atan2(notchInward, notchHalfW);
        const halfNotchLen = Math.sqrt(notchHalfW**2 + notchInward**2);

        // Left half of V
        const vLeft = new THREE.Group();
        vLeft.add(balconySegment(halfNotchLen, corW + 1.5));
        vLeft.add(backWallSegment(halfNotchLen, corW + 1.5));
        vLeft.position.set(-notchHalfW/2, 0, -notchInward/2);
        vLeft.rotation.y = halfNotchAngle;
        sideGroup.add(vLeft);

        // Right half of V
        const vRight = new THREE.Group();
        vRight.add(balconySegment(halfNotchLen, corW + 1.5));
        vRight.add(backWallSegment(halfNotchLen, corW + 1.5));
        vRight.position.set(notchHalfW/2, 0, -notchInward/2);
        vRight.rotation.y = -halfNotchAngle;
        sideGroup.add(vRight);

        // Right flat segment
        if (flatLen > 0) {
          const right = new THREE.Group();
          right.add(balconySegment(flatLen, corW + 1.5));
          right.add(backWallSegment(flatLen, corW + 1.5));
          right.position.x = (notchHalfW + flatLen/2);
          sideGroup.add(right);
        }

        sideGroup.position.set(cx, yBase, cz);
        sideGroup.rotation.y = ry;
        group.add(sideGroup);
      }

      return group;
    }

    for (let i = 0; i < numFloors; i++) {
      scene.add(buildLevel(i));
    }

    // ============ EAST WING — Hallway + Rooms (separate building feel) ============
    const wingStartX = atriumX + corridorWidth;  // door is at this X
    const hallwayLength = 32;                     // hallway extends this far east
    const hallwayWidth = 5;                       // hallway is narrow
    const roomDepth = 9;                          // each room is this deep
    const roomWidth = 8;                          // each room is this wide

    // Hallway floor
    const hallwayFloor = new THREE.Mesh(
      new THREE.BoxGeometry(hallwayLength, 0.2, hallwayWidth),
      marbleFloor
    );
    hallwayFloor.position.set(wingStartX + hallwayLength/2, 0, 0);
    hallwayFloor.receiveShadow = true;
    scene.add(hallwayFloor);

    // Hallway ceiling (with lights)
    const hallwayCeiling = new THREE.Mesh(
      new THREE.BoxGeometry(hallwayLength, 0.3, hallwayWidth),
      sandstone
    );
    hallwayCeiling.position.set(wingStartX + hallwayLength/2, floorHeight - 0.15, 0);
    scene.add(hallwayCeiling);

    // Hallway lights (every 6m)
    for (let lx = 4; lx < hallwayLength; lx += 6) {
      const lightFixture = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.05, 0.6),
        new THREE.MeshStandardMaterial({
          color: 0xffffcc, emissive: 0xfff5c0, emissiveIntensity: 0.8,
        })
      );
      lightFixture.position.set(wingStartX + lx, floorHeight - 0.4, 0);
      scene.add(lightFixture);

      const pl = new THREE.PointLight(0xfff5c0, 0.7, 12);
      pl.position.set(wingStartX + lx, floorHeight - 0.5, 0);
      scene.add(pl);
    }

    // ROOMS — alternate sides of hallway
    // Room layout: 3 rooms on north (z<0), 2 rooms on south (z>0)
    const roomLayouts = [
      { side: -1, x: wingStartX + 6,  qIdx: 0 }, // North: قاعة المحاضرات
      { side: -1, x: wingStartX + 16, qIdx: 1 }, // North: المكتبة
      { side: -1, x: wingStartX + 26, qIdx: 2 }, // North: المختبر
      { side: 1,  x: wingStartX + 8,  qIdx: 3 }, // South: قاعة الاجتماعات
      { side: 1,  x: wingStartX + 22, qIdx: 4 }, // South: المسجد
    ];

    const roomEntryPoints = []; // for player navigation tracking
    const roomLights = [];

    roomLayouts.forEach((layout, idx) => {
      const room = roomData[layout.qIdx];
      const roomCenterX = layout.x;
      // Room sits adjacent to hallway. side: -1 = north (negative Z), +1 = south
      const roomCenterZ = layout.side * (hallwayWidth/2 + roomDepth/2);

      // Floor
      const rfloor = new THREE.Mesh(
        new THREE.BoxGeometry(roomWidth, 0.2, roomDepth),
        marbleFloor
      );
      rfloor.position.set(roomCenterX, 0, roomCenterZ);
      rfloor.receiveShadow = true;
      scene.add(rfloor);

      // Ceiling
      const rceil = new THREE.Mesh(
        new THREE.BoxGeometry(roomWidth, 0.3, roomDepth),
        sandstone
      );
      rceil.position.set(roomCenterX, floorHeight - 0.15, roomCenterZ);
      scene.add(rceil);

      // Walls — front (toward hallway) has doorway, back/sides solid
      // Front wall (closest to hallway) — has doorway
      const frontZ = roomCenterZ - layout.side * roomDepth/2;
      // Front wall split into 2 (left + right of doorway)
      const doorWidth = 2.5;
      const frontPieceWidth = (roomWidth - doorWidth) / 2;
      const fwL = new THREE.Mesh(
        new THREE.BoxGeometry(frontPieceWidth, floorHeight, 0.4),
        sandstone
      );
      fwL.position.set(roomCenterX - (doorWidth/2 + frontPieceWidth/2), floorHeight/2, frontZ);
      fwL.castShadow = true; fwL.receiveShadow = true;
      scene.add(fwL);
      const fwR = fwL.clone();
      fwR.position.set(roomCenterX + (doorWidth/2 + frontPieceWidth/2), floorHeight/2, frontZ);
      scene.add(fwR);
      // Door header
      const fwTop = new THREE.Mesh(
        new THREE.BoxGeometry(doorWidth, 0.7, 0.4), sandstone
      );
      fwTop.position.set(roomCenterX, floorHeight - 0.35, frontZ);
      scene.add(fwTop);

      // Back wall (solid)
      const backZ = roomCenterZ + layout.side * roomDepth/2;
      const bw = new THREE.Mesh(
        new THREE.BoxGeometry(roomWidth, floorHeight, 0.4),
        sandstone
      );
      bw.position.set(roomCenterX, floorHeight/2, backZ);
      bw.castShadow = true; bw.receiveShadow = true;
      scene.add(bw);

      // Side walls
      const sideL = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, floorHeight, roomDepth),
        sandstone
      );
      sideL.position.set(roomCenterX - roomWidth/2, floorHeight/2, roomCenterZ);
      sideL.castShadow = true;
      scene.add(sideL);
      const sideR = sideL.clone();
      sideR.position.set(roomCenterX + roomWidth/2, floorHeight/2, roomCenterZ);
      scene.add(sideR);

      // Room interior decoration based on type
      if (room.nameEn === "Library") {
        // Bookshelves along walls
        for (let s = -1; s <= 1; s += 2) {
          const shelf = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 2.4, roomDepth - 1),
            new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.8 })
          );
          shelf.position.set(roomCenterX + s * (roomWidth/2 - 0.5), 1.2, roomCenterZ);
          shelf.castShadow = true;
          scene.add(shelf);
          // Books — colored bands
          for (let b = 0; b < 8; b++) {
            const book = new THREE.Mesh(
              new THREE.BoxGeometry(0.3, 0.4, 0.7),
              new THREE.MeshStandardMaterial({
                color: [0xc83a4a, 0x4a90a8, 0x3aa878, 0xc87a3a, 0x7a4ac8][b % 5],
              })
            );
            book.position.set(
              roomCenterX + s * (roomWidth/2 - 0.7),
              0.6 + (b % 4) * 0.5,
              roomCenterZ - roomDepth/2 + 1 + Math.floor(b / 4) * (roomDepth/2)
            );
            scene.add(book);
          }
        }
        // Reading table
        const table = new THREE.Mesh(
          new THREE.BoxGeometry(2, 0.1, 1.2),
          new THREE.MeshStandardMaterial({ color: 0x4a3020 })
        );
        table.position.set(roomCenterX, 0.8, roomCenterZ);
        scene.add(table);
        for (let lx = -0.8; lx <= 0.8; lx += 1.6) {
          for (let lz = -0.5; lz <= 0.5; lz += 1.0) {
            const leg = new THREE.Mesh(
              new THREE.BoxGeometry(0.08, 0.8, 0.08),
              new THREE.MeshStandardMaterial({ color: 0x2a1810 })
            );
            leg.position.set(roomCenterX + lx, 0.4, roomCenterZ + lz);
            scene.add(leg);
          }
        }
      } else if (room.nameEn === "Lecture Hall") {
        // Rows of chairs facing back wall
        for (let row = 0; row < 3; row++) {
          for (let col = -1; col <= 1; col++) {
            const chair = new THREE.Mesh(
              new THREE.BoxGeometry(0.6, 0.5, 0.6),
              new THREE.MeshStandardMaterial({ color: 0x4a3a2a })
            );
            chair.position.set(
              roomCenterX + col * 1.2,
              0.25,
              roomCenterZ - layout.side * (roomDepth/4 - row * 1.0)
            );
            scene.add(chair);
            // Chair back
            const back = new THREE.Mesh(
              new THREE.BoxGeometry(0.6, 0.7, 0.1),
              new THREE.MeshStandardMaterial({ color: 0x4a3a2a })
            );
            back.position.set(
              roomCenterX + col * 1.2,
              0.85,
              roomCenterZ - layout.side * (roomDepth/4 - row * 1.0) + layout.side * 0.25
            );
            scene.add(back);
          }
        }
        // Whiteboard on back wall
        const board = new THREE.Mesh(
          new THREE.PlaneGeometry(4, 1.8),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
        );
        board.position.set(roomCenterX, 1.7, backZ - layout.side * 0.25);
        board.rotation.y = layout.side > 0 ? 0 : Math.PI;
        scene.add(board);
      } else if (room.nameEn === "Laboratory") {
        // Lab tables
        for (let tx = -1; tx <= 1; tx += 2) {
          const labTable = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 0.1, 1),
            new THREE.MeshStandardMaterial({ color: 0xc8c8c8, roughness: 0.5 })
          );
          labTable.position.set(roomCenterX + tx * 1.8, 0.85, roomCenterZ);
          scene.add(labTable);
          // Equipment cylinders
          for (let eq = 0; eq < 3; eq++) {
            const beaker = new THREE.Mesh(
              new THREE.CylinderGeometry(0.12, 0.12, 0.3, 8),
              new THREE.MeshStandardMaterial({
                color: [0x4a90a8, 0xc83a4a, 0x3aa878][eq],
                emissive: [0x4a90a8, 0xc83a4a, 0x3aa878][eq],
                emissiveIntensity: 0.2,
              })
            );
            beaker.position.set(roomCenterX + tx * 1.8 + (eq - 1) * 0.5, 1.05, roomCenterZ);
            scene.add(beaker);
          }
        }
      } else if (room.nameEn === "Meeting Room") {
        // Conference table
        const ctable = new THREE.Mesh(
          new THREE.BoxGeometry(roomWidth - 3, 0.15, roomDepth - 4),
          new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.5 })
        );
        ctable.position.set(roomCenterX, 0.85, roomCenterZ);
        scene.add(ctable);
        // Chairs around it
        for (let cx = -2; cx <= 2; cx += 2) {
          for (let cz = -1; cz <= 1; cz += 2) {
            const chair = new THREE.Mesh(
              new THREE.BoxGeometry(0.5, 0.5, 0.5),
              new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
            );
            chair.position.set(roomCenterX + cx, 0.25, roomCenterZ + cz * (roomDepth/2 - 2));
            scene.add(chair);
          }
        }
      } else if (room.nameEn === "Mosque") {
        // Prayer rugs — green carpet rows
        for (let r = 0; r < 4; r++) {
          const rug = new THREE.Mesh(
            new THREE.BoxGeometry(roomWidth - 1, 0.04, 0.8),
            new THREE.MeshStandardMaterial({ color: 0x006c35, roughness: 0.95 })
          );
          rug.position.set(roomCenterX, 0.06, roomCenterZ + (r - 1.5) * 1.2);
          scene.add(rug);
        }
        // Mihrab arch on back wall
        const mihrab = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 2.5, 0.3),
          new THREE.MeshStandardMaterial({ color: 0x006c35, roughness: 0.7 })
        );
        mihrab.position.set(roomCenterX, 1.5, backZ - layout.side * 0.3);
        scene.add(mihrab);
      }

      // Room name plaque next to door
      const plaqueTex = (() => {
        const c = document.createElement("canvas");
        c.width = 512; c.height = 128;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#006c35";
        ctx.fillRect(0, 0, 512, 128);
        ctx.fillStyle = "#f5e9d4";
        ctx.font = "bold 50px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(room.name, 256, 50);
        ctx.font = "bold 24px sans-serif";
        ctx.fillText(room.nameEn, 256, 95);
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
      })();
      const plaque = new THREE.Mesh(
        new THREE.PlaneGeometry(1.8, 0.45),
        new THREE.MeshStandardMaterial({
          map: plaqueTex, side: THREE.DoubleSide, roughness: 0.6,
        })
      );
      plaque.position.set(
        roomCenterX + (frontPieceWidth/2 + doorWidth/2) - 0.5,
        2.5,
        frontZ - layout.side * 0.3
      );
      plaque.rotation.y = layout.side > 0 ? 0 : Math.PI;
      scene.add(plaque);

      // Room ambient light
      const rl = new THREE.PointLight(0xfff0d0, 0.6, 14);
      rl.position.set(roomCenterX, floorHeight - 0.5, roomCenterZ);
      scene.add(rl);

      roomEntryPoints.push({
        x: roomCenterX,
        z: roomCenterZ,
        name: room.name,
        idx: idx,
      });
    });

    // End-of-hallway wall (east end, closes off the wing)
    const endWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, floorHeight, hallwayWidth + 4),
      sandstone
    );
    endWall.position.set(wingStartX + hallwayLength + 0.25, floorHeight/2, 0);
    endWall.castShadow = true;
    scene.add(endWall);

    // Hallway side walls between rooms (block off non-door areas)
    // North side gaps
    [
      { fromX: wingStartX, toX: wingStartX + 2, side: -1 },
      { fromX: wingStartX + 10, toX: wingStartX + 12, side: -1 },
      { fromX: wingStartX + 20, toX: wingStartX + 22, side: -1 },
      { fromX: wingStartX + 30, toX: wingStartX + hallwayLength, side: -1 },
      { fromX: wingStartX, toX: wingStartX + 4, side: 1 },
      { fromX: wingStartX + 12, toX: wingStartX + 18, side: 1 },
      { fromX: wingStartX + 26, toX: wingStartX + hallwayLength, side: 1 },
    ].forEach(seg => {
      const segLen = seg.toX - seg.fromX;
      if (segLen <= 0) return;
      const w = new THREE.Mesh(
        new THREE.BoxGeometry(segLen, floorHeight, 0.4), sandstone
      );
      w.position.set(
        (seg.fromX + seg.toX)/2,
        floorHeight/2,
        seg.side * (hallwayWidth/2 + 0.2)
      );
      w.castShadow = true;
      scene.add(w);
    });

    // Question stations IN ROOMS — replace the central atrium stations
    gameStateRef.current.rooms = roomEntryPoints;

    // ============ GEODESIC DOME — flatter, with strong apex convergence (matches reference) ============
    const domeY = numFloors * floorHeight;
    const domeR = atriumX + 6;
    const domeHeight = 11;  // FLATTER (was 18) — matches the shallow profile in image

    // Translucent dome skin
    const domeSkin = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({
        color: 0xfff8e0,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
        roughness: 0.4,
      })
    );
    domeSkin.scale.set(domeR, domeHeight, domeR);
    domeSkin.position.y = domeY;
    scene.add(domeSkin);

    // Dense triangulated rib structure
    const ribMat = new THREE.LineBasicMaterial({
      color: 0xc8a878, transparent: true, opacity: 0.95,
    });
    const ribMatThin = new THREE.LineBasicMaterial({
      color: 0xb89060, transparent: true, opacity: 0.6,
    });
    const ribMatBright = new THREE.LineBasicMaterial({
      color: 0xe8c898, transparent: true, opacity: 1.0,
    });

    const M = 48; // MORE meridians for density
    const N = 12;

    // Flatter profile: power curves make top flatter
    const domePoint = (mIdx, nIdx) => {
      const angle = (mIdx / M) * Math.PI * 2;
      const phi = (nIdx / N) * (Math.PI / 2);
      const r = Math.pow(Math.cos(phi), 0.7);
      const y = Math.pow(Math.sin(phi), 1.2);
      return new THREE.Vector3(
        Math.cos(angle) * r * domeR,
        y * domeHeight + domeY,
        Math.sin(angle) * r * domeR
      );
    };

    const apex = new THREE.Vector3(0, domeHeight + domeY, 0);

    // MERIDIAN LINES — converge to apex
    for (let i = 0; i < M; i++) {
      const points = [];
      for (let j = 0; j <= N; j++) points.push(domePoint(i, j));
      points[points.length - 1] = apex.clone();
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      scene.add(new THREE.Line(geo, ribMat));
    }

    // LATITUDE RINGS
    for (let j = 1; j < N; j++) {
      const points = [];
      for (let i = 0; i <= M; i++) points.push(domePoint(i, j));
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      scene.add(new THREE.Line(geo, ribMat));
    }

    // DIAGONAL TRIANGULATION (2 directions)
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < M; i++) {
        const a = domePoint(i, j);
        const b = j === N - 1 ? apex.clone() : domePoint(i + 1, j + 1);
        const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
        scene.add(new THREE.Line(geo, ribMatThin));
      }
    }
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < M; i++) {
        const a = domePoint(i + 1, j);
        const b = j === N - 1 ? apex.clone() : domePoint(i, j + 1);
        const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
        scene.add(new THREE.Line(geo, ribMatThin));
      }
    }

    // STARBURST — extra bright rays from rim direct to apex
    for (let i = 0; i < M; i += 2) {
      const rim = domePoint(i, 0);
      const geo = new THREE.BufferGeometry().setFromPoints([rim, apex.clone()]);
      scene.add(new THREE.Line(geo, ribMatBright));
    }

    // Apex glow point
    const apexGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0xfff5d0, transparent: true, opacity: 0.6,
      })
    );
    apexGlow.position.copy(apex);
    scene.add(apexGlow);

    // Solid dome base ring
    const baseRing = new THREE.Mesh(
      new THREE.TorusGeometry(domeR, 0.4, 8, 64),
      new THREE.MeshStandardMaterial({ color: 0x8a7048, roughness: 0.85 })
    );
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = domeY;
    scene.add(baseRing);

    // ============ GRAND CENTRAL STAIRCASE (the wide one in middle of image 1) ============
    function makeGrandStair(centerX, baseZ) {
      const stair = new THREE.Group();
      const stepCount = 16;
      const stepDepth = 0.55;
      const stairWidth = 7;

      for (let i = 0; i < stepCount; i++) {
        const step = new THREE.Mesh(
          new THREE.BoxGeometry(stairWidth, 0.2, stepDepth),
          stairWood
        );
        step.position.set(0, i * (floorHeight / stepCount), -i * stepDepth);
        step.castShadow = true;
        step.receiveShadow = true;
        stair.add(step);
      }

      // Side walls of staircase (chunky concrete — matches image 1)
      [-stairWidth/2 - 0.3, stairWidth/2 + 0.3].forEach(sx => {
        const wall = new THREE.Mesh(
          new THREE.BoxGeometry(0.6, 1.5, stepCount * stepDepth + 1),
          sandstone
        );
        wall.position.set(sx, 1.0, -stepCount * stepDepth / 2);
        wall.castShadow = true;
        stair.add(wall);
      });

      // Top landing
      const landing = new THREE.Mesh(
        new THREE.BoxGeometry(stairWidth, 0.2, 4),
        stairWood
      );
      landing.position.set(0, floorHeight, -stepCount * stepDepth - 2);
      landing.castShadow = true;
      stair.add(landing);

      stair.position.set(centerX, 0, baseZ);
      return stair;
    }

    const grandStairZ = -8;
    scene.add(makeGrandStair(0, grandStairZ));
    gameStateRef.current.stair = {
      x: 0, zStart: grandStairZ,
      stepCount: 16, stepDepth: 0.55, stairWidth: 7,
      floorHeight, numFloors,
    };

    // ============ SMALLER COLUMN/PILLAR (visible in image 1 between the stair and side) ============
    // The cylindrical pillar in image 1 — central support column
    const column1 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, floorHeight * 2, 16),
      sandstone
    );
    column1.position.set(-12, floorHeight, -10);
    column1.castShadow = true;
    scene.add(column1);
    const colCap1 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.2, 0.4, 16),
      sandShadow
    );
    colCap1.position.set(-12, floorHeight * 2 - 0.2, -10);
    scene.add(colCap1);

    const column2 = column1.clone();
    column2.position.set(12, floorHeight, -10);
    scene.add(column2);
    const colCap2 = colCap1.clone();
    colCap2.position.set(12, floorHeight * 2 - 0.2, -10);
    scene.add(colCap2);

    // ============ QU LOGO + SAUDI FLAGS ON BACK WALL ============
    const logoBanner = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 5),
      new THREE.MeshStandardMaterial({
        map: makeQULogoTexture(), side: THREE.DoubleSide, roughness: 0.7,
      })
    );
    logoBanner.position.set(0, 11, -atriumZ + 0.3);
    scene.add(logoBanner);

    const flagMat = new THREE.MeshStandardMaterial({
      map: makeSaudiFlagTexture(), side: THREE.DoubleSide, roughness: 0.6,
    });
    const flagL = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.3), flagMat);
    flagL.position.set(-8, 10, -atriumZ + 0.3);
    scene.add(flagL);
    const flagR = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.3), flagMat);
    flagR.position.set(8, 10, -atriumZ + 0.3);
    scene.add(flagR);

    // ============ HANGING GREENERY (cubes spilling from balconies) ============
    function makeHangingPlant(x, y, z) {
      const g = new THREE.Group();
      const greens = [0x4a7a3a, 0x3d6a2d, 0x5a8a4a];
      for (let i = 0; i < 6; i++) {
        const cube = new THREE.Mesh(
          new THREE.BoxGeometry(0.25, 0.25, 0.25),
          new THREE.MeshStandardMaterial({
            color: greens[i % greens.length], roughness: 0.85,
          })
        );
        cube.position.set(
          (Math.random() - 0.5) * 0.6,
          -Math.random() * 0.4,
          (Math.random() - 0.5) * 0.3
        );
        g.add(cube);
      }
      g.position.set(x, y, z);
      return g;
    }

    // Add greenery on every upper floor balcony edge (sparse, won't crowd)
    for (let lv = 1; lv < numFloors; lv++) {
      const innerX = atriumX - lv * setbackPerFloor;
      const innerZ = atriumZ - lv * setbackPerFloor;
      const y = lv * floorHeight + 0.4;
      // 4 spots per side
      for (let i = -2; i <= 2; i++) {
        if (i === 0) continue;
        if (Math.abs(i) === 2) {
          scene.add(makeHangingPlant(i * (innerX/3), y, -innerZ - 0.3));
          scene.add(makeHangingPlant(i * (innerX/3), y, innerZ + 0.3));
        }
      }
    }

    // ============ BENCHES along atrium walkway (image 1 shows these) ============
    function makeBench(x, z, rotY = 0) {
      const b = new THREE.Group();
      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.15, 0.7),
        new THREE.MeshStandardMaterial({ color: 0x8a6a4a, roughness: 0.8 })
      );
      seat.position.y = 0.5;
      seat.castShadow = true;
      b.add(seat);
      // Legs
      [-1.0, 1.0].forEach(lx => {
        const leg = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.5, 0.5),
          new THREE.MeshStandardMaterial({ color: 0x4a3a2a })
        );
        leg.position.set(lx, 0.25, 0);
        b.add(leg);
      });
      b.position.set(x, 0, z);
      b.rotation.y = rotY;
      return b;
    }
    // Place benches along the long sides
    [
      [-22, 12, 0], [-12, 12, 0], [12, 12, 0], [22, 12, 0],
      [-22, -2, 0], [-22, -14, 0], [22, -2, 0], [22, -14, 0],
    ].forEach(([x, z, r]) => scene.add(makeBench(x, z, r)));

    // ============ NPCs ============
    function makeNPC(x, z) {
      const n = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 1.4, 8),
        new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.85 })
      );
      body.position.y = 0.7;
      body.castShadow = true;
      n.add(body);
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xc8a878 })
      );
      head.position.y = 1.55;
      n.add(head);
      const ghutra = new THREE.Mesh(
        new THREE.ConeGeometry(0.26, 0.35, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 })
      );
      ghutra.position.y = 1.75;
      n.add(ghutra);
      const iqal = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.03, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
      );
      iqal.rotation.x = Math.PI / 2;
      iqal.position.y = 1.68;
      n.add(iqal);
      n.position.set(x, 0, z);
      return n;
    }
    scene.add(makeNPC(-3, -3));
    scene.add(makeNPC(0, -2));
    scene.add(makeNPC(3, -3));
    scene.add(makeNPC(-15, 6));
    scene.add(makeNPC(15, 6));

    // ============ QUESTION STATIONS ============
    // 5 in atrium (questions 0-4) + 5 in rooms (questions 5-9)
    const stationPositions = [
      // ATRIUM stations
      { x: -22, z: -16, color: 0x006c35, qIdx: 0 },
      { x: 22, z: -16, color: 0xe2a04a, qIdx: 1 },
      { x: -22, z: 16, color: 0x006c35, qIdx: 2 },
      { x: 22, z: 16, color: 0x006c35, qIdx: 3 },
      { x: 0, z: 18, color: 0xe24a7a, qIdx: 4 },
    ];

    // Add 5 room stations — one per room at room center
    roomLayouts.forEach((layout, idx) => {
      const room = roomData[layout.qIdx];
      const roomCenterX = layout.x;
      const roomCenterZ = layout.side * (hallwayWidth/2 + roomDepth/2);
      stationPositions.push({
        x: roomCenterX,
        z: roomCenterZ,
        color: room.color,
        qIdx: 5 + idx, // questions 5,6,7,8,9
      });
    });

    const stations = [];
    stationPositions.forEach((pos) => {
      const station = new THREE.Group();
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.8, 0.3, 8),
        sandShadow
      );
      base.position.y = 0.15;
      station.add(base);
      const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 1.6, 0.5),
        new THREE.MeshStandardMaterial({
          color: pos.color, emissive: pos.color, emissiveIntensity: 0.5,
        })
      );
      pillar.position.y = 1.1;
      pillar.castShadow = true;
      station.add(pillar);
      const q = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.6, 0.6),
        new THREE.MeshStandardMaterial({
          color: 0xffffff, emissive: pos.color, emissiveIntensity: 0.9,
        })
      );
      q.position.y = 2.5;
      station.add(q);
      const pl = new THREE.PointLight(pos.color, 1.3, 12);
      pl.position.y = 2.3;
      station.add(pl);
      station.position.set(pos.x, 0, pos.z);
      station.userData = { idx: pos.qIdx, q, originalColor: pos.color, answered: false };
      scene.add(station);
      stations.push(station);
    });
    gameStateRef.current.questionStations = stations;

    // ============ ENEMIES ============
    function makeEnemy(x, z) {
      const enemy = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.45, 1.5, 8),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 })
      );
      body.position.y = 0.75;
      body.castShadow = true;
      enemy.add(body);
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xc8a878 })
      );
      head.position.y = 1.65;
      enemy.add(head);
      const shemagh = new THREE.Mesh(
        new THREE.ConeGeometry(0.32, 0.45, 8),
        new THREE.MeshStandardMaterial({ color: 0xb22222, roughness: 0.7 })
      );
      shemagh.position.y = 1.85;
      enemy.add(shemagh);
      const iqal = new THREE.Mesh(
        new THREE.TorusGeometry(0.25, 0.04, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
      );
      iqal.rotation.x = Math.PI / 2;
      iqal.position.y = 1.78;
      enemy.add(iqal);
      const eyeMat = new THREE.MeshStandardMaterial({
        color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1,
      });
      [-0.08, 0.08].forEach(ex => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), eyeMat);
        eye.position.set(ex, 1.68, 0.22);
        enemy.add(eye);
      });
      enemy.position.set(x, 0, z);
      enemy.userData = { speed: 0.03, target: new THREE.Vector3(x, 0, z) };
      return enemy;
    }
    const enemies = [
      makeEnemy(-25, -10),
      makeEnemy(25, 10),
      makeEnemy(0, -20),
    ];
    enemies.forEach(e => scene.add(e));
    gameStateRef.current.enemies = enemies;

    // ============ INTERIOR LIGHTS ============
    for (let i = 1; i < numFloors; i++) {
      const cl = new THREE.PointLight(0xfff2cc, 0.4, 50);
      cl.position.set(0, i * floorHeight + 1, 0);
      scene.add(cl);
    }
    const domeLight = new THREE.PointLight(0xfff5d0, 1.7, 120);
    domeLight.position.set(0, domeY + 12, 0);
    scene.add(domeLight);

    gameStateRef.current.scene = scene;
    gameStateRef.current.camera = camera;
    gameStateRef.current.renderer = renderer;
    gameStateRef.current.atriumX = atriumX;
    gameStateRef.current.atriumZ = atriumZ;

    // Compute room collision boxes for navigation
    gameStateRef.current.roomBoxes = roomLayouts.map(layout => {
      const cx = layout.x;
      const cz = layout.side * (hallwayWidth/2 + roomDepth/2);
      return {
        minX: cx - roomWidth/2 + 0.5,
        maxX: cx + roomWidth/2 - 0.5,
        minZ: cz - roomDepth/2 + 0.5,
        maxZ: cz + roomDepth/2 - 0.5,
      };
    });

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Seed adaptive pools fresh on every run so a restart doesn't inherit shifted buckets.
  useEffect(() => {
    if (!gameStarted) return;
    poolsRef.current = {
      easy: [...initialPools.easy],
      medium: [...initialPools.medium],
      hard: [...initialPools.hard],
    };
    currentDifficultyRef.current = "easy";
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const tryInteract = () => {
      if (gameStateRef.current.locked) return;
      const p = gameStateRef.current.player;
      const stations = gameStateRef.current.questionStations;
      let closest = null;
      let dmin = 3.0;
      stations.forEach(s => {
        if (s.userData.answered) return;
        const dx = s.position.x - p.x;
        const dz = s.position.z - p.z;
        const d = Math.sqrt(dx*dx + dz*dz);
        if (d < dmin) { dmin = d; closest = s; }
      });
      if (closest) {
        const q = pickQuestionFor(currentDifficultyRef.current);
        if (!q) return; // pools fully drained — leave the station alone
        gameStateRef.current.activeStation = closest;
        gameStateRef.current.locked = true;
        setActiveQuestion(q);
        setTimeLeft(30);
      }
    };
    gameStateRef.current.tryInteract = tryInteract;

    const onKeyDown = (e) => {
      gameStateRef.current.keys[e.code] = true;
      if (e.code === "KeyE") tryInteract();
      if (e.code === "KeyR") {
        // Inline respawn (avoids stale closure on respawn function)
        const gs = gameStateRef.current;
        if (gs.player) {
          gs.player.x = 0; gs.player.y = 1.7; gs.player.z = 18;
          gs.player.yaw = 0; gs.player.pitch = 0;
          gs.joy.x = 0; gs.joy.y = 0;
          gs.look.up = gs.look.down = gs.look.left = gs.look.right = false;
          gs.locked = false;
          gs.activeStation = null;
        }
        if (!gameStateRef.current.locked) {
          // Also clear any open question modal
          setActiveQuestion(null);
          setFeedback(null);
        }
      }
    };
    const onKeyUp = (e) => { gameStateRef.current.keys[e.code] = false; };

    // ============ DESKTOP MOUSE-LOOK (always-on, no click/lock needed) ============
    // Just moving the mouse rotates the camera. No pointer lock, no Esc.
    let lastMouseX = null, lastMouseY = null;
    const onMouseLook = (e) => {
      if (gameStateRef.current.locked) return;
      if (isMobile) return;
      if (lastMouseX !== null && lastMouseY !== null) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        const p = gameStateRef.current.player;
        p.yaw   -= dx * 0.005;
        p.pitch -= dy * 0.005;
        p.pitch = Math.max(-1.535, Math.min(1.535, p.pitch));
      }
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    // ============ TOUCH CONTROLS (mobile) ============
    const joystick = joystickRef.current;
    const lookArea = lookAreaRef.current;

    let joyTouchId = null;
    let joyCenter = { x: 0, y: 0 };
    const JOY_RADIUS = 50;

    const onJoyStart = (e) => {
      e.preventDefault();
      if (joyTouchId !== null) return;
      const t = e.changedTouches ? e.changedTouches[0] : e;
      joyTouchId = e.changedTouches ? t.identifier : "mouse";
      const rect = joystick.getBoundingClientRect();
      joyCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      const knob = joystick.querySelector("[data-knob]");
      if (knob) knob.style.transition = "none";
    };

    const onJoyMove = (e) => {
      if (joyTouchId === null) return;
      e.preventDefault();
      let touch;
      if (e.changedTouches) {
        for (const ct of e.changedTouches) {
          if (ct.identifier === joyTouchId) { touch = ct; break; }
        }
        if (!touch) return;
      } else {
        touch = e;
      }
      let dx = touch.clientX - joyCenter.x;
      let dy = touch.clientY - joyCenter.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist > JOY_RADIUS) {
        dx = (dx / dist) * JOY_RADIUS;
        dy = (dy / dist) * JOY_RADIUS;
      }
      const knob = joystick.querySelector("[data-knob]");
      if (knob) knob.style.transform = `translate(${dx}px, ${dy}px)`;
      // Normalize to -1..1 — invert Y so up = forward
      gameStateRef.current.joy.x = dx / JOY_RADIUS;
      gameStateRef.current.joy.y = -dy / JOY_RADIUS;
    };

    const onJoyEnd = (e) => {
      if (joyTouchId === null) return;
      if (e.changedTouches) {
        let found = false;
        for (const ct of e.changedTouches) {
          if (ct.identifier === joyTouchId) { found = true; break; }
        }
        if (!found) return;
      }
      e.preventDefault();
      joyTouchId = null;
      gameStateRef.current.joy.x = 0;
      gameStateRef.current.joy.y = 0;
      const knob = joystick.querySelector("[data-knob]");
      if (knob) {
        knob.style.transition = "transform 0.15s";
        knob.style.transform = "translate(0px, 0px)";
      }
    };

    // Look area — touch drag rotates camera
    let lookTouchId = null;
    let lookLast = { x: 0, y: 0 };
    const LOOK_SENS = 0.005;

    const onLookStart = (e) => {
      e.preventDefault();
      if (gameStateRef.current.locked) return;
      const t = e.changedTouches ? e.changedTouches[0] : e;
      lookTouchId = e.changedTouches ? t.identifier : "mouse";
      lookLast = { x: t.clientX, y: t.clientY };
    };

    const onLookMove = (e) => {
      if (lookTouchId === null) return;
      if (gameStateRef.current.locked) return;
      e.preventDefault();
      let touch;
      if (e.changedTouches) {
        for (const ct of e.changedTouches) {
          if (ct.identifier === lookTouchId) { touch = ct; break; }
        }
        if (!touch) return;
      } else {
        touch = e;
      }
      const dx = touch.clientX - lookLast.x;
      const dy = touch.clientY - lookLast.y;
      lookLast = { x: touch.clientX, y: touch.clientY };
      const p = gameStateRef.current.player;
      p.yaw -= dx * LOOK_SENS;
      p.pitch -= dy * LOOK_SENS;
      p.pitch = Math.max(-1.535, Math.min(1.535, p.pitch));
    };

    const onLookEnd = (e) => {
      if (lookTouchId === null) return;
      if (e.changedTouches) {
        let found = false;
        for (const ct of e.changedTouches) {
          if (ct.identifier === lookTouchId) { found = true; break; }
        }
        if (!found) return;
      }
      lookTouchId = null;
    };

    // Attach touch listeners
    if (joystick) {
      joystick.addEventListener("touchstart", onJoyStart, { passive: false });
      joystick.addEventListener("mousedown", onJoyStart);
    }
    window.addEventListener("touchmove", onJoyMove, { passive: false });
    window.addEventListener("touchend", onJoyEnd, { passive: false });
    window.addEventListener("touchcancel", onJoyEnd, { passive: false });
    window.addEventListener("mousemove", onJoyMove);
    window.addEventListener("mouseup", onJoyEnd);

    if (lookArea) {
      lookArea.addEventListener("touchstart", onLookStart, { passive: false });
      lookArea.addEventListener("mousedown", onLookStart);
    }
    window.addEventListener("touchmove", onLookMove, { passive: false });
    window.addEventListener("touchend", onLookEnd, { passive: false });
    window.addEventListener("touchcancel", onLookEnd, { passive: false });
    window.addEventListener("mousemove", onLookMove);
    window.addEventListener("mouseup", onLookEnd);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseLook);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseLook);
      // Cleanup touch listeners
      if (joystick) {
        joystick.removeEventListener("touchstart", onJoyStart);
        joystick.removeEventListener("mousedown", onJoyStart);
      }
      window.removeEventListener("touchmove", onJoyMove);
      window.removeEventListener("touchend", onJoyEnd);
      window.removeEventListener("touchcancel", onJoyEnd);
      window.removeEventListener("mousemove", onJoyMove);
      window.removeEventListener("mouseup", onJoyEnd);
      if (lookArea) {
        lookArea.removeEventListener("touchstart", onLookStart);
        lookArea.removeEventListener("mousedown", onLookStart);
      }
      window.removeEventListener("touchmove", onLookMove);
      window.removeEventListener("touchend", onLookEnd);
      window.removeEventListener("touchcancel", onLookEnd);
    };
  }, [gameStarted, isMobile]);

  useEffect(() => {
    if (!gameStarted) return;
    let raf;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();
      const gs = gameStateRef.current;
      if (!gs.scene) return;

      if (!gs.locked) {
        const speed = 9 * dt;
        const p = gs.player;
        const fwd = new THREE.Vector3(-Math.sin(p.yaw), 0, -Math.cos(p.yaw));
        const right = new THREE.Vector3(Math.cos(p.yaw), 0, -Math.sin(p.yaw));

        let nx = p.x;
        let nz = p.z;
        if (gs.keys["KeyW"] || gs.keys["ArrowUp"]) { nx += fwd.x*speed; nz += fwd.z*speed; }
        if (gs.keys["KeyS"] || gs.keys["ArrowDown"]) { nx -= fwd.x*speed; nz -= fwd.z*speed; }
        if (gs.keys["KeyA"] || gs.keys["ArrowLeft"]) { nx -= right.x*speed; nz -= right.z*speed; }
        if (gs.keys["KeyD"] || gs.keys["ArrowRight"]) { nx += right.x*speed; nz += right.z*speed; }

        // ===== JOYSTICK (mobile) — joy.x = strafe, joy.y = forward =====
        if (gs.joy.x !== 0 || gs.joy.y !== 0) {
          // joy.y > 0 = forward, joy.y < 0 = back
          // joy.x > 0 = right, joy.x < 0 = left
          nx += fwd.x * speed * gs.joy.y;
          nz += fwd.z * speed * gs.joy.y;
          nx += right.x * speed * gs.joy.x;
          nz += right.z * speed * gs.joy.x;
        }

        // ===== LOOK PAD (on-screen arrow buttons) =====
        const LOOK_BTN_RATE = 1.8 * dt; // radians per second
        const ls = gs.look;
        if (ls.left)  p.yaw   += LOOK_BTN_RATE;
        if (ls.right) p.yaw   -= LOOK_BTN_RATE;
        if (ls.up)    p.pitch += LOOK_BTN_RATE;
        if (ls.down)  p.pitch -= LOOK_BTN_RATE;
        p.pitch = Math.max(-1.535, Math.min(1.535, p.pitch));

        const floorIdx = Math.round((p.y - 1.7) / 3.2);
        const onStair = Math.abs(p.x) <= 4 && p.z <= -6 && p.z >= -22;

        // ===== COLLISION SYSTEM — clear, simple boundaries =====
        // Build a predicate: can the player stand at (x, z) on this floor?
        const aX = gs.atriumX;       // 26
        const aZ = gs.atriumZ;       // 26
        const wallBuffer = 0.6;       // safe distance from walls
        const wingX0 = aX + 6;        // doorway X (corridor-side)
        const wingX1 = wingX0 + 32;   // far end of hallway
        const roomBoxes = gs.roomBoxes || [];

        const canStand = (x, z) => {
          if (floorIdx === 0) {
            // Ground floor: atrium core (full square minus walls)
            const inMain =
              x >= -aX - 6 + wallBuffer && x <= aX + 6 - wallBuffer &&
              z >= -aZ - 6 + wallBuffer && z <= aZ + 6 - wallBuffer;
            // East wall doorway gap — width matches the hallway interior so the
            // transition into the hallway is seamless (no funnel that lets the
            // player get stuck at z values the hallway can't accept).
            const eastWallX = aX + 6 - wallBuffer;
            const insideEastWall = x >= eastWallX - 0.4;
            const hallwayHalfWidth = 2.5 - wallBuffer;
            const inDoorwayGap = Math.abs(z) <= hallwayHalfWidth;
            if (inMain && (!insideEastWall || inDoorwayGap)) return true;
            // Hallway — start at the atrium east edge so there is no dead zone
            // between the atrium and hallway collision boxes.
            if (x >= eastWallX && x <= wingX1 - wallBuffer &&
                Math.abs(z) <= hallwayHalfWidth) {
              return true;
            }
            // Rooms — locked until the player answers ROOMS_UNLOCK_AT questions in the atrium.
            const roomsUnlocked = questionsAnsweredRef.current >= ROOMS_UNLOCK_AT;
            for (const rb of roomBoxes) {
              if (!roomsUnlocked) continue;
              if (x >= rb.minX && x <= rb.maxX && z >= rb.minZ && z <= rb.maxZ) {
                return true;
              }
              // Doorway corridor: anywhere across the room's full X frontage, allow
              // crossing through the wall plane and into the hallway. Generous so the
              // player doesn't have to pixel-align with the visual doorway.
              if (x >= rb.minX && x <= rb.maxX) {
                const cz = (rb.minZ + rb.maxZ) / 2;
                const isNorth = cz < 0;
                if (isNorth) {
                  if (z >= rb.maxZ && z <= 2.5 - wallBuffer) return true;
                } else {
                  if (z <= rb.minZ && z >= -2.5 + wallBuffer) return true;
                }
              }
            }
            return false;
          } else {
            // Upper floors: OCTAGONAL corridor ring with V-notches
            const setback = floorIdx * 1.2;
            const radius = aX - setback; // since aX = aZ now
            const apothem = radius * Math.cos(Math.PI / 8);
            const notchInward = 1.6;
            const outerR = aX + 6 - wallBuffer;

            // Distance from atrium center
            const dist = Math.sqrt(x*x + z*z);

            // Outer bound (octagonal — but circular approximation works fine)
            if (dist > outerR) return false;

            // Inner bound: the V-notch apex protrudes inward by notchInward
            // So the closest the wall gets to center = apothem - notchInward
            // For a rough but safe inner check, use a slightly larger buffer
            const innerBound = apothem - notchInward - wallBuffer;
            if (dist < innerBound) return false;

            return true;
          }
        };

        // Stair = always allowed
        if (onStair) {
          p.x = nx;
          p.z = nz;
        } else if (canStand(nx, nz)) {
          // Full move OK
          p.x = nx;
          p.z = nz;
        } else {
          // Try axis-aligned slide along wall
          if (canStand(nx, p.z)) p.x = nx;
          else if (canStand(p.x, nz)) p.z = nz;
        }

        const stair = gs.stair;
        let targetY = 1.7;
        if (stair) {
          const onStairFootprint =
            Math.abs(p.x - stair.x) <= stair.stairWidth/2 + 0.5 &&
            p.z <= stair.zStart &&
            p.z >= stair.zStart - stair.stepCount * stair.stepDepth - 3;
          if (onStairFootprint) {
            const dz = stair.zStart - p.z;
            const stairLength = stair.stepCount * stair.stepDepth;
            const progress = Math.max(0, Math.min(1, dz / stairLength));
            targetY = progress * stair.floorHeight + 1.7;
            if (dz > stairLength) targetY = stair.floorHeight + 1.7;
          } else {
            const currentLevel = Math.round((p.y - 1.7) / stair.floorHeight);
            const clamped = Math.max(0, Math.min(stair.numFloors - 1, currentLevel));
            targetY = clamped * stair.floorHeight + 1.7;
          }
        }
        p.y += (targetY - p.y) * Math.min(1, 12 * dt);

        gs.camera.position.set(p.x, p.y, p.z);
        const lookDir = new THREE.Vector3(
          -Math.sin(p.yaw) * Math.cos(p.pitch),
          Math.sin(p.pitch),
          -Math.cos(p.yaw) * Math.cos(p.pitch)
        );
        gs.camera.lookAt(p.x + lookDir.x, p.y + lookDir.y, p.z + lookDir.z);
      }

      gs.questionStations.forEach(s => {
        if (!s.userData.answered) {
          s.userData.q.rotation.y += 0.02;
          s.userData.q.position.y = 2.5 + Math.sin(t*2 + s.userData.idx) * 0.15;
        }
      });

      const p = gs.player;
      const playerOnGround = p.y < 2.5;
      let alertNow = false;
      gs.enemies.forEach(e => {
        if (!playerOnGround) {
          const tx = e.userData.target.x - e.position.x;
          const tz = e.userData.target.z - e.position.z;
          const td = Math.sqrt(tx*tx + tz*tz);
          if (td < 0.3) {
            e.userData.target.set(
              (Math.random() - 0.5) * 50, 0, (Math.random() - 0.5) * 36
            );
          } else {
            e.position.x += (tx/td) * e.userData.speed * 30 * dt;
            e.position.z += (tz/td) * e.userData.speed * 30 * dt;
            e.lookAt(e.userData.target.x, e.position.y + 1, e.userData.target.z);
          }
          return;
        }
        const dx = p.x - e.position.x;
        const dz = p.z - e.position.z;
        const d = Math.sqrt(dx*dx + dz*dz);
        if (d < 9 && !gs.locked) {
          alertNow = true;
          e.position.x += (dx/d) * e.userData.speed * 60 * dt;
          e.position.z += (dz/d) * e.userData.speed * 60 * dt;
          e.lookAt(p.x, e.position.y + 1, p.z);
        } else {
          const tx = e.userData.target.x - e.position.x;
          const tz = e.userData.target.z - e.position.z;
          const td = Math.sqrt(tx*tx + tz*tz);
          if (td < 0.3) {
            e.userData.target.set(
              (Math.random() - 0.5) * 50, 0, (Math.random() - 0.5) * 36
            );
          } else {
            e.position.x += (tx/td) * e.userData.speed * 30 * dt;
            e.position.z += (tz/td) * e.userData.speed * 30 * dt;
            e.lookAt(e.userData.target.x, e.position.y + 1, e.userData.target.z);
          }
        }
        if (d < 1.3 && !gs.locked && playerOnGround) {
          p.x -= (dx/d) * 3;
          p.z -= (dz/d) * 3;
          setLives(l => {
            const nl = l - 1;
            if (nl <= 0) setGameOver(true);
            return nl;
          });
        }
      });
      setEnemyAlert(alertNow);

      gs.renderer.render(gs.scene, gs.camera);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;
    const cleanup = initScene();
    return cleanup;
  }, [gameStarted, initScene]);

  useEffect(() => {
    if (!activeQuestion) return;
    // Stamp the start time the first second this question is up.
    if (questionTimingRef.current.startedAt === 0) {
      questionTimingRef.current.startedAt = Date.now();
    }
    if (timeLeft <= 0) { handleAnswer(-1); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [activeQuestion, timeLeft]);

  const handleAnswer = (idx) => {
    const correct = idx === activeQuestion.correct;
    const station = gameStateRef.current.activeStation;

    // Record per-question metrics for dashboards.
    const startedAt = questionTimingRef.current.startedAt || Date.now();
    const elapsed = Math.max(0, (Date.now() - startedAt) / 1000);
    questionTimingRef.current.perQuestion.push({
      id: activeQuestion.id ?? null,
      difficulty: activeQuestion.difficulty ?? "medium",
      time_taken: elapsed,
      correct,
      timed_out: idx === -1,
    });
    questionTimingRef.current.startedAt = 0;

    // Adaptive transition: derive next difficulty from this answer + post-answer lives.
    const livesAfter = correct ? lives : lives - 1;
    const prevDiff = currentDifficultyRef.current;
    const nextDiff = pickNextDifficulty(prevDiff, {
      correct,
      time_taken: elapsed,
      timed_out: idx === -1,
      lives_after: livesAfter,
    });
    if (nextDiff !== prevDiff) {
      questionTimingRef.current.difficultyChanges.push({
        from: prevDiff,
        to: nextDiff,
        after_question: questionTimingRef.current.perQuestion.length,
        reason: idx === -1 ? "timeout" : !correct ? "wrong" : elapsed < 10 ? "fast_correct" : "hold",
      });
      currentDifficultyRef.current = nextDiff;
    }

    if (correct) {
      setScore(s => s + 100);
      setFeedback({ ok: true, msg: "✓ إجابة صحيحة! +100" });
      if (station) {
        station.userData.answered = true;
        station.userData.q.material.emissive = new THREE.Color(0x00ff44);
        station.userData.q.material.color = new THREE.Color(0x00ff44);
      }
    } else {
      setLives(l => {
        const nl = l - 1;
        if (nl <= 0) setGameOver(true);
        return nl;
      });
      setFeedback({
        ok: false,
        msg: idx === -1 ? "⏱ انتهى الوقت! -1 ❤" : "✗ إجابة خاطئة! -1 ❤",
      });
    }
    setQuestionsAnswered(q => {
      const nq = q + 1;
      if (correct && nq >= 10) setWon(true);
      return nq;
    });
    setTimeout(() => {
      setActiveQuestion(null);
      setFeedback(null);
      gameStateRef.current.locked = false;
      gameStateRef.current.activeStation = null;
    }, 1400);
  };

  // Push the session payload to Laravel exactly once when the run ends, so
  // StudentQuizPerformance fills and faculty/student dashboards reflect it live.
  const reportedRef = useRef(false);
  useEffect(() => {
    if (!(gameOver || won) || reportedRef.current) return;
    reportedRef.current = true;

    const per = questionTimingRef.current.perQuestion;
    const times = per.map((p) => p.time_taken);
    const correctCount = per.filter((p) => p.correct).length;
    const wrongCount = per.length - correctCount;
    const totalTime = Math.round(times.reduce((a, b) => a + b, 0));
    const avg = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    const fastest = times.length ? Math.min(...times) : null;
    const slowest = times.length ? Math.max(...times) : null;

    fetch("/quiz/record-performance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken,
        Accept: "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        course_code: courseCode,
        attachment_key: attachmentKey,
        session_id: sessionIdRef.current,
        total_questions: per.length,
        correct_answers: correctCount,
        wrong_answers: wrongCount,
        lives_remaining: Math.max(0, lives),
        total_time: totalTime,
        avg_answer_time: Number(avg.toFixed(2)),
        fastest_answer: fastest,
        slowest_answer: slowest,
        starting_difficulty: per[0]?.difficulty ?? "easy",
        ending_difficulty: per[per.length - 1]?.difficulty ?? "easy",
        difficulty_changes: questionTimingRef.current.difficultyChanges,
        questions_answered: per,
      }),
    }).catch((e) => console.warn("record-performance failed", e));
  }, [gameOver, won, lives, courseCode, attachmentKey, csrfToken]);

  const restart = () => {
    setGameStarted(false);
    setGameOver(false); setWon(false);
    setLives(3); setScore(0); setQuestionsAnswered(0);
    setActiveQuestion(null); setTimeLeft(30); setFeedback(null);
    poolsRef.current = { easy: [], medium: [], hard: [] };
    currentDifficultyRef.current = "easy";
    questionTimingRef.current = { startedAt: 0, perQuestion: [], difficultyChanges: [] };
    sessionIdRef.current = `game_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    reportedRef.current = false;
    gameStateRef.current = {
      scene: null, camera: null, renderer: null,
      player: { x: 0, y: 1.7, z: 18, yaw: 0, pitch: 0 },
      keys: {}, enemies: [], questionStations: [],
      activeStation: null, locked: false, stair: null,
      joy: { x: 0, y: 0 },
      look: { up: false, down: false, left: false, right: false },
    };
  };

  // Respawn — teleport player back to spawn point if stuck (keeps progress)
  const respawn = () => {
    const gs = gameStateRef.current;
    if (!gs.player) return;
    gs.player.x = 0;
    gs.player.y = 1.7;
    gs.player.z = 18;
    gs.player.yaw = 0;
    gs.player.pitch = 0;
    gs.joy.x = 0;
    gs.joy.y = 0;
    if (gs.look) gs.look.up = gs.look.down = gs.look.left = gs.look.right = false;
    gs.locked = false;
    gs.activeStation = null;
    if (gs.camera) {
      gs.camera.position.set(0, 1.7, 18);
      gs.camera.lookAt(0, 1.7, 17);
    }
  };

  return (
    <div style={{
      position: "relative", width: "100%", height: "100vh",
      background: "#f5f3ee",
      fontFamily: "'Tajawal', 'Cairo', system-ui, sans-serif",
      overflow: "hidden",
      touchAction: "none",
      userSelect: "none",
      WebkitUserSelect: "none",
      WebkitTouchCallout: "none",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&family=Amiri:wght@700&display=swap" rel="stylesheet" />
      <div ref={mountRef} style={{
        width: "100%", height: "100%",
        cursor: gameStarted ? "none" : "default",
      }} />

      {!gameStarted && !gameOver && !won && (
        <div style={{
          position: "absolute", inset: 0,
          color: "#1f2937", textAlign: "center",
          touchAction: "auto", overflow: "hidden",
          zIndex: 100,
        }}>
          <style>{`
            @keyframes qu-rise   { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
            @keyframes qu-pulse  { 0%,100% { box-shadow: 0 10px 30px rgba(0,108,53,.18), 0 0 0 6px rgba(0,108,53,.05) }
                                   50%     { box-shadow: 0 14px 40px rgba(0,108,53,.28), 0 0 0 10px rgba(0,108,53,.07) } }
            .qu-start-cta { transition: transform 140ms ease, box-shadow 140ms ease, filter 140ms ease; }
            .qu-start-cta:hover  { transform: translateY(-2px); filter: brightness(1.05); box-shadow: 0 14px 32px rgba(0,108,53,.28), inset 0 1px 0 rgba(255,255,255,.2); }
            .qu-start-cta:active { transform: translateY(0); filter: brightness(.96); }
            .qu-controls { animation: qu-rise 600ms ease 200ms both; }
            .qu-title    { animation: qu-rise 600ms ease 60ms both; }
            .qu-cta      { animation: qu-rise 600ms ease 120ms both; }
          `}</style>

          {/* Light backdrop */}
          <div style={{
            position: "absolute", inset: 0,
            background:
              "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(0,108,53,0.10), transparent 60%)," +
              "linear-gradient(180deg, #ffffff 0%, #f7f5ef 60%, #efece4 100%)",
          }} />

          {/* Soft top accent line */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 4,
            background: "linear-gradient(90deg, transparent, #006c35 50%, transparent)",
            opacity: 0.7, pointerEvents: "none",
          }} />

          {/* Foreground content */}
          <div style={{
            position: "relative", zIndex: 2,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "clamp(20px, 4vh, 40px)",
            height: "100%", padding: "max(28px, 4vh) 24px",
            fontFamily: "'Tajawal', 'Cairo', system-ui, sans-serif",
          }}>
            <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&family=Amiri:wght@700&display=swap" rel="stylesheet" />

            <div className="qu-title">
              <div style={{
                width: 104, height: 104, borderRadius: "50%",
                margin: "0 auto 22px",
                background: "linear-gradient(135deg, #006c35 0%, #00854a 70%)",
                border: "1px solid rgba(0,108,53,0.25)",
                display: "grid", placeItems: "center",
                animation: "qu-pulse 4s ease-in-out infinite",
              }}>
                <span style={{ fontFamily: "Amiri, serif", fontSize: 36, fontWeight: 700, color: "#fff" }}>QU</span>
              </div>
              <h1 style={{
                fontFamily: "Amiri, serif",
                fontSize: "clamp(40px, 7vw, 84px)", fontWeight: 700,
                color: "#0d2e1c", margin: "0 0 14px",
                letterSpacing: 2,
              }}>جامعة القصيم</h1>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                fontSize: "clamp(11px, 1.5vw, 13px)",
                color: "#006c35", fontWeight: 800,
                background: "#fff",
                border: "1px solid rgba(0,108,53,0.18)",
                padding: "6px 18px", borderRadius: 999,
                letterSpacing: 1.6,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#006c35" }} />
                QASSIM UNIVERSITY · QU QUEST
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#006c35" }} />
              </div>
            </div>

            <div className="qu-cta" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <button
                className="qu-start-cta"
                onClick={() => setGameStarted(true)}
                onTouchEnd={(e) => { e.preventDefault(); setGameStarted(true); }}
                style={{
                  background: "linear-gradient(135deg, #006c35, #00854a)",
                  color: "white", border: "1px solid rgba(0,108,53,0.4)",
                  padding: "16px 56px",
                  fontSize: "clamp(16px, 4vw, 22px)", fontWeight: 800,
                  borderRadius: 8, cursor: "pointer", letterSpacing: 1.6,
                  boxShadow: "0 10px 24px rgba(0,108,53,0.22), inset 0 1px 0 rgba(255,255,255,0.18)",
                }}>ابدأ اللعبة · START GAME</button>

              <div className="qu-controls" style={{
                background: "#ffffff",
                border: "1px solid rgba(15,23,42,0.08)",
                borderRadius: 12, padding: "14px 20px",
                maxWidth: 520, width: "92%",
                boxSizing: "border-box",
                boxShadow: "0 4px 16px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
              }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  marginBottom: 10, fontSize: "clamp(11px, 2.4vw, 12px)",
                  color: "#6b7280", fontWeight: 700, letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}>
                  <span style={{ width: 18, height: 1, background: "rgba(15,23,42,0.15)" }} />
                  {isMobile ? "التحكم باللمس · TOUCH CONTROLS" : "التحكم · CONTROLS"}
                  <span style={{ width: 18, height: 1, background: "rgba(15,23,42,0.15)" }} />
                </div>
                <div style={{
                  display: "grid", gap: 6,
                  fontSize: "clamp(11px, 2.4vw, 13px)",
                  color: "#374151",
                  textAlign: "left",
                }}>
                  {isMobile ? (
                    <>
                      <div><kbd style={kbdStyle}>عصا</kbd> Move with joystick / تحرّك</div>
                      <div><kbd style={kbdStyle}>اسحب</kbd> Drag screen to look / النظر</div>
                      <div><kbd style={kbdStyle}>تفاعل</kbd> Tap green button / تفاعل</div>
                      <div><kbd style={kbdStyle}>درج</kbd> Walk into stairs to climb</div>
                      <div><kbd style={kbdStyle}>↻</kbd> "عُد للبداية" if stuck / إذا علقت</div>
                    </>
                  ) : (
                    <>
                      <div><kbd style={kbdStyle}>W A S D</kbd> Move / تحرّك</div>
                      <div><kbd style={kbdStyle}>Mouse</kbd> Move mouse to look / النظر</div>
                      <div><kbd style={kbdStyle}>E</kbd> Interact / تفاعل</div>
                      <div><kbd style={kbdStyle}>R</kbd> Respawn if stuck / عُد للبداية</div>
                      <div><kbd style={kbdStyle}>Stairs</kbd> Walk into them / امشي للدرج</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {gameStarted && !gameOver && !won && (
        <>
          {/* Look area — touch overlay for mobile drag-to-look. Hidden on desktop so canvas clicks reach pointer-lock. */}
          {isMobile && (
            <div ref={lookAreaRef} style={{
              position: "absolute", inset: 0, zIndex: 1,
              touchAction: "none",
            }} />
          )}


          <div style={{
            position: "absolute", top: 12, left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, rgba(0,108,53,0.85), rgba(0,133,74,0.85))",
            color: "#fff", padding: "5px 14px",
            borderRadius: 4, fontSize: "clamp(10px, 2.5vw, 13px)", fontWeight: 700,
            letterSpacing: 1.2, pointerEvents: "none", zIndex: 5,
            border: "1px solid rgba(217,199,154,0.4)",
            backdropFilter: "blur(4px)",
            whiteSpace: "nowrap",
          }}>جامعة القصيم · QASSIM UNIVERSITY</div>

          <div style={{
            position: "absolute", top: 50, left: 12, right: 12,
            display: "flex", justifyContent: "space-between",
            alignItems: "center", pointerEvents: "none", zIndex: 5,
          }}>
            <div style={hudPanel}>
              <span style={{ color: "#ff6b6b", fontSize: "clamp(16px, 4vw, 22px)" }}>
                {"❤".repeat(Math.max(0, lives))}
                <span style={{ color: "#444" }}>{"❤".repeat(3 - Math.max(0, lives))}</span>
              </span>
            </div>
            <div style={hudPanel}>
              <span style={{ color: "#d9c79a", fontWeight: 700, fontSize: "clamp(11px, 2.8vw, 14px)" }}>
                {questionsAnswered}/10 ✦ {score} pts
              </span>
            </div>
          </div>

          {/* Respawn button — top right corner, always accessible */}
          <button
            onClick={respawn}
            onTouchEnd={(e) => { e.preventDefault(); respawn(); }}
            title="عُد لنقطة البداية / Return to spawn"
            style={{
              position: "absolute",
              top: 95, right: 12,
              background: "rgba(20,15,10,0.75)",
              border: "1px solid rgba(217,199,154,0.4)",
              color: "#d9c79a",
              padding: "6px 12px",
              borderRadius: 4,
              fontSize: "clamp(10px, 2.4vw, 12px)",
              fontWeight: 700,
              cursor: "pointer",
              zIndex: 10,
              backdropFilter: "blur(4px)",
              fontFamily: "inherit",
              touchAction: "manipulation",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
            <span style={{ fontSize: "1.2em" }}>↻</span>
            <span>عُد للبداية</span>
          </button>

          {/* Crosshair — desktop only */}
          {!isMobile && (
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)", width: 24, height: 24,
              pointerEvents: "none", zIndex: 5,
            }}>
              <div style={crosshairLine("h")} />
              <div style={crosshairLine("v")} />
            </div>
          )}
          {/* Mobile crosshair (small dot) */}
          {isMobile && (
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)", width: 8, height: 8,
              borderRadius: "50%",
              background: "rgba(0,108,53,0.7)",
              border: "2px solid rgba(255,255,255,0.5)",
              pointerEvents: "none", zIndex: 5,
            }} />
          )}

          {enemyAlert && (
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -120%)",
              background: "rgba(178,34,34,0.85)", color: "white",
              padding: "8px 24px", borderRadius: 4, fontWeight: 700,
              animation: "pulse 0.6s ease-in-out infinite",
              pointerEvents: "none", zIndex: 5,
              fontSize: "clamp(11px, 2.8vw, 14px)",
            }}>⚠ GUARD APPROACHING — حذر</div>
          )}

          {/* Desktop hint */}
          {!isMobile && (
            <div style={{
              position: "absolute", bottom: 24, left: "50%",
              transform: "translateX(-50%)",
              color: "#d9c79a", fontSize: 14,
              pointerEvents: "none",
              zIndex: 5,
              textAlign: "center",
              background: "rgba(20,15,10,0.78)",
              border: "1px solid rgba(217,199,154,0.4)",
              borderRadius: 8,
              padding: "10px 18px",
              backdropFilter: "blur(6px)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
              maxWidth: "90vw",
            }}>
              <div>اقترب من صندوق الأسئلة واضغط <kbd style={kbdStyle}>E</kbd></div>
              {questionsAnswered < ROOMS_UNLOCK_AT ? (
                <div style={{
                  fontSize: 12,
                  marginTop: 6,
                  color: "#ffd97a",
                  fontWeight: 700,
                }}>
                  🔒 أجب على {ROOMS_UNLOCK_AT - questionsAnswered} {ROOMS_UNLOCK_AT - questionsAnswered === 1 ? "سؤال" : "أسئلة"} في الساحة لفتح القاعات
                  <br />
                  Answer {ROOMS_UNLOCK_AT - questionsAnswered} more in the atrium to unlock the rooms
                </div>
              ) : (
                <div style={{ fontSize: 12, marginTop: 4, color: "#a7e8a7", fontWeight: 700 }}>
                  ✅ القاعات مفتوحة · توجّه شرقاً ثم ادخل من أي باب جانبي
                  <br />
                  Rooms unlocked — head east, then enter any side door
                </div>
              )}
            </div>
          )}

          {/* ============ ON-SCREEN CONTROLS (mobile only) ============ */}
          {isMobile && (
            <>
              {/* Joystick (bottom-left) */}
              <div ref={joystickRef} style={{
                position: "absolute",
                bottom: 30, left: 30,
                width: 120, height: 120,
                borderRadius: "50%",
                background: "rgba(20,15,10,0.55)",
                border: "2px solid rgba(217,199,154,0.5)",
                touchAction: "none",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
              }}>
                {/* Joystick knob */}
                <div data-knob style={{
                  width: 50, height: 50,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #006c35, #00854a)",
                  border: "2px solid rgba(217,199,154,0.7)",
                  pointerEvents: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                }} />
                {/* Direction hint arrows */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  color: "rgba(217,199,154,0.3)",
                  fontSize: 11,
                  fontWeight: 700,
                }}>
                  <div style={{ position: "absolute", top: 4 }}>↑</div>
                  <div style={{ position: "absolute", bottom: 4 }}>↓</div>
                  <div style={{ position: "absolute", left: 6 }}>←</div>
                  <div style={{ position: "absolute", right: 6 }}>→</div>
                </div>
              </div>

              {/* Joystick label */}
              <div style={{
                position: "absolute",
                bottom: 8, left: 30,
                width: 120, textAlign: "center",
                color: "#d9c79a", fontSize: 10, fontWeight: 700,
                pointerEvents: "none", zIndex: 10,
                opacity: 0.7,
              }}>تحرّك / MOVE</div>

              {/* Interact button (bottom-right) */}
              <button
                onTouchStart={(e) => { e.preventDefault(); gameStateRef.current.tryInteract?.(); }}
                onClick={(e) => { e.preventDefault(); gameStateRef.current.tryInteract?.(); }}
                style={{
                  position: "absolute",
                  bottom: 30, right: 30,
                  width: 80, height: 80,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #006c35, #00a050)",
                  border: "2px solid rgba(217,199,154,0.7)",
                  color: "white",
                  fontSize: 22,
                  fontWeight: 700,
                  cursor: "pointer",
                  zIndex: 10,
                  boxShadow: "0 4px 12px rgba(0,108,53,0.5)",
                  touchAction: "none",
                  fontFamily: "inherit",
                }}>تفاعل</button>

              {/* Look pad (above interact button) — click & hold an arrow to rotate camera */}
              {(() => {
                const press = (dir) => (e) => {
                  e.preventDefault();
                  if (gameStateRef.current.look) gameStateRef.current.look[dir] = true;
                };
                const release = (dir) => (e) => {
                  e.preventDefault();
                  if (gameStateRef.current.look) gameStateRef.current.look[dir] = false;
                };
                const lookBtnStyle = {
                  position: "absolute",
                  width: 44, height: 44,
                  borderRadius: "50%",
                  background: "rgba(20,15,10,0.7)",
                  border: "2px solid rgba(217,199,154,0.6)",
                  color: "#d9c79a",
                  fontSize: 20,
                  fontWeight: 700,
                  cursor: "pointer",
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  touchAction: "none",
                  fontFamily: "inherit",
                  padding: 0,
                };
                const mkBtn = (dir, label, pos) => (
                  <button
                    key={dir}
                    onMouseDown={press(dir)}
                    onMouseUp={release(dir)}
                    onMouseLeave={release(dir)}
                    onTouchStart={press(dir)}
                    onTouchEnd={release(dir)}
                    onTouchCancel={release(dir)}
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ ...lookBtnStyle, ...pos }}
                    aria-label={`look ${dir}`}
                  >{label}</button>
                );
                return (
                  <div style={{
                    position: "absolute",
                    bottom: 120, right: 30,
                    width: 140, height: 140,
                    zIndex: 10,
                  }}>
                    {mkBtn("up",    "↑", { top: 0,    left: 48 })}
                    {mkBtn("left",  "←", { top: 48,   left: 0  })}
                    {mkBtn("right", "→", { top: 48,   right: 0 })}
                    {mkBtn("down",  "↓", { bottom: 0, left: 48 })}
                    <div style={{
                      position: "absolute", inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      pointerEvents: "none",
                      color: "rgba(217,199,154,0.5)", fontSize: 9, fontWeight: 700,
                    }}>LOOK<br/>النظر</div>
                  </div>
                );
              })()}
            </>
          )}

        </>
      )}


      {activeQuestion && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex", justifyContent: "center", alignItems: "center",
          padding: 24, backdropFilter: "blur(4px)",
          touchAction: "auto",
          zIndex: 100,
        }}>
          <div style={{
            background: "linear-gradient(180deg, #1f1810, #2a1f15)",
            border: "1px solid rgba(0,108,53,0.5)",
            borderRadius: 8, padding: "clamp(16px, 4vw, 32px)", maxWidth: 600, width: "100%",
            maxHeight: "90vh", overflowY: "auto",
            color: "#f5e9d4", boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            touchAction: "auto",
          }}>
            <div style={{
              fontSize: 11, color: "#006c35", fontWeight: 700,
              letterSpacing: 1.5, marginBottom: 12,
            }}>QU QUEST · جامعة القصيم</div>
            <div style={{
              height: 6, background: "#2a1f15", borderRadius: 3,
              overflow: "hidden", marginBottom: 20,
            }}>
              <div style={{
                height: "100%", width: `${(timeLeft/30)*100}%`,
                background: timeLeft > 10
                  ? "linear-gradient(90deg, #006c35, #00a050)"
                  : "linear-gradient(90deg, #b22222, #ff4444)",
                transition: "width 1s linear",
              }} />
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginBottom: 14, fontSize: "clamp(12px, 3vw, 14px)", color: "#b8a878",
            }}>
              <span>سؤال {questionsAnswered + 1} / 10</span>
              <span style={{
                color: timeLeft <= 10 ? "#ff6b6b" : "#d9c79a",
                fontWeight: 700,
              }}>⏱ {timeLeft}s</span>
            </div>
            {(() => {
              const diff = activeQuestion.difficulty || "medium";
              const meta = {
                easy:   { label: "سهل",   bg: "rgba(0,108,53,0.25)",  fg: "#3ecf7a", bd: "rgba(0,160,80,0.5)" },
                medium: { label: "متوسط", bg: "rgba(217,164,45,0.25)", fg: "#e6b94a", bd: "rgba(217,164,45,0.55)" },
                hard:   { label: "صعب",   bg: "rgba(178,34,34,0.25)",  fg: "#ff6b6b", bd: "rgba(255,107,107,0.55)" },
              }[diff] || { label: diff, bg: "rgba(217,199,154,0.12)", fg: "#d9c79a", bd: "rgba(217,199,154,0.35)" };
              return (
                <div style={{ marginBottom: 10, direction: "rtl" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: "clamp(11px, 2.5vw, 13px)",
                    fontWeight: 700,
                    background: meta.bg,
                    color: meta.fg,
                    border: `1px solid ${meta.bd}`,
                    letterSpacing: 0.3,
                  }}>{meta.label}</span>
                </div>
              );
            })()}
            <div style={{
              fontSize: "clamp(18px, 4.5vw, 24px)", fontWeight: 700, marginBottom: 8,
              fontFamily: "Amiri, serif", lineHeight: 1.4, direction: "rtl",
            }}>{activeQuestion.q}</div>
            <div style={{
              fontSize: "clamp(12px, 3vw, 14px)", color: "#b8a878",
              marginBottom: 20, fontStyle: "italic",
            }}>{activeQuestion.qEn}</div>
            <div style={{ display: "grid", gap: 8 }}>
              {activeQuestion.options.map((opt, i) => (
                <button key={i}
                  onClick={() => !feedback && handleAnswer(i)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    if (!feedback) handleAnswer(i);
                  }}
                  disabled={!!feedback}
                  style={{
                    background: feedback && i === activeQuestion.correct
                      ? "rgba(0,108,53,0.4)"
                      : feedback && !feedback.ok && i !== activeQuestion.correct
                      ? "rgba(178,34,34,0.2)"
                      : "rgba(217,199,154,0.08)",
                    border: "1px solid rgba(217,199,154,0.3)",
                    color: "#f5e9d4",
                    padding: "12px 16px",
                    fontSize: "clamp(15px, 3.5vw, 18px)",
                    borderRadius: 4,
                    cursor: feedback ? "default" : "pointer",
                    textAlign: "right", direction: "rtl",
                    fontFamily: "inherit", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!feedback) e.currentTarget.style.background = "rgba(0,108,53,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    if (!feedback) e.currentTarget.style.background = "rgba(217,199,154,0.08)";
                  }}>
                  <span style={{ color: "#006c35", marginLeft: 8, fontWeight: 700 }}>
                    {["أ", "ب", "ج", "د"][i]}.
                  </span>{opt}
                </button>
              ))}
            </div>
            {feedback && (
              <div style={{
                marginTop: 16, padding: 12,
                background: feedback.ok ? "rgba(0,108,53,0.3)" : "rgba(178,34,34,0.3)",
                borderRadius: 4, textAlign: "center",
                fontWeight: 700, fontSize: "clamp(15px, 3.5vw, 18px)",
              }}>{feedback.msg}</div>
            )}
          </div>
        </div>
      )}

      {(gameOver || won) && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.85)",
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          color: "#f5e9d4", textAlign: "center", padding: 24,
          touchAction: "auto",
          zIndex: 100,
        }}>
          <div style={{
            fontFamily: "Amiri, serif", fontSize: 64, fontWeight: 700,
            color: won ? "#006c35" : "#b22222", marginBottom: 16,
          }}>{won ? "🏆 مبروك!" : "💀 انتهت اللعبة"}</div>
          <div style={{ fontSize: 20, marginBottom: 8 }}>
            {won ? "You completed QU Quest!" : "Game Over"}
          </div>
          <div style={{ fontSize: 24, color: "#d9c79a", marginBottom: 32 }}>
            النقاط النهائية: {score}
          </div>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 12,
            justifyContent: "center", alignItems: "center",
          }}>
            <button
              onClick={restart}
              onTouchEnd={(e) => { e.preventDefault(); restart(); }}
              style={{
              background: "linear-gradient(135deg, #006c35, #00854a)",
              color: "white", border: "none", padding: "14px 32px",
              fontSize: 18, fontWeight: 700, borderRadius: 8, cursor: "pointer",
              boxShadow: "0 6px 14px -4px rgba(0,108,53,0.5)",
            }}>إعادة / PLAY AGAIN</button>
            <button
              onClick={() => { window.location.href = `/courses/${courseId ?? courseCode}`; }}
              onTouchEnd={(e) => { e.preventDefault(); window.location.href = `/courses/${courseId ?? courseCode}`; }}
              style={{
              background: "linear-gradient(135deg, #1f2937, #374151)",
              color: "#f5e9d4", border: "1px solid rgba(217,199,154,0.4)",
              padding: "14px 32px",
              fontSize: 18, fontWeight: 700, borderRadius: 8, cursor: "pointer",
              boxShadow: "0 6px 14px -4px rgba(0,0,0,0.5)",
            }}>← العودة إلى المقرر / BACK TO COURSE</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        kbd { font-family: inherit; }
      `}</style>
    </div>
  );
}

const hudPanel = {
  background: "rgba(20,15,10,0.7)",
  border: "1px solid rgba(0,108,53,0.4)",
  padding: "8px 16px", borderRadius: 4, backdropFilter: "blur(4px)",
};
const kbdStyle = {
  background: "#f3f4f6",
  border: "1px solid rgba(15,23,42,0.12)",
  borderBottomWidth: 2,
  padding: "2px 8px", borderRadius: 4,
  fontSize: 12, fontWeight: 700, color: "#0d2e1c", margin: "0 4px",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};
const crosshairLine = (dir) => ({
  position: "absolute", background: "rgba(0,108,53,0.85)",
  ...(dir === "h"
    ? { top: "50%", left: 0, right: 0, height: 2, transform: "translateY(-50%)" }
    : { left: "50%", top: 0, bottom: 0, width: 2, transform: "translateX(-50%)" }),
});
