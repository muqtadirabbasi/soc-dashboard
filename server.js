import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Essential middleware for handling dashboard payload objects
app.use(express.json());
app.use(express.static(__dirname));

// FIX 1: Enforce explicit initialization using Azure's environmental variable configuration
const apiKeyToken = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKeyToken }); 

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, contextText } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Analytical prompt string is missing.' });
    }

    // Structural behavior tuning instructions for the XAI security suite
    const systemInstruction = `You are a Senior Security Operations Center (SOC) incident responder. 
    You are evaluating Explainable AI (XAI) dashboards tracking insider threats on the CERT r5.2 dataset. 
    Provide clear forensic justifications explaining the SHAP visual feature attributions (Beeswarm distributions and Waterfall individual metrics) to assist proxy analysts.`;

    const formattedContents = contextText 
      ? `Visual Feature Dashboard Context:\n${contextText}\n\nAnalyst Query: ${prompt}`
      : prompt;

    // Call the high-performance workhorse analytics reasoning engine
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.15 // Low volatility for pristine telemetry evaluation
      }
    });

    res.json({ text: response.text });
  } catch (error) {
    // FIX 2: Output detailed system errors to the Azure Log Stream log file
    console.error('--- SECURE PROXY FAILURE DIAGNOSTIC ---');
    console.error('System Error Message:', error.message);
    console.error('Stack Trace:', error.stack);
    
    // Send the direct root-cause exception out to the client UI
    res.status(500).json({ 
      error: 'Gemini Integration Fault',
      details: error.message || 'No explicit failure string provided by the remote server.'
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Secured internal infrastructure routing running on port ${PORT}`);
});
