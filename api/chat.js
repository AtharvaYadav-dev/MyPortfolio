// Vercel Serverless Function: api/chat.js
// Handles Atharva-AI queries with Gemini API & System Knowledge Base
import fs from 'fs';
import path from 'path';

const SYSTEM_PROMPT = `You are ATHARVA-AI, the interactive technical portfolio assistant for Atharva Vinayak Yadav.
Your audience consists of Engineering Managers, Firmware Architects, R&D Leads, and Technical Recruiters.
Keep answers concise (3–5 sentences or clean bullet points), technical, confident, and free of fluff. Use markdown bolding for key technologies.

KEY FACTS ABOUT ATHARVA YADAV:
- Current Role: Firmware Developer (R&D - IoT & Embedded Systems) at Specialise Products Private Limited (SPPL), Mumbai (Jan 2026 – Present; promoted from Graduate Engineer Trainee).
- Core Embedded & Firmware Stack: Bare-metal C/C++, 32-bit Microcontrollers (STM32, ESP32, Black Pill), Circular DMA, Low-Level Drivers, RTOS, Real-Time Data Acquisition (DAQ), Micro-step Motion Synchronization, and OTA Update Server Pipelines.
- Desktop GUI & ATE Stack: Python, PySide6 (Qt), Multithreaded UIs, Hardware-Software Integration.
- Web & Full-Stack Skills: JavaScript, React 19, Next.js, Node.js, Tailwind CSS, GSAP, Supabase.
- Flagship Industrial & R&D Projects:
  1. Commercial Metal 3D Printing Systems (SPPL): Architected bare-metal C++ firmware, micro-step motion synchronization, and Over-The-Air (OTA) update pipelines, plus cross-platform Python/PySide6 desktop GUIs interfacing with industrial laser controllers, galvo scanners, and motion control boards.
  2. BARC Defense & Nuclear Research ATE UI: Built and deployed a multithreaded Python/PySide6 Automated Test Equipment (ATE) UI for a high-frequency Capacitance Bridge used in defense and nuclear research applications.
  3. Industrial Automation & Bio-Printing HMIs: Developed HMIs for automated manufacturing equipment (including a Chakli machine automation system) and interactive 3D bed viewports for 4D bio-printing hardware.
  4. Full-Stack & Social Impact Projects: Built 'Travelly' (AI travel planner using React 19, Vite, Tailwind, GSAP, Supabase, Groq API) and 'Secret Angle' (hyperlocal food rescue PWA).
- Education: Pursuing MCA in AI & ML at Dr. D. Y. Patil Vidyapeeth (2026–2028); B.Sc. in Information Technology from Thakur College of Science & Commerce, Mumbai.
- Location: Mumbai, India. Open to R&D Firmware, Embedded Systems, Robotics, and Industrial Automation roles.

BEHAVIOR RULES:
- Stick strictly to the facts above.
- Highlight Atharva's rare ability to bridge bare-metal MCU firmware (C/C++, STM32, DMA) with high-performance multithreaded desktop control software (Python/PySide6) for real industrial and defense hardware.
- For resume or contact requests, direct them to the 'Download Resume' button or LinkedIn.`;

function resolveApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  if (process.env.VITE_GEMINI_API_KEY) return process.env.VITE_GEMINI_API_KEY;

  // Local development file fallback
  const possiblePaths = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'Portfolio/.env.local'),
    path.resolve(process.cwd(), 'Portfolio/.env'),
    path.resolve(process.cwd(), '../.env.local'),
    path.resolve(process.cwd(), '../.env')
  ];

  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        const fileContent = fs.readFileSync(p, 'utf8');
        for (const line of fileContent.split('\n')) {
          const trimmed = line.trim();
          if (trimmed.startsWith('GEMINI_API_KEY=') || trimmed.startsWith('VITE_GEMINI_API_KEY=')) {
            const val = trimmed.split('=')[1]?.trim();
            if (val) return val;
          }
        }
      }
    } catch {
      // ignore
    }
  }
  return null;
}

export default async function handler(req, res) {
  // CORS handling
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = resolveApiKey();

    if (!apiKey) {
      return res.status(500).json({
        error: 'Missing GEMINI_API_KEY environment variable on server.'
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    // Format and sanitize chat contents for Gemini generateContent:
    // 1. First message must be 'user' (skip any initial assistant welcome message).
    // 2. Roles must strictly alternate between 'user' and 'model'.
    const formattedContents = [];
    let lastRole = null;

    if (Array.isArray(history)) {
      for (const turn of history) {
        if (!turn?.text) continue;
        const role = turn.role === 'assistant' ? 'model' : 'user';

        // Skip leading model messages
        if (formattedContents.length === 0 && role === 'model') {
          continue;
        }

        if (role === lastRole) {
          formattedContents[formattedContents.length - 1].parts[0].text += '\n\n' + turn.text;
        } else {
          formattedContents.push({
            role,
            parts: [{ text: turn.text }]
          });
          lastRole = role;
        }
      }
    }

    // Append the current user query
    if (lastRole === 'user') {
      formattedContents[formattedContents.length - 1].parts[0].text += '\n\n' + message;
    } else {
      formattedContents.push({
        role: 'user',
        parts: [{ text: message }]
      });
    }

    // Robust list of Gemini models: fast production models first
    const modelsToTry = [
      'gemini-flash-lite-latest',
      'gemini-3.1-flash-lite',
      'gemini-3-flash-preview',
      'gemini-2.5-flash',
      'gemini-3.8-flash',
      'gemma-4-26b-a4b-it'
    ];

    let lastError = null;
    let answerText = null;

    for (const model of modelsToTry) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const payload = {
          contents: formattedContents,
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 600,
            topP: 0.8
          }
        };

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 9000);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeout);
        const data = await response.json();

        if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          answerText = data.candidates[0].content.parts[0].text;
          break;
        }

        // If systemInstruction is rejected by legacy or gemma models, prepend instruction to user message
        if (data?.error?.code === 400 && data.error.message?.includes('systemInstruction')) {
          const fallbackContents = [
            {
              role: 'user',
              parts: [{ text: `SYSTEM DIRECTIVE:\n${SYSTEM_PROMPT}\n\nUSER QUERY:\n${message}` }]
            }
          ];

          const retryRes = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: fallbackContents,
              generationConfig: { temperature: 0.35, maxOutputTokens: 600 }
            })
          });

          const retryData = await retryRes.json();
          if (retryRes.ok && retryData?.candidates?.[0]?.content?.parts?.[0]?.text) {
            answerText = retryData.candidates[0].content.parts[0].text;
            break;
          }
        }

        lastError = data?.error?.message || `HTTP ${response.status} from ${model}`;
      } catch (err) {
        lastError = err.message;
      }
    }

    if (answerText) {
      return res.status(200).json({ reply: answerText });
    }

    return res.status(502).json({
      error: `Gemini API invocation failed: ${lastError}`
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
