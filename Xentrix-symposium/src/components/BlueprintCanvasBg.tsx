import React, { useEffect, useRef } from 'react';

export const BlueprintCanvasBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const setupCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = window.innerWidth;
      const cssHeight = window.innerHeight;

      // Set display size (css)
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      // Set actual render resolution (hardware pixels) for razor-sharp crispness
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);

      // Reset and scale context to DPR
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      return { width: cssWidth, height: cssHeight };
    };

    let { width, height } = setupCanvasSize();

    // Mouse tracking for interactive constellation effect
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 220,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      const dimensions = setupCanvasSize();
      width = dimensions.width;
      height = dimensions.height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Particle class for floating golden constellation dots
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1.2;
        this.alpha = Math.random() * 0.5 + 0.4;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 155, 60, ${this.alpha})`;
        ctx.fill(); // Crisp rendering without shadowBlur
      }
    }

    // Generate floating particle array based on screen width
    const particleCount = Math.min(Math.floor(width / 14), 100);
    const particles: Particle[] = Array.from({ length: particleCount }, () => new Particle());

    // CAD Blueprint Rotating Circles parameters
    let gearAngle = 0;

    // Main 60FPS animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      gearAngle += 0.0015; // Smooth slow gear rotation

      // 1. Draw crisp CAD background blueprint draft circles in viewport space
      ctx.save();
      ctx.translate(width * 0.12, height * 0.35);
      ctx.rotate(gearAngle);
      ctx.beginPath();
      ctx.arc(0, 0, 240, 0, Math.PI * 2);
      ctx.setLineDash([8, 12]);
      ctx.strokeStyle = 'rgba(109, 7, 26, 0.08)'; // Crisp Maroon line
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(width * 0.88, height * 0.65);
      ctx.rotate(-gearAngle * 1.5);
      ctx.beginPath();
      ctx.arc(0, 0, 300, 0, Math.PI * 2);
      ctx.setLineDash([12, 16]);
      ctx.strokeStyle = 'rgba(200, 155, 60, 0.09)'; // Crisp Gold line
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // 2. Update & draw floating particles and crisp golden constellation lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        // Connect nearby particles with razor-sharp gold dimension lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const lineAlpha = (1 - dist / 150) * 0.32;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(200, 155, 60, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Interactive mouse connection lines
        const mouseDx = p1.x - mouse.x;
        const mouseDy = p1.y - mouse.y;
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

        if (mouseDist < mouse.radius) {
          const mouseAlpha = (1 - mouseDist / mouse.radius) * 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(109, 7, 26, ${mouseAlpha})`; // Crisp Maroon laser cursor line
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
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
