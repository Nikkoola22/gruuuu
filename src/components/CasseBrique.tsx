import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  ArrowLeft, 
  RotateCcw, 
  Trophy, 
  Play, 
  Heart, 
  Sparkles,
  Zap,
  Activity
} from "lucide-react";

interface CasseBriqueProps {
  onClose: () => void;
}

// ─── Modèles du jeu ──────────────────────────────────────────────────────────
interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
  points: number;
  isHit: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}


interface Bullet {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  color: string;
  active: boolean;
}
interface PowerUp {
  x: number;
  y: number;
  type: "life" | "wide" | "slow" | "multiball" | "shoot";
  size: number;
  color: string;
  label: string;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  active: boolean;
  trail: { x: number; y: number }[];
}

const BRICK_WORDS = [
  // Ligne 1 - Rouge/Orange (Primes & Indemnités)
  ["RIFSEEP", "13e MOIS", "PRIMES", "CIA", "NBI", "GIPA", "HEURES +", "IFSE", "AIF", "IFTS", "IHTS"],
  // Ligne 2 - Orange (Temps de travail & QVT)
  ["TÉLÉTRAVAIL", "DÉCONNEXION", "CET", "RTT", "CONGÉS", "MUTUELLE", "COS", "TICKETS", "CRÈCHE", "SPORT", "AMÉNAG."],
  // Ligne 3 - Orange clair (Carrière & Compétences)
  ["FORMATION", "CPF", "CARRIÈRE", "CONCOURS", "MOBILITÉ", "STAGE", "PROMOTION", "DIF", "BILAN", "VAE", "ÉVAL."],
  // Ligne 4 - Jaune/Blanc (Santé, Sécurité, CFDT)
  ["SÉCURITÉ", "SANTÉ", "CST", "PRÉVOYANCE", "DROITS", "ACCORD", "CFDT", "F3SCT", "CAP", "CCP", "ÉGALITÉ"]
];

const BRICK_COLORS = ["#ff0000", "#ffff00", "#00ffff", "#00ff00"];

const LEVEL_LAYOUTS = [
  // Niveau 1 : Grille complète (4 lignes x 11 colonnes)
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ],
  // Niveau 2 : Forme spatiale de bouclier invader (11 colonnes)
  [
    [1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0]
  ]
];

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const CasseBrique: React.FC<CasseBriqueProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // États React pour l'affichage de l'interface
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<"ready" | "playing" | "gameover" | "victory">("ready");
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);
  const [level, setLevelState] = useState(1);
  
  const levelRef = useRef(1);
  const setLevel = (val: number) => {
    levelRef.current = val;
    setLevelState(val);
  };

  // Refs de physique pour éviter les saccades dues au rafraîchissement d'état React
  const paddleRef = useRef({ x: 270, y: 382, width: 100, height: 18 });
  const ballsRef = useRef<Ball[]>([{ x: 320, y: 360, vx: 7, vy: -8, radius: 6, active: true, trail: [] }]);
  const bricksRef = useRef<Brick[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const powerupsRef = useRef<PowerUp[]>([]);
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const shakeRef = useRef<number>(0);
  const starsRef = useRef<{ x: number; y: number; size: number; alpha: number; speed: number }[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const shootModeRef = useRef(false);

  // Timers des power-ups
  const powerupTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthèse sonore Web Audio
  const playSound = useCallback((type: 'paddle' | 'wall' | 'brick' | 'powerup' | 'death' | 'victory') => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();
    }
    const ac = audioCtxRef.current;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    const now = ac.currentTime;
    if (type === 'paddle') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now); osc.stop(now + 0.1);
    } else if (type === 'wall') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(180, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.start(now); osc.stop(now + 0.07);
    } else if (type === 'brick') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now); osc.stop(now + 0.15);
    } else if (type === 'powerup') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(660, now + 0.08);
      osc.frequency.setValueAtTime(880, now + 0.16);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'death') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.5);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.start(now); osc.stop(now + 0.55);
    } else if (type === 'victory') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.setValueAtTime(659, now + 0.12);
      osc.frequency.setValueAtTime(784, now + 0.24);
      osc.frequency.setValueAtTime(1046, now + 0.36);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now); osc.stop(now + 0.6);
    }
  }, []);

  // Réinitialiser les briques
  const initBricks = useCallback((lvl: number) => {
    const bricks: Brick[] = [];
    const rows = 4;
    const cols = 11;
    const brickW = 60;
    const brickH = 16;
    const gap = 8;
    const offsetTop = 40;
    const totalW = cols * brickW + (cols - 1) * gap;
    const offsetLeft = (CANVAS_WIDTH - totalW) / 2;

    const layout = LEVEL_LAYOUTS[lvl - 1] || LEVEL_LAYOUTS[0];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (layout[r][c] === 1) {
          bricks.push({
            x: offsetLeft + c * (brickW + gap),
            y: offsetTop + r * (brickH + gap),
            width: brickW,
            height: brickH,
            text: BRICK_WORDS[r][c],
            color: BRICK_COLORS[r],
            points: (rows - r) * 10,
            isHit: false
          });
        }
      }
    }
    bricksRef.current = bricks;
  }, []);

  // Initialiser une nouvelle partie
  const startNewGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setActivePowerUp(null);
    if (powerupTimerRef.current) clearTimeout(powerupTimerRef.current);

    paddleRef.current = { x: 350, y: 560, width: 100, height: 16 };
    ballsRef.current = [{ x: 400, y: 540, vx: 8.5, vy: -9.5, radius: 7, active: true, trail: [] }];
    particlesRef.current = [];
    powerupsRef.current = [];
    bulletsRef.current = [];
    shootModeRef.current = false;
    
    initBricks(1);
    setGameState("playing");
  }, [initBricks]);

  // Déclencher un effet de particules d'explosion (optimisé mobile sans shadowBlur)
  const createExplosion = (x: number, y: number, color: string) => {
    const particles: Particle[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 2,
        color,
        alpha: 1,
        life: Math.random() * 16 + 12
      });
    }
    particlesRef.current.push(...particles);
    if (particlesRef.current.length > 60) {
      particlesRef.current.splice(0, particlesRef.current.length - 60);
    }
  };

  // Activer un bonus
  const applyPowerUp = (type: "life" | "wide" | "slow" | "multiball" | "shoot") => {
    if (type === "life") {
      setLives((l) => l + 1);
    } else if (type === "wide") {
      paddleRef.current.width = 150;
      setActivePowerUp("Raquette Large");
      if (powerupTimerRef.current) clearTimeout(powerupTimerRef.current);
      powerupTimerRef.current = setTimeout(() => {
        paddleRef.current.width = 100;
        setActivePowerUp(null);
      }, 8000);
    } else if (type === "slow") {
      ballsRef.current.forEach((b) => {
        b.vx *= 0.7;
        b.vy *= 0.7;
      });
      setActivePowerUp("Balle Ralentie");
      if (powerupTimerRef.current) clearTimeout(powerupTimerRef.current);
      powerupTimerRef.current = setTimeout(() => {
        ballsRef.current.forEach((b) => {
          b.vx /= 0.7;
          b.vy /= 0.7;
        });
        setActivePowerUp(null);
      }, 8000);
    
    } else if (type === "shoot") {
      shootModeRef.current = true;
      setActivePowerUp("Mode Tir 🔫");
      if (powerupTimerRef.current) clearTimeout(powerupTimerRef.current);
      powerupTimerRef.current = setTimeout(() => {
        shootModeRef.current = false;
        setActivePowerUp(null);
      }, 8000);
    } else if (type === "multiball") {
      const mainBall = ballsRef.current[0];
      if (mainBall) {
        ballsRef.current.push({
          x: mainBall.x,
          y: mainBall.y,
          vx: -mainBall.vx,
          vy: mainBall.vy,
          radius: mainBall.radius,
          active: true,
          trail: []
        });
      }
      setActivePowerUp("Multi-Balles");
    }
  };

  const fireBullet = () => {
    if (!shootModeRef.current || gameState !== "playing") return;
    bulletsRef.current.push({
      x: paddleRef.current.x + paddleRef.current.width / 2 - 2,
      y: paddleRef.current.y,
      width: 4,
      height: 12,
      vy: -11,
      color: "#f43f5e",
      active: true
    });
  };

  // Clavier & pré-rendu du décor statique (Offscreen Canvas pour fluidité maximale sur smartphone)
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keysRef.current.left = true;
      if (e.key === "ArrowRight") keysRef.current.right = true;

      if (e.code === "Space" && shootModeRef.current) {
        e.preventDefault();
        bulletsRef.current.push({
          x: paddleRef.current.x + paddleRef.current.width / 2 - 2,
          y: paddleRef.current.y,
          width: 4,
          height: 12,
          vy: -11,
          color: "#f43f5e",
          active: true
        });
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keysRef.current.left = false;
      if (e.key === "ArrowRight") keysRef.current.right = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Pré-rendre le fond Arkanoid + grille + bordures métalliques + vignette une seule fois
    const offscreen = document.createElement("canvas");
    offscreen.width = CANVAS_WIDTH;
    offscreen.height = CANVAS_HEIGHT;
    const bctx = offscreen.getContext("2d");
    if (bctx) {
      bctx.fillStyle = "#000044";
      bctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      bctx.strokeStyle = "#000066";
      bctx.lineWidth = 1;
      bctx.beginPath();
      for (let i = -CANVAS_HEIGHT; i < CANVAS_WIDTH + CANVAS_HEIGHT; i += 40) {
        bctx.moveTo(i, 0);
        bctx.lineTo(i - CANVAS_HEIGHT, CANVAS_HEIGHT);
        bctx.moveTo(i, 0);
        bctx.lineTo(i + CANVAS_HEIGHT, CANVAS_HEIGHT);
      }
      bctx.stroke();

      // Bordure métallique retro
      bctx.fillStyle = "#9ca3af";
      bctx.fillRect(0, 0, 16, CANVAS_HEIGHT);
      bctx.fillRect(CANVAS_WIDTH - 16, 0, 16, CANVAS_HEIGHT);
      bctx.fillRect(0, 0, CANVAS_WIDTH, 16);

      bctx.fillStyle = "#4b5563";
      bctx.fillRect(12, 16, 4, CANVAS_HEIGHT - 16);
      bctx.fillRect(CANVAS_WIDTH - 16, 16, 4, CANVAS_HEIGHT - 16);
      bctx.fillRect(16, 12, CANVAS_WIDTH - 32, 4);

      bctx.fillStyle = "#374151";
      for (let y = 40; y < CANVAS_HEIGHT; y += 80) {
        bctx.fillRect(0, y, 16, 4);
        bctx.fillRect(CANVAS_WIDTH - 16, y, 16, 4);
      }
      for (let x = 40; x < CANVAS_WIDTH; x += 120) {
        bctx.fillRect(x, 0, 4, 16);
      }

      // Vignette pré-calculée
      const vignetteGrad = bctx.createRadialGradient(
        CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH * 0.35,
        CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH * 0.65
      );
      vignetteGrad.addColorStop(0, "rgba(0,0,0,0)");
      vignetteGrad.addColorStop(0.7, "rgba(0,0,0,0.22)");
      vignetteGrad.addColorStop(1, "rgba(0,0,0,0.65)");
      bctx.fillStyle = vignetteGrad;
      bctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    bgCanvasRef.current = offscreen;

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Déplacement souris relatif
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== "playing") return;
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const halfWidth = paddleRef.current.width / 2;
    let newX = (relativeX / rect.width) * CANVAS_WIDTH - halfWidth;
    
    if (newX < 0) newX = 0;
    if (newX > CANVAS_WIDTH - paddleRef.current.width) newX = CANVAS_WIDTH - paddleRef.current.width;
    paddleRef.current.x = newX;
  };

  // Déplacement tactile
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== "playing" || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.touches[0].clientX - rect.left;
    const halfWidth = paddleRef.current.width / 2;
    let newX = (relativeX / rect.width) * CANVAS_WIDTH - halfWidth;

    if (newX < 0) newX = 0;
    if (newX > CANVAS_WIDTH - paddleRef.current.width) newX = CANVAS_WIDTH - paddleRef.current.width;
    paddleRef.current.x = newX;
  };

  // Boucle de jeu avec Delta-Time (garantit la même vitesse réelle sur smartphone 30Hz/60Hz/120Hz)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationId: number;
    let lastTime = performance.now();

    const updateGame = (dt: number) => {
      if (gameState !== "playing") return;

      // 1. Déplacer la raquette au clavier / boutons tactiles
      const paddleSpeed = 13 * dt;
      if (keysRef.current.left) {
        paddleRef.current.x = Math.max(16, paddleRef.current.x - paddleSpeed);
      }
      if (keysRef.current.right) {
        paddleRef.current.x = Math.min(CANVAS_WIDTH - 16 - paddleRef.current.width, paddleRef.current.x + paddleSpeed);
      }

      // 1.5 Update Bullets
      let pointsEarned = 0;
      bulletsRef.current.forEach(bullet => {
        if (!bullet.active) return;
        bullet.y += bullet.vy * dt;
        if (bullet.y < 0) bullet.active = false;
        
        bricksRef.current.forEach(brick => {
          if (brick.isHit || !bullet.active) return;
          if (
            bullet.x < brick.x + brick.width &&
            bullet.x + bullet.width > brick.x &&
            bullet.y < brick.y + brick.height &&
            bullet.y + bullet.height > brick.y
          ) {
            brick.isHit = true;
            bullet.active = false;
            pointsEarned += brick.points;
            createExplosion(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);
            shakeRef.current = Math.max(shakeRef.current, 4);
          }
        });
      });
      bulletsRef.current = bulletsRef.current.filter(b => b.active);

      // 2. Déplacer et vérifier les balles
      const activeBalls = ballsRef.current.filter((b) => b.active);
      
      activeBalls.forEach((ball) => {
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;

        // Rebond murs latéraux
        if (ball.x - ball.radius < 16) {
          ball.x = 16 + ball.radius;
          ball.vx = Math.abs(ball.vx);
          playSound('wall');
        }
        if (ball.x + ball.radius > CANVAS_WIDTH - 16) {
          ball.x = CANVAS_WIDTH - 16 - ball.radius;
          ball.vx = -Math.abs(ball.vx);
          playSound('wall');
        }

        // Rebond plafond
        if (ball.y - ball.radius < 16) {
          ball.y = 16 + ball.radius;
          ball.vy = Math.abs(ball.vy);
          playSound('wall');
        }

        // Perte de balle (bas de l'écran)
        if (ball.y + ball.radius > CANVAS_HEIGHT) {
          ball.active = false;
          return;
        }

        // Rebond sur la raquette
        const pad = paddleRef.current;
        if (
          ball.vy > 0 &&
          ball.y + ball.radius >= pad.y &&
          ball.y - ball.radius <= pad.y + pad.height + 6 &&
          ball.x + ball.radius >= pad.x &&
          ball.x - ball.radius <= pad.x + pad.width
        ) {
          const impact = ball.x - (pad.x + pad.width / 2);
          const ratio = Math.max(-1, Math.min(1, impact / (pad.width / 2)));
          const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
          
          ball.vx = ratio * speed * 0.85;
          ball.vy = -Math.sqrt(Math.max(25, speed * speed - ball.vx * ball.vx));
          ball.y = pad.y - ball.radius;
          playSound('paddle');
        }

        // Collision briques
        bricksRef.current.forEach((brick) => {
          if (brick.isHit) return;

          if (
            ball.x + ball.radius >= brick.x &&
            ball.x - ball.radius <= brick.x + brick.width &&
            ball.y + ball.radius >= brick.y &&
            ball.y - ball.radius <= brick.y + brick.height
          ) {
            brick.isHit = true;
            pointsEarned += brick.points;
            createExplosion(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);
            shakeRef.current = Math.max(shakeRef.current, 5);
            playSound('brick');

            const overlapX = Math.min(ball.x + ball.radius - brick.x, brick.x + brick.width - (ball.x - ball.radius));
            const overlapY = Math.min(ball.y + ball.radius - brick.y, brick.y + brick.height - (ball.y - ball.radius));

            if (overlapX < overlapY) {
              ball.vx = -ball.vx;
            } else {
              ball.vy = -ball.vy;
            }

            // Génération de Power-up (16% de chance)
            if (Math.random() < 0.16) {
              const types: ("life" | "wide" | "slow" | "multiball" | "shoot")[] = ["life", "wide", "slow", "multiball", "shoot"];
              const selectedType = types[Math.floor(Math.random() * types.length)];
              let pColor = "#ff7900";
              let pLabel = "🔋";
              if (selectedType === "life") { pColor = "#ef4444"; pLabel = "❤️"; }
              else if (selectedType === "wide") { pColor = "#3b82f6"; pLabel = "↔️"; }
              else if (selectedType === "slow") { pColor = "#10b981"; pLabel = "⏳"; }
              else if (selectedType === "multiball") { pColor = "#a855f7"; pLabel = "🔮"; }
              else if (selectedType === "shoot") { pColor = "#f43f5e"; pLabel = "🔫"; }

              powerupsRef.current.push({
                x: brick.x + brick.width / 2,
                y: brick.y + brick.height,
                type: selectedType,
                size: 14,
                color: pColor,
                label: pLabel
              });
            }
          }
        });
      });

      if (pointsEarned > 0) {
        setScore((s) => s + pointsEarned);
      }

      // Mettre à jour la liste des balles actives
      ballsRef.current = ballsRef.current.filter((b) => b.active);

      // Si plus de balles actives
      if (ballsRef.current.length === 0) {
        setLives((l) => {
          const nextL = l - 1;
          if (nextL <= 0) {
            playSound('death');
            setGameState("gameover");
          } else {
            playSound('death');
            ballsRef.current = [{
              x: paddleRef.current.x + paddleRef.current.width / 2,
              y: paddleRef.current.y - 10,
              vx: 8.5,
              vy: -9.5,
              radius: 7,
              active: true,
              trail: []
            }];
          }
          return nextL;
        });
      }

      // Déplacer les power-ups
      powerupsRef.current.forEach((pup) => {
        pup.y += 4.5 * dt;

        const pad = paddleRef.current;
        if (
          pup.y + pup.size >= pad.y &&
          pup.y <= pad.y + pad.height &&
          pup.x >= pad.x &&
          pup.x <= pad.x + pad.width
        ) {
          applyPowerUp(pup.type);
          playSound('powerup');
          pup.y = 9999;
        }
      });
      powerupsRef.current = powerupsRef.current.filter((pup) => pup.y < CANVAS_HEIGHT);

      // Mettre à jour les particules
      particlesRef.current.forEach((part) => {
        part.x += part.vx * dt;
        part.y += part.vy * dt;
        part.life -= dt;
        part.alpha = Math.max(0, part.life / 25);
      });
      particlesRef.current = particlesRef.current.filter((part) => part.life > 0);

      // Condition de victoire ou passage au niveau suivant
      const activeBricks = bricksRef.current.filter((b) => !b.isHit);
      if (activeBricks.length === 0) {
        if (levelRef.current === 1) {
          setLevel(2);
          initBricks(2);
          paddleRef.current = { x: 350, y: 560, width: 100, height: 16 };
          ballsRef.current = [{ x: 400, y: 540, vx: 9, vy: -10, radius: 7, active: true, trail: [] }];
          powerupsRef.current = [];
          shakeRef.current = 10;
        } else {
          playSound('victory');
          setGameState("victory");
        }
      }
    };

    const drawGame = () => {
      ctx.save();
      if (shakeRef.current > 0) {
        const dx = (Math.random() - 0.5) * 4;
        const dy = (Math.random() - 0.5) * 4;
        ctx.translate(dx, dy);
        shakeRef.current = Math.max(0, shakeRef.current - 1);
      }

      // 1. Dessiner le fond pré-calculé en un seul appel ultra-rapide
      if (bgCanvasRef.current) {
        ctx.drawImage(bgCanvasRef.current, 0, 0);
      } else {
        ctx.fillStyle = "#000044";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      // 2. Dessiner les briques
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      bricksRef.current.forEach((brick) => {
        if (brick.isHit) return;

        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

        // Biseau haut/gauche rapide
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.fillRect(brick.x, brick.y, brick.width, 3);
        ctx.fillRect(brick.x, brick.y, 3, brick.height);

        // Biseau bas/droite rapide
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fillRect(brick.x, brick.y + brick.height - 3, brick.width, 3);
        ctx.fillRect(brick.x + brick.width - 3, brick.y, 3, brick.height);

        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillText(brick.text, brick.x + brick.width / 2, brick.y + brick.height / 2 + 0.5);
      });

      // 3. Raquette style capsule métallique (Arkanoid)
      const pad = paddleRef.current;
      ctx.fillStyle = "#d1d5db";
      ctx.fillRect(pad.x + pad.height / 2, pad.y, pad.width - pad.height, pad.height);
      ctx.fillStyle = "#f9fafb";
      ctx.fillRect(pad.x + pad.height / 2, pad.y, pad.width - pad.height, 4);
      ctx.fillStyle = "#4b5563";
      ctx.fillRect(pad.x + pad.height / 2, pad.y + pad.height - 4, pad.width - pad.height, 4);

      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(pad.x + pad.height / 2, pad.y + pad.height / 2, pad.height / 2, Math.PI / 2, Math.PI * 1.5);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(pad.x + pad.width - pad.height / 2, pad.y + pad.height / 2, pad.height / 2, Math.PI * 1.5, Math.PI / 2);
      ctx.fill();

      ctx.font = "bold 10px sans-serif";
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillText("CFDT", pad.x + pad.width / 2, pad.y + pad.height / 2 + 0.5);

      // 4. Dessiner les balles
      ballsRef.current.forEach((ball) => {
        if (!ball.active) return;

        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.beginPath();
        ctx.arc(ball.x + 3, ball.y + 3, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#22d3ee";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, ball.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Dessiner les tirs (bullets)
      ctx.fillStyle = "#ef4444";
      bulletsRef.current.forEach(b => {
        if (!b.active) return;
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });

      // 6. Dessiner les power-ups
      ctx.font = "bold 9px sans-serif";
      powerupsRef.current.forEach((pup) => {
        ctx.fillStyle = pup.color;
        ctx.fillRect(pup.x - pup.size, pup.y - pup.size / 2, pup.size, pup.size);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(pup.x, pup.y - pup.size / 2, pup.size, pup.size);
        ctx.fillStyle = "#000000";
        ctx.fillText(pup.label, pup.x, pup.y + 0.5);
      });

      // 7. Dessiner les particules (sans shadowBlur coûteux sur mobile)
      particlesRef.current.forEach((part) => {
        ctx.globalAlpha = part.alpha;
        ctx.fillStyle = part.color;
        ctx.fillRect(part.x - part.size / 2, part.y - part.size / 2, part.size, part.size);
      });
      ctx.globalAlpha = 1;

      ctx.restore();
    };

    const loop = (now: number) => {
      const elapsed = now - lastTime;
      lastTime = now;
      // Normaliser sur une base 60 FPS (16.667ms), plafonné pour éviter les sauts en cas d'onglet inactif
      const dt = Math.min(Math.max(elapsed / 16.667, 0.5), 2.5);
      updateGame(dt);
      drawGame();
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationId);
  }, [gameState, initBricks, playSound]);

  return (
    <div className="relative z-30 isolate min-h-screen flex flex-col pt-6 sm:pt-10 overflow-x-hidden font-sans" style={{background: 'linear-gradient(180deg, #050014 0%, #0a0028 100%)'}}>

      <div className="max-w-4xl mx-auto relative z-10 w-full px-2 sm:px-4">
        
        {/* Retour button */}
        <div className="absolute top-0 left-2 sm:top-2 sm:left-4 z-50">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border border-red-500/30 transition-all duration-200 group shrink-0"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour</span>
          </button>
        </div>

        {/* Title & Stats */}
        <div className="text-center mb-4 sm:mb-6 pt-11 sm:pt-2 animate-fade-in">
          <h1 className="text-2xl sm:text-5xl font-black tracking-widest mb-2 uppercase" style={{fontFamily: 'monospace', color: '#ff7900', textShadow: '0 0 25px rgba(255,121,0,0.6)'}}>
            CASSE-BRIQUE <span style={{color: '#cc00ff', textShadow: '0 0 25px rgba(204,0,255,0.7)'}}>CFDT</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold max-w-lg mx-auto mb-4 sm:mb-6 tracking-widest" style={{color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace'}}>
            LIBÉREZ VOS ACQUIS SOCIAUX — DÉTRUISEZ LES BRIQUES !
          </p>

          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-6 text-sm font-bold">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-mono text-xs shadow-md" style={{background: 'rgba(15,10,35,0.95)', border: '1px solid rgba(180,0,255,0.5)', color: '#d8b4fe', letterSpacing: '0.1em'}}>
              LEVEL <span className="text-white text-sm sm:text-base font-black ml-1">0{level}</span>
            </span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-mono text-xs shadow-md" style={{background: 'rgba(15,10,35,0.95)', border: '1px solid rgba(255,121,0,0.5)', color: '#fdba74', letterSpacing: '0.1em'}}>
              SCORE <span className="text-amber-400 text-sm sm:text-base font-black ml-1">{String(score).padStart(6, '0')}</span>
            </span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-mono text-xs flex items-center gap-2 shadow-md" style={{background: 'rgba(15,10,35,0.95)', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5', letterSpacing: '0.1em'}}>
              VIES
              <span className="flex gap-1">
                {Array.from({ length: Math.max(0, lives) }).map((_, idx) => (
                  <Heart key={idx} className="w-4 h-4 text-rose-500 fill-rose-500" />
                ))}
                {lives <= 0 && <span className="text-rose-500 font-bold text-xs">---</span>}
              </span>
            </span>
            {activePowerUp && (
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-mono text-xs flex items-center gap-1.5 animate-bounce" style={{background: 'rgba(255,121,0,0.2)', border: '1px solid rgba(255,121,0,0.6)', color: '#ff7900', letterSpacing: '0.08em'}}>
                <Zap className="w-3.5 h-3.5 fill-current" />
                {activePowerUp}
              </span>
            )}
          </div>
        </div>

        {/* Game Area Container (sans backdrop-blur coûteux sur mobile) */}
        <div className="max-w-5xl mx-auto rounded-3xl p-2.5 sm:p-6 relative overflow-hidden" style={{background: '#050214', border: '1px solid rgba(180,0,255,0.4)', boxShadow: '0 10px 30px rgba(0,0,0,0.6)'}}>
          
          {gameState === "ready" && (
            <div className="text-center py-12 sm:py-16 relative z-10 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform" style={{background: 'linear-gradient(135deg, rgba(255,121,0,0.3), rgba(204,0,255,0.3))', border: '2px solid rgba(255,121,0,0.6)', boxShadow: '0 0 35px rgba(255,121,0,0.4)'}}>
                <Activity className="w-10 h-10 text-amber-400" />
              </div>
              <h2 className="text-3xl font-black mb-3 tracking-widest uppercase" style={{fontFamily: 'monospace', color: '#ff7900', textShadow: '0 0 20px rgba(255,121,0,0.7)'}}>PRESS START</h2>
              <p className="max-w-md mx-auto mb-8 text-sm leading-relaxed" style={{color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace'}}>
                Dirigez la raquette <span style={{color: '#ff7900', fontWeight: 800}}>CFDT</span> avec la souris, le doigt ou les boutons tactiles. Attrapez les capsules bonus !
              </p>
              <button
                onClick={startNewGame}
                className="mx-auto px-8 sm:px-10 py-4 font-black rounded-full text-sm sm:text-base tracking-widest uppercase flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_0_35px_rgba(255,121,0,0.6)]"
                style={{fontFamily: 'monospace', background: 'linear-gradient(135deg, #ff7900, #e65c00)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)'}}
              >
                <Play className="w-6 h-6 fill-white" />
                DÉMARRER LA PARTIE
              </button>
            </div>
          )}

          {gameState === "gameover" && (
            <div className="text-center py-12 sm:py-16 relative z-10 animate-scale-up">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.5)', boxShadow: '0 0 30px rgba(239,68,68,0.3)'}}>
                <Heart className="w-10 h-10" style={{color: '#ef4444'}} />
              </div>
              <h2 className="text-3xl font-black mb-3 tracking-widest uppercase" style={{fontFamily: 'monospace', color: '#ef4444', textShadow: '0 0 20px #ef444466'}}>GAME OVER</h2>
              <p className="max-w-sm mx-auto mb-8 text-sm" style={{color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace'}}>
                SCORE FINAL : <span style={{color: '#ff7900', fontWeight: 700}}>{String(score).padStart(6, '0')}</span>
              </p>
              <button
                onClick={startNewGame}
                className="mx-auto px-10 py-3 font-black rounded text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                style={{fontFamily: 'monospace', background: 'linear-gradient(135deg, #ef4444, #991b1b)', color: '#fff', boxShadow: '0 0 30px rgba(239,68,68,0.4)', border: '1px solid rgba(239,68,68,0.5)'}}
              >
                <RotateCcw className="w-5 h-5" />
                TRY AGAIN
              </button>
            </div>
          )}

          {gameState === "victory" && (
            <div className="text-center py-12 sm:py-16 relative z-10 animate-scale-up">
              <Trophy className="w-20 h-20 mx-auto mb-6 animate-bounce" style={{color: '#facc15'}} />
              <h2 className="text-3xl font-black mb-3 tracking-widest uppercase" style={{fontFamily: 'monospace', color: '#facc15', textShadow: '0 0 20px #facc1566'}}>VICTOIRE !</h2>
              <p className="max-w-sm mx-auto mb-8 text-sm" style={{color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace'}}>
                SCORE FINAL : <span style={{color: '#22c55e', fontWeight: 700}}>{String(score).padStart(6, '0')}</span>
              </p>
              <button
                onClick={startNewGame}
                className="mx-auto px-10 py-3 font-black rounded text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                style={{fontFamily: 'monospace', background: 'linear-gradient(135deg, #facc15, #ca8a04)', color: '#000', boxShadow: '0 0 30px rgba(250,204,21,0.4)', border: '1px solid rgba(250,204,21,0.6)'}}
              >
                <RotateCcw className="w-5 h-5" />
                PLAY AGAIN
              </button>
            </div>
          )}

          {gameState === "playing" && (
            <div className="flex flex-col items-center">
              <div className="relative flex justify-center w-full">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  onMouseMove={handleMouseMove}
                  onTouchStart={handleTouchMove}
                  onTouchMove={handleTouchMove}
                  className="rounded-xl md:cursor-none w-full max-w-full h-auto block touch-none select-none"
                  style={{border: '2px solid rgba(180,0,255,0.35)'}}
                />
              </div>

              {/* Contrôles tactiles Smartphone / Tablette */}
              <div className="flex md:hidden gap-2.5 mt-3 w-full max-w-md select-none touch-none">
                <button
                  type="button"
                  onPointerDown={(e) => { e.preventDefault(); keysRef.current.left = true; }}
                  onPointerUp={() => { keysRef.current.left = false; }}
                  onPointerLeave={() => { keysRef.current.left = false; }}
                  onPointerCancel={() => { keysRef.current.left = false; }}
                  className="flex-1 py-3.5 bg-slate-900/90 active:bg-purple-900/60 border border-purple-500/40 rounded-2xl text-white font-black text-base flex items-center justify-center active:scale-95 transition-all shadow-lg"
                  aria-label="Gauche"
                >
                  ◀ GAUCHE
                </button>
                {activePowerUp?.includes("Tir") && (
                  <button
                    type="button"
                    onPointerDown={(e) => { e.preventDefault(); fireBullet(); }}
                    className="flex-1 py-3.5 bg-gradient-to-r from-rose-600 to-orange-600 active:from-rose-500 active:to-orange-500 border border-rose-400 rounded-2xl text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95 transition-all shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse"
                    aria-label="Tirer"
                  >
                    🔫 TIRER
                  </button>
                )}
                <button
                  type="button"
                  onPointerDown={(e) => { e.preventDefault(); keysRef.current.right = true; }}
                  onPointerUp={() => { keysRef.current.right = false; }}
                  onPointerLeave={() => { keysRef.current.right = false; }}
                  onPointerCancel={() => { keysRef.current.right = false; }}
                  className="flex-1 py-3.5 bg-slate-900/90 active:bg-purple-900/60 border border-purple-500/40 rounded-2xl text-white font-black text-base flex items-center justify-center active:scale-95 transition-all shadow-lg"
                  aria-label="Droite"
                >
                  DROITE ▶
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Game Instructions */}
        <div className="mt-4 sm:mt-6 p-4 rounded-xl text-xs font-mono flex items-start gap-3 max-w-2xl mx-auto" style={{background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,121,0,0.2)', color: 'rgba(255,255,255,0.4)'}}>
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{color: '#ff7900'}} />
          <div>
            <strong className="block mb-1" style={{color: '#ff7900', letterSpacing: '0.08em'}}>CONTROLS :</strong>
            GLISSER SUR L'ÉCRAN / BOUTONS TACTILES / SOURIS / FLÈCHES ←→ — ESPACE ou BOUTON = TIR | &#x2764; vie | ⇔ raquette large | ⏳ balle lente | 🔮 multi-balles | 🔫 mode tir
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-scale-up {
          animation: scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default CasseBrique;
