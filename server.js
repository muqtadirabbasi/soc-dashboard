import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Initialize official Google Gen AI SDK
// Azure automatically populates process.env.GEMINI_API_KEY from your App Configuration Settings
const ai = new GoogleGenAI(); 

// API endpoint to proxy chat requests securely
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, contextText } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // Combine visual framework data context if provided
    let fullPrompt = prompt;
    if (contextText) {
      fullPrompt = `Context information regarding the incident dashboard metrics:\n${contextText}\n\nAnalyst Query: ${prompt}`;
    }

    // Call Gemini 2.5 Flash for ultra-fast analytics reasoning
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('Error connecting to Gemini LLM Engine:', error);
    res.status(500).json({ 
      error: 'Failed to communicate with Gemini LLM proxy engine.',
      details: error.message 
    });
  }
});

// Fallback to route all other requests to the main interface dashboard
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running securely on port ${PORT}`);
});
