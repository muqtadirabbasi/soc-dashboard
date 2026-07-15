const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 8080; // Azure dynamically maps the port using process.env.PORT

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Serve static assets out of the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Secure backend API bridge endpoint to fetch LLM responses
app.post('/api/chat', async (req, res) => {
    try {
        const { message, context } = req.body;
        
        // Grab the key securely injected by Azure's environment variables
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Configuration Error: GEMINI_API_KEY is not defined on the server." });
        }

        // Initialize Google AI with the secure key
        const genAI = new GoogleGenerativeAI(apiKey);
        // Using the robust 1.5-flash model optimized for rapid text operations
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Construct a contextual prompt for your SOC workflow
        const systemContext = `You are a specialized SOC Analyst Assistant called the Gemini AI Master. 
Context from selected dashboard frame: ${context || 'No specific dashboard frame selected.'}
Respond to the analyst's question professionally, objectively, and accurately.`;

        const fullPrompt = `${systemContext}\n\nAnalyst Question: ${message}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        return res.json({ response: text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return res.status(500).json({ error: "Failed to communicate with the Gemini AI Master engine." });
    }
});

// Fallback to route all web traffic to your main dashboard index page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`SOC Application server running on port ${PORT}`);
});