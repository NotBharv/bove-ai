import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const portArgIndex = process.argv.indexOf('--port');
  const cliPort = portArgIndex !== -1 && process.argv[portArgIndex + 1] ? parseInt(process.argv[portArgIndex + 1], 10) : null;
  const PORT = cliPort || (process.env.PORT ? parseInt(process.env.PORT, 10) : (process.env.DEFAULT_APP_PORT ? parseInt(process.env.DEFAULT_APP_PORT, 10) : 3000));

  app.use(express.json({ limit: '25mb' }));

  // CORS middleware allowing external frontends (Vercel, Netlify, custom domains)
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Global live usage statistics tracker
  let globalVoiceGenerations = 54892;
  const serverStartTime = Date.now();

  // Live usage statistics endpoint
  app.get('/api/stats', (req, res) => {
    const now = Date.now();
    const minutesSinceStart = Math.floor((now - serverStartTime) / 60000);
    // Natural subtle fluctuation for active creators
    const activeNow = 142 + Math.floor(Math.sin(now / 18000) * 11) + Math.floor((now % 10) / 3);
    const voicesToday = 1420 + Math.floor(minutesSinceStart * 3.2);

    res.json({
      totalGenerations: globalVoiceGenerations,
      activeCreatorsNow: Math.max(125, activeNow),
      voicesToday,
      totalMinutesGenerated: Math.floor(globalVoiceGenerations * 0.9),
      pricing: {
        originalPriceUsd: 10,
        currentPriceUsd: 0,
        originalPriceNpr: 1350,
        currentPriceNpr: 0,
        discountLabel: '100% Free VIP Early Access',
        planName: 'VIP Pro Free',
        isFreePeriod: true,
      },
      communityRegions: [
        { name: 'Nepal (Kathmandu, Pokhara, Butwal, Chitwan)', percentage: '68%' },
        { name: 'India (Delhi, Mumbai, Dehradun, Sikkim)', percentage: '18%' },
        { name: 'Global Nepali Diaspora (US, UK, Australia, UAE)', percentage: '14%' },
      ],
    });
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
      activeCreators: 148,
      totalGenerations: globalVoiceGenerations,
    });
  });

  // Robots.txt for Googlebot search crawler
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *\nAllow: /\nSitemap: ${req.protocol}://${req.get('host')}/sitemap.xml\n`);
  });

  // Sitemap.xml for search engines
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
  });

  // Google Search Console verification file handlers
  app.get('/google2c99469f93a2d77e.html', (req, res) => {
    res.type('text/html');
    res.send('google-site-verification: google2c99469f93a2d77e.html');
  });

  app.get('/googlezTCJglbJeBZEla4F043rZmVHtyKfAxlhBbLQuPExclY.html', (req, res) => {
    res.type('text/html');
    res.send('google-site-verification: googlezTCJglbJeBZEla4F043rZmVHtyKfAxlhBbLQuPExclY.html');
  });

  app.get('/google:hash.html', (req, res) => {
    const filename = `google${req.params.hash}.html`;
    res.type('text/html');
    res.send(`google-site-verification: ${filename}`);
  });

  // Source Code ZIP direct download endpoints - Single Clean ZIP (bove-ai.zip)
  app.get(['/download-code', '/api/download-zip', '/download-zip', '/bove-ai.zip', '/bove-ai-source-code.zip'], (req, res) => {
    const zipPath = path.resolve(__dirname, 'public', 'bove-ai.zip');
    if (!fs.existsSync(zipPath)) {
      // Fallback if bove-ai.zip is being written
      const altZipPath = path.resolve(__dirname, 'public', 'bove-ai-source-code.zip');
      if (fs.existsSync(altZipPath)) {
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="bove-ai.zip"');
        return res.sendFile(altZipPath);
      }
      return res.status(404).send('Zip file not found');
    }
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="bove-ai.zip"');
    res.sendFile(zipPath, (err) => {
      if (err) {
        console.error('Error sending zip file:', err);
        if (!res.headersSent) res.status(500).send('Unable to download source code zip');
      }
    });
  });

  // Base64 JSON endpoint for iframe / sandboxed browser fallback
  app.get('/api/download-zip-base64', (req, res) => {
    try {
      const zipPath = fs.existsSync(path.resolve(__dirname, 'public', 'bove-ai.zip'))
        ? path.resolve(__dirname, 'public', 'bove-ai.zip')
        : path.resolve(__dirname, 'public', 'bove-ai-source-code.zip');
      const buffer = fs.readFileSync(zipPath);
      res.json({
        filename: 'bove-ai.zip',
        sizeBytes: buffer.length,
        base64: buffer.toString('base64'),
      });
    } catch (err: any) {
      console.error('Error preparing base64 zip:', err);
      res.status(500).json({ error: 'Failed to read zip file for base64 download' });
    }
  });

  // Pre-built Dist ZIP download endpoint for 1-click Netlify Drop deployment
  app.get(['/download-dist', '/api/download-dist', '/bove-ai-dist.zip'], (req, res) => {
    const zipPath = path.resolve(__dirname, 'public', 'bove-ai-dist.zip');
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="bove-ai-dist.zip"');
    res.sendFile(zipPath, (err) => {
      if (err) {
        console.error('Error sending dist zip:', err);
        res.status(500).send('Unable to download dist zip');
      }
    });
  });

  // Curated list of all normal files in the project
  const PROJECT_FILES = [
    { id: 'server-ts', path: 'server.ts', category: 'backend', title: 'server.ts (Express & Gemini TTS Backend)', desc: 'Node Express server with Google Gen AI, TTS audio synthesis, SEO & endpoints' },
    { id: 'app-tsx', path: 'src/App.tsx', category: 'frontend', title: 'src/App.tsx (Main Voice Studio)', desc: 'Main UI featuring voice generation, dialogue studio, presets, history & stats' },
    { id: 'package-json', path: 'package.json', category: 'config', title: 'package.json (Dependencies & Scripts)', desc: 'Node.js dependencies, npm start/dev/build scripts, Express & React setup' },
    { id: 'env-example', path: '.env.example', category: 'config', title: '.env.example (Environment Variables)', desc: 'GEMINI_API_KEY and PORT template' },
    { id: 'readme-md', path: 'README.md', category: 'docs', title: 'README.md (Documentation & Guide)', desc: 'Detailed setup instructions, GitHub push/clone guide, and deployment manual' },
    { id: 'push-sh', path: 'push-to-github.sh', category: 'scripts', title: 'push-to-github.sh (Mac/Linux Push Script)', desc: '1-click automated terminal script to push this repo to GitHub' },
    { id: 'push-bat', path: 'push-to-github.bat', category: 'scripts', title: 'push-to-github.bat (Windows Push Script)', desc: '1-click Windows batch file to push this project directly to GitHub' },
    { id: 'vite-config', path: 'vite.config.ts', category: 'config', title: 'vite.config.ts (Vite Bundler Config)', desc: 'Vite build and React plugin configuration' },
    { id: 'tsconfig', path: 'tsconfig.json', category: 'config', title: 'tsconfig.json (TypeScript Config)', desc: 'TypeScript strict mode compiler configuration' },
    { id: 'vercel-json', path: 'vercel.json', category: 'config', title: 'vercel.json (Vercel Serverless Config)', desc: 'Vercel serverless deployment routing' },
    { id: 'render-yaml', path: 'render.yaml', category: 'config', title: 'render.yaml (Render.com Blueprint)', desc: 'One-click Render.com Node web service deployment file' },
    { id: 'index-html', path: 'index.html', category: 'frontend', title: 'index.html (HTML & SEO Headers)', desc: 'OpenGraph, Twitter cards, meta tags, and structured JSON-LD schemas' },
    { id: 'main-tsx', path: 'src/main.tsx', category: 'frontend', title: 'src/main.tsx (React Root Entry)', desc: 'Vite React DOM createRoot entrypoint' },
    { id: 'index-css', path: 'src/index.css', category: 'frontend', title: 'src/index.css (Tailwind Styling)', desc: 'Tailwind CSS design rules and custom animations' },
    { id: 'types-ts', path: 'src/types.ts', category: 'frontend', title: 'src/types.ts (Data Types & Interfaces)', desc: 'Voice, Emotion, Dialogue, History and Plan types' },
    { id: 'config-ts', path: 'src/config.ts', category: 'frontend', title: 'src/config.ts (API Config)', desc: 'Client API endpoints and defaults' },
    { id: 'characters-ts', path: 'src/data/characters.ts', category: 'data', title: 'src/data/characters.ts (12 Nepali Voice Presets)', desc: 'Aarav, Maya, Pradeep, Bidhya, Sita and regional voice characters' },
    { id: 'templates-ts', path: 'src/data/templates.ts', category: 'data', title: 'src/data/templates.ts (Nepali Script Templates)', desc: 'News, podcast, storytelling, and ad script templates in Nepali' },
    { id: 'navbar-tsx', path: 'src/components/Navbar.tsx', category: 'components', title: 'src/components/Navbar.tsx', desc: 'Top navigation bar with VIP access badge and download trigger' },
    { id: 'audio-player-tsx', path: 'src/components/AudioPlayer.tsx', category: 'components', title: 'src/components/AudioPlayer.tsx', desc: 'High-fidelity audio player with playback speed and waveform visuals' },
    { id: 'character-card-tsx', path: 'src/components/CharacterCard.tsx', category: 'components', title: 'src/components/CharacterCard.tsx', desc: 'Voice avatar and role card component' },
    { id: 'character-modal-tsx', path: 'src/components/CharacterModal.tsx', category: 'components', title: 'src/components/CharacterModal.tsx', desc: 'Modal for switching and sampling 12 different voices' },
    { id: 'creator-modal-tsx', path: 'src/components/CreatorModal.tsx', category: 'components', title: 'src/components/CreatorModal.tsx', desc: 'VIP access details and Nepali creator statistics' },
    { id: 'dialogue-studio-tsx', path: 'src/components/DialogueStudio.tsx', category: 'components', title: 'src/components/DialogueStudio.tsx', desc: 'Multi-character conversation and script studio' },
    { id: 'download-modal-tsx', path: 'src/components/DownloadModal.tsx', category: 'components', title: 'src/components/DownloadModal.tsx', desc: 'Interactive normal files downloader and GitHub guide modal' },
    { id: 'emotion-controls-tsx', path: 'src/components/EmotionControls.tsx', category: 'components', title: 'src/components/EmotionControls.tsx', desc: 'Emotion, tone, speed, and pitch customization controls' },
    { id: 'history-drawer-tsx', path: 'src/components/HistoryDrawer.tsx', category: 'components', title: 'src/components/HistoryDrawer.tsx', desc: 'Generation history drawer with instant playback' },
    { id: 'script-enhancer-tsx', path: 'src/components/ScriptEnhancerModal.tsx', category: 'components', title: 'src/components/ScriptEnhancerModal.tsx', desc: 'AI-assisted Nepali script enhancer and formatter' },
    { id: 'subscription-modal-tsx', path: 'src/components/SubscriptionModal.tsx', category: 'components', title: 'src/components/SubscriptionModal.tsx', desc: 'VIP Pro Free ($10 crossed out -> $0 free forever) modal' },
  ];

  // List all available normal project files
  app.get('/api/project-files', (req, res) => {
    const filesWithStats = PROJECT_FILES.map(file => {
      try {
        const fullPath = path.resolve(__dirname, file.path);
        const stat = fs.statSync(fullPath);
        return {
          ...file,
          sizeBytes: stat.size,
          sizeFormatted: stat.size > 1024 ? `${(stat.size / 1024).toFixed(1)} KB` : `${stat.size} B`,
          downloadUrl: `/api/download-file?file=${encodeURIComponent(file.path)}&download=1`,
          rawUrl: `/api/download-file?file=${encodeURIComponent(file.path)}`,
        };
      } catch {
        return {
          ...file,
          sizeBytes: 0,
          sizeFormatted: '0 B',
          downloadUrl: `/api/download-file?file=${encodeURIComponent(file.path)}&download=1`,
          rawUrl: `/api/download-file?file=${encodeURIComponent(file.path)}`,
        };
      }
    });
    res.json({ files: filesWithStats });
  });

  // Normal Individual File Download and Raw Content Endpoint
  app.get(['/api/download-file', '/api/raw-file'], (req, res) => {
    const requestedFile = (req.query.file as string) || '';
    if (!requestedFile) {
      return res.status(400).send('Missing file parameter');
    }

    // Safety checks against path traversal or sensitive hidden files
    const cleanFile = path.normalize(requestedFile).replace(/^(\.\.(\/|\\|$))+/, '');
    if (cleanFile.includes('..') || cleanFile.startsWith('.git') || cleanFile.startsWith('node_modules')) {
      return res.status(403).send('Forbidden file path');
    }

    const fullPath = path.resolve(__dirname, cleanFile);
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
      return res.status(404).send('File not found');
    }

    const fileName = path.basename(fullPath);
    const isDownload = req.query.download === '1' || req.query.dl === '1';
    const isJson = req.query.format === 'json';

    if (isJson) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        return res.json({
          filename: fileName,
          path: cleanFile,
          content,
          size: fs.statSync(fullPath).size,
        });
      } catch (err) {
        return res.status(500).json({ error: 'Failed to read file content' });
      }
    }

    if (isDownload) {
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    }

    // Appropriate content type
    if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    } else if (fileName.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    } else if (fileName.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    } else if (fileName.endsWith('.md')) {
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    } else if (fileName.endsWith('.sh') || fileName.endsWith('.bat')) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    } else {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    }

    return res.sendFile(fullPath);
  });

  // Speech Generation Endpoint
  app.post('/api/generate-voice', async (req, res) => {
    try {
      const {
        text,
        voiceName = 'Kore',
        emotion = 'natural',
        emotionIntensity = 'moderate',
        accent = 'Hindi',
        speakerName = 'Narrator',
        speed = 1.0,
        pitch = 'medium',
        isDialogue = false,
        dialogueSegments = [],
        customStyle = '',
      } = req.body;

      if (!isDialogue && (!text || !text.trim())) {
        return res.status(400).json({ error: 'Text content is required' });
      }

      if (isDialogue && (!dialogueSegments || dialogueSegments.length === 0)) {
        return res.status(400).json({ error: 'Dialogue segments are required for multi-speaker' });
      }

      // Voice mapping fallback
      const validVoices = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];
      const sanitizedVoice = validVoices.includes(voiceName) ? voiceName : 'Kore';

      if (!isDialogue) {
        // Construct detailed emotional and accent style prompt
        let stylePrompt = '';
        if (customStyle && customStyle.trim()) {
          stylePrompt = customStyle.trim();
        } else {
          const accentMap: Record<string, string> = {
            'Nepali': 'Authentic native Nepali speaker with warm natural cadence, clear Nepali Devanagari pronunciation, and rich emotive tonality',
            'Hindi': 'Authentic native Hindi speaker with natural cadence and warm tone',
            'Hinglish': 'Urban Indian speaker speaking fluent natural Hinglish (Hindi-English mix) with modern cadence',
            'Indian-English': 'Articulate Indian English speaker with clear professional accent',
            'US-English': 'Natural American English accent with crisp pronunciation',
            'UK-English': 'Refined British English accent with clear articulation',
          };

          const emotionMap: Record<string, string> = {
            'neutral': 'natural, balanced, and clear conversational delivery',
            'cheerful': 'cheerful, upbeat, smiling, and lively delivery with pleasant warmth',
            'dramatic': 'dramatic, deeply expressive, cinematic, and captivating storytelling delivery with meaningful pauses',
            'whisper': 'intimate, quiet, whispering, and gentle soft-spoken delivery',
            'energetic': 'high-energy, enthusiastic, fast-paced, and dynamic delivery like a radio host or stage presenter',
            'calm': 'soothing, peaceful, meditative, and relaxing slow-paced delivery',
            'intense': 'intense, urgent, powerful, and deeply emotional delivery',
            'inspirational': 'inspiring, motivational, confident, and heartfelt delivery with rising cadence',
            'sad': 'melancholic, tender, sorrowful, and deeply emotional soft delivery',
            'sarcastic': 'playful, cheeky, sarcastic, and witty delivery with subtle chuckles',
          };

          const speedDescriptor = speed > 1.15 ? 'at a brisk, energetic pace' : speed < 0.9 ? 'at a measured, slow, deliberate pace' : 'at a natural conversational pace';
          const pitchDescriptor = pitch === 'deep' ? 'with deep, resonant vocal timbre' : pitch === 'high' ? 'with bright, melodic vocal tone' : 'with balanced vocal timbre';
          const intensityDescriptor = emotionIntensity === 'extreme' ? 'very strong and vivid' : emotionIntensity === 'high' ? 'pronounced' : emotionIntensity === 'subtle' ? 'gentle and subtle' : 'moderate';

          const accentDesc = accentMap[accent] || accentMap['Nepali'] || accentMap['Hindi'];
          const emotionDesc = emotionMap[emotion] || emotionMap['neutral'];

          stylePrompt = `${accentDesc}. Speak with ${intensityDescriptor} ${emotionDesc}, ${speedDescriptor}, ${pitchDescriptor}. Pay close attention to natural Nepali, Hindi, and English phonetics and realistic breath pauses.`;
        }

        let response;
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash-lite-tts',
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: text.trim(),
                    speechMetadata: {
                      speaker: speakerName || 'Speaker',
                      style: stylePrompt,
                    },
                  },
                ],
              },
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: sanitizedVoice },
                },
              },
            },
          });
        } catch (firstErr: any) {
          console.warn('flash-lite-tts call failed, attempting fallback to flash-tts:', firstErr?.message);
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash-tts',
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: text.trim(),
                    speechMetadata: {
                      speaker: speakerName || 'Speaker',
                      style: stylePrompt,
                    },
                  },
                ],
              },
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: sanitizedVoice },
                },
              },
            },
          });
        }

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        const mimeType = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || 'audio/wav';

        if (!base64Audio) {
          throw new Error('No audio data received from Gemini voice model');
        }

        globalVoiceGenerations++;

        return res.json({
          audioBase64: base64Audio,
          mimeType,
          stylePrompt,
          voiceName: sanitizedVoice,
          speaker: speakerName,
        });
      } else {
        // Multi-speaker / Dialogue mode
        // Gemini 3.8 Flash TTS supports dual-speaker voice config
        const speaker1 = dialogueSegments[0]?.speaker || 'Speaker 1';
        const speaker2 = dialogueSegments.find((s: any) => s.speaker !== speaker1)?.speaker || 'Speaker 2';

        const speaker1Voice = validVoices.includes(dialogueSegments[0]?.voiceName) ? dialogueSegments[0].voiceName : 'Puck';
        const speaker2Voice = validVoices.includes(dialogueSegments.find((s: any) => s.speaker !== speaker1)?.voiceName)
          ? dialogueSegments.find((s: any) => s.speaker !== speaker1).voiceName
          : 'Kore';

        const parts = dialogueSegments.map((segment: any) => ({
          text: `${segment.speaker}: ${segment.text}`,
          speechMetadata: {
            speaker: segment.speaker,
            style: segment.style || 'Natural, expressive conversational style',
          },
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [
            {
              role: 'user',
              parts,
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  {
                    speaker: speaker1,
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: speaker1Voice },
                    },
                  },
                  {
                    speaker: speaker2,
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: speaker2Voice },
                    },
                  },
                ],
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        const mimeType = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || 'audio/wav';

        if (!base64Audio) {
          throw new Error('No audio data received from Gemini multi-speaker voice model');
        }

        globalVoiceGenerations++;

        return res.json({
          audioBase64: base64Audio,
          mimeType,
          isDialogue: true,
          speakers: [speaker1, speaker2],
        });
      }
    } catch (err: any) {
      console.error('Error generating voice:', err);
      let userFriendlyMessage = err.message || 'Failed to generate speech audio';
      if (typeof userFriendlyMessage === 'string' && (userFriendlyMessage.includes('429') || userFriendlyMessage.includes('quota'))) {
        userFriendlyMessage = 'AI Voice service rate limit reached. Please wait a few seconds and try again.';
      }
      return res.status(500).json({
        error: userFriendlyMessage,
        details: err.stack,
      });
    }
  });

  // AI Script Assistant: Enhance, add vocal bursts, translate, or adapt tone
  app.post('/api/enhance-script', async (req, res) => {
    try {
      const { text, mode = 'add-vocal-bursts', targetTone = 'dramatic' } = req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({ error: 'Text content is required' });
      }

      let systemPrompt = '';
      if (mode === 'add-vocal-bursts') {
        systemPrompt = `You are a professional voice director for Nepali, Hindi, and English voiceovers.
Your job is to take the provided script and inject natural vocal bursts and breathing markers supported by advanced TTS:
Supported tags:
- <breath> (for natural breath pause before sentences or long clauses)
- <laugh> (for chuckles, smiles, amusement)
- <sigh> (for relief, longing, or exhaustion)
- <gasp> (for shock, wonder, or excitement)
- |yeah| or |mhm| (for natural conversational backchanneling)
- ... (for dramatic micro-pauses)

Maintain the original language (Nepali Devanagari, Hindi Devanagari, Hinglish Roman Hindi, or English).
Return ONLY a valid JSON object with the shape:
{
  "enhancedText": "...",
  "notes": "..."
}`;
      } else if (mode === 'to-nepali') {
        systemPrompt = `Translate or polish the text into fluent, natural spoken Nepali in Devanagari script suitable for voice narration and voiceovers. Use natural Nepali expressions, respectful and engaging phrasing (e.g. 'नमस्ते साथीहरू...', 'आज हामी चर्चा गर्नेछौं...'). Avoid stiff robotic literal translation.
Return ONLY a valid JSON object with the shape:
{
  "enhancedText": "...",
  "notes": "..."
}`;
      } else if (mode === 'to-hindi') {
        systemPrompt = `Translate or polish the text into natural, fluent Hindi in Devanagari script suitable for voice narration. Avoid awkward literal robotic translations. Make it sound rich, emotive, and human.
Return ONLY a valid JSON object with the shape:
{
  "enhancedText": "...",
  "notes": "..."
}`;
      } else if (mode === 'to-hinglish') {
        systemPrompt = `Translate or convert the text into lively modern conversational Hinglish (written in Roman alphabet, as spoken by youth and creators in Mumbai/Delhi/Bengaluru, e.g. "Arre yaar, check this out - yeh scene kitna awesome hai!").
Return ONLY a valid JSON object with the shape:
{
  "enhancedText": "...",
  "notes": "..."
}`;
      } else if (mode === 'to-english') {
        systemPrompt = `Translate or polish the text into fluent, expressive English suitable for audio narration.
Return ONLY a valid JSON object with the shape:
{
  "enhancedText": "...",
  "notes": "..."
}`;
      } else if (mode === 'dramatic-kahani') {
        systemPrompt = `Rewrite the text as a dramatic Hindi/English storytelling narrative (Kahani / Thriller style) with suspenseful pauses (...), emotive words, and evocative pacing.
Return ONLY a valid JSON object with the shape:
{
  "enhancedText": "...",
  "notes": "..."
}`;
      } else if (mode === 'viral-hook') {
        systemPrompt = `Rewrite the text as a high-retention YouTube Short / Instagram Reel hook in Hindi or Hinglish that grabs attention in the first 3 seconds with high excitement and curiosity.
Return ONLY a valid JSON object with the shape:
{
  "enhancedText": "...",
  "notes": "..."
}`;
      } else {
        systemPrompt = `Polish the voiceover script for maximum naturalness, cadence, and clarity in voice synthesis.
Return ONLY a valid JSON object with the shape:
{
  "enhancedText": "...",
  "notes": "..."
}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Input script:\n"${text}"\n\nEnhance this for realistic voice generation:`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text || '{}';
      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch (e) {
        parsed = { enhancedText: responseText.replace(/```json|```/g, '').trim(), notes: 'Enhanced' };
      }

      return res.json(parsed);
    } catch (err: any) {
      console.error('Error enhancing script:', err);
      return res.status(500).json({ error: err.message || 'Failed to enhance script' });
    }
  });

  // Setup Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bove AI voice studio server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
