import React, { useEffect, useRef } from 'react';

export default function InteractiveLaserCanvas({ isThermalRunaway = false }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const runawayRef = useRef(isThermalRunaway);

  useEffect(() => {
    runawayRef.current = isThermalRunaway;
  }, [isThermalRunaway]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX / width;
      mouseRef.current.targetY = e.clientY / height;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Laser Galvo Beams & Toolpath state
    const lasers = [
      {
        points: [
          { x: 0.2, y: 0.3 },
          { x: 0.45, y: 0.25 },
          { x: 0.6, y: 0.45 },
          { x: 0.35, y: 0.55 },
          { x: 0.2, y: 0.3 },
        ],
        currentSeg: 0,
        t: 0,
        speed: 0.008,
        color: '#00f0ff',
        trail: [],
      },
      {
        points: [
          { x: 0.7, y: 0.6 },
          { x: 0.85, y: 0.4 },
          { x: 0.9, y: 0.75 },
          { x: 0.65, y: 0.8 },
          { x: 0.7, y: 0.6 },
        ],
        currentSeg: 0,
        t: 0,
        speed: 0.012,
        color: '#ff9900',
        trail: [],
      },
      {
        points: [
          { x: 0.1, y: 0.7 },
          { x: 0.25, y: 0.85 },
          { x: 0.4, y: 0.78 },
          { x: 0.3, y: 0.65 },
          { x: 0.1, y: 0.7 },
        ],
        currentSeg: 0,
        t: 0,
        speed: 0.009,
        color: '#10b981',
        trail: [],
      },
    ];

    // Background floating wireframe nodes
    const nodes = [];
    for (let i = 0; i < 48; i++) {
      nodes.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 0.8 + 0.2,
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      const isPanic = runawayRef.current;

      // Smooth mouse inertia
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Clear Canvas
      ctx.fillStyle = isPanic
        ? `rgba(28, 4, 8, ${0.35 + Math.sin(time * 8) * 0.1})`
        : 'rgba(3, 7, 18, 0.4)';
      ctx.fillRect(0, 0, width, height);

      // Draw Perspective 3D Ground Grid (CNC Bed)
      const gridColor = isPanic ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 240, 255, 0.08)';
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      const horizon = height * 0.42;
      const vpX = width * 0.5 + (mx - 0.5) * 120;
      const vpY = horizon + (my - 0.5) * 60;

      // Perspective lines converging to vanishing point
      const numLines = 26;
      for (let i = 0; i <= numLines; i++) {
        const xBottom = (width / numLines) * i * 1.8 - width * 0.4;
        ctx.beginPath();
        ctx.moveTo(vpX, vpY);
        ctx.lineTo(xBottom, height);
        ctx.stroke();
      }

      // Horizontal perspective cross-grids
      for (let j = 1; j <= 14; j++) {
        const p = Math.pow(j / 14, 2.2);
        const yPos = horizon + (height - horizon) * p;
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(width, yPos);
        ctx.stroke();
      }

      // Draw CNC Toolpath Particles & Nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0) node.x = 1;
        if (node.x > 1) node.x = 0;
        if (node.y < 0) node.y = 1;
        if (node.y > 1) node.y = 0;

        const px = node.x * width + (mx - 0.5) * 30 * node.z;
        const py = node.y * height + (my - 0.5) * 30 * node.z;

        ctx.fillStyle = isPanic
          ? 'rgba(255, 100, 100, 0.6)'
          : node.z > 0.6
          ? 'rgba(0, 240, 255, 0.5)'
          : 'rgba(255, 153, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(px, py, node.z * 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Active Galvo Laser Traces & Beams
      lasers.forEach((laser) => {
        const p1 = laser.points[laser.currentSeg];
        const nextSeg = (laser.currentSeg + 1) % laser.points.length;
        const p2 = laser.points[nextSeg];

        laser.t += laser.speed * (isPanic ? 2.5 : 1.0);
        if (laser.t >= 1) {
          laser.t = 0;
          laser.currentSeg = nextSeg;
        }

        const headX = (p1.x + (p2.x - p1.x) * laser.t) * width + (mx - 0.5) * 40;
        const headY = (p1.y + (p2.y - p1.y) * laser.t) * height + (my - 0.5) * 40;

        laser.trail.push({ x: headX, y: headY, alpha: 1.0 });
        if (laser.trail.length > 35) {
          laser.trail.shift();
        }

        // Render toolpath guide polygon
        ctx.beginPath();
        ctx.strokeStyle = isPanic ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 240, 255, 0.12)';
        ctx.setLineDash([4, 6]);
        laser.points.forEach((pt, idx) => {
          const ptX = pt.x * width + (mx - 0.5) * 40;
          const ptY = pt.y * height + (my - 0.5) * 40;
          if (idx === 0) ctx.moveTo(ptX, ptY);
          else ctx.lineTo(ptX, ptY);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // Render Glowing Laser Trail
        if (laser.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(laser.trail[0].x, laser.trail[0].y);
          for (let i = 1; i < laser.trail.length; i++) {
            ctx.lineTo(laser.trail[i].x, laser.trail[i].y);
          }
          ctx.strokeStyle = isPanic ? '#ef4444' : laser.color;
          ctx.lineWidth = isPanic ? 3.5 : 2;
          ctx.shadowBlur = isPanic ? 25 : 14;
          ctx.shadowColor = isPanic ? '#ef4444' : laser.color;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Render Laser Head Firing Spot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(headX, headY, isPanic ? 4.5 : 3, 0, Math.PI * 2);
        ctx.fill();

        // Galvo Vector Beam from Virtual Overhead Mirror
        const galvoMirrorX = width * 0.5 + (mx - 0.5) * 80;
        const galvoMirrorY = -20;
        ctx.beginPath();
        ctx.moveTo(galvoMirrorX, galvoMirrorY);
        ctx.lineTo(headX, headY);
        ctx.strokeStyle = isPanic
          ? 'rgba(239, 68, 68, 0.35)'
          : laser.color === '#ff9900'
          ? 'rgba(255, 153, 0, 0.25)'
          : 'rgba(0, 240, 255, 0.25)';
        ctx.lineWidth = isPanic ? 1.5 : 0.8;
        ctx.stroke();
      });

      // If Thermal Runaway is active, render scanning warning grid lines & HUD noise
      if (isPanic) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.lineWidth = 1;
        const scanY = (time * 800) % height;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
      style={{ opacity: 0.95 }}
    />
  );
}
