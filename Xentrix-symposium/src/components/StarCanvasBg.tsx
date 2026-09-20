import React, { useEffect, useRef } from 'react';

export const StarCanvasBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      return { w, h };
    };

    let { w, h } = setupCanvas();

    const handleResize = () => {
      const dim = setupCanvas();
      w = dim.w;
      h = dim.h;
    };

    window.addEventListener('resize', handleResize);

    // Mouse interactive radius
    const mouse = { x: -1000, y: -1000, r: 240 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Star Object Class
    class Star {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      twinkleSpeed: number;
      color: string;

      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2.8 + 1.2;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.alpha = Math.random() * 0.8 + 0.2;
        this.twinkleSpeed = (Math.random() * 0.025 + 0.008) * (Math.random() < 0.5 ? 1 : -1);

        const colors = [
          'rgba(168, 85, 247, ', // Electric Violet
          'rgba(59, 130, 246, ',  // Electric Blue
          'rgba(255, 255, 255, ', // Crisp White
          'rgba(129, 140, 248, ', // Indigo Blue
          'rgba(192, 132, 252, ', // Light Violet
          'rgba(56, 189, 248, ',  // Sky Cyan Blue
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;

        this.alpha += this.twinkleSpeed;
        if (this.alpha > 0.98 || this.alpha < 0.2) {
          this.twinkleSpeed = -this.twinkleSpeed;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${this.alpha})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Shooting Star Class
    class ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      active: boolean;

      constructor() {
        this.x = 0;
        this.y = 0;
        this.length = 0;
        this.speed = 0;
        this.angle = 0;
        this.active = false;
        this.reset();
      }

      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * (h / 2);
        this.length = Math.random() * 110 + 70;
        this.speed = Math.random() * 12 + 8;
        this.angle = Math.PI / 4;
        this.active = Math.random() < 0.4;
      }

      update() {
        if (!this.active) {
          if (Math.random() < 0.012) this.reset();
          return;
        }
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x > w || this.y > h) {
          this.active = false;
        }
      }

      draw() {
        if (!this.active || !ctx) return;
        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        grad.addColorStop(0, 'rgba(59, 130, 246, 1)');
        grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.7)');
        grad.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    }

    const starCount = Math.min(Math.floor(w / 6), 170);
    const stars: Star[] = Array.from({ length: starCount }, () => new Star());
    const shootingStars: ShootingStar[] = Array.from({ length: 4 }, () => new ShootingStar());

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // 1. Draw Deep Violet & Blue Space Background
      const spaceGrad = ctx.createLinearGradient(0, 0, w, h);
      spaceGrad.addColorStop(0, '#0F0C20');
      spaceGrad.addColorStop(0.35, '#1E1035');
      spaceGrad.addColorStop(0.7, '#2E1065');
      spaceGrad.addColorStop(1, '#0B091A');
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Draw Glowing Violet & Electric Blue Nebula Orbs
      ctx.save();
      ctx.beginPath();
      ctx.arc(w * 0.25, h * 0.35, 400, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(124, 58, 237, 0.35)';
      ctx.filter = 'blur(100px)';
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(w * 0.75, h * 0.65, 450, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(37, 99, 235, 0.3)';
      ctx.filter = 'blur(120px)';
      ctx.fill();
      ctx.restore();

      // 3. Draw & Connect Stars
      for (let i = 0; i < stars.length; i++) {
        const s1 = stars[i];
        s1.update();
        s1.draw();

        // Connect nearby stars with violet & blue constellation lines
        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 135) {
            const lineAlpha = (1 - dist / 135) * 0.3;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Mouse interactive laser constellation lines
        const mDx = s1.x - mouse.x;
        const mDy = s1.y - mouse.y;
        const mDist = Math.sqrt(mDx * mDx + mDy * mDy);

        if (mDist < mouse.r) {
          const mAlpha = (1 - mDist / mouse.r) * 0.65;
          ctx.beginPath();
          ctx.moveTo(s1.x, s1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${mAlpha})`;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }
      }

      // 4. Shooting Stars
      shootingStars.forEach((ss) => {
        ss.update();
        ss.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};
