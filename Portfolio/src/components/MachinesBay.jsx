import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Cpu,
  Tv,
  Code2,
  Terminal,
  Flame,
  Check,
  Copy,
  ExternalLink,
  GitBranch,
  Activity,
  Zap,
  FileCode2,
  Scan,
  SunMedium,
  Target
} from 'lucide-react';
import ScrambleText from './ScrambleText';
import { soundEngine } from '../utils/soundEngine';
import BlueprintDrawer from './BlueprintDrawer';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// ⚠️ HARDWARE MEDIA DROP-ZONES
// Replace 'null' with your video/gif path (e.g. "/videos/barc_bridge.mp4")
// When null, the system automatically runs the high-fidelity interactive digital twin simulation!
// ============================================================================
const HARDWARE_MEDIA_DROPZONE = {
  machine01_barc: null,      // BARC High-Precision Bridge
  machine02_svnit: null,     // SVNIT 16-Channel Thermal DAQ
  machine03_bio4d: null,     // Bio4D V2 & InkPrinter
  machine04_swpsms: null,    // SP2L-SWPSMS Wafer Scribing
  machine05_lsm: null,       // SP2L-LSM Solar Scribing
  machine06_lem: null,       // SP2L-LEM Fiber Laser
  machine07_tc: null,        // SP2L-TC LWIR Camera
  machine08_ltwis: null,     // SP2L-LTWIS Lock-In NDT
};

// ============================================================================
// VISUALIZER 01: BARC High-Precision Capacitance & Impedance Bridge
// ============================================================================
function BarcBridgeVisualizer() {
  const [capacitance, setCapacitance] = useState(0.428);
  const [nullVoltage, setNullVoltage] = useState(0.002);
  const [inPhase, setInPhase] = useState(99.4);
  const canvasRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCapacitance(Number((0.428 + (Math.random() * 0.004 - 0.002)).toFixed(4)));
      setNullVoltage(Number((Math.random() * 0.003).toFixed(4)));
      setInPhase(Number((99.2 + Math.random() * 0.6).toFixed(1)));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const render = () => {
      t += 0.05;
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = 'rgba(2, 6, 18, 0.4)';
      ctx.fillRect(0, 0, w, h);

      // Reference carrier wave (Cyan)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = h * 0.35 + Math.sin(x * 0.04 + t) * (h * 0.22);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Lock-In Demodulated Vector (Amber)
      ctx.strokeStyle = 'rgba(255, 170, 0, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = h * 0.68 + Math.cos(x * 0.04 + t) * (h * 0.18);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Center baseline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, h * 0.35);
      ctx.lineTo(w, h * 0.35);
      ctx.moveTo(0, h * 0.68);
      ctx.lineTo(w, h * 0.68);
      ctx.stroke();
      ctx.setLineDash([]);

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between font-mono">
      <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-cyan-500/20">
        <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          BARC SUB-pF IMPEDANCE BRIDGE // LOCK-IN PHASE DETECTION
        </span>
        <span className="text-emerald-400 font-bold text-[11px]">NULL_BALANCE: LOCKED</span>
      </div>

      <div className="relative my-2 rounded border border-cyan-500/30 overflow-hidden bg-black/80 h-[175px]">
        <canvas ref={canvasRef} width={420} height={175} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 flex items-center gap-2 text-[10px] bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-cyan-300">CARRIER (100kHz)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-2" />
          <span className="text-amber-300">PSD DEMOD</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-slate-900/85 p-2 rounded border border-cyan-500/30 text-[11px]">
        <div className="text-center p-1 rounded bg-black/50 border border-slate-800">
          <div className="text-[9px] text-slate-400">MEASURED CAPACITANCE</div>
          <div className="text-sm font-bold text-cyan-300">{capacitance} pF</div>
        </div>
        <div className="text-center p-1 rounded bg-black/50 border border-slate-800">
          <div className="text-[9px] text-slate-400">NULL DETECTOR ΔV</div>
          <div className="text-sm font-bold text-emerald-400">{nullVoltage} mV</div>
        </div>
        <div className="text-center p-1 rounded bg-black/50 border border-slate-800">
          <div className="text-[9px] text-slate-400">PHASE SENSITIVITY</div>
          <div className="text-sm font-bold text-amber-400">{inPhase}%</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VISUALIZER 02: SVNIT 16-Channel Thermal Management & Safety Watchdog
// ============================================================================
function ThermalHeatmapMatrix() {
  const [nodes, setNodes] = useState([
    { id: 1, temp: 31.4, ch: 'ADC_CH0' }, { id: 2, temp: 36.2, ch: 'ADC_CH1' },
    { id: 3, temp: 42.8, ch: 'ADC_CH2' }, { id: 4, temp: 48.5, ch: 'ADC_CH3' },
    { id: 5, temp: 34.1, ch: 'ADC_CH4' }, { id: 6, temp: 58.2, ch: 'ADC_CH5' },
    { id: 7, temp: 72.4, ch: 'ADC_CH6' }, { id: 8, temp: 64.1, ch: 'ADC_CH7' },
    { id: 9, temp: 33.7, ch: 'ADC_CH8' }, { id: 10, temp: 68.9, ch: 'ADC_CH9' },
    { id: 11, temp: 84.3, ch: 'ADC_CH10' }, { id: 12, temp: 59.7, ch: 'ADC_CH11' },
    { id: 13, temp: 29.8, ch: 'ADC_CH12' }, { id: 14, temp: 44.5, ch: 'ADC_CH13' },
    { id: 15, temp: 51.2, ch: 'ADC_CH14' }, { id: 16, temp: 38.0, ch: 'ADC_CH15' },
  ]);
  const [activeNode, setActiveNode] = useState(nodes[10]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          temp: Number((node.temp + (Math.random() * 0.8 - 0.4)).toFixed(1)),
        }))
      );
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const getNodeColor = (temp) => {
    if (temp > 75) return 'bg-red-500/80 text-red-100 border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.5)]';
    if (temp > 60) return 'bg-amber-500/80 text-amber-100 border-amber-400 shadow-[0_0_10px_rgba(255,153,0,0.5)]';
    if (temp > 45) return 'bg-yellow-500/60 text-yellow-100 border-yellow-400';
    if (temp > 35) return 'bg-cyan-600/60 text-cyan-100 border-cyan-400';
    return 'bg-blue-600/40 text-blue-200 border-blue-500';
  };

  return (
    <div className="flex flex-col h-full justify-between font-mono">
      <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-cyan-500/20">
        <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          16-CH DMA THERMAL MATRIX // IWDG INTERLOCK
        </span>
        <span>SCAN: 2000 SPS // 12-BIT ADC</span>
      </div>

      <div className="grid grid-cols-4 gap-2 my-2.5">
        {nodes.map((node) => (
          <div
            key={node.id}
            onMouseEnter={() => {
              setActiveNode(node);
              soundEngine.playHoverBlip();
            }}
            className={`p-1.5 sm:p-2 rounded border text-center transition-all cursor-pointer select-none ${getNodeColor(
              node.temp
            )} ${activeNode.id === node.id ? 'ring-2 ring-white scale-105' : 'hover:scale-102'}`}
          >
            <div className="text-[8px] sm:text-[9px] opacity-75">{node.ch}</div>
            <div className="text-xs sm:text-sm font-bold">{node.temp}°C</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/85 p-2 rounded border border-cyan-500/30 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">INSPECTING: <strong className="text-cyan-300">{activeNode.ch}</strong></span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-slate-400">VAL: <span className="text-white font-bold">{activeNode.temp}°C</span></span>
          <span className="text-slate-400 hidden sm:inline">RES: <span className="text-amber-400">10.2kΩ</span></span>
          <span className="text-emerald-400 font-bold">DMA_OK</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VISUALIZER 03: Bio4D V2 & InkPrinter — 100Hz Closed-Loop Extruder
// ============================================================================
function BioScaffoldVisualizer() {
  const canvasRef = useRef(null);
  const [pressure, setPressure] = useState(342.5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const render = () => {
      t += 0.03;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = 'rgba(4, 9, 18, 0.5)';
      ctx.fillRect(0, 0, w, h);

      // Isometric scaffold bed
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1;
      const centerX = w / 2;
      const centerY = h * 0.7;

      for (let i = -4; i <= 4; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX + i * 28 - 112, centerY - i * 14);
        ctx.lineTo(centerX + i * 28, centerY + 56 - i * 14);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX - i * 28, centerY - 56 + i * 14);
        ctx.lineTo(centerX - i * 28 + 112, centerY + i * 14);
        ctx.stroke();
      }

      // Bioprinting extrusion toolpath spiral
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f0ff';
      ctx.beginPath();

      const layers = 3;
      const points = 80;
      for (let l = 0; l < layers; l++) {
        const layerY = centerY - 15 - l * 18;
        for (let p = 0; p <= points; p++) {
          const angle = (p / points) * Math.PI * 4 + t;
          const r = 20 + Math.sin(angle * 3) * 8 + (p / points) * 15;
          const x = centerX + Math.cos(angle) * r * 1.5;
          const y = layerY + Math.sin(angle) * r * 0.6;
          if (p === 0 && l === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPressure(Number((342.5 + (Math.random() * 2.4 - 1.2)).toFixed(1)));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between font-mono">
      <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-cyan-500/20">
        <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          100Hz CLOSED-LOOP PNEUMATIC EXTRUSION
        </span>
        <span className="text-emerald-400 font-bold text-[11px]">MPX5700 TRANSDUCER</span>
      </div>

      <div className="relative my-2 rounded border border-cyan-500/30 overflow-hidden bg-black/80 h-[175px]">
        <canvas ref={canvasRef} width={420} height={175} className="w-full h-full object-cover" />
      </div>

      <div className="bg-slate-900/85 p-2 rounded border border-cyan-500/30 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-300">PNEUMATIC TRANSDUCER: <strong className="text-cyan-300">{pressure} kPa</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">PID FREQ: <strong className="text-amber-400">100 Hz</strong></span>
          <span className="text-emerald-400 font-bold">M118_LOCKED</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VISUALIZER 04: SP2L-SWPSMS Semiconductor Wafer Patterning & Scribing
// ============================================================================
function WaferLaserVisualizer() {
  const canvasRef = useRef(null);
  const [pulseCount, setPulseCount] = useState(482910);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const render = () => {
      t += 0.04;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.42;

      ctx.fillStyle = 'rgba(2, 6, 18, 0.5)';
      ctx.fillRect(0, 0, w, h);

      // Wafer Disk (Silicon Metallic Disc)
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
      grad.addColorStop(0, '#0a1d37');
      grad.addColorStop(0.85, '#051020');
      grad.addColorStop(1, '#00f0ff');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Wafer flat notch
      ctx.fillStyle = '#020612';
      ctx.beginPath();
      ctx.arc(cx, cy - radius, 8, 0, Math.PI * 2);
      ctx.fill();

      // Die Grid Matrix on Wafer
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.lineWidth = 1;
      const dieStep = 18;
      for (let x = -radius + 15; x <= radius - 15; x += dieStep) {
        ctx.beginPath();
        ctx.moveTo(cx + x, cy - Math.sqrt(Math.max(0, radius * radius - x * x)));
        ctx.lineTo(cx + x, cy + Math.sqrt(Math.max(0, radius * radius - x * x)));
        ctx.stroke();
      }
      for (let y = -radius + 15; y <= radius - 15; y += dieStep) {
        ctx.beginPath();
        ctx.moveTo(cx - Math.sqrt(Math.max(0, radius * radius - y * y)), cy + y);
        ctx.lineTo(cx + Math.sqrt(Math.max(0, radius * radius - y * y)), cy + y);
        ctx.stroke();
      }

      // Active Laser Scribing Spot (>5kW NIR Pulse Simulation)
      const beamX = cx + Math.sin(t * 1.8) * (radius * 0.65);
      const beamY = cy + Math.cos(t * 2.4) * (radius * 0.65);

      // Laser Glow
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(beamX, beamY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Galvo targeting reticle
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(beamX, beamY, 10, 0, Math.PI * 2);
      ctx.moveTo(beamX - 14, beamY);
      ctx.lineTo(beamX + 14, beamY);
      ctx.moveTo(beamX, beamY - 14);
      ctx.lineTo(beamX, beamY + 14);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount((c) => c + 1250);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between font-mono">
      <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-cyan-500/20">
        <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <Target className="w-3.5 h-3.5 text-red-400" />
          SP2L-SWPSMS // WAFER SCRIBING &amp; MARKING (&gt;5kW NIR)
        </span>
        <span className="text-amber-400 font-bold text-[11px]">DB25 &lt;1.0µs GATING</span>
      </div>

      <div className="relative my-2 rounded border border-cyan-500/30 overflow-hidden bg-black/80 h-[175px]">
        <canvas ref={canvasRef} width={420} height={175} className="w-full h-full object-cover" />
      </div>

      <div className="bg-slate-900/85 p-2 rounded border border-cyan-500/30 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          <span className="text-slate-300">PULSE ACCUMULATOR: <strong className="text-cyan-300">{pulseCount.toLocaleString()}</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">SUBSTRATE: <strong className="text-white">Si / III-V Wafer</strong></span>
          <span className="text-emerald-400 font-bold">MARKEZD_OK</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VISUALIZER 05: SP2L-LSM Photovoltaic Solar Cell Laser Scribing
// ============================================================================
function SolarScribeVisualizer() {
  const [activeWavelength, setActiveWavelength] = useState('532 nm');
  const activeTrench = activeWavelength === '1064 nm' ? 'P1 TRENCH' : activeWavelength === '532 nm' ? 'P2 TRENCH' : 'P3 TRENCH';
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const render = () => {
      t += 0.05;
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = 'rgba(2, 6, 18, 0.5)';
      ctx.fillRect(0, 0, w, h);

      // Solar Cell Substrate (Perovskite / FTO / ITO)
      ctx.fillStyle = '#061325';
      ctx.fillRect(20, 20, w - 40, h - 40);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
      ctx.strokeRect(20, 20, w - 40, h - 40);

      // P1, P2, P3 Parallel Scribe Lines
      const colors = {
        '1064 nm': '#ef4444',
        '532 nm': '#10b981',
        '355 nm': '#a855f7',
      };
      const scribeColor = colors[activeWavelength] || '#10b981';

      ctx.lineWidth = 1.5;
      for (let y = 35; y < h - 35; y += 18) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.moveTo(25, y);
        ctx.lineTo(w - 25, y);
        ctx.stroke();
      }

      // Live Laser Cutting Head Moving along Trench
      const headX = 30 + ((t * 90) % (w - 60));
      const headY = 35 + (Math.floor((t * 90) / (w - 60)) % 6) * 18;

      ctx.strokeStyle = scribeColor;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = scribeColor;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(25, headY);
      ctx.lineTo(headX, headY);
      ctx.stroke();

      // Focal Spot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(headX, headY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [activeWavelength]);

  return (
    <div className="flex flex-col h-full justify-between font-mono">
      <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-cyan-500/20">
        <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <SunMedium className="w-3.5 h-3.5 text-emerald-400" />
          SP2L-LSM // PHOTOVOLTAIC SCRIBING (P1/P2/P3 DPSS)
        </span>
        <div className="flex items-center gap-1 text-[10px]">
          {['1064 nm', '532 nm', '355 nm'].map((w) => (
            <button
              key={w}
              onClick={() => setActiveWavelength(w)}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                activeWavelength === w ? 'bg-cyan-500 text-black font-bold' : 'bg-slate-900 text-slate-400'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div className="relative my-2 rounded border border-cyan-500/30 overflow-hidden bg-black/80 h-[175px]">
        <canvas ref={canvasRef} width={420} height={175} className="w-full h-full object-cover" />
      </div>

      <div className="bg-slate-900/85 p-2 rounded border border-cyan-500/30 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">ACTIVE STAGE: <strong className="text-cyan-300">300 × 300 mm (X-Y)</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">TRENCH: <strong className="text-amber-400">{activeTrench}</strong></span>
          <span className="text-emerald-400 font-bold">CLASS_1_SAFE</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VISUALIZER 06: SP2L-LEM / LMM-FL Industrial Fiber Laser Marking
// ============================================================================
function FiberLaserVisualizer() {
  const canvasRef = useRef(null);
  const markSpeed = 2500;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const render = () => {
      t += 0.08;
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = 'rgba(2, 6, 18, 0.45)';
      ctx.fillRect(0, 0, w, h);

      // Industrial Metal Specimen
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
      ctx.fillRect(30, 25, w - 60, h - 50);
      ctx.strokeRect(30, 25, w - 60, h - 50);

      // High-Speed Hatching Vectors
      ctx.strokeStyle = 'rgba(255, 170, 0, 0.85)';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#ffaa00';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      const cx = w / 2;
      const cy = h / 2;
      for (let i = 0; i < 7; i++) {
        const offset = (Math.sin(t + i * 0.4) * 40);
        ctx.moveTo(cx - 70 + offset, cy - 30 + i * 10);
        ctx.lineTo(cx + 70 + offset, cy - 30 + i * 10);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Laser Beam Head (Galvo Reflection)
      const headX = cx + Math.sin(t * 3) * 60;
      const headY = cy + Math.cos(t * 4) * 35;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(headX, headY, 3, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between font-mono">
      <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-cyan-500/20">
        <span className="flex items-center gap-1.5 text-amber-400 font-bold">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          SP2L-LEM // IPG PHOTONICS FIBER LASER (20W–100W)
        </span>
        <span className="text-cyan-400 font-bold text-[11px]">MOTF KINEMATICS</span>
      </div>

      <div className="relative my-2 rounded border border-cyan-500/30 overflow-hidden bg-black/80 h-[175px]">
        <canvas ref={canvasRef} width={420} height={175} className="w-full h-full object-cover" />
      </div>

      <div className="bg-slate-900/85 p-2 rounded border border-cyan-500/30 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-slate-300">VECTOR SPEED: <strong className="text-amber-300">{markSpeed} mm/s</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">SPOT SIZE: <strong className="text-white">≤ 20 µm</strong></span>
          <span className="text-emerald-400 font-bold">IPG_SYNCED</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VISUALIZER 07: SP2L-TC High-Resolution LWIR Radiometric Thermography Camera
// ============================================================================
function LwirThermographyVisualizer() {
  const canvasRef = useRef(null);
  const [spotTemp, setSpotTemp] = useState(384.2);
  const [maxTemp, setMaxTemp] = useState(628.7);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const render = () => {
      t += 0.03;
      const w = canvas.width;
      const h = canvas.height;

      // Draw synthetic LWIR thermal false-color field (Ironbow)
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;

      for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
          const dx = (x - w / 2) / (w / 2);
          const dy = (y - h / 2) / (h / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          const noise = Math.sin(x * 0.08 + t) * Math.cos(y * 0.08 - t) * 0.25;
          const heat = Math.max(0, Math.min(1, 1 - dist + noise));

          // False-color gradient mapping
          let r = 0, g = 0, b = 0;
          if (heat < 0.35) {
            b = Math.floor(heat * 3 * 255);
          } else if (heat < 0.7) {
            r = Math.floor((heat - 0.35) * 3 * 255);
            b = Math.floor((1 - (heat - 0.35) * 3) * 200);
          } else {
            r = 255;
            g = Math.floor((heat - 0.7) * 3 * 255);
            b = Math.floor((heat - 0.7) * 3 * 100);
          }

          const idx = (y * w + x) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;

          // Block fill 2x2 for thermal pixel look
          data[idx + 4] = r; data[idx + 5] = g; data[idx + 6] = b; data[idx + 7] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // Reticle spot measurement crosshair
      const crossX = w * 0.48;
      const crossY = h * 0.45;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(crossX, crossY, 8, 0, Math.PI * 2);
      ctx.moveTo(crossX - 12, crossY); ctx.lineTo(crossX + 12, crossY);
      ctx.moveTo(crossX, crossY - 12); ctx.lineTo(crossX, crossY + 12);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpotTemp(Number((384.2 + (Math.random() * 3.2 - 1.6)).toFixed(1)));
      setMaxTemp(Number((628.7 + (Math.random() * 4.1 - 2.0)).toFixed(1)));
    }, 350);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between font-mono">
      <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-cyan-500/20">
        <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <Scan className="w-3.5 h-3.5 text-cyan-400" />
          SP2L-TC // LWIR RADIOMETRIC THERMOGRAPHY (8–14 µm)
        </span>
        <span className="text-emerald-400 font-bold text-[11px]">100 MBIT ETHERNET DAQ</span>
      </div>

      <div className="relative my-2 rounded border border-cyan-500/30 overflow-hidden bg-black/80 h-[175px]">
        <canvas ref={canvasRef} width={280} height={175} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 border border-red-500/40 text-[10px] text-red-400">
          MAX: {maxTemp} °C
        </div>
      </div>

      <div className="bg-slate-900/85 p-2 rounded border border-cyan-500/30 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-300">RETICLE SPOT: <strong className="text-cyan-300">{spotTemp} °C</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">RANGE: <strong className="text-amber-400">-20 ... 1000 °C</strong></span>
          <span className="text-emerald-400 font-bold">640×480 RAW</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VISUALIZER 08: SP2L-LTWIS Lock-In NDT Thermography & Micro-Texturing
// ============================================================================
function LockInNdtVisualizer() {
  const canvasRef = useRef(null);
  const [phaseAngle, setPhaseAngle] = useState(47.3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const render = () => {
      t += 0.05;
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = 'rgba(2, 6, 18, 0.45)';
      ctx.fillRect(0, 0, w, h);

      // Welded Specimen Seam
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(20, 20, w - 40, h - 40);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeRect(20, 20, w - 40, h - 40);

      // Central Weld Seam
      ctx.strokeStyle = 'rgba(255, 170, 0, 0.4)';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(20, h / 2);
      ctx.lineTo(w - 20, h / 2);
      ctx.stroke();

      // Dual 50W Modulated Heating Beams (808–1064 nm)
      const laserX1 = w * 0.35 + Math.sin(t) * 20;
      const laserX2 = w * 0.65 - Math.sin(t) * 20;
      const laserY = h / 2;

      ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(laserX1, laserY, 8, 0, Math.PI * 2);
      ctx.arc(laserX2, laserY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Sub-Surface Defect Heat Wave Propagation
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
      ctx.lineWidth = 1.5;
      const waveRadius = ((t * 25) % 45);
      ctx.beginPath();
      ctx.arc(w * 0.5, h / 2, waveRadius, 0, Math.PI * 2);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseAngle(Number((47.3 + (Math.random() * 1.2 - 0.6)).toFixed(1)));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between font-mono">
      <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-cyan-500/20">
        <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <Activity className="w-3.5 h-3.5 text-red-400" />
          SP2L-LTWIS // 2×50W LOCK-IN NDT THERMOGRAPHY
        </span>
        <span className="text-emerald-400 font-bold text-[11px]">DEFECT: DETECTED</span>
      </div>

      <div className="relative my-2 rounded border border-cyan-500/30 overflow-hidden bg-black/80 h-[175px]">
        <canvas ref={canvasRef} width={420} height={175} className="w-full h-full object-cover" />
      </div>

      <div className="bg-slate-900/85 p-2 rounded border border-cyan-500/30 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          <span className="text-slate-300">THERMAL PHASE ANGLE: <strong className="text-amber-300">{phaseAngle}°</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">DEPTH: <strong className="text-white">1.85 mm Sub-Surface</strong></span>
          <span className="text-emerald-400 font-bold">PHASE_LOCKED</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BARE-METAL C++ & EMBEDDED CODE ARCHITECTURE FOR ALL 8 MACHINES
// ============================================================================
const BARE_METAL_CODE = {
  '01': {
    filename: 'barc_lockin_impedance_bridge.cpp',
    lang: 'C++ // LOCK-IN AFE & PHASE DETECTION',
    lines: 34,
    code: `// ============================================================================
// BARC High-Precision Sub-Picofarad Bridge: Lock-In Phase Sensitive Detection
// ============================================================================
#include <cstdint>
#include <cmath>

class BarcLockInImpedanceBridge {
    static constexpr float CARRIER_FREQ_HZ = 100000.0f; // 100 kHz bridge carrier
    static constexpr float ADC_LSB_VOLTS   = 3.3f / 16777216.0f; // 24-bit Sigma-Delta
    float in_phase_accum = 0.0f;
    float quad_accum = 0.0f;
    uint32_t sample_idx = 0;

public:
    void ProcessBridgeSampleISR(int32_t raw_adc_sample) {
        float v_sample = raw_adc_sample * ADC_LSB_VOLTS;
        float ref_phase = (sample_idx % 64) * (2.0f * M_PI / 64.0f);
        
        // Phase-Sensitive Demodulation (PSD)
        in_phase_accum += v_sample * cosf(ref_phase);
        quad_accum     += v_sample * sinf(ref_phase);
        sample_idx++;
        
        if (sample_idx >= 4096) { // 4096-sample coherent averaging
            float magnitude = sqrtf(in_phase_accum * in_phase_accum + quad_accum * quad_accum);
            float capacitance_pF = CalculateSubPicoFarad(magnitude);
            TransmitPySide6Telemetry(capacitance_pF, in_phase_accum, quad_accum);
            in_phase_accum = quad_accum = 0.0f;
            sample_idx = 0;
        }
    }
};`,
  },
  '02': {
    filename: 'svnit_thermal_dma_watchdog.cpp',
    lang: 'STM32 BARE-METAL C++ // DMA & WATCHDOG',
    lines: 33,
    code: `// ============================================================================
// SVNIT 16-Channel Thermal DAQ: Non-Blocking Circular DMA & IWDG Cutoff
// ============================================================================
#include "stm32f4xx_hal.h"

class ThermalSafetyEngine {
    static constexpr uint8_t CHANNELS = 16;
    static constexpr float CRITICAL_TEMP_C = 85.0f;
    alignas(32) uint16_t adc_dma_buffer[CHANNELS * 4]; // Circular 4x Oversampling
    
public:
    void InitHardwareInterlocks() {
        // Armed hardware Independent Watchdog (IWDG) trip register
        IWDG->KR = 0x5555; // Enable PR & RLR write
        IWDG->PR = IWDG_PR_PR_2; // Divisor 64 -> ~500us trip window
        IWDG->RLR = 0x0FFF;
        IWDG->KR = 0xCCCC; // Start Watchdog
    }

    void HAL_ADC_ConvCpltCallback(ADC_HandleTypeDef* hadc) {
        for (uint8_t ch = 0; ch < CHANNELS; ch++) {
            float temp_c = ConvertSteinhartHart(adc_dma_buffer[ch]);
            if (temp_c > CRITICAL_TEMP_C) {
                // Hard emergency shutdown within <500 microseconds
                HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);
                TriggerPanicTelemetry(ch, temp_c);
                while (1) { /* Force IWDG Hardware Reset */ }
            }
        }
        IWDG->KR = 0xAAAA; // Refresh Watchdog
    }
};`,
  },
  '03': {
    filename: 'bio4d_pneumatic_pid_lockstep.cpp',
    lang: 'C++ // 100Hz TIM6 ISR & M118 SERIAL',
    lines: 34,
    code: `// ============================================================================
// Bio4D V2 & InkPrinter: 100Hz Closed-Loop Pneumatic PID & M118 Dual-MCU Sync
// ============================================================================
#include "stm32f4xx_hal.h"

struct PIDGains { float Kp = 2.45f, Ki = 0.85f, Kd = 0.12f; };

class PneumaticExtrusionController {
    PIDGains gains;
    float integral_accum = 0.0f, prev_error = 0.0f;
    float target_kpa = 340.0f;

public:
    void TIM6_DAC_IRQHandler() { // Deterministic 100Hz Interrupt (10ms)
        if (__HAL_TIM_GET_FLAG(&htim6, TIM_FLAG_UPDATE)) {
            __HAL_TIM_CLEAR_FLAG(&htim6, TIM_FLAG_UPDATE);
            
            float current_kpa = ReadMPX5700PressureTransducer();
            float error = target_kpa - current_kpa;
            
            integral_accum += error * 0.010f; // Anti-windup clamped
            float derivative = (error - prev_error) / 0.010f;
            float output_pwm = gains.Kp * error + gains.Ki * integral_accum + gains.Kd * derivative;
            
            __HAL_TIM_SET_COMPARE(&htim1, TIM_CHANNEL_1, (uint32_t)output_pwm);
            prev_error = error;
            
            // Bidirectional M118 lockstep sync with PyOpenGL twin
            SendM118SyncFrame(current_kpa, target_kpa);
        }
    }
};`,
  },
  '04': {
    filename: 'sp2l_wafer_galvo_controller.cpp',
    lang: 'C++ // WIN32 MARKEZD.DLL & DB25',
    lines: 32,
    code: `// ============================================================================
// SP2L-SWPSMS: Semiconductor Wafer Scribing Controller (>5kW NIR Gating)
// ============================================================================
#include <windows.h>
#include "MarkEzd.h"

class SemiconductorWaferScriber {
    HANDLE hParallelPort;
    LARGE_INTEGER perfFreq, lastPulse;

public:
    void InitializeWaferLaser() {
        LmrInit(); // Bind Win32 MarkEzd.dll kernel driver
        hParallelPort = CreateFileA("\\\\.\\LPT1", GENERIC_WRITE, 0, NULL, OPEN_EXISTING, 0, NULL);
        QueryPerformanceFrequency(&perfFreq);
    }

    void ScribeSiliconDieStreet(float start_x, float start_y, float end_x, float end_y) {
        LmrSetLaserPower(95.0); // > 5 kW Peak Power NIR Burst
        LmrSetGalvoSpeed(2200.0); // 2,200 mm/s high-speed tracking
        
        // Sub-microsecond DB25 Pin 14 hardware gating
        LmrMoveTo(start_x, start_y);
        SetPortPin14(HIGH); // Microsecond hardware laser gate enable
        LmrMarkTo(end_x, end_y);
        SetPortPin14(LOW);  // Immediate quench to prevent silicon thermal haze
    }
};`,
  },
  '05': {
    filename: 'sp2l_dpss_solar_scriber.cpp',
    lang: 'C++ // MULTI-WAVELENGTH DPSS & 300x300mm STAGE',
    lines: 32,
    code: `// ============================================================================
// SP2L-LSM: Photovoltaic Solar Cell Scribing (P1, P2, P3 DPSS Trajectory)
// ============================================================================
#include <cstdint>

enum DPSSWavelength { NIR_1064NM, GREEN_532NM, UV_355NM };

class PhotovoltaicSolarScriber {
    DPSSWavelength activeWavelength;
    float stage_x_mm = 0.0f, stage_y_mm = 0.0f;

public:
    void ExecuteP2IsolationTrench(float trench_length_mm, float pitch_um) {
        SelectDPSSLaserEngine(GREEN_532NM); // Optimal for Perovskite / ITO
        ConfigureClass1SafetyInterlock();
        
        for (float y = 0.0f; y < trench_length_mm; y += pitch_um * 0.001f) {
            MoveStageXY_MicronPrecision(0.0f, y);
            GateLaserPulseTrain(100000); // 100 kHz DPSS Q-Switched Pulses
            LinearInterpolateStage(trench_length_mm, y, 600.0f /* mm/s */);
            QuenchLaserGate();
        }
    }
};`,
  },
  '06': {
    filename: 'sp2l_fiber_laser_motf.cpp',
    lang: 'C++ // 20W-100W IPG FIBER & MOTF KINEMATICS',
    lines: 32,
    code: `// ============================================================================
// SP2L-LEM: IPG Photonics Fiber Laser Marking Engine & MOTF Kinematics
// ============================================================================
#include <cstdint>

class IndustrialFiberLaserEngine {
    static constexpr uint32_t MAX_VECTOR_SPEED = 2500; // 2,500 mm/s
    uint32_t pulse_frequency_khz = 80;

public:
    void SynchronizeMarkOnTheFly(uint32_t conveyor_encoder_pulse) {
        float conveyor_speed_mms = CalculateEncoderDelta(conveyor_encoder_pulse);
        
        // Dynamically advance vector hatching offsets in real time
        Vector2D motf_correction = ComputeDopplerOffset(conveyor_speed_mms);
        ApplyXYGalvoOffset(motf_correction.x, motf_correction.y);
        
        // Fire 20W-100W IPG Photonics fiber seed pulses
        IPG_ModulatePulsedOutput(pulse_frequency_khz, 100 /* % Duty */);
    }
};`,
  },
  '07': {
    filename: 'sp2l_lwir_ethernet_streamer.cpp',
    lang: 'C++ // 100 MBIT ETHERNET LWIR RADIOMETRIC DAQ',
    lines: 32,
    code: `// ============================================================================
// SP2L-TC: 640x480 LWIR (8-14 µm) Real-Time Radiometric Ethernet Streamer
// ============================================================================
#include <sys/socket.h>
#include <netinet/in.h>

class LWIRRadiometricStreamer {
    static constexpr uint16_t PACKET_SIZE = 1440;
    static constexpr uint32_t FRAME_PIXELS = 640 * 480;
    uint16_t thermal_frame_buffer[FRAME_PIXELS];

public:
    void IngestRawUDPStream(int sock_fd) {
        uint8_t packet[PACKET_SIZE];
        ssize_t bytes = recvfrom(sock_fd, packet, PACKET_SIZE, 0, NULL, NULL);
        
        // High-throughput 100 Mbit Ethernet frame reassembly
        uint32_t packet_seq = *reinterpret_cast<uint32_t*>(packet);
        uint16_t* raw_sensor_stream = reinterpret_cast<uint16_t*>(packet + 4);
        
        for (int i = 0; i < 718; i++) {
            thermal_frame_buffer[packet_seq * 718 + i] = raw_sensor_stream[i];
        }
        
        // Radiometric Planck conversion (-20°C to 1000°C)
        ConvertRawToCelsiusLossless();
    }
};`,
  },
  '08': {
    filename: 'sp2l_lockin_ndt_thermography.cpp',
    lang: 'C++ // 2x50W DIODE PHASE-LOCK NDT',
    lines: 32,
    code: `// ============================================================================
// SP2L-LTWIS: Dual 50W Diode Lock-In NDT Weld Inspection & Micro-Texturing
// ============================================================================
#include <cmath>

class LockInNDTThermographyEngine {
    float modulation_freq_hz = 0.5f; // Thermal wave penetration depth
    float phase_accum = 0.0f;

public:
    void ExecutePhaseLockInspection(float delta_time) {
        phase_accum += 2.0f * M_PI * modulation_freq_hz * delta_time;
        
        // Modulate dual 50W 808-1064nm diode lasers in phase-lock
        float laser_power = 50.0f * (0.5f + 0.5f * sinf(phase_accum));
        SetDualDiodePower_50W(laser_power, laser_power);
        
        // Extract sub-surface thermal wave delay to expose weld micro-voids
        float sub_surface_phase = MeasureThermographicPhaseLag();
        if (fabs(sub_surface_phase - EXPECTED_WELD_PHASE) > 5.0f) {
            FlagDefectCoordinates(GetActiveScannerPosition());
        }
    }
};`,
  },
};

// ============================================================================
// ARCHITECTURE BLOCK DIAGRAMS (5-STAGE TOPOLOGY)
// ============================================================================
const ARCH_BLOCKS = {
  '01': [
    { title: 'BRIDGE EXCITATION', sub: '100 kHz Sine Gen' },
    { title: 'LOW-NOISE AFE', sub: 'Sub-pF Balancer' },
    { title: '24-BIT SIGMA-DELTA', sub: 'Coherent Sampling' },
    { title: 'LOCK-IN PSD', sub: 'Phase Detection' },
    { title: 'PYSIDE6 CALIBRATOR', sub: 'Precision GUI' },
  ],
  '02': [
    { title: '16x NTC SENSORS', sub: '10k Thermistors' },
    { title: 'ANALOG MUX', sub: 'Matched Low R-On' },
    { title: 'STM32 ADC1 DMA', sub: '12-bit Circular' },
    { title: 'IWDG INTERLOCK', sub: '<500µs Cutoff' },
    { title: 'PYSIDE6 ATE', sub: 'Real-Time Heatmap' },
  ],
  '03': [
    { title: 'MPX5700 SENSOR', sub: '0-700 kPa Analog' },
    { title: '100Hz TIM6 ISR', sub: 'Anti-Windup PID' },
    { title: 'DUAL-MCU SYNC', sub: 'M118 Lockstep' },
    { title: 'STEPPER GATING', sub: 'Micron Precision' },
    { title: 'PYOPENGL TWIN', sub: '3D Toolpath View' },
  ],
  '04': [
    { title: 'WIN32 MARKEZD', sub: 'Kernel Driver' },
    { title: 'DB25 PORT DRIVER', sub: '<1.0µs Pin Gating' },
    { title: '>5kW NIR LASER', sub: 'High-Peak Pulses' },
    { title: 'GALVO MIRRORS', sub: '2,200 mm/s Motion' },
    { title: 'WAFER POSITION', sub: 'Si / III-V Alignment' },
  ],
  '05': [
    { title: 'DPSS SELECTOR', sub: '1064/532/355 nm' },
    { title: 'XY GANTRY STAGE', sub: '300 × 300 mm Stage' },
    { title: 'P1/P2/P3 KINEMATICS', sub: 'Thin-Film Scribe' },
    { title: 'OPTICAL FOCUS', sub: 'Beam Expander' },
    { title: 'CLASS 1 ENCLOSURE', sub: 'Safety Interlocks' },
  ],
  '06': [
    { title: 'IPG FIBER LASER', sub: '20W–100W Pulsed' },
    { title: 'MOTF ENCODER', sub: 'On-the-Fly Sync' },
    { title: 'VECTOR HATCHING', sub: '2,500 mm/s Engine' },
    { title: 'GALVO DEFLECTOR', sub: 'XY-2-100 Mirrors' },
    { title: 'SUPERVISORY ATE', sub: 'Production Suite' },
  ],
  '07': [
    { title: 'LWIR 8-14µm SENSOR', sub: 'Radiometric Core' },
    { title: '100Mbit ETHERNET', sub: 'Raw UDP Stream' },
    { title: 'LOSSLESS BUFFER', sub: 'High-Throughput' },
    { title: 'PLANCK CALIBRATOR', sub: '-20 to 1000 °C' },
    { title: 'PYSIDE6 THERMO', sub: 'Thermal Heatmap' },
  ],
  '08': [
    { title: 'DUAL 50W DIODES', sub: '808–1064 nm Heads' },
    { title: 'MODULATION FIRMWARE', sub: 'Phase-Lock 0.5Hz' },
    { title: 'IR THERMAL SYNC', sub: 'Lock-In Lag Detect' },
    { title: 'WELD SEAM SCAN', sub: 'NDT Sub-Surface' },
    { title: 'DEFECT MAPPING', sub: 'Micro-Void Alert' },
  ],
};

// ============================================================================
// ALL 8 INDUSTRIAL R&D MACHINES ORGANIZED INTO TWO OPERATIONAL SERIES
// ============================================================================
const MACHINES_DATA = [
  // --------------------------------------------------------------------------
  // SERIES A: PRECISION INSTRUMENTATION, THERMAL DAQ & BIOPRINTING
  // --------------------------------------------------------------------------
  {
    id: '01',
    series: 'SERIES_A',
    seriesName: 'SERIES A // PRECISION INSTRUMENTATION, THERMAL DAQ & BIOPRINTING',
    code: 'MACH_01 // BARC BRIDGE',
    title: 'BARC HIGH-PRECISION CAPACITANCE & IMPEDANCE BRIDGE INSTRUMENTATION',
    subtitle: 'Sub-Picofarad Nuclear & Scientific Research Instrumentation (BARC Standard)',
    organization: 'Bhabha Atomic Research Centre (BARC) / Scientific R&D',
    dropKey: 'machine01_barc',
    repoUrl: 'https://github.com/AtharvaYadav-dev',
    repoName: 'AtharvaYadav-dev',
    component: BarcBridgeVisualizer,
    summary:
      'Ultra-low-noise embedded acquisition pipeline with lock-in phase-sensitive detection resolving sub-picofarad (sub-pF) impedance variations with zero thermal drift.',
    bottleneck:
      'Nuclear and precision scientific research applications require resolving ultra-small capacitance fluctuations (<0.01 pF). Environmental EMI, PCB trace parasitic capacitances, and thermal drifts routinely swamp sub-picofarad measurements in conventional bridge topologies.',
    solution:
      'Architected a phase-sensitive lock-in acquisition architecture combining a 100 kHz synchronous bridge carrier generator with 24-bit Sigma-Delta ADC sampling. Implemented coherent digital demodulation (PSD) in embedded C++ that isolates in-phase and quadrature signals, rejecting broadband noise and achieving sub-pF resolution with automated bridge balancing via PySide6.',
    blueprintFlow: [
      { name: '100 kHz CARRIER GEN', detail: 'Low-jitter bridge excitation', subsystem: 'ANALOG_EXCITATION' },
      { name: 'LOW-NOISE AFE BRIDGE', detail: 'Sub-pF capacitive null balance', subsystem: 'FRONTEND_AFE' },
      { name: '24-BIT SIGMA-DELTA', detail: 'Coherent multi-sample averaging', subsystem: 'ADC_SAMPLING' },
      { name: 'PYSIDE6 CALIBRATOR', detail: 'Automated bridge-balance UI', subsystem: 'SUPERVISORY_ATE' },
    ],
    pinoutSpecs: [
      { pin: 'AIN0 / AIN1', bus: 'DIFF_ADC_24BIT', speed: '128 kSPS', desc: 'Differential Bridge Null Voltage Sense' },
      { pin: 'PA8', bus: 'TIM1_PWM_REF', speed: '100 kHz', desc: 'Synchronous Bridge Excitation Clock' },
      { pin: 'PB6 / PB7', bus: 'I2C1_CAL_EEPROM', speed: '400 kHz', desc: 'Precision Calibration Coefficients' },
      { pin: 'USART2', bus: 'HOST_TELEMETRY', speed: '921600 Baud', desc: 'Lock-In Vector Stream to PySide6 UI' },
    ],
    deepDive:
      'Engineered to meet BARC scientific instrumentation standards. By implementing digital lock-in phase detection directly on the microcontroller alongside low-noise analog signal conditioning, the bridge eliminates ambient 50Hz mains hum and thermoelectric drift, delivering rock-solid sub-pF capacitance measurement accuracy.',
    latencyMetric: '< 10 µs Phase Coherence',
    techSpecs: [
      { label: 'Measurement Domain', value: 'Sub-Picofarad Capacitance & Phase' },
      { label: 'Carrier Frequency', value: '100 kHz Low-Jitter Sine Excitation' },
      { label: 'ADC Architecture', value: '24-Bit Sigma-Delta + Lock-In PSD' },
      { label: 'Supervisory UI', value: 'PySide6 Automated Calibration Desk' },
    ],
    badges: ['Sub-pF Resolution', 'Lock-In Phase Detection', 'Low-Noise AFE', 'PySide6 Calibration UI'],
  },
  {
    id: '02',
    series: 'SERIES_A',
    seriesName: 'SERIES A // PRECISION INSTRUMENTATION, THERMAL DAQ & BIOPRINTING',
    code: 'MACH_02 // SVNIT DAQ',
    title: 'SVNIT AUTOMATED 16-CHANNEL THERMAL MANAGEMENT & SAFETY WATCHDOG DAQ',
    subtitle: 'Multi-Zone Real-Time Thermal Runaway Prevention & ATE Telemetry Rig',
    organization: 'SVNIT (Surat) / Industrial R&D',
    dropKey: 'machine02_svnit',
    repoUrl: 'https://github.com/AtharvaYadav-dev',
    repoName: 'AtharvaYadav-dev',
    component: ThermalHeatmapMatrix,
    summary:
      'High-speed multi-channel data acquisition architecture with sub-millisecond thermistor circular DMA scanning and hardware-level emergency cutoff.',
    bottleneck:
      'Multi-zone industrial heater arrays operate near critical thermal runaway thresholds. Traditional RTOS polling introduced jitter up to 14ms—risking thermal runaway, sensor multiplexer crosstalk, and delayed emergency cutoff.',
    solution:
      'Architected a bare-metal STM32 non-blocking circular DMA ADC pipeline that continuously samples all 16 thermistor channels with 4x hardware oversampling. Implemented hardware Independent Watchdog (IWDG) trip registers that cut high-power relays in under 500 microseconds if dT/dt exceeds threshold.',
    blueprintFlow: [
      { name: '16x NTC SENSORS', detail: 'Calibrated voltage dividers', subsystem: 'ANALOG_FRONTEND' },
      { name: 'LOW-NOISE MUX & ADC1', detail: '12-Bit 2000 SPS resolution', subsystem: 'STM32_SILICON' },
      { name: 'CIRCULAR DMA STREAM', detail: 'Zero CPU interrupt overhead', subsystem: 'SRAM_DMA' },
      { name: 'PYSIDE6 RECORDER', detail: 'Real-time telemetry logger', subsystem: 'SUPERVISORY_UI' },
    ],
    pinoutSpecs: [
      { pin: 'PA0 - PA7', bus: 'ADC1_IN0..IN7', speed: '2000 SPS', desc: 'Thermistor Bank A (Channels 0-7)' },
      { pin: 'PB0 - PB7', bus: 'ADC1_IN8..IN15', speed: '2000 SPS', desc: 'Thermistor Bank B (Channels 8-15)' },
      { pin: 'PC13', bus: 'GPIO_SAFETY_OUT', speed: '<500 μs', desc: 'Emergency Cutoff Relay Gate' },
      { pin: 'PA9 / PA10', bus: 'USART1_TX/RX', speed: '115200 Baud', desc: 'PySide6 Supervisory Serial Telemetry' },
    ],
    deepDive:
      'Designed and deployed at SVNIT (Surat) for high-precision thermal monitoring. The system eliminates CPU overhead by delegating multi-channel analog sampling entirely to STM32 circular DMA. Integrated real-time gradient tracking (dT/dt) ensures sub-millisecond fault detection before heat spreads across adjacent zones.',
    latencyMetric: '< 500 μs Hardware Cutoff',
    techSpecs: [
      { label: 'Core Silicon', value: 'Bare-Metal C++, STM32 DMA/ADC' },
      { label: 'Sensor Matrix', value: '16-Channel Thermistor Array (12-bit)' },
      { label: 'Safety Interlock', value: 'Hardware Watchdog (IWDG) Cutoff' },
      { label: 'Supervisory UI', value: 'Multi-Threaded PySide6 Desktop ATE' },
    ],
    badges: ['16-Ch Circular DMA', 'STM32 Bare-Metal C++', 'Hardware Watchdog Cutoff', 'PySide6 ATE Logger'],
  },
  {
    id: '03',
    series: 'SERIES_A',
    seriesName: 'SERIES A // PRECISION INSTRUMENTATION, THERMAL DAQ & BIOPRINTING',
    code: 'MACH_03 // BIO4D & INKPRINTER',
    title: 'BIO4D V2 & INKPRINTER — MULTI-AXIS BIOPRINTER & PNEUMATIC EXTRUSION SYSTEM',
    subtitle: 'Dual-MCU Lockstep Motion Planner & 100Hz Closed-Loop Pneumatic Extruder',
    organization: 'SPPL OEM Machine Architecture',
    dropKey: 'machine03_bio4d',
    repoUrl: 'https://github.com/AtharvaYadav-dev/InkPrinter',
    repoName: 'AtharvaYadav-dev/InkPrinter',
    component: BioScaffoldVisualizer,
    summary:
      'Precision bio-fabrication system with dual-MCU lockstep synchronization, 100Hz deterministic closed-loop pneumatic pressure regulation, and real-time PyOpenGL digital twin.',
    bottleneck:
      'Non-Newtonian biomaterial hydrogels exhibit non-linear shear thinning and syringe backpressure delay. Open-loop mechanical extrusion caused strand tearing, nozzle clogging, and cell viability degradation.',
    solution:
      'Replaced open-loop extrusion with an MPX5700 piezo transducer feedback loop running a 100Hz deterministic timer interrupt (TIM6 ISR) PID controller in bare-metal C++. Built custom bidirectional M118 serial lockstep handshake with CRC8 frame validation to synchronize motion gating with Python/PyOpenGL host.',
    blueprintFlow: [
      { name: 'MPX5700 TRANSDUCER', detail: '0-700 kPa pressure feedback', subsystem: 'PIEZO_SENSOR' },
      { name: '100Hz TIM6 ISR PID', detail: 'Anti-windup closed-loop control', subsystem: 'REAL_TIME_MCU' },
      { name: 'DUAL-MCU M118 BUS', detail: 'Lockstep frame synchronization', subsystem: 'SERIAL_PROTOCOL' },
      { name: 'PYOPENGL 3D TWIN', detail: '60 FPS G-Code digital twin', subsystem: 'PYSIDE6_HOST' },
    ],
    pinoutSpecs: [
      { pin: 'PC0', bus: 'ADC3_IN10', speed: '100 Hz Loop', desc: 'MPX5700 Transducer Feedback (0-3.3V)' },
      { pin: 'PE9', bus: 'TIM1_CH1_PWM', speed: '20 kHz PWM', desc: 'Pneumatic Solenoid Gating Driver' },
      { pin: 'PB10 / PB11', bus: 'USART3_TX/RX', speed: '250000 Baud', desc: 'Dual-MCU Motion Gating Bus' },
      { pin: 'PD12 - PD15', bus: 'STEP_DIR_XYZ', speed: '100 kHz', desc: 'Micron-Grade Stepper Interfaces' },
    ],
    deepDive:
      'Engineered at SPPL for industrial bio-fabrication. The closed-loop pneumatic architecture regulates syringe backpressure within ±0.4% stability at 100Hz. The accompanying PySide6 desktop suite renders live 3D toolpath kinematics in PyOpenGL and validates extrusion lockstep with zero packet drops.',
    latencyMetric: '10.0 ms Hard Real-Time ISR',
    techSpecs: [
      { label: 'Synchronization', value: 'Dual-MCU Lockstep (Custom M118 Protocol)' },
      { label: 'Pressure Control', value: '100Hz Deterministic PID (MPX5700)' },
      { label: 'Kinematics', value: 'Micron-Grade Multi-Axis Stepper Gating' },
      { label: 'Digital Twin', value: 'PySide6 + PyOpenGL 3D Toolpath View' },
    ],
    badges: ['100Hz Pneumatic PID', 'MPX5700 Transducer', 'PyOpenGL 3D Twin', 'GitHub: AtharvaYadav-dev/InkPrinter'],
  },

  // --------------------------------------------------------------------------
  // SERIES B: SPPL INDUSTRIAL PHOTONICS, WAFER LASERS & LWIR THERMOGRAPHY
  // --------------------------------------------------------------------------
  {
    id: '04',
    series: 'SERIES_B',
    seriesName: 'SERIES B // SPPL INDUSTRIAL PHOTONICS, WAFER LASERS & LWIR THERMOGRAPHY',
    code: 'MACH_04 // SP2L-SWPSMS',
    title: 'SP2L-SWPSMS // SEMICONDUCTOR WAFER PATTERNING, SCRIBING & MARKING SYSTEM',
    subtitle: 'High-Peak-Power NIR Pulses for Wafer-Level Silicon & III-V Processing',
    organization: 'Specialise Products Pvt. Ltd. (SPPL) // Photonics R&D',
    dropKey: 'machine04_swpsms',
    repoUrl: 'https://github.com/AtharvaYadav-dev/Galvo_Scriber',
    repoName: 'AtharvaYadav-dev/Galvo_Scriber',
    component: WaferLaserVisualizer,
    summary:
      'Industrial semiconductor wafer scribing system with >5 kW peak-power NIR laser sources, sub-microsecond DB25 parallel gating, and Win32 MarkEzd.dll kernel integration.',
    bottleneck:
      'Wafer-level semiconductor scribing on silicon and III-V substrates demands extreme beam positioning accuracy. Operating system thread jitter causes laser dwell-time spikes, producing thermal micro-cracks and destroying delicate semiconductor dies.',
    solution:
      'Architected low-level C/C++ and Python hardware bindings over Win32 DLLs (MarkEzd.dll) and direct DB25 parallel port hardware gating. Driven by high-resolution QueryPerformanceCounter spinlocks, the system fires laser bursts in under 1.0 microsecond synchronized with dual-axis XY galvo mirrors across a 150×150 mm scan field.',
    blueprintFlow: [
      { name: 'DIE STREET MAPPING', detail: 'CAD coordinate translation', subsystem: 'WAFER_CAM' },
      { name: 'WIN32 MARKEZD DLL', detail: 'Low-level C++/ctypes binding', subsystem: 'KERNEL_DRIVER' },
      { name: 'DB25 PARALLEL GATING', detail: '<1.0µs hardware pin pulse', subsystem: 'REAL_TIME_PULSE' },
      { name: 'GALVO DEFLECTION', detail: 'XY-2-100 optical beam steer', subsystem: 'NIR_OPTICS' },
    ],
    pinoutSpecs: [
      { pin: 'DB25 Pin 14', bus: 'LASER_GATE_EN', speed: '< 1.0 µs', desc: 'Active HIGH Hardware Laser Gate' },
      { pin: 'DB25 Pin 2-9', bus: 'DATA_D0-D7', speed: 'High-Speed', desc: 'Coordinate Calibration Vector' },
      { pin: 'DB25 Pin 1', bus: 'STROBE_CLOCK', speed: 'Latched Pulse', desc: 'Hardware Latched Gating Pulse' },
      { pin: 'DB25 Pin 11', bus: 'BUSY_ACK', speed: 'Low Latency', desc: 'Motion Controller Acknowledge' },
    ],
    deepDive:
      'Deployed at SPPL for industrial wafer-level packaging. Bypasses standard Windows API latency by binding directly to industrial controller DLLs and utilizing microsecond hardware timers for laser gating. Delivers micrometer-precise wafer street scribing with zero silicon thermal degradation.',
    latencyMetric: '< 1.0 µs Gate Jitter',
    techSpecs: [
      { label: 'Peak Power', value: '> 5 kW Peak Near-Infrared (NIR)' },
      { label: 'Work Field', value: '150 × 150 mm Silicon Die Envelope' },
      { label: 'Substrates', value: 'Silicon (Si), GaAs, GaN, III-V Wafers' },
      { label: 'Hardware Interface', value: 'DB25 Parallel Port + MarkEzd.dll' },
    ],
    badges: ['> 5 kW Peak NIR', '150 × 150 mm Field', 'Si & III-V Wafers', 'DB25 & MarkEzd.dll', 'GitHub: AtharvaYadav-dev/Galvo_Scriber'],
  },
  {
    id: '05',
    series: 'SERIES_B',
    seriesName: 'SERIES B // SPPL INDUSTRIAL PHOTONICS, WAFER LASERS & LWIR THERMOGRAPHY',
    code: 'MACH_05 // SP2L-LSM',
    title: 'SP2L-LSM & SP2L-MINI-LSM // PHOTOVOLTAIC (SOLAR) CELL LASER SCRIBING PLATFORMS',
    subtitle: 'Multi-Wavelength DPSS Laser Scribing for Thin-Film Perovskite & ITO Solar Cells',
    organization: 'Specialise Products Pvt. Ltd. (SPPL) // Solar Photovoltaics',
    dropKey: 'machine05_lsm',
    repoUrl: 'https://github.com/AtharvaYadav-dev',
    repoName: 'AtharvaYadav-dev',
    component: SolarScribeVisualizer,
    summary:
      'Multi-wavelength (1064nm, 532nm, 355nm) DPSS laser scribing platform synchronized with precision motorized X-Y stages for P1, P2, and P3 thin-film photovoltaic isolation.',
    bottleneck:
      'Thin-film solar cells (Perovskite, CIGS, Organic PV) require microscopic P1, P2, and P3 electrical isolation scribes on FTO, ITO, and SnO2 layers. Incomplete scribing causes electrical shorting, while excessive depth fractures the transparent conductive glass.',
    solution:
      'Synchronized motorized X-Y stage kinematics and optical focusing with 1064nm (NIR), 532nm (Green), and 355nm (UV) Diode-Pumped Solid-State (DPSS) laser sources. Developed deterministic C++ trajectory tracking for P1, P2, and P3 scribing across 300×300 mm industrial and 100×100 mm benchtop work envelopes with Class 1 laser safety sync.',
    blueprintFlow: [
      { name: 'DPSS WAVELENGTH SELECT', detail: '1064 / 532 / 355 nm beam switch', subsystem: 'LASER_ENGINE' },
      { name: 'STAGE KINEMATICS', detail: 'Sub-micron X-Y positioning', subsystem: 'SERVO_MOTION' },
      { name: 'P1/P2/P3 TRAJECTORY', detail: 'Selective thin-film ablation', subsystem: 'SCRIBE_LOGIC' },
      { name: 'CLASS 1 SAFETY SYNC', detail: 'Interlocked enclosure sensor', subsystem: 'SAFETY_LOOP' },
    ],
    pinoutSpecs: [
      { pin: 'MOD_OUT_UV', bus: 'Q_SWITCH_TRIG', speed: '100 kHz', desc: 'DPSS 355nm Optical Q-Switch Trigger' },
      { pin: 'SERVO_X / Y', bus: 'STEP_DIR_STAGE', speed: '500 kHz', desc: 'Precision Linear Motor Encoders' },
      { pin: 'INTERLOCK_IN', bus: 'OPTO_ISOLATED', speed: '< 2 ms', desc: 'Class 1 Enclosure Interlock Relay' },
      { pin: 'RS485_BUS', bus: 'MODBUS_RTU', speed: '115200 Baud', desc: 'Laser Power & Chiller Telemetry' },
    ],
    deepDive:
      'Built at SPPL for next-generation solar research and module manufacturing. Allows instantaneous switching between 1064nm, 532nm, and 355nm DPSS wavelengths to precisely ablate active absorber, transport, or electrode layers without substrate cracking.',
    latencyMetric: '< 2.0 ms Stage-Laser Sync',
    techSpecs: [
      { label: 'Laser Engines', value: '1064 nm (NIR), 532 nm (Green), 355 nm (UV)' },
      { label: 'Work Envelope', value: '300 × 300 mm (Industrial) / 100 × 100 mm' },
      { label: 'Processes', value: 'P1, P2, P3 Selective Scribing' },
      { label: 'Enclosure', value: 'Class 1 Laser Safety Interlocked' },
    ],
    badges: ['1064 / 532 / 355 nm DPSS', '300 × 300 mm Stage', 'P1, P2, P3 PV Scribing', 'Class 1 Enclosure Sync'],
  },
  {
    id: '06',
    series: 'SERIES_B',
    seriesName: 'SERIES B // SPPL INDUSTRIAL PHOTONICS, WAFER LASERS & LWIR THERMOGRAPHY',
    code: 'MACH_06 // SP2L-LEM / LMM-FL',
    title: 'SP2L-LEM / LMM-FL // INDUSTRIAL FIBER LASER MARKING & ENGRAVING SYSTEMS',
    subtitle: '20W–100W Pulsed IPG Photonics Fiber Laser Platform',
    organization: 'Specialise Products Pvt. Ltd. (SPPL) // Industrial Fiber Lasers',
    dropKey: 'machine06_lem',
    repoUrl: 'https://github.com/AtharvaYadav-dev',
    repoName: 'AtharvaYadav-dev',
    component: FiberLaserVisualizer,
    summary:
      'High-speed industrial fiber laser marking platform utilizing 20W to 100W IPG Photonics sources, mark-on-the-fly (MOTF) kinematics, and vector hatching up to 2500 mm/s.',
    bottleneck:
      'High-speed conveyor lines require marking serialized barcodes and alphanumeric data on moving parts. Delays in position acquisition or laser firing cause skewed, illegible marks and line slowdowns.',
    solution:
      'Built high-speed vector hatching algorithms, Mark-On-The-Fly (MOTF) rotary encoder synchronization, and low-level power modulation routines for 20W to 100W pulsed IPG Photonics fiber lasers, achieving permanent non-contact marking up to 2500 mm/s with ≤20 µm spot precision.',
    blueprintFlow: [
      { name: 'CAD VECTOR PARSER', detail: 'DXF/PLT to vector primitives', subsystem: 'CAM_PROCESSOR' },
      { name: 'MOTF ENCODER SYNC', detail: 'Conveyor velocity tracking', subsystem: 'KINEMATICS' },
      { name: 'IPG PULSED MODULATION', detail: '20–100W seed & amplifier gating', subsystem: 'FIBER_SOURCE' },
      { name: 'GALVO SCANNER HEAD', detail: '≤ 20 µm spot optical focus', subsystem: 'GALVO_OPTICS' },
    ],
    pinoutSpecs: [
      { pin: 'IPG_PULSE_TRIG', bus: 'TTL_LASER_ON', speed: '80 kHz', desc: 'IPG Seed Diode Pulse Trigger' },
      { pin: 'ENC_A / ENC_B', bus: 'QUADRATURE_IN', speed: '2 MHz', desc: 'MOTF Conveyor Rotary Tracking' },
      { pin: 'GALVO_X / Y', bus: 'XY2_100_SERIAL', speed: '2 MHz Serial', desc: 'Galvanometer Coordinate Stream' },
      { pin: 'ALARM_IN', bus: 'SAFETY_FAULT', speed: '< 1 ms', desc: 'Fiber Laser Temperature/Optical Fault' },
    ],
    deepDive:
      'Engineered for 24/7 industrial production lines at SPPL. Integrates high-speed galvanometer vector hatching with real-time conveyor tracking to mark metals, engineering polymers, and medical components without pausing conveyor throughput.',
    latencyMetric: '< 10 µs MOTF Correction',
    techSpecs: [
      { label: 'Fiber Source', value: '20W – 100W Pulsed IPG Photonics' },
      { label: 'Marking Speed', value: 'Up to 2,500 mm/s Vector Tracking' },
      { label: 'Spot Precision', value: '≤ 20 µm Focused Spot Diameter' },
      { label: 'Capabilities', value: 'Mark-On-The-Fly (MOTF) & Deep Engraving' },
    ],
    badges: ['20–100 W IPG Photonics', '2500 mm/s Marking', '≤ 20 µm Spot Precision', 'Galvo Vector Engine'],
  },
  {
    id: '07',
    series: 'SERIES_B',
    seriesName: 'SERIES B // SPPL INDUSTRIAL PHOTONICS, WAFER LASERS & LWIR THERMOGRAPHY',
    code: 'MACH_07 // SP2L-TC',
    title: 'SP2L-TC // HIGH-RESOLUTION LWIR RADIOMETRIC THERMOGRAPHY CAMERA',
    subtitle: 'Non-Contact Pixel-Level Infrared Thermal Streaming (-20°C to 1000°C)',
    organization: 'Specialise Products Pvt. Ltd. (SPPL) // Thermal Vision R&D',
    dropKey: 'machine07_tc',
    repoUrl: 'https://github.com/AtharvaYadav-dev',
    repoName: 'AtharvaYadav-dev',
    component: LwirThermographyVisualizer,
    summary:
      'Real-time radiometric thermal imaging system streaming lossless 640×480 and 384×288 Long-Wave Infrared (8–14 µm) pixel-level temperature data over 100 Mbit Ethernet.',
    bottleneck:
      'High-speed laser processing and weld inspection generate rapid thermal spikes. Standard USB thermal cameras suffer frame drops, proprietary black-box software, and lack raw radiometric calibration from -20°C to 1000°C.',
    solution:
      'Programmed high-throughput 100 Mbit Ethernet packet streaming parsers and data acquisition pipelines for 640×480 and 384×288 Long-Wave Infrared (LWIR, 8–14 µm) radiometric sensors. Engineered lossless ring buffers that convert raw 14-bit detector ADC counts into true calibrated temperatures in real-time desktop software.',
    blueprintFlow: [
      { name: 'LWIR BOLOMETER CORE', detail: '8–14 µm infrared sensor matrix', subsystem: 'IR_DETECTOR' },
      { name: '100 Mbit UDP PACKETIZER', detail: 'Lossless raw frame streaming', subsystem: 'NET_STACK' },
      { name: 'RADIOMETRIC CONVERTER', detail: 'Planck curve thermal calibration', subsystem: 'DSP_CALIBRATION' },
      { name: 'PYSIDE6 THERMO DESK', detail: 'Dynamic crosshair & thermal recorder', subsystem: 'DESKTOP_UI' },
    ],
    pinoutSpecs: [
      { pin: 'ETH_TX_P / N', bus: '100BASE_TX', speed: '100 Mbit/s', desc: 'Raw UDP Radiometric Stream' },
      { pin: 'SYNC_TRIG_IN', bus: 'HARDWARE_FRAME_SYNC', speed: '60 Hz', desc: 'External Machine Shutter Sync' },
      { pin: 'TEMP_NTC_INT', bus: 'ANALOG_CHAMBER', speed: '10 Hz', desc: 'Core Detector Temperature Sensor' },
      { pin: 'RELAY_ALARM', bus: 'OVERTEMP_INTERLOCK', speed: '< 5 ms', desc: 'Process Thermal Alarm Trigger' },
    ],
    deepDive:
      'Engineered at SPPL to provide live non-contact temperature diagnostics during laser material processing and electronic assembly. Streams full-frame pixel temperatures across 100 Mbit Ethernet with zero compression artifacts, enabling real-time weld and laser kerf quality verification.',
    latencyMetric: '< 16.6 ms Full-Frame Latency',
    techSpecs: [
      { label: 'Spectral Range', value: '8 – 14 µm Long-Wave Infrared (LWIR)' },
      { label: 'Temperature Range', value: '-20 °C to 1000 °C Calibrated' },
      { label: 'Resolution', value: '640 × 480 & 384 × 288 Radiometric Cores' },
      { label: 'Network Bus', value: '100 Mbit Ethernet (Lossless UDP)' },
    ],
    badges: ['8–14 µm LWIR Sensor', '-20 ... 1000 °C Range', '640×480 / 384×288 Res', '100 Mbit Ethernet DAQ'],
  },
  {
    id: '08',
    series: 'SERIES_B',
    seriesName: 'SERIES B // SPPL INDUSTRIAL PHOTONICS, WAFER LASERS & LWIR THERMOGRAPHY',
    code: 'MACH_08 // SP2L-LTWIS',
    title: 'SP2L-LTWIS, SP2L-ALESTM & SP2L-MSTS // LOCK-IN NDT THERMOGRAPHY & MICRO-TEXTURING',
    subtitle: 'Non-Destructive Weld Inspection, Photo-Thermal Mapping & Sub-Micron Surface Texturing',
    organization: 'Specialise Products Pvt. Ltd. (SPPL) // Advanced Photonics',
    dropKey: 'machine08_ltwis',
    repoUrl: 'https://github.com/AtharvaYadav-dev',
    repoName: 'AtharvaYadav-dev',
    component: LockInNdtVisualizer,
    summary:
      'Lock-in non-destructive testing (NDT) system pairing dual 50W diode lasers with synchronized thermal camera feeds to detect sub-surface weld flaws, photo-thermal mapping, and <20 µm texturing.',
    bottleneck:
      'Sub-surface voids, incomplete weld penetration, and delamination are invisible to visual surface inspection. Destructive cross-sectioning destroys expensive parts and cannot be scaled to inline production.',
    solution:
      'Engineered synchronized modulation firmware for dual 50W diode lasers (808–1064 nm) locked with infrared thermography feeds to reveal sub-surface weld defects without contact (SP2L-LTWIS). Built automated 1–10W laser exposure mapping across six VIS-NIR wavelengths (639–980 nm, SP2L-ALESTM) and deterministic pulse-to-axis synchronization for <20 µm micro-surface texturing (SP2L-MSTS).',
    blueprintFlow: [
      { name: 'DUAL 50W DIODE HEADS', detail: '808–1064 nm modulated excitation', subsystem: 'OPTICAL_SOURCE' },
      { name: 'PHASE-LOCK FIRMWARE', detail: '0.1–10 Hz sinusoidal modulation', subsystem: 'MCU_CONTROL' },
      { name: 'LOCK-IN IR SENSING', detail: 'Phase-lag sub-surface extraction', subsystem: 'THERMAL_IMAGE' },
      { name: 'DEFECT RECONSTRUCTION', detail: '3D void depth & sizing map', subsystem: 'ALGORITHM' },
    ],
    pinoutSpecs: [
      { pin: 'DIODE1_PWM', bus: 'TIM3_CH1', speed: '50 kHz PWM', desc: '50W 808nm Primary Optical Modulation' },
      { pin: 'DIODE2_PWM', bus: 'TIM3_CH2', speed: '50 kHz PWM', desc: '50W 1064nm Secondary Optical Modulation' },
      { pin: 'CAM_TRIG_OUT', bus: 'FRAME_SYNC_PULSE', speed: '60 Hz', desc: 'Thermal Camera Lock-In Exposure Sync' },
      { pin: 'AXIS_ENC_XYZ', bus: 'POSITION_BUS', speed: '1 MHz', desc: '< 20 µm Micro-Texturing Motion Sync' },
    ],
    deepDive:
      'Developed at SPPL for non-destructive aerospace and automotive weld quality validation. By modulating dual 50W optical excitation and computing phase angle lag between the heating source and thermal emission, the system penetrates below surface coatings to reveal hidden micro-cracks without contacting the workpiece.',
    latencyMetric: '< 5.0 ms Phase-Lock Jitter',
    techSpecs: [
      { label: 'NDT Excitation', value: '2 × 50W Diode Lasers (808 – 1064 nm)' },
      { label: 'Spectral Range', value: '639 – 980 nm Multi-Wavelength Exposure' },
      { label: 'Surface Texturing', value: '< 20 µm Micro-Texturing Resolution' },
      { label: 'NDT Method', value: 'Lock-In Phase-Sensitive Non-Destructive Test' },
    ],
    badges: ['2 × 50 W Lock-In NDT', '639–980 nm Photo-Thermal', '< 20 µm Micro-Texturing', 'Phase-Lock Firmware'],
  },
];

export default function MachinesBay() {
  const [activeMachineIndex, setActiveMachineIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' (System Schematic & Specs) or 'code' (Bare-Metal Architecture & Code)
  const [copiedCode, setCopiedCode] = useState(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);

  // 3D Holographic Mouse-Tracking Tilt State
  const [cardTilt, setCardTilt] = useState({ rotX: 0, rotY: 0, spotX: 50, spotY: 50 });
  const cardRef = useRef(null);

  const containerRef = useRef(null);
  const pinSectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=400%',
        pin: pinSectionRef.current,
        scrub: 1,
        onUpdate: (self) => {
          const index = Math.min(
            MACHINES_DATA.length - 1,
            Math.floor(self.progress * MACHINES_DATA.length)
          );
          setActiveMachineIndex(index);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const activeMachine = MACHINES_DATA[activeMachineIndex];
  const ActiveVisual = activeMachine.component;
  const userMediaUrl = HARDWARE_MEDIA_DROPZONE[activeMachine.dropKey];
  const activeCodeSnippet = BARE_METAL_CODE[activeMachine.id];
  const activeArchBlocks = ARCH_BLOCKS[activeMachine.id];

  const handleCardMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;

    setCardTilt({
      rotX: -normY * 10,
      rotY: normX * 10,
      spotX: (x / rect.width) * 100,
      spotY: (y / rect.height) * 100,
    });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ rotX: 0, rotY: 0, spotX: 50, spotY: 50 });
  };

  const handleTabSwitch = (tab) => {
    soundEngine.playTabLock();
    setActiveTab(tab);
  };

  const handleCopyCode = () => {
    soundEngine.playHoverBlip();
    if (activeCodeSnippet?.code) {
      navigator.clipboard.writeText(activeCodeSnippet.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleOpenBlueprint = () => {
    soundEngine.playTabLock();
    setIsBlueprintOpen(true);
  };

  return (
    <section ref={containerRef} id="machines" className="relative z-10 bg-[#030712] min-h-[500vh]">
      {/* Slide-Over Engineering Blueprint Modal Drawer */}
      <BlueprintDrawer
        machine={activeMachine}
        isOpen={isBlueprintOpen}
        onClose={() => setIsBlueprintOpen(false)}
      />

      <div
        ref={pinSectionRef}
        className="h-screen w-full flex flex-col justify-between py-4 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden"
      >
        {/* Top Header Ribbon & Series Switcher */}
        <div className="space-y-2 border-b border-cyan-500/20 pb-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-xs tracking-widest text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded border border-cyan-500/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                01 // R&amp;D_INSPECTION_BAY // 8_FLAGSHIP_SYSTEMS
              </span>
              <h2 className="text-xs sm:text-sm md:text-base font-display font-bold text-slate-100 flex items-center gap-2">
                <span className="hidden sm:inline">INDUSTRIAL HARDWARE TWINS</span>
                <span className="text-xs font-mono text-cyan-400 font-normal">
                  [{activeMachineIndex + 1}/{MACHINES_DATA.length}]
                </span>
              </h2>
            </div>

            {/* Quick Series Jump Buttons */}
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <button
                onClick={() => {
                  soundEngine.playRelayClick();
                  setActiveMachineIndex(0); // Jump to start of Series A
                }}
                className={`px-2.5 py-1 rounded border transition-all cursor-pointer ${
                  activeMachineIndex < 3
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                SERIES A [1-3]
              </button>
              <button
                onClick={() => {
                  soundEngine.playRelayClick();
                  setActiveMachineIndex(3); // Jump to start of Series B
                }}
                className={`px-2.5 py-1 rounded border transition-all cursor-pointer ${
                  activeMachineIndex >= 3
                    ? 'bg-amber-950 text-amber-300 border-amber-400 font-bold'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                SERIES B [4-8]
              </button>
            </div>
          </div>

          {/* Machine Selector Tabs (All 8 Machines) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar font-mono text-xs">
            {MACHINES_DATA.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => {
                  soundEngine.playRelayClick();
                  setActiveMachineIndex(idx);
                }}
                onMouseEnter={() => soundEngine.playHoverBlip()}
                data-target={m.code}
                className={`px-2.5 py-1 rounded border whitespace-nowrap transition-all cursor-pointer ${
                  activeMachineIndex === idx
                    ? 'bg-cyan-500 text-black font-bold border-cyan-400 glow-cyan-sm'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                M_{m.id} // {m.code.split('//')[1]?.trim() || m.code}
              </button>
            ))}
          </div>
        </div>

        {/* Central Machine Inspection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto items-center">
          {/* Left Column: Tech Readouts & Specifications */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="text-[11px] font-mono text-cyan-400 tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <ScrambleText text={activeMachine.code} key={activeMachine.id} />
              <span className="text-slate-500">|</span>
              <span className="text-slate-400 truncate">{activeMachine.organization}</span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-display font-extrabold text-slate-100 tracking-wide uppercase leading-tight">
                {activeMachine.title}
              </h3>
              {activeMachine.subtitle && (
                <div className="text-[11px] sm:text-xs font-mono text-cyan-300 font-bold mt-1 border-l-2 border-cyan-400 pl-2">
                  {activeMachine.subtitle}
                </div>
              )}
            </div>

            <p className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed border-l-2 border-cyan-500/40 pl-3">
              {activeMachine.summary}
            </p>

            {/* Hardware Specification Rows */}
            <div className="space-y-1 pt-1">
              {activeMachine.techSpecs.map((spec, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-colors"
                >
                  <span className="text-slate-400">{spec.label}:</span>
                  <span className="text-cyan-300 font-bold text-right truncate max-w-[240px]">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons: Blueprint Drawer + GitHub Repo */}
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              <button
                onClick={handleOpenBlueprint}
                onMouseEnter={() => soundEngine.playHoverBlip()}
                data-target="OPEN_BLUEPRINT_DRAWER"
                className="flex-1 py-2 px-3 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 glow-cyan cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>[⚡ VIEW_BLUEPRINT_DRAWER]</span>
              </button>

              {activeMachine.repoUrl && (
                <a
                  href={activeMachine.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => soundEngine.playHoverBlip()}
                  data-target="MACHINE_GITHUB_LINK"
                  className="py-2 px-3 rounded bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-300 text-cyan-300 font-mono text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Open GitHub Repository"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>REPO</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 text-slate-400" />
                </a>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1 pt-1">
              {activeMachine.badges.map((badge, bIdx) => (
                <span
                  key={bIdx}
                  className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Holographic 3D Tilt Card + Dual-View Tabs */}
          <div className="lg:col-span-7" style={{ perspective: 1200 }}>
            <div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="glass-panel p-4 md:p-5 rounded-lg border border-cyan-500/40 shadow-2xl relative overflow-hidden transition-transform duration-150 ease-out"
              style={{
                transform: `rotateX(${cardTilt.rotX}deg) rotateY(${cardTilt.rotY}deg)`,
                background: `radial-gradient(circle at ${cardTilt.spotX}% ${cardTilt.spotY}%, rgba(0, 240, 255, 0.12), rgba(6, 11, 20, 0.88) 60%)`,
              }}
            >
              {/* Radial Glowing Border Reflection */}
              <div
                className="absolute inset-0 pointer-events-none rounded-lg"
                style={{
                  boxShadow: `inset 0 0 25px rgba(0, 240, 255, 0.15)`,
                  border: '1px solid rgba(0, 240, 255, 0.35)',
                }}
              />

              {/* Dual-View Switcher Tab Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-cyan-500/20 mb-3 text-xs font-mono relative z-10">
                <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded border border-cyan-500/30">
                  <button
                    onClick={() => handleTabSwitch('feed')}
                    onMouseEnter={() => soundEngine.playHoverBlip()}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all font-bold cursor-pointer ${
                      activeTab === 'feed'
                        ? 'bg-cyan-500 text-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>[SYSTEM_SCHEMATIC &amp; SPECS]</span>
                  </button>

                  <button
                    onClick={() => handleTabSwitch('code')}
                    onMouseEnter={() => soundEngine.playHoverBlip()}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all font-bold cursor-pointer ${
                      activeTab === 'code'
                        ? 'bg-cyan-500 text-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>[BARE_METAL_ARCHITECTURE &amp; CODE]</span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>FRAME_SYNC: 60FPS</span>
                </div>
              </div>

              {/* TAB 1: SYSTEM SCHEMATIC & SPECS (LIVE HARDWARE FEED + ARCHITECTURE TOPOLOGY) */}
              {activeTab === 'feed' && (
                <div className="relative z-10 space-y-2.5">
                  <div className="min-h-[250px] md:min-h-[275px] relative rounded overflow-hidden border border-cyan-500/30 bg-black/70 p-2">
                    {userMediaUrl ? (
                      <video
                        src={userMediaUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-[250px] md:h-[275px] object-cover rounded"
                      />
                    ) : (
                      <ActiveVisual />
                    )}
                  </div>

                  {/* Interactive Architecture Block Diagram */}
                  <div className="bg-slate-950/80 p-2 rounded border border-cyan-500/25">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                      <span className="text-cyan-400 font-bold flex items-center gap-1">
                        <Cpu className="w-3 h-3" /> HARDWARE DATA BUS TOPOLOGY
                      </span>
                      <button
                        onClick={handleOpenBlueprint}
                        className="text-[9px] text-cyan-300 hover:underline cursor-pointer"
                      >
                        [OPEN BLUEPRINT DRAWER ➔]
                      </button>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 text-center">
                      {activeArchBlocks.map((block, bIdx) => (
                        <div
                          key={bIdx}
                          onMouseEnter={() => soundEngine.playHoverBlip()}
                          className="p-1 rounded bg-slate-900/90 border border-slate-800 hover:border-cyan-400/60 transition-all font-mono"
                        >
                          <div className="text-[9px] text-cyan-300 font-bold truncate">{block.title}</div>
                          <div className="text-[8px] text-slate-400 truncate">{block.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BARE-METAL ARCHITECTURE & SOURCE CODE INSPECTOR (IDE VIEW) */}
              {activeTab === 'code' && (
                <div className="relative z-10 space-y-2">
                  {/* IDE Toolbar */}
                  <div className="flex items-center justify-between px-3 py-1.5 rounded bg-slate-950/90 border border-cyan-500/30 text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-slate-200 font-bold">{activeCodeSnippet.filename}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                        {activeCodeSnippet.lang}
                      </span>
                    </div>

                    <button
                      onClick={handleCopyCode}
                      onMouseEnter={() => soundEngine.playHoverBlip()}
                      data-target="COPY_CODE"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white transition-all text-[10px] cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>COPY CODE</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Syntax Highlighted Bare-Metal Snippet Container */}
                  <div className="h-[270px] md:h-[295px] overflow-y-auto rounded border border-cyan-500/30 bg-[#02050e] p-3 text-xs font-mono custom-scrollbar">
                    <pre className="text-slate-300 leading-relaxed font-mono whitespace-pre text-[11px]">
                      {activeCodeSnippet.code}
                    </pre>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span>HARD REAL-TIME FIRMWARE SOURCE // PRODUCTION BUILD</span>
                    <span className="text-cyan-400">ZERO DYNAMIC ALLOCATION // DETERMINISTIC</span>
                  </div>
                </div>
              )}

              {/* Video Dropzone Guide Tag & Click Blueprint Prompt */}
              <div className="mt-2.5 pt-2 border-t border-cyan-500/20 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                  DROPZONE: <code className="text-slate-400">HARDWARE_MEDIA_DROPZONE.{activeMachine.dropKey}</code>
                </span>
                <button
                  onClick={handleOpenBlueprint}
                  className="text-cyan-400/90 hover:text-cyan-300 font-bold underline cursor-pointer"
                >
                  CLICK TO EXPAND BLUEPRINT DRAWER ➔
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Progress Bar & Stage Indicator */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-cyan-500/20">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">ACTIVE:</span>
            <span className="text-cyan-300 font-bold truncate max-w-[200px] sm:max-w-none">
              {activeMachine.seriesName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-300 font-bold">SYSTEM {activeMachineIndex + 1} OF {MACHINES_DATA.length}</span>
            <div className="w-24 sm:w-32 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-300"
                style={{ width: `${((activeMachineIndex + 1) / MACHINES_DATA.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
