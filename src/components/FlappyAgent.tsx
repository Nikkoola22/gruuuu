import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowLeft,
  Feather,
  Maximize2,
  Minimize2,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { GennevilliersLogo } from "./GennevilliersLogo.tsx";

interface FlappyAgentProps {
  onClose: () => void;
}

const BASE_URL = import.meta.env.BASE_URL;

// Logical portrait canvas dimensions (9:16) from fable-arcade/flappy-bird
const W = 360;
const H = 640;

const STEP = 1 / 60;
const MAX_FRAME = 0.05;
const GROUND_Y = 556;
const SCROLL = 138;
const GRAVITY = 1500;
const FLAP_V = -400;
const MAX_FALL = 620;
const BIRD_X = 96;
const BIRD_R = 13;
const PIPE_W = 58;
const PIPE_SPACING = 196;
const GAP_MAX = 158;
const GAP_MIN = 132;
const DAY_PIPES = 10;

const BEST_KEY = "flappy-cfdt-gennevilliers.best";
const MUTE_KEY = "flappy-cfdt-gennevilliers.muted";

const FONT =
  "'Luckiest Guy', 'Impact', 'Arial Black', 'Helvetica Neue', Arial, sans-serif";

type Rgb = [number, number, number];

interface SkyPaletteHex {
  top: string;
  mid: string;
  bot: string;
  sun: string;
  glow: string;
  glowA: number;
  cloud: string;
  cloudS: string;
  mtn: string;
  mtnS: string;
  rock: string;
  rockS: string;
  tree: string;
  treeS: string;
  grass: string;
  grassS: string;
  dirt: string;
  dirtS: string;
  haze: string;
  hazeA: number;
}

interface SkyPaletteRgb {
  top: Rgb;
  mid: Rgb;
  bot: Rgb;
  sun: Rgb;
  glow: Rgb;
  glowA: number;
  cloud: Rgb;
  cloudS: Rgb;
  mtn: Rgb;
  mtnS: Rgb;
  rock: Rgb;
  rockS: Rgb;
  tree: Rgb;
  treeS: Rgb;
  grass: Rgb;
  grassS: Rgb;
  dirt: Rgb;
  dirtS: Rgb;
  haze: Rgb;
  hazeA: number;
}

const PALS: SkyPaletteHex[] = [
  {
    top: "#3aa3ec",
    mid: "#79c7f4",
    bot: "#c9ecfb",
    sun: "#fff7c0",
    glow: "#ffe98a",
    glowA: 0.55,
    cloud: "#ffffff",
    cloudS: "#cfe6f5",
    mtn: "#ffffff",
    mtnS: "#c9d8e6",
    rock: "#8aa0b8",
    rockS: "#6f86a0",
    tree: "#2f7a3f",
    treeS: "#215a2d",
    grass: "#84d24a",
    grassS: "#6fbf3c",
    dirt: "#c99a54",
    dirtS: "#a97c3f",
    haze: "#e6f4ff",
    hazeA: 0.35,
  },
  {
    top: "#5a4fa8",
    mid: "#ff7f7a",
    bot: "#ffbe6a",
    sun: "#ffd679",
    glow: "#ff8746",
    glowA: 0.75,
    cloud: "#ffd9c6",
    cloudS: "#e996a0",
    mtn: "#ffd7dc",
    mtnS: "#d99cb0",
    rock: "#7a5688",
    rockS: "#5c3f6c",
    tree: "#2d4552",
    treeS: "#1f323d",
    grass: "#74ad42",
    grassS: "#619636",
    dirt: "#b58549",
    dirtS: "#946a37",
    haze: "#ff9e7a",
    hazeA: 0.35,
  },
  {
    top: "#170f45",
    mid: "#5b2d7e",
    bot: "#b8507e",
    sun: "#ffa07a",
    glow: "#c94d7e",
    glowA: 0.55,
    cloud: "#9a7cbb",
    cloudS: "#6a5292",
    mtn: "#8d7fb3",
    mtnS: "#6a5c92",
    rock: "#3b2c5b",
    rockS: "#2a1e44",
    tree: "#14222f",
    treeS: "#0d1720",
    grass: "#4b7f45",
    grassS: "#3e6d3a",
    dirt: "#7d5b3c",
    dirtS: "#62462d",
    haze: "#8a4d8e",
    hazeA: 0.3,
  },
  {
    top: "#04031a",
    mid: "#12133f",
    bot: "#25285e",
    sun: "#c9d6ff",
    glow: "#4a5aa8",
    glowA: 0.35,
    cloud: "#3a4171",
    cloudS: "#262b52",
    mtn: "#5f6a99",
    mtnS: "#454e78",
    rock: "#1f2240",
    rockS: "#151831",
    tree: "#0a131e",
    treeS: "#060c14",
    grass: "#2c503b",
    grassS: "#244330",
    dirt: "#4a3a2b",
    dirtS: "#382b1f",
    haze: "#1b2050",
    hazeA: 0.3,
  },
];

const PIPE_LABELS = [
  "CIRIL",
  "RIFSEEP",
  "CIA",
  "IFSE",
  "CGFP",
  "ARRÊTÉ",
  "CONGÉS",
  "CARRIÈRE",
  "MUTATION",
  "RETRAITE",
  "ÉCHELON",
  "INDICE",
];

const QUARTIER_SIGNS = [
  "HÔTEL DE VILLE",
  "LES AGNETTES",
  "LE LUTH",
  "CHANTERAINES",
  "LES SÉVINES",
  "GRÉSILLONS",
  "LE VILLAGE",
  "PORT 92230",
  "LOCAL CFDT",
];

const MILESTONE_CALLOUTS: Record<number, string> = {
  5: "CAP SUR LES AGNETTES !",
  10: "RIFSEEP REVALORISÉ !",
  15: "PARC DES CHANTERAINES !",
  20: "CFDT INTERCO 92 !",
  25: "PORT DE GENNEVILLIERS !",
  30: "ACQUIS PRÉSERVÉS !",
  40: "LÉGENDE DU 92230 !",
};

type MedalKind = "bronze" | "silver" | "gold" | "platinum";

const MEDALS: Record<
  MedalKind,
  { a: string; b: string; ring: string; label: string }
> = {
  bronze: {
    a: "#d08a4a",
    b: "#8a5024",
    ring: "#5a3010",
    label: "MILITANT 92",
  },
  silver: {
    a: "#e9eef5",
    b: "#9aa6b8",
    ring: "#5c6878",
    label: "DÉLÉGUÉ CFDT",
  },
  gold: {
    a: "#ffe66a",
    b: "#e0a000",
    ring: "#8a5a00",
    label: "EXPERT STATUT",
  },
  platinum: {
    a: "#e6fbff",
    b: "#7fd6ea",
    ring: "#2e7d95",
    label: "LÉGENDE 92230",
  },
};

const FEATHER_COLS = ["#ff7a1a", "#ffb100", "#ffd23f", "#fff1a8"];

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const TAU = Math.PI * 2;

function hexToRgb(h: string): Rgb {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}
function rgb(c: Rgb, a?: number): string {
  return a === undefined
    ? `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`
    : `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
}
function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const PALS_RGB: SkyPaletteRgb[] = PALS.map((p) => ({
  top: hexToRgb(p.top),
  mid: hexToRgb(p.mid),
  bot: hexToRgb(p.bot),
  sun: hexToRgb(p.sun),
  glow: hexToRgb(p.glow),
  glowA: p.glowA,
  cloud: hexToRgb(p.cloud),
  cloudS: hexToRgb(p.cloudS),
  mtn: hexToRgb(p.mtn),
  mtnS: hexToRgb(p.mtnS),
  rock: hexToRgb(p.rock),
  rockS: hexToRgb(p.rockS),
  tree: hexToRgb(p.tree),
  treeS: hexToRgb(p.treeS),
  grass: hexToRgb(p.grass),
  grassS: hexToRgb(p.grassS),
  dirt: hexToRgb(p.dirt),
  dirtS: hexToRgb(p.dirtS),
  haze: hexToRgb(p.haze),
  hazeA: p.hazeA,
}));

// Deterministic background layers
const STARS = Array.from({ length: 90 }, (_, i) => ({
  x: hash(i * 3.1) * W,
  y: hash(i * 7.7) * 360,
  r: 0.6 + hash(i * 1.3) * 1.3,
  tw: hash(i * 5.5) * TAU,
  sp: 1 + hash(i * 9.1) * 2.5,
}));

const CLOUD_SPAN = 900;
const CLOUDS = Array.from({ length: 9 }, (_, i) => ({
  x: hash(i * 11.3) * CLOUD_SPAN,
  y: 60 + hash(i * 4.7) * 210,
  s: 0.55 + hash(i * 2.9) * 0.8,
  v: 0.1 + hash(i * 6.1) * 0.08,
  seed: i,
}));

const MTN_PERIOD = 720;
const MTN_FAR: { x: number; w: number; h: number }[] = [];
const MTN_NEAR: { x: number; w: number; h: number }[] = [];
(() => {
  let x = 0;
  let i = 0;
  while (x < MTN_PERIOD) {
    const w = 130 + hash(i * 1.7 + 50) * 110;
    MTN_FAR.push({ x, w, h: 110 + hash(i * 2.3 + 60) * 90 });
    x += w * 0.72;
    i++;
  }
  x = -40;
  i = 0;
  while (x < MTN_PERIOD) {
    const w = 150 + hash(i * 1.9 + 80) * 120;
    MTN_NEAR.push({ x, w, h: 70 + hash(i * 2.7 + 90) * 70 });
    x += w * 0.68;
    i++;
  }
})();

// Silhouette urbaine de Gennevilliers (Mairie, Port, Luth, Grésillons)
const CITY_PERIOD = 640;
interface CityBuilding {
  x: number;
  w: number;
  h: number;
  kind: "mairie" | "crane" | "tower" | "block";
}
const CITY_SKYLINE: CityBuilding[] = [
  { x: 24, w: 34, h: 62, kind: "block" },
  { x: 64, w: 42, h: 118, kind: "mairie" }, // Tour de l'Hôtel de Ville de Gennevilliers
  { x: 114, w: 36, h: 52, kind: "block" },
  { x: 178, w: 46, h: 86, kind: "crane" }, // Port de Gennevilliers
  { x: 248, w: 48, h: 74, kind: "tower" }, // Le Luth
  { x: 304, w: 34, h: 56, kind: "block" },
  { x: 358, w: 38, h: 82, kind: "tower" }, // Les Agnettes
  { x: 424, w: 44, h: 78, kind: "crane" }, // Grésillons / Port
  { x: 496, w: 40, h: 68, kind: "tower" },
  { x: 548, w: 50, h: 48, kind: "block" },
];

const TREE_PERIOD = 480;
const TREES: { x: number; h: number; w: number }[] = [];
(() => {
  let x = 0;
  let i = 0;
  while (x < TREE_PERIOD) {
    TREES.push({
      x,
      h: 34 + hash(i * 3.3 + 120) * 42,
      w: 16 + hash(i * 1.1 + 130) * 12,
    });
    x += 14 + hash(i * 4.4 + 140) * 12;
    i++;
  }
})();

const FLIES = Array.from({ length: 22 }, (_, i) => ({
  x: hash(i * 8.3 + 200) * W,
  y: GROUND_Y - 10 - hash(i * 3.7 + 210) * 90,
  ph: hash(i * 2.2 + 220) * TAU,
  sp: 0.6 + hash(i * 5.1 + 230) * 1.2,
  amp: 6 + hash(i * 6.6 + 240) * 10,
}));

interface PipeItem {
  x: number;
  gapY: number;
  gapH: number;
  passed: boolean;
  wobble: number;
  labelTop: string;
  labelBot: string;
}

interface FeatherParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  life: number;
  max: number;
  s: number;
  col: string;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  s: number;
}

interface RingEffect {
  x: number;
  y: number;
  life: number;
  max: number;
}

interface PopupEffect {
  text: string;
  x: number;
  y: number;
  life: number;
  max: number;
  col: string;
  size: number;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  ready?: boolean;
}

const FlappyAgent: React.FC<FlappyAgentProps> = ({ onClose }) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(MUTE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [restartToken, setRestartToken] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mutedRef = useRef<boolean>(isMuted);

  useEffect(() => {
    mutedRef.current = isMuted;
    try {
      localStorage.setItem(MUTE_KEY, isMuted ? "1" : "0");
    } catch {
      // ignore storage errors
    }
  }, [isMuted]);

  useEffect(() => {
    const onFsChange = () => {
      const d = document as Document & {
        webkitFullscreenElement?: Element | null;
      };
      setIsFullscreen(Boolean(d.fullscreenElement || d.webkitFullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current as
      | (HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> })
      | null;
    const d = document as Document & {
      webkitExitFullscreen?: () => Promise<void>;
      webkitFullscreenElement?: Element | null;
    };
    if (!el) return;
    try {
      if (d.fullscreenElement || d.webkitFullscreenElement) {
        if (d.exitFullscreen) await d.exitFullscreen();
        else if (d.webkitExitFullscreen) await d.webkitExitFullscreen();
      } else {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      }
    } catch {
      // Fullscreen API unavailable on some mobile webviews
    }
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !stage || !canvas) return;
    const ctxOrNull = canvas.getContext("2d");
    if (!ctxOrNull) return;
    const ctx: CanvasRenderingContext2D = ctxOrNull;

    // Sizing: fit 9:16 portrait stage cleanly inside available wrapper
    function resize() {
      if (!wrap || !stage || !canvas) return;
      const rect = wrap.getBoundingClientRect();
      const vw = Math.max(240, rect.width - 16);
      const vh = Math.max(360, rect.height - 16);
      let cw: number;
      let ch: number;
      if (vw / vh < W / H) {
        cw = vw;
        ch = (vw * H) / W;
      } else {
        ch = vh;
        cw = (vh * W) / H;
      }
      cw = Math.floor(cw);
      ch = Math.floor(ch);
      stage.style.width = `${cw}px`;
      stage.style.height = `${ch}px`;
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    window.addEventListener("resize", resize);
    resize();

    // Synthesized Web Audio engine from fable-arcade/flappy-bird
    let ac: AudioContext | null = null;
    let master: GainNode | null = null;
    function ensureAudio(): AudioContext | null {
      if (mutedRef.current) return null;
      if (!ac) {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!AC) return null;
        ac = new AC();
        master = ac.createGain();
        master.gain.value = 0.5;
        master.connect(ac.destination);
      }
      if (ac.state === "suspended") ac.resume();
      return ac;
    }

    function tone(
      type: OscillatorType,
      f0: number,
      f1: number,
      t0: number,
      dur: number,
      vol: number,
      curve?: number
    ) {
      if (!ac || !master) return;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f0, t0);
      if (f1 !== f0) {
        o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
      }
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol, t0 + (curve || 0.008));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g);
      g.connect(master);
      o.start(t0);
      o.stop(t0 + dur + 0.02);
    }

    function noise(
      t0: number,
      dur: number,
      vol: number,
      hp?: number,
      lp?: number
    ) {
      if (!ac || !master) return;
      const n = Math.floor(ac.sampleRate * dur);
      const buf = ac.createBuffer(1, n, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      const src = ac.createBufferSource();
      src.buffer = buf;
      const g = ac.createGain();
      g.gain.setValueAtTime(vol, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      let node: AudioNode = src;
      if (hp) {
        const f = ac.createBiquadFilter();
        f.type = "highpass";
        f.frequency.value = hp;
        node.connect(f);
        node = f;
      }
      if (lp) {
        const f = ac.createBiquadFilter();
        f.type = "lowpass";
        f.frequency.value = lp;
        node.connect(f);
        node = f;
      }
      node.connect(g);
      g.connect(master);
      src.start(t0);
      src.stop(t0 + dur);
    }

    const Sound = {
      unlock() {
        ensureAudio();
      },
      flap() {
        const ctxAudio = ensureAudio();
        if (!ctxAudio) return;
        const t = ctxAudio.currentTime;
        tone("triangle", 520, 880, t, 0.09, 0.28, 0.01);
        noise(t, 0.08, 0.12, 1800, 6000);
      },
      score() {
        const ctxAudio = ensureAudio();
        if (!ctxAudio) return;
        const t = ctxAudio.currentTime;
        tone("square", 1046, 1046, t, 0.07, 0.12);
        tone("square", 1568, 1568, t + 0.07, 0.12, 0.12);
        tone("sine", 2093, 2093, t + 0.07, 0.16, 0.08);
      },
      hit() {
        const ctxAudio = ensureAudio();
        if (!ctxAudio) return;
        const t = ctxAudio.currentTime;
        noise(t, 0.22, 0.6, 80, 1200);
        tone("sawtooth", 180, 40, t, 0.28, 0.35, 0.005);
        tone("square", 90, 30, t + 0.02, 0.3, 0.2, 0.005);
      },
      swoosh() {
        const ctxAudio = ensureAudio();
        if (!ctxAudio) return;
        const t = ctxAudio.currentTime;
        noise(t, 0.32, 0.22, 400, 4000);
        tone("sine", 300, 900, t, 0.3, 0.05, 0.1);
      },
      thud() {
        const ctxAudio = ensureAudio();
        if (!ctxAudio) return;
        const t = ctxAudio.currentTime;
        noise(t, 0.15, 0.3, 40, 500);
        tone("sine", 120, 40, t, 0.2, 0.3, 0.005);
      },
      medal() {
        const ctxAudio = ensureAudio();
        if (!ctxAudio) return;
        const t = ctxAudio.currentTime;
        const seq = [523, 659, 784, 1046, 784, 1046, 1318];
        seq.forEach((f, i) => {
          const st = t + i * 0.085;
          tone("square", f, f, st, 0.16, 0.1);
          tone("triangle", f * 2, f * 2, st, 0.14, 0.05);
        });
        tone("sine", 2637, 2637, t + seq.length * 0.085, 0.5, 0.08, 0.05);
      },
      newBest() {
        const ctxAudio = ensureAudio();
        if (!ctxAudio) return;
        const t = ctxAudio.currentTime;
        [784, 988, 1175, 1568].forEach((f, i) =>
          tone("square", f, f, t + i * 0.06, 0.2, 0.09)
        );
        noise(t, 0.25, 0.08, 3000, 9000);
      },
    };

    // Palette blending
    const PAL: SkyPaletteRgb = { ...PALS_RGB[0] };
    let dayT = 0;

    function blendPalette(t: number) {
      const seg = clamp(t, 0, 0.9999) * (PALS_RGB.length - 1);
      const i = Math.floor(seg);
      const f = smooth(seg - i);
      const a = PALS_RGB[i];
      const b = PALS_RGB[Math.min(i + 1, PALS_RGB.length - 1)];
      PAL.top = mixRgb(a.top, b.top, f);
      PAL.mid = mixRgb(a.mid, b.mid, f);
      PAL.bot = mixRgb(a.bot, b.bot, f);
      PAL.sun = mixRgb(a.sun, b.sun, f);
      PAL.glow = mixRgb(a.glow, b.glow, f);
      PAL.glowA = lerp(a.glowA, b.glowA, f);
      PAL.cloud = mixRgb(a.cloud, b.cloud, f);
      PAL.cloudS = mixRgb(a.cloudS, b.cloudS, f);
      PAL.mtn = mixRgb(a.mtn, b.mtn, f);
      PAL.mtnS = mixRgb(a.mtnS, b.mtnS, f);
      PAL.rock = mixRgb(a.rock, b.rock, f);
      PAL.rockS = mixRgb(a.rockS, b.rockS, f);
      PAL.tree = mixRgb(a.tree, b.tree, f);
      PAL.treeS = mixRgb(a.treeS, b.treeS, f);
      PAL.grass = mixRgb(a.grass, b.grass, f);
      PAL.grassS = mixRgb(a.grassS, b.grassS, f);
      PAL.dirt = mixRgb(a.dirt, b.dirt, f);
      PAL.dirtS = mixRgb(a.dirtS, b.dirtS, f);
      PAL.haze = mixRgb(a.haze, b.haze, f);
      PAL.hazeA = lerp(a.hazeA, b.hazeA, f);
    }
    blendPalette(0);

    function roundRect(
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function chunkyText(
      txt: string,
      x: number,
      y: number,
      size: number,
      fill: string,
      stroke: string,
      lw: number,
      align: CanvasTextAlign = "center"
    ) {
      ctx.font = `bold ${size}px ${FONT}`;
      ctx.textAlign = align;
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.lineWidth = lw;
      ctx.strokeStyle = stroke;
      ctx.strokeText(txt, x, y);
      ctx.fillStyle = fill;
      ctx.fillText(txt, x, y);
    }

    // Persistent best score
    let best = 0;
    try {
      best = parseInt(localStorage.getItem(BEST_KEY) || "0", 10) || 0;
    } catch {
      best = 0;
    }
    function saveBest() {
      try {
        localStorage.setItem(BEST_KEY, String(best));
      } catch {
        // ignore storage errors
      }
    }

    const G = {
      state: "menu" as "menu" | "ready" | "playing" | "dying" | "over",
      paused: false,
      time: 0,
      dist: 0,
      runDist: 0,
      skyT: 0,
      score: 0,
      pipeCount: 0,
      newBest: false,
      bannerT: 0,
      pillPop: 0,
      scorePop: 0,
      hitstop: 0,
      flash: 0,
      shake: 0,
      shakeX: 0,
      shakeY: 0,
      overT: 0,
      medalPlayed: false,
      stateT: 0,
      pipes: [] as PipeItem[],
      feathers: [] as FeatherParticle[],
      sparks: [] as SparkParticle[],
      rings: [] as RingEffect[],
      popups: [] as PopupEffect[],
      landed: false,
      pauseBtn: { x: W - 44, y: 18, w: 34, h: 34 } as Rect,
      retryBtn: null as Rect | null,
    };

    const bird = {
      x: BIRD_X,
      y: 300,
      vy: 0,
      rot: 0,
      wing: 0,
      flapT: 0,
      hover: 0,
      blink: 0,
    };

    function setState(s: typeof G.state) {
      G.state = s;
      G.stateT = 0;
    }

    function resetRun() {
      G.pipes.length = 0;
      G.feathers.length = 0;
      G.sparks.length = 0;
      G.rings.length = 0;
      G.popups.length = 0;
      G.score = 0;
      G.pipeCount = 0;
      G.newBest = false;
      G.bannerT = 0;
      G.pillPop = 0;
      G.scorePop = 0;
      G.hitstop = 0;
      G.flash = 0;
      G.shake = 0;
      G.overT = 0;
      G.medalPlayed = false;
      G.landed = false;
      G.runDist = 0;
      bird.y = 300;
      bird.vy = 0;
      bird.rot = 0;
      bird.wing = 0;
      bird.flapT = 0;
    }

    function spawnPipe(x: number) {
      const prev = G.pipes[G.pipes.length - 1];
      const n = G.score + G.pipes.length;
      const gapH = clamp(GAP_MAX - n * 1.1, GAP_MIN, GAP_MAX);
      const minC = 70 + gapH / 2;
      const maxC = GROUND_Y - 40 - gapH / 2;
      let c = rand(minC, maxC);
      if (prev) {
        const maxDelta = 150;
        c = clamp(c, prev.gapY - maxDelta, prev.gapY + maxDelta);
        c = clamp(c, minC, maxC);
      }
      const idx = G.pipeCount++;
      G.pipes.push({
        x,
        gapY: c,
        gapH,
        passed: false,
        wobble: 0,
        labelTop: PIPE_LABELS[(idx * 2) % PIPE_LABELS.length],
        labelBot: PIPE_LABELS[(idx * 2 + 1) % PIPE_LABELS.length],
      });
    }

    function updatePipes() {
      const dx = SCROLL * STEP;
      for (const p of G.pipes) p.x -= dx;
      while (G.pipes.length && G.pipes[0].x + PIPE_W < -10) G.pipes.shift();
      const last = G.pipes[G.pipes.length - 1];
      if (!last) {
        if (G.runDist > 40) spawnPipe(W + 60);
      } else if (last.x < W + 60 - PIPE_SPACING) {
        spawnPipe(last.x + PIPE_SPACING);
      }
    }

    function pipeHit(p: PipeItem): boolean {
      const r = BIRD_R - 2;
      const bx = bird.x;
      const by = bird.y;
      const cx = clamp(bx, p.x, p.x + PIPE_W);
      const top = p.gapY - p.gapH / 2;
      const bot = p.gapY + p.gapH / 2;
      let cy = clamp(by, -1000, top);
      if ((bx - cx) ** 2 + (by - cy) ** 2 < r * r) return true;
      cy = clamp(by, bot, 10000);
      return (bx - cx) ** 2 + (by - cy) ** 2 < r * r;
    }

    function emitFeathers(
      n: number,
      x: number,
      y: number,
      spread: number,
      up = 0
    ) {
      for (let i = 0; i < n; i++) {
        const a = rand(0, TAU);
        const sp = rand(30, spread);
        G.feathers.push({
          x: x + rand(-6, 6),
          y: y + rand(-6, 6),
          vx: Math.cos(a) * sp - 40,
          vy: Math.sin(a) * sp - up,
          rot: rand(0, TAU),
          vr: rand(-6, 6),
          life: 0,
          max: rand(0.7, 1.4),
          s: rand(3, 5.5),
          col: FEATHER_COLS[(Math.random() * FEATHER_COLS.length) | 0],
        });
      }
    }

    function emitSparkles(x: number, y: number) {
      G.rings.push({ x, y, life: 0, max: 0.5 });
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * TAU + rand(-0.2, 0.2);
        const sp = rand(60, 130);
        G.sparks.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0,
          max: rand(0.35, 0.6),
          s: rand(2, 3.5),
        });
      }
    }

    function popup(
      text: string,
      x: number,
      y: number,
      col = "#ffffff",
      size = 24
    ) {
      G.popups.push({ text, x, y, life: 0, max: size < 20 ? 1.25 : 0.8, col, size });
    }

    function updateParticles(dt: number) {
      for (let i = G.feathers.length - 1; i >= 0; i--) {
        const f = G.feathers[i];
        f.life += dt;
        if (f.life > f.max) {
          G.feathers.splice(i, 1);
          continue;
        }
        f.vy += 220 * dt;
        f.vx *= 0.985;
        f.vy *= 0.985;
        f.x += (f.vx + Math.sin(f.life * 9 + f.rot) * 40) * dt;
        f.y += f.vy * dt;
        f.rot += f.vr * dt;
      }
      for (let i = G.sparks.length - 1; i >= 0; i--) {
        const s = G.sparks[i];
        s.life += dt;
        if (s.life > s.max) {
          G.sparks.splice(i, 1);
          continue;
        }
        s.x += (s.vx - SCROLL * 0.6) * dt;
        s.y += s.vy * dt;
        s.vx *= 0.94;
        s.vy *= 0.94;
      }
      for (let i = G.rings.length - 1; i >= 0; i--) {
        const r = G.rings[i];
        r.life += dt;
        r.x -= SCROLL * 0.6 * dt;
        if (r.life > r.max) G.rings.splice(i, 1);
      }
      for (let i = G.popups.length - 1; i >= 0; i--) {
        const p = G.popups[i];
        p.life += dt;
        p.y -= 50 * dt;
        if (p.life > p.max) G.popups.splice(i, 1);
      }
    }

    function flap() {
      bird.vy = FLAP_V;
      bird.flapT = 0.22;
      Sound.flap();
      emitFeathers(3, bird.x - 8, bird.y + 4, 70, 20);
    }

    function startRun() {
      resetRun();
      setState("ready");
      Sound.swoosh();
    }

    function beginPlay() {
      setState("playing");
      flap();
    }

    function die() {
      setState("dying");
      Sound.hit();
      G.hitstop = 0.09;
      G.flash = 1;
      G.shake = 12;
      emitFeathers(14, bird.x, bird.y, 200, 60);
      bird.vy = -260;
      G.rings.length = 0;
    }

    function medalFor(sc: number): MedalKind | null {
      return sc >= 40
        ? "platinum"
        : sc >= 30
        ? "gold"
        : sc >= 20
        ? "silver"
        : sc >= 10
        ? "bronze"
        : null;
    }

    function onScore() {
      G.score++;
      G.scorePop = 1;
      Sound.score();
      popup("+1", bird.x + 26, bird.y - 22, "#ffffff", 24);
      const callout = MILESTONE_CALLOUTS[G.score];
      if (callout) {
        popup(callout, W / 2, 152, "#ffd83d", 16);
      }
      emitSparkles(bird.x + 16, bird.y);
      if (G.score > best) {
        best = G.score;
        saveBest();
        if (!G.newBest) {
          G.newBest = true;
          G.bannerT = 2.2;
          G.pillPop = 1;
          Sound.newBest();
        }
      }
    }

    function step() {
      const dt = STEP;
      G.time += dt;
      G.stateT += dt;
      if (G.bannerT > 0) G.bannerT -= dt;
      G.pillPop = Math.max(0, G.pillPop - dt * 2.2);
      G.scorePop = Math.max(0, G.scorePop - dt * 4);
      G.flash = Math.max(0, G.flash - dt * 3.2);
      if (G.shake > 0) {
        G.shake = Math.max(0, G.shake - dt * 28);
        G.shakeX = rand(-G.shake, G.shake);
        G.shakeY = rand(-G.shake, G.shake);
      } else {
        G.shakeX = 0;
        G.shakeY = 0;
      }
      bird.blink -= dt;
      if (bird.blink < -0.12) bird.blink = rand(1.5, 4);

      const targetT =
        G.state === "menu"
          ? 0
          : clamp(G.runDist / (PIPE_SPACING * DAY_PIPES + 250), 0, 1);
      G.skyT += (targetT - G.skyT) * Math.min(1, dt * 6);
      dayT = G.skyT;
      blendPalette(dayT);

      if (G.hitstop > 0) {
        G.hitstop -= dt;
        return;
      }
      updateParticles(dt);

      const s = G.state;
      if (s === "menu" || s === "ready") {
        G.dist += SCROLL * dt;
        bird.hover += dt;
        bird.y = 300 + Math.sin(bird.hover * 3.2) * 7;
        bird.rot = Math.sin(bird.hover * 3.2 + 0.6) * 0.08;
        bird.wing += dt * 10;
        if (s === "menu") bird.x = W / 2 - 4;
        else bird.x += (BIRD_X - bird.x) * Math.min(1, dt * 6);
        return;
      }
      if (s === "playing") {
        G.dist += SCROLL * dt;
        G.runDist += SCROLL * dt;
        bird.vy = Math.min(MAX_FALL, bird.vy + GRAVITY * dt);
        bird.y += bird.vy * dt;
        bird.flapT = Math.max(0, bird.flapT - dt);
        bird.wing += dt * (bird.flapT > 0 ? 34 : 10);
        const targetRot =
          bird.vy < 0
            ? lerp(-0.45, 0, clamp((bird.vy + 400) / 400, 0, 1))
            : lerp(0, 1.45, clamp((bird.vy - 60) / 480, 0, 1));
        bird.rot += (targetRot - bird.rot) * Math.min(1, dt * (bird.vy < 0 ? 18 : 6));
        if (bird.y < -20) {
          bird.y = -20;
          bird.vy = Math.max(bird.vy, 0);
        }
        updatePipes();
        for (const p of G.pipes) {
          if (!p.passed && p.x + PIPE_W < bird.x) {
            p.passed = true;
            p.wobble = 1;
            onScore();
          }
          if (p.wobble > 0) p.wobble = Math.max(0, p.wobble - dt * 3);
          if (pipeHit(p)) {
            die();
            return;
          }
        }
        if (bird.y + BIRD_R >= GROUND_Y) {
          bird.y = GROUND_Y - BIRD_R;
          die();
          G.landed = true;
        }
        return;
      }
      if (s === "dying") {
        if (!G.landed) {
          bird.vy = Math.min(MAX_FALL, bird.vy + GRAVITY * dt);
          bird.y += bird.vy * dt;
          bird.rot += dt * 7;
          if (bird.y + BIRD_R >= GROUND_Y) {
            bird.y = GROUND_Y - BIRD_R;
            G.landed = true;
            bird.rot = Math.PI / 2 + 0.3;
            Sound.thud();
            G.shake = 5;
            emitFeathers(10, bird.x, bird.y + 6, 120, 90);
          }
        }
        if (G.landed && G.stateT > 0.75) {
          setState("over");
          Sound.swoosh();
        }
        return;
      }
      if (s === "over") {
        G.overT += dt;
        const medal = medalFor(G.score);
        if (medal && !G.medalPlayed && G.overT > 0.75) {
          G.medalPlayed = true;
          Sound.medal();
          emitSparkles(W / 2 - 78, 318);
        }
      }
    }

    // Scenery rendering
    function drawSky(time: number) {
      const g = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      g.addColorStop(0, rgb(PAL.top));
      g.addColorStop(0.55, rgb(PAL.mid));
      g.addColorStop(1, rgb(PAL.bot));
      ctx.fillStyle = g;
      ctx.fillRect(-20, -20, W + 40, H + 40);

      const starA = clamp((dayT - 0.58) / 0.42, 0, 1);
      if (starA > 0) {
        for (const s of STARS) {
          const tw = 0.55 + 0.45 * Math.sin(time * s.sp + s.tw);
          ctx.fillStyle = `rgba(255,255,255,${(starA * tw * 0.95).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, TAU);
          ctx.fill();
        }
        ctx.strokeStyle = `rgba(255,255,255,${(starA * 0.7).toFixed(3)})`;
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
          const s = STARS[i * 7];
          const r = 3 + Math.sin(time * 2 + i) * 1.2;
          ctx.beginPath();
          ctx.moveTo(s.x - r, s.y);
          ctx.lineTo(s.x + r, s.y);
          ctx.moveTo(s.x, s.y - r);
          ctx.lineTo(s.x, s.y + r);
          ctx.stroke();
        }
      }

      const sunT = clamp(dayT / 0.78, 0, 1);
      const sx = lerp(250, 70, sunT);
      const sy = lerp(110, 455, smooth(sunT));
      const sunA = 1 - clamp((dayT - 0.66) / 0.14, 0, 1);
      if (sunA > 0) {
        const gr = ctx.createRadialGradient(sx, sy, 10, sx, sy, 190);
        gr.addColorStop(0, rgb(PAL.glow, PAL.glowA * sunA));
        gr.addColorStop(0.4, rgb(PAL.glow, PAL.glowA * 0.35 * sunA));
        gr.addColorStop(1, rgb(PAL.glow, 0));
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, W, GROUND_Y);
        ctx.fillStyle = rgb(PAL.sun, sunA);
        ctx.beginPath();
        ctx.arc(sx, sy, 30 + 6 * sunT, 0, TAU);
        ctx.fill();
      }

      const moonA = clamp((dayT - 0.68) / 0.3, 0, 1);
      if (moonA > 0) {
        const mx = 280;
        const my = lerp(470, 96, smooth(moonA));
        const gr = ctx.createRadialGradient(mx, my, 20, mx, my, 150);
        gr.addColorStop(0, `rgba(200,215,255,${0.35 * moonA})`);
        gr.addColorStop(1, "rgba(200,215,255,0)");
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, W, GROUND_Y);
        ctx.save();
        ctx.beginPath();
        ctx.arc(mx, my, 26, 0, TAU);
        ctx.clip();
        ctx.beginPath();
        ctx.arc(mx, my, 26, 0, TAU);
        ctx.arc(mx + 15, my - 11, 22, 0, TAU, true);
        ctx.clip();
        ctx.fillStyle = `rgba(245,247,255,${moonA})`;
        ctx.fillRect(mx - 30, my - 30, 60, 60);
        ctx.fillStyle = `rgba(210,218,240,${moonA})`;
        for (const [dx, dy, r] of [
          [-10, -4, 5],
          [2, 10, 6],
          [-4, 14, 2.5],
          [-14, 8, 3],
        ]) {
          ctx.beginPath();
          ctx.arc(mx + dx, my + dy, r, 0, TAU);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    function drawCloud(cx: number, cy: number, s: number) {
      const puffs: [number, number, number][] = [
        [0, 0, 22],
        [-22, 6, 15],
        [22, 6, 16],
        [-8, -10, 14],
        [10, -8, 13],
        [-34, 10, 9],
        [34, 10, 10],
      ];
      ctx.fillStyle = rgb(PAL.cloudS);
      ctx.beginPath();
      for (const [dx, dy, r] of puffs) {
        ctx.moveTo(cx + (dx + r) * s, cy + (dy + 4) * s);
        ctx.arc(cx + dx * s, cy + (dy + 4) * s, r * s, 0, TAU);
      }
      ctx.fill();
      ctx.fillStyle = rgb(PAL.cloud);
      ctx.beginPath();
      for (const [dx, dy, r] of puffs) {
        ctx.moveTo(cx + (dx + r) * s, cy + dy * s);
        ctx.arc(cx + dx * s, cy + dy * s, r * s, 0, TAU);
      }
      ctx.fill();
    }

    function drawClouds(dist: number, time: number) {
      for (const c of CLOUDS) {
        const x =
          (((c.x - dist * c.v) % CLOUD_SPAN) + CLOUD_SPAN) % CLOUD_SPAN - 120;
        const y = c.y + Math.sin(time * 0.5 + c.seed) * 3;
        drawCloud(x, y, c.s);
        if (x > CLOUD_SPAN - 240) drawCloud(x - CLOUD_SPAN, y, c.s);
      }
    }

    function drawMountainLayer(
      list: { x: number; w: number; h: number }[],
      dist: number,
      speed: number,
      baseY: number,
      snowCol: string,
      rockCol: string,
      rockShade: string
    ) {
      const off = (((dist * speed) % MTN_PERIOD) + MTN_PERIOD) % MTN_PERIOD;
      for (let k = -1; k <= 1; k++) {
        for (const m of list) {
          const x0 = m.x - off + k * MTN_PERIOD;
          if (x0 + m.w < -10 || x0 > W + 10) continue;
          const px = x0 + m.w * 0.5;
          const py = baseY - m.h;
          ctx.fillStyle = rockCol;
          ctx.beginPath();
          ctx.moveTo(x0, baseY);
          ctx.lineTo(px, py);
          ctx.lineTo(x0 + m.w, baseY);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = rockShade;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(x0 + m.w, baseY);
          ctx.lineTo(px + m.w * 0.08, baseY);
          ctx.closePath();
          ctx.fill();
          const sh = m.h * 0.38;
          const sw = m.w * 0.5 * (sh / m.h);
          ctx.fillStyle = snowCol;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + sw, py + sh);
          ctx.lineTo(px + sw * 0.6, py + sh * 0.8);
          ctx.lineTo(px + sw * 0.25, py + sh * 1.05);
          ctx.lineTo(px - sw * 0.2, py + sh * 0.85);
          ctx.lineTo(px - sw * 0.6, py + sh * 1.0);
          ctx.lineTo(px - sw, py + sh);
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    function drawMountains(dist: number) {
      drawMountainLayer(
        MTN_FAR,
        dist,
        0.22,
        470,
        rgb(PAL.mtn),
        rgb(PAL.rock),
        rgb(PAL.rockS)
      );
      const hz = ctx.createLinearGradient(0, 290, 0, 470);
      hz.addColorStop(0, rgb(PAL.haze, 0));
      hz.addColorStop(1, rgb(PAL.haze, PAL.hazeA));
      ctx.fillStyle = hz;
      ctx.fillRect(0, 290, W, 180);
      drawMountainLayer(
        MTN_NEAR,
        dist,
        0.36,
        490,
        rgb(PAL.mtnS),
        rgb(PAL.rockS),
        rgb(PAL.rock)
      );
    }

    // Silhouette en parallaxe de Gennevilliers (Tour de la Mairie, Port, Luth, Agnettes)
    function drawGennevilliersSkyline(dist: number) {
      const off = (((dist * 0.44) % CITY_PERIOD) + CITY_PERIOD) % CITY_PERIOD;
      const baseY = GROUND_Y - 12;
      const silCol = rgb(mixRgb(PAL.rockS, PAL.treeS, 0.55), 0.92);
      const accentCol = rgb(mixRgb(PAL.rock, PAL.tree, 0.4), 0.9);
      const winAlpha = clamp((dayT - 0.32) / 0.5, 0, 0.85);

      for (let k = -1; k <= 1; k++) {
        for (const b of CITY_SKYLINE) {
          const x = b.x - off + k * CITY_PERIOD;
          if (x + b.w < -40 || x > W + 40) continue;
          const topY = baseY - b.h;

          if (b.kind === "crane") {
            // Grue portuaire du Port de Gennevilliers
            ctx.strokeStyle = silCol;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(x + 8, baseY);
            ctx.lineTo(x + 14, topY);
            ctx.lineTo(x + 22, baseY);
            ctx.moveTo(x - 10, topY + 8);
            ctx.lineTo(x + b.w + 12, topY - 4);
            ctx.moveTo(x + 14, topY);
            ctx.lineTo(x + b.w + 6, topY - 2);
            ctx.moveTo(x + b.w + 4, topY - 2);
            ctx.lineTo(x + b.w + 4, topY + 20);
            ctx.stroke();
            // Hangar portuaire au pied
            ctx.fillStyle = silCol;
            ctx.fillRect(x, baseY - 26, b.w, 26);
          } else if (b.kind === "mairie") {
            // Tour emblématique de l'Hôtel de Ville de Gennevilliers
            ctx.fillStyle = silCol;
            ctx.fillRect(x, topY + 12, b.w, b.h - 12);
            ctx.fillStyle = accentCol;
            ctx.fillRect(x + 5, topY, b.w - 10, 14);
            // Antenne & fanion orange CFDT au sommet
            ctx.strokeStyle = silCol;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + b.w / 2, topY);
            ctx.lineTo(x + b.w / 2, topY - 16);
            ctx.stroke();
            ctx.fillStyle = "#ff7a1a";
            ctx.beginPath();
            ctx.moveTo(x + b.w / 2, topY - 16);
            ctx.lineTo(x + b.w / 2 + 12, topY - 12);
            ctx.lineTo(x + b.w / 2, topY - 8);
            ctx.closePath();
            ctx.fill();
            // Bandeau "92230" illuminé
            ctx.fillStyle =
              dayT > 0.35 ? "rgba(255,155,50,0.92)" : "rgba(255,255,255,0.75)";
            ctx.font = `bold 7px ${FONT}`;
            ctx.textAlign = "center";
            ctx.fillText("MAIRIE", x + b.w / 2, topY + 8);
            if (winAlpha > 0.05) {
              ctx.fillStyle = `rgba(255,220,130,${winAlpha.toFixed(2)})`;
              for (let r = 0; r < 6; r++) {
                for (let c = 0; c < 3; c++) {
                  if (((r + c) & 1) === 0) {
                    ctx.fillRect(x + 7 + c * 10, topY + 20 + r * 13, 5, 6);
                  }
                }
              }
            }
          } else {
            ctx.fillStyle = silCol;
            ctx.fillRect(x, topY, b.w, b.h);
            if (b.kind === "tower") {
              ctx.fillStyle = accentCol;
              ctx.fillRect(x + 4, topY - 5, b.w - 8, 5);
            }
            if (winAlpha > 0.05) {
              ctx.fillStyle = `rgba(255,215,120,${(winAlpha * 0.8).toFixed(2)})`;
              const rows = Math.floor((b.h - 14) / 13);
              const cols = Math.max(2, Math.floor((b.w - 8) / 10));
              for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                  if (hash(b.x + r * 7 + c * 13) > 0.42) {
                    ctx.fillRect(x + 6 + c * 10, topY + 8 + r * 13, 4, 5);
                  }
                }
              }
            }
          }
        }
      }
    }

    function drawTrees(dist: number) {
      const off = (((dist * 0.55) % TREE_PERIOD) + TREE_PERIOD) % TREE_PERIOD;
      const baseY = GROUND_Y + 4;
      ctx.fillStyle = rgb(PAL.treeS);
      ctx.fillRect(0, baseY - 22, W, 22);
      for (let k = 0; k <= 1; k++) {
        for (const t of TREES) {
          const x = t.x - off + k * TREE_PERIOD;
          if (x < -30 || x > W + 30) continue;
          const tiers = 3;
          for (let i = 0; i < tiers; i++) {
            const f = i / tiers;
            const top = baseY - t.h + f * t.h * 0.55;
            const w = t.w * (0.55 + f * 0.6);
            const hh = t.h * 0.45;
            ctx.fillStyle = rgb(i % 2 ? PAL.treeS : PAL.tree);
            ctx.beginPath();
            ctx.moveTo(x, top);
            ctx.lineTo(x + w, top + hh);
            ctx.lineTo(x - w, top + hh);
            ctx.closePath();
            ctx.fill();
          }
        }
      }
    }

    // Petits panneaux municipaux des quartiers de Gennevilliers au bord du sol
    function drawNeighborhoodSigns(dist: number) {
      const span = 290;
      const firstIdx = Math.floor(dist / span);
      for (let k = firstIdx; k <= firstIdx + 2; k++) {
        const sx = k * span - dist + 140;
        if (sx < -60 || sx > W + 60) continue;
        const label =
          QUARTIER_SIGNS[
            ((k % QUARTIER_SIGNS.length) + QUARTIER_SIGNS.length) %
              QUARTIER_SIGNS.length
          ];
        const isCfdt = label.includes("CFDT");
        // Poteau
        ctx.fillStyle = "#5a4228";
        ctx.fillRect(sx - 2, GROUND_Y - 22, 4, 24);
        // Plaque
        ctx.font = `bold 8px ${FONT}`;
        const pw = Math.max(54, ctx.measureText(label).width + 12);
        roundRect(sx - pw / 2, GROUND_Y - 34, pw, 15, 4);
        ctx.fillStyle = isCfdt ? "#ea580c" : "#1e3a8a";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, sx, GROUND_Y - 26.2);
      }
    }

    function drawGround(dist: number) {
      const gh = H - GROUND_Y;
      ctx.fillStyle = rgb(PAL.dirt);
      ctx.fillRect(-20, GROUND_Y, W + 40, gh + 20);
      ctx.fillStyle = rgb(PAL.dirtS);
      const off2 = ((dist % 40) + 40) % 40;
      for (let x = -40 - off2; x < W + 40; x += 40) {
        ctx.fillRect(x + 6, GROUND_Y + 34, 18, 4);
        ctx.fillRect(x + 26, GROUND_Y + 52, 10, 4);
        ctx.fillRect(x, GROUND_Y + 68, 14, 3);
      }
      const gy = GROUND_Y;
      const gH = 22;
      ctx.fillStyle = rgb(PAL.grass);
      ctx.fillRect(0, gy, W, gH);
      ctx.fillStyle = rgb(PAL.grassS);
      const off = ((dist % 28) + 28) % 28;
      ctx.beginPath();
      for (let x = -28 - off; x < W + 28; x += 28) {
        ctx.moveTo(x, gy);
        ctx.lineTo(x + 14, gy);
        ctx.lineTo(x + 6, gy + gH);
        ctx.lineTo(x - 8, gy + gH);
        ctx.closePath();
      }
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.fillRect(0, gy, W, 3);
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(0, gy + gH, W, 3);
    }

    function drawFireflies(time: number) {
      const a = clamp((dayT - 0.62) / 0.38, 0, 1);
      if (a <= 0) return;
      for (const f of FLIES) {
        const x = f.x + Math.sin(time * f.sp * 0.7 + f.ph) * f.amp * 1.6;
        const y = f.y + Math.cos(time * f.sp + f.ph * 1.3) * f.amp;
        const bl =
          a * (0.35 + 0.65 * Math.max(0, Math.sin(time * f.sp * 2.2 + f.ph)));
        const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
        g.addColorStop(0, `rgba(220,255,120,${bl})`);
        g.addColorStop(0.35, `rgba(190,255,90,${bl * 0.35})`);
        g.addColorStop(1, "rgba(190,255,90,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, TAU);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,210,${bl})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, TAU);
        ctx.fill();
      }
    }

    function drawPipeBody(
      x: number,
      y: number,
      w: number,
      h: number,
      flipLip: boolean
    ) {
      const g = ctx.createLinearGradient(x, 0, x + w, 0);
      g.addColorStop(0, "#5cb536");
      g.addColorStop(0.18, "#8fdc5a");
      g.addColorStop(0.45, "#6cc93f");
      g.addColorStop(0.8, "#4c9b2a");
      g.addColorStop(1, "#2e6b1a");
      ctx.fillStyle = g;
      ctx.fillRect(x, y, w, h);
      const vg = ctx.createLinearGradient(0, y, 0, y + h);
      if (flipLip) {
        vg.addColorStop(0, "rgba(0,0,0,0.0)");
        vg.addColorStop(1, "rgba(0,0,0,0.22)");
      } else {
        vg.addColorStop(0, "rgba(0,0,0,0.22)");
        vg.addColorStop(1, "rgba(0,0,0,0.0)");
      }
      ctx.fillStyle = vg;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#1f4f14";
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y - 2, w - 2, h + 4);
    }

    function drawPipeLip(x: number, y: number, w: number, label: string) {
      const lw = w + 8;
      const lx = x - 4;
      const lh = 26;
      const g = ctx.createLinearGradient(lx, 0, lx + lw, 0);
      g.addColorStop(0, "#5cb536");
      g.addColorStop(0.18, "#9be668");
      g.addColorStop(0.45, "#72d044");
      g.addColorStop(0.8, "#4c9b2a");
      g.addColorStop(1, "#2e6b1a");
      ctx.fillStyle = g;
      roundRect(lx, y, lw, lh, 3);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fillRect(lx + 2, y + 3, lw - 4, 4);
      ctx.strokeStyle = "#1f4f14";
      ctx.lineWidth = 2;
      roundRect(lx + 1, y + 1, lw - 2, lh - 2, 3);
      ctx.stroke();

      // Étiquette dossier RH / territorial sur le rebord du tuyau
      ctx.font = `bold 8px ${FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(15,35,10,0.78)";
      roundRect(lx + 5, y + 7, lw - 10, 12, 3);
      ctx.fill();
      ctx.fillStyle = "#fef3c7";
      ctx.fillText(label, lx + lw / 2, y + 13.5);
    }

    function drawPipes() {
      for (const p of G.pipes) {
        const top = p.gapY - p.gapH / 2;
        const bot = p.gapY + p.gapH / 2;
        const wob = p.wobble > 0 ? Math.sin(p.wobble * 12) * p.wobble * 2 : 0;
        ctx.save();
        ctx.translate(wob, 0);
        drawPipeBody(p.x, -10, PIPE_W, top + 10 - 24, true);
        drawPipeLip(p.x, top - 26, PIPE_W, p.labelTop);
        drawPipeBody(p.x, bot + 24, PIPE_W, GROUND_Y - bot - 24 + 10, false);
        drawPipeLip(p.x, bot, PIPE_W, p.labelBot);
        ctx.restore();
      }
    }

    function drawBird() {
      const { x, y, rot } = bird;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      const dark = dayT > 0.75 ? 0.18 * ((dayT - 0.75) / 0.25) : 0;

      // Écharpe orange CFDT flottant derrière l'oiseau
      const scarfWave = Math.sin(G.time * 14) * 2.6;
      ctx.fillStyle = "#ea580c";
      ctx.beginPath();
      ctx.moveTo(-4, 5);
      ctx.quadraticCurveTo(-15, 7 + scarfWave, -24, 4 - scarfWave * 0.7);
      ctx.lineTo(-22, 10 - scarfWave * 0.7);
      ctx.quadraticCurveTo(-13, 12 + scarfWave, -2, 9);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#7c2d12";
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // Tail feathers
      ctx.fillStyle = "#f0a020";
      ctx.beginPath();
      ctx.moveTo(-9, -2);
      ctx.lineTo(-20, -9);
      ctx.lineTo(-17, 1);
      ctx.lineTo(-21, 7);
      ctx.lineTo(-9, 5);
      ctx.closePath();
      ctx.fill();

      // Body (warm CFDT amber-gold)
      const bg = ctx.createRadialGradient(-3, -5, 2, 0, 0, 16);
      bg.addColorStop(0, "#ffe25a");
      bg.addColorStop(0.65, "#ffb627");
      bg.addColorStop(1, "#ea580c");
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 12, 0, 0, TAU);
      ctx.fill();

      // Belly
      ctx.fillStyle = "#fff2c2";
      ctx.beginPath();
      ctx.ellipse(1, 5, 9, 5.5, 0, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = "#7a3505";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 12, 0, 0, TAU);
      ctx.stroke();

      // Col d'écharpe orange CFDT autour du cou
      ctx.fillStyle = "#f97316";
      roundRect(-7, 4, 15, 4.2, 2);
      ctx.fill();
      ctx.strokeStyle = "#7c2d12";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Casquette / béret syndical CFDT sur la tête
      ctx.fillStyle = "#ea580c";
      ctx.beginPath();
      ctx.ellipse(-1, -10.5, 8.5, 4, -0.1, Math.PI, TAU);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#7c2d12";
      ctx.lineWidth = 1.3;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(4, -10.5);
      ctx.lineTo(12, -9.5);
      ctx.strokeStyle = "#7c2d12";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Wing (flaps with phase)
      const wingA =
        Math.sin(bird.wing) *
          (bird.flapT > 0 || G.state !== "playing" ? 0.9 : 0.35) -
        0.2;
      ctx.save();
      ctx.translate(-4, 1);
      ctx.rotate(wingA);
      ctx.fillStyle = "#ffd23f";
      ctx.beginPath();
      ctx.moveTo(0, -3);
      ctx.quadraticCurveTo(-14, -6, -13, 6);
      ctx.quadraticCurveTo(-6, 9, 2, 4);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#7a3505";
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.ellipse(-6, 0, 4, 2, -0.3, 0, TAU);
      ctx.fill();
      ctx.restore();

      // Eye
      const blink = bird.blink < 0 ? 0.15 : 1;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(6, -4, 5.2, 5.2 * blink, 0, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = "#7a3505";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      if (blink > 0.5) {
        ctx.fillStyle = "#1b1b1b";
        ctx.beginPath();
        ctx.arc(8, -4, 2.5, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(9, -5.2, 1, 0, TAU);
        ctx.fill();
      }

      // Beak
      ctx.fillStyle = "#ff7a1a";
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(21, 1.5);
      ctx.lineTo(10, 5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#e0560f";
      ctx.beginPath();
      ctx.moveTo(10, 3);
      ctx.lineTo(19, 3.5);
      ctx.lineTo(10, 7);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#7a3505";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(21, 1.5);
      ctx.lineTo(10, 7);
      ctx.closePath();
      ctx.stroke();

      // Cheek blush
      ctx.fillStyle = "rgba(255,90,90,0.35)";
      ctx.beginPath();
      ctx.ellipse(5, 3, 3.5, 2, 0, 0, TAU);
      ctx.fill();

      if (dark > 0) {
        ctx.fillStyle = `rgba(20,20,60,${dark})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, 15, 13, 0, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawParticles() {
      for (const f of G.feathers) {
        const a = 1 - f.life / f.max;
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rot);
        ctx.globalAlpha = a;
        ctx.fillStyle = f.col;
        ctx.beginPath();
        ctx.moveTo(0, -f.s);
        ctx.quadraticCurveTo(f.s * 0.9, 0, 0, f.s * 1.3);
        ctx.quadraticCurveTo(-f.s * 0.9, 0, 0, -f.s);
        ctx.fill();
        ctx.strokeStyle = "rgba(120,70,0,0.5)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -f.s * 0.8);
        ctx.lineTo(0, f.s * 1.1);
        ctx.stroke();
        ctx.restore();
      }
      for (const r of G.rings) {
        const t = r.life / r.max;
        ctx.strokeStyle = `rgba(255,255,255,${(1 - t) * 0.9})`;
        ctx.lineWidth = 3 * (1 - t) + 0.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 6 + t * 42, 0, TAU);
        ctx.stroke();
      }
      for (const s of G.sparks) {
        const t = s.life / s.max;
        const sz = s.s * (1 - t);
        ctx.fillStyle = `rgba(255,${(240 - t * 60) | 0},120,${1 - t})`;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y - sz * 2);
        ctx.lineTo(s.x + sz, s.y);
        ctx.lineTo(s.x, s.y + sz * 2);
        ctx.lineTo(s.x - sz, s.y);
        ctx.closePath();
        ctx.fill();
      }
      for (const p of G.popups) {
        const t = p.life / p.max;
        const a = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
        const sc = 1 + (1 - Math.min(1, t * 5)) * 0.5;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(sc, sc);
        ctx.globalAlpha = a;
        chunkyText(p.text, 0, 0, p.size, p.col, "#3a2200", 5);
        ctx.restore();
      }
    }

    function drawPill(
      cx: number,
      cy: number,
      text: string,
      gold: boolean,
      pop: number
    ) {
      ctx.font = `bold 14px ${FONT}`;
      const w = ctx.measureText(text).width + 24;
      const h = 26;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1 + pop * 0.25, 1 + pop * 0.25);
      if (gold) {
        const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
        g.addColorStop(0, "#ffe680");
        g.addColorStop(0.5, "#ffc21a");
        g.addColorStop(1, "#ff8800");
        ctx.fillStyle = g;
        ctx.shadowColor = "rgba(255,180,30,0.85)";
        ctx.shadowBlur = 14;
      } else {
        ctx.fillStyle = "rgba(0,0,0,0.42)";
      }
      roundRect(-w / 2, -h / 2, w, h, h / 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = gold ? "#7a4a00" : "rgba(255,255,255,0.38)";
      ctx.lineWidth = gold ? 2.5 : 1.5;
      ctx.stroke();
      ctx.fillStyle = gold ? "#4a2500" : "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 0, 1);
      ctx.restore();
    }

    function drawPauseButton() {
      const b = G.pauseBtn;
      ctx.fillStyle = "rgba(0,0,0,0.42)";
      roundRect(b.x, b.y, b.w, b.h, 9);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#fff";
      if (G.paused) {
        ctx.beginPath();
        ctx.moveTo(b.x + 12, b.y + 9);
        ctx.lineTo(b.x + 26, b.y + 17);
        ctx.lineTo(b.x + 12, b.y + 25);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(b.x + 10, b.y + 9, 5, 16);
        ctx.fillRect(b.x + 19, b.y + 9, 5, 16);
      }
    }

    function drawHUD() {
      const s = G.state;
      if (s === "playing" || s === "dying" || s === "ready") {
        const sc = 1 + G.scorePop * 0.3;
        ctx.save();
        ctx.translate(W / 2, 62);
        ctx.scale(sc, sc);
        chunkyText(String(G.score), 0, 0, 62, "#ffffff", "#2a1f3d", 9);
        ctx.restore();
        if (G.newBest) {
          drawPill(W / 2, 108, "NOUVEAU RECORD !", true, G.pillPop);
        } else {
          drawPill(W / 2, 108, `RECORD ${best}`, false, 0);
        }
        if (s === "playing" || s === "ready") drawPauseButton();
      }

      if (G.bannerT > 0) {
        const t = 2.2 - G.bannerT;
        const a =
          t < 0.2 ? t / 0.2 : G.bannerT < 0.4 ? G.bannerT / 0.4 : 1;
        const y = 200 - Math.min(1, t) * 18 + Math.sin(t * 6) * 3;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.translate(W / 2, y);
        ctx.rotate(-0.06);
        const popScale = 1 + (t < 0.15 ? (0.15 - t) * 3 : 0);
        ctx.scale(popScale, popScale);
        chunkyText("NOUVEAU RECORD !", 0, 0, 31, "#ffd83d", "#6a3a00", 7);
        ctx.restore();
      }

      if (s === "ready") {
        const bob = Math.sin(G.time * 4) * 4;
        chunkyText("PRÊT À DÉCOLLER", W / 2, 190, 34, "#ffd83d", "#6a3a00", 8);
        ctx.save();
        ctx.globalAlpha = 0.9;
        const hx = W / 2 + 70;
        const hy = 300 + bob;
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.beginPath();
        ctx.arc(hx, hy, 14, 0, TAU);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(hx, hy, 22 + bob, 0, TAU);
        ctx.globalAlpha = 0.4;
        ctx.stroke();
        ctx.restore();
        chunkyText(
          "CLIC / TAP / ESPACE",
          W / 2,
          372,
          18,
          "#ffffff",
          "#2a1f3d",
          5
        );
      }

      if (s === "menu") {
        const bob = Math.sin(G.time * 2.5) * 5;
        chunkyText(
          "FLAPPY",
          W / 2,
          118 + bob,
          60,
          "#ffd83d",
          "#6a3a00",
          10
        );
        chunkyText(
          "CFDT 92",
          W / 2,
          176 + bob,
          54,
          "#ff7a1a",
          "#3b1604",
          10
        );
        drawPill(W / 2, 226 + bob * 0.6, "MAIRIE DE GENNEVILLIERS", false, 0);

        const pulse = 0.75 + 0.25 * Math.sin(G.time * 5);
        ctx.save();
        ctx.globalAlpha = pulse;
        chunkyText(
          "CLIQUER POUR VOLER",
          W / 2,
          398,
          24,
          "#ffffff",
          "#2a1f3d",
          6
        );
        ctx.restore();
        if (best > 0) drawPill(W / 2, 444, `RECORD ${best}`, false, 0);
        ctx.font = `bold 11px ${FONT}`;
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.textAlign = "center";
        ctx.fillText(
          "ESPACE / CLIC / TAP · SURVOLEZ LE 92230",
          W / 2,
          604
        );
      }

      if (G.paused && (s === "playing" || s === "ready")) {
        ctx.fillStyle = "rgba(10,8,30,0.6)";
        ctx.fillRect(0, 0, W, H);
        chunkyText("PAUSE CFDT", W / 2, 276, 46, "#ffffff", "#2a1f3d", 9);
        chunkyText(
          "CLIQUER POUR REPRENDRE",
          W / 2,
          330,
          18,
          "#ffd83d",
          "#6a3a00",
          5
        );
        drawPauseButton();
      }
    }

    function drawMedal(cx: number, cy: number, kind: MedalKind, t: number) {
      const m = MEDALS[kind];
      ctx.save();
      ctx.translate(cx, cy);
      const sc = t < 0.25 ? 0.2 + smooth(t / 0.25) * 0.8 : 1;
      ctx.scale(sc, sc);
      // Ruban aux couleurs CFDT (orange vif)
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.moveTo(-10, -30);
      ctx.lineTo(-18, -8);
      ctx.lineTo(0, -14);
      ctx.lineTo(18, -8);
      ctx.lineTo(10, -30);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#c2410c";
      ctx.beginPath();
      ctx.moveTo(-3, -30);
      ctx.lineTo(-6, -12);
      ctx.lineTo(6, -12);
      ctx.lineTo(3, -30);
      ctx.closePath();
      ctx.fill();

      const g = ctx.createRadialGradient(-6, -6, 2, 0, 0, 26);
      g.addColorStop(0, m.a);
      g.addColorStop(1, m.b);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 4, 24, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = m.ring;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 4, 17, 0, TAU);
      ctx.stroke();

      ctx.fillStyle = m.ring;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 ? 5 : 11;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        ctx.lineTo(Math.cos(a) * r, 4 + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();

      const sh = ((G.overT * 0.6) % 1.6) - 0.3;
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 4, 24, 0, TAU);
      ctx.clip();
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.beginPath();
      ctx.moveTo(-40 + sh * 80, -30);
      ctx.lineTo(-28 + sh * 80, -30);
      ctx.lineTo(-8 + sh * 80, 40);
      ctx.lineTo(-20 + sh * 80, 40);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.restore();
    }

    function drawGameOver() {
      const t = G.overT;
      const slide = smooth(clamp(t / 0.45, 0, 1));
      ctx.fillStyle = `rgba(10,8,30,${0.38 * slide})`;
      ctx.fillRect(0, 0, W, H);
      chunkyText(
        "FIN DE TOURNÉE",
        W / 2,
        146 - (1 - slide) * 40,
        36,
        "#ff7a1a",
        "#4a1a10",
        8
      );
      chunkyText(
        "CFDT · GENNEVILLIERS",
        W / 2,
        184 - (1 - slide) * 40,
        15,
        "#ffe680",
        "#3a1808",
        4
      );

      const cw = 282;
      const ch = 194;
      const cx = W / 2 - cw / 2;
      const cy = 224 + (1 - slide) * 300;
      ctx.save();
      ctx.globalAlpha = slide;
      ctx.fillStyle = "#f5e3b3";
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 8;
      roundRect(cx, cy, cw, ch, 14);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = "#c9a25e";
      ctx.lineWidth = 4;
      roundRect(cx + 4, cy + 4, cw - 8, ch - 8, 11);
      ctx.stroke();
      ctx.fillStyle = "#e6cf94";
      roundRect(cx + 12, cy + 12, cw - 24, ch - 24, 8);
      ctx.fill();

      const medal = medalFor(G.score);
      ctx.fillStyle = "#d4b878";
      ctx.beginPath();
      ctx.arc(cx + 68, cy + 94, 32, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = "#b2924f";
      ctx.lineWidth = 2;
      ctx.stroke();
      if (medal && t > 0.75) drawMedal(cx + 68, cy + 90, medal, t - 0.75);
      ctx.font = `bold 11px ${FONT}`;
      ctx.fillStyle = "#7a581c";
      ctx.textAlign = "center";
      ctx.fillText(
        medal ? MEDALS[medal].label : "ADHÉRENT",
        cx + 68,
        cy + 144
      );
      ctx.fillText("BADGE CFDT", cx + 68, cy + 38);

      ctx.font = `bold 13px ${FONT}`;
      ctx.fillStyle = "#b3532a";
      ctx.textAlign = "right";
      ctx.fillText("DOSSIERS", cx + cw - 26, cy + 38);
      const shown = Math.min(G.score, Math.floor(Math.max(0, t - 0.4) * 25));
      chunkyText(
        String(shown),
        cx + cw - 26,
        cy + 68,
        34,
        "#ffffff",
        "#4a3a1a",
        6,
        "right"
      );
      ctx.font = `bold 13px ${FONT}`;
      ctx.fillStyle = "#b3532a";
      ctx.textAlign = "right";
      ctx.fillText("RECORD 92", cx + cw - 26, cy + 108);
      chunkyText(
        String(best),
        cx + cw - 26,
        cy + 138,
        34,
        "#ffffff",
        "#4a3a1a",
        6,
        "right"
      );
      if (G.newBest) {
        ctx.save();
        ctx.translate(cx + cw - 26, cy + 166);
        ctx.rotate(-0.08);
        drawPill(-36, 0, "RECORD !", true, 0.1 + 0.1 * Math.sin(t * 8));
        ctx.restore();
      }
      ctx.restore();

      const by = 446 + (1 - slide) * 300;
      const bw = 184;
      const bh = 54;
      const bx = W / 2 - bw / 2;
      const press = Math.sin(t * 3) * 2;
      ctx.save();
      ctx.globalAlpha = slide;
      ctx.translate(0, press);
      ctx.fillStyle = "#c0641f";
      roundRect(bx, by + 6, bw, bh, 12);
      ctx.fill();
      const bg = ctx.createLinearGradient(0, by, 0, by + bh);
      bg.addColorStop(0, "#ffb347");
      bg.addColorStop(1, "#f97316");
      ctx.fillStyle = bg;
      roundRect(bx, by, bw, bh, 12);
      ctx.fill();
      ctx.strokeStyle = "#7a3a00";
      ctx.lineWidth = 3;
      ctx.stroke();
      chunkyText("REJOUER", W / 2, by + bh / 2 + 2, 28, "#ffffff", "#7a3a00", 6);
      ctx.restore();
      G.retryBtn = { x: bx, y: by, w: bw, h: bh, ready: t > 0.5 };
    }

    function render() {
      ctx.save();
      if (G.shake > 0) ctx.translate(G.shakeX, G.shakeY);
      drawSky(G.time);
      drawClouds(G.dist, G.time);
      drawMountains(G.dist);
      drawGennevilliersSkyline(G.dist);
      drawTrees(G.dist);
      drawNeighborhoodSigns(G.dist);
      drawPipes();
      drawGround(G.dist);
      drawFireflies(G.time);
      if (dayT > 0.5) {
        const v = ctx.createRadialGradient(W / 2, H * 0.45, 120, W / 2, H * 0.45, 460);
        v.addColorStop(0, "rgba(0,0,20,0)");
        v.addColorStop(1, `rgba(0,0,20,${(dayT - 0.5) * 0.7})`);
        ctx.fillStyle = v;
        ctx.fillRect(0, 0, W, H);
      }
      drawParticles();
      drawBird();
      ctx.restore();
      if (G.flash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${G.flash})`;
        ctx.fillRect(0, 0, W, H);
      }
      drawHUD();
      if (G.state === "over") drawGameOver();
    }

    function inRect(px: number, py: number, r: Rect | null): boolean {
      return Boolean(
        r && px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h
      );
    }

    function action() {
      Sound.unlock();
      const s = G.state;
      if (G.paused) {
        G.paused = false;
        return;
      }
      if (s === "menu") startRun();
      else if (s === "ready") beginPlay();
      else if (s === "playing") flap();
      else if (s === "over") {
        if (G.retryBtn && G.retryBtn.ready) startRun();
      }
    }

    function togglePause() {
      if (G.state !== "playing" && G.state !== "ready") return;
      G.paused = !G.paused;
      Sound.unlock();
    }

    function onPointerDown(e: PointerEvent) {
      e.preventDefault();
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * W;
      const py = ((e.clientY - r.top) / r.height) * H;
      if (
        (G.state === "playing" || G.state === "ready") &&
        inRect(px, py, G.pauseBtn)
      ) {
        togglePause();
        return;
      }
      if (G.state === "over") {
        if ((inRect(px, py, G.retryBtn) && G.retryBtn?.ready) || G.overT > 1.0) {
          action();
        }
        return;
      }
      action();
    }

    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (
        e.code === "Space" ||
        e.code === "ArrowUp" ||
        e.code === "KeyW" ||
        e.code === "Enter"
      ) {
        e.preventDefault();
        action();
      } else if (e.code === "KeyP" || e.code === "Escape") {
        e.preventDefault();
        togglePause();
      } else if (e.code === "KeyM") {
        e.preventDefault();
        setIsMuted((m) => !m);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (G.state === "playing") G.paused = true;
      } else {
        last = performance.now();
        acc = 0;
      }
    };

    const onWindowBlur = () => {
      if (G.state === "playing") G.paused = true;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onWindowBlur);

    let rafId = 0;
    let last = performance.now();
    let acc = 0;
    function frame(now: number) {
      let dt = (now - last) / 1000;
      last = now;
      if (dt > MAX_FRAME) dt = MAX_FRAME;
      if (!G.paused) {
        acc += dt;
        while (acc >= STEP) {
          step();
          acc -= STEP;
        }
      }
      render();
      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onWindowBlur);
      if (ac) {
        ac.close().catch(() => {});
      }
    };
  }, [restartToken]);

  return (
    <div
      ref={containerRef}
      className={`relative z-30 isolate flex flex-col w-full select-none overflow-hidden text-white ${
        isFullscreen ? "h-dvh" : "h-[calc(100dvh-4.75rem)] min-h-[580px]"
      }`}
      style={{
        background: "radial-gradient(ellipse at 50% 40%, #1c1650 0%, #0d0a2b 72%)",
      }}
    >
      {/* Barre supérieure compacte CFDT · Gennevilliers */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 bg-slate-950/90 border-b border-orange-500/25 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 border border-red-400/30 transition-all shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Retour aux jeux</span>
            <span className="inline sm:hidden">Retour</span>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <img
              src={`${BASE_URL}logo-cfdt.jpg`}
              alt="Logo CFDT"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-orange-400/50 shadow-sm shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-orange-400 shrink-0 hidden sm:inline" />
                <h1 className="text-xs sm:text-sm md:text-base font-black tracking-tight text-white truncate">
                  Flappy CFDT <span className="text-orange-400">· Ciel de Gennevilliers</span>
                </h1>
              </div>
              <p className="text-[10px] text-slate-400 truncate hidden md:block">
                Du matin sur la Mairie jusqu&apos;à la nuit étoilée des Chanteraines — clic, tap ou Espace !
              </p>
            </div>
          </div>

          <div className="hidden xl:flex items-center pl-2 border-l border-white/10">
            <GennevilliersLogo variant="white" className="h-5 w-auto opacity-80" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsMuted((m) => !m)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
            title={isMuted ? "Activer le son (M)" : "Couper le son (M)"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="hidden sm:inline">{isMuted ? "Muet" : "Son"}</span>
          </button>

          <button
            type="button"
            onClick={() => setRestartToken((n) => n + 1)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
            title="Réinitialiser la partie"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Menu</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
            title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-orange-400" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-orange-400" />
            )}
            <span className="hidden lg:inline">
              {isFullscreen ? "Réduire" : "Plein écran"}
            </span>
          </button>
        </div>
      </header>

      {/* Stage 9:16 centré haute définition (Retina) */}
      <div
        ref={wrapRef}
        className="relative flex-1 w-full flex items-center justify-center p-2 overflow-hidden"
      >
        <div
          ref={stageRef}
          className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)] bg-[#7ec8f0]"
          style={{ touchAction: "none" }}
        >
          <canvas
            ref={canvasRef}
            className="block w-full h-full cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default FlappyAgent;
