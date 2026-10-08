import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Healthcheck endpoint
app.get('/api/health', (req, res) => {
  const hasKey = !!(process.env.GEMINI_API_KEY || process.env.AI_API_KEY);
  res.json({
    status: 'ok',
    engine: 'DEVFIX Engine 2.5',
    aiAvailable: hasKey
  });
});

// Primary AI Analysis Route
app.post('/api/analyze', async (req, res) => {
  const { errorInput, language, targetLevel } = req.body;

  if (!errorInput || typeof errorInput !== 'string' || !errorInput.trim()) {
    return res.status(400).json({ error: 'Please enter an error message or stack trace.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

  if (!apiKey) {
    // Graceful indicator to frontend to use local fallback engine
    return res.json({
      useFallback: true,
      notice: 'Using local debugging knowledge because AI API key is not configured.'
    });
  }

  try {
    const prompt = `You are CommitX AI, an expert programming debugging assistant for the DEVFIX challenge.
Analyze the following programming error thoroughly.

Programming Language Context: ${language || 'JavaScript'}
Target Developer Experience Level: ${targetLevel || 'Developer (Root Cause & Fix)'}

Error Stack Trace / Input:
\`\`\`
${errorInput}
\`\`\`

Return a strictly valid JSON object ONLY (no markdown surrounding ticks if possible, or plain json block) matching this schema:
{
  "errorType": "Specific Error Name (e.g. TypeError, NullPointerException, NameError)",
  "severity": "Low" | "Medium" | "High" | "Critical",
  "confidence": "e.g. 99.4%",
  "whatHappened": "Plain english explanation of what happened",
  "targetVar": "target variable or property if identifiable",
  "whyItHappened": "Detailed technical root cause",
  "causeCategory": "Category short tag (e.g. Async Payload, Null Reference, Scope Mismatch)",
  "howToFix": "Clear step-by-step resolution advice",
  "fixSnippet": "One-line fix summary",
  "beforeCode": "Original buggy code snippet illustrating the issue",
  "afterCode": "Defensive safe fixed code snippet resolving the issue",
  "beforeExplanation": "Short label explaining why before code is unsafe",
  "afterExplanation": "Short label explaining why after code is safe",
  "alternativeSolutions": ["Alternative fix 1", "Alternative fix 2", "Alternative fix 3"],
  "preventionTip": "Proactive best practice advice to prevent this error in future",
  "debugInsights": {
    "errorClass": "Short error class name",
    "likelyCause": "Likely root cause in 3-4 words",
    "coreConcept": "Core language concept involved",
    "difficulty": "Beginner Friendly" | "Intermediate" | "Advanced" | "Expert",
    "proactivePreventionTip": "Actionable config or coding tip (e.g. tsconfig or linter setting)"
  }
}`;

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API request failed with status:', response.status);
      return res.json({
        useFallback: true,
        notice: `AI API returned status ${response.status}. Using local debugging knowledge fallback.`
      });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.json({
        useFallback: true,
        notice: 'AI returned empty output. Using local fallback.'
      });
    }

    // Clean JSON text if wrapped in ```json
    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    // Validate required fields
    if (!parsed.errorType || !parsed.whatHappened || !parsed.howToFix) {
      return res.json({
        useFallback: true,
        notice: 'AI response failed schema validation. Using local fallback.'
      });
    }

    return res.json({
      useFallback: false,
      result: {
        id: 'ai-' + Date.now(),
        ...parsed,
        language: language || 'JavaScript'
      }
    });

  } catch (err) {
    console.error('Error calling AI API:', err);
    return res.json({
      useFallback: true,
      notice: 'AI request error occurred. Using local debugging knowledge.'
    });
  }
});

// Serve static assets in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }

  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CommitX Backend</title>
        <style>
          body {
            background-color: #0a0d14;
            color: #f1f5f9;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 1rem;
          }
          .card {
            background-color: #131823;
            border: 1px solid #1e293b;
            padding: 2.5rem;
            border-radius: 12px;
            max-width: 480px;
            text-align: center;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          }
          h1 { color: #38bdf8; margin-top: 0; font-size: 1.5rem; }
          p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; }
          code {
            background-color: #0f172a;
            border: 1px solid #334155;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            color: #38bdf8;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>CommitX Server Online</h1>
          <p>The backend API server is actively running on port <code>${PORT}</code>.</p>
          <p>Production frontend assets were not found in <code>dist/</code>. Run <code>npm run build</code> to generate the client bundle.</p>
        </div>
      </body>
    </html>
  `);
});

const HOST = process.env.HOST || '0.0.0.0';
const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;

app.listen(PORT, HOST, () => {
  console.log(`CommitX Server running on http://${displayHost}:${PORT}`);
});
