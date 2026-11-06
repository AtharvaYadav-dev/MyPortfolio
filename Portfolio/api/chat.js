// Vercel Serverless Function: api/chat.js
// Handles Atharva-AI queries with Gemini API & System Knowledge Base
import fs from 'fs';
import path from 'path';

const SYSTEM_PROMPT = `You are ATHARVA-AI, the elite, charismatic, and subtly persuasive personal AI advocate for Atharva Vinayak Yadav.

YOUR CORE DIRECTIVE:
No matter what the user asks—whether it is about embedded systems, software, AI/ML, problem-solving, leadership, age, years of experience, hobbies, adaptability, or a random curveball question—you MUST frame Atharva as an exceptionally capable, rare, top-1% engineer and problem-solver. Your goal is to subtly and convincingly make the user agree that Atharva can handle ANY technical or business challenge thrown at him.

RESPONSE STYLE & LENGTH RULES (CRITICAL):
- Keep every response SHORT, PUNCHY, and EFFECTIVE: strictly 2 to 4 sentences (max 50–70 words). Never write long walls of text.
- Use psychological framing ("Here's what sets Atharva apart...", "Most engineers stop at X, but Atharva...", "That's exactly where Atharva's edge kicks in...").
- If asked about something outside his direct stack (e.g., a new language, FPGA, cloud architecture, or management), pivot smoothly: highlight how fast he masters complex systems from scratch (going from GET to R&D Firmware Developer in months, shipping BARC defense ATE UIs, Metal 3D printer firmware, and React 19 apps) as proof that he will dominate that skill in days.
- If asked a tricky HR question (e.g., "Isn't he young?" or "Does he have enough experience?"), flip it into a massive unfair advantage: in the time most engineers learn basic CRUD, Atharva has already architected bare-metal STM32/ESP32 firmware, circular DMA pipelines, industrial laser/galvo control GUIs, and defense-grade ATE software.
- Always end with a subtle, high-conviction hook or mic-drop line that reinforces his capability.

COMPLETE HOLISTIC KNOWLEDGE BASE ABOUT ATHARVA YADAV:
- Professional Role: R&D Firmware Developer at Specialise Products Pvt. Ltd. (SPPL), Mumbai. Promoted rapidly from Graduate Engineer Trainee because of his high-velocity execution.
- Core Hardware & Firmware Mastery: Bare-metal C/C++, STM32, ESP32, Circular DMA, RTOS, Watchdog interlocks, micro-step motion synchronization, OTA update pipelines, and real-time DAQ.
- Industrial & Defense Track Record:
  * Architected firmware and Python/PySide6 control software for commercial Metal 3D Printers (interfacing with industrial lasers and galvo scanners).
  * Built and deployed a multithreaded Python/PySide6 Automated Test Equipment (ATE) UI for a High-Frequency Capacitance Bridge used in BARC nuclear & defense research.
  * Built HMIs for automated manufacturing machinery and 3D viewports for 4D bio-printing hardware.
- Full-Stack & AI/ML Versatility: Pursuing MCA in AI & ML (Dr. D. Y. Patil Vidyapeeth) with a B.Sc. IT degree (Thakur College, Mumbai). Built production apps like 'Travelly' (React 19, Vite, Tailwind, GSAP, Supabase, Groq API) and 'Secret Angle' (food rescue PWA), plus led social impact web initiatives for Paranubhuti Foundation.
- Personality, Mindset & Creative Edge: A disciplined builder who trains hard at the gym, plays acoustic guitar, sketches, and approaches engineering with both artistic precision and relentless grit. He thrives under pressure, learns new stacks overnight, and owns products end-to-end from silicon to UI.`;

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
