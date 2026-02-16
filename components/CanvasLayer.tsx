import React, { useRef, useEffect } from 'react';
import { GamePhase } from '../types';

interface CanvasLayerProps {
  active: boolean;
  phase: GamePhase;
  dropTrigger?: number; 
  onRoundComplete?: (success: boolean) => void;
}

interface SauceBox {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  borderColor: string;
  label: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  life: number;
  maxLife: number;
}

class HashBrown {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  angle: number;
  rotationSpeed: number;
  color: string;
  darkColor: string; 
  inBox: boolean;
  boxIndex: number | null;
  visible: boolean;
  isResting: boolean; 
  
  static GRAVITY = 0.5;

  constructor(startX: number, startY: number) {
    this.x = startX;
    this.y = startY;
    this.width = 65; 
    this.height = 45;
    this.color = '#FFC400'; 
    this.darkColor = '#B8860B'; 
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.rotationSpeed = 0;
    this.inBox = false;
    this.boxIndex = null;
    this.visible = false; 
    this.isResting = true;
  }

  reset(canvasWidth: number) {
    const offset = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 20);
    this.x = (canvasWidth / 2) + offset;
    this.y = -60; 
    this.vx = (Math.random() * 6) - 3; 
    this.vy = Math.random() * 5; 
    this.angle = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() * 0.2) - 0.1; 
    this.inBox = false;
    this.boxIndex = null;
    this.visible = true;
    this.isResting = false;
  }

  update(boxes: SauceBox[], canvasHeight: number): { landedInBox: number | null } {
    if (this.isResting || !this.visible) return { landedInBox: null };

    this.vy += HashBrown.GRAVITY;
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.rotationSpeed;

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      const hitX = box.x + 10;
      const hitY = box.y + 5;
      const hitW = box.width - 20;
      const hitH = box.height - 20;

      if (
        this.y > hitY && 
        this.y < hitY + hitH &&
        this.x > hitX &&
        this.x < hitX + hitW
      ) {
        this.inBox = true;
        this.boxIndex = i;
        this.vx = 0;
        this.vy = 0;
        this.rotationSpeed = 0;
        this.y = box.y + box.height / 2 - 5;
        this.x = Math.max(box.x + 20, Math.min(box.x + box.width - 20, this.x));
        this.isResting = true;
        return { landedInBox: i };
      }
    }

    if (this.y > canvasHeight + 100) {
       this.isResting = true;
    }

    return { landedInBox: null };
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.visible) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    const w = this.width / 2;
    const h = this.height / 2;
    const depth = 8; 
    const radius = 10; 

    ctx.fillStyle = this.darkColor;
    ctx.beginPath();
    ctx.roundRect(-w, -h + depth, this.width, this.height, radius);
    ctx.fill();

    ctx.fillRect(-w + radius, -h, this.width - 2 * radius, this.height + depth); 
    ctx.fillRect(-w, -h + radius, this.width, this.height - 2 * radius + depth); 

    ctx.fillStyle = this.color;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = this.inBox ? 2 : 10; 
    ctx.beginPath();
    ctx.roundRect(-w, -h, this.width, this.height, radius);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.ellipse(-w/3, -h/3, w/3, h/3, Math.PI/4, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
  }
}

export const CanvasLayer: React.FC<CanvasLayerProps> = ({ active, phase, dropTrigger, onRoundComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  // Game Objects
  const nuggetsRef = useRef<HashBrown[]>([]);
  const boxesRef = useRef<SauceBox[]>([]);
  const cloudsRef = useRef<{x:number, y:number, r:number, v:number}[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  
  // Seasoning Phase State
  const seasoningParticlesRef = useRef<Particle[]>([]);
  const seasoningStartTimeRef = useRef<number>(0);

  // Logic State
  const roundStateRef = useRef<'IDLE' | 'ACTIVE' | 'RESOLVING'>('IDLE');

  const spawnSplash = (x: number, y: number, color: string, count: number = 10, speed: number = 3) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const v = Math.random() * speed + 1;
      particlesRef.current.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * v,
        vy: Math.sin(angle) * v - 2, 
        radius: Math.random() * 3 + 2,
        color: color,
        life: 1.0,
        maxLife: 1.0
      });
    }
  };

  useEffect(() => {
    const initGameObjects = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // 1. Sauce Boxes
      const boxY = h * 0.55; 
      const boxWidth = Math.min(130, w * 0.35); 
      const boxHeight = 70;
      const spacing = 30;
      const totalWidth = (boxWidth * 2) + spacing;
      const startX = (w - totalWidth) / 2;

      boxesRef.current = [
        {
          x: startX,
          y: boxY,
          width: boxWidth,
          height: boxHeight,
          color: '#E65100', 
          borderColor: '#FFCCBC',
          label: '甜酸'
        },
        {
          x: startX + boxWidth + spacing,
          y: boxY,
          width: boxWidth,
          height: boxHeight,
          color: '#FDD835', 
          borderColor: '#FFF9C4',
          label: '蜂蜜'
        }
      ];

      // 2. Hash Browns
      if (nuggetsRef.current.length === 0) {
        nuggetsRef.current = [
          new HashBrown(w / 2 - 30, -100),
          new HashBrown(w / 2 + 30, -100)
        ];
      }

      // 3. Clouds
      if (cloudsRef.current.length === 0) {
        for(let i=0; i<8; i++) {
          cloudsRef.current.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: 50 + Math.random() * 100,
            v: (Math.random() - 0.5) * 0.2
          });
        }
      }
    };

    if (phase === GamePhase.SHAKE) {
      initGameObjects();
    } else if (phase === GamePhase.DRAW) {
      // Initialize Seasoning Timer
      seasoningStartTimeRef.current = Date.now();
      seasoningParticlesRef.current = [];
    } else if (phase === GamePhase.INPUT) {
      nuggetsRef.current = [];
      boxesRef.current = [];
      cloudsRef.current = [];
      particlesRef.current = [];
      seasoningParticlesRef.current = [];
      roundStateRef.current = 'IDLE';
    }

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        initGameObjects(); 
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [phase]);

  useEffect(() => {
    if (dropTrigger && dropTrigger > 0 && phase === GamePhase.SHAKE) {
      const w = window.innerWidth;
      nuggetsRef.current.forEach(nugget => nugget.reset(w));
      roundStateRef.current = 'ACTIVE';
      particlesRef.current = [];
    }
  }, [dropTrigger, phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (active && (phase === GamePhase.SHAKE || phase === GamePhase.DRAW)) {
        // --- 0. Clouds ---
        ctx.save();
        ctx.fillStyle = 'rgba(255, 215, 0, 0.05)';
        cloudsRef.current.forEach(cloud => {
          cloud.x += cloud.v; 
          if(cloud.x > canvas.width + cloud.r) cloud.x = -cloud.r;
          if(cloud.x < -cloud.r) cloud.x = canvas.width + cloud.r;
          ctx.beginPath();
          ctx.arc(cloud.x, cloud.y, cloud.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();

        // --- 1. Boxes ---
        boxesRef.current.forEach(box => {
          ctx.save();
          const depth = 10;
          const sauceMargin = 6;
          
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.beginPath();
          ctx.ellipse(box.x + box.width/2, box.y + box.height + 5, box.width/2, 10, 0, 0, Math.PI*2);
          ctx.fill();

          ctx.fillStyle = '#DDDDDD';
          ctx.beginPath();
          ctx.roundRect(box.x, box.y + depth, box.width, box.height, 10);
          ctx.fill();
          
          ctx.fillStyle = '#EEEEEE';
          ctx.beginPath();
          ctx.roundRect(box.x, box.y, box.width, box.height, 10);
          ctx.fill();

          ctx.fillStyle = box.color;
          ctx.beginPath();
          ctx.roundRect(box.x + sauceMargin, box.y + sauceMargin, box.width - sauceMargin*2, box.height - sauceMargin*2, 5);
          ctx.fill();
          
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.font = 'bold 14px "DotGothic16", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(box.label, box.x + box.width/2, box.y + box.height/2);
          ctx.restore();
        });

        // --- 2. Nuggets Logic (Only update physics in SHAKE phase, draw in both) ---
        if (phase === GamePhase.SHAKE && roundStateRef.current === 'ACTIVE') {
          let restingCount = 0;
          let inBoxCount = 0;

          nuggetsRef.current.forEach(nugget => {
             const result = nugget.update(boxesRef.current, canvas.height);
             
             if (result.landedInBox !== null && result.landedInBox !== undefined) {
               const box = boxesRef.current[result.landedInBox];
               spawnSplash(nugget.x, nugget.y, box.color, 15, 5);
             }

             if (nugget.isResting) restingCount++;
             if (nugget.inBox) inBoxCount++;
          });

          if (restingCount === nuggetsRef.current.length) {
            roundStateRef.current = 'RESOLVING';
            let success = false;
            if (inBoxCount === 2) {
              const b1 = nuggetsRef.current[0].boxIndex;
              const b2 = nuggetsRef.current[1].boxIndex;
              if (b1 !== b2) {
                success = true;
                nuggetsRef.current.forEach(n => {
                  if (n.boxIndex !== null) spawnSplash(n.x, n.y, '#FFD700', 30, 8);
                });
              }
            }
            setTimeout(() => {
              if (onRoundComplete) onRoundComplete(success);
              if (!success) {
                nuggetsRef.current.forEach(n => { n.visible = false; });
              }
            }, 800);
          }
        }

        nuggetsRef.current.forEach(nugget => nugget.draw(ctx));

        // --- 3. Splash Particles ---
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.life -= 0.02;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2; 
          
          if (p.life <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // --- 4. Seasoning Phase Particles ---
        if (phase === GamePhase.DRAW) {
           const now = Date.now();
           const elapsed = now - seasoningStartTimeRef.current;
           
           // Spawn Check: Wait 500ms for drop animation, then spawn for 1000ms
           if (elapsed > 500 && elapsed < 1500) { 
               
               const centerX = canvas.width / 2;
               // Packet is at fixed top 15% (0.15 * h).
               // Packet height is h-52 (208px).
               // Spawn Y should be approx at the opening of the packet.
               // 15% height + 180px
               const spawnY = (canvas.height * 0.15) + 180; 
               const spawnX = centerX; 

               for(let k=0; k<6; k++) { // Increased particle count
                   seasoningParticlesRef.current.push({
                       // Wide spread to cover both sauce boxes (approx 200px width)
                       x: spawnX + (Math.random() - 0.5) * 160, 
                       y: spawnY + (Math.random() * 10),
                       vx: (Math.random() * 2) - 1, 
                       vy: Math.random() * 5 + 5, 
                       radius: Math.random() * 2 + 1.5,
                       color: Math.random() > 0.4 ? '#E34234' : '#FFD700', 
                       life: 1.2,
                       maxLife: 1.2
                   });
               }
           }

           // Update Seasoning Particles
           for (let i = seasoningParticlesRef.current.length - 1; i >= 0; i--) {
               const p = seasoningParticlesRef.current[i];
               p.life -= 0.015;
               p.x += p.vx;
               p.y += p.vy;
               p.vy += 0.15; // Gravity
               
               // Turbulence
               p.x += Math.sin(p.y * 0.05) * 0.5;

               if (p.life <= 0 || p.y > canvas.height) {
                   seasoningParticlesRef.current.splice(i, 1);
                   continue;
               }

               ctx.save();
               ctx.globalAlpha = p.life;
               ctx.fillStyle = p.color;
               // Draw Square-ish powder
               ctx.fillRect(p.x, p.y, p.radius * 2, p.radius * 2);
               ctx.restore();
           }
        }
      }
      
      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [active, phase, onRoundComplete]);

  return (
    <div className={`
      absolute inset-0 pointer-events-none z-0 
      transition-opacity duration-500 
      ${active ? 'opacity-100' : 'opacity-0'}
      backdrop-blur-3xl bg-white/5
    `}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};