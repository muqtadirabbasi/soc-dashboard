const express = require('express');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();

// Enable the server to read JSON data sent from the webpage
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Initialize the Gemini API client
// Securely supply your API key here, or use process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: "YOUR_GEMINI_API_KEY_HERE" });

// API Endpoint to handle questions from the frontend
app.post('/api/ask', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // Calling the recommended gemini-2.5-flash model
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ text: response.text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Failed to communicate with Gemini.' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
