import resumePdfAsset from '../assets/Atharva_Yadav_Resume.pdf';

// Verified Engineering Resume Data & File Downloader Utility
export const RESUME_PATH = resumePdfAsset;
export const RESUME_FILENAME = 'Atharva_Yadav_Resume.pdf';

export const RESUME_TEXT = `========================================================================
ATHARVA YADAV — INDUSTRIAL FIRMWARE & EMBEDDED SYSTEMS ENGINEER (R&D)
Location: Mumbai, India | Relocation: Bangalore / Pune / Mumbai
Email: atharvayadav.dev@gmail.com | Portfolio: https://atharvayadav-dev.github.io/
GitHub: https://github.com/AtharvaYadav-dev | LinkedIn: https://www.linkedin.com/in/atharva-yadav-dev
========================================================================

PROFESSIONAL SUMMARY:
R&D Firmware & Embedded Systems Engineer specializing in hard real-time bare-metal C/C++ (STM32/ESP32), sub-picofarad precision instrumentation (BARC standard), high-power industrial lasers (>5kW NIR, DPSS, IPG fiber), and multi-threaded ATE suites (PySide6/PyOpenGL). Promoted in 4 months at Specialise Products Pvt. Ltd. (SPPL) to lead full-stack cyber-physical system architectures.

CORE TECHNICAL SKILLS & HARDWARE ARCHITECTURE:
• Microcontrollers & Silicon: STM32H7 / Cortex-M7, ESP32, FreeRTOS, Bare-Metal C/C++, Memory-Mapped Registers, Circular DMA, Hardware Watchdogs (IWDG).
• High-Precision Instrumentation: BARC Sub-pF Capacitance & Impedance Bridge, Lock-In Phase Sensitive Detection (PSD), 24-bit Sigma-Delta ADC sampling.
• Industrial Lasers & Mechatronics: >5kW Peak NIR Semiconductor Wafer Scribing, Multi-Wavelength DPSS (1064/532/355 nm), IPG Fiber Laser MOTF, Sub-microsecond DB25 parallel port gating (MarkEzd.dll).
• Control Systems & Kinematics: 100Hz Deterministic Closed-Loop PID (MPX5700 Transducer), Dual-MCU Lockstep Sync (M118 Protocol), 16-Block Lookahead Acceleration (Metal3-D).
• Supervisory Desktop & Vision: Multi-Threaded PySide6 Desktop ATE, PyOpenGL 3D Kinematics Digital Twins, 640x480 LWIR Radiometric Thermography (-20°C to 1000°C), 100Mbit Ethernet UDP frame reassembly.

PROFESSIONAL EXPERIENCE:
FIRMWARE DEVELOPER (R&D — IoT & Embedded Systems)
Specialise Products Pvt. Ltd. (SPPL), Mumbai, India | 2026 – Present
(Fast-track promotion from Graduate Engineer Trainee in 4 months)
• Architected hard real-time firmware in bare-metal C++ on STM32 microcontrollers with circular DMA buffers and sub-millisecond ADC interrupt scanning.
• Engineered sub-microsecond DB25 parallel port hardware gating (<1µs jitter) for Galvo laser vector scribing engines using low-level Win32 DLL interfacing (MarkEzd.dll).
• Developed custom M118 dual-MCU lockstep communication protocol for multi-axis industrial 3D bioprinters with 100Hz deterministic PID pneumatic pressure regulation.
• Programmed real-time 100Mbit Ethernet radiometric streaming parsers for 640x480 LWIR cameras (-20°C to 1000°C) and dual 50W diode phase-lock NDT weld inspection firmware.
• Designed and deployed headless Automated Test Equipment (ATE) integrating multi-threaded PySide6 desktop supervisory UIs with PyOpenGL 3D digital twins.

FLAGSHIP HARDWARE & R&D PROJECTS:
1. SVNIT 16-Channel Thermal DAQ & Safety Watchdog:
   16-channel thermistor matrix sampled via STM32 circular DMA at 2,000 SPS with zero CPU overhead. Armed hardware IWDG with <500µs emergency cutoff on dT/dt excess. Multi-threaded PySide6 real-time heatmap ATE.
2. Bio4D V2 & InkPrinter (Multi-Axis Bioprinter & Pneumatic PID):
   Dual-MCU lockstep synchronization via custom M118 protocol. 100Hz deterministic PID pneumatic pressure loop (MPX5700). Real-time PyOpenGL 3D digital twin. (Repo: github.com/AtharvaYadav-dev/InkPrinter)
3. BARC High-Precision Capacitance & Impedance Bridge:
   100 kHz synchronous sine carrier generator with 24-bit Sigma-Delta ADC sampling. Lock-in phase-sensitive detection (PSD) resolving sub-picofarad (sub-pF) impedance variations with zero thermal drift.
4. SP2L-SWPSMS Semiconductor Wafer Scribing Controller:
   >5 kW peak NIR pulsed laser gating with sub-microsecond DB25 parallel port driver and 2,200 mm/s Galvo mirror vector positioning. (Repo: github.com/AtharvaYadav-dev/Galvo_Scriber)
5. SP2L-TC Radiometric LWIR Thermography Camera Engine:
   640x480 uncooled microbolometer sensor stream via 100Mbit raw UDP Ethernet sockets with Planck calibration lookup tables for temperature mapping (-20°C to 1000°C).

EDUCATION:
• Master of Computer Applications (MCA) — AI & Machine Learning | 2026 – 2028
  Dr. D. Y. Patil Vidyapeeth | Specialization: Edge AI & Neural Kinematics
• Bachelor of Science in Information Technology (B.Sc. IT) | 2026
  Thakur College of Science & Commerce, University of Mumbai
========================================================================`;

/**
 * Direct browser download of Atharva Yadav's Engineering Resume (PDF)
 */
export function downloadResume() {
  const link = document.createElement('a');
  link.href = RESUME_PATH;
  link.download = RESUME_FILENAME;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Open the Engineering Resume (PDF) cleanly in a new browser tab
 */
export function openResumePDF() {
  window.open(RESUME_PATH, '_blank', 'noopener,noreferrer');
}

/**
 * Download clean plain text version for terminal and low-bandwidth environments
 */
export function downloadResumeText() {
  const blob = new Blob([RESUME_TEXT], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Atharva_Yadav_Firmware_Resume.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Direct export for Engineering Resume
export default downloadResume;
