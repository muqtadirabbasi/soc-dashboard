import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(__dirname));

// GoogleGenAI automatically searches for process.env.GEMINI_API_KEY
const ai = new GoogleGenAI(); 

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, contextText } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt input string is required.' });
    }

    // Wrap the SHAP structural layout data with the user's intent to inject specialized system behavior instructions
    const systemInstruction = `You are an expert SOC Incident Response Analyst specializing in Explainable AI (XAI), the CERT Insider Threat Dataset framework, and SHAP (SHapley Additive exPlanations) values. 
    Analyze the feature plots, explain why red features pull scores up toward anomaly thresholds and blue features counteract it. 
    Correlate the global beeswarm clusters against common scenarios like data exfiltration, storage misuse, or corporate espionage.`;

    const formattedContents = contextText 
      ? `Visual Chart Context Matrix:\n${contextText}\n\nAnalyst Query: ${prompt}`
      : prompt;

    // Call the optimal model for analytic workflows
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2 // Lower temp for objective forensics evaluation
      }
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'Failed to extract insights from the Gemini core intelligence engine.',
      details: error.message 
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Secured proxy environment online on port ${PORT}`);
});
