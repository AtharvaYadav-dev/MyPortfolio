# Atharva Yadav // Industrial Firmware & Embedded Systems Portfolio

```
    █████╗ ████████╗██╗  ██╗ █████╗ ██████╗ ██╗   ██╗ █████╗ 
   ██╔══██╗╚══██╔══╝██║  ██║██╔══██╗██╔══██╗██║   ██║██╔══██╗
   ███████║   ██║   ███████║███████║██████╔╝██║   ██║███████║
   ██╔══██║   ██║   ██╔══██║██╔══██║██╔══██╗╚██╗ ██╔╝██╔══██║
   ██║  ██║   ██║   ██║  ██║██║  ██║██║  ██║ ╚████╔╝ ██║  ██║
   ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝
   [ INDUSTRIAL FIRMWARE // BARE-METAL C++ // EMBEDDED SYSTEMS ]
```

[![Live Demo](https://img.shields.io/badge/LIVE_TELEMETRY-https%3A%2F%2Fmy--portfolio--nu--seven--83.vercel.app%2F-00f0ff?style=for-the-badge&logo=vercel&logoColor=black)](https://my-portfolio-nu-seven-83.vercel.app/)
[![Firmware Stack](https://img.shields.io/badge/FIRMWARE-STM32_%7C_FreeRTOS_%7C_Bare--Metal_C%2B%2B-10b981?style=for-the-badge&logo=cplusplus&logoColor=white)](https://my-portfolio-nu-seven-83.vercel.app/)
[![Desktop ATE](https://img.shields.io/badge/SUPERVISORY_UI-PySide6_%7C_PyOpenGL-38bdf8?style=for-the-badge&logo=python&logoColor=white)](https://my-portfolio-nu-seven-83.vercel.app/)
[![Frontend Engine](https://img.shields.io/badge/WEB_ENGINE-React_19_%7C_Vite_%7C_Three.js-8b5cf6?style=for-the-badge&logo=three.js&logoColor=white)](https://my-portfolio-nu-seven-83.vercel.app/)

---

## 🌐 Live Production Deployment

> **Deployed Production URL:**  
> 👉 **[https://my-portfolio-nu-seven-83.vercel.app/](https://my-portfolio-nu-seven-83.vercel.app/)**

Experience the real-time 3D volumetric G-Code toolpath canvas, synchronized 4-channel oscilloscope logic analyzer, live fault injection with watchdog hardware recovery, bare-metal source code inspectors, and procedural Web Audio API synthesizer directly in your browser.

---

## ⚡ Executive Summary

**Atharva Yadav** is an Industrial Firmware Developer at **Specialise Products Pvt. Ltd. (SPPL)** in Mumbai, India. Promoted from Graduate Engineer Trainee (GET) to Firmware Developer in just 4 months, Atharva architects hard real-time embedded systems bridging silicon registers to desktop supervisory interfaces.

### The "Silicon-to-Screen" Philosophy
Most engineering organizations silo firmware, desktop software, and mechatronics into disconnected teams—creating weeks of API synchronization meetings, jitter finger-pointing, and integration defects. Atharva delivers **zero-friction single-pipeline engineering**:
1. **Silicon Level**: Bare-metal C/C++, circular DMA buffers, sub-millisecond ADC interrupt scanning, 100Hz closed-loop PID control, and independent hardware watchdogs (IWDG) on STM32 / ARM Cortex-M.
2. **Desktop ATE & Tooling**: Headless automated test equipment, multi-threaded PySide6/Qt desktop apps, hardware-accelerated PyOpenGL 3D digital twins, and Win32 DLL bindings (`MarkEzd.dll`).
3. **Mechatronics & Laser Kinematics**: Galvo mirror optical steering, CO2 laser sub-microsecond DB25 parallel port gating, and trapezoidal lookahead motion kinematics.
4. **Academic Depth**: Currently pursuing a **Master of Computer Applications (MCA) in AI & Machine Learning** (Dr. D. Y. Patil Vidyapeeth) with a **Bachelor of Science in Information Technology (B.Sc. IT)** from the University of Mumbai.

---

## 🚀 Key Interactive Subsystems

### 1. True 3D Interactive Volumetric Toolpath Canvas (`Three.js`)
- **Real-Time Toolpath Generation**: Renders multi-axis volumetric toolpaths (Bio4D Bioprinter layers and Galvo Laser scan vectors) with custom additive-blended shaders.
- **Active Nozzle Coordinate Tracking**: Emits glowing particle sparks at the live moving coordinate `(X, Y, Z)` displayed dynamically in the HUD.
- **Interactive Orbit & Camera Controls**: Mouse-drag yaw/pitch rotation with smooth momentum dampening and camera FOV zoom linked to section scroll depth.
- **Thermal Runaway Strobe**: Dynamic visual alert response when hardware faults are injected.

### 2. Live 4-Channel Synchronized Logic Analyzer & PID Bench
A 60FPS hardware oscilloscope simulating real-time telemetry from industrial machinery:
- **CH1 (Cyan)**: 16-Channel Thermistor ADC DMA Stream (Continuous circular buffer sampling with 12-bit resolution).
- **CH2 (Emerald)**: MPX5700DP Pressure Sensor & 100Hz PID Loop (Deterministic pneumatic extrusion regulation).
- **CH3 (Amber)**: DB25 High-Speed Laser Gate (Sub-microsecond TTL pulses for vector scribing).
- **CH4 (Purple)**: STM32 Independent Hardware Watchdog (IWDG 120ms countdown pulse with automatic kick).
- **Fault Injection Bench**: Click **`[⚡ INJECT THERMAL RUNAWAY]`** to trigger an over-temp fault (>240°C), watchdog freeze, and automatic hardware safety cutoff with a 2-second recovery cycle.

### 3. Four Industrial Flagship System Bays
Comprehensive deep-dives into real-world production hardware designed and deployed by Atharva:
1. **SVNIT 16-Channel High-Speed Thermal DAQ**: Circular DMA buffers, dual-stage moving average filter, SPI/UART telemetry streaming to supervisory software.
2. **Bio4D Bioprinter & InkPrinter Control Engine**: Custom M118 dual-MCU lockstep communication protocol, deterministic 100Hz pneumatic PID loop, multi-threaded PySide6 ATE with PyOpenGL digital twin.
3. **Industrial Galvo Laser Vector Scriber**: High-speed Galvo mirror steering, sub-microsecond DB25 parallel port gating via low-level Win32 DLL bindings (`MarkEzd.dll`), burn-free corner lookahead kinematics.
4. **Metal3-D Powder Bed Fusion (PBF) Visualizer**: Interactive 3D layer-by-layer laser beam melting simulation with recoater blade passes, hatch vector tracking, and inert argon chamber telemetry.

Each machine features:
- **Holographic 3D Tilt Card**: Mouse-reactive perspective tilt and glow matrix.
- **Dual-View Switch**: Toggle between `[LIVE_FEED]` telemetry and syntax-highlighted `[BARE_METAL_CODE]` source files.
- **Slide-Over Blueprint & Architecture Drawer**: 4-stage SVG block flow diagrams, register/pinout tables, bottleneck vs. bare-metal solution breakdowns, and direct GitHub repositories.

### 4. "The Complete Builder" Bento Grid (`[03.5 // PROFILE_MATRIX]`)
A 5-card bento grid illuminating cross-functional capabilities:
- **Card 1 (Hero)**: Fast-Track R&D Career Acceleration (GET to Firmware Developer in 4 months at SPPL).
- **Card 2**: 3 Teams in 1 (Silicon-to-Screen single-pipeline architecture).
- **Card 3**: CAD & Laser Mechatronics (SolidWorks, optical optics, DB25 Win32).
- **Card 4**: Full-Stack Web & Social Impact (Interactive web apps, real-time dashboards).
- **Card 5**: Academic Rigor (MCA in AI/ML & B.Sc. IT).

### 5. Interactive "Why Hire Atharva" ROI & Consolidation Bench
- **Dynamic Timeline Slider**: Adjust project scope from 2 to 12 months.
- **Real-Time ROI Metrics**: Automatically calculates estimated headcount capital savings (~$45K+) and meeting hours eliminated (96+ hrs) by replacing 3 fragmented hires with 1 high-impact R&D engineer.
- **Comparison Matrix**: Contrasts siloed cross-team lag (3-4 weeks) against Atharva's unified 0-day API sync.

### 6. Procedural Web Audio API Sound Synthesizer
- **Zero External Audio Assets**: 100% procedural sound synthesis using native browser `AudioContext` oscillators and gain nodes.
- **Haptic Audio Feedback**: Crisp 2ms hover blips (1200Hz), mechanical relay clicks, warning pulses, and laser chirps.
- **Navbar HUD Audio Control**: Click **`[🔊 AUDIO_HUD: ON/OFF]`** to mute or enable synthesized sound effects. Includes user-gesture auto-unlock compliance.

### 7. Interactive UART Serial Terminal CTA (`COM3 // 115200 Baud`)
Simulates a hardware serial console with interactive commands:
- `help` — List all available firmware and telemetry commands.
- `projects` — Output high-level specs of all 4 industrial machines.
- `inkprinter` / `galvo` / `metal3d` — Inspect hardware architecture registers.
- `experience` — View career telemetry and promotions at SPPL.
- `contact` — Transmit instant communication to `atharva.embedded@gmail.com`.
- `resume` — Access Atharva's official engineering resume.
- `clear` — Wipe the console scrollback buffer.

---

## 🛠️ Hardware & Software Tech Stack

| Domain | Technologies & Frameworks |
| :--- | :--- |
| **Microcontrollers** | STM32 (STM32F401 Black Pill, STM32H7, STM32F103 Blue Pill), ESP32-WROOM, Arduino Mega |
| **Firmware & RTOS** | Bare-Metal C/C++ (C++17), FreeRTOS, Circular DMA, Hardware Timers, Interrupt Handlers (ISR), IWDG |
| **Busses & Protocols** | SPI, I2C, UART/USART (115200 / 921600 Baud), RS-485, DB25 Parallel Port, USB-CDC, Custom M118 Protocol |
| **Supervisory UIs & ATE**| Python 3.11+, PySide6 (Qt for Python), PyOpenGL (Hardware 3D Digital Twin), Win32 API (`ctypes`), Matplotlib |
| **Sensors & Actuators** | K-Type Thermocouples (MAX6675/MAX31855), NTC 100K Thermistors, MPX5700DP Pressure Sensors, Galvo Mirrors, Steppers |
| **Web & Graphics Engine**| React 19, Vite, Three.js, Web Audio API, Tailwind CSS, Framer Motion, Lenis Smooth Scroll, Lucide React |

---

## 📂 Project Structure

```
Portfolio/
├── public/
│   ├── favicon.ico
│   ├── og-image.png                # Rich LinkedIn/Twitter OpenGraph card preview
│   └── resume.pdf                  # Atharva Yadav's Engineering Resume
├── src/
│   ├── components/
│   │   ├── BlueprintDrawer.jsx         # Slide-over architecture modal with SVG flow diagrams
│   │   ├── BootSequence.jsx            # Cyberpunk BIOS boot self-test screen
│   │   ├── CareerTelemetryTimeline.jsx # Interactive vertical laser spine career timeline
│   │   ├── CyberCursor.jsx             # Dual-ring hardware targeting cursor
│   │   ├── EngineerProfileBento.jsx    # "The Complete Builder" 5-card Bento Grid
│   │   ├── FooterHUD.jsx               # Cybernetic footer with direct GitHub & LinkedIn links
│   │   ├── HeroSection.jsx             # Hero section with callsign & status telemetry
│   │   ├── HireAtharvaROIWidget.jsx    # Interactive 3-in-1 Role Consolidation & ROI calculator
│   │   ├── InteractiveLaserCanvas.jsx  # Three.js 3D volumetric G-Code & laser visualizer
│   │   ├── MachinesBay.jsx             # 4 Flagship industrial machine bays with code inspector
│   │   ├── NavigationHUD.jsx           # Fixed HUD navigation bar with live clock & audio toggle
│   │   ├── ScrambleText.jsx            # Matrix cipher text decryption animation
│   │   ├── TelemetryHUDWidget.jsx      # 4-Channel real-time oscilloscope & PID fault bench
│   │   └── UARTTerminalCTA.jsx         # Interactive COM3 UART terminal console
│   ├── utils/
│   │   ├── audio.js                    # Audio facade bridge
│   │   └── soundEngine.js              # Pure Web Audio API procedural synthesizer
│   ├── App.jsx                         # Main layout assembler with CRT scanline overlays
│   ├── index.css                       # Cybernetic theme tokens, glassmorphism & scanlines
│   └── main.jsx                        # React root entry point
├── index.html                          # Complete SEO, Schema.org JSON-LD & LinkedIn OpenGraph tags
├── package.json                        # Project dependencies and build scripts
├── vite.config.js                      # Vite configuration with Tailwind CSS plugin
└── README.md                           # Documentation & Engineering Reference
```

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Launch

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AtharvaYadav-dev/MyPortfolio.git
   cd MyPortfolio/Portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:5173/` to view the live interface with Hot Module Replacement (HMR).

4. **Verify code quality:**
   ```bash
   npx oxlint src
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```
   The compiled static assets will be output to the `dist/` directory.

---

## 🚢 Deployment to Vercel

The portfolio is continuously deployed to Vercel:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Live Link:** [https://my-portfolio-nu-seven-83.vercel.app/](https://my-portfolio-nu-seven-83.vercel.app/)

---

## 📬 Contact & Telemetry Linkage

- **Engineer:** Atharva Yadav
- **Current Position:** Firmware Developer (R&D) @ Specialise Products Pvt. Ltd. (SPPL)
- **Email:** [atharva.embedded@gmail.com](mailto:atharva.embedded@gmail.com)
- **Portfolio Live:** [https://my-portfolio-nu-seven-83.vercel.app/](https://my-portfolio-nu-seven-83.vercel.app/)
- **LinkedIn:** [linkedin.com/in/atharva-yadav](https://www.linkedin.com/in/atharva-yadav-0b1a07204/)
- **GitHub:** [github.com/AtharvaYadav-dev](https://github.com/AtharvaYadav-dev)

---
*Architected with precision. Engineered from bare-metal silicon to interactive web visualizers.*
