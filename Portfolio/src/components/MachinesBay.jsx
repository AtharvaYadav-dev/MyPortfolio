import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Flame,
  Cpu,
  Layers,
  Zap,
  Code2,
  Tv,
  Check,
  Copy,
  Terminal,
  FileCode2,
  GitBranch,
  ExternalLink
} from 'lucide-react';
import ScrambleText from './ScrambleText';
import BlueprintDrawer from './BlueprintDrawer';
import { soundEngine } from '../utils/soundEngine';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// ⚠️ HARDWARE MEDIA DROP-ZONES
// Replace 'null' with your video/gif path (e.g. "/videos/svnit_hardware.mp4")
// When null, the system automatically runs the high-fidelity interactive digital twin simulation!
// ============================================================================
const HARDWARE_MEDIA_DROPZONE = {
  machine01_svnit: null,     // Example: "/videos/svnit_thermal_daq.mp4"
  machine02_bio4d: null,     // Example: "/videos/bio4d_printer.mp4"
  machine03_galvo: null,     // Example: "/videos/galvo_laser.mp4"
  machine04_metal3d: null,   // Example: "/videos/metal3d.mp4"
};

// ----------------------------------------------------------------------------
// MACHINE 01: 16-Channel Thermal Heatmap & DMA Matrix
// ----------------------------------------------------------------------------
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
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-cyan-500/20">
        <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          16-CH DMA THERMAL MATRIX
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
            className={`p-1.5 sm:p-2 rounded border text-center transition-all cursor-pointer font-mono select-none ${getNodeColor(
              node.temp
            )} ${activeNode.id === node.id ? 'ring-2 ring-white scale-105' : 'hover:scale-102'}`}
          >
            <div className="text-[8px] sm:text-[9px] opacity-75">{node.ch}</div>
            <div className="text-xs sm:text-sm font-bold">{node.temp}°C</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/85 p-2 rounded border border-cyan-500/30 flex items-center justify-between text-[11px] font-mono">
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

// ----------------------------------------------------------------------------
// MACHINE 02: Bio-Printer 3D Scaffold Extruder & MPX5700 Transducer
// ----------------------------------------------------------------------------
function BioScaffoldVisualizer() {
  const canvasRef = useRef(null);
  const [pressure, setPressure] = useState(342.5); // kPa

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

      // Isometric bed
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

      // Extruded Bio-Scaffold
      const layers = 5;
      for (let l = 0; l < layers; l++) {
        const layerZ = l * 12;
        const progress = Math.min(1, Math.max(0, (t * 0.4) % (layers + 1) - l));
        const alpha = 0.4 + l * 0.12;

        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 6;

        ctx.beginPath();
        const steps = 40 * progress;
        for (let s = 0; s <= steps; s++) {
          const angle = (s / 40) * Math.PI * 4;
          const rad = 25 + (s / 40) * 35;
          const px = centerX + Math.cos(angle) * rad;
          const py = centerY - layerZ + Math.sin(angle) * (rad * 0.5);

          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Dispenser Nozzle
      const nozzleX = centerX + Math.cos(t * 1.5) * 45;
      const nozzleY = centerY - layers * 12 - 15 + Math.sin(t * 1.5) * 20;

      ctx.fillStyle = '#ff9900';
      ctx.beginPath();
      ctx.arc(nozzleX, nozzleY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 153, 0, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(nozzleX, nozzleY - 24);
      ctx.lineTo(nozzleX, nozzleY);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    const pInterval = setInterval(() => {
      setPressure(Number((340 + Math.sin(Date.now() / 200) * 14 + (Math.random() * 2 - 1)).toFixed(1)));
    }, 100);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(pInterval);
    };
  }, []);

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-cyan-500/20">
        <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          PYSIDE6 + PYOPENGL DIGITAL TWIN
        </span>
        <span>DUAL-MCU M118 // 100Hz PID</span>
      </div>

      <div className="relative my-2 rounded border border-cyan-500/30 overflow-hidden bg-black/75">
        <canvas ref={canvasRef} width={400} height={165} className="w-full h-[165px] block" />
        <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-300 bg-black/80 px-2 py-0.5 rounded border border-cyan-500/30">
          Z-LAYER: 05/12 // HYDROGEL
        </div>
      </div>

      <div className="bg-slate-900/85 p-2 rounded border border-cyan-500/30 flex items-center justify-between text-[11px] font-mono">
        <div>
          <div className="text-slate-400 text-[10px]">MPX5700 TRANSDUCER (0-700 kPa)</div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base text-cyan-300 font-bold">{pressure} kPa</span>
            <span className="text-[10px] text-emerald-400">±0.4% PID STABLE</span>
          </div>
        </div>

        <div className="w-28 sm:w-32">
          <div className="flex justify-between text-[9px] text-slate-500 mb-0.5">
            <span>0</span>
            <span>350</span>
            <span>700</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/30">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-100"
              style={{ width: `${(pressure / 700) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// MACHINE 03: Galvo Laser Scribing & DB25 Microsecond Gating
// ----------------------------------------------------------------------------
function GalvoLaserVisualizer() {
  const canvasRef = useRef(null);
  const [speed, setSpeed] = useState(1400); // mm/s
  const [isFiring, setIsFiring] = useState(false);

  const handleTestPulse = () => {
    soundEngine.playLaserChirp();
    setIsFiring(true);
    setTimeout(() => setIsFiring(false), 300);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const path = [
      { x: 0.15, y: 0.2 }, { x: 0.5, y: 0.1 }, { x: 0.85, y: 0.2 },
      { x: 0.9, y: 0.6 }, { x: 0.65, y: 0.85 }, { x: 0.35, y: 0.85 },
      { x: 0.1, y: 0.6 }, { x: 0.15, y: 0.2 }
    ];

    const render = () => {
      t += speed * 0.000015;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = 'rgba(4, 9, 18, 0.45)';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(255, 153, 0, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 153, 0, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      path.forEach((pt, i) => {
        const x = pt.x * w;
        const y = pt.y * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      const segCount = path.length - 1;
      const totalT = (t % 1) * segCount;
      const segIndex = Math.floor(totalT);
      const segFrac = totalT - segIndex;
      const p1 = path[segIndex];
      const p2 = path[segIndex + 1] || path[0];

      const laserX = (p1.x + (p2.x - p1.x) * segFrac) * w;
      const laserY = (p1.y + (p2.y - p1.y) * segFrac) * h;

      ctx.strokeStyle = isFiring ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 153, 0, 0.7)';
      ctx.lineWidth = isFiring ? 3.5 : 2;
      ctx.shadowColor = '#ff9900';
      ctx.shadowBlur = isFiring ? 25 : 12;
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(laserX, laserY);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(laserX, laserY, isFiring ? 5.5 : 3.5, 0, Math.PI * 2);
      ctx.fill();

      for (let s = 0; s < 4; s++) {
        const sparkAngle = Math.random() * Math.PI * 2;
        const sparkDist = Math.random() * 10 + 4;
        ctx.fillStyle = '#ffb703';
        ctx.beginPath();
        ctx.arc(
          laserX + Math.cos(sparkAngle) * sparkDist,
          laserY + Math.sin(sparkAngle) * sparkDist,
          1.2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [speed, isFiring]);

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-amber-500/20">
        <span className="flex items-center gap-1.5 text-amber-400 font-bold">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          DB25 HARDWARE GATING // MarkEzd.dll
        </span>
        <span>LATENCY: &lt;1.0 μs</span>
      </div>

      <div className="relative my-2 rounded border border-amber-500/30 overflow-hidden bg-black/75">
        <canvas ref={canvasRef} width={400} height={165} className="w-full h-[165px] block" />
        <div className="absolute top-2 left-2 text-[10px] font-mono text-amber-300 bg-black/80 px-2 py-0.5 rounded border border-amber-500/30">
          GALVO HEAD: XY-2-100 PROTOCOL
        </div>
      </div>

      <div className="bg-slate-900/85 p-2 rounded border border-amber-500/30 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2 flex-1 mr-4">
          <span className="text-slate-400 text-[10px]">SPEED:</span>
          <input
            type="range"
            min="400"
            max="3000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="flex-1 accent-amber-400 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
          />
          <span className="text-amber-300 font-bold text-[10px] w-14">{speed} mm/s</span>
        </div>

        <button
          onClick={handleTestPulse}
          data-target="PULSE"
          className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-display font-bold text-[10px] tracking-wider transition-all glow-amber-sm"
        >
          [FIRE_PULSE]
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// MACHINE 04: Metal3-D Additive Kinematics & Slicing Toolpath Visualizer
// ----------------------------------------------------------------------------
function Metal3DVisualizer() {
  const canvasRef = useRef(null);
  const [feedrate, setFeedrate] = useState(120); // mm/s
  const [layer, setLayer] = useState(42);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const render = () => {
      t += 0.025;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = 'rgba(4, 9, 18, 0.45)';
      ctx.fillRect(0, 0, w, h);

      // Build envelope wireframe
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.lineWidth = 1;
      const centerX = w / 2;
      const centerY = h * 0.72;

      // Isometric build plate
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX + i * 36 - 108, centerY - i * 18);
        ctx.lineTo(centerX + i * 36, centerY + 54 - i * 18);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX - i * 36, centerY - 54 + i * 18);
        ctx.lineTo(centerX - i * 36 + 108, centerY + i * 18);
        ctx.stroke();
      }

      // Additive Hatching Vectors (Concentric perimeter fill)
      const numRings = 4;
      for (let r = 1; r <= numRings; r++) {
        const radius = r * 18;
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.25 + r * 0.15})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let a = 0; a <= 360; a += 15) {
          const rad = (a * Math.PI) / 180;
          const px = centerX + Math.cos(rad) * radius * 1.4;
          const py = centerY - 25 + Math.sin(rad) * (radius * 0.7);
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Active Deposition Head Position
      const headAngle = t * (feedrate / 40);
      const activeRad = 54;
      const headX = centerX + Math.cos(headAngle) * activeRad * 1.4;
      const headY = centerY - 25 + Math.sin(headAngle) * (activeRad * 0.7);

      // Hot molten pool
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(headX, headY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Nozzle stem
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(headX, headY - 26);
      ctx.lineTo(headX, headY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [feedrate, layer]);

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-emerald-500/20">
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          KINEMATICS MOTION PLANNER // TRAPEZOIDAL S-CURVE
        </span>
        <span>RATE: 250 kHz SERVO STEPPING</span>
      </div>

      <div className="relative my-2 rounded border border-emerald-500/30 overflow-hidden bg-black/75">
        <canvas ref={canvasRef} width={400} height={165} className="w-full h-[165px] block" />
        <div className="absolute top-2 left-2 text-[10px] font-mono text-emerald-300 bg-black/80 px-2 py-0.5 rounded border border-emerald-500/30">
          LAYER: 042/120 // G1 VECTOR DEPOSITION
        </div>
        <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-400 bg-black/80 px-2 py-0.5 rounded border border-slate-700">
          LOOKAHEAD: 16 BLOCKS OK
        </div>
      </div>

      <div className="bg-slate-900/85 p-2 rounded border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
        <div className="flex items-center gap-2 flex-1 min-w-[140px]">
          <span className="text-slate-400 text-[10px]">FEED:</span>
          <input
            type="range"
            min="40"
            max="240"
            step="10"
            value={feedrate}
            onChange={(e) => setFeedrate(Number(e.target.value))}
            className="flex-1 accent-emerald-400 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
          />
          <span className="text-emerald-300 font-bold text-[10px] w-14">{feedrate} mm/s</span>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[140px]">
          <span className="text-slate-400 text-[10px]">LAYER:</span>
          <input
            type="range"
            min="1"
            max="120"
            step="1"
            value={layer}
            onChange={(e) => setLayer(Number(e.target.value))}
            className="flex-1 accent-cyan-400 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
          />
          <span className="text-cyan-300 font-bold text-[10px] w-12">{layer}/120</span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// BARE-METAL CODE INSPECTOR SNIPPETS
// ----------------------------------------------------------------------------
const BARE_METAL_CODE = {
  '01': {
    filename: 'stm32h7_thermal_dma.cpp',
    lang: 'C++ // STM32 BARE-METAL',
    lines: 28,
    code: `// ============================================================================
// STM32H743ZI Bare-Metal DMA Circular Buffer & Hardware Watchdog (IWDG)
// ============================================================================
#include "stm32h7xx_hal.h"

#define THERMAL_CHANNELS          16
#define OVERSAMPLE_FACTOR         4
#define ADC_BUF_SIZE              (THERMAL_CHANNELS * OVERSAMPLE_FACTOR)
#define CRITICAL_TEMP_THRESHOLD_V 2.85f // ~110°C on 10k NTC voltage divider

alignas(32) static uint16_t adc_dma_buffer[ADC_BUF_SIZE];
static volatile float filtered_temperatures[THERMAL_CHANNELS];

void MX_ADC1_Init(void) {
    hadc1.Instance = ADC1;
    hadc1.Init.Resolution = ADC_RESOLUTION_12B;
    hadc1.Init.ScanConvMode = ADC_SCAN_ENABLE;
    hadc1.Init.ContinuousConvMode = ENABLE;
    hadc1.Init.DMAContinuousRequests = ENABLE;
    HAL_ADC_Init(&hadc1);

    // Circular DMA: Continuous multi-channel sampling bypasses CPU interrupts
    HAL_DMA_Start(&hdma_adc1, (uint32_t)&ADC1->DR, (uint32_t)adc_dma_buffer, ADC_BUF_SIZE);
}

void HAL_ADC_ConvCpltCallback(ADC_HandleTypeDef* hadc) {
    SCB_InvalidateDCache_by_Addr((uint32_t*)adc_dma_buffer, sizeof(adc_dma_buffer));
    for (int ch = 0; ch < THERMAL_CHANNELS; ++ch) {
        float raw_volts = (adc_dma_buffer[ch] / 4095.0f) * 3.3f;
        if (raw_volts >= CRITICAL_TEMP_THRESHOLD_V) {
            IWDG->KR = 0x0000; // Immediate emergency hardware watchdog trip
            HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);
            NVIC_SystemReset();
        }
    }
    IWDG->KR = 0xAAAA; // Feed hardware watchdog within 50ms deadline
}`,
  },
  '02': {
    filename: 'bio4d_pid_controller.c + m118_parser.py',
    lang: 'C & Python // DUAL-MCU',
    lines: 34,
    code: `/* Deterministic 100Hz Timer Interrupt PID for MPX5700 Sensor */
void TIM6_DAC_IRQHandler(void) {
    if (TIM6->SR & TIM_SR_UIF) {
        TIM6->SR = ~TIM_SR_UIF; // Clear ISR flag
        
        float raw_v = (ADC3->DR / 4095.0f) * 3.3f;
        float current_kpa = ((raw_v / 5.0f) - 0.04f) / 0.0012858f; // MPX5700 transfer fn
        
        float error = target_pressure_kpa - current_kpa;
        integral += error * DT_100HZ;
        integral = CLAMP(integral, -MAX_INTEGRAL, MAX_INTEGRAL); // Anti-windup
        float derivative = (error - last_error) / DT_100HZ;
        last_error = error;
        
        float duty = (Kp * error) + (Ki * integral) + (Kd * derivative);
        TIM1->CCR1 = CLAMP((uint32_t)(duty * TIM1_AUTORELOAD), 0, TIM1_AUTORELOAD);
    }
}

# ----------------------------------------------------------------------------
# Python PySide6 Lockstep Serial Telemetry Parser (M118 Frame)
# ----------------------------------------------------------------------------
import re, binascii

def parse_m118_telemetry_frame(raw_packet: bytes) -> dict:
    if not raw_packet.startswith(b"M118"):
        return None
    match = re.match(rb"M118 A:([A-Z0-9]+) P:([0-9.]+) T:([0-9.]+) S:([0-9A-F]{2})", raw_packet)
    if not match:
        return None
    axis, kpa, temp, crc = match.groups()
    return {"axis": axis.decode(), "kpa": float(kpa), "temp_c": float(temp)}`,
  },
  '03': {
    filename: 'galvo_fastgate_db25.cpp',
    lang: 'C++ & Win32 MarkEzd.dll',
    lines: 28,
    code: `// ============================================================================
// Sub-Microsecond DB25 Hardware Gating & Win32 MarkEzd.dll Interfacing
// ============================================================================
#include <windows.h>
#include <cstdint>

typedef int (*Lmc1_Initial)(const char* strPath, int bTest);
typedef int (*Lmc1_MarkEntity)(int nEntityIndex);

class GalvoLaserController {
    HMODULE hDll = nullptr;
    uint16_t db25_port = 0x378; // LPT1 Hard Real-Time Port Address

public:
    void SubMicrosecondGatePulse(uint32_t microsecond_duration) {
        LARGE_INTEGER t_freq, t_start, t_now;
        QueryPerformanceFrequency(&t_freq);
        QueryPerformanceCounter(&t_start);
        int64_t target_ticks = (t_freq.QuadPart * microsecond_duration) / 1000000;

        // Drive Pin 14 (LASER_GATE) HIGH with zero kernel latency
        _outp(db25_port, _inp(db25_port) | (1 << 2));

        // Precision spinlock for microsecond timing
        while (true) {
            QueryPerformanceCounter(&t_now);
            if ((t_now.QuadPart - t_start.QuadPart) >= target_ticks) break;
        }

        // Pull Pin 14 LOW
        _outp(db25_port, _inp(db25_port) & ~(1 << 2));
    }
};`,
  },
  '04': {
    filename: 'metal3d_kinematics_planner.cpp',
    lang: 'C++ // ACCELERATION PLANNER',
    lines: 32,
    code: `// ============================================================================
// Metal3-D: Real-Time Lookahead Kinematics Buffer & Trapezoidal S-Curve
// ============================================================================
#include <cstdint>
#include <cmath>

struct KinematicBlock {
    float dx, dy, dz;
    float nominal_speed_mms;
    float acceleration_mms2;
    uint32_t step_count;
};

class Metal3DMotionEngine {
    static constexpr uint8_t LOOKAHEAD_BUFFER_SIZE = 16;
    KinematicBlock buffer[LOOKAHEAD_BUFFER_SIZE];
    uint8_t head = 0, tail = 0;

public:
    void EnqueueGCodeMove(float target_x, float target_y, float target_z, float feedrate) {
        KinematicBlock& blk = buffer[head];
        blk.dx = target_x - current_x;
        blk.dy = target_y - current_y;
        blk.dz = target_z - current_z;
        blk.nominal_speed_mms = feedrate;
        blk.acceleration_mms2 = 1800.0f; // Jerk-limited profile
        
        CalculateTrapezoidalLookahead();
        head = (head + 1) % LOOKAHEAD_BUFFER_SIZE;
    }

    void ExecuteStepTimerISR() {
        // High-precision Step/Dir pulse generation on TIM2 (250kHz)
        TIM2->ARR = CalculatePulseDelay(buffer[tail].nominal_speed_mms);
        HAL_GPIO_TogglePin(GPIOE, GPIO_PIN_2); // Pulse Step Line
    }
};`,
  },
};

// Architecture Block Diagrams for Tab 1
const ARCH_BLOCKS = {
  '01': [
    { title: '16x NTC SENSORS', sub: '10k Thermistors' },
    { title: 'ANALOG MUX', sub: 'Low R-On Matched' },
    { title: 'STM32 ADC1 DMA', sub: '12-bit Circular' },
    { title: 'IWDG INTERLOCK', sub: '50ms Cutoff Window' },
    { title: 'PYSIDE6 ATE', sub: 'Real-Time Heatmap' },
  ],
  '02': [
    { title: 'MPX5700 TRANSDUCER', sub: '0-700 kPa Analog' },
    { title: '100Hz TIM6 ISR', sub: 'Anti-Windup PID' },
    { title: 'DUAL-MCU SYNC', sub: 'M118 Lockstep' },
    { title: 'STEPPER GATING', sub: 'Micron Precision' },
    { title: 'PYOPENGL TWIN', sub: '3D Toolpath View' },
  ],
  '03': [
    { title: 'Win32 MarkEzd.dll', sub: 'XY-2-100 Protocol' },
    { title: 'G-CODE TRANSFORM', sub: 'Geometric Vectors' },
    { title: 'DB25 PORT DRIVER', sub: '<1.0μs Pin Gating' },
    { title: 'GALVO MIRRORS', sub: '3,000 mm/s Motion' },
    { title: 'FIBER LASER', sub: 'High-Speed Pulse' },
  ],
  '04': [
    { title: '3D CAD SLICER', sub: 'Toolpath Slicing' },
    { title: 'LOOKAHEAD BUFFER', sub: '16-Block Trapezoid' },
    { title: 'SERVO TIM2 ISR', sub: '250 kHz Step/Dir' },
    { title: 'PYSIDE6 ATE', sub: 'Headless Suite' },
    { title: 'CAN BUS GATING', sub: '1 Mbps Multi-Drop' },
  ],
};

// ----------------------------------------------------------------------------
// MAIN PINNED INSPECTION BAY (4 REAL INDUSTRIAL SYSTEMS)
// ----------------------------------------------------------------------------
const MACHINES_DATA = [
  {
    id: '01',
    code: 'MACH_01 // SVNIT DAQ',
    title: '16-CHANNEL THERMAL DAQ & SAFETY WATCHDOG',
    organization: 'SVNIT (Surat) / Industrial R&D',
    dropKey: 'machine01_svnit',
    repoUrl: 'https://github.com/AtharvaYadav-dev',
    repoName: 'AtharvaYadav-dev',
    component: ThermalHeatmapMatrix,
    summary:
      'High-speed multi-channel data acquisition architecture with sub-millisecond thermistor DMA scanning and hardware-level emergency cutoff.',
    bottleneck:
      'Multi-zone industrial heater arrays operate near critical thermal thresholds. Traditional RTOS polling introduced jitter up to 14ms—risking catastrophic thermal runaway, sensor multiplexer crosstalk, and delayed emergency cutoff.',
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
    badges: ['16-CH DMA', '12-BIT RES', '<500μs LATENCY', 'WATCHDOG ARMED'],
  },
  {
    id: '02',
    code: 'MACH_02 // BIO4D & INKPRINTER',
    title: 'MULTI-AXIS BIOPRINTER & PNEUMATIC EXTRUSION SYSTEM',
    organization: 'SPPL OEM Machine Architecture',
    dropKey: 'machine02_bio4d',
    repoUrl: 'https://github.com/AtharvaYadav-dev/InkPrinter',
    repoName: 'AtharvaYadav-dev/InkPrinter',
    component: BioScaffoldVisualizer,
    summary:
      'Precision bio-fabrication system with dual-MCU lockstep synchronization, 100Hz deterministic closed-loop pneumatic pressure regulation, and real-time PyOpenGL digital twin.',
    bottleneck:
      'Non-Newtonian biomaterial hydrogels exhibit non-linear shear thinning and syringe backpressure delay. Open-loop mechanical extrusion caused strand tearing, nozzle clogging, and cell viability degradation.',
    solution:
      'Replaced mechanical extrusion with an MPX5700 piezo transducer feedback loop running a 100Hz deterministic timer interrupt (TIM6 ISR) PID controller. Built custom bidirectional M118 serial lockstep handshake with CRC8 frame validation to synchronize motion gating with Python/PyOpenGL host.',
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
    badges: ['DUAL-MCU SYNC', '100Hz PID', 'M118 PROTOCOL', 'OPENGL TWIN'],
  },
  {
    id: '03',
    code: 'MACH_03 // GALVO_SCRIBER',
    title: 'HIGH-SPEED GALVO & CO2 LASER SCRIBING CONTROLLER',
    organization: 'Precision Industrial Micro-Machining',
    dropKey: 'machine03_galvo',
    repoUrl: 'https://github.com/AtharvaYadav-dev/Galvo_Scriber',
    repoName: 'AtharvaYadav-dev/Galvo_Scriber',
    component: GalvoLaserVisualizer,
    summary:
      'High-speed Galvo mirror laser beam controller with sub-microsecond DB25 parallel hardware gating, Win32 DLL interfacing, and real-time vector path optimization.',
    bottleneck:
      'Windows OS user-mode scheduling jitter (10-15ms) caused burn marks and corner over-exposure during Galvo mirror turnaround when executing micro-machining vector paths at speeds up to 3,000 mm/s.',
    solution:
      'Engineered low-level Win32 DLL bindings (MarkEzd.dll) and direct hardware port gating via DB25 parallel interface with high-resolution QueryPerformanceCounter spinlocks. Synchronized laser gate firing with XY-2-100 galvanometer mirror position within sub-microsecond tolerances.',
    blueprintFlow: [
      { name: 'CAD VECTOR ENGINE', detail: 'Geometric path decomposition', subsystem: 'TOOLPATH_MATH' },
      { name: 'WIN32 MARKEZD DLL', detail: 'Low-level C++/ctypes binding', subsystem: 'KERNEL_DRIVER' },
      { name: 'DB25 PARALLEL PORT', detail: 'Microsecond hardware gate pulse', subsystem: 'HARD_REAL_TIME' },
      { name: 'GALVO MIRRORS', detail: 'XY-2-100 optical deflection', subsystem: 'LASER_HEAD' },
    ],
    pinoutSpecs: [
      { pin: 'DB25 Pin 14', bus: 'LASER_GATE_EN', speed: '< 1.0 μs', desc: 'Active HIGH Hardware Laser Gate' },
      { pin: 'DB25 Pin 2-9', bus: 'DATA_D0-D7', speed: 'High-Speed', desc: 'Coordinate Calibration Vector' },
      { pin: 'DB25 Pin 1', bus: 'STROBE_CLOCK', speed: 'Latched Pulse', desc: 'Hardware Latched Gating Pulse' },
      { pin: 'DB25 Pin 11', bus: 'BUSY_ACK', speed: 'Low Latency', desc: 'Motion Controller Acknowledge' },
    ],
    deepDive:
      'Implemented for high-throughput industrial laser marking and scribing. Bypasses standard Windows API latency by binding directly to industrial controller DLLs and utilizing microsecond hardware timers for laser gating. Delivers razor-sharp vector kerfs without thermal hazing or corner burn-through.',
    latencyMetric: '< 1.0 μs Gate Jitter',
    techSpecs: [
      { label: 'Software Stack', value: 'C/C++, Python, Win32 MarkEzd.dll' },
      { label: 'Hardware Bus', value: 'DB25 Parallel Port Hard Real-Time Gating' },
      { label: 'Vector Engine', value: 'Custom G-Code Geometric Transformations' },
      { label: 'Scan Speed', value: 'Up to 3,000 mm/s Vector Tracking' },
    ],
    badges: ['DB25 GATING', 'MARKEZD.DLL', 'SUB-MICROSECOND', 'GALVO MIRROR'],
  },
  {
    id: '04',
    code: 'MACH_04 // METAL3-D',
    title: 'ADDITIVE MANUFACTURING KINEMATICS & SUPERVISORY CONTROL',
    organization: 'Industrial Additive Deposition Architecture',
    dropKey: 'machine04_metal3d',
    repoUrl: 'https://github.com/AtharvaYadav-dev/Metal3-D',
    repoName: 'AtharvaYadav-dev/Metal3-D',
    component: Metal3DVisualizer,
    summary:
      'Industrial additive manufacturing control interface and firmware synchronization layer designed for precision deposition, featuring real-time diagnostics, custom vector hatching, and headless ATE verification.',
    bottleneck:
      'Complex 3D geometry slicing produces massive G-code queues. Serial transmission bottlenecks and non-constant acceleration profiles caused stepper resonance, inconsistent deposition bead width, and surface delamination.',
    solution:
      'Developed an optimized G-code stream parser and trapezoidal acceleration lookahead planner in C++ with PySide6 supervisory interface. Engineered custom vector hatching algorithms and headless Automated Test Equipment (ATE) verification suites for rapid production validation.',
    blueprintFlow: [
      { name: '3D CAD SLICING', detail: 'Custom perimeter vector hatching', subsystem: 'CAM_ENGINE' },
      { name: 'LOOKAHEAD BUFFER', detail: '16-block trapezoidal velocity', subsystem: 'MOTION_PLANNER' },
      { name: 'SERVO TIM2 ISR', detail: '250 kHz Step/Dir generation', subsystem: 'HARDWARE_TIMERS' },
      { name: 'PYSIDE6 ATE SUITE', detail: 'Headless verification testbench', subsystem: 'SUPERVISORY_UI' },
    ],
    pinoutSpecs: [
      { pin: 'PE2 - PE6', bus: 'SERVO_STEP_DIR', speed: '250 kHz', desc: 'Trapezoidal Step/Dir Output Lines' },
      { pin: 'PB4', bus: 'EXTRUDER_PWM', speed: '16-bit Timer', desc: 'Deposition Feedrate Regulation' },
      { pin: 'PD3 / PD4', bus: 'CAN_TX/RX', speed: '1 Mbps', desc: 'Industrial Multi-Drop Node Bus' },
      { pin: 'PC8', bus: 'HEATER_GATE', speed: 'Closed-Loop PID', desc: 'Deposition Chamber Temperature Gating' },
    ],
    deepDive:
      'Architected to bridge additive manufacturing slicing with hard real-time machine execution. Metal3-D parses multi-megabyte G-code files, calculates trapezoidal acceleration curves with jerk reduction, and feeds step vectors to industrial kinematics controllers while verifying execution via headless automated test suites.',
    latencyMetric: '250 kHz Stepping // Zero Starvation',
    techSpecs: [
      { label: 'Software Stack', value: 'C++, Python, PySide6 Desktop ATE' },
      { label: 'Motion Planner', value: '16-Block Lookahead Trapezoidal Buffer' },
      { label: 'CAD Integration', value: 'Custom G-Code Slicing & Hatching' },
      { label: 'Test Harness', value: 'Headless Automated Test Equipment (ATE)' },
    ],
    badges: ['TRAPEZOIDAL S-CURVE', '250kHz SERVO', 'ATE VERIFIED', 'PYSIDE6 SUITE'],
  },
];

export default function MachinesBay() {
  const [activeMachineIndex, setActiveMachineIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('feed');
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
        end: '+=300%',
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
      rotX: -normY * 12,
      rotY: normX * 12,
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
    <section ref={containerRef} id="machines" className="relative z-10 bg-[#030712] min-h-[400vh]">
      {/* Slide-Over Engineering Blueprint Modal Drawer */}
      <BlueprintDrawer
        machine={activeMachine}
        isOpen={isBlueprintOpen}
        onClose={() => setIsBlueprintOpen(false)}
      />

      <div
        ref={pinSectionRef}
        className="h-screen w-full flex flex-col justify-between py-5 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden"
      >
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-2.5">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-xs tracking-widest text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded border border-cyan-500/40">
              01 // INSPECTION_BAY // 4_FLAGSHIP_SYSTEMS
            </span>
            <h2 className="text-sm md:text-base font-display font-bold text-slate-100 flex items-center gap-2">
              <span>INDUSTRIAL HARDWARE TWINS</span>
              <span className="text-xs font-mono text-cyan-400 font-normal">
                [{activeMachineIndex + 1}/{MACHINES_DATA.length}]
              </span>
            </h2>
          </div>

          {/* Machine Selector Tabs */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            {MACHINES_DATA.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => {
                  soundEngine.playRelayClick();
                  setActiveMachineIndex(idx);
                }}
                onMouseEnter={() => soundEngine.playHoverBlip()}
                data-target={m.code}
                className={`px-2.5 sm:px-3 py-1 rounded border transition-all cursor-pointer ${
                  activeMachineIndex === idx
                    ? 'bg-cyan-500 text-black font-bold border-cyan-400 glow-cyan-sm'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                M_{m.id}
              </button>
            ))}
          </div>
        </div>

        {/* Central Machine Inspection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto items-center">
          {/* Left Column: Tech Readouts & Specifications */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-mono text-cyan-400 tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <ScrambleText text={activeMachine.code} key={activeMachine.id} />
              <span className="text-slate-500">|</span>
              <span className="text-slate-400 truncate">{activeMachine.organization}</span>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold text-slate-100 tracking-wide uppercase leading-tight">
              {activeMachine.title}
            </h3>

            <p className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed border-l-2 border-cyan-500/40 pl-3">
              {activeMachine.summary}
            </p>

            {/* Hardware Specification Rows */}
            <div className="space-y-1 pt-1">
              {activeMachine.techSpecs.map((spec, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-center justify-between text-xs font-mono p-1.5 sm:p-2 rounded bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-colors"
                >
                  <span className="text-slate-400">{spec.label}:</span>
                  <span className="text-cyan-300 font-bold text-right">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons: Blueprint Drawer + GitHub Repo */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
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
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeMachine.badges.map((badge, bIdx) => (
                <span
                  key={bIdx}
                  className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300"
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
                    <span>[LIVE_FEED &amp; TELEMETRY]</span>
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
                    <span>[BARE_METAL_SOURCE_INSPECTOR]</span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>FRAME_SYNC: 60FPS</span>
                </div>
              </div>

              {/* TAB 1: LIVE HARDWARE FEED & INTERACTIVE ARCHITECTURE DIAGRAM */}
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
                        [OPEN BLUEPRINT ➔]
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

              {/* TAB 2: BARE-METAL SOURCE CODE INSPECTOR (IDE VIEW) */}
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

        {/* Footer Progress Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2.5 border-t border-cyan-500/20">
          <span>SCROLL TO ADVANCE HARDWARE INSPECTION</span>
          <div className="flex items-center gap-2">
            <span className="text-cyan-300 font-bold">STAGE {activeMachineIndex + 1} OF {MACHINES_DATA.length}</span>
            <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${((activeMachineIndex + 1) / MACHINES_DATA.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
